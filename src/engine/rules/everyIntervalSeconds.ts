import betweenSeconds from "./betweenSeconds";
import Fact from "../Fact";
import Rule from "../Rule";
import topicManager from "../topicManager";
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
    const reminderTopic = topicManager.createTopic<number>(
        `${rule.label}ReminderTopic`,
        { defaultValue: 0 }
    );
    return betweenSeconds(
        startTime,
        endTime,
        new Rule({
            label: rule.label,
            trigger: [topics.time, ...rule.trigger],
            given: [reminderTopic, ...rule.given],
            when: (trigger, given) => {
                const time = trigger.shift();
                const numberOfTimesReminded = given.shift();

                // If we somehow skip time, this rule will now "catch up" to speak all the missed events
                // Would be annoying if you jump around in a replay, but that's not really supported
                const lastRemindedTime =
                    interval * numberOfTimesReminded + (startTime || 0);
                const isReminderTime = time >= lastRemindedTime;

                return isReminderTime && rule.when(trigger, given);
            },
            then: (trigger, given) => {
                trigger.shift();
                const numberOfTimesReminded = given.shift();
                return [
                    ...rule.thenArray(trigger, given),
                    new Fact(reminderTopic, numberOfTimesReminded + 1),
                ];
            },
        })
    );
}
