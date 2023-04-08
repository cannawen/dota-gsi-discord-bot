import Fact from "./Fact";
import FactStore from "./FactStore";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";
import topics from "../topics";

function filter(
    facts: Map<Topic<unknown>, Fact<unknown>>,
    persistenceParam:
        | "persistAcrossGames"
        | "persistAcrossRestarts"
        | "persistForever"
) {
    return Array.from(facts.values())
        .filter((fact) => fact.topic instanceof PersistentTopic)
        .filter(
            (fact) => (fact.topic as PersistentTopic<unknown>)[persistenceParam]
        );
}

function serializeIntoMemo(
    memo: { [key: string]: unknown },
    fact: Fact<unknown>
) {
    memo[fact.topic.label] = fact.value;
    return memo;
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
        return filter(this.facts, "persistAcrossRestarts").reduce(
            serializeIntoMemo,
            {}
        );
    }

    public getPersistentForeverFacts() {
        return filter(this.facts, "persistForever").reduce(
            serializeIntoMemo,
            {}
        );
    }

    public deserializeAndSetFacts(data: { [key: string]: unknown }) {
        Object.entries(data)
            .map(([key, value]) => new Fact(topics.findTopic(key), value))
            .forEach(this.set);
    }
}
