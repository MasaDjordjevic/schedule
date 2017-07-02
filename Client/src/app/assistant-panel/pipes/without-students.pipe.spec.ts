import { WithoutStudentsPipe } from './without-students.pipe';

describe('WithoutStudentsPipe', () => {
  it('create an instance', () => {
    const pipe = new WithoutStudentsPipe();
    expect(pipe).toBeTruthy();
  });
});
