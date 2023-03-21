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
    -   Assistants (Roshan, Trusty Shovel) that use that take that data and returns an effect (Audio File, Text to speech)
    -   An Effect that knows how to execute the desired effect (playing audio on discord)
-   These three sections communicate via `broker` using `Topic`s.
-   `Topic`s represent the kind of data one may produce and/or consume and their type.
-   The GSI server starts and produces a `Topic.GSI_DATA_LIVE` to the broker
-   Code in `gsi/` consume `Topic.GSI_DATA_LIVE` and produce their own topics as an output, such as `Topic.DOTA_2_TIME`
-   Code in `assistants/` consume topics such as `Topic.DOTA_2_TIME` and produce effects like `Topic.EFFECT_PLAY_FILE`
-   Code in `effects/` consume the effect and produce no outputs to the broker (but have side effects)

Note: From the broker's perspective, there is no inherent requirement for the code to be separated into these three sections; a component can declare they want to consume a `Topic.GSI_DATA` and produce a `Topic.EFFECT_PLAY_FILE` if they wish. It is currently just separated into different folders for logical reasons

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
    "eslint.format.enable": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
}
```

-   While you're here, `"editor.minimap.enabled": false` removes the minimap view in VS code
-   `Jest Runner` is also a very nice plugin to run a single test or test suite
