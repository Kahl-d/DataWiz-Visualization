
import {React, useState, useEffect} from 'react';
import './app.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Map from './Components/Map';
import MapComparison from './Components/MapComparison';
import bridgesvg from './Resources/golden-gate-bridge-clipart.svg';
import Radar from './Components/Radar';
import Ringsa from './Components2/Ringsa';
import Rings from './Components2/Rings';
import Timeseries from './Components2/Timeseries';


const App = () => {

    const [geoJsonData, setGeoJsonData] = useState(null);
    const [csvData, setCsvData] = useState(null);


  
    useEffect(() => {
      // Load GeoJSON data
      fetch('output2.geojson')
        .then(response => response.json())
        .then( (data) => {
            
            setGeoJsonData(data);
            // console.log(data);
            
        });
  
      // Load CSV data
      d3.csv('tempdata.csv')
        .then( (data) => {
            
            setCsvData(data);
            // console.log(data);
            
        });
    }, []);




  return (
    <div id='appContainer'>
      {/* <Map geoData = {geoJsonData} csvData={csvData}/> */}
        {/* <RadarComparison csvData={csvData}/> */}

        <div className='appContainers'>

            <img src={bridgesvg} alt='bridge' className='bridgeImg'/>
        </div>
        <div id='wt1' className='welcomeText'>San Francisco</div>
        <div id='wt2' className='welcomeText'>Housing Landscape</div>
        <div className='appContainers'>
          <div className='sectionTitle'>Maps of Comparison</div>
          <MapComparison geoData = {geoJsonData} csvData={csvData}/>

        </div>

        <div className='appContainers'>

          {/* <Radar csvData={csvData}/> */}
          <Rings/>
        </div>

        <div className='appContainers'>
          <div className='sectionTitle'>Time Series House prices</div>
          <Timeseries dataPath={'1bed.csv'}/>

          </div>

    </div>
  );
}

export default App;



/////////




