import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get data from URL parameters
    const question = searchParams.get('question') ?? 'Poll Results';
    const totalVotes = searchParams.get('totalVotes') ?? '0';
    const yesPercentage = searchParams.get('yesPercentage') ?? '0';
    const noPercentage = searchParams.get('noPercentage') ?? '0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#2563eb">
              {/* Vote icon */}
              <path d="M20 4v12H4V4h16m2-2H2v16h20V2z M12 15l-5-5h10l-5 5z" />
            </svg>
            <span style={{ marginLeft: '10px', fontSize: '24px', fontWeight: 'bold' }}>
              Everybody Polls
            </span>
          </div>

          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {question}
          </div>

          <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2563eb' }}>
                {yesPercentage}%
              </div>
              <div style={{ fontSize: '24px' }}>Yes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626' }}>
                {noPercentage}%
              </div>
              <div style={{ fontSize: '24px' }}>No</div>
            </div>
          </div>

          <div style={{ fontSize: '20px', color: '#666' }}>Total Votes: {totalVotes}</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
