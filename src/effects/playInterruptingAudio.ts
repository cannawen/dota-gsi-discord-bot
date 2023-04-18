import Fact from "../engine/Fact";
import log from "../log";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import Voice = require("@discordjs/voice");

export default new Rule(
    rules.effect.playInterruptingAudio,
    [
        topics.playInterruptingAudioFile,
        topics.discordSubscriptionTopic,
        topics.discordAudioEnabled,
    ],
    (get) => {
        if (get(topics.discordAudioEnabled)!) {
            const file = get(topics.playInterruptingAudioFile)!;
            const subscription = get(topics.discordSubscriptionTopic)!;
            log.info(
                "discord",
                "Playing interrupting audio %s for student %s",
                file.magenta,
                get(topics.studentId)?.substring(0, 10)
            );

            subscription.player.play(Voice.createAudioResource(file));
        }
        return new Fact(topics.playInterruptingAudioFile, undefined);
    }
);
