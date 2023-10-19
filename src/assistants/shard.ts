import atMinute from "../engine/rules/atMinute";
import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.shard,
    "Shard",
    "Reminds you of shard availability at 15:00",
    EffectConfig.NONE
);

const SHARD_SPAWN_MINUTE = 15;

export default atMinute(
    SHARD_SPAWN_MINUTE,
    configurableRegularGame(
        configInfo.ruleIndentifier,
        new Rule({
            label: "shard reminder at 15:00",
            then: () =>
                new Fact(
                    topics.configurableEffect,
                    "resources/audio/shard-available.mp3"
                ),
        })
    )
);
