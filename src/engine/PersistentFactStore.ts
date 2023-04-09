import Fact from "./Fact";
import FactStore from "./FactStore";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";
import topicManager from "./topicManager";

function filter(
    facts: Map<Topic<unknown>, Fact<unknown>>,
    persistenceParam:
        | "persistAcrossGames"
        | "persistAcrossRestarts"
        | "persistForever"
) {
    return Array.from(facts.values()).filter(
        (fact) =>
            fact.topic instanceof PersistentTopic &&
            fact.topic[persistenceParam]
    );
}

export function factsToPlainObject(facts: Fact<unknown>[]) {
    return facts.reduce((memo: { [key: string]: unknown }, fact) => {
        memo[fact.topic.label] = fact.value;
        return memo;
    }, {});
}

export function plainObjectToFacts(object: { [key: string]: unknown }) {
    return Object.entries(object).reduce(
        (memo: Fact<unknown>[], [topicLabel, value]) => {
            memo.push(new Fact(topicManager.findTopic(topicLabel), value));
            return memo;
        },
        []
    );
}

export default class PersistentFactStore extends FactStore {
    public updatePersistentFactsAcrossGames() {
        this.facts = filter(this.facts, "persistAcrossGames").reduce(
            (memo: Map<Topic<unknown>, Fact<unknown>>, fact) => {
                memo.set(fact.topic, fact);
                return memo;
            },
            new Map()
        );
    }

    public getPersistentFactsAcrossRestarts() {
        return filter(this.facts, "persistAcrossRestarts");
    }

    public getPersistentForeverFacts() {
        return filter(this.facts, "persistForever");
    }
}
