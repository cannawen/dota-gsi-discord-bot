import log from "./log";
import SideEffectInfo, {
    Type,
} from "./SideEffectInfo";

type SideEffectFunction = (info: SideEffectInfo) => void
const registry : Map <Type, SideEffectFunction> = new Map();

function register(type: Type, f: SideEffectFunction) {
    registry.set(type, f);
}

function invoke(info: SideEffectInfo | void) {
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
