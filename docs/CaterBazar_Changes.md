# CaterBazar — Feature Changes & Implementation Spec

_Last updated: 2026-01-23_

This document lists the complete frontend and backend changes required to implement the features you requested, plus working flows, subscription workflow, DB schema notes, endpoints, and a recommended phased timeline.

---

## Summary / Scope ✅
- Implement: Location Filter (like WedMeGood), Vendor Onboard Request (email), Inquiry "Send" → Email vendor, send confirmation email to customer after vendor confirmation.
- Implement full Subscription Payment workflow (details -> payment -> approve -> display + invoice generation).
- SuperAdmin: add filter UI + Export to Excel.
- Referral codes: generate/store and show on Vendor & SuperAdmin panels.
- Vendor panel improvements: fields, analytics charts, gallery video support, invoice view/download, fix logo, update FB & support email.

> Note: This repo contains the frontend next.js code (components / api wrappers). Several changes require backend & DB work. Wherever possible I point to exact frontend files to update.

---

## High-level working flows

### 1) Inquiry flow (user -> vendor via platform email)
1. User fills `InquiryModal` and hits Send (frontend: `src/components/Modals/InquiryModal.tsx`) — currently calls `createInquiry` (`src/api/user/inquiry.api.ts`).
2. Backend `/inquiries` endpoint (server) persists the inquiry and triggers: 
   - Send transactional email to vendor (HTML template) with inquiry details and link to vendor dashboard and inquiry details.
   - Mark `notificationsSent.email = true` in inquiry document and persist `sentAt` timestamp.
3. Vendor responds / confirms booking via vendor UI (vendor dashboard). When vendor sets status to `contacted` or `converted`, backend sends email to the customer (use customer email from inquiry) with a confirmation message and optionally a short message from vendor.
4. Optional: Add SMS notifications if vendor/customer phone present (use third-party provider).

### 2) Vendor Onboard Request (Email)
1. Vendor fills business registration (`submitBusinessRegistration` endpoint used currently) — frontend: `src/api/vendor/business.api.ts` + registration UI.
2. Backend persists registration and: 
   - Sends an email to SuperAdmin team (support@) notifying with registration details.
   - Optionally send acknowledgement email to vendor (auto-reply).
3. SuperAdmin reviews registration in their panel (`/admin/business-registrations`) and can Approve/Reject.

### 3) Location Filter (search UI similar to wedmegood)
- Frontend: extend search filters in `src/app/(site)/` pages that call `src/api/user/public.api.ts::searchVendors`. Add UI fields: state, locality, radius, map select (optional), locality autocomplete.
- Backend: support `state`, `locality`, `lat/lng + radius` params and geometric queries (`$geoWithin` / `near`) for vendor locations.

### 4) Subscription Payment Flow (detailed) 🔧
1. User (vendor) opens `SubscriptionPlan` (`src/components/Dashboard/SubscriptionPlan.tsx`) and selects a plan.
2. Frontend POST to backend: `/subscriptions/create-session` (payload: planId, vendorId). Backend creates checkout session with a payment provider (Stripe or Razorpay) and returns a checkout URL or sessionId.
3. Frontend redirects vendor to payment provider or opens Checkout.
4. Payment completes and provider calls backend webhook `/subscriptions/webhook`. Backend: 
   - Verifies webhook signature. 
   - Confirms payment status and idempotently updates a `subscriptions` record (create/approve). 
   - Generates invoice PDF and stores it (S3/Cloudinary) and link in DB.
   - Sends email confirmation to vendor with invoice link.
5. Frontend polls or fetches subscription status `/subscriptions/:id` or `/subscriptions/my` to display Approved/Failed state.

Security notes: verify webhook signature, store provider secrets in env variables, idempotency keys and transaction logs.

---

## Backend changes (dB migrations, new endpoints, templates)

### Database / Schema changes (Mongo-like notation)
- `vendors` collection:
  - Add: `referCode: string | null` (unique)
  - Add / ensure `socialMedia.facebookHandle` exists for FB link
- `businessRegistrations` / `vendorRegistrations`:
  - Add `referrerId?: string` or `referId` field
- `subscriptions` (new collection):
  - { _id, vendorId, planId, planName, amount, currency, billingPeriod, status: 'pending'|'active'|'expired'|'cancelled'|'failed', paymentProvider, paymentProviderId, invoiceUrl?, createdAt, updatedAt }
- `inquiries` already exists. Add `notificationsSent` with timestamps (email/sms). Backend should update email sent status.
- `invoices` (optional): { _id, vendorId, subscriptionId, pdfUrl, amount, createdAt }
- `gallery` items: support video objects: { url, publicId, type: 'video' | 'image', category }

