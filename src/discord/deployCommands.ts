/* istanbul ignore file */
import { REST, Routes } from "discord.js";
import commands from "./commands";
import dotenv = require("dotenv");

dotenv.config();

// https://discordjs.guide/creating-your-bot/command-deployment.html#where-to-deploy

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID!;

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(BOT_TOKEN!);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APPLICATION_ID!),
            {
                body: Object.values(commands).map((command) =>
                    command.data.toJSON()
                ),
            }
        );

        console.log(`Successfully reloaded application (/) commands.`);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
