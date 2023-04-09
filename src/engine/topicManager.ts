import Config from "../configTopics";
import log from "../log";
import PersistentTopic from "./PersistentTopic";
import Topic from "./Topic";

class TopicManager {
    private readonly topics: Map<string, Topic<unknown>> = new Map();
    private readonly configTopics: Topic<Config>[] = [];

    public createTopic<T>(
        label: string,
        options?: {
            persistAcrossRestarts?: boolean;
            persistAcrossGames?: boolean;
            persistForever?: boolean;
        }
    ) {
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
        const topic = this.createTopic<Config>(label, { persistForever: true });
        this.configTopics.push(topic);
        return topic;
    }

    public getConfigTopics() {
        return this.configTopics;
    }

    public findTopic(label: string): Topic<unknown> {
        const topic = this.topics.get(label);
        if (topic) {
            return topic;
        } else {
            log.error("rules", "Unknown topic %s", label);
            throw new Error(`Unknown topic ${label}`);
        }
    }

    public registerTopic(topic: Topic<unknown>) {
        this.topics.set(topic.label, topic);
    }
}

const manager = new TopicManager();

export default manager;
