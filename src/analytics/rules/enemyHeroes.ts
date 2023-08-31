import analytics from "../analytics";
import isLiveGame from "../../engine/rules/isLiveGame";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    new Rule({
        label: "analytics/enemy_heroes_time",
        trigger: [topics.allEnemyHeroes],
        given: [topics.time, topics.studentId],
        // Analytics being called on end game as well for unknown reasons
        // Only trigger this analytics event if we parse heroes before 10 minutes
        when: (_, [time]) => time < 10 * 60,
        then: ([heroes], [time, studentId]) => {
            analytics.mixpanel?.track("enemy heroes", {
                distinct_id: studentId,
                heroes: heroes,
                gameTime: time,
            });
        },
    }),
].map(isLiveGame);
