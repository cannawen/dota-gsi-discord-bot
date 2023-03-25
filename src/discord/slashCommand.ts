import {
    CacheType,
    ChatInputCommandInteraction,
    Events,
    SlashCommandBuilder,
} from "discord.js";
import engine from "../customEngine";
import fs from "fs";
import log from "../log";
import path from "path";
import topicDiscord from "./topicDiscord";

const configureCommand = new SlashCommandBuilder()
    .setName("config")
    .setDescription(
        "Replies with your Dota 2 Game State Integration configuration file"
    );

function generateConfigFile(userId: string) {
    return fs
        .readFileSync(
            path.join(__dirname, "../../data/configInstructions.txt"),
            "utf8"
        )
        .replace("your_auth_token", userId);
}

function handleConfigureInteraction(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    interaction
        .reply({
            content: generateConfigFile(interaction.user.id),
            ephemeral: true,
        })
        .catch((e) => {
            log.error("discord", "Interaction error %s", e);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        });
}

engine.register(
    "discord/slash_command_handler",
    [topicDiscord.client],
    (get) => {
        const client = get(topicDiscord.client)!;

        client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === configureCommand.name) {
                handleConfigureInteraction(interaction);
            }
        });
    }
);
