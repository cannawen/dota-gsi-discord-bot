import discord from "../discord";
import EffectInfo from "../EffectInfo";
import effects from "../effectsRegistry";
import EffectType from "../EffectType";
import path from "node:path";

effects.register(EffectType.AUDIO_FILE, (info: EffectInfo) => {
    if (info.data) {
        discord.playAudioFile(path.join(__dirname, "../../audio/", info.data));
    }
});
