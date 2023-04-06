import Fact from "./Fact";
import log from "../log";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";
import topics from "../topics";

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

    /**
     * WARNING: Directly setting on a fact store will bypass the engine logic
     * @param fact
     */
    public set = (fact: Fact<unknown>) => {
        this.facts.set(fact.topic, fact);
    };

    // TODO fact store is a bit sketch to know about persistence now.
    // Should we refactor persistence into its own subclass and only use that?
    // Like how we have Engine, but only use CustomEngine
    public removeNonPersistentGameState() {
        this.facts = Array.from(this.facts.values())
            .filter((fact) => fact.topic instanceof PersistentTopic)
            .filter(
                (fact) =>
                    (fact.topic as PersistentTopic<unknown>).persistAcrossGames
            )
            .reduce((memo: Map<Topic<unknown>, Fact<unknown>>, fact) => {
                memo.set(fact.topic, fact);
                return memo;
            }, new Map());
    }

    /**
     *
     * @returns map of all facts where the topic has persist=true
     */
    public getPersistentFactsAcrossRestarts() {
        return Array.from(this.facts.values())
            .filter((fact) => fact.topic instanceof PersistentTopic)
            .filter(
                (fact) =>
                    (fact.topic as PersistentTopic<unknown>)
                        .persistAcrossRestarts
            )
            .reduce((memo: { [key: string]: unknown }, fact) => {
                memo[fact.topic.label] = fact.value;
                return memo;
            }, {});
    }

    /**
     * TODO: not super sure about what's happening with types here; especially when we deserialize Classes
     * @param data facts to be turned into `Fact` objects
     */
    public setPersistentFactsAcrossRestarts(data: { [key: string]: unknown }) {
        Object.entries(data)
            .map(([key, value]) => new Fact(topics.findTopic(key), value))
            .forEach(this.set);
    }
}
