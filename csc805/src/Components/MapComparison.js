import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from 'd3';
import { Button, Paper, Typography, FormControl, Select, MenuItem } from '@mui/material';
import './MapComparison.css';

const MapComparison = (props) => {
  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [mapColor, setMapColor] = useState('lightblue');

  const cleanNumericValue = (value) => {
    return +value.replace(/,/g, '');
  };


  const handleAttributeDragStart = (e, attribute) => {
    e.dataTransfer.setData('text/plain', attribute);
  };

  const handleAttributeDragOver = (e) => {
    e.preventDefault();
  };

  const handleAttributeDrop = (e, mapNumber) => {
    e.preventDefault();
    const attribute = e.dataTransfer.getData('text/plain');

    // Check if the attribute is already selected
    if (!selectedAttributes.includes(attribute)) {
      // Add the attribute to the selected list
      const newSelectedAttributes = [...selectedAttributes, attribute];
      setSelectedAttributes(newSelectedAttributes);

      // Remove the attribute from the available list
      const newAvailableAttributes = availableAttributes.filter((attr) => attr !== attribute);
      setAvailableAttributes(newAvailableAttributes);

      // Update maps with the selected attributes
      if (mapNumber === 1) {
        updateMapStyle(map1Ref.current, attribute, 1);
      } else if (mapNumber === 2) {
        updateMapStyle(map2Ref.current, attribute, 2);
      }
    }
  };

  const handleAttributeRemove = (attribute) => {
    // Remove the attribute from the selected list
    const newSelectedAttributes = selectedAttributes.filter((attr) => attr !== attribute);
    setSelectedAttributes(newSelectedAttributes);

    // Add the attribute back to the available list
    setAvailableAttributes([...availableAttributes, attribute]);

    // Reset map styles
    resetMapStyles(map1Ref.current);
    resetMapStyles(map2Ref.current);

    // Update maps with the remaining selected attributes
    if (newSelectedAttributes.length > 0) {
      updateMapStyle(map1Ref.current, newSelectedAttributes[0], 1);
      if (newSelectedAttributes.length > 1) {
        updateMapStyle(map2Ref.current, newSelectedAttributes[1], 2);
      }
    }
  };



    const updateMapStyle = (mapRef, attribute, mapNumber) => {
        if (!mapRef || !props.geoData || !props.csvData) {
          return;
        }
    
        const colorScale = d3.scaleLinear()
          .domain([d3.min(props.csvData, d => +cleanNumericValue(d[attribute])),
                   d3.max(props.csvData, d => +cleanNumericValue(d[attribute]))])
          .range([mapColor, 'darkblue']); // Use mapColor as the fill color
    
        mapRef.eachLayer(layer => {
          if (layer.feature && layer.feature.properties) {
            const neighborhood = layer.feature.properties.neighborhood;
            const attributeValue = props.csvData.find(d => d.Neighborhood === neighborhood)[attribute];
            const fillColor = colorScale(+cleanNumericValue(attributeValue));
    
            layer.setStyle({
              fillColor: fillColor,
              fillOpacity: 0.7,
              weight: 2,
              color: 'white',
              opacity: 1,
            });
    
            layer.unbindTooltip();
            layer.bindTooltip(`
              <strong>${neighborhood}</strong><br>
              ${attribute}: ${attributeValue}
            `);
          }
        });
    
        // Set the map title
        document.getElementById(`mapTitle${mapNumber}`).innerHTML = attribute;
      };
    
      const resetMapStyles = (mapRef) => {
        if (!mapRef) {
          return;
        }
    
        mapRef.eachLayer(layer => {
          if (layer instanceof L.Path && layer.feature && layer.feature.properties) {
            layer.setStyle({
              fillOpacity: 0.7,
              weight: 2,
              color: 'white',
            });
          }
        });
      };
    
      useEffect(() => {
        if (!map1Ref.current && props.geoData) {
          const map1 = L.map('mapContainer1', {
            center: [37.7749, -122.4194],
            zoom: 12,
            scrollWheelZoom: false,
          });
      
          // Remove the default zoom control
          map1.zoomControl.remove();
      
          L.geoJSON(props.geoData, {
            style: {
              fill: true,
              color: 'black',
              weight: 2,
              opacity: 0.7,
              fillColor: 'transparent',
            },
          }).addTo(map1);
      
          map1Ref.current = map1;
        }
      
        if (!map2Ref.current && props.geoData) {
          const map2 = L.map('mapContainer2', {
            center: [37.7749, -122.4194],
            zoom: 12,
            scrollWheelZoom: false,
          });
      
          // Remove the default zoom control
          map2.zoomControl.remove();
      
          L.geoJSON(props.geoData, {
            style: {
              fill: true,
              color: 'black',
              weight: 2,
              opacity: 0.7,
              fillColor: 'transparent',
            },
          }).addTo(map2);
      
          map2Ref.current = map2;
        }
      
        // Initialize availableAttributes with all attributes when geoData changes
        if (props.csvData) {
          const attributes = Object.keys(props.csvData[0])
            .filter(attribute => attribute !== 'Zip' && attribute !== 'Neighborhood');
          setAvailableAttributes(attributes);
        }
      }, [props.geoData, props.csvData]);
      
      
    
      return (
        <div id='mapComparisonComponent'>
          <div id='mapComparisonOperator'>
            <div id='selectedAttributes'>
              {selectedAttributes.map((attribute) => (
                <div key={attribute} className='item1'>
                  {attribute}
                  <Button variant="contained" color="error" onClick={() => handleAttributeRemove(attribute)}>Remove</Button>
                </div>
              ))}
            </div>
            <div id='attributeList'>
              <Typography variant="h6">Attribute List:</Typography>
              {availableAttributes.length > 0 && (
                <div id='innerAttributeList'>
                  {availableAttributes.map(attribute => (
                    <div className='item'
                      key={attribute}
                      draggable
                      onDragStart={(e) => handleAttributeDragStart(e, attribute)}
                      onDragOver={(e) => handleAttributeDragOver(e)}
                      onDrop={(e) => handleAttributeDrop(e, 1)}
                    >
                      {attribute}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          
          <div id='mapComparisonMaps'>


            <Paper
              className='mapContainer'
              id='mapContainer1'
              onDragOver={(e) => handleAttributeDragOver(e)}
              onDrop={(e) => handleAttributeDrop(e, 1)}
            >
              <div className='mapTitle' id='mapTitle1'></div>
            </Paper>


            <Paper
              className='mapContainer'
              id='mapContainer2'
              onDragOver={(e) => handleAttributeDragOver(e)}
              onDrop={(e) => handleAttributeDrop(e, 2)}
            >
              <div className='mapTitle' id='mapTitle2'></div>
            </Paper>


          </div>
        </div>
      );
    };
    
    export default MapComparison;
    
