import SideEffectInfo, {
    Type,
} from "../SideEffectInfo";
import discord from "../discord";
import effects from "../effectsRegistry";

effects.register(Type.TTS, (info: SideEffectInfo) => {
    if (info.data) {
        discord.playTTS(info.data);
    }
});
