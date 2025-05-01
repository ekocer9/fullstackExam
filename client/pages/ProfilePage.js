import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiDelete } from "../js/api.js";

export async function ProfilePage(app) {
  const token = localStorage.getItem("token");
  if (!token) {
    app.innerHTML = "<h1>You must be logged in to view your profile</h1>";
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <h1>My Profile</h1>
    <div id="profileInfo"></div>
    <button id="deleteAccount">Delete My Account</button>
    ${Footer()}
  `;

  try {
    const response = await fetch("http://localhost:3000/api/auth/profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized or invalid token");
    }

    const user = await response.json();
    document.getElementById("profileInfo").innerHTML = `
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>User ID:</strong> ${user.id}</p>
    `;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    document.getElementById("profileInfo").innerHTML =
      "<p>Unable to load profile.</p>";
  }

  document
    .getElementById("deleteAccount")
    .addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete your account?"
      );
      if (!confirmDelete) return;

      try {
        await apiDelete("/api/auth/delete", token);
        localStorage.removeItem("token");
        alert("Your account has been deleted.");
        history.pushState(null, "", "/");
        window.dispatchEvent(new Event("popstate"));
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Something went wrong.");
      }
    });
}
