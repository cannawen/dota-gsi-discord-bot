import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import Voice = require("@discordjs/voice");

export default new Rule(
    rules.effect.playInterruptingAudio,
    [
        topics.effect.playInterruptingAudioFile,
        topics.discord.discordSubscriptionTopic,
    ],
    (get) => {
        const file = get(topics.effect.playInterruptingAudioFile)!;
        const subscription = get(topics.discord.discordSubscriptionTopic)!;

        subscription.player.play(Voice.createAudioResource(file));
        return new Fact(topics.effect.playInterruptingAudioFile, undefined);
    }
);
