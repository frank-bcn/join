/**
 * this function will close dropdown menues if somewhere else is clicked
 * @param {*} event 
 */
window.onclick = function (event) {
    if (dropdownClicked(event)) {
        closeAllDropdowns();
    }
    dropClicked = false;
}

/**
 * will close all open dropdowns
 */
function closeAllDropdowns() {
    let collection = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < collection.length; i++) {
        collection[i].classList.add("d-none");
    }
}

/**
 * checks if a dropdown is clicked
 * @param {*} event 
 * @returns returns true if a dropdown is clicked
 */
function dropdownClicked(event) {
    return !event.target.matches('.dropbtn') && !dropClicked && !event.target.closest('.dropdown-content');
}

/**
 * will change form category dropdown to enter new category field
 */
function newCategory() {
    document.getElementById('categoryDropdown').classList.add('d-none');
    document.getElementById('newCategory').classList.remove('d-none');
    document.getElementById('categoryColors').classList.remove('d-none');
    newCat = 1;
}

/**
 * will change back to the category dropdown
 */
async function reverseCategory() {
    document.getElementById('categoryDropdown').classList.remove('d-none');
    document.getElementById('newCategory').classList.add('d-none');
    document.getElementById('categoryColors').classList.add('d-none');
    newCat = 0;
}

/**
 * will create a new category upon clicking the tick
 */
async function addCustomCategory() {
    if (currentColor && document.getElementById('customCategory').value) {
        let newCategory = document.getElementById('customCategory').value;
        newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);;
        await reverseCategory();
        await setCategory(newCategory);
        chooseCategory(categories.length - 1);
        document.getElementById('validateCategory').classList.remove('redText');
        renderCategorys();
    }
    else {
        document.getElementById('validateCategory').innerHTML = "Please enter category and choose color!"
        document.getElementById('validateCategory').classList.add('redText');
    }
}

/**
 * will set category
 */
async function setCategory(newCategory){
    if (newCategory) {
        categories[categories.length] = {
            'name': newCategory,
            'color': currentColor
        };
        await setBackend();
    }
}

/**
 * will choose the category you clicked and display it
 * @param {number} i index of task
 */
async function chooseCategory(i) {
    await getBackend();
    document.getElementById('dropbtnCategory').innerHTML = categories[i]['name'] + `<div class="categoryColor" style="background-color: ${categories[i]['color']}"></div>`;
    currentCategory = i;
    let currentPage = window.location['pathname'];
    if (currentPage == '/Add-task/addtask.html') {
        document.getElementById('myDropdownATP').classList.add('d-none');
    }
    closeAllDropdowns();
}

/**
 * will get the categorys from backend
 */
async function getBackend() {
    await downloadFromServer();
    categories = JSON.parse(backend.getItem('categories')) || [];
    if (categories.length < 1) {
        categories = [
            {
                'name': 'Sales',
                'color': '#fc71ff'
            },
            {
                'name': 'Backoffice',
                'color': '#1fd7c1'
            },
            {
                'name': 'Media',
                'color': '#ffc701'
            },
            {
                'name': 'Design',
                'color': '#ff7a00'
            }
        ];
        setBackend();
    }
}

/**
 * saves the categorys into the backend
 */
async function setBackend() {
    await backend.setItem('categories', JSON.stringify(categories));
}

/**
 * will render categorys into dropdowns
 */
async function renderCategorys() {
    await downloadFromServer();
    await getBackend();
    if (window.location['pathname'] == '/Add-task/addtask.html') {
        id = 'myDropdownATP';
    }
    else {
        id = 'myDropdown';
    }
    document.getElementById(id).innerHTML = `<a onclick="newCategory()">New Category <div class="categoryColor" style="background-color: grey"></div></a>`;
    for (let i = 0; i < categories.length; i++) {
        document.getElementById(id).innerHTML += generateCategoryHTML(i);
    }
}

/**
 * will delete clicked categorys
 * @param {number} i index of category
 * @param {*} event 
 */
async function deleteCategory(i, event) {
    event.stopPropagation();
    categories.splice(i, 1);
    await setBackend();
    renderCategorys();
}

/**
 *  renders the list of contacts inside dropdown
 * @param {string} id id of dropdown div
 */
