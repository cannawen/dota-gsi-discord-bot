import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import rules from "../rules";
import topics from "../topics";

export default new Rule(rules.assistant.pause, [topics.paused], (get) => {
    const paused = get(topics.paused)!;
    if (paused) {
        return new Fact(
            topics.playInterruptingAudioFile,
            "resources/audio/jeopardy.mp3"
        );
    } else {
        return new Fact(topics.stopAudio, true);
    }
});
