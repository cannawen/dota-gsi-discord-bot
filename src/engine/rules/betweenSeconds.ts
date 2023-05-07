import inGame from "./inGame";
import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will only trigger between start and end time (inclusive)
 * Will not trigger if we are not in a game, or if time is 0
 */
export default function betweenSeconds(
    min: number | undefined,
    max: number | undefined,
    rule: Rule
) {
    const inGameRule = inGame(rule);
    return new Rule({
        label: inGameRule.label,
        trigger: [topics.time, ...inGameRule.trigger],
        given: inGameRule.given,
        when: (trigger, given) => {
            const time = trigger.shift();
            if (min && time < min) {
                return false;
            }
            if (max && time > max) {
                return false;
            }
            return inGameRule.when(trigger, given);
        },
        then: (trigger, given) => {
            trigger.shift();
            return inGameRule.then(trigger, given);
        },
    });
}
