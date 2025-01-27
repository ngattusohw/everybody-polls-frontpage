import React, { memo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface StateResult {
  state: string;
  totalVotes: number;
  [key: string]: any;
}

interface USMapProps {
  stateResults: StateResult[];
  optionIds: string[];
}

const USMapComponent = ({ stateResults, optionIds }: USMapProps) => {
  // Create a color scale based on voting percentages
  const getStateColor = (geo: any) => {
    const stateData = stateResults.find((s) => s.state === geo.properties.postal);
    if (!stateData) return '#D3D3D3'; // Light gray for states with no data

    const yesVotes = stateData[optionIds[0]].votes;
    const noVotes = stateData[optionIds[1]].votes;
    const total = yesVotes + noVotes;

    if (total === 0) return '#D3D3D3';

    // Calculate percentage of "Yes" votes
    const percentage = (yesVotes / total) * 100;

    // Create a color gradient from red (0%) to blue (100%)
    const colorScale = scaleLinear<string>()
      .domain([0, 50, 100])
      .range(['#dc2626', '#D3D3D3', '#2563eb']);

    return colorScale(percentage);
  };

  return (
    <div className="h-[400px] w-full">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateData = stateResults.find((s) => s.state === geo.properties.postal);

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
                  title={`${geo.properties.name}: ${stateData ? stateData.totalVotes : 0} votes`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default memo(USMapComponent);
