## About

Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, stack timing, etc.). Guaranteed to raise your MMR by 3154 or your money back!

## Using the bot

-   [Add the bot to your server](https://discord.com/api/oauth2/authorize?client_id=1089945324757454950&permissions=36701184&scope=bot) (you must have admin privileges or share this link with an admin)
-   Go to a Voice channel and type `/config`
-   Go to Steam Library -> Right click Dota 2 -> Properties -> Local Files -> Browse... make a folder `game/dota/cfg/gamestate_integration/` and copy/paste a text file `gamestate_integration_dota2-*.cfg` (from above) into it
-   Steam Library -> Right click Dota 2 -> Properties -> General -> Launch Options -> Add `-gamestateintegration` to launch options
-   Type /coachme in the voice channel or /stop

### Development

[See here for details](./development.md)

## Product Management

-   See Github Projects page for project roadmap
-   Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
-   Commits are tagged with the story they correspond to

## Contributing

If you see a typo or have any ideas for a cool feature, open a github issue and let us know! If you know how to code, feel free to peruse our fine selection of open issues and leave a comment to stake claim on any that appeal to you
