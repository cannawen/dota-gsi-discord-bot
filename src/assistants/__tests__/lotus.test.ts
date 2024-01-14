import rule from "../lotus";
import rules from "../../rules";

const params = {
    customGameName: "",
    [rules.assistant.lotus]: "PUBLIC",
    inGame: true,
    time: 3 * 60 - 15,
};

test("healing lotus, in game", () => {
    const threeMin = getResults(rule, params);
    expect(threeMin).toContainAudioEffect("healing lotus soon");
    const sixMin = getResults(
        rule,
        {
            ...params,
            time: 6 * 60 - 15,
        },
        threeMin
    );
    expect(sixMin).toContainAudioEffect();
    const nineMin = getResults(
        rule,
        {
            ...params,
            time: 9 * 60 - 15,
        },
        sixMin
    );
    expect(nineMin).toContainAudioEffect();
    const elevenMin = getResults(
        rule,
        {
            ...params,
            time: 11 * 60 - 15,
        },
        nineMin
    );
    expect(elevenMin).not.toContainAudioEffect();
    const twelveMin = getResults(
        rule,
        {
            ...params,
            time: 12 * 60 - 15,
        },
        elevenMin
    );
    expect(twelveMin).toContainAudioEffect();
    const fifteenMin = getResults(
        rule,
        {
            ...params,
            time: 15 * 60 - 15,
        },
        twelveMin
    );
    expect(fifteenMin).not.toContainAudioEffect();
});
