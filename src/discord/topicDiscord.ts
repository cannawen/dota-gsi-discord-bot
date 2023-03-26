import Discord from "discord.js";
import Topic from "../classes/engine/Topic";

export default {
    channel: new Topic<Discord.VoiceChannel>("discordChannel"),
    client: new Topic<Discord.Client<true>>("discordClient"),
    guild: new Topic<Discord.Guild>("discordGuild"),
};

// If we make the Discord classes DeepReadonly, we lose some functions like `find` on a Collection.
// export default {
//     channel: new Topic<DeepReadonly<Discord.GuildBasedChannel>>(
//         "discordChannel"
//     ),
//     client: new Topic<DeepReadonly<Discord.Client<true>>>("discordClient"),
//     guild: new Topic<DeepReadonly<Discord.Guild>>("discordGuild"),
// };
