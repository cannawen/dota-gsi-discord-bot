import { EffectConfig } from "../../effectConfigManager";
import PersistentTopic from "../PersistentTopic";
import Topic from "../Topic";

const topicMap = new Map<string, Topic<unknown>>(
    Object.entries({
        configTopicOne: new Topic<EffectConfig>("configTopicOne"),
        configTopicTwo: new Topic<EffectConfig>("configTopicTwo"),
        regular: new Topic<number>("regular"),
        persistAcrossGames: new PersistentTopic<number>("persistAcrossGames", {
            persistAcrossGames: true,
        }),
        persistAcrossRestarts: new PersistentTopic<number>(
            "persistAcrossRestarts",
            {
                persistAcrossRestarts: true,
            }
        ),
        persistForever: new PersistentTopic<number>("persistForever", {
            persistForever: true,
        }),
    })
);

const manager = {
    getConfigTopics: jest.fn(),
    findTopic: (label: string) => topicMap.get(label),
    registerTopic: (topic: Topic<unknown>) => {
        topicMap.set(topic.label, topic);
    },
};

export default manager;
