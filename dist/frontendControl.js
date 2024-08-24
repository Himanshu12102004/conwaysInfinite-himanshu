var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d;
import GlobalVariables from './globalVariables.js';
const all = document.querySelector('.allTemplates');
const your = document.querySelector('.yourTemplates');
let selectedTab = 0;
let templatePage = document.querySelector('.templatePage');
let blur = document.querySelector('.blur');
let frontend = document.querySelector('.frontend');
let search = document.querySelector('.searchBox');
let loader = document.querySelector('.loader');
let signupFirst = document.querySelector('.signupFirst');
let nothingFound = document.querySelector('.nothingFound');
let liveCells = document.querySelector('.liveCells');
let notContributed = document.querySelector('.notContributed');
let loaderFullScreen = document.querySelector('.loaderFullScreen');
(_a = document.querySelector('.templates')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    templatePage.style.display = 'flex';
    blur.style.display = 'block';
    frontend.style.zIndex = '3';
    searching(search.value);
}));
function searching() {
    return __awaiter(this, arguments, void 0, function* (search = '') {
        loader.style.display = 'flex';
        signupFirst.style.display = 'none';
        nothingFound.style.display = 'none';
        notContributed.style.display = 'none';
        let content = document.querySelector('.fetchedContent');
        content.innerHTML = '';
        let your = false;
        if (selectedTab == 1)
            your = true;
        let res = yield fetch(`${GlobalVariables.backendUrl}/patterns?search=${search}&your=${your}`, {
            method: 'GET',
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        let response = yield res.json();
        console.log(response);
        if (!response.success) {
            signupFirst.style.display = 'flex';
            loader.style.display = 'none';
            return;
        }
        loader.style.display = 'none';
        if (response.responseMessage.length == 0) {
            loader.style.display = 'none';
            signupFirst.style.display = 'none';
            if (!search) {
                notContributed.style.display = 'flex';
                nothingFound.style.display = 'none';
            }
            else {
                nothingFound.style.display = 'flex';
                notContributed.style.display = 'none';
            }
        }
        response.responseMessage.forEach((elem) => {
            const div = document.createElement('div');
            div.classList.add('card');
            div.addEventListener('click', (e) => {
                hello(elem.name);
                GlobalVariables.generationCount = 0;
            });
            div === null || div === void 0 ? void 0 : div.insertAdjacentHTML('beforeend', `<div class="nameAndContri">
              <div class="patternName">${elem.name}</div>
              <div class="contributor">Contributed By: ${elem.contributedBy.name}</div>
            </div>
            <div class ="description">${elem.description}</div>`);
            content === null || content === void 0 ? void 0 : content.insertAdjacentElement('beforeend', div);
        });
    });
}
function fetchFrombackend() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(getQueryParam('name'));
        document.querySelector('.frontend').style.zIndex = '-1';
        loaderFullScreen.style.display = 'none';
        blur.style.display = 'none';
        if (getQueryParam('name') != null) {
            GlobalVariables.speed = 0;
            document.querySelector('.frontend').style.zIndex = '6';
            blur.style.display = 'block';
            loaderFullScreen.style.display = 'flex';
            let res = yield fetch(`${GlobalVariables.backendUrl}/patterns?name=${getQueryParam('name')}`, {
                method: 'GET',
            });
            let response = yield res.json();
            console.log(response);
            GlobalVariables.liveCells = new Set(response.responseMessage[0].grid);
            GlobalVariables.speed = 97;
            liveCells.innerHTML = `${GlobalVariables.liveCells.size} Live Cells`;
            templatePage.style.display = 'none';
            loaderFullScreen.style.display = 'none';
            blur.style.display = 'none';
            document.querySelector('.frontend').style.zIndex = '-1';
        }
    });
}
function hello(name) {
    const url = new URL(window.location.href);
    url.searchParams.set('name', name);
    window.history.replaceState({}, '', url.toString());
    fetchFrombackend();
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
fetchFrombackend();
let timeout;
search.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        searching(search.value);
    }, 200);
});
function adjustSelected() {
    if (selectedTab == 1) {
        all.classList.remove('selected');
        your.classList.add('selected');
    }
    else {
        all.classList.add('selected');
        your.classList.remove('selected');
    }
    searching(search.value);
}
all.addEventListener('click', () => {
    selectedTab = 0;
    adjustSelected();
});
your.addEventListener('click', () => {
    selectedTab = 1;
    adjustSelected();
});
(_b = document.querySelector('.close')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    templatePage.style.display = 'none';
    blur.style.display = 'none';
    frontend.style.zIndex = '-1';
});
let help = document.querySelector('.help');
(_c = document.querySelector('.helpBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    help.style.display = 'flex';
});
(_d = document.querySelector('.closeHelp')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
    help.style.display = 'none';
});
