<div align="center">

<!-- Badges -->
[![Polygon](https://img.shields.io/badge/Polygon_PoS-8247E5?style=for-the-badge&logo=polygon&logoColor=white)](https://polygon.technology/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

# 🛡️ BlockCred

**Zero-Trust Cryptographic Credential Verification on the Blockchain**

A decentralized platform for issuing, anchoring, and verifying academic credentials using **Ed25519 digital signatures**, **Merkle Tree batch anchoring**, and the **Polygon PoS blockchain** — ensuring every certificate is tamper-proof, permanently verifiable, and privacy-preserving.

[Features](#-features) •
[Architecture](#-architecture) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Project Structure](#-project-structure) •
[Security Model](#-security-model) •
[Roadmap](#-roadmap) •
[Contributing](#-contributing)

</div>

---

## 🎯 Problem Statement

Academic credential fraud is a **$7 billion problem** globally. Forged degrees, fake transcripts, and tampered certificates undermine institutional trust. Traditional verification methods are slow, centralized, and easily bypassed.

**BlockCred** eliminates this entirely. Every credential goes through a multi-layer cryptographic pipeline — locally hashed, digitally signed, batched into a Merkle tree, and permanently anchored on the Polygon blockchain. Verification requires **zero trust in any intermediary** — the math proves everything.

---

## ✨ Features

### 🔐 Credential Issuance Engine
- **W3C Verifiable Credentials** — Generates standards-compliant JSON-LD credentials following the [W3C VC Data Model](https://www.w3.org/TR/vc-data-model/)
- **Privacy-First Design** — Stores SHA-256 hashed student names (`name_hash`) instead of plaintext PII
- **Ed25519 Digital Signatures** — Every credential is cryptographically signed using elliptic curve keys via a pluggable Key Management System (KMS)
- **Automatic Batch Queueing** — Newly issued credentials are queued for Merkle Tree aggregation

### ⛓️ Blockchain Anchoring
- **Merkle Tree Construction** — Batches of credential hashes are aggregated into a binary Merkle Tree, producing a single root hash
- **Polygon PoS Smart Contract** — The Merkle root is permanently anchored on-chain via the `BlockCredAnchor` smart contract (`anchorRoot`, `getRootDetails`, `batchCount`)
- **Gas-Optimized Batching** — Instead of one transaction per credential, hundreds are compressed into a single on-chain anchor

### ✅ Zero-Trust Verification
- **Client-Side Hashing** — Document hashes are computed locally in the browser using the Web Crypto API (`SHA-256`) — your file never leaves your device
- **Cryptographic Signature Verification** — The backend re-canonicalizes the credential, recomputes the hash, and verifies the Ed25519 signature against the issuer's public key
- **Dual-Format Support** — Accepts both W3C-standard and legacy credential formats via Zod schema validation

### 🔍 Polygon Block Explorer
- **Transaction Search** — Look up anchored Merkle roots and transaction hashes directly on the Polygon network
- **Network Status Dashboard** — Real-time connection status, latest block, and total historical anchors
- **Contract Traceability** — Full visibility into the `BlockCredAnchor` smart contract state

### 🌳 Merkle Tree Visualizer *(Phase 2)*
- Visual representation of how individual credential hashes are paired and collapsed into a cryptographic root

### 🔑 Authentication & Access Control
- **Supabase Auth** — Email/password and Google OAuth authentication
- **Gated Navigation** — Core features (Dashboard, Verify, Explorer, Tree) are hidden behind authentication
- **Session Management** — Real-time auth state tracking with automatic UI adaptation

### 📊 Admin Console
- **Credential Generation Form** — Issue credentials with student ID, name hash, course, and grade
- **One-Click JSON Export** — Download the signed W3C credential as a `.json` file for distribution
- **Network Sync** — Trigger Merkle tree calculation and Polygon anchoring with a single button

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Landing  │ │Dashboard │ │ Verify   │ │ Explorer │          │
│  │  Page    │ │ (Admin)  │ │  Page    │ │  Page    │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │             │            │             │                │
│  ┌────┴─────────────┴────────────┴─────────────┴────────┐      │
│  │           Unified API Layer (lib/api.ts)              │      │
│  │    • Centralized fetch wrapper with retry logic       │      │
│  │    • Zod schema validation (zero-trust input)         │      │
│  │    • Adapter pattern for response normalization        │      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │ HTTPS                                 │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python)                   │
│                                                                  │
│  ┌──────────────── API Layer (routes/) ──────────────────┐      │
│  │  POST /api/v1/issue    → Issue new credential         │      │
│  │  POST /api/v1/verify   → Verify credential signature  │      │
│  │  POST /api/v1/anchor   → Anchor batch to Polygon      │      │
│  │  GET  /health          → System health check           │      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                        │
│  ┌──────────── Service Layer (services/) ────────────────┐      │
│  │  IssuerService     → Orchestrates issuance pipeline    │      │
│  │  VerifyService     → Signature verification engine     │      │
│  │  AnchoringService  → Merkle tree + batch management    │      │
│  │  AuditService      → Immutable action logging          │      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                        │
│  ┌──────────── Domain Layer (domain/) ───────────────────┐      │
│  │  vc.py     → W3C Verifiable Credential formatter       │      │
│  │  crypto.py → Canonicalization + SHA-256 hashing         │      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                        │
│  ┌──── Ports & Adapters (Hexagonal Architecture) ────────┐      │
│  │  BaseKMS (port)        →  LocalKMS (adapter)           │      │
│  │  BaseStorage (port)    →  Pinata IPFS (adapter)        │      │
│  │  BaseWeb3 (port)       →  Amoy/Polygon (adapter)       │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
└──────────┬──────────────────────────────────┬───────────────────┘
           │                                  │
           ▼                                  ▼
   ┌───────────────┐                 ┌─────────────────┐
   │   Supabase    │                 │  Polygon PoS    │
   │  (PostgreSQL) │                 │  Smart Contract  │
   │               │                 │  (BlockCred     │
   │  • Cert store │                 │   Anchor)       │
   │  • Auth       │                 │                 │
   └───────────────┘                 └─────────────────┘
```

### Design Patterns

| Pattern | Implementation |
|---|---|
| **Hexagonal Architecture** | Ports (`BaseKMS`, `BaseStorage`, `BaseWeb3`) define interfaces; Adapters (`LocalKMS`, `PinataIPFS`, `AmoyWeb3`) provide concrete implementations |
| **Dependency Injection** | FastAPI `Depends()` wires services at runtime via `dependencies.py` |
| **Adapter Pattern** | Frontend `verifyAdapter.ts` normalizes backend responses into UI-friendly formats |
| **Singleton Services** | KMS, DB, Audit, and Anchoring services are initialized once and shared across requests |
| **Schema Validation** | Pydantic v2 (backend) + Zod v4 (frontend) enforce strict data contracts at every boundary |

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | `≥ 3.10` | Runtime |
| FastAPI | `≥ 0.136.0` | High-performance async API framework |
| Pydantic | `≥ 2.9.0` | Request/response validation and serialization |
| Web3.py | `latest` | Polygon blockchain interaction |
| Ed25519 (`cryptography`) | — | Digital signature generation and verification |
| Supabase Python | `latest` | PostgreSQL database client |
| Uvicorn | `≥ 0.44.0` | ASGI production server |
| Docker | — | Containerized deployment |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js (App Router) | `latest` | React framework with SSR/SSG |
| TypeScript | `latest` | Type-safe development |
| Tailwind CSS | `v4` | Utility-first styling |
| Zustand | `^5.0.12` | Lightweight global state management |
| TanStack React Query | `^5.96.2` | Server state management and caching |
| Zod | `^4.3.6` | Runtime schema validation (zero-trust input) |
| Framer Motion | `^12.38.0` | Animations and glassmorphism UI effects |
| Supabase JS | `^2.101.1` | Authentication (email + Google OAuth) |
| react-dropzone | `^15.0.0` | Drag-and-drop file upload |
| Lucide React | `^1.7.0` | Modern icon system |

### Infrastructure

| Technology | Purpose |
|---|---|
| Polygon PoS (Amoy Testnet) | EVM-compatible L2 blockchain for on-chain anchoring |
| Supabase | Managed PostgreSQL + Auth + Row Level Security |
| Docker | Production containerization |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js** ≥ 18.x | [Download](https://nodejs.org/) |
| **Python** ≥ 3.10 | [Download](https://www.python.org/downloads/) |
| **Docker** *(optional)* | For containerized deployment |
| **Supabase** project | Free tier works — [Create one](https://supabase.com/) |
| **Polygon Amoy** testnet wallet | With test MATIC — [Faucet](https://faucet.polygon.technology/) |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blockcred.git
cd blockcred
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in `backend/`:

| Variable | Description | Example |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key (server-side only) | `eyJhbGciOi...` |
| `RPC_URL` | Polygon Amoy RPC endpoint | `https://rpc-amoy.polygon.technology` |
| `PRIVATE_KEY` | Wallet private key for signing txns | `0xabc...` |
| `CONTRACT_ADDRESS` | Deployed BlockCredAnchor contract | `0xdef...` |

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your-wallet-private-key
CONTRACT_ADDRESS=your-deployed-contract-address
```

#### Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000` with interactive Swagger docs at [`/docs`](http://localhost:8000/docs).

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGciOi...` |

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Start the Dev Server

```bash
npm run dev
```

The frontend will be live at `http://localhost:3000`.

### 4. Docker Deployment (Backend)

```bash
cd backend
docker build -t blockcred-api .
docker run -p 10000:10000 --env-file .env blockcred-api
```

> **Note:** The Dockerfile exposes port `10000` for production. For local development, use `uvicorn` directly on port `8000`.

---

## 📡 API Reference

> **Base URL:** `http://localhost:8000` · **Interactive Docs:** [`/docs`](http://localhost:8000/docs)

### Endpoints Overview

| Method | Endpoint | Status | Description |
|---|---|---|---|
| `GET` | `/health` | `200` | System health check and enclave status |
| `POST` | `/api/v1/issue` | `201` | Issue a new W3C Verifiable Credential |
| `POST` | `/api/v1/verify` | `200` | Verify a credential's cryptographic signature |
| `POST` | `/api/v1/anchor` | `200` | Trigger Merkle Tree calculation and Polygon anchor |

---

### `GET /health`

Returns system operational status.

**Response:**
```json
{
  "status": "System Operational",
  "cryptographic_enclave": "Active"
}
```

---

### `POST /api/v1/issue`

Issues a new W3C Verifiable Credential with Ed25519 proof.

**Request Body:**
```json
{
  "student_id": "987654321",
  "name_hash": "0xabc123def456...",
  "course": "Blockchain Architecture 101",
  "grade": "A+"
}
```

**Response (`201`):**
```json
{
  "status": "success",
  "credential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/vc/status-list/2021/v1"
    ],
    "id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000",
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
    "issuer": "did:polygon:0xYourUniversityAddress",
    "issuanceDate": "2026-05-01T19:00:00Z",
    "credentialSubject": {
      "id": "did:student:987654321",
      "name_hash": "0xabc123def456...",
      "course": "Blockchain Architecture 101",
      "grade": "A+"
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "verificationMethod": "did:polygon:0xYour...#key-123456",
      "signatureValue": "base64-encoded-signature"
    }
  }
}
```

---

### `POST /api/v1/verify`

Verifies a credential by re-canonicalizing, re-hashing, and checking the Ed25519 signature.

**Request Body:** The full W3C credential JSON (including `proof`).

**Response (`200`):**
```json
{
  "is_valid": true,
  "reason": "Signature is mathematically valid and data is untampered."
}
```

---

### `POST /api/v1/anchor`

Builds the Merkle tree from queued credential hashes and anchors the root to Polygon.

**Response (`200`):**
```json
{
  "status": "Batch anchored successfully",
  "merkle_root": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "blockchain_tx_hash": "0xabc...def",
  "blockchain_status": "Success - Anchored to Polygon"
}
```

---

## 📁 Project Structure

```
blockcred/
├── backend/
│   ├── app/
│   │   ├── adapters/                  # Concrete implementations (Hexagonal)
│   │   │   ├── local_kms.py          # Ed25519 key management (in-memory vault)
│   │   │   ├── amoy_web3.py          # Polygon Amoy adapter (stub)
│   │   │   └── pinata_ipfs.py        # IPFS storage adapter (stub)
│   │   ├── api/
│   │   │   ├── dependencies.py       # Singleton DI wiring
│   │   │   └── routes/
│   │   │       ├── issue.py          # POST /api/v1/issue
│   │   │       ├── verify.py         # POST /api/v1/verify
│   │   │       └── anchor.py         # POST /api/v1/anchor
│   │   ├── core/
│   │   │   ├── config.py             # App configuration
│   │   │   ├── exceptions.py         # KeyNotFoundError, SignatureInvalidError
│   │   │   └── security.py           # Security utilities
│   │   ├── db/
│   │   │   ├── database.py           # DB connection config
│   │   │   └── repository.py         # Supabase CRUD operations
│   │   ├── domain/
│   │   │   ├── crypto.py             # SHA-256 hashing + JSON canonicalization
│   │   │   ├── merkle.py             # Merkle tree primitives
│   │   │   └── vc.py                 # W3C Verifiable Credential formatter
│   │   ├── ports/
│   │   │   ├── base_kms.py           # KMS abstract interface
│   │   │   ├── base_storage.py       # Storage abstract interface
│   │   │   └── base_web3.py          # Web3 abstract interface
│   │   ├── schemas/
│   │   │   ├── certificate.py        # Pydantic request/response models
│   │   │   └── w3c_models.py         # W3C data models
│   │   ├── services/
│   │   │   ├── anchoring_service.py  # Merkle tree builder + batch manager
│   │   │   ├── audit_service.py      # Immutable action logger
│   │   │   ├── issuer_service.py     # Credential issuance orchestrator
│   │   │   └── verify_service.py     # Signature verification engine
│   │   ├── blockchain.py             # Web3.py Polygon interaction layer
│   │   └── main.py                   # FastAPI application entry point
│   ├── Dockerfile                    # Production container (Python 3.10-slim)
│   └── requirements.txt             # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/page.tsx  # Landing page (hero + CTA)
│   │   │   ├── dashboard/page.tsx    # Admin console (issue + anchor)
│   │   │   ├── explorer/page.tsx     # Polygon block explorer
│   │   │   ├── login/page.tsx        # Authentication (email + Google)
│   │   │   ├── tree/page.tsx         # Merkle tree visualizer (Phase 2)
│   │   │   ├── verify/page.tsx       # Zero-trust verification UI
│   │   │   ├── layout.tsx            # Root layout + providers
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── loading.tsx           # Loading state
│   │   │   └── error.tsx             # Error boundary
│   │   ├── components/
│   │   │   ├── motion/
│   │   │   │   ├── GlassCard.tsx     # Animated glassmorphism card
│   │   │   │   └── FadeIn.tsx        # Fade-in animation wrapper
│   │   │   ├── verify/
│   │   │   │   ├── DragDropZone.tsx  # File upload drop zone
│   │   │   │   ├── HashAnimator.tsx  # Hash computation animation
│   │   │   │   └── ProofBreakdown.tsx # Proof result display
│   │   │   ├── explorer/
│   │   │   │   └── MerkleVisualizer.tsx  # Tree visualization component
│   │   │   ├── Navbar.tsx            # Auth-aware navigation bar
│   │   │   └── Providers.tsx         # React Query provider wrapper
│   │   ├── hooks/
│   │   │   ├── useVerify.ts          # Verification state machine hook
│   │   │   └── useExplorer.ts        # Explorer data hook
│   │   ├── lib/
│   │   │   ├── adapters/
│   │   │   │   └── verifyAdapter.ts  # Backend response normalizer
│   │   │   ├── schemas/
│   │   │   │   ├── credential.schema.ts  # Zod W3C + legacy schemas
│   │   │   │   └── api.schema.ts         # API response schemas
│   │   │   ├── api.ts                # Centralized API client with retry
│   │   │   ├── crypto.ts            # Client-side SHA-256 + file parsing
│   │   │   ├── supabase.ts          # Supabase client initialization
│   │   │   └── utils.ts             # General utilities
│   │   ├── store/
│   │   │   └── uiStore.ts           # Zustand global state store
│   │   └── types/
│   │       ├── api.types.ts          # API type definitions
│   │       └── domain.types.ts       # Domain type definitions
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🔒 Security Model

BlockCred implements a **defense-in-depth** security architecture across five layers:

```
Layer 1: Client-Side Validation
├── Zod schema validation rejects malformed inputs before any network call
├── SHA-256 hashing happens locally via Web Crypto API
└── Files never leave the user's browser during verification

Layer 2: API Boundary
├── Pydantic v2 enforces strict request schemas on every endpoint
├── CORS middleware controls origin access
└── Input sanitization prevents injection attacks

Layer 3: Cryptographic Core
├── Ed25519 elliptic curve signatures (128-bit security level)
├── JSON Canonicalization (deterministic key ordering + whitespace removal)
├── SHA-256 document hashing for tamper detection
└── Key rotation support via pluggable KMS interface

Layer 4: Blockchain Immutability
├── Merkle roots are permanently anchored on Polygon PoS
├── Smart contract events (RootAnchored) provide on-chain audit trail
└── Once anchored, data cannot be altered or deleted

Layer 5: Data Privacy
├── Student names are stored as SHA-256 hashes (never plaintext)
├── DID-based identifiers (did:student:XXX) replace direct PII
└── Supabase Row Level Security enforces access policies
```

### Verification Pipeline

```
User uploads .json credential
        │
        ▼
  ┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
  │ Zod Schema  │────▶│ Re-canonicalize  │────▶│ Ed25519 Signature │
  │ Validation  │     │ + SHA-256 Hash   │     │   Verification    │
  └─────────────┘     └──────────────────┘     └───────┬───────────┘
                                                       │
                                              ┌────────┴────────┐
                                              │                 │
                                           ✅ Valid        ❌ Tampered
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Foundation (Current)
- [x] W3C Verifiable Credential issuance pipeline
- [x] Ed25519 digital signature generation and verification
- [x] Merkle Tree batch construction and anchoring
- [x] Polygon PoS smart contract integration (Amoy testnet)
- [x] Zero-trust client-side verification UI
- [x] Supabase auth (Email + Google OAuth)
- [x] Admin console with credential issuance and network sync
- [x] Polygon block explorer with search
- [x] Docker containerization
- [x] Hexagonal architecture with pluggable adapters

### 🔜 Phase 2 — Advanced Features
- [ ] **D3.js Merkle Tree Visualizer** — Interactive hash tree exploration
- [ ] **DID Resolution** — On-chain public key fetching via Polygon DIDs
- [ ] **Credential Revocation** — W3C Status List 2021 implementation
- [ ] **IPFS Storage** — Pinata adapter for decentralized credential hosting
- [ ] **Bulk Issuance** — CSV upload for batch credential generation
- [ ] **QR Code Verification** — Scan-to-verify for physical certificates

### 🔮 Phase 3 — Enterprise
- [ ] **AWS KMS Integration** — Hardware-backed key management
- [ ] **Multi-Tenant Architecture** — Multiple institutions on one platform
- [ ] **Credential Templates** — Configurable credential schemas per institution
- [ ] **Analytics Dashboard** — Issuance and verification metrics
- [ ] **Webhook Notifications** — Real-time event streaming
- [ ] **Mobile SDK** — Native verification for iOS/Android

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use Case |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `refactor:` | Code restructuring |
| `test:` | Tests |
| `chore:` | Maintenance |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Pavan Das**

Built with 🔥 at **BIT Hackathon**

---

<p align="center">
  <sub>Built with cryptographic certainty. Verified by mathematics, not trust.</sub>
</p>
