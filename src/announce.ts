require("dotenv").config();
const Discord = require("discord.js");
const log = require("npmlog");
const Voice = require("@discordjs/voice");

const discordClient = new Discord.Client({
    // eslint-disable-next-line no-magic-numbers
    intents: [131071],
});

let subscription = null;

discordClient.on("ready", () => {
    log.info("Discord Client", "Logged in as", discordClient.user.tag);

    const guild = Array.from(discordClient.guilds.cache.values())
        .find((guild) => guild.name === process.env.HARD_CODED_GUILD_NAME);
    const channel = Array.from(guild.channels.cache.values())
        .find((channel) => channel.name === process.env.HARD_CODED_VOICE_CHANNEL_NAME);

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

    subscription = connection.subscribe(player);

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
        log.info("Discord VoiceConnectionState", "Ready to play audio!");
    });

    // Workaround story #15
    function networkStateChangeHandler(_, newNetworkState) {
        const newUdp = Reflect.get(newNetworkState, "udp");
        clearInterval(newUdp?.keepAliveInterval);
    }

    // Workaround story #15
    connection.on("stateChange", (oldState, newState) => {
        Reflect.get(oldState, "networking")?.off("stateChange", networkStateChangeHandler);
        Reflect.get(newState, "networking")?.on("stateChange", networkStateChangeHandler);
        if (oldState.status === newState.status) {
            log.verbose("Discord VoiceConnectionState", oldState.status);
        } else {
            log.verbose("Discord VoiceConnectionState", "transitioned from", oldState.status, "to", newState.status);
        }
    });
});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (audioFilePath) => {
    if (audioFilePath) {
        log.info("Discord AudioPlayer", "Attempting to play", audioFilePath);
        subscription.player.play(Voice.createAudioResource(audioFilePath));
    }
};
