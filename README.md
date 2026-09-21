# PANEL — Archival Comic Archive & Library Engine

PANEL is a gallery-grade, self-hosted comic book library manager, metadata harvester, and archival reader built with React 19, TypeScript, Tailwind CSS, and AI vision-assisted issue matching.

---

## 🚀 Quick Start / Local Installation

### Prerequisites

Ensure you have the following installed on your local workstation:
- **Node.js**: Version 18.0.0 or higher (Node 20+ recommended)
- **npm** (v9+), **pnpm** (v8+), or **bun**

```bash
# Check your Node and npm versions
node -v
npm -v
```

---

### Step 1: Clone or Extract the Repository

```bash
git clone <your-repository-url> panel-comic-archive
cd panel-comic-archive
```

---

### Step 2: Install Dependencies

Using **npm**:
```bash
npm install
```

*(Alternatively, using `pnpm install` or `bun install`)*

---

### Step 3: Configure Environment Variables

Copy the example environment configuration:
```bash
cp .env.example .env
```

Edit `.env` to supply any desired configuration keys:
```env
# Optional: Gemini API Key for server-side AI reasoning
GEMINI_API_KEY=""

# Application URL (defaults to http://localhost:3000)
APP_URL="http://localhost:3000"
```

---

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start on **port 3000**:
```
  VITE v8.x.x  ready in 240 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
*(Default Vault PIN if locked is `1989` or `1234`)*.

---

### Production Build

To compile the application for deployment or static hosting:
```bash
# Type check and build
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Connecting to Local AI (Ollama / LM Studio)

PANEL features built-in support for OpenAI-compatible vision and language models running locally on your hardware:

1. **Start Ollama** with a vision-capable model:
   ```bash
   ollama run llama3.2-vision:11b
   # or
   ollama run qwen2.5-vl:7b
   ```
2. Navigate to **Settings** (`⌘,` or gear icon) ➔ **Archival AI & Vision Endpoints**.
3. Under **OpenAI-Compatible Endpoint**, set:
   - **Base URL**: `http://localhost:11434/v1`
   - **Model Tag**: `llama3.2-vision:11b`
4. Click **Ping & Test Endpoint** to verify communication.
5. You can now use the **AI Copilot (`⌘K`)** and **Vision-assisted Scraper** in the Import studio.

---

## 📋 Outstanding Functions & Roadmap

While the frontend architecture, archival layouts, reader engine, and AI coordination interfaces are fully implemented, the following functions are outstanding for a complete bare-metal self-hosted backend:

### 1. Real Server-Side Archive Extractor (CBZ / CBR / CB7 / PDF)
- **Current State**: Uses high-resolution sample pages and responsive web images.
- **Outstanding**: Direct server-side decompressor (e.g. `unzipper`, `node-unrar-js`, or Rust native bindings) that scans local folders (`/comics`), unzips `.cbz` / `.cbr` archives in memory, parses embedded `ComicInfo.xml` schemas, and streams WebP/AVIF tiles directly to the frontend reader.

### 2. Durable Database Layer (SQLite / PostgreSQL)
- **Current State**: Client-side state with localStorage and mock collection caches.
- **Outstanding**: SQLite (via Prisma or Drizzle ORM) or PostgreSQL integration to persist user issue libraries, collections, tags, reading milestones, and reading history across different devices and server restarts.

### 3. Live Comic Vine & Grand Comics Database (GCD) API Gateways
- **Current State**: Built-in heuristic scraper with confidence calculation and live search simulation.
- **Outstanding**: Direct server-side API proxy executing real rate-limited requests against the official Comic Vine API (`https://comicvine.gamespot.com/api/`) and caching responses in local SQLite index tables.

### 4. Direct RPC Integration with Download Daemons
- **Current State**: Active transfer manager with bandwidth controls, pause/resume state, and conversational AI queueing.
- **Outstanding**: Live HTTP/WebSocket API connectors to actual running instances of:
  - **qBittorrent WebUI API** (`/api/v2/torrents/add`)
  - **SABnzbd API** (`/api?mode=addurl&apikey=...`)
  - **Transmission RPC**

### 5. OPDS 1.2 / 2.0 Catalog Feed
- **Current State**: In-browser responsive comic reader for desktop, tablet, and mobile.
- **Outstanding**: An authenticated `/opds/v1.2/catalog` endpoint allowing native mobile comic apps (such as *Panels* on iOS, *Chunky*, or *Kuro Reader* on Android) to browse the archive and stream comics over the local network.

### 6. Multi-User Authentication & Access Control (RBAC)
- **Current State**: Master Vault PIN screen protecting the private archive interface.
- **Outstanding**: Multi-account support with Argon2/bcrypt password hashing, JWT/session cookies, and permission tiers (e.g., Administrator, Curated Reader, Read-Only Guest).

---

## 🏗️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **AI Integration**: OpenAI-compatible REST API client + WebGPU in-browser inference abstractions
