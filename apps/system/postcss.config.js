import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

/** Default plugins; explicit imports help Node resolve from the app root reliably. */
export default {
  plugins: [tailwindcss, autoprefixer],
};
