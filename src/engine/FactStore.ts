import Fact from "./Fact";
import Topic from "./Topic";

export default class FactStore {
    protected facts = new Map<string, Fact<unknown>>();

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
     * WARNING: Directly setting on a fact store will bypass the engine logic
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
}
