// server js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package


const app = express();
// Enable CORS
app.use(cors());

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/ReactApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//define the schema for the "myboxes" collection
const boxSchema = new mongoose.Schema({
    key: Number,
    colorValue: String,
    label: String,
    });
const BoxModel = mongoose.model('myboxes', boxSchema); //create a model for the "myboxes" collection
// the model is used for CRUD operations

app.use(bodyParser.json()); //use the body-parser middleware to parse the json body
// define the API endpoints to handle the uploade of the boxes

app.post('/upload',async (req, res) => {
    try{
        //extrat the boxes data from the request body
        const { boxes } = req.body;
        //delete all the existing boxes from the database
        await BoxModel.deleteMany({});
        //insert the new boxes into the database
        await BoxModel.insertMany(boxes);
        //send a success response
        res.status(200).json({ message: 'Boxes uploaded successfully' });
    } catch (err) {
        //send a failure response
        res.status(500).json({ message: err.message });
    }
});

app.get('/getBoxes',async (req, res) => {
    try{
        // Recive the data from "myboxes" collection
        const boxes = await BoxModel.find({});
        res.status(200).json({ boxes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});