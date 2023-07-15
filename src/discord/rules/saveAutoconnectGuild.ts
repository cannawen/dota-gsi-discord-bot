import Fact from "../../engine/Fact";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default new Rule({
    label: "save state for last guild connected to",
    trigger: [topics.discordGuildId],
    when: ([guildId]) => guildId,
    then: ([guildId]) => new Fact(topics.discordAutoconnectGuild, guildId),
});
