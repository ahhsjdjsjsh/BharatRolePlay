(() => {
  const KEY = 'bharatRoleplayAccountsV1';
  const SESSION = 'bharatRoleplaySessionV1';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const accounts = () => read(KEY, {});
  const current = () => { const name = sessionStorage.getItem(SESSION); return name ? accounts()[name] || null : null; };
  const status = document.querySelector('[data-auth-status]');
  const say = message => { if (status) status.textContent = message; };
  const loginForm = document.querySelector('[data-login-form]');
  const toggle = document.querySelector('[data-toggle-auth]');
  const confirmWrap = document.querySelector('[data-confirm-wrap]');
  const heading = document.querySelector('[data-auth-heading]');
  const submit = document.querySelector('[data-submit-auth]');
  let signup = false;
  if (toggle) toggle.addEventListener('click', () => {
    signup = !signup;
    if (confirmWrap) confirmWrap.hidden = !signup;
    if (heading) heading.textContent = signup ? 'Create account' : 'Welcome back';
    if (submit) submit.textContent = signup ? 'Sign up' : 'Sign in';
    toggle.textContent = signup ? 'I already have an account' : 'Create an account';
    const pass = loginForm?.elements.password; if (pass) pass.autocomplete = signup ? 'new-password' : 'current-password';
    say(signup ? 'Choose a unique username and password.' : 'Enter your username and password.');
  });
  if (loginForm) loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = loginForm.elements.username.value.trim();
    const password = loginForm.elements.password.value;
    const all = accounts();
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(name)) return say('Username must be 3–24 characters: letters, numbers or underscores.');
    if (password.length < 6) return say('Password must be at least 6 characters.');
    if (signup) {
      if (all[name]) return say('That username already exists in this browser.');
      if (password !== loginForm.elements.confirmPassword.value) return say('Passwords do not match.');
      all[name] = { username: name, password, nickname: name, bio: '', role: 'Citizen' };
      write(KEY, all);
      sessionStorage.setItem(SESSION, name);
      say('Account created. Opening your profile…');
    } else {
      if (!all[name] || all[name].password !== password) return say('Incorrect username or password, or account not found in this browser.');
      sessionStorage.setItem(SESSION, name);
      say('Signed in. Opening your profile…');
    }
    location.href = 'profile.html';
  });
  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => { sessionStorage.removeItem(SESSION); location.href = 'login.html'; }));
  const profileBox = document.querySelector('[data-profile-box]');
  const profileForm = document.querySelector('[data-profile-form]');
  const nick = document.querySelector('[data-profile-nickname]');
  const bio = document.querySelector('[data-profile-bio]');
  const user = current();
  if (profileBox || profileForm) {
    if (!user) {
      if (profileBox) profileBox.hidden = true;
      if (profileForm) profileForm.hidden = true;
      say('Sign in first to view and edit your profile.');
    } else {
      if (profileBox) profileBox.hidden = false;
      if (profileForm) profileForm.hidden = false;
      const el = document.querySelector('[data-profile-name]'); if (el) el.textContent = user.nickname || user.username;
      const email = document.querySelector('[data-profile-email]'); if (email) email.textContent = '@' + user.username;
      const avatar = document.querySelector('[data-profile-avatar]'); if (avatar) avatar.src = 'assets/city-background.svg';
      const role = document.querySelector('[data-profile-role]'); if (role) role.textContent = user.role || 'Citizen';
      if (nick) nick.value = user.nickname || user.username;
      if (bio) bio.value = user.bio || '';
      say('Signed in as ' + user.username + '.');
      if (profileForm) profileForm.addEventListener('submit', event => {
        event.preventDefault(); const all = accounts(); const active = sessionStorage.getItem(SESSION);
        if (!all[active]) return say('Session expired. Please sign in again.');
        all[active].nickname = (nick?.value || active).trim().slice(0, 32);
        all[active].bio = (bio?.value || '').trim().slice(0, 240);
        write(KEY, all);
        const nameEl = document.querySelector('[data-profile-name]'); if (nameEl) nameEl.textContent = all[active].nickname;
        say('Profile saved in this browser.');
      });
    }
  }
})();
