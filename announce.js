require('dotenv').config();
const Discord = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

//TODO: only set required intents. need GuildVoiceStates
const discordClient = new Discord.Client({ intents: [131071] });

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);

    //TODO: some other way to find the guild
    //const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name == "Canna Only");
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
                const audioPlayer = createAudioPlayer();
                const subscription = connection.subscribe(audioPlayer);
                
                const resource = createAudioResource('./audio.mp3');
                audioPlayer.play(resource);

                if (subscription) {
                    // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
                    setTimeout(() => subscription.unsubscribe(), 5_000);
                }
            });

            //Currently the bot never disconnects
        })

});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (text) => {
    if (text) {
        console.log(text);
    }
}
