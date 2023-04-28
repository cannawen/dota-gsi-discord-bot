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
            (values, get) => {
                const ruleWhen = rule.when(values, get);
                const inGame = get(topics.inGame) || false;
                const timeNot0 = get(topics.time) !== 0 || false;
                return ruleWhen && inGame && timeNot0;
            },
            rule.action,
            rule.defaultValues
        );
    }
}

export default RuleDecoratorInGame;
