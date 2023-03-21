import log from "./log";
import { Topic } from "./Topic";

class Registrant<InType, OutType> {
    label: string;
    inTopic: Topic<InType>;
    outTopic: Topic<OutType> | null;
    handler: (input: InType) => OutType | void;

    constructor(
        label: string,
        inTopic: Topic<InType>,
        outTopic: Topic<OutType> | null,
        handler: (input: InType) => OutType | void
    ) {
        this.label = label;
        this.inTopic = inTopic;
        this.outTopic = outTopic;
        this.handler = handler;
    }
}

const registry: Map<Topic<any>, [Registrant<any, any>]> = new Map();

function register<InType, OutType>(
    label: string,
    inTopic: Topic<InType>,
    outTopic: Topic<OutType> | null,
    handler: (input: InType) => OutType | void
): void {
    log.verbose(
        "broker",
        "Register %s -> %s -> %s",
        inTopic.label.green,
        label.yellow,
        outTopic?.label.green
    );
    const newRegistrant = new Registrant(label, inTopic, outTopic, handler);

    const currentlyRegistered = registry.get(inTopic);
    if (currentlyRegistered) {
        currentlyRegistered.push(newRegistrant);
    } else {
        registry.set(inTopic, [newRegistrant]);
    }
    log.debug(
        "broker",
        "%s now has %s subscriber(s)".gray,
        inTopic.label,
        registry.get(inTopic)?.length
    );
}

function publish<TopicType>(
    label: string | null,
    topic: Topic<TopicType>,
    data: TopicType
) {
    if (label) {
        log.verbose(
            "broker",
            "%s %s -> %s",
            "Publish".magenta,
            label.yellow,
            topic.label.green
        );
    }
    registry.get(topic)?.forEach((registrant) => {
        const result = registrant.handler(data);
        log.verbose(
            "broker",
            "Process %s -> %s -> %s",
            registrant.inTopic.label.green,
            registrant.label.yellow,
            registrant.outTopic && result
                ? registrant.outTopic?.label.green
                : registrant.outTopic?.label.strikethrough
        );
        if (registrant.outTopic && result) {
            publish(null, registrant.outTopic, result);
        }
    });
}

export default {
    publish,
    register,
};
