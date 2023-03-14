/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable max-len */
import dotenv = require("dotenv")
import Discord = require("discord.js");
import log = require("npmlog");
import Voice = require("@discordjs/voice");

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

    const audioFilePath = audioQueue.pop();
    if (audioFilePath) {
        log.info("Discord AudioPlayer", "Attempting to play", audioFilePath);
        subscription.player.play(Voice.createAudioResource(audioFilePath));
    }
}

discordClient.on("ready", () => {
    if (!discordClient || !discordClient.user) {
        log.error("Discord Client", "could not find client or user");
        return;
    } else {
        log.info("Discord Client", "Logged in as", discordClient.user.tag);
    }

    const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name === process.env.HARD_CODED_GUILD_NAME);
    if (!guild) {
        log.error("Discord Client", "could not find guild", process.env.HARD_CODED_GUILD_NAME);
        return;
    }
    const channel = Array.from(guild.channels.cache.values()).find((channel) => channel.name === process.env.HARD_CODED_VOICE_CHANNEL_NAME);
    if (!channel) {
        log.error("Discord Client", "could not find channel", process.env.HARD_CODED_VOICE_CHANNEL_NAME);
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
            log.verbose("Discord AudioPlayerState", oldState.status);
        } else {
            log.verbose("Discord AudioPlayerState", "transitioned from", oldState.status, "to", newState.status);
        }
    });

    player.on(Voice.AudioPlayerStatus.Idle, () => {
        playNext();
    });

    subscription = connection.subscribe(player);

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
        log.info("Discord VoiceConnectionState", "Ready to play audio!");
    });

    connection.on("stateChange", (oldState, newState) => {
        if (oldState.status === newState.status) {
            log.verbose("Discord Connection", oldState.status);
        } else {
            log.verbose("Discord Connection", "transitioned from", oldState.status, "to", newState.status);
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
        if (oldState.status === newState.status) {
            log.verbose("Discord VoiceConnectionState", oldState.status);
        } else {
            log.verbose("Discord VoiceConnectionState", "transitioned from", oldState.status, "to", newState.status);
        }
    });
    /* eslint-enable */
});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN)
    .catch((e: Discord.DiscordjsError) => log.error("Discord Client", e.message));

function playAudio(audioFilePath: string) {
    audioQueue.push(audioFilePath);
    playNext();
}

export default {
    playAudio,
};