### Backend API endpoints to add/modify (examples)
- POST /inquiries — already exists, modify to trigger vendor email (HTML template).
- POST /vendors/business-registration — already exists; add email to admin and acknowledgement to vendor.
- POST /vendors/onboard-request — (optional) direct button to request onboarding that emails admin.
- POST /superadmin/vendors/export?format=excel|csv&filter=... — returns file/stream (or generates pre-signed link).
- POST /subscriptions/create-session { vendorId, planId, billingCycle } -> { checkoutUrl | sessionId }
- POST /subscriptions/webhook (payment provider webhook endpoint) -> secure processing, update subscription status, generate invoice.
- GET /subscriptions/my (vendor only) -> returns latest subscription status + invoice URL(s).
- GET /invoices/:id or GET /subscriptions/:id/invoice -> returns download link.

### Email templates & mailer
- Inquiry -> vendor: include event details, link to vendor dashboard. Template: `inquiry-vendor.html`.
- Registration -> admin: `vendor-registration-notify.html` with register data + moderation link.
- Vendor confirmation -> customer: `inquiry-confirmation-customer.html` with booking message + contact info.
- Subscription payment success -> `subscription-confirmation.html` with invoice link.

Use transactional mail provider (SendGrid/SES/Mailgun). Prefer queueing (BullMQ or background worker) to avoid blocking API.

---

## Frontend changes (files to update + high level code)

### 1) Inquiry Modal & Vendor product pages
- Files: `src/components/Modals/InquiryModal.tsx`, `src/components/Vendor/VendorProduct.tsx`.
- Changes:
  - Keep using `createInquiry`, but ensure backend sends vendor email. Add visual feedback when email to vendor is scheduled (success banner).
  - Add an optional `Send as email to vendor` toggle if needed (default true).
  - After vendor confirms booking in vendor dashboard, backend will send confirmation email to customer — add UI notification to customer (`My Inquiries`) when status changes.

### 2) Vendor Onboard Request
- Files: registration page(s) under `src/app/auth/vendor/businessRegistration/page.tsx` and `src/api/vendor/business.api.ts`.
- Changes:
  - Ensure `submitBusinessRegistration` includes optional `referId`/`referCode` field.
  - Show feedback that admin will be notified and display ref code if used.

### 3) Location filter UI
- Files: pages calling `searchVendors` (`src/api/user/public.api.ts`) and site search components under `src/app/(site)/...` and `src/components/Home/*` if applicable.
- Changes:
  - Add new inputs: `State` select, `Locality` (autocomplete), `Radius` km, `Use my location` button (Geolocation API). Add map pin UI (optional).
  - Extend search call to include lat/lng + radius and locality; update results rendering to show locality badges and distance.

### 4) Subscription UI
- Files: `src/components/Dashboard/SubscriptionPlan.tsx` + new pages: `src/app/dashboard/subscription/checkout/page.tsx` and `src/app/dashboard/subscription/result/page.tsx`.
- Changes:
  - Add plan selection, payment method selection. Call `/subscriptions/create-session`.
  - Redirect vendor to provider or embed Checkout. Implement status polling to `/subscriptions/my`.
  - Add UI for invoice download when status = approved.

### 5) SuperAdmin: Filters + Export
- Files: `src/components/SuperAdmin/VendorManagement.tsx`, `src/api/superadmin/vendor.api.ts`.
- Changes:
  - Add filter UI in header (status, referral, location, date range). Add button `Export` (open a dropdown: CSV / Excel).
  - Call backend `/superadmin/vendors/export` with filter params and trigger file download (or show pre-signed link).

### 6) Referral code display & create
- Files: `src/components/SuperAdmin/VendorDetailSidebar.tsx`, `src/components/Dashboard/PersonalInfo.tsx`, and business registration forms.
- Changes:
  - Show `referCode` in vendor details and admin registration row. Add UI in vendor profile to display `My Referral Code` and a copy button.

### 7) Vendor panel analytics and fields
- Files: vendor dashboard panels inside `src/components/Dashboard/*` (e.g., `DashboardOverview.tsx`, `VendorProfile.tsx`, `Dashboard` pages).
- Changes:
  - Add graphs (Chart.js / Recharts / ApexCharts) for: inquiries over time, response rate, profile views, revenue (if available).
  - Fetch data via `/vendors/analytics` endpoint (backend computes aggregates).

### 8) Gallery video support
- Files: `src/components/Vendor/Gallery` or component that shows gallery (`src/api/user/public.api.ts` for fetching vendor gallery).
- Changes:
  - Support video upload in vendor media upload UI: accept MP4/WebM, upload to storage (backend endpoint), add `type: 'video'` to gallery items.
  - Display video thumbnail with play overlay and modal to play.

