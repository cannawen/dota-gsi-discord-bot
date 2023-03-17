import SideEffectInfo, {
    Type,
} from "../SideEffectInfo";

const registry = new Map();

type SideEffectFunction = (info: SideEffectInfo) => void

function register(type: Type, f: SideEffectFunction) {
    registry.set(type, f);
}

function invoke(info: SideEffectInfo | void) {
    if (info) {
        registry.get(info.type)(info);
    }
}

export default {
    invoke,
    register,
};
