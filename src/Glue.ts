/* eslint-disable @typescript-eslint/no-unused-vars */
import Topic from "./Topics";

type HandlerFn = (input: any) => any

class GlueRegistrant {
    inTopic: Topic | null;
    outTopic: Topic | null;
    handler: HandlerFn;

    constructor(inTopic: Topic | null, outTopic: Topic | null, handler: HandlerFn) {
        this.inTopic = inTopic;
        this.outTopic = outTopic;
        this.handler = handler;
    }
}

const registry : Array<GlueRegistrant> = [];

function register(registrant: GlueRegistrant) : void {
    registry.push(registrant);
}
