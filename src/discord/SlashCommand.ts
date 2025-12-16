import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export class SlashCommand {
    public data: SlashCommandOptionsOnlyBuilder;
    public execute: (
        interaction: ChatInputCommandInteraction<CacheType>
    ) => void;

    constructor(
        data: SlashCommandOptionsOnlyBuilder,
        execute: (interaction: ChatInputCommandInteraction<CacheType>) => void
    ) {
        this.data = data;
        this.execute = execute;
    }
}
