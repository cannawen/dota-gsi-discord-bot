/* eslint-disable @typescript-eslint/no-unused-vars */
import Topic from "./Topics";

type HandlerFn = (input: any) => any;

const registry : Array<[inTopic: Topic | null, outTopic: Topic | null, handler: HandlerFn]> = [];

function register(inTopic: Topic | null, outTopic: Topic | null, handler: HandlerFn) : void {
    registry.push([ inTopic, outTopic, handler ]);
}

function publish(topic: Topic, data: any) {
    registry.map((registrant) => {
        const [ inTopic, outTopic, handler ] = registrant;
        if (inTopic === topic) {
            const result = handler(data);
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
