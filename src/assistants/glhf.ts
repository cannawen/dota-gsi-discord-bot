import Fact from "../engine/Fact";
import Rule from "../engine/Rule";
import topics from "../topics";

export default new Rule("glhf", [topics.time, topics.inGame], (get) => {
    const time = get(topics.time)!;
    const inGame = get(topics.inGame)!;
    if (inGame && time === 0) {
        return new Fact(topics.playPrivateAudioFile, "resources/audio/glhf");
    }
});
