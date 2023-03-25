import { CacheType, ChatInputCommandInteraction, Events } from "discord.js";
import Command from "./Command";
import engine from "../customEngine";
import fs from "fs";
import log from "../log";
import path from "path";
import topicDiscord from "./topicDiscord";

function generateConfigFile(userId: string) {
    return (
        fs
            .readFileSync(
                path.join(__dirname, "../../data/configInstructions.txt"),
                "utf8"
            )
            // TODO use a hash of your userId as the auth token
            .replace("your_auth_token", userId)
    );
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

            if (interaction.commandName === Command.config) {
                handleConfigureInteraction(interaction);
            }
        });
    }
);
