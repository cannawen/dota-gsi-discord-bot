import Fact from "../engine/Fact";
import helper from "./assistantHelpers";
import Rule from "../engine/Rule";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const timeArrayTopic = topicManager.createTopic<number[]>("timeArray", {
    persistAcrossGames: true,
});

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
        const timeArray = [...(get(timeArrayTopic) || [])];
        if (inGame) {
            timeArray.push(time);
        }
        return new Fact(timeArrayTopic, timeArray);
    }),
    new Rule("debug_timeTracker_print", [topics.inGame], (get) => {
        const timeArray = get(timeArrayTopic) || [];
        if (get(topics.inGame) === false && timeArray.length > 0) {
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
