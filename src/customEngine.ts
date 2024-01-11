import PersistentFactStore, {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import analytics from "./analytics/analytics";
import { DeepReadonly } from "ts-essentials";
import effectConfig from "./effectConfigManager";
import Engine from "./engine/Engine";
import Fact from "./engine/Fact";
import log from "./log";
import persistence from "./persistence";
import Rule from "./engine/Rule";
import time from "./assistants/helpers/time";
import Topic from "./engine/Topic";
import topics from "./topics";
import EffectConfig from "./effects/EffectConfig";

function getSavedDataOrDeleteDataIfInvalid(studentId: string) {
    const savedPersistenceString = persistence.readStudentData(studentId);
    if (savedPersistenceString) {
        try {
            return plainObjectToFacts(JSON.parse(savedPersistenceString));
        } catch (error) {
            persistence.deleteStudentData(studentId);
        }
    }
}

export class CustomEngine extends Engine {
    private sessions: Map<string, PersistentFactStore> = new Map();

    public isCoaching(studentId: string) {
        return this.sessions.get(studentId) !== undefined;
    }

    public getSessions() {
        return this.sessions as Map<string, PersistentFactStore>;
    }

    public getSession(studentId: string) {
        return this.sessions.get(studentId) as
            | DeepReadonly<PersistentFactStore>
            | undefined;
    }

    public setFact<T>(studentId: string | null | undefined, fact: Fact<T>) {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                this.set(db, fact);
            }
        }
    }

    public getFactValue<T>(
        studentId: string | null | undefined,
        topic: Topic<T>
    ): T | undefined {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                return Engine.get(db, topic);
            }
        }
    }

    // eslint-disable-next-line max-statements, max-lines-per-function
    public startCoachingSession(
        studentId: string,
        guildIdIn?: string,
        channelIdIn?: string
    ) {
        let guildId = guildIdIn;
        let channelId = channelIdIn;

        const oldDb = this.sessions.get(studentId);
        const db = oldDb || new PersistentFactStore();

        if (oldDb) {
            log.info(
                "app",
                "Updating discord channel info for student %s",
                studentId.substring(0, 10)
            );
            guildId = guildId || oldDb.get(topics.discordGuildId) || undefined;
            channelId =
                channelId ||
                oldDb.get(topics.discordGuildChannelId) ||
                undefined;
        } else {
            log.info(
                "app",
                "Start coaching student %s",
                studentId.substring(0, 10)
            );
            const data = getSavedDataOrDeleteDataIfInvalid(studentId);

            // Set default config and overwrite any with saved configs
            effectConfig.defaultConfigFacts().map((fact) => this.set(db, fact));
            if (data) {
                data.map((fact) => this.set(db, fact));
            }

            // Create new db for student
            this.set(db, new Fact(topics.studentId, studentId));
            this.set(db, new Fact(topics.timestamp, time.nowUnix()));

            // Add to engine's active sessions
            this.sessions.set(studentId, db);
        }

        // explicitly set null to propogate to discordAudioEnabled state downstream
        this.set(db, new Fact(topics.discordGuildId, guildId || null));
        this.set(db, new Fact(topics.discordGuildChannelId, channelId || null));
    }

    public deleteSessionForGuild(guildId: string) {
        [...this.sessions.values()].forEach((factStore) => {
            if (factStore.get(topics.discordGuildId) === guildId) {
                this.deleteSession(factStore.get(topics.studentId)!);
            }
        });
    }

    public deleteSession(studentId: string) {
        const db = this.sessions.get(studentId);
        if (db) {
            log.info(
                "app",
                "Deleting session for student %s",
                studentId.substring(0, 10)
            );
            try {
                Engine.get(
                    db,
                    topics.discordSubscriptionTopic
                )?.connection.destroy();
            } catch (error) {}
            if (db.get(topics.saveFactsAfterSession)) {
                const facts = factsToPlainObject(
                    db.getPersistentForeverFacts()
                );
                if (Object.keys(facts).length > 0) {
                    log.debug(
                        "app",
                        "Saving forever facts %s for student %s",
                        facts,
                        studentId.substring(0, 10)
                    );

                    persistence.saveStudentData(
                        studentId,
                        JSON.stringify(facts)
                    );
                }
            }
            this.sessions.delete(studentId);
        }
    }

    // TODO test
    public deleteOldSessions() {
        Array.from(this.sessions.entries())
            .filter(([_, db]) => {
                const currentTime = Date.now() / 1000;
                const lastInteractionTime = Engine.get(db, topics.timestamp)!;
                const oneHour = 60 * 60;

                return currentTime - lastInteractionTime > oneHour;
            })
            .forEach(([studentId, _]) => this.deleteSession(studentId));
    }
}

const engine = new CustomEngine();

engine.register(
    new Rule({
        label: "engine/reset_state_across_game",
        trigger: [topics.inGame, topics.studentId],
        given: [topics.gsiEventsFromLiveGame],
        then: ([inGame, studentId], [live]) => {
            if (!inGame) {
                engine.getSession(studentId)?.clearFactsToPrepareForNewGame();
            }

            if (live) {
                if (inGame) {
                    analytics.trackStartGame(studentId);
                } else {
                    // This is a bit sketchy because we start the coaching session with inGame being false
                    // During the drafting phase or pre 0 second horn so this isn't exactly tracking the end of game
                    analytics.trackEndGame(studentId);
                }
            }
        },
    })
);

export default engine;
