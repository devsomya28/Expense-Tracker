export const buildExpenseParserPrompt = (text, currentDate) => {
  return `
You are a financial data extraction parser.
Your job is to extract expense transaction details from natural language text.

CURRENT DATE: ${currentDate}

### RULES:
1. Extract the amount, title, category, payment method, and date.
2. If a field is not explicitly mentioned or clearly implied, return null for that field.
3. Add the name of any missing required fields (amount, title, category, date) to the "missingFields" array.
4. Calculate a confidence score between 0.0 and 1.0 based on how clear the input is.
5. If the user says "today" or "yesterday", calculate the exact ISO date string (YYYY-MM-DD) based on the CURRENT DATE provided above.
6. Categories should be standard (e.g., Food, Transport, Utilities, Entertainment, Shopping, Health).

### TEXT TO PARSE:
"${text}"

### REQUIRED JSON OUTPUT FORMAT:
You MUST respond with raw JSON only. No markdown.
{
  "amount": Number or null,
  "title": "String or null",
  "category": "String or null",
  "paymentMethod": "String or null",
  "date": "YYYY-MM-DD or null",
  "confidence": Number,
  "missingFields": ["field1", "field2"]
}
  `;
};