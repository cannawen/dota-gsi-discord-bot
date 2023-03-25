import {
    CacheType,
    ChatInputCommandInteraction,
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Interaction,
    SlashCommandBuilder,
} from "discord.js";
import Fact from "../classes/engine/Fact";
import engine from "../customEngine";
import topic from "../topic";
import topicDiscord from "./topicDiscord";

const pingCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => {
        return interaction.reply("Pong!");
    },
};

engine.register(
    "discord/slash_command_handler",
    [topicDiscord.client],
    (get) => {
        const client = get(topicDiscord.client)!;

        return new Promise((resolve, reject) => {
            client.on(Events.InteractionCreate, (interaction) => {
                if (!interaction.isChatInputCommand()) return;
                console.log(interaction);

                pingCommand
                    .execute(interaction)
                    .then((r) => {
                        console.log(r);
                        resolve(new Fact(topic.discordSlashEvent, true));
                    })
                    .catch((e) => {
                        console.error(e);

                        if (interaction.replied || interaction.deferred) {
                            interaction.followUp({
                                content:
                                    "There was an error while executing this command!",
                                ephemeral: true,
                            });
                        } else {
                            interaction.reply({
                                content:
                                    "There was an error while executing this command!",
                                ephemeral: true,
                            });
                        }
                    });
            });
        });
    }
);
