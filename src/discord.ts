import axios, { AxiosResponse } from "axios";
import colors from "@colors/colors";
import Discord = require("discord.js");
import fs = require("fs");
import path = require("path");
import log from "./log";
import Voice = require("@discordjs/voice");

const discordClient = new Discord.Client({
    intents: [131071],
});

let subscription: Voice.PlayerSubscription | undefined;
const audioQueue: Voice.AudioResource[] = [];
const ttsDirectory = "tts-cache";

if (!fs.existsSync(ttsDirectory)) {
    fs.mkdirSync(ttsDirectory);
}

const emColor = colors.blue;

function playNext() {
    if (subscription?.player.state.status !== Voice.AudioPlayerStatus.Idle) {
        log.debug("discord", "Audio player not ready to accept new audio");
        return;
    }
    log.debug("discord", "Audio player status is idle");

    log.verbose("discord", "Check queue for next audio resource");
    const audioResource = audioQueue.shift();
    if (audioResource) {
        log.verbose("discord", "Playing next audio resource");
        subscription.player.play(audioResource);
    } else {
        log.verbose("discord", "Audio queue is empty");
    }
}

function onAudioPlayerStatusIdle() {
    playNext();
}

function onVoiceConnectionReady() {
    log.info("discord", "VoiceConnection ready to play audio!".green);
}

function onAudioFilePath(filePath: string) {
    log.info("discord", "Enqueue file at path %s", emColor(filePath));
    audioQueue.push(Voice.createAudioResource(filePath));
    playNext();
}

function ttsPath(ttsString: string) {
    return path.join(ttsDirectory, `${ttsString}.mp3`);
}

function onTtsResponse(response: AxiosResponse, ttsString: string) {
    const write: fs.WriteStream = response.data.pipe(
        fs.createWriteStream(ttsPath(ttsString))
    );
    write.on("close", () => {
        log.verbose("discord", "Finished writing TTS '%s' to file", ttsString);
        playAudioFile(ttsPath(ttsString));
    });
}

function onDiscordClientReady() {
    if (!discordClient || !discordClient.user) {
        log.error(
            "discord",
            "Could not find Discord client or user. Check your .env file"
        );
        return;
    }
    const guild = Array.from(discordClient.guilds.cache.values()).find(
        (guild) => guild.name === process.env.HARD_CODED_GUILD_NAME
    );
    if (!guild) {
        log.error(
            "discord",
            "Could not find Discord guild %s. Check your .env file",
            process.env.HARD_CODED_GUILD_NAME
        );
        return;
    }
    const channel = Array.from(guild.channels.cache.values()).find(
        (channel) => channel.name === process.env.HARD_CODED_VOICE_CHANNEL_NAME
    );
    if (!channel) {
        log.error(
            "discord",
            "Could not find Discord channel %s in guild %s. Check your .env file",
            process.env.HARD_CODED_VOICE_CHANNEL_NAME,
            guild.name
        );
        return;
    }

    log.info(
        "discord",
        "Discord ready with user: %s guild: %s channel: %s",
        emColor(discordClient.user.tag),
        emColor(guild.name),
        emColor(channel.name)
    );

    const connection = Voice.joinVoiceChannel({
        adapterCreator: channel.guild.voiceAdapterCreator,
        channelId: channel.id,
        guildId: channel.guild.id,
    });
    connection.on(Voice.VoiceConnectionStatus.Ready, onVoiceConnectionReady);

    const player = Voice.createAudioPlayer();
    player.on(Voice.AudioPlayerStatus.Idle, onAudioPlayerStatusIdle);

    subscription = connection.subscribe(player);

    // logging
    player.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            log.debug(
                "discord",
                "AudioPlayerState - transitioned from %s to %s",
                oldState.status,
                emColor(newState.status)
            );
        }
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            log.debug(
                "discord",
                "VoiceConnectionState - transitioned from %s to %s",
                oldState.status,
                emColor(newState.status)
            );
        }
    });
}

discordClient.on("ready", onDiscordClientReady);

discordClient
    .login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => {
        log.error(
            "discord",
            "Error logging into Discord. Check your .env file - %s",
            e.message
        );
    });

function playAudioFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        onAudioFilePath(filePath);
    } else {
        log.error("discord", "Unable to play file at path %s", filePath);
    }
}

function playTts(ttsString: string) {
    if (fs.existsSync(ttsPath(ttsString))) {
        log.verbose("discord", "Found cached TTS %s", ttsString);
        playAudioFile(ttsPath(ttsString));
    } else {
        log.verbose("discord", "Processing TTS string '%s'", ttsString);
        const encodedAudio = encodeURIComponent(ttsString);
        axios({
            method: "get",
            responseType: "stream",
            url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
        })
            .then((response) => onTtsResponse(response, ttsString))
            .catch((error) => {
                log.error(
                    "discord",
                    "Unable to TTS %s with error message %s",
                    ttsString,
                    error.message
                );
            });
    }
}

export default {
    playAudioFile,
    playTts,
};
