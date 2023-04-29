import Rule from "./Rule";
import topics from "../topics";

/**
 * This rule will happen when we are in a game and the time is not 0
 */
class RuleDecoratorInGame extends Rule {
    constructor(rule: Rule) {
        super({
            label: rule.label,
            trigger: rule.trigger,
            given: rule.given,
            when: (trigger, given, get) => {
                const ruleWhen = rule.when(trigger, given, get);
                const inGame = get(topics.inGame) || false;
                const time = get(topics.time);
                const timeCheck = time !== undefined && time > 0;
                return ruleWhen && inGame && timeCheck;
            },
            then: rule.then,
            defaultValues: rule.defaultValues,
        });
    }
}

export default RuleDecoratorInGame;
