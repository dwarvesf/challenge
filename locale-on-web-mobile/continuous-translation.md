**Translations for supported language**

**Problem**:

There is no file/space synced between non-developer translators, PO and developers:

- Translators & PO need to align about translations needed for the new features arising during the development
- Developer: to see the up-to-date translations used for coding.

**Suggestion:**

Using G-Sheet to manage translation. All stakeholders can access the sheet for their above work.

Before deployment, developers can use a Git action to fetch the last version of the G-Sheet and generate to locale translation files.

**Steps in detail**:

1. G-Sheet file that contains all supported translations items: [Template](https://docs.google.com/spreadsheets/d/1jjVDCMAmS6WySmB7L25yNCZX-X3jEwrrqLhqOBzVEs0/edit?usp=sharing)

   Sample to fetch data from G-Sheet:

```jsx
// Save on './public/spreadsheet.ts' file
const sheetId = "<Sheet-ID>"; // ;
const sheetName = "<sheet-name>";
const baseUrl = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;

const translateDataPath = "./public/locales/translate-data.json"; // Path to store all transtalion data

export const getJsonData = async () => {
  const res = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      authority: "opensheet.elk.sh",
    },
    mode: "cors",
    credentials: "omit",
  });

  if (res.ok) {
    return await res.json();
  }
};

getJsonData().then((data) => {
  const fs = require("fs");
  let myObject = data;

  // Writing to our JSON file
  var newData = JSON.stringify(myObject, null, 2);
  fs.writeFile(translateDataPath, newData, (err) => {
    // Error checking
    if (err) throw err;
    console.log("New data added");
  });
});
```

Please refer to the [link](https://stackoverflow.com/questions/23760768/how-to-retrieve-data-from-google-spreadsheet-to-javascript-or-json) for more detail about setup to fetch data.

1. After having all translate data, we need to generate to locale files for supported languages:

Action to generate json files:

```jsx
// Save on './public/manage-translations.ts' file
import path from "path";
import fs from "node:fs/promises";
import fsExtra from "fs-extra";
import _ from "lodash";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config();

const validLang = ["en-US", "de-DE", "fr-FR"];
const defaultLanguage =
  process.env.LOCALE == null
    ? "en-US"
    : validLang.includes(process.env.LOCALE)
    ? process.env.LOCALE
    : "en-US";

const configs = {
  defaultLanguage,
  otherLanguages: validLang.filter((lang) => lang !== defaultLanguage),
  rootExportPath: "./public/locales",
};

const allLocales = [];

async function generateJSONFiles() {
  const data = await fs.readFile(
    "./public/locales/translate-data.json",
    "utf8",
  );
  const jsonData = JSON.parse(data);
  const locales = Object.keys(jsonData[0]).filter((key) => key !== "elementId");
  const result = locales.map((locale) => {
    const data = {};
    jsonData.forEach((item) => {
      data[item.elementId] = item[locale];
    });
    return {
      name: locale,
      data,
    };
  });

  result.forEach((item) => {
    const filePath = path.join(
      configs.rootExportPath,
      item.name,
      "common.json",
    );
    fsExtra.outputJsonSync.call(null, filePath, item.data, { spaces: 2 });
  });
}

function init() {
  allLocales.push(configs.defaultLanguage);
  for (const otherLang of configs.otherLanguages) {
    allLocales.push(otherLang);
  }
}

try {
  init();
  generateJSONFiles();
} catch (err) {
  console.error(`Run translation failed!`, err);
}
```

Structure:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3f6e5d70-415c-4d7f-9820-dfed3b0d9eab/Untitled.png)

In additional, we can add all above steps as step in Github action for CI running:

```jsx
"ci-get-translation-data": "npx -p node@18 ts-node ./public/spreadsheet.ts",
"translate": "TS_NODE_FILES=true ts-node ./public/manage-translations.ts",
"pre-install": "npm run ci-get-translation-data && npm run translate"
```
