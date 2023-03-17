import SideEffectInfo, {
    Type,
} from "../SideEffectInfo";
import discord from "../discord";
import effects from "./effects";

effects.register(Type.TTS, (info: SideEffectInfo) => {
    if (info.data) {
        discord.playTTS(info.data);
    }
});
