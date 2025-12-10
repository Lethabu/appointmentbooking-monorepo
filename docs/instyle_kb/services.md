```markdown
# Core Services – Instyle Hair Boutique

This page lists the two canonical Instyle services (bookable in the app). Keep this file minimal — these are the salon's primary offerings and should be the ones shown in the booking flow and dashboard by default.

## Primary Installation Services (canonical)

| **Service ID** | **Service** | **Short Description** | **Duration** | **Price (ZAR)** |
|---------------:|------------|----------------------|------------:|----------------:|
| `svc_instyle_mid_side` | Middle & Side Installation | Middle-part weave installation — prepped, fitted, and finished for a natural hairline. Ideal for everyday wear and events. | 60 min | R 500 |
| `svc_instyle_maphondo` | Maphondo & Lines Installation | Precision Maphondo weave & line detailing — sculptural look that holds 4–6 weeks. | 60 min | R 500 |

---

## Notes (operational)

- **Default upsell:** Argan Oil Serum (product) offered at checkout for installs.
- **Booking policy:** 50 % deposit to confirm an installation slot; balance on visit.
- **Reschedule:** Free up to 24 hours before appointment; late cancel (<24 h) forfeits 50 % deposit.

## For developers / AI agents

- Use `svc_instyle_mid_side` and `svc_instyle_maphondo` as canonical `serviceId` values in API calls.
- When migrating or syncing services, map legacy SuperSaaS IDs to these two `serviceId` values.
- Suggest the `Argan Oil Serum` product during the `booking confirmation` step for both services.

```
# Services & Pricing – Instyle Hair Boutique

Complete service catalog with pricing, duration, and add-ons.

## Installation Services

| **Service** | **Description** | **Duration** | **Price (ZAR)** | **Add-ons** |
|-------------|-----------------|--------------|-----------------|-----------|
| **Middle & Side Installation** | Professional middle-part weave install with flexi-bond micro-beads. Lace melts into natural hairline. Includes silk-press gloss finish for ultimate shine. | 1 h | R 500 | R 100 customization if new wig (tint, pluck, cut) |
| **Maphondo & Lines Installation** | Precision geometric braids with Maphondo weaving. Sculptural lines frame the face. Lasts up to 6 weeks. | 1 h | R 500 | Pairing discount with Argan Oil Serum |

---

## Colour Services

| **Service** | **Description** | **Duration** | **Price (ZAR)** | **Notes** |
|-------------|-----------------|--------------|-----------------|----------|
| **Full Head Colour** | Permanent root-to-tip colour transformation. Natural base blend or bold statement shades. | 2 h | R 800 | Includes strand test |
| **Root Touch-up** | Colour refresh for regrowth. Perfect 6-week maintenance. | 1 h 30 m | R 500 | Base colour matches previous |
| **Half Head Foils** | Natural highlights or lowlights. Adds dimension to curls or straight hair. | 2 h 30 m | R 750 | Up to 20 foils |
| **Full Head Foils** | Complete colour transformation with hand-painted foils. Balayage, ombré, or rooted blonde. | 3 h | R 1 200 | Up to 40 foils |
| **Balayage / Ombré** | Hand-painted gradient for natural-looking multi-tones. Trendy dimension. | 3 h 30 m | R 1 400 | Custom colour blend |
| **Toner** | Colour neutralizer for cool blonde or warm brunette tones. Adds shine. | 30 m | R 300 | Often paired with foils |

---

## Treatment & Care Services

| **Service** | **Description** | **Duration** | **Price (ZAR)** | **Ideal For** |
|-------------|-----------------|--------------|-----------------|--------------|
| **Brazilian Blowout** | Keratin smoothing treatment. Frizz-free, sleek finish for 8–12 weeks. | 3 h | R 1 500 | Textured, curly, or frizzy hair |
| **Deep Conditioning Treatment** | Moisture & repair mask. Restores elasticity & shine to damaged hair. | 45 m | R 400 | Post-colour or heat-damaged |
| **Olaplex Treatment** | Bond-repair system. Strengthens broken hair from within. | 45 m | R 350 | Colour-treated or bleached hair |

---

## Styling Services

| **Service** | **Description** | **Duration** | **Price (ZAR)** | **Best For** |
|-------------|-----------------|--------------|-----------------|------------|
| **Up-Style** | Elegant up-do with braids, twists, or curls. Wedding-ready or event glam. | 1 h 15 m | R 450 | Weddings, proms, events |
| **Wash, Cut & Blow Wave** | Full service: shampoo, precision cut, professional blow-out. | 1 h | R 350 | Regular maintenance |
| **Wash & Blow Wave** | Style-only blow-out with no cut. Perfect for quick refreshes. | 45 m | R 250 | Between-cut touchups |
| **Curls (Wand/Iron)** | Tool-defined curls using heated wands or irons. Soft waves or tight curls. | 45 m | R 300 | Event prep or styling |

---

## Pricing Structure

- **Instalment Plans:** 50 % deposit to secure slot; balance due at visit.
- **Loyalty Points:** 1 point per R 1 spent; 500 points = R 50 discount.
- **Student Discount:** 10 % off weekday services (Mon–Fri, 9 AM–2 PM) with valid TUT ID.
- **Bulk Discounts:** 20 % off if booking 3+ installations in one month.
- **First-Time Client:** Welcome 15 % off service (no products).

---

## Cancellation & Rescheduling Policy

- **Free rescheduling:** Up to 24 hours before appointment.
- **Late cancellation (< 24 h):** Forfeit 50 % of booking fee.
- **No-show:** Full service charge applies.

---

## Product Recommendations by Service

| Service | Recommended Product | Why |
|---------|-------------------|-----|
| Installation | Argan Oil Serum | Prevents frizz in humidity |
| Colour Services | Sulfate-Free Repair Shampoo | Protects colour vibrancy |
| Brazilian Blowout | Deep Conditioning Treatment | Locks in keratin benefits |
| All Services | Instyle Loyalty Card | Earn points on all purchases |

---

## Notes for AI Agents

- **Booking flow:** Always suggest Argan Oil add-on to installation clients.
- **Upsell:** Recommend treatments after colour or heat services.
- **Duration buffer:** Add 15 m between appointments for cleaning/setup.
- **Staff assignment:** Route "Maphondo" requests to Zindzi (specialization).
