import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule({
    label: "if no default guild, save autoconnect guild state as last guild connected to",
    trigger: [topics.discordGuildId],
    given: [topics.discordAutoconnectGuild],
    when: ([guildId], [defaultGuild]) => guildId && !defaultGuild,
    then: ([guildId]) => new Fact(topics.discordAutoconnectGuild, guildId),
});
