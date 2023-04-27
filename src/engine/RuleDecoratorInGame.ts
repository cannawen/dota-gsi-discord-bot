import Rule from "./Rule";
import topics from "../topics";

/**
 * This rule will happen when we are in a game and the time is not 0
 */
class RuleDecoratorInGame extends Rule {
    constructor(rule: Rule) {
        super(
            rule.label,
            rule.given,
            (get) => {
                if (get(topics.inGame) && get(topics.time) !== 0) {
                    return rule.then(get);
                }
            },
            (_, get) => (get(topics.inGame) && get(topics.time) !== 0) || false,
            rule.action,
            rule.defaultValues
        );
    }
}

export default RuleDecoratorInGame;
