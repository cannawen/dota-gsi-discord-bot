import betweenSeconds from "../engine/rules/betweenSeconds";
import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.tp,
    "TP Scroll",
    "Reminds to buy a TP if you are missing one",
    EffectConfig.PRIVATE
);

const TIME_TO_START_WARNING_ABOUT_TP = 5 * 60 + 30;
const WARN_ABOUT_TP_INTERVAL = 60;

const shouldBuyTeleportTopic = topicManager.createTopic<boolean>(
    "shouldBuyTeleportTopic"
);

export default [
    new Rule({
        label: "set state that you should buy teleport when you don't have one but you have enough gold",
        trigger: [topics.items, topics.gold],
        then: ([items, gold]) =>
            new Fact(
                shouldBuyTeleportTopic,
                (items as PlayerItems).teleport === null && gold >= 100
            ),
    }),
    conditionalEveryIntervalSeconds(
        WARN_ABOUT_TP_INTERVAL,
        configurable(
            configInfo.ruleIndentifier,
            new Rule({
                label: "remind you to buy a teleport scroll when should buy state set to true",
                trigger: [shouldBuyTeleportTopic],
                when: ([shouldBuy]) => shouldBuy,
                then: () => new Fact(topics.configurableEffect, "Buy a teleport scroll."),
            })
        )
    ),
]
    .map((rule) =>
        betweenSeconds(TIME_TO_START_WARNING_ABOUT_TP, undefined, rule)
    )
    .map(inGame);
