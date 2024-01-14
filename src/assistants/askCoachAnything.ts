import ConfigInfo from "../ConfigInfo";
import EffectConfig from "../effects/EffectConfig";
import engine from "../customEngine";
import Fact from "../engine/Fact";
import log from "../log";
import OpenAi from "openai";
import Rule from "../engine/Rule";
import rules from "../rules";
import Topic from "../engine/Topic";
import topicManager from "../engine/topicManager";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.askCoachAnything,
    "Ask Dota Coach a question",
    'Responds to "OK/Hey Coach, <question>" (using ChatGPT)',
    EffectConfig.PUBLIC
);

const openAi = new OpenAi({ apiKey: process.env.CHATGPT_SECRET_KEY });

// Handling our own configuration logic instead of using configurable.ts because answer is async
function handleQuestion(question: string, studentId: string) {
    if (question.length < 10) return;

    openAi.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant who answers questions about Dota 2 in one short sentence.",
                },
                { role: "user", content: question },
            ],
            model: "gpt-3.5-turbo",
        })
        .then((completion) => {
            const answer = completion.choices[0].message.content;
            log.info(
                "rules",
                "Asking question: %s. Answer: %s",
                question,
                answer
            );
            const topic = topicManager.findTopic<EffectConfig>(
                configInfo.ruleIndentifier
            );
            const effectConfig = engine.getFactValue(studentId, topic);
            let effect: Topic<string> | undefined;
            switch (effectConfig) {
                case EffectConfig.PUBLIC:
                    effect = topics.playPublicAudio;
                    break;
                case EffectConfig.PRIVATE:
                    effect = topics.playPrivateAudio;
                    break;
                case EffectConfig.PUBLIC_INTERRUPTING:
                    effect = topics.playInterruptingAudioFile;
                    break;
                default:
                    break;
            }
            if (effect) {
                engine.setFact(studentId, new Fact(effect, answer));
            }
        })
        .catch((e) => {
            log.error("rules", "Problem with answering question: %s", e);
        });
}

export default new Rule({
    label: "ask a question",
    trigger: [topics.lastDiscordUtterance],
    given: [topics.studentId],
    then: ([message], [studentId]) => {
        const match = (message as string).match(
            /^(hey|hay|ok|okay) coach.(.+)$/i
        );
        if (match) {
            handleQuestion(match[2], studentId);
        }
    },
});
