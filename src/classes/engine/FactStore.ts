import Fact from "./Fact";
import log from "../../log";
import Topic from "./Topic";

export default class FactStore {
    private facts = new Map<Topic<unknown>, Fact<unknown>>();

    public get = <T>(topic: Topic<T>): T | undefined => {
        const fact = this.facts.get(topic);
        if (fact && fact.value !== undefined) {
            // Casting to T is safe here because when it is set,
            // The fact's topic is used as a key
            return fact.value as T;
        } else {
            log.debug("rules", "No value for fact %s", topic.label.yellow);
            return undefined;
        }
    };

    public set = (fact: Fact<unknown>) => {
        this.facts.set(fact.topic, fact);
    };
}
