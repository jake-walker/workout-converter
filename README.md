# Workout Converter

<!-- automd:badges license no-npmDownloads provider="badgen" -->

[![npm version](https://flat.badgen.net/npm/v/@jakew/workout-converter)](https://npmjs.com/package/@jakew/workout-converter)
[![license](https://flat.badgen.net/github/license/jake-walker/workout-converter)](https://github.com/jake-walker/workout-converter/blob/main/LICENSE)

<!-- /automd -->

A TypeScript library for converting strength training workout data between different formats.

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @jakew/workout-converter

# npm
npm install @jakew/workout-converter

# yarn
yarn add @jakew/workout-converter

# pnpm
pnpm install @jakew/workout-converter

# bun
bun install @jakew/workout-converter

# deno
deno install @jakew/workout-converter
```

<!-- /automd -->

## Usage

<!-- automd:jsimport imports="getAdapterInfo,convertData" -->

**ESM** (Node.js, Bun, Deno)

```js
import { getAdapterInfo, convertData } from "@jakew/workout-converter";
```

<!-- /automd -->

<!-- automd:jsdocs src="./src/index" -->

### `convertData(input, fromAdapterName, toAdapterName)`

Perform data conversion using a specified input and output adapter.

**Example:**

```ts
convertData(myBlob, "Strong", "NextRep");
```

### `getAdapterInfo()`

Get information about all available adapters.

**Example:**

```ts
getAdapterInfo();
// -> [{"title": "NextRep", "description": "...", "website": "https://nextrep.app"}]
```

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
