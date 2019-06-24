// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
  input: 'src/app.js',
  output: {
		name: 'bundle.js',
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    svelte({
      include: ['src/*.svelte', 'src/*.html'],
    }),
    resolve()
  ]
}