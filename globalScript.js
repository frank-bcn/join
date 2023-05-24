/**
 * this function gets the contactlist from backend
 */
async function setUserContacts() {
    await downloadFromServer();
    contactList = JSON.parse(backend.getItem('contactList')) || [];
}

/**
 * pushes tasks in backend
 */
async function setBackendTasks() {
    let arrayAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', arrayAsText);
}

/**
 * pulls tasks in backend
 */
async function getBackendTasks() {
    await downloadFromServer();
    let arrayAsText = backend.getItem('tasks');
    if (arrayAsText) {
        tasks = await JSON.parse(arrayAsText);
    }
}

/**
 * will empty a div of certain id
 * @param {string} id id of div you want to clear
 */
function empty(id) {
    document.getElementById(id).innerHTML = '';
}

/**
 * @returns will return a random color from the array
 */
function getRandomColor() {
    let userColors = ['#8aa4ff', '#ff0000', '#2ad300', '#ff8a00', '#e200be', '#0038ff'];
    return userColors[Math.round(Math.random() * userColors.length)];
}

/**
 * will animate the delete popup
 * @param {number} i index of contact
 */
function deletePopUp(i) {
    document.getElementById('deleteBackground').classList.remove('d-none');
    setTimeout(() => {
        document.querySelector('.deletePopup').classList.add('show');
        contactClicked = i;
    }, 10);
}

/**
 * will animate the delete popup
 */
function closeDeletePopUp() {
    document.querySelector('.deletePopup').classList.remove('show');
    setTimeout(() => {
        document.getElementById('deleteBackground').classList.add('d-none');
        contactClicked = null;
    }, 750);
}