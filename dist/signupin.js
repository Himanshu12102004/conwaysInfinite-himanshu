var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e;
import GlobalVariables from './globalVariables.js';
const signHead = document.querySelector('.signHead');
const signInUpBtn = document.querySelector('.signInUpBtn');
const btn = document.querySelector('.signUpInMode');
const bottomLine = document.querySelector('.bottomLine');
const loadingInSign = document.querySelector('.loadingInSignUp');
const blur = document.querySelector('.blur');
const contributeDialogueBox = document.querySelector('.contributeDialogueBox');
let signUpMode = true;
function toSignUp() {
    blur.style.display = 'block';
    contributeDialogueBox.style.display = 'none';
    document.querySelector('.frontend').style.zIndex = '-1';
    configure();
    document.querySelector('.signupLoginForm').style.display = 'flex';
}
(_a = document.querySelector('.signupFirst')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    toSignUp();
});
function configure() {
    if (signUpMode) {
        signHead.innerHTML = 'Sign Up';
        signInUpBtn.innerHTML = 'Sign Up';
        bottomLine.innerHTML = `Aleready registered?`;
        btn.innerHTML = 'Sign In';
    }
    else {
        signHead.innerHTML = 'Sign In';
        signInUpBtn.innerHTML = 'Sign In';
        bottomLine.innerHTML = `Not registered?`;
        btn.innerHTML = 'Sign Up';
    }
}
btn.addEventListener('click', () => {
    signUpMode = !signUpMode;
    console.log(signUpMode);
    configure();
});
signInUpBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const username = document.querySelector('.username')
        .value;
    const password = document.querySelector('.password')
        .value;
    let usrErr = document.querySelector('.usernameErr');
    if (!username) {
        usrErr.innerHTML = "Username can't be empty";
        usrErr.style.display = 'block';
        return;
    }
    else {
        usrErr.style.display = 'none';
    }
    let passErr = document.querySelector('.passwordErr');
    if (!password) {
        passErr.innerHTML = "Password can't be empty";
        passErr.style.display = 'block';
        return;
    }
    else {
        passErr.style.display = 'none';
    }
    if (signUpMode) {
        loadingInSign.style.display = 'flex';
        const res = yield fetch(`${GlobalVariables.backendUrl}/signup`, {
            method: 'POST',
            body: JSON.stringify({ name: username, password: password }),
            headers: {
                'Content-type': 'application/json',
            },
        });
        const response = yield res.json();
        loadingInSign.style.display = 'none';
        if (!response.success) {
            usrErr.innerHTML = 'Username already exists';
            usrErr.style.display = 'block';
            return;
        }
        else {
            usrErr.style.display = 'none';
        }
        localStorage.setItem('token', response.responseMessage.token);
        document.querySelector('.frontend').style.zIndex =
            '-1';
        document.querySelector('.signupLoginForm').style.display = 'none';
        blur.style.display = 'none';
    }
    else {
        loadingInSign.style.display = 'flex';
        const res = yield fetch(`${GlobalVariables.backendUrl}/login`, {
            method: 'POST',
            body: JSON.stringify({ name: username, password: password }),
            headers: {
                'Content-type': 'application/json',
            },
        });
        const response = yield res.json();
        loadingInSign.style.display = 'none';
        if (!response.success) {
            usrErr.innerHTML = 'Wrong username or password';
            usrErr.style.display = 'block';
            return;
        }
        else {
            usrErr.style.display = 'none';
        }
        localStorage.setItem('token', response.responseMessage.token);
        document.querySelector('.frontend').style.zIndex =
            '-1';
        document.querySelector('.signupLoginForm').style.display = 'none';
        blur.style.display = 'none';
    }
}));
(_b = document
    .querySelector('.contributeBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    loadingInSign.style.display = 'flex';
    const res = yield fetch(`${GlobalVariables.backendUrl}/isLoggedIn`, {
        headers: { authorization: `Brarer ${localStorage.getItem('token')}` },
    });
    const response = yield res.json();
    loadingInSign.style.display = 'none';
    blur.style.display = 'block';
    let signupFirstToContribute = document.querySelector('.signupFirstToContribute');
    let contributionForm = document.querySelector('.contributionForm');
    if (!response.success) {
        signupFirstToContribute.style.display = 'flex';
        contributionForm.style.display = 'none';
    }
    else {
        signupFirstToContribute.style.display = 'none';
        contributionForm.style.display = 'flex';
    }
    contributeDialogueBox.style.display = 'flex';
}));
(_c = document
    .querySelector('.signupFirstBtnToContribute')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    toSignUp();
});
(_d = document
    .querySelector('.closeContributeDialogueBox')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
    contributeDialogueBox.style.display = 'none';
    blur.style.display = 'none';
});
(_e = document
    .querySelector('.publishPattern')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const patternName = document.querySelector('.namePattern').value;
    const description = document.querySelector('#description').value;
    const nameErr = document.querySelector('.nameErr');
    const descriptionErr = document.querySelector('.descriptionErr');
    if (!patternName) {
        nameErr.innerHTML = "Pattern name can't be empty";
        nameErr.style.display = 'block';
        return;
    }
    else {
        nameErr.style.display = 'none';
    }
    if (!description) {
        descriptionErr.innerHTML = "Description can't be empty";
        descriptionErr.style.display = 'block';
        return;
    }
    else {
        descriptionErr.style.display = 'none';
    }
    loadingInSign.style.display = 'flex';
    const res = yield fetch(`${GlobalVariables.backendUrl}/contribute`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            grid: Array.from(GlobalVariables.liveCells),
            description: description,
            name: patternName,
        }),
    });
    const response = yield res.json();
    loadingInSign.style.display = 'none';
    let pub = document.querySelector('.published');
    if (response.success) {
        pub.style.display = 'flex';
        blur.style.display = 'none';
        setTimeout(() => {
            pub.style.display = 'none';
        }, 500);
        contributeDialogueBox.style.display = 'none';
    }
    else {
        if (response.responseMessage.errMessage[0].message == 'nameAlreadyExist') {
            nameErr.innerHTML = 'Pattern of this name already exists';
            nameErr.style.display = 'block';
        }
        if (response.responseMessage.errMessage[0].message == 'descriptionTooLong') {
            descriptionErr.innerHTML = 'description too long';
            descriptionErr.style.display = 'block';
        }
    }
}));
