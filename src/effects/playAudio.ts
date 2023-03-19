import discord from "../discord";
import glue from "../glue";
import path from "node:path";
import topics from "../topics";

glue.register(
    topics.EFFECT_PLAY_FILE,
    null,
    (filePath: string) => discord.playAudioFile(path.join(__dirname, "../../audio/", filePath))
);
