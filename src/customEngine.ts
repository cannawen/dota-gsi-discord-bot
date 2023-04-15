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

export class CustomEngine extends Engine {
    private sessions: Map<string, PersistentFactStore> = new Map();

    public getSessions() {
        return this.sessions as DeepReadonly<Map<string, PersistentFactStore>>;
    }

    public getSession(studentId: string) {
        return this.sessions.get(studentId) as
            | DeepReadonly<PersistentFactStore>
            | undefined;
    }

    public setFact<T>(studentId: string | null, fact: Fact<T>) {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                this.set(db, fact);
            }
        }
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
        const existingSession = this.getSession(studentId);
        if (existingSession) {
            existingSession
                .get(topics.discordSubscriptionTopic)
                ?.connection.destroy();
        }
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
            effectConfig.defaultConfigs().map((fact) => this.set(db, fact));
        }

        // Add to engine's active sessions
        this.sessions.set(studentId, db);

        if (guildId) {
            this.set(db, new Fact(topics.discordGuildId, guildId));
        }
        if (channelId) {
            this.set(db, new Fact(topics.discordGuildChannelId, channelId));
        }
    }

    public deleteSession(studentId: string) {
        const db = this.sessions.get(studentId);
        if (db) {
            const facts = factsToPlainObject(db.getPersistentForeverFacts());

            log.debug(
                "app",
                "Saving forever facts %s for student %s",
                facts,
                studentId
            );

            persistence.saveStudentData(studentId, JSON.stringify(facts));
            log.info("rules", "Deleting database for student %s", studentId);
            this.sessions.delete(studentId);
        }
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
