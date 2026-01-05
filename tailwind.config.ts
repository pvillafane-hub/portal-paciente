import type { Config } from 'tailwindcss'

const config: Config = {
content: [
 './pages/**/*.{js,ts,jsx,tsx,mdx}',
 './components/**/*.{js,ts,jsx,tsx,mdx}',
 './app/**/*.{js,ts,jsx,tsx,mdx}',
],
theme: {
 extend: {
   fontSize: {
     'base': '1.125rem', // Large base font for accessibility
   },
 },
},
plugins: [],
}
export default config

```typescript
// postcss.config.js
module.exports = {
plugins: {
 tailwindcss: {},
 autoprefixer: {},
},
}