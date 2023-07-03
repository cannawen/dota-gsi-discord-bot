import betweenSeconds from "./betweenSeconds";
import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen every `interval` seconds
 * Starts at `startTime` and ends at `endTime` (inclusive)
 * Will not trigger if we are not in a game, or if time is 0
 */
export default function everyIntervalSeconds(
    startTime: number | undefined,
    endTime: number | undefined,
    interval: number,
    rule: Rule
) {
    return betweenSeconds(
        startTime,
        endTime,
        new Rule({
            label: rule.label,
            trigger: [topics.time, ...rule.trigger],
            given: rule.given,
            when: (trigger, given) => {
                const time = trigger.shift();
                return (
                    // If time is a multiple of interval
                    (time - (startTime || 0)) % interval === 0 &&
                    rule.when(trigger, given)
                );
            },
            then: (trigger, given) => {
                trigger.shift();
                return rule.thenArray(trigger, given);
            },
        })
    );
}
