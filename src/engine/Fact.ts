import Topic from "./Topic";

/**
 * A `Fact` describes a topic and value (i.e. Time is the number 5)
 */
export default class Fact<T> {
    public readonly topic: Topic<T>;
    public readonly value: T;

    public constructor(topic: Topic<T>, value: T) {
        this.topic = topic;
        this.value = value;
    }
}
