// src/App.js
import React, { useEffect, useState } from 'react';
import Square from './Square';
import Input from './Input';
import axios from 'axios'; // Import Axios for making HTTP requests

function App() {
  const [colorValue, setColorValue] = useState('');
  const [selectedBox, setSelectedBox] = useState(0); // Initialize with the key of the first box
  const [boxes, setBoxes] = useState([
    {
      key:0, colorValue:'',label:''
    }
  ]);
  const [dataload,setDataload] = useState(false);
  const [colorSelectValue, setColorSelectValue] = useState(''); // State for the new color select box


  const handleChange = (e) => {
    setSelectedBox(parseInt(e.target.value)); // Parse the value to an integer
  };

  const handleAddBox = () => {
    // Create a new box object with a unique key and color
    const newBox = {
      key: boxes.length,
      colorValue,
    };
    // Add the new box to the array of boxes
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
  };

  const handleColorChange = () => {
    setBoxes((prevBoxes) => {
      return prevBoxes.map((box) => {
        if (box.key === selectedBox) {
          return { ...box, colorValue, label:box.label };
        }
        return box;
      });
    });
  };

  const handleUploadToCloud = async () => {
      try{
          await axios.post('http://localhost:3001/upload', { boxes });
          //handle success e.g, show success notification
          alert('Boxes uploaded successfully');
      } catch (err) {
          //handle error e.g, show error notification
          alert(err.message);

      }
  }
  // Fetch the boxes from the database
  const fetchBoxes = async () => {   // Fetch the boxes from the database
    try {
      const reponse = await axios.get('http://localhost:3001/getBoxes'); // Make a GET request to the server
      if (reponse.status === 200) { // If the request is successful
        setBoxes(reponse.data.boxes); // Set the boxes state to the data returned from the server
        setDataload(true); // Set the data loaded flag to true
        console.log('fetch successful',reponse.data.boxes)
      } else { // If the request is not successful
        console.log('fetch failed',reponse.statusText)
      }
    } catch (err) {
      console.error('fetch failed',err.message)
    }
  }

  // Fetch the boxes from the database 
  // the use of the useEffect hook ensures that the fetchBoxes function is called only once
  // it protects us from an infinite loop
  // useEffect(() => {
  //   fetchBoxes(); // Fetch the boxes from the database
  // }, []);

  

  return (
    <div className='Square-Container'>
      <button onClick={handleAddBox}>Add New Box</button>
      <button onClick={handleColorChange} autoFocus={selectedBox === 0}>
        Change Color
      </button>
      <button onClick={handleUploadToCloud}>Upload to Cloud</button>
      <button onClick={fetchBoxes}>Fetch Boxes</button>

      <Input
        colorValue={colorValue}
        SetColorValue={setColorValue}
        selectBox={selectedBox}
        label={boxes[selectedBox].label}
        setLabel={(newLabel) => {
          setBoxes((prevBoxes) => {
            return prevBoxes.map((box) => {
              if (box.key === selectedBox) {
                return { ...box, label: newLabel, colorValue: box.colorValue }; // Preserve color value
              }
              return box;
            });
          });
        }}
      />
    
      <select value={selectedBox} onChange={handleChange}>
        {boxes.map((box) => (
          <option key={box.key} value={box.key}>
            Box {box.key}
          </option>
        ))}
      </select>


      {boxes.map((box) => (
        <Square key={box.key} colorValue={box.colorValue} index={box.key}/>
      ))}
    </div>
  );
}

export default App;