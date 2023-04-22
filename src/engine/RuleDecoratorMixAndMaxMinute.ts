import Rule from "./Rule";
import topics from "../topics";

class RuleDecoratorMinAndMaxMinute extends Rule {
    constructor(min: number | undefined, max: number | undefined, rule: Rule) {
        super(rule.label, rule.given, (get) => {
            const time = get(topics.time)!;
            if (min && time < min * 60) {
                return;
            }
            if (max && time > max * 60) {
                return;
            }

            return rule.then(get);
        });
    }
}

export default RuleDecoratorMinAndMaxMinute;
