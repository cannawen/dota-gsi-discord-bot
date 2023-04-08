import Topic from "./Topic";

/**
 * A `PersistentTopic` describes the type of data (i.e. Time is a number)
 * And its persistence preferences (across restarts or across games - defaults to false)
 */
export default class PersistentTopic<Type> extends Topic<Type> {
    public readonly persistAcrossRestarts: boolean;
    public readonly persistAcrossGames: boolean;
    public readonly persistForever: boolean;

    /**
     * Create a topic
     * @param label
     * @param options Params to mark what kind of persistence you want (default is false)
     */
    public constructor(
        label: string,
        options?: {
            persistAcrossRestarts?: boolean;
            persistAcrossGames?: boolean;
            persistForever?: boolean;
        }
    ) {
        super(label);

        this.persistAcrossRestarts =
            options?.persistAcrossRestarts || options?.persistForever || false;
        this.persistAcrossGames =
            options?.persistAcrossGames || options?.persistForever || false;
        this.persistForever = options?.persistForever || false;
    }
}
