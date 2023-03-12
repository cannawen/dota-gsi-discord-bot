## About
Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, rosh timers, etc.)

## Start application
- `npm install`
- `npm start`
### Development
- `npm run start:dev` or `npm run test:dev` for hot reloading

## Dependencies
### Node and Typescript
When `npm start` is run, it will first run `tsc` which will compile typescript files in the `src` directory to javascript in the `dist` directory
- Make sure your `node --version` is at least v18.15.0
- Install typescript `npm install -g typescript`
### Dota 2 Game State Integration
Steam -> Right click Dota 2 -> Properties
- General -> Launch Options -> Add `-gamestateintegration` to launch options
- Local Files -> Browse... mkdir `game\dota\cfg\gamestate_integration\` and copy/paste `gamestate_integration_dota2-gsi.cfg` file into it 
### Discord
- Create and add a discord bot to your server. [(src, Step 1)](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- Scope: bot. Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
- Create a `.env` file with from copying `.env.sample` and change relevant values

## Code Formatting
- Using many `eslint` rules [(src 1)](https://eslint.org/docs/latest/rules/) [(src 2)](https://eslint-config.netlify.app/rules/yield-star-spacing)
- Add to VS Code `settings.json` to auto-format [(src)](https://daveceddia.com/vscode-use-eslintrc/#:~:text=Configure%20VSCode%20Settings%20to%20use%20ESLint%20for%20Formatting&text=Click%20that%20tiny%20icon%20in,paper%20with%20a%20little%20arrow.&text=The%20first%20one%20turns%20on,it%2C%20we're%20done.)
```
{
    "eslint.format.enable": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
}
```

## Product Management
- See Github Projects page for project roadmap
- Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
- Commits are tagged with the story they correspond to
