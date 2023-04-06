/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */
export default class Topic<Type> {
    public readonly label: string;
    // The following variable is not used, but is only here for type-checking reasons
    private _type: Type | undefined;

    /**
     * Create a topic
     * @param label
     * @param opts Optional params to mark if you want to persist data across restart or games (default is false)
     */
    public constructor(label: string) {
        this.label = label;
    }
}
