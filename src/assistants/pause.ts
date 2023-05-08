import ConfigInfo from "../ConfigInfo";
import configurable from "../engine/rules/configurable";
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

export default configurable(
    configInfo,
    inGame(
        new Rule({
            label: rules.assistant.pause,
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
