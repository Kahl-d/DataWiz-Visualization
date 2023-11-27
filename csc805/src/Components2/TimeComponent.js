import React, { useState } from "react";
import Timeseries from "./Timeseries";
import { Select, MenuItem, FormControl } from "@mui/material";


const TimeComponent = () => {
  const fileNames = ['1bed.csv', '2bed.csv', '3bed.csv', '4bed.csv', '5bed.csv', 'singlefamily.csv', 'condo.csv'];
  
  // Mapping between file names and user-friendly names
  const fileNameMapping = {
    '1bed.csv': '1 Bedroom Units',
    '2bed.csv': '2 Bedroom Units',
    '3bed.csv': '3 Bedroom Units',
    '4bed.csv': '4 Bedroom Units',
    '5bed.csv': '5 Bedroom Units',
    'singlefamily.csv': 'Single Family Units',
    'condo.csv': 'Condo Units',
  };

  const [fileName, setFileName] = useState('1bed.csv');

  return (
    <div>
      <div>Type of Housing:</div>
      <FormControl >
        <Select
          value={fileName}
          onChange={e => setFileName(e.target.value)}
        >
          {fileNames.map(file => (
            <MenuItem key={file} value={file}>{fileNameMapping[file]}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Timeseries name={fileName} />
    </div>
  );
};

export default TimeComponent;
