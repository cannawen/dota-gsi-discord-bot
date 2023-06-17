# Development

-   Set up your Discord bot dependencies and .env file (see Discord section below for details)
-   `npm install`
-   `npm run build`
-   `npm start`

---

-   Make sure your `node --version` is at least v18.15.0
-   `npm run start:dev` or `npm run test:dev` for hot reloading
-   See [production page](production.md) for deploy details

## Node and Typescript

When `npm start` is run, it will first run `tsc` which will transpile typescript files in the `src` directory to javascript in the `build` directory. `rimraf` is used to `rm -rf` the build directory between builds

## Dependencies

### Discord

-   Create and add a discord bot to your server. [(src, Step 1)](https://www.digitalocean.com/community/tutorials/how-to-build-a-discord-bot-with-node-js)
-   Scope: bot. Bot Permissions: Read Messages/View Channels, Read Message History, Connect, Speak, Use Voice Activity
-   [Enable developer mode](https://support.discord.com/hc/en-us/articles/206346498) so you can easily see user/guild/channel IDs
-   Create a `.env` file by copying `sample.env`
    -   Change `DISCORD_BOT_TOKEN` to your OAuth2 -> Client Secret
    -   Change `DISCORD_APPLICATION_ID` to your Oauth2 -> Client ID
    -   Choose a random key for `STUDENT_ID_HASH_PRIVATE_KEY` (Discord user IDs are public information; we hash the Discord ID using this key so one user cannot pretend to be another)
-   [Reference discord.js tutorial](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration)

### node-gsi

-   When a change is pushed to `cannawen/node-gsi#master` on github and you want the newest version, use `npm update`

## Logging

-   Use winston loggers from `log.ts`. New "labels" are created for loggers on the fly
-   Loggers use environment variables to determine log levels (it defaults to `info` if env variable is not set)
-   Colors from @colors/colors may also be used to describe a label
-   See sample.env for usage example

## Architecture

-   In general, there are three main sections of the app
    -   GSI that takes data form Valve's Game State integration and parses it to a form we can use (Time, Items)
    -   Assistants (Roshan, Runes) that use that take that data and returns an effect (Audio file, Text to speech)
    -   An Effect that knows how to execute the desired effect (playing audio on discord, playing audio on website)
-   These three sections communicate via a key-value database `FactStore` (one per student) where a `Topic<T>.label` points to a `Fact<T>`
-   A `PersistentTopic<T>` is a subclass of `Topic<T>` has 3 forms of persistences that will be remembered forever, across games, or across restarts.
-   A `Topic<T>` is the concept of a type of data (i.e. `Time is a number` or `AudioFile is a string`)
-   A `Fact<T>` is the combination of a Topic and a concrete value (i.e. `Time is the number 5` or `AudioFile is the string foo.mp3`)
-   A module may register a `Rule` with the `Engine` by telling it what topics it is interested in, and what code to execute when the values of those topics change. If any interested topics' values are `undefined`, the rule will not be executed.
-   A module may get data from the engine and return new `Fact`s to store in the engine.
-   Technical note: When a module gets data from the engine, it may mutate the data directly instead of returning a new key-value pair but this will bypass the rules of the engine and downstream rules will not be notified of the change. Current solution: store appropriate types as `DeeplyReadonly`. See issue #39 for details

Note: From the engine's perspective, there is no inherent requirement for the code to be separated into these three sections. It is currently just separated for logical reasons

## mitmproxy

Goal: to develop the app without having dota open

-   install [mitmproxy](https://mitmproxy.org/)
-   add new gsi configuration to point to mitmproxy at "http://localhost:8080/gsi" (instead of port 9001)
-   run mitmproxy (instructions below)
-   mitmproxy will capture all network calls from gsi and pass it through to our app, and we can save the network calls to replay in the future.

### run proxy behind the scenes

`mitmdump --mode reverse:http://localhost:9001`

### run proxy w/ web interface

`mitmweb --mode reverse:http://localhost:9001`  
(can save a flow via the web interface)

### run proxy and dump to a file

`mitmdump --mode reverse:http://localhost:9001 -w flow_file`

### replay some file

`mitmdump -nC flow_file`  
see [mitmproxy-flows](/mitmproxy-flows) for currently saved flows. You will need to change the auth token stored in the flow files to have associated with your discord user

### replay some file and redirect to a different host

The flows are set to localhost:9001, but we want to send the requests to dota-coach.fly.dev
`mitmdump -M "|~all|http://localhost:9001/gsi|http://dota-coach.fly.dev/gsi" -nC flow_file`

## Code Formatting

-   `npm run lint` and `npm run format` to identify & fix linting issues
-   Using many `eslint` rules [(src 1)](https://eslint.org/docs/latest/rules/) [(src 2)](https://eslint-config.netlify.app/rules/yield-star-spacing)
-   Add to Visual Studio Code `settings.json` to auto-format [(src)](https://daveceddia.com/vscode-use-eslintrc/#:~:text=Configure%20VSCode%20Settings%20to%20use%20ESLint%20for%20Formatting&text=Click%20that%20tiny%20icon%20in,paper%20with%20a%20little%20arrow.&text=The%20first%20one%20turns%20on,it%2C%20we're%20done.)

```
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
}
```

-   While you're here, `"editor.minimap.enabled": false` removes the minimap view in VS code
-   `Jest Runner` and `Prettier - Code formatter.` are also recommended plugins
