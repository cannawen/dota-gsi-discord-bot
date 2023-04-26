import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.gsi.provider, [topics.allData], (get) => {
    const provider = get(topics.allData)!.provider;
    if (provider) {
        return new Fact(topics.timestamp, provider.timestamp);
    }
});
