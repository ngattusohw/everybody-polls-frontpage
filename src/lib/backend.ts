export const BACKEND_URL =
  (import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://everybody-polls-api.onrender.com').replace(/\/+$/, '');

export const PUBLIC_API_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'everybody-polls-public';

export interface ResultOption {
  optionId: string;
  optionText: string;
  votes: number;
  percentage: number;
}

export interface StateResult {
  state: string;
  totalVotes: number;
  options: Record<string, { text: string; votes: number }>;
}

export interface ResultsData {
  question: { id: string; text: string };
  results: ResultOption[];
  totalVotes: number;
  stateResults: StateResult[];
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isQuestionId(value: unknown): value is string {
  return typeof value === 'string' && uuidPattern.test(value);
}

export function resultsUrl(questionId: string, query: string): URL {
  const url = new URL(`${BACKEND_URL}/functions/v1/result-data/${encodeURIComponent(questionId)}`);
  new URLSearchParams(query).forEach((value, key) => {
    // A shared link requests public aggregates, never another person's session data.
    if (key !== 'userId') url.searchParams.append(key, value);
  });
  return url;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Validate public aggregates before displaying counts or passing them to charts. */
export function parseResultsData(value: unknown, questionId: string): ResultsData {
  if (!isRecord(value) || !isRecord(value.question) ||
      !isQuestionId(value.question.id) || value.question.id.toLowerCase() !== questionId.toLowerCase() ||
      !isText(value.question.text) || !Array.isArray(value.results) ||
      !isCount(value.totalVotes) || !Array.isArray(value.stateResults)) {
    throw new Error('Invalid poll results');
  }

  // Historical polls can have no options and no responses. Keep that honest empty state.
  if (value.results.length === 0 && (value.totalVotes !== 0 || value.stateResults.length !== 0)) {
    throw new Error('Inconsistent empty poll results');
  }

  const results: ResultOption[] = value.results.map((option: unknown) => {
    if (!isRecord(option) || !isQuestionId(option.optionId) || !isText(option.optionText) ||
        !isCount(option.votes) || typeof option.percentage !== 'number' ||
        !Number.isFinite(option.percentage) || option.percentage < 0 || option.percentage > 100) {
      throw new Error('Invalid poll options');
    }
    return { optionId: option.optionId, optionText: option.optionText, votes: option.votes, percentage: option.percentage };
  });

  if (new Set(results.map(option => option.optionId)).size !== results.length ||
      results.reduce((sum, option) => sum + option.votes, 0) !== value.totalVotes) {
    throw new Error('Inconsistent poll totals');
  }

  const stateResults: StateResult[] = value.stateResults.map((row: unknown) => {
    if (!isRecord(row) || !isText(row.state) || !isCount(row.totalVotes)) {
      throw new Error('Invalid state results');
    }
    const options: StateResult['options'] = {};
    for (const option of results) {
      const stateOption = row[option.optionId];
      if (!isRecord(stateOption) || !isCount(stateOption.votes)) {
        throw new Error('Invalid state option');
      }
      options[option.optionId] = { text: option.optionText, votes: stateOption.votes };
    }
    if (Object.values(options).reduce((sum, option) => sum + option.votes, 0) !== row.totalVotes) {
      throw new Error('Inconsistent state totals');
    }
    return { state: row.state, totalVotes: row.totalVotes, options };
  });

  if (new Set(stateResults.map(row => row.state)).size !== stateResults.length ||
      stateResults.reduce((sum, row) => sum + row.totalVotes, 0) > value.totalVotes) {
    throw new Error('Inconsistent state results');
  }

  return {
    question: { id: value.question.id, text: value.question.text },
    results,
    totalVotes: value.totalVotes,
    stateResults,
  };
}
