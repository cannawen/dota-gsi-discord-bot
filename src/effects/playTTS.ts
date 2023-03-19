import discord from "../discord";
import broker from "../broker";
import Topic from "../Topic";

broker.register(
    Topic.EFFECT_PLAY_TTS,
    null,
    (message: string) => discord.playTTS(message)
);
