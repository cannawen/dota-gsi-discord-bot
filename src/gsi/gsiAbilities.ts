import Ability from "../gsi-data-classes/Ability";
import Fact from "../engine/Fact";
import GsiData from "./GsiData";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule({
    label: rules.gsi.hero,
    trigger: [topics.allData],
    then: ([data]) => {
        const abilities = (data as GsiData).abilities;
        if (abilities) {
            return new Fact(topics.abilities, abilities.map(Ability.create));
        }
    },
});
