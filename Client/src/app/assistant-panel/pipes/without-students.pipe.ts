import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'withoutStudents',
  pure: false
})
export class WithoutStudentsPipe implements PipeTransform {

  // students bez studenata iz groupStudents
  transform(students, groupStudents) {
    let ret = [];

    if (!students || !groupStudents) {
      return students;
    }

    outer:
      for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < groupStudents.length; j++) {
          if (students[i].StudentId === groupStudents[j].StudentId) {
            continue outer;
          }
        }
        ret.push(students[i]);
      }
    return ret;
  }

}
