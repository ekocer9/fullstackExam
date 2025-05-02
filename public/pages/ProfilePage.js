import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";
import { apiGet, apiDelete, apiPatch } from "../js/api.js";

export async function ProfilePage(app) {
  const token = localStorage.getItem("token");
  if (!token) {
    app.innerHTML = "<h1>You must be logged in to view your profile</h1>";
    return;
  }

  app.innerHTML = `
    ${Navbar()}
    <div class="profile-container">
      <form id="updateForm" class="profile-update-form">
        <h2>Update Your Profile</h2>

        <label for="email"><strong>Email:</strong></label>
        <input type="email" name="email" id="emailInput" required />

        <label for="password"><strong>New Password:</strong></label>
        <input type="password" name="password" placeholder="Leave blank to keep current" />

        <label for="first_name"><strong>First Name:</strong></label>
        <input type="text" id="first_name" placeholder="First Name" />

        <label for="last_name"><strong>Last Name:</strong></label>
        <input type="text" id="last_name" placeholder="Last Name" />

        <button type="submit">Update Profile</button>
      </form>

      <button id="deleteAccount">Delete My Account</button>
    </div>
    ${Footer()}
  `;

  try {
    const response = await fetch("http://localhost:3000/api/auth/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized or invalid token");
    }

    const user = await response.json();
    document.getElementById("emailInput").value = user.email || "";
    document.getElementById("first_name").value = user.first_name || "";
    document.getElementById("last_name").value = user.last_name || "";

  } catch (error) {
    console.error("Failed to fetch profile:", error);
    alert("Unable to load profile.");
  }

  // Handle profile update
  document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();

    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;

    try {
      await apiPatch("/api/auth/profile", updates, token);
      alert("Profile updated successfully.");
      history.pushState(null, "", "/profile");
      window.dispatchEvent(new Event("popstate"));
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  });

  // Handle account deletion
  document.getElementById("deleteAccount").addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await apiDelete("/api/auth/profile", token);
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