async function renderAssignedTo(id) {
    await downloadFromServer();
    await setUserContacts();
    document.getElementById(id).innerHTML = '';
    for (let i = 0; i < contactList.length; i++) {
        document.getElementById(id).innerHTML += `<a onclick="chooseContact(${i})">${contactList[i]['firstName']} ${contactList[i]['lastName']}<img class="check" id="check${i}" src="../img/blackCircleOutline.png"></a>`;
    }
}

/**
 * Var "PriorityClicked" = value for Tasks -> when array("Task") is ready, we push this value in.
 * @param {*} prio 
 */
function changeColor(prio) {
    if (priorityClicked == prio) {
        document.getElementById(`${prio}`).src = `../img/prio${prio}.svg`;
        document.getElementById(`${prio}-button`).classList.remove(`bg-${prio}`);
        priorityClicked = 'unclicked';
    } else {
        resetPrioButtons();
        priorityClicked = prio;
        document.getElementById(`${prio}`).src = `../img/prio${prio}-white.svg`;
        document.getElementById(`${prio}-button`).classList.add(`bg-${prio}`);
    }
}

/**
 * will select a chosen color in new category field
 * @param {string} id id of the clicked color
 * @param {string} color hex code of chosen color
 */
function chooseColor(id, color) {
    for (let i = 1; i <= 6; i++) {
        document.getElementById(i).classList.remove('border');
    }
    document.getElementById(id).classList.add('border');
    currentColor = color;
}

/**
 * will show or hide the dropdown clicked in board
 * @param {string} id the id of clicked dropdown div
 */
async function showDropdown(id) {
    document.getElementById(id).classList.toggle("d-none");
    if (!document.getElementById(id).classList.contains("d-none")) {
        dropClicked = true;
    }
    if (id == 'myAssignedEditDropdown') {
        await renderAssignedToEdit('myAssignedEditDropdown');
        await checkAssigned(index);
        limitDueDate();
    }
}

/**
 * will show or hide the dropdown clicked in add task page
 * @param {string} id the id of clicked dropdown div
 */
function showDropdownATP(id) {
    document.getElementById(id).classList.toggle("d-none");
    if (!document.getElementById(id).classList.contains("d-none")) {
        dropClicked = true;
    }
    if (id == 'myDropdownATP') {
        document.getElementById('myAssignedDropdownATP').classList.add("d-none");
    }
    else {
        document.getElementById('myDropdownATP').classList.add("d-none");
        addTaskRenderAssignedBubble();
    }
}

/**
 * will assign/unassign a clicked contact and show with a filled or unfilled circle in dropdown
 * @param {number} i index of contact in dropdown
 */
function chooseContact(i) {
    dropClicked = true;
    if (contactAlreadyAssigned(i)) {
        document.getElementById(`check${i}`).src = '../img/blackCircleOutline.png';
        unAssignContact(i);
    } else {
        assignedContacts.push(contactList[i]);
        document.getElementById(`check${i}`).src = '../img/blackCircle.png';
    }
    addTaskRenderAssignedBubble();
    dropClicked = false;
}

/**
 * will change the assigned contacts in a task upon editing the contact
 * @param {number} index index of contact
 * @param {json} newContact the edited contact
 */
async function updateAssigned(index, newContact) {
    await downloadFromServer();
    await getBackendTasks();
    let oldContact = contactList[index];
    for (let i = 0; i < tasks.length; i++) {
        const element1 = tasks[i];
        for (let y = 0; y < element1['assignedTo'].length; y++) {
            const element = element1['assignedTo'][y];
            if (oldContact.firstName == element.firstName && oldContact.lastName == element.lastName) {
                tasks[i]['assignedTo'][y] = newContact;
            }
        }
    }
    await setBackendTasks();
}

/**
 * @param {number} i index of contact in dropdown
 * @returns if contact is already is assigned
 */
function contactAlreadyAssigned(i) {
    return (document.getElementById(`check${i}`).src).endsWith('/img/blackCircle.png');
}

/**
 * this function will unassign a contact 
 * @param {number} i index of contact list
 */
function unAssignContact(i) {
    let currentContact = contactList[i];

    for (let j = 0; j < assignedContacts.length; j++) {
        if (assignedContacts[j] == currentContact) {
            assignedContacts.splice(j, 1);
        }
    }
}