import React, { memo } from 'react';
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

const USMapComponent = ({ stateResults, results }: USMapProps) => {
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
    <div className="h-[400px] w-full">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => {
            return geographies.map((geo) => {
              const stateName = geo.properties.name;
              const statePostal = stateNameToPostalCode[stateName];
              const stateData = stateResults.find((s) => s.state === statePostal);

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
                    },
                    hover: {
                      fill: '#666',
                      outline: 'none',
                    },
                  }}
                  title={`${stateName}: ${stateData ? stateData.totalVotes : 0} votes`}
                />
              );
            });
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default memo(USMapComponent);
