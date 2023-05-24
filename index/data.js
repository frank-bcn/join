let users = [{}];
let currentUser;

/**
 * init()
 * Initializes the application by performing necessary setup tasks.
 */
async function init() {
    await getUserData();
    checkRememberMe();
    checkMsg();
    chooseAnimation();
}

/**
 * getUserData()
 * Retrieves user data from the server and populates the 'users' variable.
 */
async function getUserData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}

/**
 * checkRememberMe() 
 * Checks if the "Remember Me" option is enabled and populates the login form if necessary.
 */
function checkRememberMe() {
    let email = getLocalStorageEmail();
    let password = getLocalStoragePassword();

    if (getLocalStorageEmail() && getLocalStoragePassword()) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('rememberMe').checked = true;
    }
}

/**
 * checkMsg()
 * Checks if there is a message parameter in the URL and displays it on the page.
 */
function checkMsg() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        let msgBox = document.getElementById("msgBox");
        msgBox.classList.remove('d-none');
        msgBox.innerHTML = `<p id="msg">${msg}</p>`;
    }
}

/**
 * chooseAnimation()
 * Chooses an animation based on the window width.
 */
function chooseAnimation() {
    if (window.innerWidth > 600) {
        desktopAnimation();
    } else {
        desktopAnimation();
        mobileAnimation();
    }
}

/**
 * getCredentials()
 * Retrieves the user credentials from the input fields.
 * @returns {Object} An object containing the user credentials.
 */
function getCredentials() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    return {
        name: name,
        email: email,
        password: password
    };
}

/**
 * addUser()
 * Adds a user to the system.
 */
async function addUser() {
    const { name: name, email: email, password: password } = getCredentials();
    if (validateAddUser()) {
        await generateUser();
        clearForm();
        createUserSuccess();
    } else {
        createUserError(password);
    }
}

/**
 * createUserError()
 * Displays an error message for creating a user with an invalid password.
 * @param {string} password - The invalid password.
 */
function createUserError(password) {
    if (!validatePassword(password))
        document.getElementById('passwordPopUp').innerText = "Das Passwort muss aus mindestens 8 Zeichen bestehen, einschließlich einem Sonderzeichen und einem klein- und Großbuchstaben";
}

/**
 * createUserSuccess()
 * Redirects the user to the index page with a success message.
 */
function createUserSuccess() {
    window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';
}

/**
 * generateUser()
 * Generates a new user and adds it to the system.
 */
async function generateUser() {
    users.push(createUser());
    await backend.setItem('users', JSON.stringify(users));
}

/**
 * createUser()
 * Creates a new user object based on the input fields.
 * @returns {Object} A new user object.
 */
function createUser() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    return {
        name: name.value,
        email: email.value,
        password: password.value,
        color: getRandomColor()
    };
}

/**
 * clearForm()
 * Clears the values of the input fields in the form.
 */
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

/**
 * validateAddUser()
 * Validates the input fields for adding a new user.
 * @returns {boolean} True if all input fields are valid, false otherwise.
 */
function validateAddUser() {
    const { name: name, email: email, password: password } = getCredentials();
    return validateUsername(name.value) &&
        validateEmail(email.value) &&
        validatePassword(password.value);
}

/**
 * getEmailAndPassword()
 * Retrieves the email and password from the input fields.
 * @returns {Object} An object containing the email and password.
 */
function getEmailAndPassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    return {
        email: email,
        password: password
    };
}

/**
 * login()
 * Performs the login operation.
 */
async function login() {
    const loginData = getEmailAndPassword();
    let user = users.find(user => user.email == loginData.email && user.password == loginData.password);

    if (user) {
        await generateCurrentUser(user);
        redirectToSummary();
        setRememberMe();
    }
    else wrongLogin.innerHTML = 'Login oder Passwort ungültig';
}

/**
 * generateCurrentUser()
 * Generates the current user based on the provided user information.
 * @param {Object} user - The user object containing the user information.
 */
async function generateCurrentUser(user) {
    const loginData = getEmailAndPassword();
    let name = user.name;
    let color = user.color;
    let stringToSplit = name.split(" ");
    let seperatedLetters = stringToSplit.map(word => word[0]);
    let combinedLetters = seperatedLetters.join("");
    currentUser = {
        name: user.name,
        email: loginData.email,
        password: loginData.password,
        initials: combinedLetters,
        color: color,
        contacts: contactList
    };
    await backend.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('greetingLoaded', 'false');
}

/**
 * guestLogin()
 * Performs a guest login by setting up a guest account.
 */
async function guestLogin() {
    await setGuestAccount();
    redirectToSummary();
}

/**
 * setGuestAccount()
 * Sets up a guest account for the current user.
 */
async function setGuestAccount() {
    let guestName = "Dear Guest";
    let stringToSplit = guestName.split(" ");
    let seperatedLetters = stringToSplit.map(word => word[0]);
    let combinedLetters = seperatedLetters.join("");
    currentUser = {
        name: guestName,
        email: "guest",
        password: "",
        initials: combinedLetters,
        color: '#2AAAE2',
        contacts: contactList
    };
    localStorage.setItem('greetingLoaded', 'false');
    await backend.setItem('currentUser', JSON.stringify(currentUser));
}

