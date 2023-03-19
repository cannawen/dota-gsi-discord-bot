import discord from "../discord";
import glue from "../glue";
import topics from "../topics";

glue.register(
    topics.EFFECT_PLAY_TTS,
    null,
    (message: string) => discord.playTTS(message)
);
