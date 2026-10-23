// Build home.css after changing classes in index.html:
//   npx tailwindcss@3.4.16 -i home.src.css -o home.css --minify
module.exports = {
  darkMode: 'class',
  content: ['./index.html'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } } }
}
