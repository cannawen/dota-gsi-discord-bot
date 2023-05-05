import Fact from "../Fact";
import Rule from "../Rule";
import topicManager from "../topicManager";
import topics from "../../topics";

/**
 * This rule will happen every `interval` seconds when we are in a game
 */
export default function everyIntervalSeconds(
    interval: number,
    reminderTopicString: string,
    rule: Rule
) {
    const reminderTopic = topicManager.createTopic<number>(
        `${reminderTopicString}ReminderTopic`
    );
    return new Rule({
        label: rule.label,
        trigger: [topics.time, topics.inGame, ...rule.trigger],
        given: [reminderTopic, ...rule.given],
        when: (trigger, given) => {
            const time = trigger.shift();
            const inGame = trigger.shift();
            const reminder = given.shift();
            const isReminderTime =
                reminder === undefined || time - reminder === interval;
            return inGame && isReminderTime && rule.when(trigger, given);
        },
        then: (trigger, given) => {
            const time = trigger.shift();
            trigger.shift();
            given.shift();
            return [
                ...rule.thenArray(trigger, given),
                new Fact(reminderTopic, time),
            ];
        },
    });
}
