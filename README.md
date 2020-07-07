<h1 align="center">usePromiseConnect</h1>

<p align="center">Connects promise to a component and provide utilities to track its execution.</p>

## Table of Contents

- [Why it was Built](#why-it-was-built)
- [Installation](#installation)
- [How to Use](#how-to-use)

## Why it was Built

This library is the result of deep dive into Typescript type manipulations and (what a coincidence) simplifies my daily routine on the current project 😎

## Installation

`npm i use-promise-connect`

## How to Use

The next code sample displays how to connect one promise function to use in the component. This will work the same with any amount of the promise functions.

```jsx
import { usePromiseConnect } from "use-promise-connect";

const fetchMock = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 1000));

export const AwesomeComponent = () => {
  const api = usePromiseConnect({ fetchMock });

  if (api.fetchMock.loading) {
    return <p>Loading...</p>;
  }

  if (api.fetchMock.error) {
    return <p>Oops! {api.fetchMock.error.message}</p>;
  }

  return (
    <>
      <button onClick={() => api.fetchMock.send(42)}>
        Click Me to Fetch Data!
      </button>
      <p>Data is: {api.fetchMock.data}</p>
    </>
  );
};
```

## Test

`npm test`
