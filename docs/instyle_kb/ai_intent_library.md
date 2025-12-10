# AI Intent Library – Instyle Hair Boutique

Chatbot & AI agent intents, utterances, and response templates for Nia, Orion, Blaze, and Nova.

---

## Intent: BOOK_APPOINTMENT

### Triggers (Utterances)
- "I want to book Middle & Side"
- "Can I get a slot tomorrow?"
- "I need an appointment ASAP"
- "Book me for Saturday 2 PM"
- "Do you have space next week?"
- "How do I book online?"

### Response Template
```
✅ Great! Let me get you set up.

🔹 Which service? (Middle & Side / Maphondo / Colour / Other)
🔹 When? (Today / Tomorrow / Next Sat / Specific date?)
🔹 Your name & phone?

→ Then I'll grab you a slot! [LINK TO CALENDAR]
```

### AI Agent (Nia)
- Check availability in real-time from `appointments` table
- Suggest "most popular" slots (high-demand times)
- For TUT persona: Highlight student discount times
- For professional: Suggest evening/weekend slots
- Upsell: "Want to add Argan Oil serum to your install? Only R 280 more."

---

## Intent: CHECK_PRICE

### Triggers (Utterances)
- "How much is the 16-inch wig?"
- "What's the cost of a full head colour?"
- "Do you have payment plans?"
- "Can I pay with PayFast?"
- "Is there a student discount?"

### Response Template
```
💰 Here's the breakdown:

[SERVICE]: R [PRICE]
Duration: [TIME]
Add-ons: [OPTIONAL EXTRAS]

💳 Payment methods:
✅ Card, Apple Pay, PayFast, Cash, Loyalty points

🎓 Student discount: 10 % Mon–Fri 9 AM–2 PM
⚡ Off-peak special: [SERVICE] R [REDUCED] Tuesdays

Ready to book? → [LINK]
```

### AI Agent (Orion)
- Fetch price from `services` & `products` tables
- Auto-suggest bundle savings (if applicable)
- For high-value persona: Offer "first-time" discount
- For lapsed customer: Offer "win-back" percentage

---

## Intent: CHECK_HOURS

### Triggers (Utterances)
- "Are you open Sunday?"
- "What time do you close today?"
- "When's the latest I can book?"
- "Do you work weekends?"
- "Hours on Saturday?"

### Response Template
```
🕐 Our Hours:

Mon–Fri: 09:00–18:00 (last booking 16:00)
Sat: 08:00–16:00 (last booking 14:00)
Sun: 09:00–14:00 (appointment only, last booking 12:00)

🎄 [IF HOLIDAY]: [Holiday] 09:00–15:00

Ready to book? → [LINK]
```

### AI Agent (Nia)
- Always check `hours.md` for current date
- If Sunday: auto-add "by appointment only" caveat
- If holiday: alert "limited hours available"
- Recommend next available slot if requested time is closed

---

## Intent: CHECK_AVAILABILITY

### Triggers (Utterances)
- "What slots do you have for tomorrow?"
- "Is 2 PM available Saturday?"
- "Show me free times next week"
- "When can I get in?"

### Response Template
```
📅 Available slots for [DATE]:

🕐 [TIME 1] – Middle & Side (60 min)
🕐 [TIME 2] – Colour (120 min)
🕐 [TIME 3] – Wash & Blow Wave (45 min)
🕐 [TIME 4] – Installation (60 min)

[ONLY 2 SLOTS LEFT FOR SATURDAY – BOOK FAST!]

→ Pick your slot: [CALENDAR LINK]
```

### AI Agent (Nia)
- Query `appointments` table for booked times
- Cross-reference with `hours.md` for open times
- Highlight **"Last 2 slots!"** if urgency applies
- For repeat customers: Show previous service times (pattern recognition)

---

## Intent: CANCEL_APPOINTMENT

### Triggers (Utterances)
- "I need to cancel my appointment"
- "Can I reschedule?"
- "Cancel my 2 PM slot"
- "I can't make it tomorrow"

