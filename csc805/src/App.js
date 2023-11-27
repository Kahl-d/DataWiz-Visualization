
import {React, useState, useEffect} from 'react';
import './application.css';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
// import Map from './Components/Map';
import MapComparison from './Components/MapComparison';
import bridgesvg from './Resources/golden-gate-bridge-clipart.svg';
// import Radar from './Components/Radar';
import Ringsa from './Components2/Ringsa';
import Rings from './Components2/Rings';
import Timeseries from './Components2/Timeseries';
import TimeComponent from './Components2/TimeComponent';
import BarChartComponent from './Components2/BarChartComponent';
import Introduction from './Components2/Introduction';
import { Typography , Paper} from '@mui/material';
import DataVisualization from './DataVisualizations';
import GitHubIcon from '@mui/icons-material/GitHub';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';



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


        <div id='home' className='appContainers'>

          

            <img src={bridgesvg} alt='bridge' className='bridgeImg'/>
            <div id='wt1' className='welcomeText'>San Francisco</div>
            <div id='wt2' className='welcomeText'>Housing Landscape</div>
            <div id='csc' className='text'>CSC 805</div>
            <div id='dv' className='text'>Data Visualization</div>
            <Paper id='team' className='text'>
                <div ><h3>Team Members:</h3></div>
                <div >Khalid Mehtab Khan</div>
                <div >Joanne Pak</div>
                <div >Durga Siva Lokesh Telaprolu</div>
            </Paper>
            <a href="https://github.com/Kahl-d/DataWizard"><GitHubIcon id="gitIcon"/></a>
            
        </div>
        
        
        
        <div id='intro'>
          
          <Introduction/>
        </div>

        <div className='gap'> </div>
        <div id='timeSeries' className='title'>
        <Typography variant='h4' className='mar'>
            Time Series Visualization
          </Typography>
          <Typography variant='body1' className='mar'>
            Explore the time series data of house prices and rent for different types of housing units. 
          </Typography>
            <Typography variant='body1' className='mar'>
              <MapsHomeWorkIcon/> Housing Units
              </Typography>
              <Typography variant='body1' className='mar'>
              <MonetizationOnIcon/> Price
              </Typography>
              <Typography variant='body1' className='mar'>
              <AccessTimeIcon/> Year
              </Typography>

          </div>
        

          

        <div className='appContainers'>
        
          <TimeComponent/>

         
        </div>
        <Typography variant='h4' className='mar'>
            Map of Comparisons
          </Typography>
          <Typography variant='body1' className='mar'>
            Explore the time series data of house prices and rent for different types of housing units. Analyze trends and patterns over time to gain valuable insights into the housing market.
          </Typography>
        <div className='appContainers'>
            <MapComparison geoData = {geoJsonData} csvData={csvData}/>
        </div>

        <Typography variant='h4' className='mar'>
            Understnding Relation with crime
          </Typography>
          <Typography variant='body1' className='mar'>
            Crime Data
          </Typography>

          <div className='appContainers'>

            <Rings/>

            </div>

            <div>
            <Typography variant='h4' className='mar'>
            Bar Chart
          </Typography>
          <Typography variant='body1' className='mar'>
            Population
          </Typography>
          <DataVisualization/>

            </div>




    </div>
  );
}

export default App;



/////////




