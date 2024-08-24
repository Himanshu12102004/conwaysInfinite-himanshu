import GlobalVariables from './globalVariables.js';
const signHead = document.querySelector('.signHead') as HTMLDivElement;
const signInUpBtn = document.querySelector('.signInUpBtn') as HTMLDivElement;
const btn = document.querySelector('.signUpInMode')!;
const bottomLine = document.querySelector('.bottomLine') as HTMLDivElement;
const loadingInSign = document.querySelector(
  '.loadingInSignUp'
) as HTMLDivElement;
const blur = document.querySelector('.blur') as HTMLDivElement;
const contributeDialogueBox = document.querySelector(
  '.contributeDialogueBox'
)! as HTMLDivElement;
let signUpMode = true;
function toSignUp() {
  blur.style.display = 'block';
  contributeDialogueBox.style.display = 'none';
  (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex = '-1';
  configure();
  (
    document.querySelector('.signupLoginForm')! as HTMLDivElement
  ).style.display = 'flex';
}
document.querySelector('.signupFirst')?.addEventListener('click', () => {
  toSignUp();
});

function configure() {
  if (signUpMode) {
    signHead.innerHTML = 'Sign Up';
    signInUpBtn.innerHTML = 'Sign Up';
    bottomLine.innerHTML = `Aleready registered?`;
    btn.innerHTML = 'Sign In';
  } else {
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
signInUpBtn.addEventListener('click', async () => {
  const username = (document.querySelector('.username') as HTMLInputElement)
    .value;
  const password = (document.querySelector('.password') as HTMLInputElement)
    .value;
  let usrErr = document.querySelector('.usernameErr') as HTMLDivElement;
  if (!username) {
    usrErr.innerHTML = "Username can't be empty";
    usrErr.style.display = 'block';
    return;
  } else {
    usrErr.style.display = 'none';
  }
  let passErr = document.querySelector('.passwordErr') as HTMLDivElement;
  if (!password) {
    passErr.innerHTML = "Password can't be empty";
    passErr.style.display = 'block';
    return;
  } else {
    passErr.style.display = 'none';
  }
  if (signUpMode) {
    loadingInSign.style.display = 'flex';
    const res = await fetch(`${GlobalVariables.backendUrl}/signup`, {
      method: 'POST',
      body: JSON.stringify({ name: username, password: password }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const response = await res.json();
    loadingInSign.style.display = 'none';
    if (!response.success) {
      usrErr.innerHTML = 'Username already exists';
      usrErr.style.display = 'block';
      return;
    } else {
      usrErr.style.display = 'none';
    }
    localStorage.setItem('token', response.responseMessage.token);
    (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex =
      '-1';
    (
      document.querySelector('.signupLoginForm')! as HTMLDivElement
    ).style.display = 'none';
    blur.style.display = 'none';
  } else {
    loadingInSign.style.display = 'flex';
    const res = await fetch(`${GlobalVariables.backendUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({ name: username, password: password }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const response = await res.json();
    loadingInSign.style.display = 'none';
    if (!response.success) {
      usrErr.innerHTML = 'Wrong username or password';
      usrErr.style.display = 'block';
      return;
    } else {
      usrErr.style.display = 'none';
    }
    localStorage.setItem('token', response.responseMessage.token);
    (document.querySelector('.frontend')! as HTMLDivElement).style.zIndex =
      '-1';
    (
      document.querySelector('.signupLoginForm')! as HTMLDivElement
    ).style.display = 'none';
    blur.style.display = 'none';
  }
});
document
  .querySelector('.contributeBtn')
  ?.addEventListener('click', async () => {
    loadingInSign.style.display = 'flex';
    const res = await fetch(`${GlobalVariables.backendUrl}/isLoggedIn`, {
      headers: { authorization: `Brarer ${localStorage.getItem('token')}` },
    });
    const response = await res.json();
    loadingInSign.style.display = 'none';
    blur.style.display = 'block';
    let signupFirstToContribute = document.querySelector(
      '.signupFirstToContribute'
    ) as HTMLDivElement;
    let contributionForm = document.querySelector(
      '.contributionForm'
    ) as HTMLDivElement;

    if (!response.success) {
      signupFirstToContribute.style.display = 'flex';
      contributionForm.style.display = 'none';
    } else {
      signupFirstToContribute.style.display = 'none';
      contributionForm.style.display = 'flex';
    }
    contributeDialogueBox.style.display = 'flex';
  });
document
  .querySelector('.signupFirstBtnToContribute')
  ?.addEventListener('click', () => {
    toSignUp();
  });
document
  .querySelector('.closeContributeDialogueBox')
  ?.addEventListener('click', () => {
    contributeDialogueBox.style.display = 'none';
    blur.style.display = 'none';
  });
document
  .querySelector('.publishPattern')
  ?.addEventListener('click', async () => {
    const patternName = (
      document.querySelector('.namePattern') as HTMLInputElement
    ).value;
    const description = (
      document.querySelector('#description') as HTMLTextAreaElement
    ).value;
    const nameErr = document.querySelector('.nameErr') as HTMLDivElement;
    const descriptionErr = document.querySelector(
      '.descriptionErr'
    ) as HTMLDivElement;
    if (!patternName) {
      nameErr.innerHTML = "Pattern name can't be empty";
      nameErr.style.display = 'block';
      return;
    } else {
      nameErr.style.display = 'none';
    }
    if (!description) {
      descriptionErr.innerHTML = "Description can't be empty";
      descriptionErr.style.display = 'block';
      return;
    } else {
      descriptionErr.style.display = 'none';
    }
    loadingInSign.style.display = 'flex';

    const res = await fetch(`${GlobalVariables.backendUrl}/contribute`, {
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
    const response = await res.json();
    loadingInSign.style.display = 'none';
    let pub = document.querySelector('.published') as HTMLDivElement;

    if (response.success) {
      pub.style.display = 'flex';
      blur.style.display = 'none';
      setTimeout(() => {
        pub.style.display = 'none';
      }, 500);
      contributeDialogueBox.style.display = 'none';
    } else {
      if (
        response.responseMessage.errMessage[0].message == 'nameAlreadyExist'
      ) {
        nameErr.innerHTML = 'Pattern of this name already exists';
        nameErr.style.display = 'block';
      }
      if (
        response.responseMessage.errMessage[0].message == 'descriptionTooLong'
      ) {
        descriptionErr.innerHTML = 'description too long';
        descriptionErr.style.display = 'block';
      }
    }
  });
