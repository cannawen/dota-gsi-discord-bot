import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const timeArrayTopic = topicManager.createTopic<number[]>("timeArray");

function arrayFrom(start: number, end: number) {
    const arr = [];
    for (let i = start + 1; i < end; i++) {
        arr.push(i);
    }
    return arr;
}

export default [
    new Rule("debug_timeTracker", [topics.inGame, topics.time], (get) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        const timeArray = get(timeArrayTopic) || [];
        if (inGame) {
            // This straight up modifies the db so we don't need to return a new fact to change the array
            timeArray.push(time);
        }
    }),
    new Rule("debug_timeTracker_print", [topics.inGame], (get) => {
        if (!get(topics.inGame)!) {
            const timeArray = get(timeArrayTopic) || [];
            const missingTimes = timeArray.reduce(
                (memo: { prevTime: number; missingTimes: number[] }, time) => {
                    if (time === memo.prevTime + 1) {
                        return {
                            prevTime: time,
                            missingTimes: memo.missingTimes,
                        };
                    } else {
                        return {
                            prevTime: time,
                            missingTimes: [
                                ...memo.missingTimes,
                                ...arrayFrom(memo.prevTime, time),
                            ],
                        };
                    }
                },
                { prevTime: 0, missingTimes: [] }
            ).missingTimes;

            console.log(
                `Missing times: ${missingTimes
                    .map((time) => helper.secondsToTimeString(time))
                    .join(", ")}`
            );
            return new Fact(timeArrayTopic, undefined);
        }
    }),
];
