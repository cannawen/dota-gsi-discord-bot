import { CacheType, ChatInputCommandInteraction } from "discord.js";
import discordHelper from "../discord/discordHelpers";
import timeHelper from "../assistants/helpers/time";
import Mixpanel from "mixpanel";

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN || "");

function trackInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    const userId = interaction.user.id;
    const studentId = discordHelper.studentId(userId);

    mixpanel.track(`/${interaction.commandName}`, {
        distinct_id: studentId,
    });
    mixpanel.people.set(studentId, {
        $first_name: interaction.user.username,
        userId: userId,
    });
}

function trackStartApp() {
    mixpanel.track("app started");
}

function trackAudio(
    studentId: string,
    time: number,
    fileName: string,
    publicAudio: boolean
) {
    mixpanel.track("audio", {
        distinct_id: studentId,
        gametime: timeHelper.secondsToTimeString(time),
        audio: fileName,
        type: publicAudio ? "public" : "private",
    });
}

export default {
    trackAudio,
    trackInteraction,
    trackStartApp,
};
