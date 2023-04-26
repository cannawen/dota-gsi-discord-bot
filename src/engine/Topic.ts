// TODO would it be helpful to give topics a default value (i.e. empty array, 0 number, false boolean)
// So that when we start our app we don't need to do so many undefined checks all over

/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */
export default class Topic<Type> {
    public readonly label: string;
    // The following variable is not to be used, but is only here for type-checking reasons
    private readonly _type: Type | undefined;

    /**
     * Create a topic
     * @param label
     * @param opts Optional params to mark if you want to persist data across restart or games (default is false)
     */
    public constructor(label: string) {
        this.label = label;
    }
}
