import Rule from "./Rule";
import RuleDecoratorInGame from "./RuleDecoratorInGame";
import topics from "../topics";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
class RuleDecoratorAtMinute extends Rule {
    constructor(time: number, rule: Rule) {
        const inGameRule = new RuleDecoratorInGame(rule);
        super(
            inGameRule.label,
            [topics.time, ...inGameRule.given],
            (get) => {
                if (get(topics.time) === time * 60) {
                    return inGameRule.then(get);
                }
            },
            (values, get) => {
                const dbTime = values.shift();
                return rule.when(values, get) && dbTime === time * 60;
            },
            (values, get) => {
                values.shift();
                return rule.action(values, get);
            },
            rule.defaultValues
        );
    }
}

export default RuleDecoratorAtMinute;
