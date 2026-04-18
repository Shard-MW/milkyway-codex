# MilkyWay Codex

An open-source documentation webapp for the **World of Warcraft 3.3.5a** (Wrath of the Lich King) modding community. Browse and search the complete Lua API, events, widgets, data types, CVars, combat log sub-events, and secure templates extracted from the WoW Programming book and client build 12340.

**Live site:** [https://milkyway-codex.vercel.app/](https://milkyway-codex.vercel.app/)

**MCP server:** [https://github.com/suprsokr/milkyway-codex-mcp](https://github.com/suprsokr/milkyway-codex-mcp)

Built to give addon developers and modders a fast, searchable, and always-available reference — no more digging through outdated wikis or broken archive links.

## Features

- **2,140 API Functions** — full signatures, parameters, return values, and code examples
- **558 Events** — game events with payload parameters and categories
- **48 Combat Log Sub-Events** — prefixes, suffixes, spell schools, and argument tables
- **38 Widget Types** — methods, inheritance chains, and script handlers
- **449 Console Variables** — CVars with default values and descriptions
- **33 Data Types** — enums, flags, and constants used across the API
- **14 Secure Templates** — secure frame templates and attributes
- **Reference Book** — embedded PDF viewer for the WoW Programming book (2nd Edition)
- **Instant Search** — search across all categories from the home page
- **Virtualized Lists** — smooth scrolling through thousands of entries
- **Category Filters** — filter by category, protection status, and more
- **Cross-References** — linked related functions, events, and data types
- **Verification Badges** — every entry shows its verification status
- **Dark & Light Themes** — toggle between dark and light mode
- **Contribute Page** — find entries that need documentation or verification

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
│   ├── api/            # Game Functions list + detail
│   ├── events/         # Events list + detail
│   ├── widgets/        # Client Functions (widgets) list + detail
│   ├── combat-log/     # Combat log sub-events reference
│   ├── data-types/     # Data types reference
│   ├── cvars/          # Console variables
│   ├── secure-templates/ # Secure frame templates
│   ├── book/           # Embedded PDF reference book
│   └── contribute/     # Entries needing documentation
├── data/               # All reference data (static TypeScript)
├── hooks/              # Shared React hooks
├── theme/              # Design tokens (colors, fonts, radii)
├── styles/             # Global styles
└── types/              # Shared TypeScript interfaces
```

## Data Sources

The primary source is the *World of Warcraft Programming* book (2nd Edition), the definitive WotLK 3.3.5a reference. This was supplemented by scraping pre-Cataclysm snapshots of [WoWProgramming.com](https://web.archive.org/web/2010/http://wowprogramming.com/docs) from the Wayback Machine (before October 12, 2010). Memory addresses and internal function mappings were obtained through reverse engineering of the WoW 3.3.5a client (build 12340). No external API calls are made at runtime — everything is statically bundled.

## Contributing

Contributions are welcome! Visit the [Contribute page](https://milkyway-codex.vercel.app/contribute) to see entries that need documentation or verification.

### Verification Badges

Every function, event, and widget entry displays a verification badge. This status is **computed automatically** from the data — there is no manual flag to set.

| Badge | Criteria | Meaning |
|-------|----------|---------|
| **Verified** (green) | Has a `bookPage` reference (from the WoW Programming book), OR memory address in binary + pre-Cata archive docs, OR pre-Cata archive docs alone | Confirmed WotLK 3.3.5a information |
| **To review** (orange) | Real description but documentation URL points to a post-WotLK snapshot | Info exists but may differ from the 3.3.5a version |
| **Unverified** (red) | No description or "No documentation available." | Needs community contribution |

### How to Improve an Entry's Status

**Unverified → Verified:**
1. Add a real description to the entry in the corresponding `src/data/*.ts` file
2. Set the `documentationUrl` field to a pre-Cataclysm Wayback Machine snapshot (timestamp before `20101012`)
3. Example: `https://web.archive.org/web/20100701213739/http://wowprogramming.com/docs/api/FunctionName`

**To review → Verified:**
1. Find a pre-Cataclysm snapshot of the same page on the [Wayback Machine](https://web.archive.org)
2. Update `documentationUrl` to use the earlier timestamp
3. Verify the description matches the pre-Cataclysm content

**Adding a memory address** (functions only):
- If you have reverse-engineered WoW.exe build 12340, add the `memoryAddress` field (e.g. `"0x004A2F30"`)
- A function with a memory address + real description is automatically **Verified**, even without a documentation URL

**Adding a book page reference:**
- If you can find the entry in the *WoW Programming* book (2nd Edition), add the `bookPage` field with the page number
- Any entry with a `bookPage` is automatically **Verified**

### Data Files

All reference data is in `src/data/`:

| File | Content |
|------|---------|
| `api-functions.ts` | Game API functions (Lua) |
| `events.ts` | Game events |
| `widgets.ts` | UI widget types and methods |
| `data-types.ts` | Enums, flags, and types |
| `cvars.ts` | Console variables |
| `combat-log-events.ts` | Combat log sub-events |
| `secure-templates.ts` | Secure frame templates |

## Upcoming

- **FrameXML functions** — Parse the client's `/Interface` Lua files to document FrameXML helper functions (e.g., `OpenAllBags`, `ToggleBag`, `SetItemRef`) that are defined in Lua rather than the C engine
- **Patch version tracking** — Scrape "Added in patch X.Y.Z" data from Wowpedia/warcraft.wiki.gg to show when each function was introduced (e.g., `@since 3.0.2`)

## License

MIT — use it, fork it, build on it. This project exists to help the WoW modding community.
