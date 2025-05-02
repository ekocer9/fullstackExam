export function Footer() {
  const currentYear = new Date().getFullYear();

  return `
    <footer>
      <p>&copy; ${currentYear} Fullstack Exam Project. All rights reserved.</p>
    </footer>
  `;
}
