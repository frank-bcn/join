/**
 * This function is used to generate all available tasks 
 */
async function initialise() {
    await includeHTML(1);
    await setUserContacts();
    await renderTasks();
}

/**
 * This function will clear the board and render all elements inside tasks[] into the board
 */
async function renderTasks() {
    await getBackendTasks();
    empty('todoTask');
    empty('inProgressTask');
    empty('awaitingFeedbackTask');
    empty('doneTask');
    for (let i = 0; i < tasks.length; i++) {
        renderTask(i);
    }
}

/**
 * this function is used to render a specific task 
 * @param {number} i this is the index of the task you want to render
 */
function renderTask(i) {
    document.getElementById(tasks[i]['status']).innerHTML += generateTaskHTML(i);
    renderCategoryColor(i);
    renderSubtaskBar(i);
    renderPrio(i);
    renderAssignedContacts(i);
}

/**
 * This function gives the background color of the category field in the task
 * @param {number} i this is the index of the task of which you want to render the color of the category
 */
function renderCategoryColor(i) {
    document.getElementById(`category${i}`).style = `Background-color: ${tasks[i]['category']['color']};`;
}

/**
 * This function renders the subtaskbar of tasks[i]
 * @param {number} i this is the index of the task of which you want to render the subtaskbar
 */
function renderSubtaskBar(i) {
    if (subtasksAvailable(i)) {
        let subtaskTrack = document.getElementById(`subtaskTrack${i}`);
        let element = tasks[i]['subtasks'];
        let howmanyDone = 0;
        for (let j = 0; j < element.length; j++) {
            if (element[j]['done'] == true) {
                howmanyDone++;
            }
        }
        subtaskTrack.innerHTML = generateSubtaskHTML(i, howmanyDone);
        let barWidth = (howmanyDone / tasks[i]['subtasks'].length) * 100;
        document.getElementById(`subtaskProgress${i}`).style = `width: ${barWidth}%`;
    }
}

/**
 * checks if subtask is available
 */
function subtasksAvailable(i) {
    return tasks[i]['subtasks'].length > 0;
}

/**
 * this function renders the little priority icon in the bottom right of your task
 * @param {number} i this is the index of the task of which you want to render the priority
 */
function renderPrio(i) {
    let contactPrio = document.getElementById(`contactPrio${i}`);
    contactPrio.innerHTML = renderContactPrioHTML(i);
}

/**
 * this function renders the contact bubbles in the tasks overview
 * @param {number} i index of task
 */
function renderAssignedContacts(i) {
    let toManyContacts = 1;
    for (let j = 0; j < tasks[i]['assignedTo'].length; j++) {
        if (j < 3) {
            let firstName = (tasks[i]['assignedTo'][j]['firstName']).charAt(0);
            let lastName = (tasks[i]['assignedTo'][j]['lastName']).charAt(0);
            document.getElementById(`assigned${i}`).innerHTML += /*html*/`
                <div class="contactBubble" id="bubble${j}${i}" style="background-color: ${tasks[i]['assignedTo'][j]['userColor']};">${firstName}${lastName}</div>
            `;
        } else {
            toManyContacts++;
            document.getElementById(`bubble2${i}`).innerHTML = /*html*/`
                <div class="contactBubble" style="background-color: #2a3647;">+${toManyContacts}</div>
            `;
        }
    }
}

/**
 * this function figures out which tasks is currently dragged
 * @param {number} i index of dragged task
 */
function startDragging(i) {
    currentDrag = i;
}

/**
 * this function allows the task to be droppend
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * this function gives the dragged task a new status depending on where it is dropped
 * @param {string} status indicates the new status of the task (todo, done etc)
 */
async function moveTo(status) {
    tasks[currentDrag]['status'] = status;
    await setBackendTasks();
    renderTasks();
    currentDrag = null;
}

/**
 * this function shows the drop zone if the task is dragged over it
 * @param {string} id the id of the field over which the task is curently hovered
 */
function hoverDrop(id) {
    document.getElementById(id).classList.add('bg-hover');
}

/**
 * this function removes the drop zone if the task is dragged away
 * @param {string} id the id of the field over which the task is curently hovered
 */
function unHoverDrop(id) {
    document.getElementById(id).classList.remove('bg-hover');
}

/**
 * this function will tilt the task as long as it is dragged
 * @param {number} i index of task
 */
function tilt(i) {
    document.getElementById(`task${i}`).classList.add('tilt');
}

/**
 * this function will untilt the task upon drop
 * @param {number} i index of task
 */
function unTilt(i) {
    document.getElementById(`task${i}`).classList.remove('tilt');
}

/**
 * this function will render the tasks that are matching with your search
 */
function search() {
    let input = document.getElementById('searchInput').value;
    empty('todoTask');
    empty('inProgressTask');
    empty('awaitingFeedbackTask');
    empty('doneTask');
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]['title'].includes(input) || tasks[i]['description'].includes(input)) {
            renderTask(i);
        }
    }
}

/**
 * this function opens the popup version of a task upon click
 * @param {number} i index of task
 */
function openTask(i) {
    document.getElementById('body').classList.add('overflow-none');
    let fullscreen = document.getElementById('FsTask');
    fullscreen.classList.remove('d-none');
    document.getElementById('fullscreenBackground').classList.remove('d-none');

    fullscreen.innerHTML = generateFullscreenTaskHTML(i);
    renderAssignedToFullscreen(i);
    generateSubtasksFsHTML(i);
    limitDueDate();
    index = i;
}

/**
 * checks if the botch contacts match
 * @returns true if match
 */
function contactMatch(contactCompare, contactAssigned) {
    return contactCompare['firstName'] == contactAssigned['firstName'] && contactCompare['lastName'] == contactAssigned['lastName'];
}

/**
 * this function will delete a chosen task
 * @param {number} x index of task
 * @param {*} event 
 */
async function deleteTask(x) {
    tasks.splice(x, 1);
    await setBackendTasks();
    renderTasks();
}

/**
 * will show the move task view to move a task by clicking
 * @param {number} i index of clicked task
 */
async function moveTask(i) {
    await renderTasks();
    currentDrag = i;
    document.getElementById(`task${i}`).innerHTML = generateMoveToHTML();
}

/**
 * will prevent parent div onclick function from being executed
 */
function stopProp(event) {
    event.stopPropagation();
}

/**
 * will scroll the progress bar to the right
 */
function progressScrollRight() {
    let div = document.getElementById('progressFields');
    div.scrollLeft += 338.5;
}

/**
 * will scroll the progress bar to the left
 */
function progressScrollLeft() {
    let div = document.getElementById('progressFields');
    div.scrollLeft -= 338.5;
}