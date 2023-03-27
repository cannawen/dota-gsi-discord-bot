import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topic from "../topic";

export default new Rule(
    "gsi/time",
    [topic.gsiData],
    (get) => new Fact(topic.time, get(topic.gsiData)?.time)
);
