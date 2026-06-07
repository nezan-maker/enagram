# Enagram Frontend Premiumization Audit

**Audit Date:** 2026-06-07  
**Auditor:** Albert Feynman  
**Scope:** Complete frontend surface — 34 pages, 5 layouts, 6 components, full design system  

---

## 1. Executive UI Quality Scores

| Dimension | Score | Benchmark (Linear/Stripe) |
|-----------|-------|--------------------------|
| Visual Design | 6.5/10 | 9.5/10 |
| UX Design | 5.5/10 | 9/10 |
| Accessibility | 3/10 | 8.5/10 |
| Consistency | 4/10 | 9.5/10 |
| Responsiveness | 4/10 | 9/10 |
| Perceived Performance | 3/10 | 8.5/10 |
| Motion Design | 4/10 | 8/10 |
| Design System Quality | 5/10 | 9/10 |
| **Overall** | **4.4/10** | **9/10** |

---

## 2. Critical Findings (Must Fix)

### C1. No Loading Skeletons — Raw "Loading..." text everywhere
**Impact:** Destructive perceived performance. Pages flash between empty and populated.  
**Locations:** RestaurantList, Approvals, IssuesHub, StaffList, FinanceDashboard, ChefBoard, WaiterBoard, OrderTracking, KitchenDashboard  
**Fix:** Create reusable `<Skeleton />` component; replace all `Loading...` strings with skeleton grids that match page layout.

### C2. No Empty States with CTAs
**Impact:** Users see blank cards with vague text ("No restaurants yet", "No orders yet.") — no guidance on what to do next.  
**Locations:** ClientDashboard, RestaurantList, all approval/issue/report screens, HR dashboards  
**Fix:** Each empty state must: (1) explain situation, (2) show a contextual icon/illustration, (3) provide a primary action button.

### C3. No Error Boundaries or Error States
**Impact:** API failures silently caught (`.catch(() => {})`) — user sees stale or empty data with no indication something went wrong.  
**Locations:** OwnerDashboard (2 silent catches), ChefBoard, WaiterBoard, DeputyDashboard, KitchenDashboard  
**Fix:** Add error state UI with retry mechanism. Never swallow errors silently.

### C4. Button Component Missing `size`, `ghost` Variants; Used Inconsistently
**Impact:** Button used with `size="sm"` in Approvals.tsx but interface only has `variant`. Pages use raw `<button>` elements instead of `<Button>` component.  
**Fix:** Add `size` prop ('sm' | 'md' | 'lg'), `ghost` variant, `loading` state to Button. Replace all raw `<button>` elements.

### C5. No Focus Rings / Keyboard Accessibility
**Impact:** Buttons, links, inputs have no visible focus indicators. Tab navigation is essentially invisible. Fails WCAG 2.1 AA.  
**Fix:** Add `focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface` to all interactive elements.

### C6. StatusPill Uses Tailwind Arbitrary Colors, Inconsistent with Design System
**Impact:** StatusPill uses `bg-yellow-500/20`, `bg-blue-500/20`, etc. — not the `surface`, `primary`, `error`, `success` tokens. Breaks dark-theme coherence.  
**Fix:** Map all status colors to design system tokens or custom semantic palette.

---

## 3. High Priority Findings

### H1. Form Inputs Not Using Design System Tokens
Auth forms use hardcoded `bg-[#131313]` and `border-white/5` instead of `bg-surface` and `border-outline-variant`.  
RestaurantSetup uses a different style still (`bg-surface-container-low border-outline-variant`).  
**Fix:** Unify all inputs to single Input component using design tokens.

### H2. No Reusable Input, Select, Textarea Components
All forms build inputs manually with inconsistent styles. No shared validation UI.  
**Fix:** Create `<Input />`, `<Select />`, `<Textarea />` with floating labels, validation, error states.

### H3. Card Component Doesn't Support Interactive State
Card used with `hover:shadow-lg` and `cursor-pointer` manually added everywhere. No `interactive` prop.  
**Fix:** Add `interactive` variant to Card that applies standard hover/focus treatment.

### H4. OwnerLayout Sidebar Active State Uses `border-l-2`
The left-border active indicator is the correct pattern but the `border-l-2 border-primary-container` creates a jarring visual jump. Linear uses a subtle background + slight left border.  
**Fix:** Use softer active state: `bg-primary-container/8 text-primary-container` with inset left border (::before pseudo).