### Response Template
```
😔 No problem! Let's fix this.

🔹 Your name/phone?
→ I'll pull up your appointment

Free cancellation up to 24 h before.
Late cancellation = 50 % fee.

[SEND CANCELLATION LINK]

Want to rebook? → [CALENDAR]
```

### AI Agent (Nia)
- Check cancellation policy: < 24 h = warning
- Auto-send cancellation link via SMS
- If customer reschedules immediately: "Switch your time? Just pick a new slot here → [LINK]"
- Incentivize re-booking: "Reschedule this week and get 10 % off!"

---

## Intent: LOYALTY_POINTS

### Triggers (Utterances)
- "How many points do I have?"
- "What's my loyalty balance?"
- "Can I use points to pay?"
- "How do I earn points?"

### Response Template
```
🎁 Your Loyalty Balance:

💳 [POINTS] points = R [VALUE] credit

✅ Earn: 1 point per R 1 spent
✅ Redeem: 500 points = R 50 off
✅ Auto-apply: Points used at checkout

Next milestone: [POINTS NEEDED] more for next discount!

→ Book now & earn: [LINK]
```

### AI Agent (Nia / Orion)
- Query `profiles.loyalty_points` by phone/email
- Show "points to next reward" (motivational)
- Auto-apply points at checkout if available
- For near-milestone: "You're so close! 50 more points = R 50 off. Book Colour this week!"

---

## Intent: PRODUCT_INFO

### Triggers (Utterances)
- "Do you sell wigs?"
- "Tell me about the Argan Oil"
- "What hair bundles do you have?"
- "Is that 16-inch wig in stock?"

### Response Template
```
💄 Product: [NAME]

📝 Details: [DESCRIPTION]
💰 Price: R [PRICE]
📦 Stock: [QTY] in stock

✅ Perfect for: [USE CASE]
📍 Get it: In-salon or online → [LINK]

Bundle deal? [If applicable] → [LINK]
```

### AI Agent (Orion)
- Query `products` table by name/keyword
- Show stock status (green = plenty, yellow = < 5, red = pre-order)
- Recommend bundles with 13–16 % savings
- For low stock: "Only [N] left—order now before we restock!"

---

## Intent: STAFF_REQUEST

### Triggers (Utterances)
- "Can I request Zindzi?"
- "Who does Maphondo the best?"
- "Can I get the same stylist as last time?"
- "Do you have a specialist for colour?"

### Response Template
```
👩‍💼 Staff Specializations:

🔹 **Zindzi Langa** – Maphondo Expert
🔹 **Noma** – Colour & Treatments
🔹 **Team** – All stylists trained in all services

Prefer someone specific? Add a note when booking:
→ [LINK] → "Booking Notes" → [NAME]

We'll confirm!
```

### AI Agent (Nia)
- Query `staff` table for availability/specialization
- Suggest specialist for service type
- If repeat customer: "You loved working with [STYLIST] last time—want to book with them again?"
- Confirm staff availability before finalizing slot

---

## Intent: ALLERGY_CONCERN

### Triggers (Utterances)
- "I'm allergic to sulfates"
- "I have sensitive scalp"
- "Do you have sulfate-free products?"
- "Can I bring my own products?"

### Response Template
```
💚 We've got you!

✅ All products: Sulfate & paraben-free
✅ Hypoallergenic: Safe for sensitive scalp
✅ Your products: Bring & use if preferred

Please mention allergies in booking notes or tell your stylist before we start.

→ Book now & note allergies: [LINK]
```

### AI Agent (Nia)
- Flag allergies in `appointments.notes`
- Alert stylists pre-appointment
- Recommend sulfate-free products in post-booking follow-up
- Example: "You mentioned sulfate sensitivity—here's our Repair Shampoo (sulfate-free). R 220 → [LINK]"

---

## Intent: BRIDAL_PACKAGE

