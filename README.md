## About

Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, stack timing, etc.). Guaranteed to raise your MMR by 3154 or your money back!

## Start application

-   Make sure your `node --version` is at least v18.15.0
-   `npm install`
-   `npm start`

### Development

[See here for details](./development.md)

## Dependencies

### Dota 2 Game State Integration

Steam Library -> Right click Dota 2 -> Properties

-   -> General -> Launch Options -> Add `-gamestateintegration` to launch options
-   -> Local Files -> Browse... mkdir `game\dota\cfg\gamestate_integration\` and copy/paste `gamestate_integration_dota2-gsi.cfg` file into it

### Discord

-   Create and add a discord bot to your server. [(src, Step 1)](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
-   Scope: bot. Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
-   Create a `.env` file with from copying `sample.env` and change relevant values

## Product Management

-   See Github Projects page for project roadmap
-   Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
-   Commits are tagged with the story they correspond to

## Contributing

If you see a typo or have any ideas for a cool feature, open a github issue and let us know! If you know how to code, feel free to peruse our fine selection of open issues and leave a comment to stake claim on any that appeal to you
