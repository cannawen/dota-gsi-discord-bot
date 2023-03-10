require('dotenv').config();
const AudioFiles = require('./AudioFiles')
const Discord = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const discordClient = new Discord.Client({ intents: [131071] });

const audioPlayer = createAudioPlayer();
var subscription = null;

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);

    discordClient.guilds
        .fetch('1076737468948304012')
        .then((guild) => {
            const channel = guild.channels.cache.get('1083521037465042995');

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The connection has entered the Ready state - ready to play audio!');
                subscription = connection.subscribe(audioPlayer);
            });
        })

});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (constant) => {
    if (constant) {
        console.log("Playing " + AudioFiles[constant])
        audioPlayer.play(createAudioResource(AudioFiles[constant]));
    }
}
