
const Discord = require("discord.js");
const log = require("npmlog");
const Voice = require("@discordjs/voice");

const AudioFiles = require("./AudioFiles");
const config = require("./config");

const discordClient = new Discord.Client({
    "intents": [config.DISCORD_INTENTS],
});

let subscription = null;

discordClient.on("ready", () => {
    log.info("Discord Client", "Logged into discord as", discordClient.user.tag);

    const guild = Array.from(discordClient.guilds.cache.values())
        .find((guild) => guild.name === config.HARD_CODED_GUILD_NAME);
    const channel = Array.from(guild.channels.cache.values())
        .find((channel) => channel.name === config.HARD_CODED_VOICE_CHANNEL_NAME);

    const connection = Voice.joinVoiceChannel({
        "adapterCreator": channel.guild.voiceAdapterCreator,
        "channelId":      channel.id,
        "guildId":        channel.guild.id,
    });

    const player = Voice.createAudioPlayer();

    subscription = connection.subscribe(player);

    connection.on(Voice.VoiceConnectionStatus.Ready, () => {
        log.info("Discord Voice Connection", "Ready to play audio!");
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
    });
});

discordClient.login(config.DISCORD_CLIENT_TOKEN);

module.exports = (constant) => {
    if (constant) {
        subscription.player.play(Voice.createAudioResource(AudioFiles[constant]));
    }
};
