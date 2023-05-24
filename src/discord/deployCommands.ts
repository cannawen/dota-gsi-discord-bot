/* istanbul ignore file */
import { REST, Routes } from "discord.js";
import dotenv = require("dotenv");
import fs from "fs";
import path = require("path");
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
const commandsPath = path.join(__dirname, "commands");
const commandsJson: any[] = [];

fs.readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
    .forEach((file) => {
        const filePath = path.join(commandsPath, file);
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        const command = require(filePath).default;
        if (command.data && command.execute) {
            commandsJson.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    });

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
                body: commandsJson,
            }
        );

        console.log(`Successfully reloaded application (/) commands.`);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
