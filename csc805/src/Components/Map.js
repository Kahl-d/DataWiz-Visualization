import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';
import './map.css';

const Map = (props) => {
  const mapRef = useRef(null);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  // Helper function to clean numeric values by removing commas
  const cleanNumericValue = (value) => {
    return +value.replace(/,/g, '');
  };

  const handleAttributeChange = (selectedAttribute) => {
    if (!mapRef.current || !props.geoData || !props.csvData) {
      // Data is not ready, do nothing
      return;
    }

    // Assuming selectedAttribute is the attribute selected by the user
    // Implement logic to color the map based on the selected attribute values
    const colorScale = d3.scaleLinear()
      .domain([d3.min(props.csvData, d => +cleanNumericValue(d[selectedAttribute])),
               d3.max(props.csvData, d => +cleanNumericValue(d[selectedAttribute]))])
      .range(['lightblue', 'darkblue']);

    // Highlighted region
    let highlightedLayer = null;

    // Update GeoJSON layer style based on the selected attribute values
    mapRef.current.eachLayer(layer => {
      if (layer.feature && layer.feature.properties) {
        const neighborhood = layer.feature.properties.neighborhood;
        const attributeValue = props.csvData.find(d => d.Neighborhood === neighborhood)[selectedAttribute];
        const fillColor = colorScale(+cleanNumericValue(attributeValue));

        layer.setStyle({
          fillColor: fillColor,
          fillOpacity: 0.7,
          weight: highlightedLayer === layer ? 4 : 2, // Highlighted layer has a thicker border
          color: highlightedLayer === layer ? 'black' : 'white', // Highlighted layer has a black border
          opacity: 1,
        });

        // Add click event
        layer.on('click', function (e) {
          if (highlightedLayer === layer) {
            // If the clicked layer is already highlighted, reset styles for all layers
            highlightedLayer = null;
            mapRef.current.eachLayer(resetLayerStyles);
          } else {
            // If a new layer is clicked, highlight it and fade others
            highlightedLayer = layer;
            mapRef.current.eachLayer(otherLayer => {
              if (otherLayer !== highlightedLayer) {
                otherLayer.setStyle({
                  fillOpacity: 0.3,
                  weight: 2,
                  color: 'white',
                });
              }
            });
          }
        });

        // Add tooltip
        layer.bindTooltip(`
          <strong>${neighborhood}</strong><br>
          ${selectedAttribute}: ${attributeValue}
        `);
      }
    });
  };

  // Helper function to reset layer styles
const resetLayerStyles = (layer) => {
  if (layer instanceof L.Path && layer.feature && layer.feature.properties) {
    layer.setStyle({
      fillOpacity: 0.7,
      weight: 2,
      color: 'white',
    });
  }
};

  useEffect(() => {
    // Check if the map container has already been initialized
    if (!mapRef.current && props.geoData) {
      const map = L.map('mapContainer', {
        center: [37.7749, -122.4194],
        zoom: 12,
        scrollWheelZoom: false, // Disable zooming with the scroll wheel
      });

      // Add GeoJSON layer to the map with transparent background
      L.geoJSON(props.geoData, {
        style: {
          fill: true,
          color: 'white',
          weight: 2,
          opacity: 0.7,
          fillColor: 'transparent',
        },
      }).addTo(map);

      // Save the map instance to the ref for future reference
      mapRef.current = map;
    }
  }, [props.geoData]);

  return (
    <div id='mapComponent'>
      <div id='mapContainer' style={{ height: '500px', width: '100%' }}></div>
      <div id='mapOperator'>
        <label htmlFor='attributeSelect'>Select Attribute:</label>
        <select id='attributeSelect' onChange={(e) => handleAttributeChange(e.target.value)}>
          {props.csvData && Object.keys(props.csvData[0])
            .filter(attribute => attribute !== 'Zip' && attribute !== 'Neighborhood')
            .map(attribute => (
              <option key={attribute} value={attribute}>
                {attribute}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Map;
