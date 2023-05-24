/**
 * This function is used to save your edited task.
 * @param {number} i this is the index of the task you edited
 */
async function saveEdit(i) {
    if (checkFormEdit()) {
        saveTask(i);
        openTask(i);
    }
}

/**
 * will check which field is not filled correctly and inform user
 * @returns if form filled correctly
 */
function checkFormEdit() {
    if (!inputTitle.value.trim()) {
        document.getElementById('validateTitle').innerHTML = 'This field is required!';
    } else {
        document.getElementById('validateTitle').innerHTML = '';
    } if (!inputDescription.value.trim()) {
        document.getElementById('validateDescription').innerHTML = 'This field is required!';
    } else {
        document.getElementById('validateDescription').innerHTML = '';
    } if (!inputDueDate.value) {
        document.getElementById('validateDueDate').innerHTML = 'This field is required!';
    } else {
        document.getElementById('validateDueDate').innerHTML = '';
    } if (priorityClicked == 'unclicked') {
        document.getElementById('validatePrio').innerHTML = 'This field is required!';
    } else {
        document.getElementById('validatePrio').innerHTML = '';
    } if (currentAssigned.length > 0) {
        document.getElementById('validateAssigned').innerHTML = '';
    } else {
        document.getElementById('validateAssigned').innerHTML = 'This field is required!';
    } if (newCat == 1) {
        document.getElementById('validateCategory').innerHTML = "Please enter category and choose color!"
    }
    return allValid();
}

/**
 * will tell if all fields are filled as required
 * @returns everything clicked ok
 */
function allValid() {
    if (inputTitle.value.trim() != ""
        && inputDescription.value.trim() != ""
        && inputDueDate.value != ""
        && priorityClicked != 'unclicked'
        && currentAssigned.length) {
        return true;
    } else {
        return false;
    }
}

/**
 * this function generates the subtasks in the popup version of task
 * @param {number} i index of task
 */
function generateSubtasksFsHTML(i) {
    for (let j = 0; j < tasks[i]['subtasks'].length; j++) {
        if (tasks[i]['subtasks'][j]['done'] == false) {
            document.getElementById('subtasksFs').innerHTML += /*html*/`
            <div class="subtaskFs" onclick="tickSubtask(${i}, ${j})"><div class="tickBox"><img id="tick${j}" class="d-none" src="../img/tick.svg"></div><p class="marginLeft">${tasks[i]['subtasks'][j]['subtask']}</p></div>
        `;
        } else {
            document.getElementById('subtasksFs').innerHTML += /*html*/`
            <div class="subtaskFs"><div class="tickBox" onclick="tickSubtask(${i}, ${j})"><img id="tick${j}" src="../img/tick.svg"></div><p class="marginLeft">${tasks[i]['subtasks'][j]['subtask']}</p></div>
        `;
        }
    }
}

/**
 * this function lets you tick/untick a subtask inside the popup version of task
 * @param {number} i index of task
 * @param {number} j index of subtask
 */
async function tickSubtask(i, j) {
    if (tasks[i]['subtasks'][j]['done'] == false) {
        tasks[i]['subtasks'][j]['done'] = true;
        document.getElementById(`tick${j}`).classList.remove('d-none');
    }
    else {
        tasks[i]['subtasks'][j]['done'] = false;
        document.getElementById(`tick${j}`).classList.add('d-none');
    }
    await setBackendTasks();
    for (let y = 0; y < tasks.length; y++) {
        renderSubtaskBar(y);
    }
}

/**
 * this function renders assigned bubbles in the popup version of task
 * @param {number} i index of task
 */
function renderAssignedToFullscreen(i) {
    let assigned = document.getElementById('assigned');

    for (let j = 0; j < tasks[i]['assignedTo'].length; j++) {
        const element = tasks[i]['assignedTo'][j];
        assigned.innerHTML += generateAssignedHTML(element);
    }
}

/**
 * this function will switch from popup view to edit view so you can edit your tasks
 * @param {number} i index of task
 */
async function editTask(i) {
    let title = tasks[i]['title'];
    let description = tasks[i]['description'];
    let dueDate = tasks[i]['dueDate'];
    priorityClicked = tasks[i]['prio'];
    empty('FsTask');
    document.getElementById('FsTask').innerHTML = renderEditTaskHTML(i, title, description, dueDate);
    setPrioBackground(priorityClicked);
    await renderAssignedToEdit('myAssignedEditDropdown');
    await checkAssigned(i);
    await limitDueDate();
    await renderAssignedContactsEdit(i);
    index = i;
}

/**
 * this function will render the dropdown menu of the assigned contacts
 * @param {string} id this is the id of the dropdown menu div inside of which the assigend contacts are rendered
 */
async function renderAssignedToEdit(id) {
    await setUserContacts();
    document.getElementById(id).innerHTML = '';
    for (let i = 0; i < contactList.length; i++) {
        document.getElementById(id).innerHTML += `<a onclick="changeContact(${i})">${contactList[i]['firstName']} ${contactList[i]['lastName']}<img id="checkEdit${i}" src="../img/blackCircleOutline.png"></a>`;
    }
}

