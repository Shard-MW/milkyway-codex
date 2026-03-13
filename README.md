# MilkyWay Codex

An open-source documentation webapp for the **World of Warcraft 3.3.5a** (Wrath of the Lich King) modding community. Browse and search the complete Lua API, events, widgets, data types, CVars, and secure templates extracted from client build 12340.

Built to give addon developers and modders a fast, searchable, and always-available reference — no more digging through outdated wikis or broken archive links.

## Features

- **2,067 API Functions** — full signatures, parameters, return values, and code examples
- **558 Events** — game events with payload parameters and categories
- **38 Widget Types** — methods, inheritance chains, and script handlers
- **449 Console Variables** — CVars with default values and descriptions
- **33 Data Types** — enums and constants used across the API
- **14 Secure Templates** — secure frame templates and attributes
- **Instant Search** — search across all categories from the home page
- **Virtualized Lists** — smooth scrolling through thousands of entries
- **Category Filters** — filter by category, protection status, and more
- **Cross-References** — linked related functions, events, and data types

## Tech Stack

| Component       | Technology                          |
| --------------- | ----------------------------------- |
| Framework       | React 19, TypeScript (strict), Vite |
| Styling         | styled-components 6                 |
| Routing         | React Router v7                     |
| Virtualization  | react-window                        |
| Icons           | lucide-react                        |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Type-check + production build|
| `npm run lint`     | Run ESLint                   |
| `npm run preview`  | Preview production build     |

## Project Structure

```
src/
├── components/
│   ├── Layout/         # App shell, sidebar navigation
│   └── shared/         # Reusable UI (SearchBar, DataTable, Tag, etc.)
├── features/
│   ├── home/           # Landing page with global search
│   ├── api/            # API functions list + detail
│   ├── events/         # Events list + detail
│   ├── widgets/        # Widgets list + detail
│   └── data-types/     # Data types reference
├── data/               # All reference data (static TypeScript)
├── hooks/              # Shared React hooks
├── theme/              # Design tokens (colors, fonts, radii)
├── styles/             # Global styles
└── types/              # Shared TypeScript interfaces
```

## Data Sources

All data was scraped from archived snapshots of [WoWProgramming.com](https://web.archive.org/web/2010/http://wowprogramming.com/docs) (pre-Cataclysm, before October 12, 2010) and supplemented with data from [Warcraft Wiki](https://warcraft.wiki.gg) and [Wowpedia](https://wowpedia.fandom.com). Memory addresses and internal function mappings were obtained through reverse engineering of the WoW 3.3.5a client (build 12340). No external API calls are made at runtime — everything is statically bundled.

## Contributing

Contributions are welcome! If you find missing or incorrect data, feel free to open an issue or submit a pull request.

## License

MIT — use it, fork it, build on it. This project exists to help the WoW modding community.
