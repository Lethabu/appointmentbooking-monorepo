# 🔧 SuperSaaS Configuration Guide - Instyle Hair Boutique

## 📋 **CURRENT CONFIGURATION STATUS**

### **Main Schedule Details**
- **Schedule Name**: `Instyle Hair Boutique`
- **API Key**: `5ciPW7IzfQRQy1wqdTsH6g`
- **Integration**: Active dual-sync with website
- **Status**: ✅ Operational

---

## 🎯 **REQUIRED CONFIGURATION UPDATES**

### **STEP 1: Verify Main Schedule Services**

Login to SuperSaaS Admin Panel and ensure these **6 services** are configured exactly:

| Service Name | Price | Duration | Description |
|--------------|-------|----------|-------------|
| **Middle & Side Installation** | R450 | 180 min | Professional hair installation service for middle and side parts |
| **Maphondo & Lines** | R350 | 120 min | Traditional African hairstyling with intricate patterns |
| **Hair Treatment** | R250 | 90 min | Deep conditioning and nourishing hair treatment |
| **Hair Coloring** | R550 | 150 min | Professional hair coloring and highlighting services |
| **Hair Extensions** | R650 | 240 min | Premium hair extension installation and styling |
| **Wash & Style** | R150 | 60 min | Complete hair wash, conditioning, and styling service |

### **STEP 2: Business Information Verification**

Ensure these details are identical in SuperSaaS:

```
Business Name: Instyle Hair Boutique
Phone: +27 123 456 789
Email: bookings@instylehairboutique.co.za
Website: https://www.instylehairboutique.co.za
Address: Cape Town, South Africa
Timezone: Africa/Johannesburg
Currency: ZAR (South African Rand)
```

### **STEP 3: Business Hours Configuration**

```
Monday:    09:00 - 17:00
Tuesday:   09:00 - 17:00
Wednesday: 09:00 - 17:00
Thursday:  09:00 - 17:00
Friday:    09:00 - 17:00
Saturday:  08:00 - 16:00
Sunday:    Closed
```

---

## 👥 **EMPLOYEE SCHEDULE CREATION**

### **Create 4 Duplicate Schedules**

For each employee, create a **duplicate schedule** with identical services:

#### **Employee 1: Thandi Mthembu (Senior Stylist)**
- **Schedule Name**: `Instyle Hair Boutique - Thandi Mthembu`
- **Services**: All 6 services (identical pricing)
- **Availability**: 
  - Mon-Fri: 09:00-17:00
  - Saturday: 08:00-16:00
  - Sunday: Closed

#### **Employee 2: Nomsa Dlamini (Hair Treatment Specialist)**
- **Schedule Name**: `Instyle Hair Boutique - Nomsa Dlamini`
- **Services**: All 6 services (identical pricing)
- **Availability**: 
  - Mon-Fri: 09:00-17:00
  - Saturday: 08:00-14:00
  - Sunday: Closed

#### **Employee 3: Zanele Khumalo (Traditional Stylist)**
- **Schedule Name**: `Instyle Hair Boutique - Zanele Khumalo`
- **Services**: All 6 services (identical pricing)
- **Availability**: 
  - Monday: 10:00-17:00
  - Tue-Fri: 09:00-17:00
  - Saturday: 08:00-16:00
  - Sunday: Closed

#### **Employee 4: Precious Ndaba (Junior Stylist)**
- **Schedule Name**: `Instyle Hair Boutique - Precious Ndaba`
- **Services**: All 6 services (identical pricing)
- **Availability**: 
  - Mon-Fri: 09:00-16:00
  - Saturday: 09:00-15:00
  - Sunday: Closed

---

## 🔄 **DUPLICATION PROCESS**

### **Method 1: Manual Duplication**
1. Go to **Schedule Settings** → **Duplicate Schedule**
2. Rename to include employee name
3. Update availability hours for each employee
4. Verify all services copied correctly

### **Method 2: Template-Based Creation**
1. Use main schedule as template
2. Create new schedule for each employee
3. Copy all resources/services
4. Set individual working hours