/**
 * onSubmit()
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
async function onSubmit(event) {
    event.preventDefault();
    await getUserData();
    let formData = new FormData(event.target);
    let response = await action(formData);
    checkIfUserExists(response);
}

/**
 * checkIfUserExists()
 * Checks if the user exists based on the response and performs corresponding animations.
 * @param {any} response - The response received from an action.
 */
function checkIfUserExists(repsonse) {
    let checkMail = document.getElementById('email').value;
    let user = users.find(user => user.email == checkMail);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        confirmAnimation();
    } else {
        errorAnimation();
    }
}

/**
 * action()
 * Performs an action using the provided form data.
 * @param {FormData} formData - The form data to be used in the action.
 * @returns {Promise} - A promise representing the action.
 */
function action(formData) {
    const input = 'https://gruppenarbeit-join-455.developerakademie.net/send_mail.php';
    const requestInit = {
        method: 'post',
        body: formData
    };
    return fetch(input, requestInit);
}

/**
 * onPageLoad()
 * Handles actions to be performed when the page loads.
 */
async function onPageLoad() {
    email = getEmailUrlParameter();
    users = await getUserData();
}

/**
 * getEmailUrlParameter()
 * Retrieves the value of the "email" parameter from the URL query string.
 * @returns {string|null} - The value of the "email" parameter or null if it doesn't exist.
 */
function getEmailUrlParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    return email;
}

/**
 * getPasswords()
 * Retrieves the values of the "setPassword" and "confirmPassword" input fields.
 * @returns {Object} - An object containing the values of the "setPassword" and "confirmPassword" fields.
 */
function getPasswords() {
    const setPassword = document.getElementById('setPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    return {
        setPassword: setPassword,
        confirmPassword: confirmPassword
    };
}

/**
 * changePassword()
 * Changes the password for the reset user.
 * It retrieves the passwords from the input fields, validates them,
 * updates the password for the reset user, updates the users array,
 * and redirects to the index page.
 */
async function changePassword() {
    const passwords = getPasswords();
    let resetUser = getResetUserFromLocalStorage();

    if (arePasswordsMatching(passwords.setPassword, passwords.confirmPassword)) {
        updatePassword(resetUser, passwords.confirmPassword);
        updateUsersArray();
        redirectToIndex();
    }
}

/**
 * updateUsersArray()
 * Updates the users array with the updated reset user.
 * It retrieves the user data, finds the user with the matching email,
 * updates the users array with the updated reset user, and saves the updated users array to the backend.
 */
async function updateUsersArray() {
    await getUserData();
    let user = users.find(user => user.email == resetUser.email);
    if (user) {
        let index = users.indexOf(user);
        users.splice(index, 1, resetUser);
        await backend.setItem('users', JSON.stringify(users));
    }
}

/**
 * redirectToSummary()
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
    window.location.href = '../summary/summary.html';
}

/**
 * redirectToIndex()
 * Redirects the user to the index page.
 */
function redirectToIndex() {
    window.location.href = './index.html';
}

/**
 * getResetUserFromLocalStorage()
 * Retrieves the reset user from the local storage.
 * It retrieves the stored user data from the local storage
 * and parses it to convert it back to an object.
 * @returns {object} - The reset user object retrieved from the local storage.
 */
function getResetUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    return JSON.parse(storedUser);
}

/**
 * updatePassword()
 * Updates the password of the specified user.
 * @param {object} user - The user object to update.
 * @param {string} newPassword - The new password to set.
 */
function updatePassword(user, newPassword) {
    user.password = newPassword;
}

/**
 * arePasswordsMatching()
 * Checks if the given password and confirm password match.
 * @param {string} password - The password to compare.
 * @param {string} confirmPassword - The confirm password to compare.
 * @returns {boolean} - True if the passwords match, false otherwise.
 */
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * setRememberMe()
 * Sets the remember me data in the local storage.
 * It stores the email and password of the current user in the local storage.
 */
function setRememberMe() {
    localStorage.setItem('currentUser-email', currentUser.email);
    localStorage.setItem('currentUser-password', currentUser.password);
}

/**
 * getLocalStorageEmail()
 * Retrieves the email stored in the local storage for the current user.
 * @returns {string} - The email of the current user retrieved from the local storage.
 */
function getLocalStorageEmail() {
    return localStorage.getItem('currentUser-email');
}

/**
 * getLocalStoragePassword()
 * Retrieves the password stored in the local storage for the current user.
 * @returns {string} - The password of the current user retrieved from the local storage.
 */
function getLocalStoragePassword() {
    return localStorage.getItem('currentUser-password');
}

/**
 * validateUsername()
 * Validates the username to ensure it contains only alphabetic characters and an optional space.
 * @param {string} username - The username to be validated.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function validateUsername(username) {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
    return regex.test(username);
}

/**
 * validateEmail()
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * validatePassword()
 * Validates a password using a regular expression.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
}