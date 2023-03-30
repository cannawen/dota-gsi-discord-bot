import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv = require("dotenv");
import SlashCommandName from "./SlashCommandName";
dotenv.config();

// This file should be run every time the definitions of the slash commands change
// `npm run discord`

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(
    // Development bot token
    process.env.DISCORD_BOT_TOKEN!
    // Production bot token
    // process.env.DISCORD_BOT_TOKEN_PROD!
);

const allCommands = [
    new SlashCommandBuilder()
        .setName(SlashCommandName.config)
        .setDescription(
            "Replies with your Dota 2 Game State Integration configuration file"
        ),
    new SlashCommandBuilder()
        .setName(SlashCommandName.coachme)
        .setDescription("Start coaching me"),
    new SlashCommandBuilder()
        .setName(SlashCommandName.stop)
        .setDescription("Stop coaching me"),
];

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            // Development application id
            Routes.applicationCommands("761897641591701524"),
            // Production application id
            // Routes.applicationCommands("1089945324757454950"),
            {
                body: allCommands.map((cmd) => cmd.toJSON()),
            }
        );

        console.log(`Successfully reloaded application (/) commands.`);
        console.log(data);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
