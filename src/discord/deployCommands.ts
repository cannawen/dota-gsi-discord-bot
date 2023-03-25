import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv = require("dotenv");
import Command from "./Command";
dotenv.config();

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_CLIENT_TOKEN!
);

const allCommands = [
    new SlashCommandBuilder()
        .setName(Command.config)
        .setDescription(
            "Replies with your Dota 2 Game State Integration configuration file"
        ),
    new SlashCommandBuilder()
        .setName(Command.coachme)
        .setDescription("Start coaching me"),
    new SlashCommandBuilder()
        .setName(Command.stop)
        .setDescription("Stop coaching me"),
];

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(
                "761897641591701524", // Application id
                process.env.HARD_CODED_GUILD_ID!
            ),
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
