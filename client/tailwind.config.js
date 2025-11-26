/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 💡 Añadir la sección 'colors'
        "marca-primaria": "#1075c2", // Tu azul de marca
        "marca-secundaria": "#33cc33", // Tu verde de marca
        "texto-claro": "#fafafa", // Un color personalizado para texto
        // Puedes definir un gradiente o una escala de color si lo necesitas
        acento: {
          100: "#ffebf3",
          500: "#ff5c8d", // Color principal del acento
          900: "#8c002c",
        },
      },
    },
  },
  plugins: [],
};
