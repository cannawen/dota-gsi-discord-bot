import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen only for regular games (not customs).
 */
export default function isRegularGame(rule: Rule) {
    return new Rule({
        label: rule.label,
        trigger: [topics.customGameName, ...rule.trigger],
        given: rule.given,
        when: (trigger, given) =>
            trigger.shift()?.length === 0 && rule.when(trigger, given),
        then: (trigger, given) => {
            trigger.shift();
            return rule.then(trigger, given);
        },
    });
}
