import EffectInfo from "../EffectInfo";
import EffectType from "../EffectType";
import discord from "../discord";
import effects from "../effectsRegistry";
import path from "node:path";

effects.register(EffectType.AUDIO_FILE, (info: EffectInfo) => {
    if (info.data) {
        discord.playAudioFile(path.join(__dirname, "../../audio/", info.data));
    }
});
