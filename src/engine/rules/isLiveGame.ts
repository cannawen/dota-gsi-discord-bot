import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen only for live games.
 */
export default function isLiveGame(rule: Rule) {
    return new Rule({
        label: rule.label,
        trigger: [topics.gsiEventsFromLiveGame, ...rule.trigger],
        given: rule.given,
        when: (t, given) => {
            const trigger = [...t];
            return trigger.shift() && rule.when(trigger, given);
        },
        then: (t, given) => {
            const trigger = [...t];
            trigger.shift();
            return rule.then(trigger, given);
        },
    });
}
