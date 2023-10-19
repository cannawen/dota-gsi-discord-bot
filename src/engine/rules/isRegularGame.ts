import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen only for regular games (not customs).
 */
export default function isRegularGame(rule: Rule) {
    return new Rule({
        label: rule.label,
        trigger: rule.trigger,
        given: [topics.customGameName, ...rule.given],
        when: (trigger, given) =>
            given.shift()?.length === 0 && rule.when(trigger, given),
        then: (trigger, given) => {
            given.shift();
            return rule.then(trigger, given);
        },
    });
}
