# Sui-Lens 👁️‍🗨️ — Explore & Understand Sui Move Smart Contracts

> Web3 is hard for newcomers. **Sui-Lens** turns on-chain Move modules into clear, explorable knowledge — with **AI explanations** and **NL → Move generation**.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](#-contributing)

## 🧠 Inspiration
Web3 can overwhelm new learners scanning transactions or contracts. Sui-Lens provides a playground to **view structure, overview, and normalized modules** of `.move` contracts on Sui — and analyze them with **Gemini**. It also lets users **generate Move** from **natural language** prompts.

## ⚙️ What it does
- 🧩 **Module & Function Explorer** – browse Move modules, structs, and exposed functions  
- 🤖 **AI-powered explanations** – Gemini summarizes contract logic in plain English  
- ⭐ **Favorites & Analytics** – save to **Snowflake** and view insights  
- 🪟 **Multi-tab viewer** – Overview / Functions / Structs / Source / Gemini AI

## 🛠️ How we built it
- **Frontend:** Next.js 15 + TypeScript + Tailwind  
- **Blockchain:** Mysten Dapp Kit (Sui RPC) to fetch normalized Move modules  
- **AI Engine:** Gemini 1.5 Pro for code analysis & generation  
- **Data Layer:** Snowflake SDK for favorites + analytics  
- **State:** React Query for live caching & background refetch  
- **APIs:** Next.js App Router endpoints (`/api/favorites/*`) + Flask Sui RPC proxy

## ☁️ Deployments
- **Frontend:** Next.js on DigitalOcean App Platform  
- **API (Flask):** `gunicorn autoapp:app` with optional Valkey/Redis cache  
- **Env:** `SUI_RPC_URL`, `VALKEY_URL`, `CACHE_TTL`, Snowflake & Gemini creds

## 🔌 API Endpoints (Flask Sui proxy)
- `GET /api/sui/health`
- `GET /api/sui/packages/recent?limit=&cursor=`
- `GET /api/sui/packages/since/<start>?count=`
- `GET /api/sui/packages/<package_id>/modules`
- `GET /api/sui/packages/<package_id>/module/<module_name>`
- `GET /api/sui/objects/<object_id>`
- `POST /api/sui/rpc` `{ "method": "...", "params": [...] }`

> See `/api/sui/routes.py` for implementation details and caching.

## 🧊 Use of Snowflake API
We persist contract metadata (packageId, function/struct counts, normalized JSON) and user favorites in Snowflake for **fast queries** and **analytics**. This enables “most-viewed,” “recently indexed,” and future **risk scoring**.

## 🤖 Use of Gemini
- *Summaries:* Explain modules, structs, and capabilities in plain English  
- *Generation:* NL prompts → Move boilerplate (e.g., “token burns 1% on transfer”)  
- *UI:* Dedicated **Gemini** tab with explorable output

## ☁️ Use of DigitalOcean
- **App Platform** builds & deploys both Next.js and the Flask API from GitHub on push  
- HTTPS routing, logs, scaling, and simple `app.yaml` spec

## 🚧 Challenges
- `@mysten/sui` vs `@mysten/sui.js` version conflicts  
- Snowflake key-pair auth from serverless contexts  
- Avoiding HTML 404 fallbacks when proxying Snowflake queries  
- Safely destroying Snowflake connections with TypeScript types

## 🏆 Accomplishments
- Real-time contract explorer for Sui testnet  
- Inline **Gemini** explanations in tabbed UI  
- Snowflake-backed insights  
- Clean, modular UI inspired by IDEs

## 📚 What we learned
- Sui’s Move module normalization API  
- Snowflake patterns for blockchain metadata  
- Prompting Gemini for structured code summarization  
- Composable serverless APIs in App Router

## 🚀 What’s next
- Mainnet + community indexing  
- Live analytics & **risk scoring**  
- Gemini-powered **contract auditor**  
- Public APIs for developers

## ▶️ Quickstart (dev)
```bash
# Frontend
pnpm i && pnpm dev

# API (Flask)
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=autoapp:app
flask run --port 8080


# 🔭 Sui-Lens  
> **AI-Powered Smart-Contract Explorer for the Sui Blockchain**

Sui-Lens helps developers understand Move-based smart contracts through an elegant web interface.  
It indexes deployed Sui contracts, decodes normalized Move modules, and uses **Gemini AI** to explain logic in natural language — all within one unified explorer.

---

## 🧠 Inspiration  

Developers exploring Sui smart contracts often need to juggle multiple tools — chain explorers, CLI utilities, and manual decoding of Move modules.  
We wanted to simplify that. **Sui-Lens** unifies these fragmented experiences into one intuitive visual explorer that makes understanding on-chain logic effortless, searchable, and AI-assisted.

---

## ⚙️ What It Does  

Sui-Lens indexes smart contracts deployed on the Sui blockchain and provides:  

- 🧩 **Module & Function Explorer** — Browse Move modules, structs, and exposed functions  
- 🤖 **AI-Powered Explanations** — Gemini analyzes contract logic in plain English  
- ⭐ **Favorites & Analytics** — Save contracts to Snowflake and view usage insights  
- 🪟 **Multi-Tab Viewer** — Overview / Functions / Structs / Source / Gemini AI / Generator  

---

## 🛠️ How We Built It  

| Layer | Technology |
|:------|:------------|
| **Frontend** | Next.js 15 · TypeScript · Tailwind CSS |
| **Blockchain Integration** | Mysten Dapp Kit (Sui RPC) |
| **AI Engine** | Gemini 1.5 Pro API for contract analysis and Move-code generation |
| **Data Layer** | Snowflake SDK for favorites & analytics |
| **State Management** | React Query for live caching and background refetching |
| **APIs** | Serverless Next.js App Router endpoints (`/api/favorites/*`, `/api/gemini/*`) |

---

## 🚧 Challenges We Ran Into  

- Resolving SDK version conflicts between `@mysten/sui` and `@mysten/sui.js`  
- Configuring **Snowflake JWT key-pair authentication** in Next.js edge runtime  
- Avoiding **HTML 404 fallbacks** when proxying Snowflake queries  
- Safely destroying Snowflake connections while satisfying TypeScript type constraints  

---

## 🏆 Accomplishments We're Proud Of  

- Built a **real-time contract explorer** that automatically indexes Sui testnet deployments  
- Integrated **Gemini AI explanations** directly into a multi-tab interface  
- Connected **Snowflake analytics** for decentralized-data insights  
- Designed a **clean, modular UI** inspired by modern IDE layouts  

---

## 📚 What We Learned  

- Deep understanding of **Sui’s Move module normalization API**  
- Efficiently storing and querying **blockchain metadata** in Snowflake  
- Leveraging **Google Gemini** for structured code summarization  
- Building **composable serverless APIs** in the Next.js App Router  

---

## 🚀 What’s Next for Sui-Lens  

- Expand indexing to **Mainnet** and community-deployed contracts  
- Add **live usage analytics** and **contract risk scoring**  
- Build a **Gemini-powered contract auditor** for vulnerability detection  
- Open-source Sui-Lens as a public developer tool with APIs for builders  

---

🔑 Environment Variables
Variable	Description
NEXT_PUBLIC_SUI_NETWORK	Sui network (testnet or mainnet)
GOOGLE_API_KEY	Gemini API key
GEMINI_API_KEY	Gemini API key
SNOWFLAKE_ACCOUNT	e.g. NXOVXNL-RSC49174
SNOWFLAKE_USER	Snowflake user (e.g. HLEE3088)
SNOWFLAKE_PRIVATE_KEY	Base64-encoded PEM private key
SNOWFLAKE_DATABASE	Database name (e.g. HLEE3088_DB)
SNOWFLAKE_SCHEMA	Schema name (e.g. PUBLIC)
SNOWFLAKE_WAREHOUSE	Warehouse (e.g. COMPUTE_WH)

---

## 🧩 Quick Start  

```bash
# Clone & install
git clone https://github.com/hlee18lee46/sui-lens-new.git
npm install

# Environment variables
cp .env.example .env.local
# Fill in your Sui RPC, Snowflake, and Gemini keys

# Run locally
npm run dev


---

## 📜 License

MIT License © 2025 Han Lee