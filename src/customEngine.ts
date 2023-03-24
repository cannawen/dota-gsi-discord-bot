import Engine from "./classes/engine/Engine";
import Fact from "./classes/engine/Fact";
import GsiData from "./gsi/GsiData";
import topic from "./topic";

class CustomEngine extends Engine {
    public setGsi(data: GsiData) {
        this.set(new Fact(topic.gsiData, data));
    }

    public setDiscordBotSecretKey(key: string) {
        this.set(new Fact(topic.discordBotSecret, key));
    }

    public setDiscordBotGuildIdAndChannelId(
        guildId: string,
        channelId: string
    ) {
        this.set(new Fact(topic.discordGuildId, guildId));
        this.set(new Fact(topic.discordGuildChannelId, channelId));
    }

    public readyToPlayAudio(ready: boolean) {
        this.set(new Fact(topic.discordReadyToPlayAudio, ready));
    }
}

const engine = new CustomEngine();

export default engine;
