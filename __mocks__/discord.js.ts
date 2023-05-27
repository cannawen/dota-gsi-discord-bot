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
    SlashCommandBuilder: jest.fn().mockReturnValue({
        setName: jest.fn().mockReturnValue({
            addStringOption: jest
                .fn()
                .mockReturnValue({ setDescription: jest.fn() }),
            setDescription: jest.fn(),
        }),
    }),
};

module.exports = discordjs;
