import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
// import './styles.css'; // Import your CSS styles

function DataVisualization() {
    const [selectedYear, setSelectedYear] = useState('all');
    const [data, setData] = useState(null);

    useEffect(() => {
        // Load the data
        d3.json('rent_population_comparison.json').then(loadedData => {
            setData(loadedData);
            const years = Array.from(new Set(loadedData.map(d => d.year)));
            setSelectedYear(years[0]); // Set the default year
        }).catch(error => console.error('Error loading the data', error));
    }, []);

    useEffect(() => {
        if (data) {
            updateChart(data, selectedYear);
        }
    }, [selectedYear, data]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const updateChart = (data, selectedYear) => {
        // Remove any existing SVG content
        d3.select("#chart").selectAll("*").remove();

        // Set the dimensions and margins of the graph
        const margin = { top: 40, right: 60, bottom: 80, left: 80 },
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
        const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.2);
        const yScalePopulation = d3.scaleLinear().range([height, 0]);
        const yScaleRent = d3.scaleLinear().range([height, 0]);
        const xAxis = d3.axisBottom(xScale);
        const yAxisLeft = d3.axisLeft(yScalePopulation);
        const yAxisRight = d3.axisRight(yScaleRent);

        // Define the tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "solid 1px #aaa")
            .style("padding", "8px")
            .style("border-radius", "8px")
            .style("text-align", "center")
            .style("color", "#333");

        // Filter data based on the selected year
        const filteredData = selectedYear === "all" ? data : data.filter(d => d.year === selectedYear);

        // Sort the filtered data by crime rate in descending order
        filteredData.sort((a, b) => b.population - a.population);

        // Update scales
        xScale.domain(filteredData.map(d => d.neighborhood));
        yScalePopulation.domain([0, d3.max(filteredData, d => d.population)]);
        yScaleRent.domain([0, d3.max(filteredData, d => d.averageRent)]);

        // Create the axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "#fff");

        svg.append("g").call(yAxisLeft).style("color", "#fff");
        svg.append("g")
            .attr("transform", `translate(${width},0)`)
            .call(yAxisRight).style("color", "#fff");

        // Create bars for population
        svg.selectAll(".bar-population")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar-population")
            .attr("x", d => xScale(d.neighborhood))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScalePopulation(d.population))
            .attr("height", d => height - yScalePopulation(d.population))
            .attr("fill", "#ff6347")
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Population: ${d.population}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Create bars for rent
        svg.selectAll(".bar-rent")
            .data(filteredData)
            .enter()
            .append("rect")
            .attr("class", "bar-rent")
            .attr("x", d => xScale(d.neighborhood))
            .attr("width", xScale.bandwidth())
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
    };

    return (
        <div>
            <label htmlFor="year-filter" style={{ color: "#fff" }}>Select Year:</label>
            <select id="year-filter" value={selectedYear} onChange={handleYearChange}>
                {data && Array.from(new Set(data.map(d => d.year))).map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>

            <div id="chart"></div>
        </div>
    );
}

export default DataVisualization;
