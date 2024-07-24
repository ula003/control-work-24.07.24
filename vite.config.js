import { defineConfig } from 'vite'

export default defineConfig({
	pages: {
		'/about': {
			entry: './src/about.html'
		},
		'/contact': {
			entry: 'src/contact.html'
		}
	}
})