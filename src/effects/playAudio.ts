import discord from "../discord";
import broker from "../broker";
import path from "node:path";
import Topic from "../Topic";

broker.register(
    Topic.EFFECT_PLAY_FILE,
    null,
    (filePath: string) => discord.playAudioFile(path.join(__dirname, "../../audio/", filePath))
);
