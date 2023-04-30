/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */
export default class Topic<Type> {
    public readonly label: string;
    // The following variable is not to be used, but is only here for type-checking reasons
    public readonly defaultValue: Type | undefined;

    /**
     * Create a topic
     */
    public constructor(label: string, defaultValue?: Type) {
        this.label = label;
        this.defaultValue = defaultValue;
    }
}
