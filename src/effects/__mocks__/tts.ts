const mock = {
    path: jest
        .fn()
        .mockImplementation(
            (ttsString: string) => `test-tts-path/${ttsString}.mp3`
        ),
    create: jest.fn().mockReturnValue(
        new Promise<void>((resolve) => {
            resolve();
        })
    ),
};

export default mock;
