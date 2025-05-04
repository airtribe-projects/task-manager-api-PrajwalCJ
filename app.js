const express = require('express');
const app = express();
const router = require('./routes/tasksRoute');

const port = 3000; //Assign the required port number

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router); //use the router for all api calls

app.get('/', (req, res) => {
    res.send("Hello World!");
})


app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


module.exports = app;