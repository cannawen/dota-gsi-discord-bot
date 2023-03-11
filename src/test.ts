import announce from "./announce";
import path from "node:path";

// eslint-disable-next-line no-magic-numbers
setInterval(() => announce(path.join(__dirname, "../audio/runes/bounty_runes.wav")), 5000);
