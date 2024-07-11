import * as fs from 'fs';

let cache = {}


function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

function getParsedData(jsonString: string) {
    if (!cache[jsonString]) {
      if (isValidJSON(jsonString)) {
        cache[jsonString] = JSON.parse(jsonString);
      } else {
        // TODO: Better error reporting
        console.log("Failed to load valid JSON");
        return {}
      }
    }
    return cache[jsonString];
}


export function load(filepath: string): any {
  // Read the file synchronously (for simplicity)
  const rawData: string = fs.readFileSync(filepath, "utf-8");
  return getParsedData(rawData)
}
