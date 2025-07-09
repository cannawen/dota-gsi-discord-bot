import rule from "../shareUnitControl";
import rules from "../../rules";

const params = {
    [rules.assistant.shareUnitControl]: "PRIVATE",
    preGame: true,
    time: -60,
};
describe("time -60 pregame", () => {
    describe("when playing a hero with sharable units", () => {
        test("play reminder to share unit control", () => {
            const results = getResults(rule, {
                hero: "npc_dota_hero_warlock",
                ...params,
            });
            expect(results).toContainAudioEffect("consider sharing unit control.");
        });
    });
    
    describe("when playing a hero with no sharable units", () => {
        test("do not play reminder to share unit control", () => {
            const results = getResults(rule, {
                hero: "npc_dota_hero_axe",
                ...params,
            });
            expect(results).not.toContainAudioEffect("consider sharing unit control.");
        });
    });
});
