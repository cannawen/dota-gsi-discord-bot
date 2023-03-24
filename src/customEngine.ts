import { Engine, Fact } from "./Engine";
import GsiData from "./gsi/GsiData";
import topics from "./topics";

class CustomEngine extends Engine {
    public setGsi(data: GsiData) {
        this.set(new Fact(topics.gsiData, data));
    }

    public setDiscordBotSecretKey(key: string) {
        this.set(new Fact(topics.discordBotSecret, key));
    }

    public setDiscordBotGuildIdAndChannelId(
        guildId: string,
        channelId: string
    ) {
        this.set(new Fact(topics.discordGuildId, guildId));
        this.set(new Fact(topics.discordGuildChannelId, channelId));
    }

    public readyToPlayAudio(ready: boolean) {
        this.set(new Fact(topics.discordReadyToPlayAudio, ready));
    }
}

const engine = new CustomEngine();

export default engine;
