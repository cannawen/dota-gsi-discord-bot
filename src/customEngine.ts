import GsiData from "./gsi/GsiData";
import topics from "./topics";
import { Engine, Fact } from "./Engine";

class CustomEngine extends Engine {
    public setGsi(data: GsiData) {
        this.set(new Fact(topics.gsiData, data));
    }
}

const engine = new CustomEngine();

export default engine;
