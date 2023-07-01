/**
* js/theme.js ...
* Social Authentication theme script ...
*/

const theme = localStorage.getItem('data-theme');
if (theme === "dark" || theme === "light") {
  document.documentElement.setAttribute("data-theme", theme);
} else if (!theme || theme === "os") {
  const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)');
  if (prefersLightScheme.matches === true) document.documentElement.setAttribute("data-theme", "light")
}