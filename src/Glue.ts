/* eslint-disable @typescript-eslint/no-unused-vars */
import Topic, {
    Type,
} from "./Topics";

class GlueRegistrant<InType, OutType> {
    inTopic: Topic<InType> | null;
    outTopic: Topic<OutType> | null;
    handler: HandlerFn<InType, OutType>;

    constructor(inTopic: Topic<InType> | null, outTopic: Topic<OutType> | null, handler: (input: InType) => OutType) {
        this.inTopic = inTopic;
        this.outTopic = outTopic;
        this.handler = handler;
    }
}

type HandlerFn<InType, OutType> = (input: InType) => OutType

const registry : Array<GlueRegistrant<any, any>> = [];

const timeTopic = new Topic<number>(Type.DOTA_2_TIME);
const ttsTopic = new Topic<string>(Type.EFFECT_PLAY_TTS);
const audioFileTopic = new Topic<string>(Type.EFFECT_PLAY_FILE);

function register(registrant: GlueRegistrant<Type, Type>) : void {
    registry.push(registrant);
    // registry.push([ timeTopic, ttsTopic, (time: number) => "return string" ]);
}
