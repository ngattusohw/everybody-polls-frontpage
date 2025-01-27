import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PieChart, BarChart3, Loader2 } from 'lucide-react';
import { PieChartComponent } from '@/components/visualizations/PieChartComponent';
import USMapComponent from '@/components/visualizations/USMapComponent';
import * as htmlToImage from 'html-to-image'; // Changed to regular import

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
  const [chartImageUrl, setChartImageUrl] = useState<string>('');
  const chartRef = useRef<HTMLDivElement>(null);

  // Function to convert chart to base64 image
  const generateChartImage = async () => {
    if (!chartRef.current || !data) return;

    try {
      // Use html-to-image library to convert the chart to base64
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        quality: 1.0,
        backgroundColor: 'white',
      });
      setChartImageUrl(dataUrl);
    } catch (error) {
      console.error('Error generating chart image:', error);
    }
  };

  useEffect(() => {
    if (data) {
      generateChartImage();
    }
  }, [data]);

  // Generate the OG image URL using the chart image
  // const ogImageUrl =
  //   data && chartImageUrl
  //     ? `https://og-image.vercel.app/**${encodeURIComponent(data.question.text)}**` +
  //       `%0A%0A![Poll Results](${encodeURIComponent(chartImageUrl)})` +
  //       `%0A%0ATotal Votes: ${data.totalVotes}` +
  //       `%0A%0A**Everybody Polls**` +
  //       `.png?theme=light&md=1&fontSize=75px`
  //     : '';

  // ... existing code ...
  const ogImageUrl = `https://og-image.vercel.app/${encodeURIComponent(
    data?.question.text
  )}?theme=light&md=1&fontSize=75px`;
  // ... existing code ...

  useEffect(() => {
    console.log('OG Image URL:', ogImageUrl); // Debug log
  }, [ogImageUrl]);

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
        <title>
          {data ? `Poll Results: ${data.question.text} | Everybody Polls` : 'Loading...'}
        </title>
        <meta
          name="description"
          content={
            data
              ? `See how people voted on: ${data.question.text}. Total votes: ${data.totalVotes}`
              : ''
          }
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:title"
          content={data ? `Poll Results: ${data.question.text}` : 'Poll Results'}
        />
        <meta
          property="og:description"
          content={
            data
              ? `See how Americans voted on this important question. Total votes: ${data.totalVotes}`
              : ''
          }
        />
        <meta property="og:image" content={ogImageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta
          name="twitter:title"
          content={data ? `Poll Results: ${data.question.text}` : 'Poll Results'}
        />
        <meta
          name="twitter:description"
          content={
            data
              ? `See how Americans voted on this important question. Total votes: ${data.totalVotes}`
              : ''
          }
        />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      {/* Hidden chart for image generation */}
      {/* <div className="hidden">
        <div
          ref={chartRef}
          style={{ width: '400px', height: '400px', background: 'white', padding: '20px' }}
        >
          <PieChartComponent results={data?.results || []} />
        </div>
      </div> */}

      {/* Debug element */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg z-50">
          <p className="text-sm font-semibold mb-2">Debug: OG Image Preview</p>
          <img src={ogImageUrl} alt="OG Preview" className="max-w-[300px]" />
          {chartImageUrl && (
            <div className="mt-2">
              <p className="text-sm font-semibold mb-2">Chart Image:</p>
              <img src={chartImageUrl} alt="Chart" className="max-w-[200px]" />
            </div>
          )}
        </div>
      )}

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
              <div className="bg-gray-50 p-4 rounded-lg" ref={chartRef}>
                <h3 className="text-xl font-semibold mb-4">Overall Results</h3>
                <PieChartComponent results={results} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Results by State</h3>
                <USMapComponent
                  stateResults={data.stateResults}
                  results={results} // Pass the full results array instead of just IDs
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
