import broker from "../broker";
import discord from "../discord";
import Topic from "../../src/topics";

broker.register(
    "EFFECT/PLAY_TTS",
    Topic.EFFECT_PLAY_TTS,
    null,
    (message: string) => discord.playTTS(message)
);
