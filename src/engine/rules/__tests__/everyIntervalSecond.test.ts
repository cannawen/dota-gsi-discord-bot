import everyInterval from "../everyIntervalSeconds";
import Fact from "../../Fact";
import Rule from "../../Rule";
import topics from "../../../topics";

const params = { inGame: true, time: 0 };

describe("everyIntervalSeconds", () => {
    let rule: Rule;

    beforeEach(() => {
        rule = everyInterval(
            3,
            new Rule({
                label: "test",
                then: () => new Fact(topics.playPrivateAudio, "audio"),
            })
        );
    });

    // eslint-disable-next-line max-statements
    test("should trigger every interval seconds", () => {
        const initial = getResults(rule, { ...params, inGame: false });
        expect(initial).not.toContainAudioEffect();

        const zero = getResults(rule, params, initial);
        expect(zero).toContainAudioEffect();

        const one = getResults(rule, { ...params, time: 1 }, zero);
        expect(one).not.toContainAudioEffect();

        const two = getResults(rule, { ...params, time: 2 }, one);
        expect(two).not.toContainAudioEffect();

        const three = getResults(rule, { ...params, time: 3 }, two);
        expect(three).toContainAudioEffect();

        const four = getResults(rule, { ...params, time: 4 }, three);
        expect(four).not.toContainAudioEffect();

        const five = getResults(rule, { ...params, time: 5 }, four);
        expect(five).not.toContainAudioEffect();

        const six = getResults(rule, { ...params, time: 6 }, five);
        expect(six).toContainAudioEffect();
    });
});
