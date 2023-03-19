import discord from "../discord";
import glue from "../glue";
import Topic from "../Topics";

glue.register(Topic.EFFECT_PLAY_TTS, null, (message: string) => discord.playTTS(message));

