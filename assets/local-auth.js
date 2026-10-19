(() => {
  const USERS_KEY = 'bharatRoleplayUsers';
  const SESSION_KEY = 'bharatRoleplaySession';
  const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; } };
  const saveUsers = users => localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const hash = async value => {
    if (window.crypto && crypto.subtle) {
      const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
      return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
    }
    return value;
  };
  const currentUser = () => {
    const name = localStorage.getItem(SESSION_KEY);
    if (!name) return null;
    return readUsers()[name.toLowerCase()] || null;
  };
  const status = (message, error=false) => {
    const el = document.querySelector('#auth-status');
    if (el) { el.textContent = message; el.style.borderColor = error ? '#d9534f' : ''; }
  };

  const form = document.querySelector('#account-form');
  if (form) {
    let mode = 'login';
    const loginTab = document.querySelector('#login-tab');
    const signupTab = document.querySelector('#signup-tab');
    const confirmWrap = document.querySelector('#confirm-wrap');
    const password = document.querySelector('#password');
    const confirm = document.querySelector('#confirm-password');
    const submit = document.querySelector('#submit-account');
    const setMode = next => {
      mode = next;
      confirmWrap.hidden = mode !== 'signup';
      confirm.required = mode === 'signup';
      password.autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
      submit.textContent = mode === 'signup' ? 'Create Account' : 'Log In';
      loginTab.className = mode === 'login' ? 'button-primary' : 'button-outline';
      signupTab.className = mode === 'signup' ? 'button-primary' : 'button-outline';
      status(mode === 'signup' ? 'Create a username and password for this browser.' : 'Log in with your saved username and password.');
    };
    loginTab.addEventListener('click', () => setMode('login'));
    signupTab.addEventListener('click', () => setMode('signup'));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const username = document.querySelector('#username').value.trim();
      const key = username.toLowerCase();
      const pass = password.value;
      if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) return status('Username must be 3–24 characters and use only letters, numbers, or underscores.', true);
      if (pass.length < 8) return status('Password must be at least 8 characters.', true);
      const users = readUsers();
      if (mode === 'signup') {
        if (users[key]) return status('That username already exists in this browser.', true);
        if (pass !== confirm.value) return status('Passwords do not match.', true);
        users[key] = { username, passwordHash: await hash(pass), nickname: username, bio: '', role: 'Citizen' };
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, key);
        status('Account created. Opening your profile…');
        location.href = 'profile.html';
      } else {
        const user = users[key];
        if (!user || user.passwordHash !== await hash(pass)) return status('Incorrect username or password, or this account has not been created in this browser.', true);
        localStorage.setItem(SESSION_KEY, key);
        status('Login successful. Opening your profile…');
        location.href = 'profile.html';
      }
    });
  }

  const signedIn = document.querySelector('#signed-in');
  if (signedIn) {
    const user = currentUser();
    const signedOut = document.querySelector('#signed-out');
    if (!user) {
      signedOut.hidden = false;
      signedIn.hidden = true;
    } else {
      signedOut.hidden = true;
      signedIn.hidden = false;
      const name = document.querySelector('#profile-name');
      const username = document.querySelector('#profile-username');
      const role = document.querySelector('#profile-role');
      const nickname = document.querySelector('#nickname');
      const bio = document.querySelector('#bio');
      const form = document.querySelector('#profile-form');
      name.textContent = user.nickname || user.username;
      username.textContent = '@' + user.username;
      role.textContent = user.role || 'Citizen';
      nickname.value = user.nickname || user.username;
      bio.value = user.bio || '';
      document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEY);
        location.href = 'login.html';
      });
      form.addEventListener('submit', event => {
        event.preventDefault();
        const users = readUsers();
        const key = user.username.toLowerCase();
        users[key].nickname = nickname.value.trim() || user.username;
        users[key].bio = bio.value.trim();
        saveUsers(users);
        name.textContent = users[key].nickname;
        document.querySelector('#profile-status').textContent = 'Profile saved in this browser.';
      });
    }
  }
})();