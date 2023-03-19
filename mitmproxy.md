# mitmproxy
Goal: to develop the app without having dota open  
[Official site](https://mitmproxy.org/)
- `brew install mitmproxy`
- change your gsi configuration to point to mitmproxy at "http://localhost:8080/gsi" (instead of port 9001)
- run mitmproxy (instructions below)
- mitmproxy will capture all network calls from gsi and pass it through to our app, and we can save the network calls to replay in the future.

## run proxy behind the scenes
`mitmdump --mode reverse:http://localhost:9001`

## run proxy w/ web interface
`mitmweb --mode reverse:http://localhost:9001`  
(can save a flow via the web interface)

## run proxy and dump to a file
`mitmdump --mode reverse:http://localhost:9001 -w flow_file`

## replay some file
`mitmdump -C flow_file`  
see `mitmproxy-flows` folders for currently saved flows