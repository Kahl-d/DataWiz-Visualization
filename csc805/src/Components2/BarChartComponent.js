import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import './styles.css'; // Assuming you have a CSS file for styling

const BarChartComponent = () => {
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 60, bottom: 100, left: 80 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Initialize scales and axes
    const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const yScaleCrime = d3.scaleLinear().range([height, 0]);
    const yScaleRent = d3.scaleLinear().range([height, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxisLeft = d3.axisLeft(yScaleCrime);
    const yAxisRight = d3.axisRight(yScaleRent);

    // Define the tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "solid 1px #aaa")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("text-align", "center");

    // Load the data
    d3.json('rent_population_comparison.json').then(data => {
      // Extract unique years and populate the year filter dropdown
      const years = Array.from(new Set(data.map(d => d.year)));
      setSelectedYear(selectedYear => (years.includes(selectedYear) ? selectedYear : years[0]));

      // Initial chart rendering
      updateChart(data, selectedYear);
    });

    // Function to update the chart based on the selected year
    function updateChart(data, selectedYear) {
      // Filter data based on the selected year
      const filteredData = selectedYear === "all" ? data : data.filter(d => d.year === selectedYear);

      // Sort the filtered data by crime rate in descending order
      filteredData.sort((a, b) => b.population - a.population);

      // Update scales
      xScale.domain(filteredData.map(d => d.neighborhood));
      yScaleCrime.domain([0, d3.max(filteredData, d => d.population)]);
      yScaleRent.domain([0, d3.max(filteredData, d => d.averageRent)]);

      // Create the axes
      svg.selectAll(".x-axis").remove();
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.selectAll(".y-axis-left").remove();
      svg.append("g")
        .attr("class", "y-axis-left")
        .call(yAxisLeft);

      svg.selectAll(".y-axis-right").remove();
      svg.append("g")
        .attr("class", "y-axis-right")
        .attr("transform", `translate(${width},0)`)
        .call(yAxisRight);

      // Create bars for population
      svg.selectAll(".bar-crime").remove();
      svg.selectAll(".bar-crime")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("class", "bar-crime")
        .attr("x", d => xScale(d.neighborhood))
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", d => yScaleCrime(d.population))
        .attr("height", d => height - yScaleCrime(d.population))
        .attr("fill", "#ff6347")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(` Average Population: ${d.population}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Create bars for rent
      svg.selectAll(".bar-rent").remove();
      svg.selectAll(".bar-rent")
        .data(filteredData)
        .enter()
        .append("rect")
        .attr("class", "bar-rent")
        .attr("x", d => xScale(d.neighborhood) + xScale.bandwidth() / 2)
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", d => yScaleRent(d.averageRent))
        .attr("height", d => height - yScaleRent(d.averageRent))
        .attr("fill", "#4682b4")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(`Average Rent: ${d.averageRent}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Add y-axis titles
      svg.selectAll(".y-axis-title").remove();
      svg.append("text")
        .attr("class", "y-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text("Population");

      // Adjust the right y-axis title position
      svg.append("text")
        .attr("class", "y-axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 20) // Adjust the position by changing the offset
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Average Rent");
    }

  }, [selectedYear]);

  return (
    <div>
      <label htmlFor="year-filter">Select Year:</label>
      <FormControl variant="outlined">
        <InputLabel>Select Year</InputLabel>
        <Select
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <MenuItem value="all">All Years</MenuItem>
          {/* Options will be populated by the script */}
        </Select>
      </FormControl>

      <div id="chart"></div>
    </div>
  );
};

export default BarChartComponent;
