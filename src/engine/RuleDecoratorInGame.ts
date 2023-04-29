import Rule from "./Rule";
import topics from "../topics";

/**
 * This rule will happen when we are in a game and the time is not 0
 */
class RuleDecoratorInGame extends Rule {
    constructor(rule: Rule) {
        super({
            label: rule.label,
            trigger: rule.trigger,
            given: [topics.inGame, topics.time, ...rule.given],
            when: (trigger, given) => {
                const inGame = given.shift() || false;
                const time = given.shift();
                const timeCheck = time !== undefined && time > 0;
                return rule.when(trigger, given) && inGame && timeCheck;
            },
            then: (trigger, given) => {
                given.shift();
                given.shift();
                return rule.then(trigger, given);
            },
            defaultValues: rule.defaultValues,
        });
    }
}

export default RuleDecoratorInGame;
