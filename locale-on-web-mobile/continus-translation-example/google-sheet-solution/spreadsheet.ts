const sheetId = ""; // Your sheet id here
const sheetName = "translate-data";
const baseUrl = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;

const translateDataPath = "./public/locales/translate-data.json";

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
