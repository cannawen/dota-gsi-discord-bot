import Fact from "../engine/Fact";
import log from "../log";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";
import Voice = require("@discordjs/voice");

export default new Rule({
    label: rules.effect.playInterruptingAudio,
    trigger: [
        topics.discordAudioEnabled,
        topics.discordSubscriptionTopic,
        topics.playInterruptingAudioFile,
    ],
    given: [topics.studentId],
    then: ([audioEnabled, subscription, file], [studentId]) => {
        if (audioEnabled) {
            log.info(
                "discord",
                "Playing interrupting audio %s for student %s",
                file.magenta,
                studentId?.substring(0, 10)
            );

            subscription.player.play(Voice.createAudioResource(file));
        }
        return new Fact(topics.playInterruptingAudioFile, undefined);
    },
});
