import Rule from "./Rule";
import RuleDecoratorStartAndEndMinute from "./RuleDecoratorStartAndEndMinute";
import topics from "../topics";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
class RuleDecoratorAtMinute extends Rule {
    constructor(time: number, rule: Rule) {
        const startEndRule = new RuleDecoratorStartAndEndMinute(
            time,
            time,
            rule
        );
        super({
            label: startEndRule.label,
            trigger: startEndRule.trigger,
            given: startEndRule.given,
            when: startEndRule.when,
            then: startEndRule.then,
            defaultValues: startEndRule.defaultValues,
        });
    }
}

export default RuleDecoratorAtMinute;
