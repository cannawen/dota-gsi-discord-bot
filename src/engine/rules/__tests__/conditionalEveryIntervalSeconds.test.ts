import everyInterval from "../conditionalEveryIntervalSeconds";
import Fact from "../../Fact";
import Rule from "../../Rule";
import Topic from "../../Topic";
import topicManager from "../../topicManager";
import topics from "../../../topics";

const params = { givenTopic: true, triggerTopic: true, inGame: true, time: 0 };

describe("conditionalEveryIntervalSeconds", () => {
    let rule: Rule;
    let triggerTopic: Topic<boolean>;
    let givenTopic: Topic<boolean>;

    beforeEach(() => {
        triggerTopic = topicManager.createTopic<boolean>("triggerTopic");
        givenTopic = topicManager.createTopic<boolean>("givenTopic");

        rule = everyInterval(
            ([trigger], [given]) => trigger && given,
            3,
            new Rule({
                label: "test",
                trigger: [triggerTopic],
                given: [givenTopic],
                then: () => new Fact(topics.playPrivateAudio, "audio"),
            })
        );
    });

    // eslint-disable-next-line max-statements
    test("should trigger every interval seconds on condition (except for first interval)", () => {
        const initial = getResults(rule, { ...params, inGame: false });
        expect(initial).not.toContainAudioEffect();

        const zero = getResults(rule, params, initial);
        expect(zero).not.toContainAudioEffect();

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

        const seven = getResults(rule, { ...params, time: 7 }, six);
        expect(seven).not.toContainAudioEffect();

        const eight = getResults(rule, { ...params, time: 8 }, seven);
        expect(eight).not.toContainAudioEffect();

        const nine = getResults(
            rule,
            { ...params, time: 9, triggerTopic: false },
            eight
        );
        expect(nine).not.toContainAudioEffect();

        const ten = getResults(
            rule,
            { ...params, time: 10, givenTopic: false },
            nine
        );
        expect(ten).not.toContainAudioEffect();

        const eleven = getResults(rule, { ...params, time: 11 }, ten);
        expect(eleven).not.toContainAudioEffect();

        const twelve = getResults(rule, { ...params, time: 12 }, eleven);
        expect(twelve).not.toContainAudioEffect();

        const thirteen = getResults(rule, { ...params, time: 13 }, twelve);
        expect(thirteen).not.toContainAudioEffect();

        const fourteen = getResults(rule, { ...params, time: 14 }, thirteen);
        expect(fourteen).toContainAudioEffect();
    });
});
