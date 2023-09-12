import React, { useState, useEffect } from 'react';  // Import useState hook
import './App.css';
import Dropdown from './components/Dropdown';

function App() {
  useEffect(() => {
    console.log("Component mounted or updated");
    fetch('http://localhost:4000/api/visitCount')
      .then(response => response.json())
      .then(data => setVisitCount(data.count))
      .catch(error => console.error('Error fetching visit count:', error));
  }, []);

  const [position, setPosition] = useState(null);  // State to keep track of selected position
  const [lookbackPeriod, setLookbackPeriod] = useState(null);  // State to keep track of selected look-back period
  const [error, setError] = useState(null);  // State for error message
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visitCount, setVisitCount] = useState(0);


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
    setIsLoading(true);
    fetch('http://localhost:4000/api/findstocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position, lookbackPeriod }),
    })
    .then(response => response.json())
    .then(data => {
      setStocks(data.stocks);
      console.log('Data sent to server:', data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error sending data:', error);
      setIsLoading(false);
    });
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="visit-counter">
          Visits: {visitCount}
        </div>
          <h1>Stock Finder</h1>
          <p>
            Tap into the untouched growth of stocks in innovative and high technological growth sectors of industry.
          </p>
      </header>
      <body className="App-body">
      <h2>Enter Your Preferences</h2>
        <div className = "instructions-table">
        <p>This application showcases five stocks that haven't yet experienced price movements aligning with your potential market position. For those eyeing a long position, our recommendations highlight companies within sectors rich in research. Conversely, choosing a short position will reveal companies in sectors where fresh research is sparse. To begin, first indicate your preferred market position. Then, specify the historical range you wish to consider for new research. </p>
        <table>
                        <thead>
                            <tr>
                                <th>Long, Long Term</th>
                                <th>Long, Short Term</th>
                                <th>Short</th>
                                <th>Look-back Period</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td>A Long, Long Term position provides a list of companies in a high research sector which have not seen much positive movment in the mid to long term. It will only provide companies with a positive media sentiment.</td>
                                    <td>A Long, Short Term position provides a list of companies in a high research sector which have not seen much positive movment in the short to mid term. It will only provide companies with a media sentiment above 0.15.</td>
                                    <td>A Short position provides a list of companies in a low research sector which have seen a lot of positive movement in the short to mid term. It will only provide companies with a negative media sentiment.</td>
                                    <td>The Look-back Period argument determins how far back research is considered for each sector.</td>
                                </tr>
                        </tbody>
          </table>
          </div>
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
      {error && <div className="error-messag  e">{error}</div>}
      <button onClick={sendDataToServer} className='go-button'>
          Find Stocks
        </button>
        {isLoading && <p>Loading... This can take up to five minutes.</p>}
        <p>Please note that due to the constraints of the API rate limits, the results provided below offer a curated snapshot of media sentiment. Without these limitations, the full spectrum of positive and negative media sentiments could have further influenced the results.</p>
        <div className="stock-data">
                {stocks.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Sector</th>
                                <th>1 Month %</th>
                                <th>3 Months %</th>
                                <th>1 Year %</th>
                                <th>Media Sentiment</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock, index) => (
                                <tr key={index}>
                                    <td>{stock.symbol}</td>
                                    <td>{stock.industry}</td>
                                    <td>{stock.one_mo_perc.toFixed(2)}%</td>
                                    <td>{stock.three_mo_perc.toFixed(2)}%</td>
                                    <td>{stock.one_y_perc.toFixed(2)}%</td>
                                    <td>{!isNaN(parseFloat(stock.sentiment)) ? parseFloat(stock.sentiment).toFixed(3): 'Not Found in MarketAux Database or API Rate Limit Reached.'}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
      </body>
    </div>
  );
}

export default App;
