import { memo, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import type { ResultOption, StateResult } from '@/lib/backend';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
const COLORS = ['#0f766e', '#e0a52e', '#7c6bb1', '#367da5', '#bd6173', '#6b7c45'];
const stateNameToPostalCode: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS',
  Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA',
  Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO', Montana: 'MT',
  Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX',
  Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
};

interface MapGeography {
  rsmKey: string;
  properties: { name: string };
}

type Topology = { type: 'Topology'; objects: Record<string, unknown>; arcs: unknown[] };

function isTopology(value: unknown): value is Topology {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return candidate.type === 'Topology' && Array.isArray(candidate.arcs) &&
    typeof candidate.objects === 'object' && candidate.objects !== null;
}

function USMapComponent({ stateResults, results }: { stateResults: StateResult[]; results: ResultOption[] }) {
  const [geography, setGeography] = useState<Topology | null>(null);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const selected = stateResults.find(row => row.state === selectedState);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let active = true;

    async function loadMap() {
      try {
        const response = await fetch(geoUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('Map unavailable');
        const topology: unknown = await response.json();
        if (!isTopology(topology)) throw new Error('Invalid map');
        if (active) setGeography(topology);
      } catch {
        if (active) setMapUnavailable(true);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadMap();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, []);

  function stateColor(row: StateResult | undefined): string {
    if (!row || row.totalVotes === 0) return '#e5e7eb';
    const maxVotes = Math.max(...results.map(option => row.options[option.optionId].votes));
    const leaders = results.filter(option => row.options[option.optionId].votes === maxVotes);
    if (leaders.length !== 1) return '#9ca3af';
    return COLORS[results.findIndex(option => option.optionId === leaders[0].optionId) % COLORS.length];
  }

  return (
    <div>
      {geography ? (
        <ComposableMap projection="geoAlbersUsa" viewBox="0 80 800 450" aria-label="Poll responses by state">
          <Geographies geography={geography}>
            {({ geographies }) => geographies.map((geo: MapGeography) => {
              const postal = stateNameToPostalCode[geo.properties.name];
              const row = stateResults.find(state => state.state === postal);
              const selectState = () => setSelectedState(postal ?? null);
              return (
                <Geography key={geo.rsmKey} geography={geo} fill={stateColor(row)}
                  stroke={selectedState === postal ? '#172a29' : '#fff'}
                  strokeWidth={selectedState === postal ? 2 : 0.8} tabIndex={0} role="button"
                  aria-label={`${geo.properties.name}: ${row ? `${row.totalVotes.toLocaleString()} votes` : 'no recorded responses'}`}
                  onMouseEnter={selectState} onFocus={selectState} onClick={selectState}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectState(); } }}
                  style={{ default: { outline: 'none', cursor: 'pointer' }, hover: { opacity: 0.75 }, pressed: { opacity: 0.75 } }}
                />
              );
            })}
          </Geographies>
        </ComposableMap>
      ) : (
        <p className="py-14 text-center text-sm text-gray-600" role="status">
          {mapUnavailable ? 'The map is unavailable. State counts are listed below.' : 'Loading the state map…'}
        </p>
      )}

      <p className="text-xs text-gray-600 mb-4">Colors show the answer with the most votes in each state. Gray indicates a tie or no recorded responses.</p>
      <div className="rounded-xl bg-gray-50 p-4 text-sm min-h-[110px]" aria-live="polite">
        {selected ? (
          <>
            <p className="font-semibold">{selected.state} · {selected.totalVotes.toLocaleString()} {selected.totalVotes === 1 ? 'vote' : 'votes'}</p>
            <dl className="mt-2 space-y-1">
              {results.map(option => (
                <div key={option.optionId} className="flex justify-between gap-3">
                  <dt>{option.optionText}</dt>
                  <dd className="tabular-nums">{selected.options[option.optionId].votes.toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : <p className="text-gray-600">{selectedState ? `No responses with a recorded state of ${selectedState}.` : 'Choose a state, or open the full list below.'}</p>}
      </div>

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer font-semibold py-2">View all state counts</summary>
        <div className="max-h-80 overflow-auto mt-3 space-y-4 pr-2">
          {[...stateResults].sort((a, b) => a.state.localeCompare(b.state)).map(row => (
            <div key={row.state}>
              <p className="font-semibold">{row.state} · {row.totalVotes.toLocaleString()} {row.totalVotes === 1 ? 'vote' : 'votes'}</p>
              <dl className="mt-1 space-y-1 text-gray-600">
                {results.map(option => (
                  <div key={option.optionId} className="flex justify-between gap-3">
                    <dt>{option.optionText}</dt><dd className="tabular-nums">{row.options[option.optionId].votes.toLocaleString()}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default memo(USMapComponent);
