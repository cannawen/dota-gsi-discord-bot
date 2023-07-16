const discordjs = {
    Client: jest.fn().mockImplementation(() => ({
        guilds: {
            cache: [
                {
                    id: "guildId",
                    name: "Guild Name",
                    channels: {
                        cache: [
                            {
                                id: "channelId",
                                name: "Channel Name",
                                guild: {
                                    voiceAdapterCreator: "voiceAdapterCreator",
                                },
                            },
                            { id: "1" },
                        ],
                    },
                },
                { id: "2" },
            ],
        },
        login: jest.fn().mockImplementation(() => ({
            catch: jest.fn(),
        })),
        on: jest.fn(),
        once: jest.fn(),
    })),
    Events: {
        ClientReady: "ClientReady",
        Error: "Error",
        InteractionCreate: "InteractionCreate",
    },
    // Pretty unhappy with how we are mocking this builder
    // The addStringOption function doesn't even return a SlashCommandBuilder which is pretty sketch of the library
    // Is there a way to get jest.fn() to return another jest.fn() instead of undefined by default?
    SlashCommandBuilder: jest.fn().mockReturnValue({
        setName: jest.fn().mockReturnValue({
            addStringOption: jest
                .fn()
                .mockReturnValue({ setDescription: jest.fn() }),
            addBooleanOption: jest
                .fn()
                .mockReturnValue({ setDescription: jest.fn() }),
            setDescription: jest.fn(),
        }),
    }),
};

module.exports = discordjs;
