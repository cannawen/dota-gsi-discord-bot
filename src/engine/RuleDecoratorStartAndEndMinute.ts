import Rule from "./Rule";
import RuleDecoratorInGame from "./RuleDecoratorInGame";
import topics from "../topics";

/**
 * This rule will only trigger between start and end time (inclusive)
 * Will not trigger if we are not in a game, or if time is 0
 */
class RuleDecoratorStartAndEndMinute extends Rule {
    constructor(min: number | undefined, max: number | undefined, rule: Rule) {
        const inGameRule = new RuleDecoratorInGame(rule);
        super({
            label: inGameRule.label,
            trigger: [topics.time, ...inGameRule.trigger],
            given: inGameRule.given,
            when: (trigger, given, get) => {
                const time = trigger.shift();
                if (min && time < min * 60) {
                    return false;
                }
                if (max && time > max * 60) {
                    return false;
                }
                return inGameRule.when(trigger, given, get);
            },
            then: (trigger, given, get) => {
                trigger.shift();
                return inGameRule.then(trigger, given, get);
            },
            defaultValues: inGameRule.defaultValues,
        });
    }
}

export default RuleDecoratorStartAndEndMinute;
