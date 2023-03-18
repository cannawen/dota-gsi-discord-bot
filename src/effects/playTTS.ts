import EffectInfo from "../EffectInfo";
import EffectType from "../EffectType";
import discord from "../discord";
import effects from "../effectsRegistry";

effects.register(EffectType.TTS, (info: EffectInfo) => {
    if (info.data) {
        discord.playTTS(info.data);
    }
});
