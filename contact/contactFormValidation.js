/**
 * Checks the validity of the edited contact form.
 * @returns {boolean} - True if the edited contact form is valid, false otherwise.
 */
function checkFormEditContact(i) {
    validateEditName();
    validateEditEmail();
    validateEditPhone();
    return (validateEditName()
        && validateEditEmail()
        && validateEditPhone()
        && validateEmailDuplicateEdit(i)
        && validatePhoneDuplicateEdit(i));
}

/**
 * will check if email already exist
 */
function validateEmailDuplicateEdit(i) {
    for (const contact of contactList) {
        if (contact.email === emailEdit.value && contact.email != contactList[i].email) {
            document.getElementById('validateEmailEdit').innerHTML = 'This E-Mail already exists!';
            return false;
        }
    };
    return true;
}

/**
 * will check if phone number already exist
 */
function validatePhoneDuplicateEdit(i) {
    for (const contact of contactList) {
        if (contact.phone === telEdit.value && contact.phone != contactList[i].phone) {
            document.getElementById('validatePhoneEdit').innerHTML = 'This Phone Number already exists!';
            return false;
        }
    };
    return true;
}

/**
* Validates the edited name field.
* @returns {boolean} - True if the name field is valid, false otherwise.
*/
function validateEditName() {
    if (nameEdit.value.split(" ")[0]
        && nameEdit.value.split(" ")[1]) {
        document.getElementById('validateNameEdit').innerHTML = '';
        return true;
    } else {
        document.getElementById('validateNameEdit').innerHTML = 'Please enter first and last name!';
        return false;
    }
}

/**
 * Validates the edited email field.
 * @returns {boolean} - True if the email field is valid, false otherwise.
 */
function validateEditEmail() {
    let email = emailEdit.value;
    let emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('validateEmailEdit').innerHTML = 'Please enter correct E-Mail adress!';
        return false;
    } else {
        document.getElementById('validateEmailEdit').innerHTML = '';
        return true;
    }
}

/*
 * Validates the edited phone field.
 * @returns {boolean} - True if the phone field is valid, false otherwise.
 */
function validateEditPhone() {
    let phone = telEdit.value;
    let phoneRegex = /^\+?\d{1,3}[- ]?\d{3,4}[- ]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('validatePhoneEdit').innerHTML = 'Please enter correct phone number!';
        return false;
    } else {
        document.getElementById('validatePhoneEdit').innerHTML = '';
        return true;
    }
}

/**
Checks if all required form fields have been filled out correctly.
@return {boolean} Returns true if all required fields are valid, false otherwise.
*/
function checkFormAddContact() {
    validateName();
    validateEmail();
    validatePhone();
    return (validateName()
        && validateEmail()
        && validatePhone()
        && validateEmailDuplicate()
        && validatePhoneDuplicate())
}

/**
 * will check if email already exist
 */
function validateEmailDuplicate() {
    if(contactList.length < 1){
        return true;
    }
    for (const contact of contactList) {
        if (contact.email === emailAdd.value) {
            document.getElementById('validateEmail').innerHTML = 'This E-Mail already exists!';
            return false;
        }
    };
    return true;
}

/**
 * will check if phone number already exist
 */
function validatePhoneDuplicate() {
    if(contactList.length < 1){
        return true;
    }
    for (const contact of contactList) {
        if (contact.phone === telAdd.value) {
            document.getElementById('validatePhone').innerHTML = 'This Phone Number already exists!';
            return false;
        }
    };
    return true;
}

/**
 * Validates the name field in the add contact form.
 * @returns {boolean} - True if the name field is valid, false otherwise.
 */
function validateName() {
    if (nameAdd.value.split(" ")[0]
        && nameAdd.value.split(" ")[1]) {
        document.getElementById('validateName').innerHTML = '';
        return true;
    } else {
        document.getElementById('validateName').innerHTML = 'Please enter first and last name!';
        return false;
    }
}

/**
 * Validates the email field in the add contact form.
 * @returns {boolean} - True if the email field is valid, false otherwise.
 */
function validateEmail() {
    let email = emailAdd.value;
    let emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('validateEmail').innerHTML = 'Please enter correct E-Mail adress!';
        return false;
    } else {
        document.getElementById('validateEmail').innerHTML = '';
        return true;
    }
}

/**
 * Validates the phone field in the add contact form.
 * @returns {boolean} - True if the phone field is valid, false otherwise.
 */
function validatePhone() {
    let phone = telAdd.value;
    let phoneRegex = /^\+?\d{1,3}[- ]?\d{3,4}[- ]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('validatePhone').innerHTML = 'Please enter correct phone number!';
        return false;
    } else {
        document.getElementById('validatePhone').innerHTML = '';
        return true;
    }
}