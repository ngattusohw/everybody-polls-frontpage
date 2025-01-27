import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PieChart, BarChart3, Loader2 } from 'lucide-react';

interface ResultsData {
  question: {
    id: string;
    text: string;
  };
  results: {
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  stateResults: {
    state: string;
    totalVotes: number;
    [key: string]: any;
  }[];
}

export default function SharedResults() {
  const [searchParams] = useSearchParams();
  const { questionId } = useParams();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!questionId) throw new Error('Question ID is required');

        console.log(`Questionid ${questionId}`);
        const url = new URL(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/result-data/${questionId}`
        );

        // Add all demographic filters from URL params
        searchParams.forEach((value, key) => {
          url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch results');

        const resultData = await response.json();
        setData(resultData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Results</h2>
          <p className="text-gray-600">{error || 'Failed to load poll results'}</p>
        </div>
      </div>
    );
  }

  const { question, results, totalVotes } = data;

  return (
    <>
      <Helmet>
        <title>{`Poll Results: ${question.text} | Everybody Polls`}</title>
        <meta name="description" content={`See how people voted on: ${question.text}`} />
        <meta property="og:title" content={`Poll Results: ${question.text}`} />
        <meta
          property="og:description"
          content={`See how Americans voted on this important question. Total votes: ${totalVotes}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-2xl font-bold mb-4">{question.text}</h1>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Votes: {totalVotes.toLocaleString()}</p>
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Results visualization components will go here */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">{/* Pie Chart Component */}</div>
              <div className="bg-gray-50 p-4 rounded-lg">{/* US Map Component */}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
