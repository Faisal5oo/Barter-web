# BarterX Frontend

## Recent Updates

### Dark Mode Visibility Fixes
- Fixed category cards on homepage to use theme-aware backgrounds
- Updated ProductCard badges to support dark mode colors  
- Fixed hardcoded white/black colors in multiple components
- Improved contrast for better accessibility in dark mode

### Sold Product Functionality
- Added `isSold` and `soldDate` properties to product interface
- Products automatically marked as sold when offers are accepted
- Sold products show overlay with "SOLD" label
- Sold products disabled for new offers/bartering
- Products auto-removed from listings after 24 hours of being sold
- Added backend API endpoints for marking products as sold/available

### Components Updated
- `ProductCard` - Dark mode badge colors, sold overlay
- `ProductPage` - Disabled barter for sold products
- `OffersPage` - Auto-mark products as sold on offer acceptance
- `Index` - Fixed category card backgrounds
- `HelpPage` - Fixed search input colors

### Testing Dark Mode
1. Click the moon/sun icon in the navbar to toggle dark mode
2. Check category cards on homepage are visible
3. Verify product badges have proper contrast
4. Test sold product functionality by accepting an offer

### API Integration
The frontend now integrates with these new backend endpoints:
- `PUT /products/:id/mark-as-sold` - Mark product as sold
- `PUT /products/:id/mark-as-available` - Mark product as available
- Enhanced offer acceptance to automatically mark products as sold 