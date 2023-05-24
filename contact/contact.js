/**
 *loadContact
 */
async function loadContact() {
  await sortContacts();
  createContactRightSide();
  //document.getElementById('contact').innerHTML = "";
  await downloadFromServer();
  contactList = JSON.parse(backend.getItem('contactList')) || [];
  renderContactList(contactList);
}

/**
 * renderContactList
 */
function renderContactList(contactList) {
  let currentLetter = "";
  let html = "";
  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    let firstLetter = contact.firstName[0];
    let result = createContactListSections(firstLetter, currentLetter, html);
    currentLetter = result.currentLetter;
    html = result.html;
    html = createContactListElements(i, contact, html);
  }
  document.getElementById('contactList').innerHTML = html;
}

/**
 * createContactListSections
 */
function createContactListSections(firstLetter, currentLetter, html) {
  if (firstLetter.toLowerCase() !== currentLetter.toLowerCase()) {
    currentLetter = firstLetter;
    html += /*html*/`
          <div class="contactListSide">
            <div class="alpphabetSorting">${firstLetter.toUpperCase()}</div>
            <span class="dividingBar"></span>
          </div>
        `;
  }
  return { currentLetter, html };
}

/**
 * createContactListElements
 */
function createContactListElements(i, contact, html) {
  html += /*html*/`
        <div class="contact" id="contact-${i}" onclick="loadContactInfo(${i})">
          <div id="picImg${i}" class="picImg" style="background-color: ${contact['userColor']}">${contact.firstName[0].charAt(0).toUpperCase()}${contact.lastName[0].charAt(0).toUpperCase()}</div>
          <div class="dataInfo">
            <div class="dataName">${contact.firstName} ${contact.lastName}</div>
            <div class="dataMail">${contact.email}</div>
          </div>
        </div>
      `;
  return html;
}

/**
 * createContactRightSide
 */
function createContactRightSide() {
  document.getElementById('contactRightSide').innerHTML = generatecreateContactRightSideHTML();
}

/**
 * loadContactInfo
 */
function loadContactInfo(i) {
  changeBackgroundColor(i);
  const firstNameInitial = contactList[i].firstName[0].toUpperCase();
  const lastNameInitial = contactList[i].lastName[0].toUpperCase();
  document.getElementById('contact').innerHTML = generateContactInfoHTML(i, contactList, firstNameInitial, lastNameInitial);
  document.getElementById('newContact').style.zIndex = '0';
  document.getElementById('containerRightSide').style.zIndex = '2';
  document.getElementById('contactDataContainer').style.zIndex = '3';
  document.getElementById('texttemplatesKanban').style.zIndex = '3';
  document.getElementById('contactList').style.zIndex = '2';
}

/**
* overlayAddContact
*/
function overlayAddContact() {
  document.getElementById('overlayAddContact').innerHTML = generateoverlayAddContactHTML();
  document.getElementById('overlayAddContact').classList.add('show');
  document.getElementById('popUpContainer').classList.remove('d-none');
  document.getElementById('newContact').classList.add('d-none');
}

/**
 * overlayEditContact
 * * @param {string} i
 */
function overlayEditContact(i) {
  const firstNameInitial = contactList[i].firstName[0].toUpperCase();
  const lastNameInitial = contactList[i].lastName[0].toUpperCase();
  document.getElementById('popUpContainer').innerHTML = generateoverlayEditContactHTML(i, contactList, firstNameInitial, lastNameInitial);
  document.getElementById('popUpContainer').classList.remove('d-none');
  setTimeout(() => {
    document.querySelector('.overlayContact').classList.add('show');
  }, 1);
  document.getElementById("nameEdit").value = `${contactList[i].firstName} ${contactList[i].lastName}`;
  document.getElementById("emailEdit").value = contactList[i]["email"];
  document.getElementById("telEdit").value = contactList[i]["phone"];
}

/**
 * Generates HTML code for contact information sorted by first name.
 * @param {Array} contactList - An array of contact objects.
 * @param {string} a.firstName - The first name of a contact object.
 * @param {string} b.firstName - The first name of another contact object.
 * @returns {string} HTML code for the contact information.
 */
