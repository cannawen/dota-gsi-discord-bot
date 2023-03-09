require('dotenv').config();
const Discord = require('discord.js');

//TODO: only set required intents
const discordClient = new Discord.Client({ intents: [131071] });

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);

    //TODO: some other way to find the guild
    //const guild = Array.from(discordClient.guilds.cache.values()).find((guild) => guild.name == "Canna Only");
    discordClient.guilds
        .fetch('1076737468948304012')
        .then((guild) => {
            const channel = guild.channels.cache.get('1083521037465042995');

            console.log(channel);
        })

});

discordClient.login(process.env.DISCORD_CLIENT_TOKEN);

module.exports = (text) => {
    if (text) {
        console.log(text);
    }
}
