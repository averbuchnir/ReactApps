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
    const confirmation = window.confirm("Are you sure you want to change the color of this box?");
    if(confirmation){
    setBoxes((prevBoxes) => {
      return prevBoxes.map((box) => {
        if (box.key === selectedBox) {
          return { ...box, colorValue, label:box.label };
        }
        return box;
      });
    });
  };
};
  const handleUploadToCloud = async () => {
    const confirmation = window.confirm("Are you sure you want to upload the boxes to the cloud?");
    if (confirmation) {
      try{
          await axios.post('http://localhost:3001/upload', { boxes });
          //handle success e.g, show success notification
          alert('Boxes uploaded successfully');
      } catch (err) {
          //handle error e.g, show error notification
          alert(err.message);

      }
  }
};

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

  const handleSwapValues = () => {
    const indexA = prompt(`Enter the index of the first box (between 0 and ${boxes.length - 1}):`);  
    const indexB = prompt(`Enter the index of the second box (between 0 and ${boxes.length - 1}):`);
    // Convert the input to integers
    const intIndexA = parseInt(indexA);
    const intIndexB = parseInt(indexB);
  
    // Check if the inputs are valid
    if (isNaN(intIndexA) || isNaN(intIndexB) || intIndexA < 0 || intIndexB < 0 || intIndexA >= boxes.length || intIndexB >= boxes.length) {
      alert("Invalid input. Please enter valid indices.");
      return;
    }
  
    const confirmation = window.confirm(`Are you sure you want to swap the values of Box ${intIndexA} and Box ${intIndexB}?`);
    if (confirmation) {
      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        const tempColorValue = newBoxes[intIndexA].colorValue;
        newBoxes[intIndexA] = { ...newBoxes[intIndexA], colorValue: newBoxes[intIndexB].colorValue };
        newBoxes[intIndexB] = { ...newBoxes[intIndexB], colorValue: tempColorValue };
        return newBoxes;
      });

      // uploadd to cloud using handleUploadToCloud function
  
    }
  };
  
 // Fetch the boxes from the database 
  // the use of the useEffect hook ensures that the fetchBoxes function is called only once
  // it protects us from an infinite loop
  useEffect(() => {
    fetchBoxes(); // Fetch the boxes from the database
  }, []);

  

  return (
    <div className='Square-Container'>
      <button onClick={handleAddBox}>Add New Box</button>
      <button onClick={handleColorChange} autoFocus={selectedBox === 0}>
        Change Color
      </button>
      <button onClick={handleUploadToCloud}>Upload to Cloud</button>
      {/* <button onClick={fetchBoxes}>Fetch Boxes</button> */}
      <button onClick={handleSwapValues}>Swap Values</button>

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