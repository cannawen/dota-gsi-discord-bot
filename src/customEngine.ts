import { Engine, Fact } from "./Engine";
import GsiData from "./gsi/GsiData";
import topics from "./topics";

class CustomEngine extends Engine {
    public setGsi(data: GsiData) {
        this.set(new Fact(topics.gsiData, data));
    }
}

const engine = new CustomEngine();

export default engine;
