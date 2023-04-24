import Rule from "./Rule";
import topics from "../topics";

/**
 * This rule will happen when we are in a game and the time is not 0
 */
class RuleDecoratorInGame extends Rule {
    constructor(rule: Rule) {
        super(
            rule.label,
            [...rule.given, topics.inGame, topics.time],
            (get) => {
                if (get(topics.inGame) && get(topics.time) !== 0) {
                    return rule.then(get);
                }
            }
        );
    }
}

export default RuleDecoratorInGame;
