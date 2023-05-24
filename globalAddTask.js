/**
 * pushes status in backend
 */
async function setBackendStatus(status) {
    newTaskStatus = status;
    await backend.setItem('status', status);
}

/**
 * pulls status from backend
 */
async function getBackendStatus() {
    await downloadFromServer();
    let statusBackend = backend.getItem('status');
    if (statusBackend) {
        newTaskStatus = statusBackend;
    }
}

/**
 * this function will call all nessecary functions that are used to initialize the add task page site
 */
async function initialiseATP() {
    await includeHTML(2);
    await renderCategorys();
    await renderAssignedTo('myAssignedDropdownATP');
    limitDueDate();
    await setUserContacts();
    await getBackendTasks();
    await getBackendStatus();
}

/**
 * this function blocks dates from the past in the date field
 */
function limitDueDate() {
    let today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < document.getElementsByName("dueDateField").length; i++) {
        document.getElementsByName("dueDateField")[i].setAttribute('min', today);
    }
}

/**
 * this function will close the popup
 */
async function closeFullscreen() {
    document.getElementById('tasks').classList.add('d-none');
    document.getElementById('fullscreenBackground').classList.add('d-none');
    document.getElementById('FsTask').classList.add('d-none');
    if (document.getElementById('body')) {
        document.getElementById('body').classList.remove('overflow-none');
    }
    currentAssigned = [];
    assignedContacts = [];
    if (window.location['pathname'] == '/board/boardIndex.html') {
        await renderTasks();
    }
}

/**
 * this function will check the screen width and will either open the add task popup or redirect to the addtask page
 */
async function openPopup(status) {
    await getBackendTasks();
    await setBackendStatus(status);
    if (window.innerWidth > 1000) {
        document.getElementById('tasks').classList.remove('d-none');
        document.getElementById('tasks').innerHTML = renderPopup();
        renderCategorys();
        await renderAssignedTo('myAssignedDropdown');
        await downloadFromServer();
        limitDueDate();
        await setUserContacts();
        document.getElementById('fullscreenBackground').classList.remove('d-none');
    }
    else {
        window.location.replace("/Add-task/addtask.html");
    }
}

/**
 * will check if there is a priority clicked and then create the task
 */
async function createTask() {
    if (checkForm()) {
        if (!newTaskStatus) {
            newTaskStatus = 'todoTask';
        }
        tasks[tasks.length] = {
            'title': titleField.value,
            'description': descriptionField.value,
            'category': categories[currentCategory],
            'dueDate': dueDateField.value,
            'subtasks': subtasks,
            'status': newTaskStatus,
            'assignedTo': assignedContacts,
            'prio': priorityClicked
        };
        await setBackendTasks();
        redirect();
        resetAll();
    }
}

/**
 * will redirect user after creating a task to the board page
 */
function redirect() {
    if (window.location['pathname'] == '/Add-task/addtask.html' || window.location['pathname'] == '/contact/contact.html') {
        window.location.href = "../board/boardIndex.html";
    }
    else {
        closeFullscreen();
        renderTasks();
    }
}

/**
 * will reset certain variables after creating a new task
 */
function resetAll() {
    subtasks = [];
    currentAssigned = [];
    assignedContacts = [];
    currentCategory = null;
    setBackendStatus(null);
}

/**
 * sets prio buttons to unclicked
 */
function resetPrioButtons() {
    let priorities = ['Urgent', 'Medium', 'Low'];
    for (let i = 0; i < priorities.length; i++) {
        document.getElementById(`${priorities[i]}`).src = `../img/prio${priorities[i]}.svg`;
        document.getElementById(`${priorities[i]}-button`).classList.remove(`bg-${priorities[i]}`);
    }
}

/**
checks if all form has been filled correctly and inform user
@return {boolean} Returns true if all required fields are valid, false otherwise.
*/
function checkForm() {

    validateInput(!titleField.value.trim(), 'validateTitle');
    validateInput(!descriptionField.value.trim(), 'validateDescription');
    validateInput(!dueDateField.value, 'validateDueDate');
    validateInput(!assignedContacts.length > 0, 'validateAssigned');

    validateCategory();
    validatePrio();
    return checkCorrectFilled();
}

/**
 * will validate if a certain criteria is met to validate add task inputs
 */
function validateInput(check, id){
    if(check){
        document.getElementById(id).innerHTML = 'This field is required!';
    } else {
        document.getElementById(id).innerHTML = '';
    }
}

/**
 * will validate if priority is clicked
 */
function validatePrio(){
    if(priorityClicked == 'unclicked'){
        document.getElementById('validatePrio').innerHTML = 'This field is required';
    } else {
        document.getElementById('validatePrio').innerHTML = '';
    }
}

/**
 * will validate if category is selected
 */
function validateCategory(){
    if (newCat == 1) {
        document.getElementById('validateCategory').innerHTML = "Please enter category and choose color!"
    } else {
        if (currentCategory) {
            document.getElementById('validateCategory').innerHTML = '';
        } else {
            document.getElementById('validateCategory').innerHTML = 'This field is required';
        }
    }
}

/**
Checks if all required form fields have been filled out correctly.
@return {boolean} Returns true if all required fields are valid, false otherwise.
 */
function checkCorrectFilled() {
    return (titleField.value.trim() != ""
        && descriptionField.value.trim() != ""
        && dueDateField.value != ""
        && priorityClicked != 'unclicked'
        && assignedContacts.length > 0
        && currentCategory
        && newCat == 0);
}

/**
 * will add a subtask
 */
function addSubtask() {
    let input = document.getElementById('subtaskInput').value.trim();
    if (input.replace(/ /g, '')) {
        subtasks.push(
            {
                'subtask': input,
                'done': false
            }
        );
        document.getElementById('subtaskField').innerHTML += /*html*/`
        <span class="subtaskList" id="${subtasks.length - 1}">${input} <img onclick="deleteSubtask(${subtasks.length - 1})" src="../img/crossx.svg"></span>
    `;
    }
}

/**
 * will delete a created subtask
 * @param {string} id id of subtask div
 */
function deleteSubtask(id) {
    let subtask = document.getElementById(id);
    for (let i = 0; i < subtasks.length; i++) {
        if (subtask.innerHTML.startsWith(subtasks[i]['subtask'])) {
            subtasks.splice(i, 1);
        }
    }
    subtask.remove();
}

/**
 * will create the little bubbles with initials of the assigned contacts in the add task page
 */
function addTaskRenderAssignedBubble() {
    document.getElementById(`assignedAddTask`).innerHTML = '';
    let toManyContacts = 1;
    for (let j = 0; j < assignedContacts.length; j++) {
        renderBubble(toManyContacts, j);
    }
}

/**
 * will render the contact bubbles beneath the assigned to dropdown
 */
function renderBubble(toManyContacts, j) {
    if (j < 6) {
        let firstName = (assignedContacts[j]['firstName']).charAt(0);
        let lastName = (assignedContacts[j]['lastName']).charAt(0);
        document.getElementById(`assignedAddTask`).innerHTML += /*html*/`
            <div class="contactBubble" id="bubble${j}" style="background-color: ${assignedContacts[j]['userColor']};">${firstName}${lastName}</div>
        `;
    } else {
        toManyContacts++;
        document.getElementById(`bubble5`).innerHTML = /*html*/`
            <div class="contactBubble" style="background-color: #2a3647;">+${toManyContacts}</div>
        `;
    }
}
