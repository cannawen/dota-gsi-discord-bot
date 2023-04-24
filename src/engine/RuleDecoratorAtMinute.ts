import Rule from "./Rule";
import RuleDecoratorInGame from "./RuleDecoratorInGame";
import topics from "../topics";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
class RuleDecoratorAtMinute extends Rule {
    constructor(time: number, rule: Rule) {
        const inGameRule = new RuleDecoratorInGame(rule);
        super(inGameRule.label, inGameRule.given, (get) => {
            if (get(topics.time) === time * 60) {
                return inGameRule.then(get);
            }
        });
    }
}

export default RuleDecoratorAtMinute;
