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
};

module.exports = discordjs;
