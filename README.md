## About
Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, rosh timers, etc.)

## Start application
- Make sure your `node --version` is at least v18.15.0
- `npm install`
- `npm start`

## Dependencies
### GSI
Steam -> Right click Dota 2 -> Properties
- General -> Launch Options -> Add `-gamestateintegration` to launch options
- Local Files -> Browse... mkdir `game\dota\cfg\gamestate_integration\` and copy/paste `gamestate_integration_dota2-gsi.cfg` file into it 
### Discord bot
- Create and add a discord bot to your server
- See Step 1 (approximately) `https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js`
- Scope: bot
- Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
- Create a `.env` file with `DISCORD_CLIENT_TOKEN='your_bot_secret'`
- Change the hard-coded guild & channel names in `announce.js`

## Project Management
- See Github Projects page for project roadmap
- Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
- Commits are tagged (at the end) with the story number they correspond to
