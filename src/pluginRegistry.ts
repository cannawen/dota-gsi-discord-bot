import subjects from "./subjects";

function register(observer: any) {
    subjects.map(({
        subject, typeChecker,
    }) => {
        if (typeChecker(observer)) {
            subject.addObserver(observer);
        }
    });
}

// Some subjects are observers on other subjects
// i.e. events are deleted when the game is reset
subjects.map(({
    subject,
}) => register(subject));

export default register;
