import Fact from "./Fact";
import log from "../log";
import Topic from "./Topic";

export default class FactStore {
    private facts = new Map<string, Fact<unknown>>();

    public get = <T>(topic: Topic<T>): T | undefined => {
        const fact = this.facts.get(topic.label);
        if (fact && fact.value !== undefined) {
            // Casting to T is safe here because when it is set,
            // The fact's topic is used as a key
            return fact.value as T;
        } else {
            log.debug("rules", "No value for fact %s", topic.label.yellow);
            return undefined;
        }
    };

    /**
     * WARNING: Directly setting on a fact store will bypass the engine logic
     * @param fact
     */
    public set = (fact: Fact<unknown>) => {
        this.facts.set(fact.topic.label, fact);
    };

    public getPersistentFacts() {
        return Array.from(this.facts)
            .filter(([_key, value]) => value.topic.persist)
            .reduce((memo: { [key: string]: unknown }, [key, value]) => {
                memo[key] = value.value;
                return memo;
            }, {});
    }

    public setPersistentFacts(data: { [key: string]: unknown }) {
        Object.entries(data)
            .map(([key, value]) => new Fact(new Topic(key, true), value))
            .forEach(this.set);
    }
}
