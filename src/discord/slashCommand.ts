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
            .replace(/insert_discord_id_here/g, userId)
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

function handleCoachMeInteraction(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    if (interaction.channel?.isVoiceBased && interaction.guildId) {
        engine.startCoachingSession(
            interaction.user.id,
            interaction.guildId,
            interaction.channelId
        );
        interaction.reply({
            content:
                "Starting...\n\nMake sure you have used the config command to add the Game State Integration configuration file to your computer",
            ephemeral: true,
        });
    } else {
        interaction.reply({
            content: "Bot must be started in voice-based guild channel",
            ephemeral: true,
        });
    }
}

function handleStopInteraction(
    interaction: ChatInputCommandInteraction<CacheType>
) {
    interaction.reply({
        content: "Ending...",
        ephemeral: true,
    });
    engine.stopCoachingSession(interaction.user.id);
}

engine.register(
    "discord/slash_command_handler",
    [topicDiscord.client],
    (get) => {
        const client = get(topicDiscord.client)!;

        client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            log.info(
                "discord",
                "Handling slash command interaction %s",
                interaction.commandName
            );
            switch (interaction.commandName) {
                case Command.config:
                    handleConfigureInteraction(interaction);
                    break;
                case Command.coachme:
                    handleCoachMeInteraction(interaction);
                    break;
                case Command.stop:
                    handleStopInteraction(interaction);
                    break;
                default:
                    log.error(
                        "discord",
                        "Unable to handle interaction %s",
                        interaction.commandName
                    );
                    break;
            }
        });
    }
);
