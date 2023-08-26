import analytics from "../analytics";
import isLiveGame from "../../engine/rules/isLiveGame";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    new Rule({
        label: "analytics/enemy_heroes_time",
        trigger: [topics.allEnemyHeroes],
        given: [topics.time, topics.studentId],
        then: ([heroes], [time, studentId]) => {
            analytics.mixpanel?.track("enemy heroes", {
                distinct_id: studentId,
                heroes: [...heroes],
                time: time || "no time available",
            });
        },
    }),
].map(isLiveGame);
