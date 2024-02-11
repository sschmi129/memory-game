import '../App.css';
import React, { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const MemoryGame = (({ tempTileCount, triggerRestart }) => {

  const [tileCount, setTileCount] = useState(); // 12 24 36
  const [rowcolumn, setRowcolumn] = useState([]);
  const [openTilesCounter, setOpenTilesCounter] = useState(0); //max two
  const [openTiles, setOpenTiles] = useState(); // max two
  const [block, setBlock] = useState(false);
  const [win, setWin] = useState(false);
  const [tileData, setTileData] = useState();
  const [turns, setTurns] = useState(0);

  useEffect(() => {
    setTileCount(tempTileCount)
    if (tileCount === 12) {
      setRowcolumn([3, 4]);
    } else if (tileCount === 24) {
      setRowcolumn([4, 6]);
    } else {
      setRowcolumn([6, 6]);
    }
    var tempIds = [];
    for (let i = 0; i < (tileCount / 2); i++) {
      tempIds.push(i);
      tempIds.push(i);
    }
    const tempShuffledIds = shuffle(tempIds);
    // const tempShuffledIds = tempIds;

    // fill with data: number(Number of Tile), id(Number of two same tiles), isFlipped(is open)
    let tempTileData = [];
    for (var i = 0; i < tileCount; i++) {
      tempTileData.push({ number: i, id: tempShuffledIds[i], isFlipped: false });
    };
    setTileData(tempTileData);
  }, [tileCount]);

  function handleTileClick(e) {
    if (block === false) {
      if (openTilesCounter < 2) {
        const x = e.target.getAttribute("number");
        if (tileData[x].isFlipped === false) {

          let y = [...tileData];
          let z = { ...y[x] };
          z.isFlipped = true;
          y[x] = z;
          setTileData(y);

          if (typeof (openTiles) === 'undefined') {
            setOpenTiles([e.target]);
          } else {
            setOpenTiles((tiles) => [...tiles, e.target]);
          }
          setOpenTilesCounter(openTilesCounter + 1);
        }
      }
    }
  }

  useEffect(() => {
    if (typeof (openTiles) !== "undefined") {
      if (openTiles.length === 2) {
        setBlock(true);
        setTurns(turns + 1);
        if (openTiles[0].getAttribute("id") !== openTiles[1].getAttribute("id")) {
          setTimeout(() => {
            //add to
            let y = [...tileData];
            let z0 = { ...y[openTiles[0].getAttribute("number")] };
            let z1 = { ...y[openTiles[1].getAttribute("number")] };
            z0.isFlipped = false;
            z1.isFlipped = false;
            y[openTiles[0].getAttribute("number")] = z0;
            y[openTiles[1].getAttribute("number")] = z1;
            setTileData(y);

            setOpenTiles();
            setOpenTilesCounter(0);
            setBlock(false);
          }, 1500);
          // clearTimeout(timer);
        } else {
          setTimeout(() => {
            setOpenTiles();
            setOpenTilesCounter(0);
            setBlock(false);
          }, 500);
        }
      }
    }
  }, [openTiles]);

  useEffect(() => {
    let winCheck = true;
    if (typeof (tileData) !== 'undefined') {
      for (let i = 0; i < tileData.length; i++) {
        if (tileData[i].isFlipped === false) {
          winCheck = false;
        }
      }
      setWin(winCheck);
      // console.log('You won?:'+winCheck);
    }
  }, [tileData]);

  const tileDrawer = () => {
    let tileDrawArray = [<></>];
    if (typeof (tileData) !== 'undefined') {
      for (let i = 0; i < tileData.length; i++) {
        tileDrawArray.push(
          <ReactCardFlip isFlipped={tileData[i].isFlipped} flipDirection="horizontal">
            <div number={tileData[i].number} id={tileData[i].id} className='TileBack' onClick={(e) => handleTileClick(e)}></div>
            <div number={tileData[i].number} id={tileData[i].id} className='TileFront'>
              <img src={require(`../../public/assets/${tileData[i].id}.svg`)} alt="" />
              {/* <img src={`../../public/assets/${tileData[i].id}.svg`} alt="" /> */}
            </div>
          </ReactCardFlip>
        )
      }
      tileDrawArray.push(
        <h1>
          Turns: {turns}
        </h1>
      )
    }
    return tileDrawArray;
  }

  return (
    <>
      <h1 class="GameName">Memory Game</h1>
      <div className='GameField' style={{ 'grid-template-rows': `repeat(${rowcolumn[0]}, auto)`, 'grid-template-columns': `repeat(${rowcolumn[1]}, auto)` }}>
        {tileDrawer()}
      </div>
      {(win) ?
        <div className="Overlay">
          <h1>You WON!!!!</h1>
          <button className="myButton" onClick={(e) => triggerRestart(e)}>Restart</button>
        </div>
        :
        <></>
      }
    </>
  );
});

export default MemoryGame;