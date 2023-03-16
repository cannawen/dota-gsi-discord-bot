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
const audioQueue : string[] = [];

function playNext() {
    if (!subscription) {
        return;
    }

    if (subscription.player.state.status !== Voice.AudioPlayerStatus.Idle) {
        return;
    }

    const audioResource = audioQueue.pop();
    if (!audioResource) {
        return;
    }

    if (fs.existsSync(audioResource)) {
        discordLog.info("AudioPlayer - Attempting to play %s", audioResource);
        subscription.player.play(Voice.createAudioResource(audioResource));
    } else {
        discordLog.info("AudioPlayer - Attempting to TTS '%s'", audioResource);
        const encodedAudio = encodeURIComponent(audioResource);
        axios({
            method:       "get",
            url:          `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedAudio}&tl=en&client=tw-ob`,
            responseType: "stream",
        }).then(function (response) {
            subscription?.player.play(Voice.createAudioResource(response.data));
        });
    }
}

discordClient.on("ready", () => {
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
    player.on("stateChange", (oldState, newState) => {
        if (oldState.status === newState.status) {
            discordLog.verbose("AudioPlayerState - %s", oldState.status);
        } else {
            discordLog.info("AudioPlayerState - transitioned from %s to %s", oldState.status, newState.status);
        }
    });

    player.on(Voice.AudioPlayerStatus.Idle, () => {
        playNext();
    });

    subscription = connection.subscribe(player);

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status === newState.status) {
            discordLog.verbose("ConnectionStatus - %s", oldState.status);
        } else {
            discordLog.info("ConnectionStatus - transitioned from %s to %s", oldState.status, newState.status);
        }
    });

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
        log.info("Ready to play audio!");
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status === newState.status) {
            discordLog.verbose("VoiceConnectionState - %s", oldState.status);
        } else {
            discordLog.info("VoiceConnectionState - transitioned from %s to %s", oldState.status, newState.status);
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
});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => {
        log.error("Error logging into Discord. Check your .env file - %s", e.message);
    });

/**
 *
 * @param audioResource local file path or tts text
 */
function playAudioFile(filePath: string) {
    audioQueue.push(filePath);
    playNext();
}
/**
 *
 * @param audioResource local file path or tts text
 */
function playTTS(ttsString: string) {
    audioQueue.push(ttsString);
    playNext();
}

export default {
    playAudioFile,
    playTTS,
};
