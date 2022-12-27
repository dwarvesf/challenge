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
