/**
 * The backend prompts Gemini to return raw JSON (no markdown, no code
 * fences) matching a specific schema. In practice LLMs sometimes still
 * wrap it in ```json fences or add a stray sentence before/after, so this
 * tries a few strategies before giving up and treating it as plain text.
 */
export function parseAiJson(raw) {
  if (raw == null) return null;
  if (typeof raw === "object") return raw; // already parsed

  let text = String(raw).trim();

  // Strip ```json ... ``` or ``` ... ``` fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const tryParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };

  let parsed = tryParse(text);
  if (parsed !== undefined) return parsed;

  // Fall back to grabbing the outermost { ... } block in case of
  // leading/trailing prose around the JSON.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    parsed = tryParse(text.slice(start, end + 1));
    if (parsed !== undefined) return parsed;
  }

  return null;
}
