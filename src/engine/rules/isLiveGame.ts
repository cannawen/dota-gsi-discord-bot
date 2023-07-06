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
        when: (trigger, given) => trigger.shift() && rule.when(trigger, given),
        then: (trigger, given) => {
            trigger.shift();
            return rule.then(trigger, given);
        },
    });
}
