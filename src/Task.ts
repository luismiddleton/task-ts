export const enum TaskStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

/**
 * Represents an asynchronous operation that can be in one of three states:
 * pending, succeeded, or failed.
 *
 * The `Task` class is a wrapper around a `Promise` that provides synchronous
 * access to its status. This is particularly useful in scenarios where you need
 * to track the state of an asynchronous operation without waiting for it to
 * complete, such as in UI components that need to render different content
 * based on whether data is loading, has loaded successfully, or has failed.
 *
 * @template T The type of the value that the Task will resolve with.
 * @template E The type of the error that the Task will reject with.
 */
export class Task<T, E = Error> {
  private readonly promise: Promise<T>;
  private state: TaskStatus | `${TaskStatus}` = "pending";
  private result?: T;
  private error?: E;

  /**
   * Creates a new Task.
   *
   * @param executor A function that is passed with the resolve and reject
   * functions. The executor function is executed immediately by the Task
   * implementation, passing `resolve` and `reject` functions (the executor is
   * called before the `Task` constructor even returns the created object).
   */
  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason?: E) => void,
    ) => void,
  ) {
    this.promise = new Promise<T>((resolve, reject) =>
      executor(
        (value) => {
          this.state = "succeeded";
          this.result = value;
          resolve(value);
        },
        (reason) => {
          this.state = "failed";
          this.error = reason as E;
          reject(reason);
        },
      ),
    );
  }

  /**
   * Creates a new Task that is already resolved with the given value.
   * @param value The value to resolve the Task with.
   * @returns A new Task that is already in the "succeeded" state.
   */
  public static success<T, E = Error>(value: T): Task<T, E> {
    return new Task<T, E>((resolve) => resolve(value));
  }

  /**
   * Creates a new Task that is already rejected with the given reason.
   * @param reason The reason to reject the Task with.
   * @returns A new Task that is already in the "failed" state.
   */
  public static failure<T, E = Error>(reason: E): Task<T, E> {
    return new Task<T, E>((_, reject) => reject(reason));
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Task.
   * @param onFulfilled The callback to execute when the Task is resolved.
   * @param onRejected The callback to execute when the Task is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  run(onFulfilled: (value: T) => void, onRejected?: (reason: E) => void) {
    return this.promise.then(onFulfilled, onRejected);
  }

  /**
   * Attaches a callback for only the rejection of the Task.
   * @param onRejected The callback to execute when the Task is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch(onRejected: (reason: E) => void) {
    return this.promise.catch(onRejected);
  }

  /**
   * Gets the result of the Task if it has succeeded.
   * @returns The result of the Task, or `undefined` if the Task has not
   * succeeded.
   */
  public getResult(): T | undefined {
    return this.result;
  }

  /**
   * Gets the error of the Task if it has failed.
   * @returns The error of the Task, or `undefined` if the Task has not
   * failed.
   */
  public getError(): E | undefined {
    return this.error;
  }

  /**
   * Gets the current status of the Task.
   * @returns The current status: "pending", "succeeded", or "failed".
   */
  public getStatus() {
    return this.state;
  }

  /**
   * Checks if the Task is currently pending.
   * @returns `true` if the Task is pending, `false` otherwise.
   */
  public isPending(): this is Task<T, E> & { getStatus: () => TaskStatus.PENDING } {
    return this.getStatus() === TaskStatus.PENDING;
  }

  /**
   * Checks if the Task has succeeded.
   * @returns `true` if the Task has succeeded, `false` otherwise.
   */
  public isSucceeded(): this is Task<T, E> & { getStatus: () => TaskStatus.SUCCEEDED } {
    return this.getStatus() === TaskStatus.SUCCEEDED;
  }

  /**
   * Checks if the Task has failed.
   * @returns `true` if the Task has failed, `false` otherwise.
   */
  public isFailed(): this is Task<T, E> & { getStatus: () => TaskStatus.FAILED } {
    return this.getStatus() === TaskStatus.FAILED;
  }
}
