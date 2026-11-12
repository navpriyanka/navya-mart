NAVYA MART ADMIN PANEL - FRONTEND STARTER

Folder contents:
- index.html: Admin page structure
- assets/css/admin.css: Responsive styles
- assets/js/admin.js: Navigation, dialog and toast helpers
- assets/js/dashboard.js: Dashboard placeholder
- assets/js/products.js: Product/category form preview
- assets/js/orders.js: Order page actions placeholder
- assets/js/customers.js: Customer/payment placeholder

INSTALL:
1. Extract this ZIP.
2. Upload the complete "admin" folder into the root of your existing navya-mart GitHub repository.
3. Keep the folder structure unchanged.
4. After GitHub Pages deployment, open:
   https://navpriyanka.github.io/navya-mart/admin/

IMPORTANT:
This is a frontend starter, not a production-connected admin system.
No real login, database writes, image upload, order retrieval, or payment processing is enabled.
Before production, connect the UI to authenticated Cloudflare Workers endpoints and Cloudflare D1/R2.
Never put API tokens, R2 credentials, or admin passwords in browser JavaScript.
Do not expose purchase_cost in customer-facing product API responses.
