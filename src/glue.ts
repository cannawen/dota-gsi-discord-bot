/* eslint-disable @typescript-eslint/no-unused-vars */
import log from "./log";
import Topic from "./Topics";

type HandlerFn = (input: any) => any;

const registry : Array<[inTopic: Topic | null, outTopic: Topic | null, handler: HandlerFn]> = [];

function register(inTopic: Topic, outTopic: Topic | null, handler: HandlerFn) : void {
    log.glue.debug("Registered %s to %s", inTopic.green, outTopic?.green);
    registry.push([ inTopic, outTopic, handler ]);
}

function publish(topic: Topic, data: any) {
    log.glue.debug("Publish %s", topic.green);
    registry.forEach((registrant) => {
        const [ inTopic, outTopic, handler ] = registrant;
        if (inTopic === topic) {
            const result = handler(data);
            log.glue.debug("Converting %s to %s with input %s and result %s",
                inTopic?.green, outTopic?.green, data, result);
            if (outTopic && result) {
                publish(outTopic, result);
            }
        }
    });
}

export default {
    publish,
    register,
};
