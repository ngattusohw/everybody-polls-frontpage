import React, { memo, useState } from 'react';
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
  console.log('stateResults:', stateResults); // Debug log
  console.log('results:', results); // Debug log

  const yesOptionId = results.find((r) => r.optionText === 'Yes')?.optionId;

  const getStateColor = (geo: any) => {
    const stateName = geo.properties.name;
    const statePostal = stateNameToPostalCode[stateName];

    const stateData = stateResults.find((s) => s.state === statePostal);

    if (!stateData || !yesOptionId) return '#D3D3D3'; // Light gray for states with no data

    const yesVotes = stateData[yesOptionId]?.votes || 0;
    const total = stateData.totalVotes;

    if (total === 0) return '#D3D3D3';

    // Calculate percentage of "Yes" votes
    const percentage = (yesVotes / total) * 100;
    console.log(
      `${statePostal} - Yes votes: ${yesVotes}, Total: ${total}, Percentage: ${percentage}%`
    );

    // Flip the color scale: red for low "Yes" percentage (high "No"), blue for high "Yes" percentage
    const colorScale = scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#2563eb', '#D3D3D3', '#dc2626']); // Flipped blue and red

    return colorScale(percentage);
  };

  return (
    <div className="h-[400px] w-full relative">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => {
            return geographies.map((geo) => {
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
                    const { clientX, clientY } = evt;
                    console.log('Test');
                    setTooltip({
                      name: stateName,
                      totalVotes,
                      yesVotes,
                      noVotes: totalVotes - yesVotes,
                      x: clientX,
                      y: clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setTooltip(null);
                  }}
                />
              );
            });
          }}
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="absolute z-10 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 40,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 1000,
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
