import analytics from "../analytics";
import isLiveGame from "../../engine/rules/isLiveGame";
import Rule from "../../engine/Rule";
import topics from "../../topics";

export default [
    new Rule({
        label: "analytics/enemy_heroes_time",
        trigger: [topics.allEnemyHeroes],
        given: [topics.time],
        then: ([heroes], [time]) => {
            analytics.mixpanel?.track("enemy heroes", { heroes, time });
        },
    }),
].map(isLiveGame);
