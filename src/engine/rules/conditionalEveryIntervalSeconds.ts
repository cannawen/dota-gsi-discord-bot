import Fact from "../Fact";
import Rule from "../Rule";
import topicManager from "../topicManager";
import topics from "../../topics";

/**
 * The first time `rule.when` is met, the `rule.then` is not applied
 * to give the user one `interval` time of grace before we start reminding them
 */
export default function conditionalEveryIntervalSeconds(
    interval: number,
    rule: Rule
) {
    const reminderTopic = topicManager.createTopic<number>(
        `${rule.label}ReminderTimeTopic`
    );
    return new Rule({
        label: rule.label,
        trigger: [topics.time, ...rule.trigger],
        given: [reminderTopic, ...rule.given],
        when: (trigger, given) => {
            const time = trigger.shift();
            const lastRemindedTime = given.shift();
            if (lastRemindedTime === undefined) {
                return true;
            } else {
                // If we somehow skip time, this rule will now "catch up" to speak all the missed events
                // Would be annoying if you jump around in a replay, but that's not really supported
                const isReminderTime = time >= lastRemindedTime + interval;

                return isReminderTime;
            }
        },
        then: (trigger, given) => {
            const time = trigger.shift();
            const lastRemindedTime = given.shift();

            if (rule.when(trigger, given)) {
                if (lastRemindedTime === undefined) {
                    return new Fact(reminderTopic, time);
                } else {
                    return [
                        ...rule.thenArray(trigger, given),
                        new Fact(reminderTopic, time),
                    ];
                }
            } else {
                return new Fact(reminderTopic, undefined);
            }
        },
    });
}
