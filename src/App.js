import './App.css';
import Dropdown from './Dropdown';

function App() {

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
  };

  const handleLookBackChange = (newLookBack) => {
    console.log(`Selected Look-back Period: ${newLookBack}`);
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
      </body>
    </div>
  );
}

export default App;
