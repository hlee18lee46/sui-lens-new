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