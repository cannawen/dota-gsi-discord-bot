require('dotenv').config();
const AudioFiles = require('./AudioFiles')
const Discord = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const discordClient = new Discord.Client({ intents: [131071] });

const audioPlayer = createAudioPlayer();
var subscription = null;

const HARD_CODED_GUILD_NAME = "Best Dota";
const HARD_CODED_VOICE_CHANNEL_NAME = "Dota 2";

discordClient.on('ready', () => {
    console.log(`Logged into discord as ${discordClient.user.tag}!`);

    const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name == HARD_CODED_GUILD_NAME);
    const channel = Array.from(guild.channels.cache.values()).find((channel => channel.name == HARD_CODED_VOICE_CHANNEL_NAME));

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Ready to play audio!');
        subscription = connection.subscribe(audioPlayer);
    });
});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (constant) => {
    if (constant) {
        console.log("Playing " + AudioFiles[constant])
        audioPlayer.play(createAudioResource(AudioFiles[constant]));
    }
}
