import Fact from "./Fact";
import FactStore from "./FactStore";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";
import topics from "../topics";

export default class PersistentFactStore extends FactStore {
    // TODO these 3 functions can probably be collapsed
    public updatePersistentFactsAcrossGames() {
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

    public getPersistentForeverFacts() {
        return Array.from(this.facts.values())
            .filter((fact) => fact.topic instanceof PersistentTopic)
            .filter(
                (fact) =>
                    (fact.topic as PersistentTopic<unknown>).persistForever
            )
            .reduce((memo: { [key: string]: unknown }, fact) => {
                memo[fact.topic.label] = fact.value;
                return memo;
            }, {});
    }

    public setJSONFacts(data: { [key: string]: unknown }) {
        Object.entries(data)
            .map(([key, value]) => new Fact(topics.findTopic(key), value))
            .forEach(this.set);
    }
}
