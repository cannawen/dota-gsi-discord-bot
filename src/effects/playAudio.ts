import discord from "../discord";
import glue from "../glue";
import path from "node:path";
import Topic from "../Topics";

glue.register(Topic.EFFECT_PLAY_FILE, null,
    (filePath: string) => discord.playAudioFile(path.join(__dirname, "../../audio/", filePath)));