async function sortContacts() {
  await downloadFromServer();
  contactList = await JSON.parse(backend.getItem('contactList')) || [];
  contactList.sort((a, b) => {
    if (a.firstName < b.firstName)
      return -1;

    if (a.firstName > b.firstName)
      return 1;

    return 0;
  });
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * Generates HTML code for a sorted list of contacts.
 * @returns {string} HTML code for the contact list.
 */
async function sortContactsList() {
  await downloadFromServer();
  contactList = await JSON.parse(backend.getItem('contactList')) || [];
  await contactList.sort(function (a, b) {
    if (a.firstName < b.firstName)
      return -1;
    if (a.firstName > b.firstName)
      return 1;

    return 0;
  });
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * Toggles the visibility of the "Add Contact" overlay.
 */
function overlayAddContactInfo() {
  let overlay = document.querySelector('.overlayAddContactInfo');
  if (!overlay) {
    loadContactInfo();
    overlay = document.querySelector('.overlayAddContactInfo');
  }
  if (overlay.classList.contains('show')) {
    overlay.classList.remove('show');
  } else
    overlay.classList.add('show');
}

/**
 * Changes the background color of the selected contact and removes the selection from the previous contact.
 */
function changeBackgroundColor(i) {
  let previousSelectedContact = document.querySelector(".selected");
  if (previousSelectedContact) {
    previousSelectedContact.classList.remove("selected");
  }
  document.getElementById(`contact-${i}`).classList.add("selected");
}

/**
 * Updates the background color of the logo overlay to the specified color.
 * @param {string} color - The new background color for the logo overlay.
 */
function updateSelectedColor(color) {
  const logoOverlay = document.querySelector(".logoOverlay");
  logoOverlay.style.backgroundColor = color;
}

/**
 * saveEditContact()
 * Saves the edited contact information.
 * @param {number} i - The index of the contact being edited.
 */
async function saveEditContact(i) {
  if (checkFormEditContact(i)) {
    let contactDetails = getContactDetails();
    let firstName = contactDetails.name.split(" ")[0];
    let lastName = contactDetails.name.split(" ")[1];
    firstName = firstName.charAt(0).toUpperCase() + (firstName).slice(1);
    lastName = lastName.charAt(0).toUpperCase() + (lastName).slice(1);
    let updatedContact = {
      firstName: firstName,
      lastName: lastName,
      email: contactDetails.email,
      phone: contactDetails.tel,
      user: currentUser.email,
      userColor: contactList[i].userColor,
    };
    await checkExistingContact(i, updatedContact);
  }
}
/**
 * getContactDetails()
 * Retrieves the contact details from the input fields.
 * @returns {Object} - An object containing the email, name, and telephone number.
 */
function getContactDetails() {
  let email = document.getElementById("emailEdit").value;
  let name = document.getElementById("nameEdit").value;
  let tel = document.getElementById("telEdit").value;
  return {
    email: email,
    name: name,
    tel: tel
  };
}

/**
 * checkExistingContact(t)
 * Checks if an existing contact already exists and performs necessary updates.
 * @param {number} i - The index of the contact being checked.
 * @param {Object} updatedContact - The updated contact object.
 */
async function checkExistingContact(i, updatedContact) {
  await updateAssigned(i, updatedContact);
  updateContact(i, updatedContact);
  await backend.setItem('contactList', JSON.stringify(contactList));
  closeOverlay();
  await loadContact();
  loadContactInfo(generateExistingContactIndex(updatedContact));
}

/**
 * generateExistingContactIndex(updatedContact)
 * Checks if an existing contact already exists and performs necessary updates.
 * @param {number} i - The index of the contact being checked.
 * @param {Object} updatedContact - The updated contact object.
 */
function generateExistingContactIndex(updatedContact) {
  return contactList.findIndex(contact =>
    contact.phone === updatedContact.phone
  );
}

/**
 * Updates the contact in the contact list with the updated contact information.
 * @param {number} existingContactIndex - The index of the existing contact to be updated.
 * @param {Object} updatedContact - The updated contact object.
 */
function updateContact(existingContactIndex, updatedContact) {
  contactList = contactList.map((contact, index) => {
    if (index === existingContactIndex) {
      return {
        ...contact,
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        phone: updatedContact.phone,
      };
    }
    return contact;
  });
}

/**
 * saveContact()
 * Saves a new contact to the contact list if the form has been validated.
 * Retrieves the data from the input fields and creates a new contact object.
 * Adds the new contact to the contact list and saves the updated contact list.
 * Closes the overlay window and reloads the contact list.
 * Closes the Add Contact form.
 */
async function saveContact() {
  if (checkFormAddContact()) {
    const name = document.getElementById('nameAdd').value;
    const email = document.getElementById('emailAdd').value;
    const phone = document.getElementById('telAdd').value;

    const newContact = createContactObject(name, email, phone);
    addContactToList(newContact);
    await saveContactList();
    closeOverlay();
    loadContact();
    closeAddContact();
  }
}

/**
 * createContactObject()
 * Creates a new contact object based on the provided name, email, and phone.
 * The name is split into first name and last name (if available).
 * The first letter of each name is capitalized.
 * Generates a random color for the contact's userColor property.
 * Sets the user property to the email of the current user.
 * Returns the newly created contact object.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {object} The newly created contact object.
 */
function createContactObject(name, email, phone) {
  const firstName = capitalizeFirstLetter(name.split(' ')[0]);
  const lastName = capitalizeFirstLetter(name.split(' ')[1] || '');

  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    userColor: getRandomColor(),
    user: currentUser.email
  };
}

/**
 * addContactToList()
 * Adds the provided contact object to the contactList array.
 *
 * @param {object} contact - The contact object to be added to the contactList.
 */
function addContactToList(contact) {
  contactList.push(contact);
}

/**
 * saveContactList()
 * Saves the contactList array to the backend storage.
 * This function asynchronously stores the contactList array in the backend storage.
 */
async function saveContactList() {
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * capitalizeFirstLetter()
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
Changes the background color of a contact image in the contact list.
@param {number} i - The index of the contact image to be colored.
*/
function colorContactList(i) {
  document.getElementById(`picImg${i}`).style = `backgroundcolor:${currentUser['color']}`;
}

/**
Deletes a contact from the contact list.
@param {number} i - The index of the contact to be deleted.
*/
async function deleteContact(i) {
  await removeContactFromTask(i);
  contactList.splice(i, 1); // Entfernt den Kontakt aus der Liste
  await backend.setItem('contactList', JSON.stringify(contactList)); // Aktualisiert die Kontaktliste in der Datenbank
  loadContact(); // Lädt die Kontaktliste neu
  contactClicked = null;
  closeContactInfo();
}

/**
 * will remove the deleted contact from assigned to inside tasks array
 */
async function removeContactFromTask(i){
  await getBackendTasks();
  let deletedContact = contactList[i];
  tasks.forEach(task => {
    task.assignedTo.forEach(assignedContact => {
      if(deletedContact.phone == assignedContact.phone){
        task.assignedTo.splice(task.assignedTo.indexOf(assignedContact), 1);
      }
    });
  });
  setBackendTasks();
}

/**
Hides the add contact overlay and removes the pop-up container.
*/
function closeAddContact() {
  document.getElementById('overlayAddContact').classList.remove('show');
  document.getElementById('popUpContainer').classList.add('d-none');
  document.getElementById('newContact').classList.remove('d-none');
}

/**
Hides the edit contact overlay and removes the pop-up container.
*/
function closeOverlay() {
  document.querySelector('.overlayContact').classList.remove('show');

  setTimeout(() => {
    document.getElementById('popUpContainer').classList.add('d-none');
  }, 750);
}

/**
Generates HTML code for displaying contact information and hides the contact form.
*/
function closeContactInfo() {
  loadContact();
  const closeInfoContainer = document.querySelector('.picAndData');
  closeInfoContainer.classList.add('slide-out');
  document.getElementById('newContact').classList.remove("d-none");
  document.getElementById('newContact').style.zIndex = 7;
  document.getElementById('texttemplatesKanban').style.zIndex = '0';
  document.getElementById('contactDataContainer').style.zIndex = '0';
  document.getElementById('containerRightSide').style.zIndex = '0';
  document.getElementById('contactList').style.zIndex = '4';
}

/**
 * sets the current contact as assigned
 * @param {number} i index of contact
 */
async function setContact(i) {
  await openPopup('todoTask');
  document.getElementById('assignedAddTask').innerHTML = '';
  document.getElementById(`check${i}`).src = '../img/blackCircle.png';
  assignedContacts.push(contactList[i]);
  document.getElementById('assignedAddTask').innerHTML += /*html */`            
    <div class="contactBubble" style="background-color: ${contactList[i]['userColor']};">${(contactList[i]['firstName']).charAt(0)}${(contactList[i]['lastName']).charAt(0)}</div>
  `;
}