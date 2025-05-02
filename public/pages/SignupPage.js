import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { handleSignup } from '../js/auth.js';

export function SignupPage(app) {
  app.innerHTML = `
    ${Navbar()}
    <h1>Sign Up</h1>
    <form id="signupForm">
      <input type="text" id="first_name" placeholder="First Name" required />
      <input type="text" id="last_name" placeholder="Last Name" required />
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
    ${Footer()}
  `;

  document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSignup(e.target);
  });  
}
