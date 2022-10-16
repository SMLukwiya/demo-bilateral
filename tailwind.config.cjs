/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'green': '#329461',
        'dark-green': "#0b290d",
        'white': '#ffffff',
        'dark-gray': '#191a19',
        'medium-gray': '#919191',
        'light-gray': '#e3e3e3',
        'gray': '#9e9e9e',
        'black': '#000000'
      },
      boxShadow: {
        'active': '0 0 0px 3px rgba(50, 148, 97, 0.75)',
      }
    },
  },
  plugins: [],
}
