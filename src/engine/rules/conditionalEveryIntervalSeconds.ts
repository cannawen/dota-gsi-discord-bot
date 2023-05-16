import betweenSeconds from "./betweenSeconds";
import Fact from "../Fact";
import Rule from "../Rule";
import topicManager from "../topicManager";
import topics from "../../topics";

export default function conditionalEveryIntervalSeconds(
    startTime: number | undefined,
    endTime: number | undefined,
    condition: (trigger: any[], given: any[]) => boolean,
    interval: number,
    rule: Rule
) {
    const reminderTopic = topicManager.createTopic<number>(
        `${rule.label}ReminderTimeTopic`
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
                const lastRemindedTime = given.shift();
                if (lastRemindedTime === undefined) {
                    return true;
                } else {
                    // If we somehow skip time, this rule will now "catch up" to speak all the missed events
                    // Would be annoying if you jump around in a replay, but that's not really supported
                    const isReminderTime = time >= lastRemindedTime + interval;

                    return isReminderTime && rule.when(trigger, given);
                }
            },
            then: (trigger, given) => {
                const time = trigger.shift();
                const lastRemindedTime = given.shift();

                if (condition(trigger, given)) {
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
        })
    );
}
