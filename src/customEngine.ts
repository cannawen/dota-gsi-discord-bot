import Engine from "./classes/engine/Engine";
import Fact from "./classes/engine/Fact";
import GsiData from "./gsi/GsiData";
import topic from "./topic";

class CustomEngine extends Engine {
    public setGsi(studentId: string | null, data: GsiData) {
        if (studentId && this.shouldCoachStudent(studentId)) {
            // Make a new db here specifically for this student
            this.set(new Fact(topic.gsiData, data));
        }
    }

    public setDiscordBotSecretKey(key: string) {
        this.set(new Fact(topic.discordBotSecret, key));
    }

    public readyToPlayAudio(ready: boolean) {
        this.set(new Fact(topic.discordReadyToPlayAudio, ready));
    }

    public startCoachingSession(
        studentId: string,
        guildId: string,
        channelId: string
    ) {
        this.set(new Fact(topic.registerStudentId, studentId));
        this.set(new Fact(topic.discordGuildId, guildId));
        this.set(new Fact(topic.discordGuildChannelId, channelId));
    }

    public stopCoachingSession(studentId: string) {
        this.set(new Fact(topic.unregisterStudentId, studentId));
    }

    public shouldCoachStudent(studentId: string) {
        return (
            this.db.get(topic.currentlyCoachedStudentIds)?.has(studentId) ||
            false
        );
    }
}

const engine = new CustomEngine();

export default engine;
