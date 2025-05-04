const express = require('express');
const router = express.Router();
const data = require('../data/task.json'); //get the data from json file
const { validationChecks, addPriorityAttribute, addDateAttribute } = require('../utils/tasksUtilFunctions'); //import the utility functions

let dataSetCopy = data; //To manupulate data without manipulating the json file
dataSetCopy.tasks = dataSetCopy.tasks.map((task) => ({ ...addPriorityAttribute(task), ...addDateAttribute(task) })); //adding priority and date attributes to each task
dataSetCopy.tasks = dataSetCopy.tasks.sort((a, b) => a.creationDate - b.creationDate); //sort the tasks based on creation date


//get tasks
router.get('/api/v1/tasks', (req, res) => {

    //filter tasks based on query strings
    if (Object.keys(req.query).length > 0) {
        let queryString = "";
        let queryStringValue = "";

        if ("completed" in req.query) {
            queryString = "completed"
            queryStringValue = Boolean(req.query.completed);
        } else {
            queryString = "priority"
            queryStringValue = req.query.priority;
        }

        const filteredTasks = dataSetCopy.tasks.filter((task) => task[queryString] === queryStringValue);
        return res.status(200).json(filteredTasks);
    }

    //get all tasks
    res.status(200).json(dataSetCopy.tasks);
});

//get task by id
router.get('/api/v1/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = dataSetCopy.tasks.find((task) => task.id === id);
    if (!task) {
        return res.status(404).json({ message: `Task with id ${id} not found` });
    }
    res.status(200).json(task);
});


//create task
router.post('/api/v1/tasks', (req, res) => {

    //validated body
    const inputCheck = validationChecks(req.body.name, req.body.description, req.body.completed);
    if (inputCheck && !req.body.id) {
        const newTask = { id: dataSetCopy.tasks.length + 1, ...req.body };
        dataSetCopy.tasks.push(newTask);
        res.status(201).json(newTask);
    } else {
        res.status(400).json({ message: "Invalid Data" });
    }
});


//update task
router.put('/api/v1/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = dataSetCopy.tasks.find((task) => task.id === id);
    if (!task) {
        return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    const updatedTask = { ...task, ...req.body };
    const inputCheck = validationChecks(updatedTask.name, updatedTask.description, updatedTask.completed);

    //validated body
    if (!inputCheck || req.body.id) {
        return res.status(400).json({ message: "Invalid Data" });
    }

    dataSetCopy.tasks = dataSetCopy.tasks.map((task) => task.id === id ? updatedTask : task);
    res.status(200).json(updatedTask);
});


//delete task
router.delete('/api/v1/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = dataSetCopy.tasks.find((task) => task.id === id);
    if (!task) {
        return res.status(404).json({ message: `Task with id ${id} not found` });
    }

    dataSetCopy.tasks = dataSetCopy.tasks.filter((task) => task.id !== id);
    res.status(200).json({ message: `Task with id ${id} deleted` });
});



module.exports = router;