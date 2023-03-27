/**
 * A `Topic` describes the type of data (i.e. Time is a number)
 */

export default class Topic<Type> {
    public label: string;
    // The following variable is not used, but is only here for type-checking reasons
    private _type: Type | undefined;

    public constructor(label: string) {
        this.label = label;
    }
}
