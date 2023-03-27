import Topic from "./Topic";

/**
 * A `Fact` describes a topic and value (i.e. Time is the number 5)
 */

export default class Fact<Type> {
    public topic: Topic<Type>;
    public value: Type;

    public constructor(topic: Topic<Type>, value: Type) {
        this.topic = topic;
        this.value = value;
    }
}
