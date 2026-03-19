// Local development server — serves the public/ folder
// For production: deploy public/ to Netlify (no server needed)
//
// Run: npm start → http://localhost:3000

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🃏  קלפי רגשות: http://localhost:${PORT}`);
});
