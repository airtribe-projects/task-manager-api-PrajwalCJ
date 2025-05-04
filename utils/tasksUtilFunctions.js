
//request body validation
function validationChecks(name, description, completed) {
    const nameCheck = (name !== null && name !== "") ? true : false;
    const descriptionCheck = (description !== null && description && description !== "") ? true : false;
    const completedCheck = (typeof (completed) === 'boolean') ? true : false;

    if (nameCheck && descriptionCheck && completedCheck) {
        return true;
    }

}

//function to check existing add random priority attribute
function addPriorityAttribute(task) {
    if (task.priority) {
        return task;
    }

    let priorityVal = "";
    if ((Math.random() * 90) < 30) {
        priorityVal = "high";
    } else if ((Math.random() * 90) < 60) {
        priorityVal = "medium";
    } else {
        priorityVal = "low";
    }
    return { ...task, priority: priorityVal };
}

//function to check existing add random date attribute
function addDateAttribute(task) {
    if(task.creationDate) {
        return task;
    }
    
    const now = Date.now();
    let randomTimestamp = Math.floor(Math.random() * now);
    randomTimestamp = new Date(randomTimestamp);
    return { ...task, creationDate: randomTimestamp }
}

module.exports = { validationChecks, addPriorityAttribute, addDateAttribute };