/**
 * this function will assign/unassign a contact upon clicking it
 * @param {number} i index of contact
 */
function changeContact(i) {
    currentAssigned = tasks[index]['assignedTo'];
    if (contactAlreadyAssignedEdit(i)) {
        document.getElementById(`checkEdit${i}`).src = '../img/blackCircleOutline.png';
        unAssignContactEdit(i);
    } else {
        currentAssigned.push(contactList[i]);
        document.getElementById(`checkEdit${i}`).src = '../img/blackCircle.png';
    }
    renderAssignedContactsEdit();
}

/**
 * this function checks which contacts are assigned to chosen task and will mark them in the dropdown list
 * @param {number} i index of task
 */
async function checkAssigned(i) {
    currentAssigned = [];
    await downloadFromServer();
    contactList = JSON.parse(backend.getItem('contactList')) || [];
    for (let j = 0; j < tasks[i]['assignedTo'].length; j++) {
        const contactAssigned = tasks[i]['assignedTo'][j];
        for (let y = 0; y < contactList.length; y++) {
            if (contactMatch(contactList[y], contactAssigned)) {
                document.getElementById(`checkEdit${y}`).src = '../img/blackCircle.png';
                currentAssigned.push(contactAssigned);
                break;
            } else {
                if (y == contactList.length - 1) {
                    tasks[i]['assignedTo'].splice(j, 1);
                }
            }
        }
    }
}

/**
 * this function will unassign a contact 
 * @param {number} i index of contactList
 */
function unAssignContactEdit(i) {
    let currentContact = contactList[i];
    for (let j = 0; j < currentAssigned.length; j++) {
        if (contactMatch(currentAssigned[j], currentContact)) {
            currentAssigned.splice(j, 1);
            break;
        }
    }
    renderAssignedContactsEdit();
}

/**
 * this function will return if the chosen contact is already marked in the dropdown as assigned
 * @param {number} i index of contact
 * @returns returns the source of the image which symbolizes the tickbox
 */
function contactAlreadyAssignedEdit(i) {
    return (document.getElementById(`checkEdit${i}`).src).endsWith('/img/blackCircle.png');
}

/**
 * thsi function renders the assigned contat bubbles in the edit view
 */
function renderAssignedContactsEdit() {
    empty('assignedContactsEdit');
    for (let y = 0; y < currentAssigned.length; y++) {
        const curAss = currentAssigned[y];
        document.getElementById('assignedContactsEdit').innerHTML += /*html */`            
            <div class="contactBubble" style="background-color: ${curAss['userColor']};">${(curAss['firstName']).charAt(0)}${(curAss['lastName']).charAt(0)}</div>
        `;
    }
}

/**
 * this function shows the priority that is clicked
 * @param {string} prio priority of task
 */
function changeColorEdit(prio) {
    if (priorityClicked == prio) {
        unclickPrio(prio);
    } else {
        setPrioBackground(prio);
    }
}

/**
 * this function will reset the priority if the current priority is clicked again
 * @param {string} prio priority of task
 */
function unclickPrio(prio) {
    document.getElementById(`${prio}Edit`).src = `../img/prio${prio}.svg`;
    document.getElementById(`${prio}-buttonEdit`).classList.remove(`bg-${prio}`);
    priorityClicked = 'unclicked';
}

/**
 * this function will set the color of the priority buttons appropriate to the current chosen prio
 * @param {string} prio priority of task
 */
function setPrioBackground(prio) {
    resetPrioButtonsEdit();
    priorityClicked = prio;
    document.getElementById(`${prio}Edit`).src = `../img/prio${prio}-white.svg`;
    document.getElementById(`${prio}-buttonEdit`).classList.add(`bg-${prio}`);
}

/**
 * this function will reset the prio buttons so no prio is clicked
 */
function resetPrioButtonsEdit() {
    let priorities = ['Urgent', 'Medium', 'Low'];
    for (let i = 0; i < priorities.length; i++) {
        document.getElementById(`${priorities[i]}Edit`).src = `../img/prio${priorities[i]}.svg`;
        document.getElementById(`${priorities[i]}-buttonEdit`).classList.remove(`bg-${priorities[i]}`);
    }
}

/**
 * when you finished your changes this function will save your edited task
 * @param {number} i index of task
 */
function saveTask(i) {
    tasks[i] = {
        'title': inputTitle.value,
        'description': inputDescription.value,
        'category': tasks[i]['category'],
        'dueDate': inputDueDate.value,
        'subtasks': tasks[i]['subtasks'],
        'status': tasks[i]['status'],
        'assignedTo': currentAssigned,
        'prio': priorityClicked
    };
    resetTask();
}

/**
 * will reset certain variables after saving task
 */
async function resetTask() {
    currentAssigned = [];
    priorityClicked = 'unclicked';
    await setBackendTasks();
    renderTasks();
}
