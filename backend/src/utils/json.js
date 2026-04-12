function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function stringifyJson(value, fallbackValue = {}) {
  try {
    return JSON.stringify(value ?? fallbackValue);
  } catch {
    return JSON.stringify(fallbackValue);
  }
}

module.exports = {
  parseJson,
  stringifyJson
};
