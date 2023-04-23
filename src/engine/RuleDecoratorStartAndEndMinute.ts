import Rule from "./Rule";
import RuleDecoratorInGame from "./RuleDecoratorInGame";
import topics from "../topics";

class RuleDecoratorStartAndEndMinute extends Rule {
    constructor(min: number | undefined, max: number | undefined, rule: Rule) {
        const inGameRule = new RuleDecoratorInGame(rule);
        super(inGameRule.label, inGameRule.given, (get) => {
            const time = get(topics.time)!;
            if (min && time < min * 60) {
                return;
            }
            if (max && time > max * 60) {
                return;
            }

            return inGameRule.then(get);
        });
    }
}

export default RuleDecoratorStartAndEndMinute;
