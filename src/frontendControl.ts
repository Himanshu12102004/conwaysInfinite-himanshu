import GlobalVariables from './globalVariables.js';
const all = document.querySelector('.allTemplates')! as HTMLDivElement;
const your = document.querySelector('.yourTemplates')! as HTMLDivElement;
let selectedTab = 0;
let templatePage = document.querySelector('.templatePage')! as HTMLDivElement;
let blur = document.querySelector('.blur')! as HTMLDivElement;
let frontend = document.querySelector('.frontend')! as HTMLDivElement;
let search = document.querySelector('.searchBox')! as HTMLInputElement;
let loader = document.querySelector('.loader')! as HTMLDivElement;
let signupFirst = document.querySelector('.signupFirst')! as HTMLDivElement;
let nothingFound = document.querySelector('.nothingFound')! as HTMLDivElement;
let liveCells = document.querySelector('.liveCells')!;
let notContributed = document.querySelector(
  '.notContributed'
)! as HTMLDivElement;
let loaderFullScreen = document.querySelector(
  '.loaderFullScreen'
)! as HTMLDivElement;
document.querySelector('.templates')?.addEventListener('click', async () => {
  templatePage.style.display = 'flex';
  blur.style.display = 'block';
  frontend.style.zIndex = '3';
  searching(search.value);
});
async function searching(search = '') {
  loader.style.display = 'flex';
  signupFirst.style.display = 'none';
  nothingFound.style.display = 'none';
  notContributed.style.display = 'none';
  let content = document.querySelector('.fetchedContent');
  content!.innerHTML = '';
  let your = false;
  if (selectedTab == 1) your = true;
  let res = await fetch(
    `${GlobalVariables.backendUrl}/patterns?search=${search}&your=${your}`,
    {
      method: 'GET',
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
    }
  );
  let response = await res.json();
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
    } else {
      nothingFound.style.display = 'flex';

      notContributed.style.display = 'none';
    }
  }
  response.responseMessage.forEach((elem: any) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.addEventListener('click', (e) => {
      hello(elem.name);
      GlobalVariables.generationCount = 0;
    });
    div?.insertAdjacentHTML(
      'beforeend',
      `<div class="nameAndContri">
              <div class="patternName">${elem.name}</div>
              <div class="contributor">Contributed By: ${elem.contributedBy.name}</div>
            </div>
            <div class ="description">${elem.description}</div>`
    );
    content?.insertAdjacentElement('beforeend', div);
  });
}
async function fetchFrombackend() {
  console.log(getQueryParam('name'));
  (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex = '-1';
  loaderFullScreen.style.display = 'none';
  blur.style.display = 'none';
  if (getQueryParam('name') != null) {
    GlobalVariables.speed=0;
  (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex = '6';
    blur.style.display = 'block';
    loaderFullScreen.style.display = 'flex';
    let res = await fetch(
      `${GlobalVariables.backendUrl}/patterns?name=${getQueryParam('name')!}`,
      {
        method: 'GET',
      }
    );
    let response = await res.json();
    console.log(response);
    GlobalVariables.liveCells = new Set<string>(
      response.responseMessage[0].grid
    );
    GlobalVariables.speed=97;

    liveCells.innerHTML = `${GlobalVariables.liveCells.size} Live Cells`;

    templatePage.style.display = 'none';
    loaderFullScreen.style.display = 'none';
    blur.style.display = 'none';
  (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex = '-1';

  }
}
function hello(name: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('name', name);
  window.history.replaceState({}, '', url.toString());
  fetchFrombackend();
}
function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
fetchFrombackend();
let timeout: any;
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
  } else {
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
document.querySelector('.close')?.addEventListener('click', () => {
  templatePage.style.display = 'none';
  blur.style.display = 'none';
  frontend.style.zIndex = '-1';
});
let help = document.querySelector('.help')! as HTMLDivElement;
document.querySelector('.helpBtn')?.addEventListener('click', () => {
  help.style.display = 'flex';
});
document.querySelector('.closeHelp')?.addEventListener('click', () => {
  help.style.display = 'none';
});
