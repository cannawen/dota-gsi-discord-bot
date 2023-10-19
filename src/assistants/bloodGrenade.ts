import conditionalEveryIntervalSeconds from "../engine/rules/conditionalEveryIntervalSeconds";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import PlayerItems from "../gsi-data-classes/PlayerItems";
import Rule from "../engine/Rule";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.bloodGrenade,
    "Blood Grenade",
    "Reminds you to buy a blood grenade if you do not have one",
    EffectConfig.NONE
);

const BLOOD_GRENADE_REMINDER_INTERVAL = 120;

const hasBloodGrenadeTopic = topicManager.createTopic<boolean>(
    "hasBloodGrenadeTopic"
);
function hasBloodGrenade(items: PlayerItems): boolean {
    return (
        items.allItems().find((item) => item?.id === "item_blood_grenade") !==
        undefined
    );
}

export default [
    new Rule({
        label: "set has a blood grenade state",
        trigger: [topics.items],
        then: ([items]) =>
            new Fact(hasBloodGrenadeTopic, hasBloodGrenade(items)),
    }),
]
    .concat(
        [
            new Rule({
                label: "inform user to buy a blood grenade",
                trigger: [hasBloodGrenadeTopic],
                when: ([has]) => !has,
                then: () =>
                    new Fact(
                        topics.configurableEffect,
                        "resources/audio/blood-grenade.mp3"
                    ),
            }),
        ].map((rule) =>
            conditionalEveryIntervalSeconds(
                BLOOD_GRENADE_REMINDER_INTERVAL,
                rule
            )
        )
    )
    .map(inGame)
    .map((rule) => configurableRegularGame(configInfo.ruleIndentifier, rule));