### 9) Invoice view & download
- Files: new component at `src/components/Dashboard/Invoice.tsx` and `src/app/dashboard/invoices/page.tsx`.
- Changes:
  - Show invoice list fetched from `/invoices/my` or `/subscriptions/my` and provide PDF download links.

### 10) Minor fixes
- Logo not appearing: verify `public/images/logo.png` is present (it is) and ensure `<img src="/images/logo.png"/>` usage works in Next.js — fix absolute path or import if SSR errors appear. Files using it: `src/components/Navbar.tsx`, `SuperAdminNavbar.tsx`, `Footer.tsx`, app layout metadata.
- Change FB link & support email: The FB link is in `src/app/layout.tsx` and support email appears in `src/components/Dashboard/Sidebar.tsx` and `/app/(site)/blog/page.tsx` — change values or move to env/config.

---

## Error handling, logging & monitoring
- Add webhook logs for payment events (persist the raw event for debugging).
- For email sends, persist send status and errors on DB record; surface failure counts in SuperAdmin.

---



## Testing & QA
- Unit tests for API wrappers and UI components (Jest + React Testing Library).
- Integration tests for payment webhook logic (simulate events).
- E2E tests for subscription checkout flows (Cypress / Playwright).

---

## Suggested milestones & priorities
1. MVP: Inquiry email to vendor, vendor onboard email, small fixes (logo, FB, support email), add referCode field in DB (2 weeks). 🟢
2. Payment & subscription (Stripe/Razorpay integration + webhook + invoice generation) (3–4 weeks). 🟠
3. SuperAdmin export & filters, vendor analytics dashboard, gallery videos (2–3 weeks). 🔵

---

## Estimated effort (short summary)
See the separate cost estimate; rough total ~260 hrs with contingency. We can provide a phased fixed-cost estimate if you prefer.

### Total Costing (phase-wise & grand totals) 💰
All numbers use the **260 hrs** estimate (includes ~20% contingency).

- **Phase 1 — MVP (≈100 hrs)**
  - Hours: **100**
  - Cost (mid-rate ₹1,500/hr): **₹150,000**
  - Cost (senior ₹3,000/hr): **₹300,000**
  - Cost (USD $25/hr): **$2,500**
  - Cost (USD $50/hr): **$5,000**

- **Phase 2 — Payment & Subscription (≈120 hrs)**
  - Hours: **120**
  - Cost (mid-rate ₹1,500/hr): **₹180,000**
  - Cost (senior ₹3,000/hr): **₹360,000**
  - Cost (USD $25/hr): **$3,000**
  - Cost (USD $50/hr): **$6,000**

- **Phase 3 — Analytics, Video, Polish (≈40 hrs)**
  - Hours: **40**
  - Cost (mid-rate ₹1,500/hr): **₹60,000**
  - Cost (senior ₹3,000/hr): **₹120,000**
  - Cost (USD $25/hr): **$1,000**
  - Cost (USD $50/hr): **$2,000**

**Grand total (260 hrs)**  
- Hours: **260**  
- Cost (mid-rate ₹1,500/hr): **₹390,000**  
- Cost (senior ₹3,000/hr): **₹780,000**  
- Cost (USD $25/hr): **$6,500**  
- Cost (USD $50/hr): **$13,000**

**Recommended quotes to present to client**
- **Standard** (mid-rate, includes testing & small buffer): **₹430,000**  
- **Premium turnkey** (senior rate + buffer + priority support): **₹860,000**

**Payment terms (suggested)**  
- 30% upfront, 40% on completion of Phase 2 (subscriptions), 30% on final delivery.  
- Estimate valid for 30 days. Taxes (GST/VAT) not included.

---

## Implementation notes & code anchors (quick reference)
- Inquiry UI: `src/components/Modals/InquiryModal.tsx`
- Inquiry API: `src/api/user/inquiry.api.ts`
- Vendor registration: `src/api/vendor/business.api.ts` + UI pages under `src/app/auth/vendor/*`
- Subscription UI: `src/components/Dashboard/SubscriptionPlan.tsx`
- SuperAdmin Vendor list UI: `src/components/SuperAdmin/VendorManagement.tsx`
- SuperAdmin Vendor API: `src/api/superadmin/vendor.api.ts`
- Logo & site metadata: `src/app/layout.tsx`, `public/images/logo.png`, components using it

---

## Next steps I can help with ✨
1. Produce a phased fixed-price proposal (milestones + acceptance criteria) suitable to give to your client. 
2. Start implementing Phase 1 changes (I can prepare PRs with frontend changes and API contract docs for backend devs).
3. Create sample email templates and a sample webhook handler for Stripe.

---

If you want me to convert this to a formal project document with acceptance criteria and a Gantt-style timeline, tell me which currency and hourly rate you'd like me to use for pricing and whether to include testing/hosting costs.

---

*End of spec*