### H5. ClientLayout Bottom Nav Missing Icons
Bottom nav is text-only — unusable on mobile. Every premium mobile app uses icons + optional text in bottom nav.  
**Fix:** Add SVG icons + text for each tab; ensure 44px min touch targets.

### H6. No Breadcrumb Component — Owner Layout Hardcodes
Breadcrumb is hardcoded as a single path. No dynamic breadcrumb from route.  
**Fix:** Generate breadcrumb from route hierarchy; make clickable.

### H7. RestaurantDetail is Entirely Static/Hardcoded
Page shows "Lumiere Dining" with hardcoded menu items. No API integration.  
**Fix:** Fetch restaurant by slug; render real data.

### H8. Typography Scale Inconsistencies
Pages use `text-[28px]`, `text-[11px]`, `text-[52px]`, `text-[18px]`, `text-[13px]`, `text-[15px]` — none of which are in the design system's type scale.  
**Fix:** Either extend tailwind fontSize config with these sizes OR enforce use of existing tokens (`display`, `headline-lg`, `headline-md`, `headline-sm`, `body-lg`, `body-md`, `label-caps`).

### H9. Spacing Rhythm Breakdown
Margins/padding use arbitrary values: `p-3`, `p-4`, `p-5`, `p-6`, `p-8`, `p-12` — no consistent rhythm. Space between sections varies: `space-y-4`, `space-y-6`, `space-y-8`, `space-y-12`.  
**Fix:** Establish 4px base unit, 8px rhythm. Define `space-xs` (4), `space-sm` (8), `space-md` (16), `space-lg` (24), `space-xl` (32), `space-2xl` (48).

### H10. No Reusable Table Component
StaffList builds a raw `<table>` with manual styling. All list pages should use a shared Table component with sorting, row hover, selection.  
**Fix:** Create `<Table />`, `<TableHeader />`, `<TableRow />` components.

---

## 4. Medium Priority Findings

### M1. AuthLayout Left Panel — External Unsplash Image Dependency
If Unsplash is down or rate-limited, auth pages break visually.  
**Fix:** Bundle a local asset or use CSS gradient art.

### M2. Logo Component Uses Inline SVG with `animate-pulse` on Star
The pulsing star is distracting and doesn't communicate state.  
**Fix:** Remove `animate-pulse`. Logo should be static and crisp.

### M3. No Transition on Route Changes
Pages appear instantly — no entry/exit animation.  
**Fix:** Add `animate-in` class to page wrappers (already defined but not consistently used).

### M4. Charts in OwnerDashboard Have Hardcoded Mock Fallback
If API fails, chart silently shows mock data. User thinks data is real.  
**Fix:** Show empty state or skeleton when API fails; never silently fall back to mock.

### M5. DeputyDashboard Quick Actions Use Raw `<a>` Tags
Quick action links are `<a>` tags, not `<Link>` components — cause full page reload.  
**Fix:** Replace with `<Link>` from react-router-dom.

### M6. PlaceOrder Radio Buttons Unstyled
Native radio buttons with no visual treatment.  
**Fix:** Create segmented control or styled radio group component.

### M7. No Tooltip Component
Icon buttons have `title` attributes but no tooltip component.  
**Fix:** Add Tooltip component with proper positioning and delay.

### M8. RestaurantCard Toggle Has No `onChange` Handler
Toggle switch in RestaurantCard is purely visual — doesn't call any function.  
**Fix:** Wire to actual restaurant open/close API call with optimistic update.

### M9. Client Profile Avatar is Hardcoded "U"
No actual user avatar integration.  
**Fix:** Show initials from user data or implement avatar upload.

### M10. `hover:scale-[1.02]` and `hover:scale-105` on Cards Cause Layout Shift
CSS transforms on hover cause adjacent elements to shift.  
**Fix:** Use `transform: translateY(-2px)` instead of scale for subtle elevate effect. Or ensure parent has sufficient gap.

---

## 5. Low Priority Findings

