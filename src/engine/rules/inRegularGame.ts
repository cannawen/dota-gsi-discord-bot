import inGame from "./inGame";
import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen only for regular games (not customs).
 */
export default function inRegularGame(rule: Rule) {
    return inGame(
        new Rule({
            label: rule.label,
            trigger: rule.trigger,
            given: [topics.customGameName, ...rule.given],
            when: (trigger, g) => {
                const given = [...g];
                return given.shift()?.length === 0 && rule.when(trigger, given);
            },
            then: (trigger, g) => {
                const given = [...g];
                given.shift();
                return rule.then(trigger, given);
            },
        })
    );
}
