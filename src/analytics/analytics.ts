import {
    CacheType,
    ChatInputCommandInteraction,
    GuildBasedChannel,
} from "discord.js";
import discordHelper from "../discord/discordHelpers";
import Mixpanel from "mixpanel";
import timeHelper from "../assistants/helpers/time";

// App will crash if mixpanel env variable is not set
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
    mixpanel.track("app started", { version: process.env.GIT_REVISION });
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

function trackDiscordConnectionInfo(
    studentId: string,
    channel: GuildBasedChannel
) {
    mixpanel.people.union(studentId, {
        // guild id is guaranteed to be unique, but less human-readable than guild name
        guildName: channel.guild.name,
    });
    mixpanel.track("join voice channel", {
        distinct_id: studentId,
        guildName: channel.guild.name,
        channelName: channel.name,
    });
    mixpanel.track("guild", {
        distinct_id: channel.guild.id,
        guildName: channel.guild.name,
    });
}

function trackStartGame(studentId: string) {
    mixpanel.track("start game", {
        distinct_id: studentId,
    });
    mixpanel.people.increment(studentId, "gamesCoached");
}

function trackEndGame(studentId: string) {
    mixpanel.track("end game", {
        distinct_id: studentId,
    });
}

export default {
    trackAudio,
    trackDiscordConnectionInfo,
    trackInteraction,
    trackStartApp,
    trackStartGame,
    trackEndGame,
};
