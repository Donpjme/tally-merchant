📁 PROJECT TALLY: MASTER PRODUCT REQUIREMENT DOCUMENT (PRD)
Version: 1.0 | Status: DRAFT | Classification: CONFIDENTIAL Chief Architect: Ifeanyi Nwosu | Lead Developer: Gemini and I.

1. Executive Summary
Vision: To build the "Commerce Operating System" for the next billion merchants. Tally is not just a website builder; it is a headless, API-first commerce engine that enables SMEs to manage inventory, orders, and customer relationships across all channels (Web, WhatsApp, Instagram) from a single mobile-first dashboard. Core Philosophy: Stability, Speed (Sub-second latency), and Minimalism. North Star Metric: "Time to First Sale" (TTFS) for new merchants.

2. Product Scope & Features
2.1 The Merchant Command Center (The Dashboard)
Role: The administrative interface for the business owner.

Critical Requirements:

PWA (Progressive Web App): Must be installable on mobile without an App Store.

Offline Mode: Merchants must be able to view orders and draft products without internet (syncs when online).

Multi-Channel Sync: Inventory must decrement automatically whether sold on the Website or manually recorded (e.g., via Instagram DM).

Role-Based Access Control (RBAC): Owner vs. Staff (Staff cannot see total profit).

2.2 The Storefront Engine (The Consumer View)
Role: The public-facing e-commerce site generated for each merchant.

Critical Requirements:

Edge Rendering: Sites must load in <800ms globally (Next.js on Vercel Edge).

Dynamic Slugs: tally.ng/nike or nike.com (Custom Domain support).

WhatsApp-First Checkout: Option to "Checkout via WhatsApp" instead of a card payment (critical for trust in emerging markets).

2.3 The Intelligence Layer (AI)
Role: Automated operational tasks to reduce merchant workload.

Features:

Vision-to-Product: Upload a photo -> AI detects "Red Dress" -> Auto-fills Title, Category, and SEO tags.

Smart Description Writer: Generate high-converting copy based on bullet points.

3. Technical Architecture (The Stack)
3.1 Infrastructure & Data
Cloud Provider: Vercel (Frontend/Edge) + Supabase (Backend/DB).

Database: PostgreSQL 16 with Row Level Security (RLS).

Storage: Object Storage (Supabase/S3) with CDN caching for product images.

API Architecture: RESTful for public storefronts; RPC for internal dashboard actions (for performance).

3.2 Security & Compliance
Data Isolation: Strict Tenant Isolation via RLS (Store A cannot query Store B).

Authentication: Supabase Auth (JWT).

Payments: PCI-DSS Level 1 compliant via delegation (Paystack/Flutterwave integration only; no raw card data touches our servers).

📅 AGILE DEVELOPMENT PLAN (The Scrum Roadmap)
We will execute this in 2-Week Sprints.

🔹 SPRINT 1: The Bedrock (Architecture & Auth)
Goal: A secure, deployable environment where users can sign up and create a "Store."

Ticket 1.1: Finalize Database Schema (Users, Stores, Profiles) & Apply RLS Policies.

Ticket 1.2: Set up Next.js 14 Repo with CI/CD Pipeline (Auto-deploy to Vercel).

Ticket 1.3: Implement Authentication (Sign Up, Login, Forgot Password).

Ticket 1.4: Build "Onboarding Flow" (User sets Store Name -> System reserves Subdomain).

🔹 SPRINT 2: Inventory Core (The "Product" Module)
Goal: Merchants can create, edit, and delete products with images.

Ticket 2.1: Build "Add Product" Form with validation.

Ticket 2.2: Integrate Image Upload (CDN optimization & resizing).

Ticket 2.3: Implement Variants Logic (Size/Color matrix).

Ticket 2.4: Build Product List View with Search/Filter.

🔹 SPRINT 3: The Storefront Engine (Public View)
Goal: A customer can visit store-name.tally.ng and see products.

Ticket 3.1: Create Dynamic Routing (/[slug]) middleware.

Ticket 3.2: Build "Master Theme" (Home, Product Detail, Category Page).

Ticket 3.3: Implement "Add to Cart" (Local Storage state management).

🔹 SPRINT 4: The Transaction Layer (Orders & Checkout)
Goal: A customer can place an order; Merchant sees it instantly.

Ticket 4.1: Build Checkout Flow (Guest checkout, Address collection).

Ticket 4.2: Integrate Paystack/Flutterwave API.

Ticket 4.3: Build "Order Received" Webhook (Updates DB status).

Ticket 4.4: Merchant Order View (Status toggling: Pending -> Shipped).

🔹 SPRINT 5: AI & Polish (The "Bumpa Killer" Features)
Goal: Automation and refinement.

Ticket 5.1: Integrate OpenAI API for Product Descriptions.

Ticket 5.2: Build Analytics Dashboard (Charts for Sales/Visits).

Ticket 5.3: "WhatsApp Checkout" button logic.