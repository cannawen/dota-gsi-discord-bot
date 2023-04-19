import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

const WATER_RUNE_2_MIN = 2 * 60;
const WATER_TUNE_4_MIN = 4 * 60;

export const configTopic = topicManager.createConfigTopic(
    rules.assistant.runeWater
);
export const defaultConfig = EffectConfig.NONE;
export const assistantDescription =
    "Reminds you of water rune spawn at 2:00 and 4:00";

export default new RuleConfigurable(
    rules.assistant.runeWater,
    configTopic,
    [topics.inGame, topics.time],
    (get, effect) => {
        const inGame = get(topics.inGame)!;
        const time = get(topics.time)!;
        if (
            inGame &&
            (time === WATER_RUNE_2_MIN || time === WATER_TUNE_4_MIN)
        ) {
            return new Fact(effect, "resources/audio/rune-water.mp3");
        }
    }
);
