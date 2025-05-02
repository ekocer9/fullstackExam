export function showToast(message, type = "success", duration = 3000) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
  
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
  
    // Remove after timeout
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => container.removeChild(toast), 300);
    }, duration);
  }
  