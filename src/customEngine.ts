import Config from "./configTopics";
import { configDb } from "./configTopics";
import Engine from "./engine/Engine";
import Fact from "./engine/Fact";
import FactStore from "./engine/FactStore";
import fs from "fs";
import GsiData from "./gsi/GsiData";
import log from "./log";
import path from "path";
import persistence from "./persistence";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

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
            const existingGuildId = db.get(topics.discordGuildId);
            const existingChannelId = db.get(topics.discordGuildChannelId);
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
        log.verbose(
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
            this.set(db, new Fact(topics.allData, data))
        );
    }

    public readyToPlayAudio(studentId: string, ready: boolean) {
        this.withDb(studentId, (db) =>
            this.set(db, new Fact(topics.discordReadyToPlayAudio, ready))
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

            this.set(db, new Fact(topics.discordGuildId, guildId));
            this.set(db, new Fact(topics.discordGuildChannelId, channelId));

            this.register(
                new Rule(
                    "engine/reset_state_across_game",
                    [topics.inGame],
                    (get) => {
                        const inGame = get(topics.inGame)!;
                        if (!inGame) {
                            db.removeNonPersistentGameState();
                        }
                    }
                )
            );
        });
    }

    public stopCoachingSession(studentId: string) {
        log.info("app", "Stop coaching command %s", studentId);
        this.withDb(studentId, (db) => {
            const subscription = db.get(topics.discordSubscriptionTopic);
            if (subscription) {
                log.info(
                    "discord",
                    "Destroying subscription for %s",
                    studentId
                );
                subscription?.connection.destroy();
            } else {
                log.error(
                    "discord",
                    "Student %s has no active voice subscription",
                    studentId
                );
            }
        });
    }

    public lostVoiceConnection(studentId: string) {
        log.info("rules", "Deleting database for student %s", studentId);
        this.sessions.delete(studentId);
    }

    public handleNextPrivateAudio(studentId: string) {
        return this.withDb(studentId, (db) => {
            const queue = db.get(topics.privateAudioQueue);
            if (queue && queue.length > 0) {
                const newQueue = [...queue];
                const nextFile = newQueue.pop()!;
                db.set(new Fact(topics.privateAudioQueue, newQueue));
                return nextFile;
            }
        }) as string | void;
    }

    public notifyStartup() {
        const dataString = persistence.readData() || "{}";
        const data = JSON.parse(dataString) as {
            [key: string]: { [key: string]: unknown };
        };

        Object.entries(data).forEach(([key, value]) => {
            const db = new FactStore();
            this.sessions.set(key, db);
            db.setPersistentFactsAcrossRestarts(value);
            this.processAllRules(db);
        });
    }

    public notifyShutdown() {
        return new Promise<void>((res, rej) => {
            const allData: { [key: string]: unknown } = {};
            this.sessions.forEach((db, studentId) => {
                allData[studentId] = db.getPersistentFactsAcrossRestarts();
                log.info("app", "Notify %s of shutdown", studentId);
                this.set(
                    db,
                    new Fact(
                        topics.playInterruptingAudioFile,
                        "resources/audio/restart.mp3"
                    )
                );
            });

            const expectedReadyCount = this.sessions.size;
            if (expectedReadyCount === 0) {
                res();
            }
            let readyCount = 0;

            this.register(
                new Rule(
                    "wait for all audio to be done playing",
                    [topics.discordReadyToPlayAudio],
                    (get) => {
                        if (get(topics.discordReadyToPlayAudio)!) {
                            readyCount++;
                            log.info(
                                "app",
                                "Finished notifying %s of shutdown",
                                get(topics.studentId)
                            );
                        }
                        if (readyCount === expectedReadyCount) {
                            res();
                        }
                    }
                )
            );

            persistence.saveData(JSON.stringify(allData));
        }).then(() => {
            Array.from(this.sessions.keys()).forEach((id) =>
                this.stopCoachingSession(id)
            );
        });
    }

    public stopAudio(studentId: string) {
        this.withDb(studentId, (db) => {
            this.set(db, new Fact(topics.stopAudio, true));
            this.set(db, new Fact(topics.privateAudioQueue, undefined));
            this.set(db, new Fact(topics.publicAudioQueue, undefined));
        });
    }
}

const engine = new CustomEngine();

export default engine;
