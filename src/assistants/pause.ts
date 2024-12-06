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
    "Plays music while paused",
    EffectConfig.PUBLIC_INTERRUPTING
);

export default configurable(
    configInfo.ruleIndentifier,
    inGame(
        new Rule({
            label: "play music when paused",
            trigger: [topics.paused],
            then: ([paused]) => {
                if (paused) {
                    return new Fact(
                        topics.configurableEffect,
                        "resources/audio/silent-night.mp3"
                    );
                } else {
                    return new Fact(topics.stopAudio, true);
                }
            },
        })
    )
);
