## About
Use Dota 2's Game State Integration API to make helpful announcements in a discord voice channel (rune spawning, stack timing, etc.). Guaranteed to raise your MMR by 3154 or your money back!

## Start application
- Make sure your `node --version` is at least v18.15.0
- `npm install`
- `npm start`
### Development
- `npm run start:dev` or `npm run test:dev` for hot reloading
- `npm run lint` to identify & fix linting issues

## Dependencies
### Dota 2 Game State Integration
Steam Library -> Right click Dota 2 -> Properties
- General -> Launch Options -> Add `-gamestateintegration` to launch options
- Local Files -> Browse... mkdir `game\dota\cfg\gamestate_integration\` and copy/paste `gamestate_integration_dota2-gsi.cfg` file into it 
### Discord
- Create and add a discord bot to your server. [(src, Step 1)](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
- Scope: bot. Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
- Create a `.env` file with from copying `.env.sample` and change relevant values

## Architecture
### Node and Typescript
When `npm start` is run, it will first run `tsc` which will transpile typescript files in the `src` directory to javascript in the `dist` directory
### How things fit together
- `index.ts` creates a `dota2-gsi` server
- `events/*Handler.ts` forwards the GSI data to all interested events (i.e. `runes` and `stack`)
- `events/<event>/index.ts` (i.e. `events/stack/index.ts`) returns a `SideEffect` object for the `*Handler` to `execute()`
- note optional `event/<event>/logic.ts` files should do all of the pure game-related logic so it's easy to test
- `SideEffect` objects interact with state such as Discord in `announce.ts`

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

## Product Management
- See Github Projects page for project roadmap
- Stories start in the `Icebox`, and get prioritize into `To Do`. They then flow through `In Progress` and `Done`
- Commits are tagged with the story they correspond to

## Contributing
If you see a typo or have any ideas for a cool feature, open a github issue and let us know!
If you know how to code, feel free to peruse our fine selection of open issues and leave a comment to stake claim on any that appeal to you
