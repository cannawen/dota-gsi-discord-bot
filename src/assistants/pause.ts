import ConfigInfo from "../ConfigInfo";
import configurableRegularGame from "../engine/rules/configurableRegularGame";
import EffectConfig from "../effects/EffectConfig";
import Fact from "../engine/Fact";
import inGame from "../engine/rules/inGame";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export const configInfo = new ConfigInfo(
    rules.assistant.pause,
    "Pause",
    "Plays Jeopardy music while paused",
    EffectConfig.PUBLIC_INTERRUPTING
);

export default configurableRegularGame(
    configInfo.ruleIndentifier,
    inGame(
        new Rule({
            label: "play jepoardy when paused",
            trigger: [topics.paused],
            then: ([paused]) => {
                if (paused) {
                    return new Fact(
                        topics.configurableEffect,
                        "resources/audio/jeopardy.mp3"
                    );
                } else {
                    return new Fact(topics.stopAudio, true);
                }
            },
        })
    )
);
