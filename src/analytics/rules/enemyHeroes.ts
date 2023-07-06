import analytics from "../analytics";
import isLiveGame from "../../engine/rules/isLiveGame";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    new Rule({
        label: "analytics/enemy_heroes_time",
        trigger: [topics.allEnemyHeroes],
        given: [topics.time],
        then: (_, [time]) => {
            analytics.mixpanel?.track("enemy heroes", { time });
        },
    }),
].map(isLiveGame);
