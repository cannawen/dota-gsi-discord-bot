/* eslint-disable max-classes-per-file */
import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topics from "../topics";

const REMINDER_INCREMENT = 500;

const lastGoldMultiplierTopic = new Topic<number>("lastGoldMultiplierTopic");

export default new Rule(
    rules.assistant.goldReminder,
    [topics.gsi.gold],
    (get) => {
        const gold = get(topics.gsi.gold)!;
        const oldMultiplier = get(lastGoldMultiplierTopic) || 0;
        const newMultiplier = Math.floor(gold / REMINDER_INCREMENT);

        // Should spend gold
        if (newMultiplier > oldMultiplier) {
            return [
                new Fact(
                    topics.effect.playPrivateAudioFile,
                    "resources/audio/gold.mp3"
                ),
                new Fact(lastGoldMultiplierTopic, newMultiplier),
            ];
            // Spent gold
        } else if (oldMultiplier > newMultiplier) {
            return new Fact(lastGoldMultiplierTopic, newMultiplier);
        }
    }
);
