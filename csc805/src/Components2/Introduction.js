// Introduction.js
import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PeopleOutline, PersonOutline, MonetizationOn, School } from '@mui/icons-material';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const factors = [
  { icon: <SportsKabaddiIcon />, title: 'Crime' },
  { icon: <PeopleOutline />, title: 'Population' },
  { icon: <PersonOutline />, title: 'Age' },
  { icon: <MonetizationOn />, title: 'Income' },
  { icon: <School />, title: 'Education' },
  { icon: <EnergySavingsLeafIcon />, title: 'Energy' },
];

const Introduction = () => {
  return (
    <Grid
      container
      justifyContent="center"
      style={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: 'rgba(2, 0, 36, 0.2)', // Adjust the alpha value for transparency
        color: 'white',
        borderRadius: '8px',
      }}
    >
      <Grid item xs={12} md={8}>
        <Typography variant="h4" gutterBottom>
        Visualizing the Housing Landscape in San Francisco

        </Typography>
        <Typography paragraph>
          Discover the intricate landscape of San Francisco's housing market. Dive into key factors that shape the city's living experience.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Key Factors:
        </Typography>
        {factors.map((factor, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ marginRight: '1rem', color: 'primary' }}>{factor.icon}</div>
            <Typography variant="body1">{factor.title}</Typography>
          </div>
        ))}
        <Typography variant="h5" gutterBottom className="sectionTitle">
          Data Sources:
        </Typography>
        <Typography paragraph>
          SFData
        </Typography>
        <Typography paragraph>
          Zillow
        </Typography>
        <Typography paragraph>
          Kaggle
        </Typography>
        <Typography variant="h5" gutterBottom className="sectionTitle">
          Data Analysis:
        </Typography>
        <Typography paragraph>
          Through in-depth analysis, we explore the data from different perspectives and pivots. 
          This is an exploratory data visualization dashboard that revolves around neighbourhoods and allows users to interact with the data and draw their own conclusions.
          Our aim is to enable uncover patterns, trends, and correlations that contribute to a comprehensive understanding of the housing in San Francisco.
          The model can be extended to other cities and regions. The modular behaviour of our code allows for easy integration of new data sources and data types.
        </Typography>
        <Typography variant="h5" gutterBottom className="sectionTitle">
          Project Goals:
        </Typography>
        <Typography paragraph>
          Our primary goal is to visualize and communicate complex housing data in an accessible and meaningful way. By leveraging interactive charts and visualizations, we aim to provide valuable insights to both researchers and the general public.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Introduction;
