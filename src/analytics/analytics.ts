import { CacheType, ChatInputCommandInteraction } from "discord.js";
import helpers from "../discord/discordHelpers";
import Mixpanel from "mixpanel";

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN || "");

function trackInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    const userId = interaction.user.id;
    const studentId = helpers.studentId(userId);

    mixpanel.track(`/${interaction.commandName}`, {
        distinct_id: studentId,
    });
    mixpanel.people.set(studentId, {
        $first_name: interaction.user.username,
        userId: userId,
    });
}

function startApp() {
    mixpanel.track("app started");
}

export default { startApp, trackInteraction };
