import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

export class SlashCommand {
    public data: SlashCommandBuilder;
    public execute: (
        interaction: ChatInputCommandInteraction<CacheType>
    ) => void;

    constructor(
        data: SlashCommandBuilder,
        execute: (interaction: ChatInputCommandInteraction<CacheType>) => void
    ) {
        this.data = data;
        this.execute = execute;
    }
}
