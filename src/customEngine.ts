import PersistentFactStore, {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import EffectConfig from "./EffectConfig";
import Engine from "./engine/Engine";
import Fact from "./engine/Fact";
import fs from "fs";
import GsiData from "./gsi/GsiData";
import log from "./log";
import path from "path";
import persistence from "./persistence";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topicManager from "./engine/topicManager";
import topics from "./topics";

function defaultConfigs(): Fact<EffectConfig>[] {
    const dirPath = path.join(__dirname, "assistants");

    return fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .map((file) => path.join(dirPath, file))
        .map((filePath) => require(filePath))
        .reduce((memo, module) => {
            const topic = module.configTopic as Topic<EffectConfig>;
            const config = module.defaultConfig as EffectConfig;
            memo.push(new Fact(topic, config));
            return memo;
        }, []);
}

class CustomEngine extends Engine {
    private sessions: Map<string, PersistentFactStore> = new Map();

    // THIS IS FOR DEBUGGING ONLY
    public saveState() {
        this.storePersistentFactsAcrossRestarts();
    }
    // THIS IS FOR DEBUGGING ONLY
    public readState() {
        this.handleStartup();
    }
    // END DEBUGGING CODE

    private createFactStoreForStudent(studentId: string) {
        const db = new PersistentFactStore();
        this.set(db, new Fact(topics.studentId, studentId));

        const savedPersistenceString = persistence.readStudentData(studentId);

        if (savedPersistenceString) {
            // User has started this app before; use saved values
            plainObjectToFacts(JSON.parse(savedPersistenceString)).forEach(
                (fact) => this.set(db, fact)
            );
        } else {
            // User has not used the app before; set default values
            defaultConfigs().map((fact) => this.set(db, fact));
        }

        // Add to engine's active sessions
        this.sessions.set(studentId, db);

        return db;
    }

    private withDb(
        studentId: string | null,
        effectFn: (db: PersistentFactStore) => unknown
    ) {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                return effectFn(db);
            }
        } else {
            log.error("rules", "no db found for student %s", studentId);
        }
    }

    public alreadyConnectedToVoiceChannel(guildId: string, channelId: string) {
        return Array.from(this.sessions.values()).reduce((memo, db) => {
            const existingGuildId = db.get(topics.discordGuildId);
            const existingChannelId = db.get(topics.discordGuildChannelId);
            return (
                memo ||
                (existingGuildId === guildId && existingChannelId === channelId)
            );
        }, false);
    }

    public isDiscordEnabled(studentId: string): boolean {
        return this.withDb(
            studentId,
            (db) => db.get(topics.discordAudioEnabled)!
        ) as boolean;
    }

    public changeConfig(studentId: string, topicLabel: string, effect: string) {
        const topic = topicManager.findTopic<EffectConfig>(topicLabel);

        let safeEffect: EffectConfig;
        if (effect === EffectConfig.PUBLIC) {
            safeEffect = EffectConfig.PUBLIC;
        } else if (effect === EffectConfig.PRIVATE) {
            safeEffect = EffectConfig.PRIVATE;
        } else if (effect === EffectConfig.NONE) {
            safeEffect = EffectConfig.NONE;
        } else {
            log.error(
                "app",
                "Cannot configure rule %s to effect %s for student %s. Defaulting to NONE",
                topicLabel,
                effect,
                studentId
            );
            safeEffect = EffectConfig.NONE;
        }

        log.verbose(
            "rules",
            "Setting topic %s for config %s, studentId %s",
            topic.label.yellow,
            safeEffect.yellow,
            studentId
        );

        this.withDb(studentId, (db) =>
            this.set(db, new Fact(topic, safeEffect))
        );
    }

    public getEffectConfigs(studentId: string) {
        return this.withDb(studentId, (db) =>
            topicManager
                .getConfigTopics()
                .map((topic) => [topic.label, db.get(topic)])
        );
    }

    public resetConfig(studentId: string) {
        this.withDb(studentId, (db) => {
            defaultConfigs().map((fact) => this.set(db, fact));
        });
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
        guildId?: string,
        channelId?: string
    ) {
        const db = this.createFactStoreForStudent(studentId);

        if (guildId) {
            this.set(db, new Fact(topics.discordGuildId, guildId));
        }
        if (channelId) {
            this.set(db, new Fact(topics.discordGuildChannelId, channelId));
        }
    }

    public cleanupSession(studentId: string) {
        this.withDb(studentId, (db) => {
            const facts = factsToPlainObject(db.getPersistentForeverFacts());

            log.debug(
                "app",
                "Saving forever facts %s for student %s",
                facts,
                studentId
            );

            persistence.saveStudentData(studentId, JSON.stringify(facts));
        });
        log.info("rules", "Deleting database for student %s", studentId);
        this.sessions.delete(studentId);
    }

    public handleNextPrivateAudio(studentId: string) {
        return this.withDb(studentId, (db) => {
            const queue = db.get(topics.privateAudioQueue);
            if (queue && queue.length > 0) {
                const newQueue = [...queue];
                const nextFile = newQueue.pop()!;
                this.set(db, new Fact(topics.privateAudioQueue, newQueue));
                return nextFile;
            }
        }) as string | void;
    }

    public handleStartup() {
        const dataString = persistence.readRestartData() || "{}";
        const data = JSON.parse(dataString) as {
            [key: string]: { [key: string]: unknown };
        };

        Object.entries(data).forEach(([studentId, studentData]) => {
            this.startCoachingSession(studentId);
            this.withDb(studentId, (db) => {
                plainObjectToFacts(studentData).map((fact) =>
                    this.set(db, fact)
                );
            });
        });
    }

    private storePersistentFactsAcrossRestarts() {
        const allData: { [key: string]: { [key: string]: unknown } } = {};
        this.sessions.forEach((db, studentId) => {
            allData[studentId] = factsToPlainObject(
                db.getPersistentFactsAcrossRestarts()
            );
        });
        persistence.saveRestartData(JSON.stringify(allData));
    }

    public handleShutdown() {
        this.storePersistentFactsAcrossRestarts();
        return new Promise<void>((resolve) => {
            let expectedReadyCount = 0;
            this.sessions.forEach((db, studentId) => {
                log.info("app", "Notify %s of shutdown", studentId);
                if (db.get(topics.discordAudioEnabled)) {
                    expectedReadyCount++;
                    this.set(
                        db,
                        new Fact(
                            topics.playInterruptingAudioFile,
                            "resources/audio/restart.mp3"
                        )
                    );
                }
            });
            if (expectedReadyCount === 0) {
                resolve();
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
                            resolve();
                        }
                    }
                )
            );
        }).then(() => {
            Array.from(this.sessions.keys()).forEach((studentId) => {
                this.cleanupSession(studentId);
            });
        });
    }

    public stopAudio(studentId: string) {
        this.withDb(studentId, (db) => {
            this.set(db, new Fact(topics.stopAudio, true));
            this.set(db, new Fact(topics.privateAudioQueue, undefined));
            this.set(db, new Fact(topics.publicAudioQueue, undefined));
        });
    }

    public noLongerInGame(studentId: string) {
        this.withDb(studentId, (db) => {
            db.updatePersistentFactsAcrossGames();
        });
    }
}

const engine = new CustomEngine();

engine.register(
    new Rule(
        "engine/reset_state_across_game",
        [topics.inGame, topics.studentId],
        (get) => {
            const inGame = get(topics.inGame)!;
            const studentId = get(topics.studentId)!;

            if (!inGame) {
                engine.noLongerInGame(studentId);
            }
        }
    )
);

export default engine;
