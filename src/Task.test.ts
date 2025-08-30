import { Task, TaskStatus } from './Task';

describe('Task', () => {
  it('should create a pending Task', () => {
    const task = new Task<number>(() => {
      // do not resolve immediately
    });
    expect(task).toBeInstanceOf(Task);
    expect(task.getStatus()).toBe(TaskStatus.PENDING);
    expect(task.getResult()).toBeUndefined();
    expect(task.getError()).toBeUndefined();
    expect(task.isPending()).toBe(true);
    expect(task.isSucceeded()).toBe(false);
    expect(task.isFailed()).toBe(false);
  });

  it('should succeed and set result', async () => {
    const task = new Task<number>((resolve) => {
      resolve(42);
    });
    await task.run(() => {});
    expect(task.getStatus()).toBe(TaskStatus.SUCCEEDED);
    expect(task.getResult()).toBe(42);
    expect(task.getError()).toBeUndefined();
    expect(task.isSucceeded()).toBe(true);
    expect(task.isPending()).toBe(false);
    expect(task.isFailed()).toBe(false);
  });

  it('should fail and set error', async () => {
    const error = new Error('fail');
    const task = new Task<number>((_, reject) => {
      reject(error);
    });
    try {
      await task.run(() => {}, () => {});
    } catch {}
    expect(task.getStatus()).toBe(TaskStatus.FAILED);
    expect(task.getResult()).toBeUndefined();
    expect(task.getError()).toBe(error);
    expect(task.isFailed()).toBe(true);
    expect(task.isPending()).toBe(false);
    expect(task.isSucceeded()).toBe(false);
  });

  it('should create a success Task via static method', () => {
    const task = Task.success(99);
    expect(task.getStatus()).toBe(TaskStatus.SUCCEEDED);
    expect(task.getResult()).toBe(99);
    expect(task.isSucceeded()).toBe(true);
  });

  it('should create a failure Task via static method', async () => {
    const err = new Error('static fail');
    const task = Task.failure<number>(err);
    await expect(task.run(() => {})).rejects.toThrow('static fail');
    expect(task.getStatus()).toBe(TaskStatus.FAILED);
    expect(task.getError()).toBe(err);
    expect(task.isFailed()).toBe(true);
  });

  it('should call catch on failure', async () => {
    const err = new Error('catch fail');
    const task = Task.failure<number>(err);
    let caught: Error | undefined;
    await task.catch(e => { caught = e; });
    expect(caught).toBe(err);
  });
});
