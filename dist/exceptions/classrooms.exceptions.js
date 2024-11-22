"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentNotInClassroom = exports.ClassroomNotFound = void 0;
class ClassroomNotFound {
    constructor() {
        this.message = 'Classroom Not Found';
        this.code = 404;
    }
}
exports.ClassroomNotFound = ClassroomNotFound;
class StudentNotInClassroom {
    constructor() {
        this.message = 'Student Not in Classroom';
        this.code = 404;
    }
}
exports.StudentNotInClassroom = StudentNotInClassroom;
