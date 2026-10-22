# Оферта Хидробетон · v2 (Astro)

```bash
npm install     # първия път
npm run dev     # локално на http://localhost:4321
npm run build   # готов сайт в dist/
```

- `src/pages/index.astro` — подредба на секциите
- `src/components/` — по един файл за всяка секция (Hero, Goals … SignOff)
- `src/components/Visual.astro` — секция 04, екраните от демото се добавят в масива `shots`
- `src/styles/global.css` — всички стилове и цветове на бранда
- `src/scripts/main.js` — интерактивните елементи (табове, карта, FAQ, галерия)
- `public/assets/demo/` — снимките от демото

Хостинг: качете съдържанието на `dist/` в корена на домейн/зона (Bunny, Vercel, Netlify).
`node_modules` е symlink към `node_modules.nosync`, за да не се синхронизира с iCloud.
