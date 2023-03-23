# Development

-   `npm run start:dev` or `npm run test:dev` for hot reloading
-   `npm run lint` to identify & fix linting issues
-   When a change is pushed to `cannawen/node-gsi#master` on github and you want the newest version, use `npm update`

## Node and Typescript

When `npm start` is run, it will first run `tsc` which will transpile typescript files in the `src` directory to javascript in the `build` directory

## Logging

-   Use winston loggers from `log.ts`. New "labels" are created for loggers on the fly
-   Loggers use environment variables to determine log levels (it defaults to `info` if env variable is not set)
-   Colors from @colors/colors may also be used to describe a label
-   See sample.env for usage example

## Architecture

-   In general, there are three main sections of the app
    -   GSI that takes data form Valve's Game State integration and parses it to a form we can use (Time, Items)
    -   Assistants (Roshan, Runes) that use that take that data and returns an effect (Audio file, Text to speech)
    -   An Effect that knows how to execute the desired effect (playing audio on discord)
-   These three sections communicate via a single key-value database where a `Topic<T>` points to a `Fact<T>`
-   A `Topic<T>` is the concept of a type of data (i.e. `Time is a number` or `AudioFile is a string`)
-   A `Fact<T>` is the combination of a Topic and a concrete value (i.e. `Time is the number 5` or `AudioFile is the string foo.mp3`)
-   A module may register a rule with the `Engine` by telling it what topics it is interested in, and what function to run when the database values of those topics change
-   A module may read from the database and return new key-value pairs to store in the database.

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

`mitmdump -C flow_file`  
see `mitmproxy-flows` folders for currently saved flows

## Code Formatting

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
