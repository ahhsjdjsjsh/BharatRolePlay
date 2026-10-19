# Bharat Roleplay Website

Static SA-MP community website designed for GitHub Pages.

## Publish on GitHub Pages
1. Upload the contents of this folder to your GitHub repository.
2. In repository Settings → Pages, choose the branch and root folder.
3. Save and open the published site over HTTPS.

## Account system limitation
The username/password login and sign-up demo uses browser `localStorage` for accounts and `sessionStorage` for the active session. No Google login, Firebase SDK, Firebase configuration, or Firestore rules are included. Accounts exist only in the browser that created them; they do not sync between visitors or devices. Passwords are stored in browser storage, so this is only a demo and must not be used for sensitive accounts or real administrator permissions. GitHub Pages is static hosting and does not provide a secure account database or server-side authentication.

## Main files
- `index.html`: home page
- `login.html`: username/password sign in and sign up
- `profile.html`: local profile editor
- `assets/style.css`: site styles
- `assets/script.js`: site interactions
- `assets/auth.js`: browser-local demo authentication and profile logic
