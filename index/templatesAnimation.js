// Function to show a successful operation animation, used when an email has been sent.
function confirmAnimation() {
    document.getElementById('forgotPwContainer').classList.add('zero-opacity');
    document.getElementById('emailSentAnimation').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('emailSentAnimation').classList.add('animateEmailSent');
    }, 50);
    setTimeout(() => {
        document.getElementById('forgotPwContainer').classList.remove('zero-opacity');
        document.getElementById('emailSentAnimation').classList.add('d-none');
    }, 4500);
}

// Function to show an error animation, used when an email doesn't match any user record.
function errorAnimation() {
    document.getElementById('forgotPwContainer').classList.add('zero-opacity');
    document.getElementById('forgotPwText').innerText = 'No user registered with this email';
    document.getElementById('emailSentAnimation').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('emailSentAnimation').classList.add('animateEmailSent');
    }, 50);
    setTimeout(() => {
        document.getElementById('forgotPwContainer').classList.remove('zero-opacity');
        document.getElementById('emailSentAnimation').classList.add('d-none');
    }, 4500);
}

// Function to render the password reset page.
function renderForgotPw() {
    document.body.innerHTML = forgotPwTemplate();
}

// Function to render the sign-up page.
function renderSignUp() {
    document.body.innerHTML = signUpTemplate();
}

// Template function to return the HTML for the password reset page.
function forgotPwTemplate() {
    return `
    <div id="headpart">
    <a href="./index.html"> <img id="desktopLogo" src="./assets/img/join_logo.svg"
    alt="" /></a>
    </div>
    <div id="container">
        <main id="forgotPwContainer">
            <a href="./index.html" class="backBtn">
                <img src="./assets/img/arrow_back.png" alt="" />
            </a>
            <div id="headlineContainer">
            <div id="pw" class="h1">I forgot my password</div>
            <div id="borderBottom"></div>
        </div>
            <p>
                Don't worry! We will send you an email with the instructions to
                reset your password.
            </p>
            <form onsubmit="onSubmit(event);false">
                <input id="email" required name="email" type="email" placeholder="Email" />
                <button type="submit" class="buttonGlobal1">Send me the email</button>
            </form>
        </main>
        <div id="emailSentAnimation" class="d-none">
        <img src="./assets/img/SendCheck.png" alt="">
       <span id="forgotPwText"> An E-Mail has been sent to you </span>
       <div id="emailOverlay"></div>
    </div>
</div>
    `;
}

// Template function to return the HTML for the sign-up page.
function signUpTemplate() {
    return `
    <div id="headpart">
    <a href="./index.html"> <img id="desktopLogo" src="./assets/img/join_logo.svg"
    alt="" /></a>
    </div>
    <div id="container">
        <main id="signUpContainer">
           <div id="backBtnHeadlineContainer">
            <a href="./index.html" class="backBtn"><img src="./assets/img/arrow_back.png" alt="" /></a>
            <div id="headlineContainer">
            <div class="h1">Sign up</div>
            <div id="borderBottom"></div>
        </div>
        </div>
            <form id="signUpForm" onsubmit="addUser(); return false">
                <input id="name" required type="text" placeholder="Name" />
                <span id="namePopUp"></span>
                <input id="email" required type="email" placeholder="Email" />
                <span id="emailPopUp"></span>
                <input id="password" required type="password" placeholder="Password" />
                <span id="passwordPopUp"></span>
                <button class="buttonGlobal1">Sign up</button>
            </form>
        </main>
    </div>
`;
}

// Function to handle mobile-specific animations, hiding unnecessary elements and triggering the required animations.
function mobileAnimation() {
    document.getElementById('introAnimationContainer').classList.add('d-none');
    document.getElementById('mobileAnimationContainer').classList.add('mobileContainerAnimation');
    document.getElementById('mobileLogo').classList.add('mobileLogoAnimation');
    document.getElementById('blackLogo').classList.add('blackLogoAnimation');
    setTimeout(() => {
        document.getElementById('mobileAnimationContainer').classList.add('z-index');
        document.getElementById('blackLogoAnimationContainer').classList.add('z-index');
    }, 800);
}

// Function to handle desktop-specific animations, hiding unnecessary elements, revealing the login container, and triggering the required animations.
function desktopAnimation() {
    document.getElementById('introAnimationContainer').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById("introAnimationContainer").classList.add("introAnimation");
        document.getElementById("loginContainer").classList.remove("d-none");
        document.getElementById('headpartRightSideContainer').classList.remove('zero-opacity');
    }, 800);

}

// Function to handle the case where no desktop-specific animations are required, but the login container and header need to be revealed.
function desktopNoAnimation() {
    document.getElementById("loginContainer").classList.remove("d-none");
    document.getElementById('headpartRightSideContainer').classList.remove('zero-opacity');
}