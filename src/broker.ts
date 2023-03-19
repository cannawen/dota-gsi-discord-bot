/* eslint-disable @typescript-eslint/no-unused-vars */
import log from "./log";
import {
    Topic,
} from "./Topic";

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

const registry : Array<Registrant<any, any>> = [];

function register<InType, OutType>(
    label: string,
    inTopic: Topic<InType>,
    outTopic: Topic<OutType> | null,
    handler: (input: InType) => OutType | void
) : void {
    log.info("broker", "Register %s -> %s -> %s", inTopic.label.green, label.yellow, outTopic?.label.green);
    registry.push(new Registrant(label, inTopic, outTopic, handler));
}

function publish<TopicType>(label: string | null, topic: Topic<TopicType>, data: TopicType) {
    if (label) {
        log.debug("broker", "%s %s -> %s", "Publish".magenta, label.yellow, topic.label.green);
    }
    registry.forEach((registrant) => {
        if (topic.label === registrant.inTopic.label) {
            const result = registrant.handler(data);
            log.debug(
                "broker",
                "Process %s -> %s -> %s",
                registrant.inTopic.label.green,
                registrant.label.yellow,
                registrant.outTopic && result
                    ? registrant.outTopic?.label.green
                    : registrant.outTopic?.label.green.strikethrough,
            );
            if (registrant.outTopic && result) {
                publish(null, registrant.outTopic, result);
            }
        }
    });
}

export default {
    publish,
    register,
};
