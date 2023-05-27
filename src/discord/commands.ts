import fs from "fs";

import path = require("path");
import { SlashCommand } from "./SlashCommand";

const commandsPath = path.join(__dirname, "commands");

export default fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    .map((file) => require(path.join(commandsPath, file)).default)
    .filter((command) => command instanceof SlashCommand)
    .reduce((memo: { [key: string]: SlashCommand }, command: SlashCommand) => {
        memo[command.data.name] = command;
        return memo;
    }, {}) as { [key: string]: SlashCommand };
