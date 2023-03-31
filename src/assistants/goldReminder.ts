/* eslint-disable max-classes-per-file */
import { Config, configToEffectTopic } from "../configTopics";
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.goldReminder);
export const defaultConfig = Config.PRIVATE;

const REMINDER_INCREMENT = 500;

const lastGoldMultiplierTopic = new Topic<number>("lastGoldMultiplierTopic");

export default new Rule(
    rules.assistant.goldReminder,
    [configTopic, topics.gsi.gold, topics.gsi.inGame],
    (get) => {
        const effect = configToEffectTopic[get(configTopic)!];

        if (!effect) return;
        if (!get(topics.gsi.inGame)!) return;

        const gold = get(topics.gsi.gold)!;
        const oldMultiplier = get(lastGoldMultiplierTopic) || 0;
        const newMultiplier = Math.floor(gold / REMINDER_INCREMENT);

        // Should spend gold
        if (newMultiplier > oldMultiplier) {
            return [
                new Fact(effect, "resources/audio/gold.mp3"),
                new Fact(lastGoldMultiplierTopic, newMultiplier),
            ];
            // Spent gold
        } else if (oldMultiplier > newMultiplier) {
            return new Fact(lastGoldMultiplierTopic, newMultiplier);
        }
    }
);
