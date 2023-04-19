import { EffectConfig } from "../effectConfigManager";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import RuleConfigurable from "../engine/RuleConfigurable";
import RuleDecoratorInGame from "../engine/RuleDecoratorInGame";
import rules from "../rules";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configTopic = topicManager.createConfigTopic("Buyback");
export const defaultConfig = EffectConfig.PRIVATE;
export const assistantDescription =
    "Reminds you when you do not have enough gold for buyback (after 30:00)";

const hasBuybackTopic = topicManager.createTopic<boolean>("hasBuybackTopic");

export default [
    new Rule(
        rules.assistant.buyback.availability,
        [topics.time, topics.gold, topics.buybackCost, topics.buybackCooldown],
        (get) => {
            const time = get(topics.time)!;
            if (time < 30 * 60) return;

            const buybackAvailable = get(topics.buybackCooldown)! === 0;
            const gold = get(topics.gold)!;
            const buybackCost = get(topics.buybackCost)!;
            if (buybackAvailable) {
                const hasBuyback = gold >= buybackCost;
                return new Fact(hasBuybackTopic, hasBuyback);
            } else {
                return new Fact(hasBuybackTopic, false);
            }
        }
    ),
    new RuleConfigurable(
        rules.assistant.buyback.warnNoBuyback,
        configTopic,
        [hasBuybackTopic, topics.buybackCooldown],
        (get, effect) => {
            const hasBuyback = get(hasBuybackTopic)!;
            const buybackCooldown = get(topics.buybackCooldown)!;
            if (!hasBuyback && buybackCooldown === 0) {
                return new Fact(effect, "resources/audio/buyback-warning.mp3");
            }
        }
    ),
].map((rule) => new RuleDecoratorInGame(rule));
