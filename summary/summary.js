/**
 * greet user only in mobile view
 */
function greetingInMobile() {
    let container = document.getElementById('greeting-animation');
    greetingIsLoaded = localStorage.getItem('greetingLoaded');
    if (greetingIsLoaded == 'false') {
        animationGreeting(container, greetingIsLoaded);
    }
}


/**
 * play greeting animation 
 * @param {element} container greeting animation container 
 */
function animationGreeting(container) {
    container.classList.remove('d-none');
    greetingIsLoaded = 'true';
    localStorage.setItem('greetingLoaded', greetingIsLoaded);
    setTimeout(() => container.style.opacity = 0, 1000);
    setTimeout(() => container.classList.add('d-none'), 3000);
}


/**
 * changes img (svg)- colors, on "mouse-over" (left)
 */
function hoverLeftButton() {
    let pencil = document.getElementById(`pencil-hover`);
    let button1 = document.getElementById(`button-hover0`);
    button1.src = '../img/white-button.svg';
    pencil.src = '../img/pencil-blue.svg';
}


/**
 * changes img (svg)- colors, on "mouse-off" (right)
 */
function hoverOffLeftButton() {
    let pencil = document.getElementById(`pencil-hover`);
    let button1 = document.getElementById(`button-hover0`);
    button1.src = '../img/blue-button-summary.svg';
    pencil.src = '../img/pencil-1.svg';
}


/**
 * changes img (svg)- colors, on "mouse-over" (right)
 */
function hoverRightButton() {
    let button2 = document.getElementById(`button-hover1`);
    let checkIcon = document.getElementById(`check-icon-hover`);
    button2.src = '../img/white-button.svg';
    checkIcon.src = '../img/check-icon-blue.svg';
}


/**
 * changes img (svg)- colors, on "mouse-off" (left)
 */
function hoverOffRightButton() {
    let button2 = document.getElementById(`button-hover1`);
    let checkIcon = document.getElementById(`check-icon-hover`);
    button2.src = '../img/blue-button-summary.svg';
    checkIcon.src = '../img/check-icon-white.svg';
}


/**
 * render information from backend for display "board-update"
 */
async function renderSummaryDates() {
    await getBackendTasks();
    let status = ['todoTask', 'awaitingFeedbackTask', 'inProgressTask', 'doneTask'];
    for (let i = 0; i < status.length; i++) {
        getTasks(status[i]);
    }
    getTasksInBoard();
}


/**
 * display tasks from board in summary page
 */
function getTasksInBoard() {
    let tasksInBoard = document.getElementById('tasks-in-board');
    tasksInBoard.innerHTML = tasks.length;
    getTasksUrgent();
}


/**
 * get tasks with prio "urgent"
 */
function getTasksUrgent() {
    let tasksUrgent = document.getElementById('urgent');
    let urgent = 0;
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element['prio'] == 'Urgent') {
            urgent++;
        }
    }
    tasksUrgent.innerHTML = urgent;
    greeting();
    getDatesForSummary();
}


/**
 * get priority status of each task, and count to display the number 
 * @param {id} status urgent, middle or low
 */
function getTasks(status) {
    let task = document.getElementById(status);
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        if (element['status'] == status) {
            count++;
        }
    }
    task.innerHTML = count;
}


/**
 * greet the user different, when its morning or evening..
 */
function greeting() {
    let transition = document.getElementById('greeting-animation');
    let greetingContainer = document.getElementById("greeting-container");
    let date = new Date();
    let hour = date.getHours();
    let greeting;
    if (hour < 12) greeting = "Good morning,";
    else if (hour < 18) greeting = "Good afternoon,";
    else greeting = "Good evening,";
    if (transition) {
        transition.innerHTML = getGreetingHTML(greeting);
    }
    greetingContainer.innerHTML = greeting;
}


/**
 * gets the next coming date in tasks, and diplays the next coming deadline.
 */
function getDatesForSummary() {
    if (tasks.length >= 1) {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            datesForSummary.push(`${task['dueDate']}`);
        }
        datesForSummary.sort();
        let nextDate = null;
        nextDate = datesForSummary[0];
        document.getElementById('summary-date').innerHTML = nextDate;
    } else {
        document.getElementById('summary-date').innerHTML = 'No Task in Board';
    }
}
