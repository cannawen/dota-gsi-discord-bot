/* eslint-disable @typescript-eslint/no-unused-vars */
import log from "./log";
import {
    Topic,
} from "./topics";

class Registrant<InType, OutType> {
    inTopic: Topic<InType>;
    outTopic: Topic<OutType> | null;
    handler: (input: InType) => OutType | void;

    constructor(
        inTopic: Topic<InType>,
        outTopic: Topic<OutType> | null,
        handler: (input: InType) => OutType | void
    ) {
        this.inTopic = inTopic;
        this.outTopic = outTopic;
        this.handler = handler;
    }
}

const registry : Array<Registrant<any, any>> = [];

function register<InType, OutType>(
    inTopic: Topic<InType>,
    outTopic: Topic<OutType> | null,
    handler: (input: InType) => OutType | void
) : void {
    log.glue.debug("Registered %s to %s", inTopic.label.green, outTopic?.label.green);
    registry.push(new Registrant(inTopic, outTopic, handler));
}

function publish<TopicType>(topic: Topic<TopicType>, data: TopicType) {
    log.glue.debug("Publish %s", topic.label.green);
    registry.forEach((registrant) => {
        if (topic.label === registrant.inTopic.label) {
            const result = registrant.handler(data);
            log.glue.debug(
                "Converting %s to %s",
                registrant.inTopic.label.green,
                registrant.outTopic?.label.green,
            );
            if (registrant.outTopic && result) {
                publish(registrant.outTopic, result);
            }
        }
    });
}

export default {
    publish,
    register,
};
