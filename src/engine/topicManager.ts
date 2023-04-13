import { EffectConfig } from "../effectConfigManager";
import log from "../log";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";

class TopicManager {
    private readonly topics: Map<string, Topic<unknown>> = new Map();
    private readonly configTopics: Topic<EffectConfig>[] = [];

    public createTopic<T>(
        label: string,
        options?: {
            persistAcrossRestarts?: boolean;
            persistAcrossGames?: boolean;
            persistForever?: boolean;
        }
    ) {
        if (this.topics.get(label)) {
            log.error(
                "app",
                "Cannot create topic. One already exists with label %s",
                label
            );
            throw new Error(`Cannot create topic ${label}`);
        }

        let topic;
        if (options) {
            topic = new PersistentTopic<T>(label, options);
        } else {
            topic = new Topic<T>(label);
        }
        this.registerTopic(topic);
        return topic;
    }

    public createConfigTopic(label: string) {
        const topic = this.createTopic<EffectConfig>(label, {
            persistForever: true,
        });
        this.configTopics.push(topic);
        return topic;
    }

    public getConfigTopics() {
        return this.configTopics;
    }

    public findTopic<T>(label: string): Topic<T> {
        const topic = this.topics.get(label);
        if (topic) {
            return topic as Topic<T>;
        } else {
            log.error("rules", "Unknown topic %s", label);
            throw new Error(`Unknown topic ${label}`);
        }
    }

    /**
     * This should only be used in this class or by `topics` file.
     * Anyone else should create and register a topic via the `create` methods above
     * @param topic
     */
    public registerTopic(topic: Topic<unknown>) {
        this.topics.set(topic.label, topic);
    }
}

const manager = new TopicManager();

export default manager;
