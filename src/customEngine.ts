import PersistentFactStore, {
    factsToPlainObject,
    plainObjectToFacts,
} from "./engine/PersistentFactStore";
import { DeepReadonly } from "ts-essentials";
import effectConfig from "./effectConfigManager";
import Engine from "./engine/Engine";
import Fact from "./engine/Fact";
import log from "./log";
import persistence from "./persistence";
import Rule from "./engine/Rule";
import Topic from "./engine/Topic";
import topics from "./topics";

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
    private channelIdToStudentId: Map<string, string> = new Map();

    public getSessions() {
        return this.sessions as DeepReadonly<Map<string, PersistentFactStore>>;
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

    public updateChannelUtterance(channelId: string, utterance: string) {
        const studentId = this.channelIdToStudentId.get(channelId);
        this.setFact(
            studentId,
            new Fact(topics.lastDiscordUtterance, utterance)
        );
    }

    public getFactValue<T>(
        studentId: string | null,
        topic: Topic<T>
    ): T | void {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                return db.get(topic);
            }
        }
    }

    public startCoachingSession(
        studentId: string,
        guildId?: string,
        channelId?: string
    ) {
        log.info(
            "app",
            "Start coaching student %s",
            studentId.substring(0, 10)
        );
        // TODO there may be something better than straight up deleting and re-creating the entire session
        if (this.sessions.get(studentId)) {
            this.deleteSession(studentId);
        }

        // Create new db for student
        const db = new PersistentFactStore();
        this.set(db, new Fact(topics.studentId, studentId));
        this.set(db, new Fact(topics.timestamp, Math.floor(Date.now() / 1000))); // TODO test

        // Check to see if we have saved data
        // If we cannot get saved data due to an error,
        // Assume our preference topics have been updated
        // And nuke entire save file
        // TODO there is probably a more graceful way to handle this
        const data = getSavedDataOrDeleteDataIfInvalid(studentId);

        // Set default config and overwrite any with saved configs
        effectConfig.defaultConfigs().map((fact) => this.set(db, fact));
        if (data) {
            data.map((fact) => this.set(db, fact));
        }

        // Add to engine's active sessions
        this.sessions.set(studentId, db);
        if (channelId) {
            this.channelIdToStudentId.set(channelId, studentId);
        }

        // Set guild or channel id
        // or null if not provided so we explicitly propogate the null information downstream
        // to set the discordEnabled state
        this.set(db, new Fact(topics.discordGuildId, guildId || null));
        this.set(db, new Fact(topics.discordGuildChannelId, channelId || null));
    }

    public deleteSession(studentId: string) {
        const db = this.sessions.get(studentId);
        if (db) {
            log.info(
                "app",
                "Deleting session for student %s",
                studentId.substring(0, 10)
            );
            const channelId = db.get(topics.discordGuildChannelId);
            if (channelId) {
                this.channelIdToStudentId.delete(channelId);
            }
            try {
                db.get(topics.discordSubscriptionTopic)?.connection.destroy();
            } catch (error) {}
            const facts = factsToPlainObject(db.getPersistentForeverFacts());

            log.debug(
                "app",
                "Saving forever facts %s for student %s",
                facts,
                studentId.substring(0, 10)
            );

            persistence.saveStudentData(studentId, JSON.stringify(facts));
            this.sessions.delete(studentId);
        }
    }

    // TODO test
    public deleteOldSessions() {
        Array.from(this.sessions.entries())
            .filter(([_, db]) => {
                const currentTime = Date.now() / 1000;
                const lastInteractionTime = db.get(topics.timestamp)!;
                const oneHour = 60 * 60;

                return currentTime - lastInteractionTime > oneHour;
            })
            .forEach(([studentId, _]) => this.deleteSession(studentId));
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
                engine
                    .getSession(studentId)
                    ?.updatePersistentFactsAcrossGames();
            }
        }
    )
);

export default engine;
