import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Select, MenuItem, FormControl, InputLabel, Box, Typography, Grid } from "@mui/material";

const Timeseries = ({ name }) => {
  const ref = useRef();
  const legendContainerRef = useRef();
  const [selectedYear, setSelectedYear] = useState(null);
  const [allYears, setAllYears] = useState([]);
  const [processedData, setProcessedData] = useState({});
  const [uniqueRegions, setUniqueRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await d3.csv(name);
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
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
      setProcessedData(dataByRegion);

      const regions = new Set(sanFranciscoData.map(entry => entry.RegionName));
      setUniqueRegions(Array.from(regions));
    };

    fetchData();
  }, [name]);

  useEffect(() => {
    if (selectedYear && processedData) {
      drawChart();
    }
  }, [selectedYear, processedData]);

  const drawChart = () => {
    const svg = d3.select(ref.current);
    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2 - 40;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("*").remove();

    const angleScale = d3.scaleTime()
      .domain([new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31)])
      .range([0, 2 * Math.PI]);

    const maxValue = d3.max(Object.values(processedData).flatMap(region => region[selectedYear]), d => d.value);
    const radialScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);

    const lineGenerator = d3.lineRadial()
      .angle(d => angleScale(d.date))
      .radius(d => radialScale(d.value))
      .curve(d3.curveCardinalClosed);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("text-align", "center")
      .style("padding", "8px")
      .style("background", "rgba(255, 255, 255, 0.85)")
      .style("border", "solid 1px #aaa")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

    svg.attr("viewBox", [-width / 2, -height / 2, width, height])
      .selectAll("path")
      .data(Object.entries(processedData).map(([region, values]) => values[selectedYear]))
      .join("path")
        .attr("fill", "none")
        .attr("stroke", (_, i) => colorScale(i))
        .attr("d", lineGenerator)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("stroke-width", "4");
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltip.html(`Region: ${d[0].regionName}<br/>Value: ${d3.format(",.2f")(d[0].value)}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", "2");
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    const months = d3.timeMonths(new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31));
    svg.selectAll(".month-label")
      .data(months)
      .enter().append("text")
        .attr("class", "month-label")
        .attr("x", d => (radius + 20) * Math.cos(angleScale(d) - Math.PI / 2))
        .attr("y", d => (radius + 20) * Math.sin(angleScale(d) - Math.PI / 2))
        .attr("text-anchor", "middle")
        .text(d => d3.timeFormat("%b")(d));

    const axisColor = 'white';
    const numTicks = 5;
    svg.selectAll(".radial-axis")
    .data(radialScale.ticks(numTicks))
    .enter().append("circle")
      .attr("class", "radial-axis")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", d => radialScale(d))
      .style("fill", "none")
      .style("stroke", axisColor) // Set the stroke color to white
      .style("stroke-dasharray", "2,2");

        svg.selectAll(".radial-axis-label")
        .data(radialScale.ticks(numTicks))
        .enter().append("text")
          .attr("class", "radial-axis-label")
          .attr("x", 0)
          .attr("y", d => -radialScale(d))
          .attr("dy", "-0.4em")
          .attr("text-anchor", "middle")
          .style("fill", axisColor) // Set the fill color to white
          .text(d => `$${d3.format(",")(d)}`);

        const legendContainer = d3.select(legendContainerRef.current).html('');

        uniqueRegions.forEach((region, i) => {
          const legendItem = legendContainer.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-right', '10px')
            .style('margin-bottom', '10px'); // Adjusted margin-bottom for spacing
    
          legendItem.append('div')
            .style('width', '15px')
            .style('height', '15px')
            .style('background-color', colorScale(i))
            .style('margin-right', '5px');
    
          legendItem.append('text')
            .style('font-size', '0.8em')
            .text(region);
        });
      };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Select Year</Typography>
          <FormControl>
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear || ""}
              label="Year"
              onChange={e => setSelectedYear(e.target.value)}
            >
              {allYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
            <div className="legend-container" ref={legendContainerRef} style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap' }} />
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <svg ref={ref} width={800} height={800} />
      </Grid>
    </Grid>
  );
};

export default Timeseries;
