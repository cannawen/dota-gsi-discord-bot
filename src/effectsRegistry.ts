import EffectInfo from "./EffectInfo";
import EffectType from "./EffectType";
import log from "./log";

type SideEffectFunction = (info: EffectInfo) => void
const registry : Map <EffectType, SideEffectFunction> = new Map();

function register(type: EffectType, f: SideEffectFunction) {
    registry.set(type, f);
}

function invoke(info: EffectInfo | void) {
    if (info) {
        const f = registry.get(info.type);
        if (f) {
            f(info);
        } else {
            log.glue.error("Unable to enact side effect of type %s with data %s", info.type.red, info.data);
        }
    }
}

export default {
    invoke,
    register,
};
