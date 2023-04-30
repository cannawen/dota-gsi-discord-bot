import Fact from "./Fact";
import Topic from "./Topic";

export default class FactStore {
    protected facts = new Map<string, Fact<unknown>>();

    /**
     * WARNING: directly using this function will bypass default value engine logic
     * Use with extreme caution
     */
    public get = <T>(topic: Topic<T>): T | undefined => {
        const fact = this.facts.get(topic.label);
        if (fact) {
            // Casting to T is safe here because when it is set,
            // The fact's topic is used as a key
            return fact.value as T;
        } else {
            return undefined;
        }
    };

    /**
     * WARNING: Directly using this function will bypass the engine logic
     * Use with extreme caution
     * @param fact
     */
    public set = (fact: Fact<unknown>) => {
        if (fact.value === undefined) {
            this.facts.delete(fact.topic.label);
        } else {
            this.facts.set(fact.topic.label, fact);
        }
    };

    /**
     * WARNING: This is only used for tests
     */
    public getAllFacts(): Fact<unknown>[] {
        return Array.from(this.facts.values());
    }
}
