# Task

A lightweight TypeScript library for managing deferred asynchronous operations.

## Overview

The library provides a `Task` class for managing deferred asynchronous computations. It wraps a `Promise` to represent an operation whose result is computed asynchronously, while allowing synchronous access to its current status (`pending`, `succeeded`, or `failed`).

Instead of managing loading, success, and error states separately, you can encapsulate them all within a single `Task` object.

## Key Features

- **Synchronous Status:** Immediately check if a task is `pending`, `succeeded`, or `failed`.
- **Type-Safe:** Full TypeScript support for result and error types.
- **Promise-Based:** Built on top of native `Promise`, so you can still use `then` and `catch`.
- **Lightweight:** No external dependencies.

## Motivation

The primary motivation for this library is to provide a richer interface for managing asynchronous operations. While native `Promise`s are excellent for handling a "future" value, they don't offer a way to synchronously inspect the state of the underlying computation. `Task` fills this gap by encapsulating the entire lifecycle of an async operation, making it easy to handle loading, success, and error states without boilerplate.

## Basic Usage

Creating a `Task` is similar to creating a `Promise`:

```typescript
import { Task } from '@luism/task';

const myTask = new Task<string, Error>((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("Hello, world!");
    } else {
      reject(new Error("Something went wrong!"));
    }
  }, 1000);
});

console.log(myTask.getStatus()); // "pending"

myTask.run(
  (result) => {
    console.log(myTask.getStatus()); // "succeeded"
    console.log(result); // "Hello, world!"
  },
  (error) => {
    console.log(myTask.getStatus()); // "failed"
    console.error(error.message); // "Something went wrong!"
  }
);
```

## Author
[@luismiddleton](https://www.github.com/luismiddleton)

## License
[MIT](https://choosealicense.com/licenses/mit)