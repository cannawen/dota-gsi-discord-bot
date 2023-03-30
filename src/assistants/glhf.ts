import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topics from "../topics";

export default new Rule("glhf", [topics.gsi.time, topics.gsi.inGame], (get) => {
    const time = get(topics.gsi.time)!;
    const inGame = get(topics.gsi.inGame)!;
    if (inGame && time === 0) {
        return new Fact(
            topics.effect.playPrivateAudioFile,
            "resources/audio/glhf.mp3"
        );
    }
});
