/* eslint-disable max-classes-per-file */
import Config from "../configTopics";
import Fact from "../engine/Fact";
import RuleConfigurable from "../engine/RuleConfigurable";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

export const configTopic = new Topic<Config>(rules.assistant.goldReminder);
export const defaultConfig = Config.PRIVATE;

const REMINDER_INCREMENT = 500;

const lastGoldMultiplierTopic = new Topic<number>("lastGoldMultiplierTopic");

// TODO may have to use time as well so it is not so chatty when hovering around a threshold
export default new RuleConfigurable(
    rules.assistant.goldReminder,
    configTopic,
    [topics.gsi.gold, topics.gsi.inGame],
    (get, effect) => {
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
