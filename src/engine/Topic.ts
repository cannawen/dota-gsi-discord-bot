/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */
export default class Topic<Type> {
    public readonly label: string;
    public defaultValue: Type | undefined;

    /**
     * Create a topic
     */
    public constructor(label: string, defaultValue?: Type) {
        this.label = label;
        this.defaultValue = defaultValue;
    }
}
