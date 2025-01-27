import React, { memo, useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Add state name to postal code mapping
const stateNameToPostalCode: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

interface StateResult {
  state: string;
  totalVotes: number;
  [key: string]: any;
}

interface USMapProps {
  stateResults: StateResult[];
  results: {
    optionId: string;
    optionText: string;
  }[];
}

interface TooltipData {
  name: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  x: number;
  y: number;
}

const USMapComponent = ({ stateResults, results }: USMapProps) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const yesOptionId = results.find((r) => r.optionText === 'Yes')?.optionId;

  const getStateColor = useCallback(
    (geo: any) => {
      const stateName = geo.properties.name;
      const statePostal = stateNameToPostalCode[stateName];

      const stateData = stateResults.find((s) => s.state === statePostal);

      if (!stateData || !yesOptionId) return '#D3D3D3';

      const yesVotes = stateData[yesOptionId]?.votes || 0;
      const total = stateData.totalVotes;

      if (total === 0) return '#D3D3D3';

      const percentage = (yesVotes / total) * 100;

      const colorScale = scaleLinear<string>()
        .domain([0, 50, 100])
        .range(['#2563eb', '#D3D3D3', '#dc2626']);

      return colorScale(percentage);
    },
    [stateResults, yesOptionId]
  );

  return (
    <div className="h-[400px] w-full relative" style={{ touchAction: 'none' }}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const statePostal = stateNameToPostalCode[stateName];
              const stateData = stateResults.find((s) => s.state === statePostal);
              const yesVotes = stateData?.[yesOptionId]?.votes || 0;
              const totalVotes = stateData?.totalVotes || 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateColor(geo)}
                  stroke="#FFF"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    hover: {
                      fill: '#666',
                      outline: 'none',
                    },
                  }}
                  onMouseEnter={(evt) => {
                    const { pageX, pageY } = evt;
                    setTooltip({
                      name: stateName,
                      totalVotes,
                      yesVotes,
                      noVotes: totalVotes - yesVotes,
                      x: pageX,
                      y: pageY,
                    });
                  }}
                  onMouseLeave={() => {
                    setTooltip(null);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <div className="font-semibold">{tooltip.name}</div>
          <div className="text-gray-600">
            Total Votes: {tooltip.totalVotes}
            {tooltip.totalVotes > 0 && (
              <>
                <br />
                Yes: {tooltip.yesVotes} (
                {((tooltip.yesVotes / tooltip.totalVotes) * 100).toFixed(1)}%)
                <br />
                No: {tooltip.noVotes} ({((tooltip.noVotes / tooltip.totalVotes) * 100).toFixed(1)}%)
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(USMapComponent);
