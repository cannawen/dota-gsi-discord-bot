require('dotenv').config();
const AudioFiles = require('./AudioFiles')
const Discord = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');

const discordClient = new Discord.Client({ intents: [131071] });

var connection = null;

const HARD_CODED_GUILD_NAME = "Best Dota";
const HARD_CODED_VOICE_CHANNEL_NAME = "Dota 2";

discordClient.on('ready', () => {
    console.log(`Logged into discord as ${discordClient.user.tag}!`);

    const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name == HARD_CODED_GUILD_NAME);
    const channel = Array.from(guild.channels.cache.values()).find((channel => channel.name == HARD_CODED_VOICE_CHANNEL_NAME));

    connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('------- Ready to play audio!');
    });

    connection.on('stateChange', (oldState, newState) => {
        if (oldState.status == newState.status) {
            console.log(`Connection state ${oldState.status}`);
        } else {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        }
    });
});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (constant) => {
    if (constant) {
        console.log("Playing " + AudioFiles[constant])
        const player = createAudioPlayer();
        player.play(createAudioResource(AudioFiles[constant]));
        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Deallocating audio player")
            player.stop();
        })
        player.on(AudioPlayerStatus.AutoPaused, () => {
            console.log("Deallocating audio player")
            player.stop();
        })
        player.on('stateChange', (oldState, newState) => {
            if (oldState.status == newState.status) {
                console.log(`Audio player state ${oldState.status}`);
            } else {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            }
        });

        connection.subscribe(player);
    }
}
