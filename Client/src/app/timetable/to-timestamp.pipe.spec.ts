import { ToTimestampPipe } from './to-timestamp.pipe';

describe('ToTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new ToTimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
