import Engine from "./classes/engine/Engine";
import Fact from "./classes/engine/Fact";
import FactStore from "./classes/engine/FactStore";
import GsiData from "./gsi/GsiData";
import log from "./log";
import topic from "./topic";

class CustomEngine extends Engine {
    private sessions: Map<string, FactStore> = new Map();

    private withDb(
        studentId: string | null,
        effectFn: (db: FactStore) => void
    ) {
        if (studentId) {
            const db = this.sessions.get(studentId);
            if (db) {
                effectFn(db);
            }
        }
    }

    public setGsi(studentId: string | null, data: GsiData) {
        this.withDb(studentId, (db) =>
            this.set(db, new Fact(topic.gsiData, data))
        );
    }

    public readyToPlayAudio(studentId: string, ready: boolean) {
        this.withDb(studentId, (db) =>
            this.set(db, new Fact(topic.discordReadyToPlayAudio, ready))
        );
    }

    public startCoachingSession(
        studentId: string,
        guildId: string,
        channelId: string
    ) {
        this.sessions.set(studentId, new FactStore());
        this.withDb(studentId, (db) => {
            this.set(db, new Fact(topic.studentId, studentId));
            this.set(db, new Fact(topic.discordGuildId, guildId));
            this.set(db, new Fact(topic.discordGuildChannelId, channelId));
        });
    }

    public stopCoachingSession(studentId: string) {
        this.withDb(studentId, (db) => {
            const subscription = db.get(topic.discordSubscriptionTopic);
            subscription?.connection.destroy();
        });
    }

    public lostVoiceConnection(studentId: string) {
        log.info("rules", "Deleting database for student %s", studentId);
        this.sessions.delete(studentId);
    }
}

const engine = new CustomEngine();

export default engine;
