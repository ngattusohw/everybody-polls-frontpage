import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ArrowUpRight, Loader2, RefreshCw } from 'lucide-react';
import { PieChartComponent } from '@/components/visualizations/PieChartComponent';
import USMapComponent from '@/components/visualizations/USMapComponent';
import { isQuestionId, parseResultsData, PUBLIC_API_KEY, resultsUrl } from '@/lib/backend';
import type { ResultsData } from '@/lib/backend';

type LoadState =
  | { status: 'loading'; requestKey: string }
  | { status: 'ready'; requestKey: string; data: ResultsData }
  | { status: 'error'; requestKey: string; title: string; message: string; retryable: boolean };

const filterLabels: Record<string, string> = {
  age: 'Age', gender: 'Gender', state: 'State', race_ethnicity: 'Race / ethnicity',
  income_bracket: 'Income', occupation: 'Occupation', political_party: 'Political party',
  political_leaning: 'Political leaning', employment_status: 'Employment', employment: 'Employment',
  citizenship_status: 'Citizenship', citizenship: 'Citizenship',
};

export default function SharedResults() {
  const [searchParams] = useSearchParams();
  const { questionId } = useParams();
  const query = searchParams.toString();
  const requestKey = `${questionId ?? ''}?${query}`;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: 'loading', requestKey });
  // Avoid showing the previous poll while a route or filter change starts a request.
  const current: LoadState = state.requestKey === requestKey ? state : { status: 'loading', requestKey };
  const filters = [...searchParams.entries()].filter(([key]) => key !== 'userId');

  useEffect(() => {
    if (!isQuestionId(questionId)) {
      setState({ status: 'error', requestKey, title: 'This poll link is incomplete',
        message: 'Open the full shared link to view its results.', retryable: false });
      return;
    }

    const pollId = questionId;
    const controller = new AbortController();
    let timedOut = false;
    let active = true;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
    setState({ status: 'loading', requestKey });

    async function loadResults() {
      try {
        const response = await fetch(resultsUrl(pollId, query), {
          headers: { Authorization: `Bearer ${PUBLIC_API_KEY}` },
          signal: controller.signal,
        });
        if (!active) return;
        if (timedOut) throw new Error('Request timed out');
        if (!response.ok) {
          if (response.status === 404) {
            setState({ status: 'error', requestKey, title: 'Poll not found',
              message: 'This poll is unavailable. Check the shared link or return to the homepage.', retryable: false });
          } else if (response.status === 400) {
            setState({ status: 'error', requestKey, title: 'These results could not be requested',
              message: 'This link contains an invalid poll identifier or filter. Try opening the poll without filters.', retryable: false });
          } else {
            setState({ status: 'error', requestKey, title: 'Results are temporarily unavailable',
              message: 'We could not load this poll right now. Please try again.', retryable: true });
          }
          return;
        }

        let data: ResultsData;
        try {
          data = parseResultsData(await response.json(), pollId);
        } catch (error) {
          if (controller.signal.aborted) throw error;
          if (!active) return;
          setState({ status: 'error', requestKey, title: 'Results are not ready to display',
            message: 'The poll returned incomplete results. Please try again in a moment.', retryable: true });
          return;
        }
        if (active && !controller.signal.aborted) setState({ status: 'ready', requestKey, data });
      } catch {
        if (!active) return;
        if (controller.signal.aborted && !timedOut) return;
        setState({ status: 'error', requestKey, title: timedOut ? 'Results took too long to load' : 'We could not connect',
          message: timedOut ? 'Please try loading this poll again.' : 'Check your connection and try again.', retryable: true });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadResults();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [questionId, query, requestKey, attempt]);

  const data = current.status === 'ready' ? current.data : null;
  const title = data ? `${data.question.text} — Results | Everybody Polls` : 'Poll results | Everybody Polls';
  const description = data
    ? `Results for “${data.question.text}”. ${data.totalVotes.toLocaleString()} votes${filters.length ? ' with the selected filters' : ''}.`
    : 'View shared poll results from Everybody Polls.';
  const socialImage = new URL('/social-preview.png', window.location.origin).href;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialImage} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImage} />
      </Helmet>

      <main className="section-shell shared-results-page py-12 sm:py-20" style={{ minHeight: '65vh' }}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-10">
          <ArrowLeft size={16} aria-hidden="true" /> Everybody Polls
        </Link>

        {current.status === 'loading' && (
          <div className="py-20 text-center" role="status" aria-live="polite">
            <Loader2 className="mx-auto mb-5 h-8 w-8 animate-spin" aria-hidden="true" />
            <h1 className="text-2xl font-bold">Loading poll results</h1>
            <p className="mt-3 text-gray-600">Getting the latest totals for this shared poll.</p>
          </div>
        )}

        {current.status === 'error' && (
          <div className="error-state max-w-2xl py-12" role="alert">
            <p className="eyebrow mb-4">Shared results</p>
            <h1 className="text-3xl sm:text-4xl font-bold">{current.title}</h1>
            <p className="mt-4 text-gray-600 leading-relaxed">{current.message}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {current.retryable && (
                <button type="button" className="primary-button" onClick={() => setAttempt(value => value + 1)}>
                  <RefreshCw size={16} aria-hidden="true" /> Try again
                </button>
              )}
              {filters.length > 0 && isQuestionId(questionId) && (
                <Link to={`/shared/${questionId}`} className="secondary-button">View without filters</Link>
              )}
              <Link to="/" className="secondary-button">Back to homepage</Link>
            </div>
          </div>
        )}

        {data && (
          <>
            <header className="shared-results-heading max-w-4xl mb-10">
              <p className="eyebrow mb-4">Shared poll results</p>
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{data.question.text}</h1>
              <p className="mt-5 text-gray-600">
                <strong className="text-gray-900">{data.totalVotes.toLocaleString()}</strong>{' '}
                {data.totalVotes === 1 ? 'vote' : 'votes'}{filters.length > 0 ? ' with these filters' : ' in this poll'}
              </p>
              {filters.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Selected filters">
                  {filters.map(([key, value], index) => (
                    <span key={`${key}-${index}`} className="rounded-full border border-gray-300 px-3 py-1 text-xs">
                      {filterLabels[key] ?? key.replace(/_/g, ' ')}: {value}
                    </span>
                  ))}
                  <Link to={`/shared/${data.question.id}`} className="text-sm font-semibold underline underline-offset-4 ml-2">Clear filters</Link>
                </div>
              )}
            </header>

            {data.totalVotes === 0 ? (
              <section className="results-panel rounded-2xl border border-gray-200 bg-white p-8 sm:p-12">
                <h2 className="text-2xl font-bold">{filters.length ? 'No votes match these filters' : 'No votes yet'}</h2>
                <p className="mt-3 text-gray-600">{filters.length
                  ? 'Remove the filters to see all available responses for this poll.'
                  : 'Results will appear here when responses are recorded.'}</p>
                {filters.length > 0 && <Link to={`/shared/${data.question.id}`} className="secondary-button mt-6">View all responses</Link>}
              </section>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="results-panel min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
                  <h2 className="text-xl font-bold">{filters.length ? 'Filtered results' : 'Overall results'}</h2>
                  <PieChartComponent results={data.results} />
                  <table className="w-full text-sm">
                    <caption className="sr-only">Exact response counts and percentages</caption>
                    <thead><tr className="border-b border-gray-200 text-left"><th scope="col" className="py-3 font-medium">Answer</th><th scope="col" className="py-3 text-right font-medium">Votes</th><th scope="col" className="py-3 text-right font-medium">Share</th></tr></thead>
                    <tbody>{data.results.map(option => (
                      <tr key={option.optionId} className="border-b border-gray-100">
                        <th scope="row" className="py-3 pr-3 text-left font-medium">{option.optionText}</th>
                        <td className="py-3 text-right tabular-nums">{option.votes.toLocaleString()}</td>
                        <td className="py-3 pl-3 text-right tabular-nums">{option.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </section>
                <section className="results-panel min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
                  <h2 className="text-xl font-bold">Results by state</h2>
                  <p className="mt-2 text-sm text-gray-600">Responses with a recorded state. Select a state to see its counts.</p>
                  {data.stateResults.length > 0 ? (
                    <USMapComponent stateResults={data.stateResults} results={data.results} />
                  ) : <p className="py-16 text-center text-gray-600">No state data is available for these responses.</p>}
                </section>
              </div>
            )}

            <p className="mt-10 text-sm text-gray-600">These totals reflect responses to this poll{filters.length ? ' with the selected filters' : ''}.</p>
            <Link to="/" className="secondary-button mt-6">Explore Everybody Polls <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </>
        )}
      </main>
    </>
  );
}
