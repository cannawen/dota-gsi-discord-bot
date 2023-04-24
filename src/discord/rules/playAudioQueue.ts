import colors from "@colors/colors";
import Fact from "../../engine/Fact";
import helper from "../../assistants/assistantHelpers";
import log from "../../log";
import Rule from "../../engine/Rule";
import rules from "../../rules";
import topics from "../../topics";
import Voice = require("@discordjs/voice");

const emColor = colors.cyan;

export default new Rule(
    rules.discord.playNext,
    [
        topics.discordReadyToPlayAudio,
        topics.publicAudioQueue,
        topics.discordSubscriptionTopic,
    ],
    (get) => {
        const ready = get(topics.discordReadyToPlayAudio)!;
        const subscription = get(topics.discordSubscriptionTopic)!;
        const audioQueue = [...get(topics.publicAudioQueue)!];

        if (ready && audioQueue.length > 0) {
            const filePath = audioQueue.splice(0, 1)[0];
            log.info(
                "discord",
                "%s - Playing %s for student %s",
                helper.secondsToTimeString(get(topics.time) || 0),
                emColor(filePath),
                get(topics.studentId)?.substring(0, 10)
            );
            const resource = Voice.createAudioResource(filePath);
            subscription.player.play(resource);
            return new Fact(topics.publicAudioQueue, audioQueue);
        }
    }
);
