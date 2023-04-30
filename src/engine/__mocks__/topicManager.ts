import EffectConfig from "../../effects/EffectConfig";
import PersistentTopic from "../PersistentTopic";
import Topic from "../Topic";

/**
 * These are topics that we use in our tests
 * Have them already be registered with TopicManager so that it doesn't throw exceptions
 */
const topicMap = new Map<string, Topic<unknown>>(
    Object.entries({
        configTopicOne: new Topic<EffectConfig>("configTopicOne"),
        configTopicTwo: new Topic<EffectConfig>("configTopicTwo"),
        configTopicThree: new Topic<EffectConfig>("configTopicThree"),
        configTopicFour: new Topic<EffectConfig>("configTopicFour"),
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
    createConfigTopic: jest.fn(),
    createTopic: jest.fn(),
    getConfigTopics: jest.fn(),
    findTopic: jest
        .fn()
        .mockImplementation((label: string) => topicMap.get(label)),
    registerTopic: jest.fn(),
};

export default manager;
