const voice = {
    createAudioResource: jest.fn().mockReturnValue("AudioResource"),
    joinVoiceChannel: jest.fn().mockReturnValue({ destroy: jest.fn() }),
};

module.exports = voice;
