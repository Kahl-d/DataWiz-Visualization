import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";


const TimeComponent = () => {

    const ref = useRef();
    const [fileName, setFileName] = useState('1bed.csv');
    const [selectedYear, setSelectedYear] = useState(null);
    const [allYears, setAllYears] = useState([]);
    const [processedData, setProcessedData] = useState({});
    const [uniqueRegions, setUniqueRegions] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const csvData = await d3.csv('1bed.csv'); // Replace with your file path
        const sanFranciscoData = csvData.filter(entry => entry.City === 'San Francisco');
  
        const dataByRegion = sanFranciscoData.reduce((acc, entry) => {
          const regionName = entry.RegionName;
          if (!acc[regionName]) {
            acc[regionName] = {};
          }
  
          Object.keys(entry).forEach(key => {
            if (key.includes('-')) {
              const year = key.substring(0, 4);
              if (!acc[regionName][year]) {
                acc[regionName][year] = [];
              }
              acc[regionName][year].push({
                date: d3.timeParse("%Y-%m-%d")(key),
                value: +entry[key] || 0,
                regionName
              });
            }
          });
  
          return acc;
        }, {});
  
        const years = Array.from(new Set(Object.keys(dataByRegion)
                                         .flatMap(region => Object.keys(dataByRegion[region]))))
                           .sort();
  
        setAllYears(years);
        setSelectedYear(years[0]);
        setProcessedData(dataByRegion);
  
        const regions = new Set(sanFranciscoData.map(entry => entry.RegionName));
        setUniqueRegions(Array.from(regions));
      };
  
      fetchData();
    }, []);

    return (
        <div>
        <h1>TimeComponent</h1>
        </div>
    );
    }

export default TimeComponent;