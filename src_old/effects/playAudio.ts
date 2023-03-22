import broker from "../broker";
import discord from "../discord";
import path from "node:path";
import Topic from "../../src/topics";

broker.register(
    "EFFECT/PLAY_AUDIO",
    Topic.EFFECT_PLAY_FILE,
    null,
    (filePath: string) =>
        discord.playAudioFile(path.join(__dirname, "../../audio/", filePath))
);
