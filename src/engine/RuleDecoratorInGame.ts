import Rule from "./Rule";
import topics from "../topics";

class RuleDecoratorInGame extends Rule {
    constructor(rule: Rule) {
        super(rule.label, rule.given, (get) => {
            if (get(topics.inGame) && get(topics.time) !== 0) {
                return rule.then(get);
            }
        });
    }
}

export default RuleDecoratorInGame;
