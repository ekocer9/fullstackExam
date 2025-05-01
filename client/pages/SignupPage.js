import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { handleSignup } from '../js/auth.js';

export function SignupPage(app) {
  app.innerHTML = `
    ${Navbar()}
    <h1>Signup</h1>
    <form id="signupForm">
      <input type="email" placeholder="Email" id="email" required />
      <input type="password" placeholder="Password" id="password" required />
      <button type="submit">Signup</button>
    </form>
    ${Footer()}
  `;

  const form = document.getElementById('signupForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignup(form);
  });
}
