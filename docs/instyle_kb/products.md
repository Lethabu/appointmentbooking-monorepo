```markdown
# Instyle Product Catalog (core)

This concise catalog focuses on products that support the two main installation services. Keep SKUs small and display these prominently in the shop and at checkout for installation upsells.

## Priority Products

| **SKU** | **Product** | **Details** | **Price (ZAR)** | **Stock** |
|-------:|-----------|-----------|---------------:|---------:|
| `prd_wig_16_hd` | 16" HD Lace Frontal Wig | 150% density human hair, pre-plucked hairline. Ready for install. | R 3,500 | 10 |
| `prd_bundle_braz_14` | 14" Brazilian Deep Wave Bundle (per pc) | Raw human hair, deep wave texture — used for installs & custom wigs. | R 1,200 | 25 |
| `prd_argan_100` | Argan Oil Serum (100 ml) | Anti-frizz, heat protectant, shine booster — default upsell for installs. | R 280 | 50 |
| `prd_wigcap_5` | Wig Cap (pack of 5) | Nylon mesh caps — required for installs. | R 50 | 200 |

---

## Bundles (simple)

- **Installation Starter Pack (`bundle_install_starter`)**: `prd_wig_16_hd` + `prd_argan_100` + `prd_wigcap_5` — R 3,500 (promoted at checkout).

---

## Notes for integration

- Expose `SKU` and `price` in the `/api/products` endpoint used by the shop UI and social-commerce feeds.
- Mark `prd_argan_100` as the default upsell for `svc_instyle_mid_side` and `svc_instyle_maphondo` in the checkout flow.
- For social-commerce mappings (Instagram / Facebook), map `SKU` -> `merchant_product_id` in feed exports.

```
# E-commerce Products – Instyle Hair Boutique

Curated hair care, wigs, and accessories for purchase.

## Hair Extensions & Wigs

| **Product** | **Details** | **Texture** | **Price (ZAR)** | **Stock** | **Ideal Use** |
|-------------|-------------|-----------|-----------------|-----------|--------------|
| **16" HD Lace Frontal Wig** | 150 % density human hair. Ready-to-ship with pre-plucked hairline. Bleached knots, widows peak detail. | Straight / Wavy | R 3 500 | 10 | Middle & Side install |
| **14" Brazilian Deep Wave Bundle (1 pc)** | Raw, unprocessed human hair. Natural curl pattern. Mix & match with other lengths. | Deep Wave | R 1 200 / pc | 25 | Protective installs |
| **Curly Closure 4x4"** | Curly texture, natural hairline. Pairs with bundles for full wig effect. | Curly | R 800 | 8 | Customizable wigs |
| **Straight Hair Bundle 12"** | Silky straight, versatile. Can be curled or styled. | Straight | R 1 100 | 15 | Versatile installs |

---

## Hair Care & Treatments

| **Product** | **Size** | **Key Benefits** | **Price (ZAR)** | **Stock** | **For** |
|-------------|---------|-----------------|-----------------|-----------|--------|
| **Argan Oil Serum 100 ml** | 100 ml | Anti-frizz, heat protectant, shine booster. 100 % pure argan. | R 280 | 50 | All hair types |
| **Sulfate-Free Repair Shampoo 500 ml** | 500 ml | Gentle cleanse, colour-safe, strengthening proteins. | R 220 | 40 | Damaged, colour-treated |
| **Deep Condition Mask 250 ml** | 250 ml | Moisture + repair. Ceramides & keratin. | R 180 | 35 | Dry, curly, textured |
| **Leave-In Conditioner 200 ml** | 200 ml | Lightweight moisturizer. Daily detangle spray. | R 150 | 30 | Natural, curly hair |
| **Heat Protectant Spray 400 ml** | 400 ml | Shield against blow dryers, flat irons. UV block. | R 160 | 28 | All hair types |

---

## Accessories

| **Product** | **Material** | **Price (ZAR)** | **Stock** | **Purpose** |
|-------------|-------------|-----------------|-----------|-----------|
| **Wig Cap (Pack of 5)** | Nylon mesh | R 50 | 200 | Secure hair for install |
| **Wig Glue Adhesive (1 oz)** | Waterproof lace glue | R 120 | 40 | Lace application |
| **Silk Pillow Case** | 100 % mulberry silk | R 220 | 15 | Preserve curls, reduce frizz |
| **Hair Bonnet** | Satin-lined | R 85 | 50 | Nighttime hair protection |

---

## Bundle Deals

| **Bundle Name** | **Contents** | **Normal Price** | **Bundle Price** | **Savings** |
|---|---|---|---|---|
| **Installation Starter Pack** | 16" Lace + Argan Oil + Wig Cap (5) | R 4 030 | R 3 500 | R 530 (13 %) |
| **The Colour Care Kit** | Shampoo + Mask + Leave-In + Heat Protectant | R 710 | R 599 | R 111 (16 %) |
| **Brazilian Blowout Duo** | Argan Oil + Deep Condition Mask | R 460 | R 399 | R 61 (13 %) |

---

## Seasonal Specials

| **Season** | **Promotion** | **Duration** | **Details** |
|---|---|---|---|
| **Summer (Dec–Feb)** | "Glow-Up Season" – 20 % off all hair care | Monthly | Free Argan Oil with 3+ hair care purchases |
| **Winter (Jun–Aug)** | "Restore & Repair" – Bundle discount | Monthly | Buy 2 treatments, 25 % off 3rd |
| **Festive (Nov–Dec)** | Gift bundle sales | Dec 1–24 | Pre-packaged kits with personalized cards |

---

## Restocking & Availability

- **Hair extensions** – Restocked every 2 weeks (check TikTok for drops).
- **Hair care** – In stock year-round.
- **Wigs** – Custom order available (4-week lead time).
- **Out of stock?** Join WhatsApp notification list: 064 769 6159.

---

## Notes for AI Agents

- **Upsell trigger:** After booking installation, suggest Argan Oil.
- **Cross-sell:** Shampoo + conditioner as bundle offer.
- **Loyalty:** 1 point per R 1; apply auto at checkout.
- **Low stock alert:** If < 5 units, flag for Orion (e-commerce agent) to generate "Limited Availability" urgency.
- **Bundle ROI:** Bundles have 13–16 % margin advantage; prioritize in recommendations.
