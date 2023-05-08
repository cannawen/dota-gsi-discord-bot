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
        `${rule.label}ReminderTopic`
    );
    return betweenSeconds(
        startTime,
        endTime,
        new Rule({
            label: rule.label,
            trigger: [topics.time, topics.inGame, ...rule.trigger],
            given: [reminderTopic, ...rule.given],
            when: (trigger, given) => {
                const time = trigger.shift();
                const inGame = trigger.shift();
                const reminder = given.shift();
                // This line is a bit fragile, especially for testing.
                // time - reminder must be EXACTLY equal to interval, and if it is over, it all breaks.
                // Is this preferable to >= interval; and having the time slowly drift away?
                // Should we refactor this so there is a properly defined start and end time with interval?
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
        })
    );
}
