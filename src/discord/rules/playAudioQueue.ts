import colors from "@colors/colors";
import Fact from "../../engine/Fact";
import helper from "../../assistants/helpers/timeFormatting";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import topics from "../../topics";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;

export default new Rule({
    label: rules.discord.playNext,
    trigger: [
        topics.discordReadyToPlayAudio,
        topics.publicAudioQueue,
        topics.discordSubscriptionTopic,
    ],
    given: [topics.time, topics.studentId],
    then: ([ready, queue, subscription], [time, studentId]) => {
        const audioQueue = [...queue];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.shift();
            log.info(
                "discord",
                "%s - Playing %s for student %s",
                helper.secondsToTimeString(time || 0),
                emColor(filePath),
                studentId?.substring(0, 10)
            );
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return new Fact(topics.publicAudioQueue, audioQueue);
        }
    },
});
