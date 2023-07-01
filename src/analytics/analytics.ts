import { CacheType, ChatInputCommandInteraction } from "discord.js";
import helpers from "../discord/discordHelpers";
import Mixpanel from "mixpanel";

const mixpanel = Mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN || "");

function trackInteraction(interaction: ChatInputCommandInteraction<CacheType>) {
    const userId = interaction.user.id;
    const studentId = helpers.studentId(userId);

    mixpanel.track(`/${interaction.commandName}`, {
        distinct_id: interaction.user.id,
    });
    mixpanel.people.set(userId, {
        $first_name: interaction.user.username,
        studentId: studentId,
    });
}

function startApp() {
    mixpanel.track("app started");
}

export default { startApp, trackInteraction };