### Triggers (Utterances)
- "Can you do my wedding hair?"
- "I need bridal glam"
- "Do you offer trial sessions?"
- "Package pricing for wedding party?"

### Response Template
```
💒 Bridal Packages at Instyle

✨ **Bride's Glam Session** (2–3 h): R 1 500+
✨ **Trial Session** (1 h): Free with full booking
✨ **Bridesmaid Discount**: 10–20 % for 3+ people
✨ **Venue Service**: R 300 + travel fee

🔹 When? (Date & time?)
🔹 How many?
→ Let's customize! Contact Zanele directly:

📧 zanele@instyle.co.za
📱 064 769 6159
```

### AI Agent (Nia / Blaze)
- Route bridal inquiries to email/WhatsApp (custom quote needed)
- Suggest "Trial session first" (build confidence)
- Auto-send bridal package PDF via email
- Follow up post-booking: "Remember: complimentary consultations before the big day!"

---

## Intent: GENERAL_FAQ

### Triggers (Utterances)
- "How do I maintain my wig?"
- "How long does colour last?"
- "Can I use PayFast?"
- "Do you have parking?"

### Response Template
```
❓ Common Questions:

[ANSWER 1]
[ANSWER 2]
[ANSWER 3]

💬 Can't find your answer? 
→ WhatsApp Zanele: 064 769 6159
→ Email: zanele@instyle.co.za
```

### AI Agent (Nia / Orion)
- Pull from `faq.md` by keyword matching
- If question not found: Route to WhatsApp (human agent takes over)
- Log unanswered questions for FAQ updates

---

## Intent: MARKETING_CAMPAIGN

### Triggers (From Blaze Agent)
- Low booking volume on specific day
- Slow product sales
- Lapsed customer re-engagement

### Response Template (Blaze → Customer)
```
🌟 Special Offer Just For You!

[HOOK: "We miss you" / "Weekend flash deal" / "New product launch"]

✨ [SERVICE/PRODUCT]: [REDUCED PRICE] (was R [ORIGINAL])
⏰ Valid: [DATE RANGE]
🎁 Loyalty bonus: [EXTRA POINTS]

→ Book / Shop now: [LINK]

Only [N] slots left! 🔥
```

### AI Agent (Blaze)
- Analyze booking data; identify low-traffic times
- Generate personalized campaign copy
- Segment by persona (different offers for TUT vs. Professional)
- A/B test: "We miss you" vs. "Exclusive offer" subject lines

---

## Intent: ANALYTICS_QUERY

### Triggers (From Nova Agent)
- "What was revenue last week?"
- "Which service is most popular?"
- "How many no-shows this month?"
- "Which time slots are busiest?"

### Response Template (Nova → Internal Dashboard)
```
📊 Analytics Report – [DATE RANGE]

📈 Revenue: R [AMOUNT] (+/- X% vs last period)
🔥 Top Service: [SERVICE] (N bookings)
👥 Top Persona: [PERSONA] (N % of bookings)
⏰ Peak Time: [TIME] (Sat 11 AM)
❌ No-Show Rate: X%

⚠️ Alerts:
- [SERVICE] down 20% – recommend promotion
- [PERSONA] churn up 15% – win-back campaign needed

→ Recommendations: [AUTO-GENERATED TACTICS]
```

### AI Agent (Nova)
- Query `appointments`, `payments`, `profiles` tables
- Calculate KPIs: revenue, conversion rate, no-show %, average booking value
- Identify trends & anomalies
- Auto-generate recommendations (e.g., "Run Maphondo promo on Tuesdays")

---

## Fallback Responses

### If AI can't answer:
```
🤔 I'm not sure about that one!

Here's how I can help:
→ Book an appointment
→ Check prices & hours
→ View products
→ Track loyalty points

Still stuck? Hit up Zanele directly:
📱 WhatsApp: 064 769 6159
📧 Email: zanele@instyle.co.za

She'll take care of you! 💕
```

---

## Last Updated
**December 10, 2024**
