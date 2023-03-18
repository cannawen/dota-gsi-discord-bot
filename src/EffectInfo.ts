import EffectType from "./EffectType";

// TODO have static constructor for each effect type
export default class EffectInfo {
    type: EffectType;
    data: string | null;

    constructor(type: EffectType, data: string | null) {
        this.type = type;
        this.data = data;
    }
}
