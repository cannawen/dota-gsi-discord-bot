import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.gsi.player,
    trigger: [topics.allData],
    then: ([data]) => {
        const player = data.player;
        if (player) {
            return [
                new Fact(topics.gold, player.gold),
                new Fact(topics.team, player.team),
            ];
        }
    },
});
