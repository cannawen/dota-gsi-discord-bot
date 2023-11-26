import Rule from "../Rule";
import topics from "../../topics";

/**
 * This rule will happen when we are in a game and the time is not 0
 */
export default function inGame(rule: Rule) {
    return new Rule({
        label: rule.label,
        trigger: rule.trigger,
        given: [topics.inGame, topics.time, ...rule.given],
        when: (trigger, g) => {
            const given = [...g];
            const inGame = given.shift() || false;
            const time = given.shift();
            const timeCheck = time !== undefined && time > 0;
            return rule.when(trigger, given) && inGame && timeCheck;
        },
        then: (trigger, g) => {
            const given = [...g];
            given.shift();
            given.shift();
            return rule.then(trigger, given);
        },
    });
}
