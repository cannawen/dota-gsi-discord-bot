import Rule from "../Rule";
import RuleDecoratorStartAndEndMinute from "./RuleDecoratorStartAndEndMinute";

/**
 * This rule will happen at `time` minutes when we are in a game.
 */
export default function atMinute(time: number, rule: Rule) {
    const startEndRule = new RuleDecoratorStartAndEndMinute(time, time, rule);
    return new Rule({
        label: startEndRule.label,
        trigger: startEndRule.trigger,
        given: startEndRule.given,
        when: startEndRule.when,
        then: startEndRule.then,
        defaultValues: startEndRule.defaultValues,
    });
}
