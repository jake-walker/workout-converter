# Workout Converter

<!-- automd:badges name="@jakew/workout-converter" github="jake-walker/workout-converter" license no-npmDownloads provider="badgen" -->

[![npm version](https://flat.badgen.net/npm/v/@jakew/workout-converter)](https://npmjs.com/package/@jakew/workout-converter)
[![license](https://flat.badgen.net/github/license/jake-walker/workout-converter)](https://github.com/jake-walker/workout-converter/blob/main/LICENSE)

<!-- /automd -->

A TypeScript library for converting strength training workout data between different apps and formats.

If you are looking to use the tool, you can use it [here](https://nextrep.app/convert/) - all the conversion happens in your browser locally.

## Formats

The following apps/formats are supported:

<!-- automd:adapter-table -->

| Format | Description |
| --- | --- |
| **[NextRep](https://nextrep.app)** | Convert workout and template data to and from NextRep's JSON format. |
| **[NextRep (v1)](https://nextrep.app)** | Convert workout and template data to and from the format used for version 1 of the NextRep app. |
| **[Strong](https://strong.app)** | Convert workout data to and from Strong's CSV format. Please note Strong does not support the export of templates, or importing data back into the app. |
| **[Hevy](https://www.hevyapp.com/)** | Convert workout data to and from Hevy's CSV format. Hevy does not support the export of templates and importing to Hevy requires a Strong CSV file. |

<!-- /automd -->

## Install

<!-- automd:pm-install name="@jakew/workout-converter" -->

```sh
# ✨ Auto-detect
npx nypm install @jakew/workout-converter

# npm
npm install @jakew/workout-converter

# yarn
yarn add @jakew/workout-converter

# pnpm
pnpm add @jakew/workout-converter

# bun
bun install @jakew/workout-converter

# deno
deno install npm:@jakew/workout-converter
```

<!-- /automd -->

## Usage

The premise is there are "adapters" for each app or format. When converting between two different formats, the data is converted using the "input adapter" to a common format, then a second "output adapter" converts the common format to it's format. Each adapter contains a method for converting from it's format to the common format, and vice-versa, creating import and export functions.

Use the `getAdapterInfo()` function to get a list of available adapters and descriptions. Then use the `convertData()` function to perform data conversion between two different formats.

<!-- automd:jsimport imports="getAdapterInfo,convertData" name="@jakew/workout-converter" cdn -->

**ESM** (Node.js, Bun, Deno)

```js
import { getAdapterInfo, convertData } from "@jakew/workout-converter";
```

**CDN** (Deno and Browsers)

```js
import {
  getAdapterInfo,
  convertData,
} from "https://esm.sh/@jakew/workout-converter";
```

<!-- /automd -->

**Usage Example**

```js
// Convert from a Strong CSV to a NextRep JSON
await convertData(myBlob, "Strong", "NextRep");
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[GNU GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
