import * as fs from "fs";

function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

function getParsedData(jsonString: string) {
  if (isValidJSON(jsonString)) {
    return JSON.parse(jsonString);
  } else {
    // TODO: Better error reporting
    console.log("Failed to load valid JSON");
    return {};
  }
}

export function load(filepath: string) {
  // Read the file synchronously (for simplicity)
  const rawData: string = fs.readFileSync(filepath, "utf-8");
  return getParsedData(rawData);
}
