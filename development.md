# Development
## Node and Typescript
When `npm start` is run, it will first run `tsc` which will transpile typescript files in the `src` directory to javascript in the `dist` directory

## Logging
- Use loggers from `log.ts`. New "labels" are created for loggers on the fly  
- Loggers use environment variables to determine log levels (it default to `info` if env variable is not set)
- See sample.env for usage example
- 
## What is happening
- In general, there are three main sections of the app
  - GSI that takes data form Valve's Game State integration and parses it to a form we can use (Time, Items)
  - Assistants (Roshan, Trusty Shovel) that use that take the parsed data (Time, Items) and returns an effect (Audio File, TTS)
  - An Effect that knows how to execute the desired effect (playing audio on discord)
- These three sections communicate via `broker` using `Topic`s.
- `Topic`s represent the kind of data one may produce and/or consume and their type.
- The GSI server starts and produces a `Topic.GSI_DATA_LIVE` to the broker
- Code in `gsi/` consume `Topic.GSI_DATA_LIVE` and produce their own topics as an output, such as `Topic.DOTA_2_TIME`
- Code in `assistants/` consume topics such as `Topic.DOTA_2_TIME` and produce effects like `Topic.EFFECT_PLAY_FILE`
- Code in `effects/` consume the effect and produce no outputs to the broker (but have side effects)
Note: There is no special requirement for the code to be separated into these three sections; a component can declare they want to consume a `Topic.GSI_DATA` and produce a `Topic.EFFECT_PLAY_FILE` if they wish. It is currently just separated into different folders for logical reasons

## mitmproxy
Goal: to develop the app without having dota open  
- install [mitmproxy](https://mitmproxy.org/)
- add new gsi configuration to point to mitmproxy at "http://localhost:8080/gsi" (instead of port 9001)
- run mitmproxy (instructions below)
- mitmproxy will capture all network calls from gsi and pass it through to our app, and we can save the network calls to replay in the future.
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
