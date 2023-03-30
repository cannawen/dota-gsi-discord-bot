import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.assistant.pause, [topics.gsi.paused], (get) => {
    const paused = get(topics.gsi.paused)!;
    if (paused) {
        return new Fact(
            topics.effect.playInterruptingAudioFile,
            "resources/audio/jeopardy.mp3"
        );
    } else {
        return new Fact(topics.effect.stopAudio, true);
    }
});
