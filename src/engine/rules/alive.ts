import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen when student is alive
 */
export default function alive(rule: Rule) {
    return new Rule({
        label: rule.label,
        trigger: [topics.alive, ...rule.trigger],
        given: rule.given,
        when: (trigger, given) => {
            const aliveValue = trigger.shift();
            return aliveValue && rule.when(trigger, given);
        },
        then: (trigger, given) => {
            trigger.shift();
            return rule.then(trigger, given);
        },
    });
}
