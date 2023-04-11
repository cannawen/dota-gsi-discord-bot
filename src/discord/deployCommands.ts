import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv = require("dotenv");
import SlashCommandName from "./SlashCommandName";
dotenv.config();

// This file should be run every time the definitions of the slash commands change
// `npm run discord`

const deployDev = false;
const deployProd = false;

let BOT_TOKEN: string;
let APPLICATION_ID: string;

if (deployDev) {
    BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
    APPLICATION_ID = "761897641591701524";
}
if (deployProd) {
    BOT_TOKEN = process.env.DISCORD_BOT_TOKEN_PROD!;
    APPLICATION_ID = "1089945324757454950";
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(BOT_TOKEN!);

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
    new SlashCommandBuilder()
        .setName(SlashCommandName.help)
        .setDescription("Help!"),
];

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APPLICATION_ID!),
            {
                body: allCommands.map((cmd) => cmd.toJSON()),
            }
        );

        console.log(`Successfully reloaded application (/) commands.`);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
