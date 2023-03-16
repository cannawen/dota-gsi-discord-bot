/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import axios, {
    AxiosResponse,
} from "axios";
import {
    discordLog as log,
} from "./log";
import dotenv = require("dotenv")
import Discord = require("discord.js");
import fs = require("fs");
import Voice = require("@discordjs/voice");
import path = require("path");

dotenv.config();

const discordClient = new Discord.Client({
    // eslint-disable-next-line no-magic-numbers
    intents: [131071],
});

let subscription : Voice.PlayerSubscription | undefined;
const audioQueue : Voice.AudioResource[] = [];
const ttsDirectory = "audio/tts";

if (fs.existsSync(ttsDirectory)) {
    log.debug("Found TTS Directory - %s", ttsDirectory);
} else {
    log.debug("Creating TTS Directory - %s", ttsDirectory);
    fs.mkdirSync(ttsDirectory);
}

function playNext() {
    if (subscription?.player.state.status !== Voice.AudioPlayerStatus.Idle) {
        log.debug("Audio player not ready to accept new audio");
        return;
    }

    log.debug("Audio player status is idle");

    const audioResource = audioQueue.shift();
    if (audioResource) {
        log.info("Playing next audio resource on queue");
        subscription.player.play(audioResource);
    } else {
        log.debug("Audio queue is empty");
    }
}

function onAudioPlayerStatusIdle() {
    playNext();
}

function onVoiceConnectionReady() {
    log.info("VoiceConnection ready to play audio!");
}

function onAudioFilePath(filePath: string) {
    audioQueue.push(Voice.createAudioResource(filePath));
    playNext();
}

function ttsPath(ttsString: string) {
    return path.join(ttsDirectory, `${ttsString}.mp3`);
}

function onTtsResponse(response : AxiosResponse, ttsString: string) {
    const write : fs.WriteStream = response.data.pipe(fs.createWriteStream(ttsPath(ttsString)));
    write.on("close", () => {
        log.verbose("Finished writing TTS '%s' to file", ttsString);
        playAudioFile(ttsPath(ttsString));
    });
}

function onDiscordClientReady() {
    if (!discordClient || !discordClient.user) {
        log.error("Could not find Discord client or user. Check your .env file");
        return;
    }
    log.info("Logged into Discord as %s!", discordClient.user.tag);

    const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name === process.env.HARD_CODED_GUILD_NAME);
    if (!guild) {
        log.error("Could not find Discord guild '%s'. Check your .env file", process.env.HARD_CODED_GUILD_NAME);
        return;
    }
    const channel = Array.from(guild.channels.cache.values()).find((channel) => channel.name === process.env.HARD_CODED_VOICE_CHANNEL_NAME);
    if (!channel) {
        log.error("Could not find Discord channel '%s'. Check your .env file", process.env.HARD_CODED_VOICE_CHANNEL_NAME);
        return;
    }

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
            log.debug("AudioPlayerState - transitioned from %s to %s", oldState.status, newState.status);
        }
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            log.debug("VoiceConnectionState - transitioned from %s to %s", oldState.status, newState.status);
        }
    });
}

discordClient.on("ready", onDiscordClientReady);

discordClient.login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => {
        log.error("Error logging into Discord. Check your .env file - %s", e.message);
    });

function playAudioFile(filePath: string) {
    log.info("Processing audio file at path %s", filePath);
    if (fs.existsSync(filePath)) {
        log.verbose("Found file at path %s", filePath);
        onAudioFilePath(filePath);
    } else {
        log.error("Unable to play file at path %s", filePath);
    }
}

function playTTS(ttsString: string) {
    log.info("Processing TTS string '%s'", ttsString);
    if (fs.existsSync(ttsPath(ttsString))) {
        playAudioFile(ttsPath(ttsString));
    } else {
        const encodedAudio = encodeURIComponent(ttsString);
        axios({
            method:       "get",
            responseType: "stream",
            url:          `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
        })
            .then((response) => onTtsResponse(response, ttsString))
            .catch((error) => {
                log.error("Unable to TTS %s with error message %s", ttsString, error.message);
            });
    }
}

export default {
    playAudioFile,
    playTTS,
};
