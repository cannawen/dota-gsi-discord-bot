## About
Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, rosh timers, etc.)

## Setup
### Enable GSI
Steam -> Right click Dota 2 -> Properties
 - General -> Launch Options -> Add `-gamestateintegration` to launch options
 - Local Files -> Browse... mkdir and add config file to `game\dota\cfg\gamestate_integration\`
### Set up discord bot
 - Create and add a discord bot to your server
 - See Step 1 (approximately) `https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js`
 - Scope: bot
 - Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
 - Create a `.env` file with `DISCORD_CLIENT_TOKEN='your bot secret'`
### Start application
`npm start`
