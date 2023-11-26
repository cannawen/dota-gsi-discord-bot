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
        when: (t, given) => {
            const trigger = [...t];
            const aliveValue = trigger.shift();
            return aliveValue && rule.when(trigger, given);
        },
        then: (t, given) => {
            const trigger = [...t];
            trigger.shift();
            return rule.then(trigger, given);
        },
    });
}
