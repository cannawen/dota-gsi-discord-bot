import Config from "./configTopics";
import { configDb } from "./configTopics";
import Engine from "./engine/Engine";
import Fact from "./engine/Fact";
import FactStore from "./engine/FactStore";
import fs from "fs";
import GsiData from "./gsi/GsiData";
import log from "./log";
import path from "path";
import Topic from "./engine/Topic";
import topics from "./topics";
import persistence from "./persistence";

class CustomEngine extends Engine {
    private sessions: Map<string, FactStore> = new Map();

    private withDb(
        studentId: string | null,
        effectFn: (db: FactStore) => unknown
    ) {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                return effectFn(db);
            }
        }
    }

    private alreadyConnectedToVoiceChannel(guildId: string, channelId: string) {
        return Object.entries(this.sessions).reduce((memo, [_, db]) => {
            const existingGuildId = db.get(topics.discord.discordGuildId);
            const existingChannelId = db.get(
                topics.discord.discordGuildChannelId
            );
            return (
                memo ||
                (existingGuildId === guildId && existingChannelId === channelId)
            );
        }, false);
    }

    private setDefaultAssistantConfig(
        studentId: string,
        publicAnnouncementsOn: boolean
    ) {
        const dirPath = path.join(__dirname, "assistants");
        fs.readdirSync(dirPath)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .map((file) => path.join(dirPath, file))
            .map((filePath) => require(filePath))
            .forEach((module) => {
                const topic = module.configTopic as Topic<Config>;
                const config = module.defaultConfig as Config;
                if (
                    !publicAnnouncementsOn &&
                    (config === Config.PUBLIC ||
                        config === Config.PUBLIC_INTERRUPTING)
                ) {
                    log.info(
                        "rules",
                        "Not setting public announcement %s for %s",
                        topic.label,
                        studentId
                    );
                } else if (topic && config) {
                    this.setConfig(studentId, topic, config);
                } else {
                    log.error(
                        "rules",
                        "No default configuration for %s",
                        topic.label
                    );
                }
            });
    }

    private setConfig(studentId: string, topic: Topic<Config>, config: Config) {
        log.info(
            "rules",
            "Setting config %s for topic %s, studentId %s",
            config.yellow,
            topic.label.yellow,
            studentId
        );
        this.withDb(studentId, (db) => this.set(db, new Fact(topic, config)));
    }

    public changeConfig(studentId: string, topicLabel: string, effect: string) {
        log.info(
            "rules",
            "Changing %s rule to %s for %s",
            topicLabel.yellow,
            effect.yellow,
            studentId
        );

        const topic = configDb.get(topicLabel)!;

        let safeEffect;
        if (effect === Config.PUBLIC) {
            safeEffect = Config.PUBLIC;
        } else if (effect === Config.PRIVATE) {
            safeEffect = Config.PRIVATE;
        } else if (effect === Config.NONE) {
            safeEffect = Config.NONE;
        } else {
            log.error(
                "app",
                "Cannot configure rule %s to effect %s for student %s. Defaulting to NONE",
                topicLabel,
                effect,
                studentId
            );
        }

        this.setConfig(studentId, topic, safeEffect || Config.NONE);
    }

    public getConfig(studentId: string, topic: Topic<Config>) {
        return this.withDb(studentId, (db) => db.get(topic)) as
            | Config
            | undefined;
    }

    public pollConfigUpdateAndReset(studentId: string) {
        return this.withDb(studentId, (db) => {
            if (db.get(topics.configUpdated)) {
                this.set(db, new Fact(topics.configUpdated, undefined));
                return true;
            } else {
                return false;
            }
        });
    }

    public setGsi(studentId: string | null, data: GsiData) {
        this.withDb(studentId, (db) =>
            this.set(db, new Fact(topics.gsi.allData, data))
        );
    }

    public readyToPlayAudio(studentId: string, ready: boolean) {
        this.withDb(studentId, (db) =>
            this.set(
                db,
                new Fact(topics.discord.discordReadyToPlayAudio, ready)
            )
        );
    }

    public startCoachingSession(
        studentId: string,
        guildId: string,
        channelId: string
    ) {
        this.sessions.set(studentId, new FactStore());
        this.withDb(studentId, (db) => {
            this.set(db, new Fact(topics.studentId, studentId));

            if (this.alreadyConnectedToVoiceChannel(guildId, channelId)) {
                // If already connected, disable public assistant annoucnements
                this.setDefaultAssistantConfig(studentId, false);
            } else {
                this.setDefaultAssistantConfig(studentId, true);
            }

            this.set(db, new Fact(topics.discord.discordGuildId, guildId));
            this.set(
                db,
                new Fact(topics.discord.discordGuildChannelId, channelId)
            );
        });
    }

    public stopCoachingSession(studentId: string) {
        this.withDb(studentId, (db) => {
            const subscription = db.get(
                topics.discord.discordSubscriptionTopic
            );
            subscription?.connection.destroy();
        });
    }

    public lostVoiceConnection(studentId: string) {
        log.info("rules", "Deleting database for student %s", studentId);
        this.sessions.delete(studentId);
    }

    public handleNextPrivateAudio(studentId: string) {
        return this.withDb(studentId, (db) => {
            const queue = db.get(topics.effect.privateAudioQueue);
            if (queue && queue.length > 0) {
                const newQueue = [...queue];
                const nextFile = newQueue.pop()!;
                db.set(new Fact(topics.effect.privateAudioQueue, newQueue));
                return nextFile;
            }
        }) as string | void;
    }

    public notifyStartup() {
        persistence.readData().then(() => {
            console.log("started up!");
        });
    }

    public async notifyRestart() {
        await persistence.persistData();
        this.sessions.forEach((db, studentId) => {
            log.info("app", "Notify %s of restart", studentId);
            this.set(
                db,
                new Fact(
                    topics.effect.playInterruptingAudioFile,
                    "resources/audio/restart.mp3"
                )
            );
        });
    }
}

const engine = new CustomEngine();

export default engine;
