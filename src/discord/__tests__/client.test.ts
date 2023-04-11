jest.mock("discord.js");
import Discord from "discord.js";

import { DiscordClient } from "../client";

describe("client", () => {
    let sut: DiscordClient;
    beforeEach(() => {
        sut = new DiscordClient();
        sut.start();
    });

    test("Create new discord client", () => {
        expect(Discord.Client).toHaveBeenCalledTimes(1);
    });
});
