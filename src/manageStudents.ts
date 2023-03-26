import engine from "./customEngine";
import Fact from "./classes/engine/Fact";
import topic from "./topic";

engine.register("new_student", [topic.registerStudentId], (get) => {
    const newStudent = get(topic.registerStudentId)!;
    const students = [...(get(topic.currentlyCoachedStudentIds) || [])];
    students.push(newStudent);
    return [
        new Fact(topic.registerStudentId, undefined),
        new Fact(topic.currentlyCoachedStudentIds, new Set(students)),
    ];
});

engine.register("remove_student", [topic.unregisterStudentId], (get) => {
    const student = get(topic.unregisterStudentId)!;
    const students = [...(get(topic.currentlyCoachedStudentIds) || [])];
    students.filter((s) => s !== student);
    return [
        new Fact(topic.unregisterStudentId, undefined),
        new Fact(topic.currentlyCoachedStudentIds, new Set(students)),
    ];
});
