import PersistentTopic from "../PersistentTopic";
import Topic from "../Topic";

const manager = {
    findTopic: jest
        .fn()
        .mockReturnValueOnce(new Topic<number>("regular"))
        .mockReturnValueOnce(
            new PersistentTopic<number>("persistAcrossGames", {
                persistAcrossGames: true,
            })
        )
        .mockReturnValueOnce(
            new PersistentTopic<number>("persistAcrossRestarts", {
                persistAcrossRestarts: true,
            })
        )
        .mockReturnValueOnce(
            new PersistentTopic<number>("persistForever", {
                persistForever: true,
            })
        ),
};

export default manager;
