## About
Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, stack timing, etc.). Guaranteed to raise your MMR by 3154 or your money back!

## Start application
- Make sure your `node --version` is at least v18.15.0
- `npm install`
- `npm start`
### Development
- `npm run start:dev` or `npm run test:dev` for hot reloading
- `npm run lint` to identify & fix linting issues
### Using node-gsi library
- When a change is pushed to `cannawen/node-gsi#master` on github and you want the newest version
- `npm update`

## Dependencies
### Dota 2 Game State Integration
Steam Library -> Right click Dota 2 -> Properties
- -> General -> Launch Options -> Add `-gamestateintegration` to launch options
- -> Local Files -> Browse... mkdir `game\dota\cfg\gamestate_integration\` and copy/paste `gamestate_integration_dota2-gsi.cfg` file into it 
### Discord
- Create and add a discord bot to your server. [(src, Step 1)](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- Scope: bot. Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
- Create a `.env` file with from copying `sample.env` and change relevant values

## Development
### Node and Typescript
When `npm start` is run, it will first run `tsc` which will transpile typescript files in the `src` directory to javascript in the `dist` directory
### Logging
winston containers weren't working, so just import your loggers from `log.ts` and feel free to create new loggers
### What is happening
- In general, there are three main sections of the app
  - GSI that takes data form Valve's Game State integration and parses it to a form we can use (Time, Items)
  - Assistants (Roshan, Trusty Shovel) that use that take the parsed data (Time, Items) and returns an effect (Audio File, TTS)
  - An Effect that knows how to execute the desired effect (playing audio on discord)
- These three sections communicate via `broker` using `Topic`s.
- `Topic`s represent the kind of data one may produce and/or consume and their type.
- The GSI server starts and produces a `Topic.GSI_DATA` to the broker
- Code in `gsi/` consume `Topic.GSI_DATA` and produce their own topics as an output, such as `Topic.DOTA_2_TIME`
- Code in `assistants/` consume topics such as `Topic.DOTA_2_TIME` and produce effects like `Topic.EFFECT_PLAY_FILE`
- Code in `effects/` consume the effect and produce no outputs to the broker (but have side effects)
Note: There is no special requirement for the code to be separated into these three sections; a component can declare they want to consume a `Topic.GSI_DATA` and produce a `Topic.EFFECT_PLAY_FILE` if they wish. It is currently just separated into different folders for logical reasons
### mitmproxy
When you don't want to run dota to test your app, you can use mitmproxy to replay saved HTTP requests from GSI.  
[See here for details](./mitmproxy.md)

## Code Formatting
- Using many `eslint` rules [(src 1)](https://eslint.org/docs/latest/rules/) [(src 2)](https://eslint-config.netlify.app/rules/yield-star-spacing)
- Add to Visual Studio Code `settings.json` to auto-format [(src)](https://daveceddia.com/vscode-use-eslintrc/#:~:text=Configure%20VSCode%20Settings%20to%20use%20ESLint%20for%20Formatting&text=Click%20that%20tiny%20icon%20in,paper%20with%20a%20little%20arrow.&text=The%20first%20one%20turns%20on,it%2C%20we're%20done.)
```
{
    "eslint.format.enable": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
}
```
- While you're here, `"editor.minimap.enabled": false` is also nice to remove the minimap view in VS code
- `Jest Runner` is also a very nice plugin

## Product Management
- See Github Projects page for project roadmap
- Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
- Commits are tagged with the story they correspond to

## Contributing
If you see a typo or have any ideas for a cool feature, open a github issue and let us know! If you know how to code, feel free to peruse our fine selection of open issues and leave a comment to stake claim on any that appeal to you
