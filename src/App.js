import React, { useState } from 'react';  // Import useState hook
import './App.css';
import Dropdown from './components/Dropdown';

function App() {

  const [position, setPosition] = useState(null);  // State to keep track of selected position
  const [lookbackPeriod, setLookbackPeriod] = useState(null);  // State to keep track of selected look-back period
  const [error, setError] = useState(null);  // State for error message


  const positionOptions = [
    { value: 'longlongterm', label: 'Long, Long Term' },
    { value: 'longshortterm', label: 'Long, Short Term' },
    { value: 'short', label: 'Short' }
  ];

  const lookbackOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' }
  ];

  const handlePositionChange = (newPosition) => {
    console.log(`Selected position: ${newPosition}`);
    setPosition(newPosition);  // Update the state
    setError(null);  // Reset error when a new value is selected
  };

  const handleLookBackChange = (newLookBack) => {
    console.log(`Selected Look-back Period: ${newLookBack}`);
    setLookbackPeriod(newLookBack);  // Update the state
    setError(null);  // Reset error when a new value is selected
  };

  // Function to send data to server
  const sendDataToServer = () => {
     // Check if both dropdowns have a value selected
     if (!position || !lookbackPeriod) {
      setError('Please select both a position and a look-back period.');  // Set the error message
      return;
    }
    console.log(lookbackPeriod)
    fetch('http://localhost:4000/api/findstocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position, lookbackPeriod }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data sent to server:', data);
    })
    .catch((error) => {
      console.error('Error sending data:', error);
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Finder</h1>
        <p>
          Tap into the untouched growth of stocks in innovative and high technological growth sectors of industry.
        </p>
      </header>

      <body className="App-body">
      <h2>Enter Your Preferences</h2>
      <h3>Select your position</h3>
      <Dropdown
        options={positionOptions}
        initialValue=""
        label="Select a position"
        onChange={handlePositionChange}
      />
           <h3>Select look-back period</h3>
      <Dropdown
        options={lookbackOptions}
        initialValue=""
        label="Select a look-back period"
        onChange={handleLookBackChange}
      />
      {/* Button to send data to server */}
      {error && <div className="error-message">{error}</div>}
      <button onClick={sendDataToServer}>
          Find Stocks
        </button>
      </body>
    </div>
  );
}

export default App;
