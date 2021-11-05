import { useState } from 'react';
import './App.css';
import MemoryGame from './sites/MemoryGame';


function App() {
  const [tileCount, setTileCount] = useState();

  function tileCountHandler(e){
    setTileCount();
  }

  return (
    <div className="App">
      { typeof(tileCount) === 'undefined' ?
        <div>
          <h1>Memory Game</h1>
          <div>
            <h3>Choose Tile Count</h3>
            <button className='myButton' onClick={() => setTileCount(12)}>12</button>
            <button className='myButton' onClick={() => setTileCount(24)}>24</button>
            <button className='myButton' onClick={() => setTileCount(36)}>36</button>
          </div>
        </div>
        : <MemoryGame tempTileCount={tileCount} triggerRestart={tileCountHandler}/>}
    </div>
  );
}

export default App;