- L1: `rounded-container-lg` class used in Home.tsx but not defined in tailwind config
- L2: No favicon or PWA manifest  
- L3: `text-body-sm` and `text-label-sm` and `text-label-xs` used but not defined in fontSize scale  
- L4: Scrollbar styling only webkit — no Firefox `scrollbar-width` alongside (partially present)  
- L5: Autocomplete override color hardcodes `#131313` and `#ffffff` instead of using tokens  
- L6: `useFeature` hook called inside render in OwnerLayout (rules of hooks violation)  
- L7: No `aria-current="page"` on active nav links  
- L8: No `role="navigation"` or `aria-label` on sidebar/bottom nav  
- L9: Home page hero "Browse Restaurants" button doesn't scroll or navigate to restaurants section  
- L10: Register page `variant="ghost"` on Button but ghost variant doesn't exist

---

## 6. Premiumization Roadmap (Impact × Effort → ROI)

| Rank | Item | Impact | Effort | ROI |
|------|------|--------|--------|-----|
| 1 | Skeleton loading states | ★★★★★ | Low | Highest |
| 2 | Empty states with CTAs | ★★★★★ | Low | Highest |
| 3 | Focus rings (accessibility) | ★★★★ | Low | Very High |
| 4 | Unified Input component | ★★★★ | Medium | High |
| 5 | Button enhancements (size, loading, ghost) | ★★★★ | Low | Very High |
| 6 | Fix logo → EnagramLogo | ★★★ | Low | High |
| 7 | Replace hardcoded typography | ★★★ | Medium | High |
| 8 | Card interactive prop | ★★★ | Low | High |
| 9 | Error states + retry | ★★★★ | Medium | High |
| 10 | StatusPill design-token alignment | ★★★ | Low | High |
| 11 | ClientLayout nav icons | ★★★ | Low | High |
| 12 | Responsive refinements | ★★★★ | Medium | High |
| 13 | Breadcrumb component | ★★ | Medium | Medium |
| 14 | Table component | ★★★ | Medium | Medium |
| 15 | Tooltip component | ★★ | Low | Medium |

---

## 7. Pages Inventory (34 total)

### Public (3)
- `/` — Home (hero, cuisine filters, restaurant grid)
- `/restaurants/:slug` — RestaurantDetail (hardcoded)
- `*` — NotFound

### Auth (4)
- `/auth/login` — Login
- `/auth/register` — Register
- `/auth/staff` — StaffLogin
- `/auth/set-password` — SetPassword

### Client (6)
- `/client/dashboard` — ClientDashboard
- `/client/orders` — OrderHistory
- `/client/orders/:id` — OrderTracking
- `/client/profile` — Profile
- `/client/favourites` — Favourites
- `/client/issues` — ClientIssues

### Owner (7)
- `/owner/dashboard` — OwnerDashboard (KPIs + chart)
- `/owner/restaurants` — RestaurantList
- `/owner/restaurants/new` — RestaurantSetup (multi-step)
- `/owner/restaurants/:id` — RestaurantProfile (placeholder)
- `/owner/approvals` — Approvals
- `/owner/reports` — OwnerReports (placeholder)
- `/owner/issues` — IssuesHub

### Deputy (5)
- `/staff/deputy/dashboard` — DeputyDashboard
- `/staff/deputy/staff` — StaffOverview
- `/staff/deputy/approvals` — DeputyApprovals
- `/staff/deputy/reports` — DeputyReports
- `/staff/deputy/issues` — DeputyIssuesPage

### HR (5)
- `/staff/hr/dashboard` — HRDashboard
- `/staff/hr/staff` — StaffList
- `/staff/hr/staff/new` — CreateStaff
- `/staff/hr/staff/bulk` — BulkEnrollment
- `/staff/hr/staff/:id` — StaffDetail
- `/staff/hr/enrollment` — BulkEnrollment (duplicate route)

### Finance (3)
- `/staff/finance/dashboard` — FinanceDashboard
- `/staff/finance/revenue` — RevenueReport
- `/staff/finance/reports/new` — SubmitReport

### Kitchen (3)
- `/staff/kitchen/dashboard` — KitchenDashboard
- `/staff/kitchen/menu` — MenuManagement
- `/staff/kitchen/reports` — OperationsReport

### Chef (3)
- `/staff/chef/board` — ChefBoard
- `/staff/chef/orders/:id` — ChefOrderDetail
- `/staff/chef/messages` — ChefMessages

### Waiter (4)
- `/staff/waiter/board` — WaiterBoard
- `/staff/waiter/order/new` — PlaceOrder
- `/staff/waiter/orders/:id` — WaiterOrderDetail
- `/staff/waiter/messages` — WaiterMessages
