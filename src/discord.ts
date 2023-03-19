/* eslint-disable max-len */
/* eslint-disable max-statements */
import axios, {
    AxiosResponse,
} from "axios";
import colors from "@colors/colors";
import dotenv = require("dotenv")
import Discord = require("discord.js");
import fs = require("fs");
import path = require("path");
import log from "./log";
import Voice = require("@discordjs/voice");

dotenv.config();

const discordClient = new Discord.Client({
    // eslint-disable-next-line no-magic-numbers
    intents: [131071],
});

let subscription : Voice.PlayerSubscription | undefined;
const audioQueue : Voice.AudioResource[] = [];
const ttsDirectory = "tts-cache";

if (!fs.existsSync(ttsDirectory)) {
    fs.mkdirSync(ttsDirectory);
}

const emColor = colors.blue;
const errorColor = colors.red;

function playNext() {
    if (subscription?.player.state.status !== Voice.AudioPlayerStatus.Idle) {
        log.discord.debug("Audio player not ready to accept new audio");
        return;
    }
    log.discord.debug("Audio player status is idle");

    log.discord.verbose("Check queue for next audio resource");
    const audioResource = audioQueue.shift();
    if (audioResource) {
        log.discord.info("Playing next audio resource");
        subscription.player.play(audioResource);
    } else {
        log.discord.verbose("Audio queue is empty");
    }
}

function onAudioPlayerStatusIdle() {
    playNext();
}

function onVoiceConnectionReady() {
    log.discord.info("VoiceConnection ready to play audio!".green);
}

function onAudioFilePath(filePath: string) {
    log.discord.info("Enqueue file at path %s", emColor(filePath));
    audioQueue.push(Voice.createAudioResource(filePath));
    playNext();
}

function ttsPath(ttsString: string) {
    return path.join(ttsDirectory, `${ttsString}.mp3`);
}

function onTtsResponse(response : AxiosResponse, ttsString: string) {
    const write : fs.WriteStream = response.data.pipe(fs.createWriteStream(ttsPath(ttsString)));
    write.on("close", () => {
        log.discord.verbose("Finished writing TTS '%s' to file", ttsString);
        playAudioFile(ttsPath(ttsString));
    });
}

function onDiscordClientReady() {
    if (!discordClient || !discordClient.user) {
        log.discord.error("Could not find Discord client or user. Check your .env file");
        return;
    }
    const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name === process.env.HARD_CODED_GUILD_NAME);
    if (!guild) {
        log.discord.error("Could not find Discord guild %s. Check your .env file", errorColor(process.env.HARD_CODED_GUILD_NAME || "undefined"));
        return;
    }
    const channel = Array.from(guild.channels.cache.values()).find((channel) => channel.name === process.env.HARD_CODED_VOICE_CHANNEL_NAME);
    if (!channel) {
        log.discord.error("Could not find Discord channel %s in guild %s. Check your .env file", errorColor(process.env.HARD_CODED_VOICE_CHANNEL_NAME || "undefined"), guild.name);
        return;
    }

    log.discord.info(
        "Discord ready with user: %s guild: %s channel: %s",
        emColor(discordClient.user.tag),
        emColor(guild.name),
        emColor(channel.name)
    );

    const connection = Voice.joinVoiceChannel({
        adapterCreator: channel.guild.voiceAdapterCreator,
        channelId:      channel.id,
        guildId:        channel.guild.id,
    });
    connection.on(Voice.VoiceConnectionStatus.Ready, onVoiceConnectionReady);

    const player = Voice.createAudioPlayer();
    player.on(Voice.AudioPlayerStatus.Idle, onAudioPlayerStatusIdle);

    subscription = connection.subscribe(player);

    // logging
    player.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            log.discord.debug("AudioPlayerState - transitioned from %s to %s", oldState.status, emColor(newState.status));
        }
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            log.discord.debug("VoiceConnectionState - transitioned from %s to %s", oldState.status, emColor(newState.status));
        }
    });
}

discordClient.on("ready", onDiscordClientReady);

discordClient.login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => {
        log.discord.error("Error logging into Discord. Check your .env file - %s", errorColor(e.message));
    });

function playAudioFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        onAudioFilePath(filePath);
    } else {
        log.discord.error("Unable to play file at path %s", errorColor(filePath));
    }
}

function playTTS(ttsString: string) {
    if (fs.existsSync(ttsPath(ttsString))) {
        log.discord.info("Found cached TTS %s", ttsString);
        playAudioFile(ttsPath(ttsString));
    } else {
        log.discord.info("Processing TTS string '%s'", ttsString);
        const encodedAudio = encodeURIComponent(ttsString);
        axios({
            method:       "get",
            responseType: "stream",
            url:          `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
        })
            .then((response) => onTtsResponse(response, ttsString))
            .catch((error) => {
                log.discord.error("Unable to TTS %s with error message %s", errorColor(ttsString), errorColor(error.message));
            });
    }
}

export default {
    playAudioFile,
    playTTS,
};
