# AeroFly — Project Structure

```
dreamo/              ← this IS your GitHub repo root
├── index.html       ← landing page (home)
├── css/
│   ├── global.css   ← shared tokens, header, nav
│   ├── fly.css      ← flights page styles
│   └── hotel.css    ← hotel page styles
├── js/
│   ├── global.js    ← shared nav behaviour
│   ├── fly.js       ← flights page logic
│   └── hotel.js     ← hotel page logic
└── pages/
    ├── aerofly.html    ← flights results page
    └── aerohotel.html  ← hotel results page
```

## GitHub Pages setup
1. Push all files so `index.html` is at the **repo root** (not inside a subfolder)
2. Go to Settings → Pages → Source: **Deploy from branch**, branch: `main`, folder: `/ (root)`
3. Site will be live at: `https://daydreamofyou1-coder.github.io/dreamo/`
