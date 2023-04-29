import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.gsi.provider,
    trigger: [topics.allData],
    then: ([data]) => {
        const provider = data.provider;
        if (provider) {
            return new Fact(topics.timestamp, provider.timestamp);
        }
    },
});
