import Discord from "discord.js";
import Topic from "../classes/engine/Topic";

export default {
    channel: new Topic<Discord.GuildBasedChannel>("discordChannel"),
    client: new Topic<Discord.Client<true>>("discordClient"),
    guild: new Topic<Discord.Guild>("discordGuild"),
};
