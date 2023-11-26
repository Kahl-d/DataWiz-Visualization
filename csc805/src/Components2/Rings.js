import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Rings = () => {
  const [groupedData, setGroupedData] = useState({});
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [chartData, setChartData] = useState([]);
  const [totalCrimeData, setTotalCrimeData] = useState([]);

  useEffect(() => {
    // Function to fetch and process data
    const fetchData = async () => {
      const data = await d3.csv('df_filtered.csv');

      // Group data by Police District (region), then by Incident Year, and finally by Incident Type
      const newData = {};

      data.forEach((entry) => {
        const region = entry['Police District'];
        const year = entry['Incident Year'];
        const type = entry['Incident Category'];

        if (!newData[region]) {
          newData[region] = {};
        }

        if (!newData[region][year]) {
          newData[region][year] = {};
        }

        if (!newData[region][year][type]) {
          newData[region][year][type] = [];
        }

        // Include relevant information about each incident
        newData[region][year][type].push({
          'Incident ID': entry['Incident ID'],
        });
      });

      setGroupedData(newData);

      // Extract unique crime types
      const types = Array.from(new Set(data.map((entry) => entry['Incident Category'])));
      setCrimeTypes(types);

      // Set a default crime type to show on initial render
      if (types.length > 0) {
        setSelectedCrimeType(types[0]);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run the effect once on component mount

  const generateChartData = () => {
    const newChartData = [];

    Object.keys(groupedData).forEach((region) => {
      Object.keys(groupedData[region]).forEach((year) => {
        const yearData = groupedData[region][year];

        if (selectedCrimeType === 'Total Crime') {
          const totalCount = Object.keys(yearData).reduce(
            (acc, crimeType) => acc + yearData[crimeType].length,
            0
          );

          const existingEntry = newChartData.find(
            (entry) => entry.year === year
          );

          if (existingEntry) {
            existingEntry[region] = totalCount;
          } else {
            const newEntry = {
              year,
              [region]: totalCount,
            };
            newChartData.push(newEntry);
          }
        } else if (yearData[selectedCrimeType]) {
          const count = yearData[selectedCrimeType].length;

          const existingEntry = newChartData.find(
            (entry) => entry.year === year
          );

          if (existingEntry) {
            existingEntry[region] = count;
          } else {
            const newEntry = {
              year,
              [region]: count,
            };
            newChartData.push(newEntry);
          }
        }
      });
    });

    return newChartData;
  };

  const handleCrimeTypeChange = (event) => {
    setSelectedCrimeType(event.target.value);
  };

  useEffect(() => {
    const newData = generateChartData();
    setChartData(newData);
  }, [selectedCrimeType, groupedData]);

  const yMax = useMemo(() => {
    // Dynamically calculate the maximum value for the y-axis based on the selected crime type
    const maxCount = Math.max(...chartData.map((entry) => entry[selectedCrimeType] || 0));
    return Math.ceil(maxCount / 10) * 10; // Round up to the nearest multiple of 10
  }, [chartData, selectedCrimeType]);

  return (
    <div>
      <h1>Rings</h1>

      <FormControl style={{ minWidth: 200 }}>
        <InputLabel id="crime-type-label">Crime Type</InputLabel>
        <Select
          labelId="crime-type-label"
          id="crime-type-select"
          value={selectedCrimeType}
          onChange={handleCrimeTypeChange}
        >
          {['Total Crime', ...crimeTypes].map((crimeType) => (
            <MenuItem key={crimeType} value={crimeType}>
              {crimeType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ResponsiveContainer width="80%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <XAxis dataKey="year" />
          <YAxis type="number" domain={[0, yMax]} />
          <Tooltip />
          <Legend />
          {chartData.length > 0 &&
            Object.keys(chartData[0])
              .filter((key) => key !== 'year')
              .map((region, index) => {
                const color = d3.schemeCategory10[index % 10]; // Use D3 color scale
                return (
                  <Line
                    key={region}
                    type="monotone"
                    dataKey={region}
                    stroke={color}
                    dot={false}
                  />
                );
              })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Rings;