---

## 📊 **DATA PRESERVATION REQUIREMENTS**

### **CRITICAL: Maintain All Existing Data**
- ✅ **All historical bookings** must remain intact
- ✅ **Client database** must be preserved and shared
- ✅ **Future appointments** must remain valid
- ✅ **Payment records** must be maintained
- ✅ **Customer contact information** must be accessible

### **Shared Client Database**
- All 5 schedules (main + 4 employees) share the same client database
- Customers can book with any available employee
- Booking history visible across all schedules

---

## 🔧 **TECHNICAL INTEGRATION**

### **API Configuration**
```javascript
SUPERSAAS_CONFIG = {
  API_KEY: '5ciPW7IzfQRQy1wqdTsH6g',
  MAIN_SCHEDULE: 'Instyle Hair Boutique',
  EMPLOYEE_SCHEDULES: [
    'Instyle Hair Boutique - Thandi Mthembu',
    'Instyle Hair Boutique - Nomsa Dlamini', 
    'Instyle Hair Boutique - Zanele Khumalo',
    'Instyle Hair Boutique - Precious Ndaba'
  ]
}
```

### **Website Integration Points**
- Booking form syncs to main schedule
- Dashboard pulls from all 5 schedules
- Client notifications work across all schedules
- Revenue tracking aggregates all bookings

---

## ✅ **VERIFICATION CHECKLIST**

### **Pre-Configuration Audit**
- [ ] Login to SuperSaaS admin panel
- [ ] Verify main schedule exists and is active
- [ ] Check current service configuration
- [ ] Backup existing booking data
- [ ] Note current client count

### **Service Configuration Check**
- [ ] Middle & Side Installation: R450, 180min ✓
- [ ] Maphondo & Lines: R350, 120min ✓
- [ ] Hair Treatment: R250, 90min ✓
- [ ] Hair Coloring: R550, 150min ✓
- [ ] Hair Extensions: R650, 240min ✓
- [ ] Wash & Style: R150, 60min ✓

### **Employee Schedule Creation**
- [ ] Thandi Mthembu schedule created ✓
- [ ] Nomsa Dlamini schedule created ✓
- [ ] Zanele Khumalo schedule created ✓
- [ ] Precious Ndaba schedule created ✓
- [ ] All services copied to each schedule ✓
- [ ] Individual availability set ✓

### **Integration Testing**
- [ ] Website booking creates SuperSaaS appointment ✓
- [ ] Dashboard shows bookings from all schedules ✓
- [ ] Client database shared across schedules ✓
- [ ] Email notifications working ✓
- [ ] Payment tracking functional ✓

---

## 🚨 **IMPORTANT NOTES**

### **Service Pricing Consistency**
- **CRITICAL**: All 5 schedules must have identical pricing
- Any price changes must be updated across all schedules
- Website prices must match SuperSaaS exactly

### **Availability Management**
- Each employee manages their own schedule availability
- Main schedule can be used for general bookings
- Customers can choose specific employees or "any available"

### **Client Communication**
- All schedules share the same client database
- Booking confirmations come from main business email
- Customer history visible regardless of which employee they book

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **If Issues Occur**
1. **Check API connectivity**: Test with main schedule first
2. **Verify service alignment**: Compare website vs SuperSaaS pricing
3. **Test booking flow**: Create test appointment from website
4. **Check dual-sync**: Verify appointments appear in both systems

### **Emergency Contacts**
- **SuperSaaS Support**: support@supersaas.com
- **Technical Issues**: Check API key and schedule IDs
- **Business Continuity**: Main schedule remains operational during setup

---

## ✨ **CONFIGURATION COMPLETE**

Once all steps are completed:
1. **5 total schedules** (1 main + 4 employees)
2. **Identical services** across all schedules
3. **Shared client database**
4. **Individual availability** per employee
5. **Seamless website integration**

**Result**: Customers can book with any available employee while maintaining unified business operations and data integrity.