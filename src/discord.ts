/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import {
    discordLog,
    log,
} from "./log";
import dotenv = require("dotenv")
import Discord = require("discord.js");
import fs = require("fs");
import Voice = require("@discordjs/voice");
import axios from "axios";

dotenv.config();

const discordClient = new Discord.Client({
    // eslint-disable-next-line no-magic-numbers
    intents: [131071],
});

let subscription : Voice.PlayerSubscription | undefined;
const audioQueue : Voice.AudioResource[] = [];

function playNext() {
    if (!subscription) {
        return;
    }

    if (subscription.player.state.status !== Voice.AudioPlayerStatus.Idle) {
        return;
    }

    const audioResource = audioQueue.pop();
    if (audioResource) {
        subscription.player.play(audioResource);
    }
}

function onDiscordClientReady() {
    if (!discordClient || !discordClient.user) {
        log.error("Could not find Discord client or user. Check your .env file");
    } else {
        log.info("Logged into Discord as %s!", discordClient.user.tag);
    }

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

    const player = Voice.createAudioPlayer();

    player.on(Voice.AudioPlayerStatus.Idle, () => {
        playNext();
    });

    subscription = connection.subscribe(player);

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
        log.info("Ready to play audio!");
    });

    player.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            discordLog.verbose("AudioPlayerState - transitioned from %s to %s", oldState.status, newState.status);
        }
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status !== newState.status) {
            discordLog.verbose("VoiceConnectionState - transitioned from %s to %s", oldState.status, newState.status);
        }
    });

    // Workaround story #15
    /* eslint-disable */
    function networkStateChangeHandler(_oldNetworkState: any, newNetworkState: any) {
        const newUdp = Reflect.get(newNetworkState, "udp");
        clearInterval(newUdp?.keepAliveInterval);
    }

    connection.on("stateChange", (oldState, newState) => {
        Reflect.get(oldState, "networking")?.off("stateChange", networkStateChangeHandler);
        Reflect.get(newState, "networking")?.on("stateChange", networkStateChangeHandler);
    });
    /* eslint-enable */
}

discordClient.on("ready", onDiscordClientReady);

discordClient.login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => {
        log.error("Error logging into Discord. Check your .env file - %s", e.message);
    });

/**
 *
 * @param audioResource local file path or tts text
 */
function playAudioFile(filePath: string) {
    log.info("AudioPlayer - Attempting to play file %s", filePath);
    if (fs.existsSync(filePath)) {
        audioQueue.push(Voice.createAudioResource(filePath));
        playNext();
    } else {
        log.error("Unable to play file at path %s", filePath);
    }
}
/**
 *
 * @param audioResource local file path or tts text
 */
function playTTS(ttsString: string) {
    log.info("AudioPlayer - Attempting to TTS '%s'", ttsString);
    const encodedAudio = encodeURIComponent(ttsString);
    axios({
        method:       "get",
        url:          `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
        responseType: "stream",
    })
        .then((response) => {
            audioQueue.push(Voice.createAudioResource(response.data));
            playNext();
        })
        .catch((error) => {
            log.error("Unable to TTS %s with error message %s", ttsString, error.message);
        });
}

export default {
    playAudioFile,
    playTTS,
};
