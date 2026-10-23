// Build home.css after changing classes in any page:
//   npx tailwindcss@3.4.16 -i home.src.css -o home.css --minify
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './alarm.html', './reminders.html', './youtube.html', './calendar.html', './product.js'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } } }
}
