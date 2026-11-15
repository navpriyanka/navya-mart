

const ALLOWED_ORIGIN = "https://navpriyanka.github.io";



const CATALOG = {

  "1": { name: "Classic Colour Block Sweatshirt", price: 399 },

  "2": { name: "Kids Unicorn Style Backpack", price: 499 },

  "3": { name: "Elegant Daily Wear Saree", price: 699 },

  "4": { name: "Men Casual Cotton Shirt", price: 449 },

  "5": { name: "Modern Kitchen Storage Set", price: 329 },

  "6": { name: "Everyday Handbag", price: 549 },

  "7": { name: "Beauty Essentials Set", price: 299 },

  "8": { name: "Wireless Headphones", price: 799 }

};



function corsHeaders() {

  return {

    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,

    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",

    "Access-Control-Allow-Headers": "Content-Type, Authorization",

    "Access-Control-Max-Age": "86400",

    "Vary": "Origin"

  };

}



function json(data, status = 200) {

  return new Response(JSON.stringify(data), {

    status,

    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() }

  });

}



function cleanText(value, max) {

  return String(value ?? "").trim().slice(0, max);

}



function randomId() {

  return crypto.randomUUID().replaceAll("-", "");

}



function safeKey(key) {

  return String(key || "").replace(/[^a-zA-Z0-9.\_/-]/g, "").replace(/\\.\\./g, "");

}



export default {

  async fetch(request, env) {

    const origin = request.headers.get("Origin") || "";

    const url = new URL(request.url);



    if (origin && origin !== ALLOWED_ORIGIN)

      return new Response("Origin not allowed.", { status: 403 });



    if (request.method === "OPTIONS")

      return new Response(null, { status: 204, headers: corsHeaders() });



    if (!env.DB)

      return json({ ok: false, error: "D1 binding DB is missing." }, 500);



    // Health check

    if (request.method === "GET" && url.pathname === "/api/health") {

      try {

        await env.DB.prepare("SELECT 1 AS ok").first();

        return json({

          ok: true,

          service: "navya-mart-api",

          database: "connected",

          images: !!env.IMAGES

        });

      } catch {

        return json({ ok: false, error: "Database check failed." }, 500);

      }

    }



    // Image delivery

    if (request.method === "GET" && url.pathname.startsWith("/api/images/")) {

      if (!env.IMAGES)

        return new Response("Image storage is not configured.", { status: 500 });



      const key = safeKey(

        decodeURIComponent(url.pathname.slice("/api/images/".length))

      );



      if (!key) return new Response("Not found.", { status: 404 });



      const object = await env.IMAGES.get(key);

      if (!object) return new Response("Not found.", { status: 404 });



      const headers = new Headers(corsHeaders());

      headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");

      headers.set("Cache-Control", "public, max-age=86400");

      headers.set("ETag", object.httpEtag);



      return new Response(object.body, { headers });

    }



    // Public product list

    if (request.method === "GET" && url.pathname === "/api/products") {

      try {

        const { results = [] } = await env.DB.prepare(`

          SELECT p.id, p.name, p.slug, p.description, p.selling_price, p.stock,

                 p.main_image_key, p.gallery_images, p.is_active, p.sku, p.variants_json,

                 p.source, p.supplier_product_id, p.category_name,

                 COALESCE(p.category_name, c.name, 'Men') AS category

          FROM products p

          LEFT JOIN categories c ON c.id = p.category_id

          WHERE COALESCE(p.is_active, 1) = 1

          ORDER BY p.created_at DESC

        `).all();



        const items = results.map(p => {

          const keys = (() => {

            try { return JSON.parse(p.gallery_images || "[]"); }

            catch { return []; }

          })();



          return {

            id: String(p.id),

            name: p.name,

            description: p.description || "",

            category: p.category || "Men",

            sku: p.sku || "",

            source: p.source || "",

            supplier_product_id: p.supplier_product_id || "",

            is_active: Number(p.is_active ?? 1) === 1,

            price: Number(p.selling_price || 0),

            old: Number(p.selling_price || 0),

            discount: "",

            tag: "NEW",

            rating: "",

            image: p.main_image_key

              ? `${url.origin}/api/images/${encodeURIComponent(p.main_image_key)}`

              : "",

            images: keys.map(k =>

              `${url.origin}/api/images/${encodeURIComponent(k)}`

            ),

            variants: (() => {
              try {
                const data = JSON.parse(p.variants_json || "{}");
                return (data.colors || []).map(v => ({ color: typeof v === "string" ? v : v.color, imageIndex: Number(v.imageIndex || 0) }));
              } catch { return []; }
            })(),
            sizes: (() => {
              try { return JSON.parse(p.variants_json || "{}").sizes || []; }
              catch { return []; }
            })(),
            stock: Number(p.stock || 0)

          };

        });



        return json({ ok: true, products: items });

      } catch {

        return json({

          ok: false,

          error: "Products could not be loaded. Check products table columns."

        }, 500);

      }

    }



    // Admin product list

    if (request.method === "GET" && url.pathname === "/api/admin/products") {

      const auth = request.headers.get("Authorization") || "";



      if (!env.ADMIN_API_KEY || auth !== `Bearer ${env.ADMIN_API_KEY}`)

        return json({ ok: false, error: "Admin key सही नहीं है।" }, 401);



      try {

        const { results = [] } = await env.DB.prepare(`

          SELECT p.id, p.name, p.description, p.selling_price, p.purchase_cost,

                 p.stock, p.sku, p.source, p.supplier_product_id, p.category_name,

                 p.main_image_key, p.gallery_images, p.is_active, p.variants_json,

                 COALESCE(p.category_name, c.name, 'Men') AS category

          FROM products p

          LEFT JOIN categories c ON c.id = p.category_id

          ORDER BY p.created_at DESC

        `).all();



        const products = results.map(p => {

          const keys = (() => {

            try { return JSON.parse(p.gallery_images || "[]"); }

            catch { return []; }

          })();



          return {

            id: String(p.id),

            name: p.name,

            description: p.description || "",

            category: p.category || "Men",

            sku: p.sku || "",

            purchase_cost: Number(p.purchase_cost || 0),

            source: p.source || "",

            supplier_product_id: p.supplier_product_id || "",

            is_active: Number(p.is_active ?? 1) === 1,

            price: Number(p.selling_price || 0),

            stock: Number(p.stock || 0),

            image: p.main_image_key

              ? `${url.origin}/api/images/${encodeURIComponent(p.main_image_key)}`

              : "",

            images: keys.map(k =>

              `${url.origin}/api/images/${encodeURIComponent(k)}`

            ),
            variants: (() => {
              try {
                const data = JSON.parse(p.variants_json || "{}");
                return (data.colors || []).map(v => ({ color: typeof v === "string" ? v : v.color, imageIndex: Number(v.imageIndex || 0) }));
              } catch { return []; }
            })(),
            sizes: (() => {
              try { return JSON.parse(p.variants_json || "{}").sizes || []; }
              catch { return []; }
            })(),
          };

        });



        return json({ ok: true, products });

      } catch {

        return json({

          ok: false,

          error: "Admin products load नहीं हुए। D1 schema जाँचें।"

        }, 500);

      }

    }



    // Add new product

    if (request.method === "POST" && url.pathname === "/api/admin/products") {

      const auth = request.headers.get("Authorization") || "";



      if (!env.ADMIN_API_KEY || auth !== `Bearer ${env.ADMIN_API_KEY}`)

        return json({ ok: false, error: "Admin key सही नहीं है।" }, 401);



      if (!env.IMAGES)

        return json({ ok: false, error: "R2 binding IMAGES is missing." }, 500);



      if (!request.headers.get("Content-Type")?.includes("multipart/form-data"))

        return json({ ok: false, error: "Product form must use multipart/form-data." }, 415);



      let form;

      try {

        form = await request.formData();

      } catch {

        return json({ ok: false, error: "Invalid product form." }, 400);

      }



      const name = cleanText(form.get("name"), 160);

      const sku = cleanText(form.get("sku"), 80);

      const description = cleanText(form.get("description"), 3000);

      const category = cleanText(form.get("category"), 80);

      const source = cleanText(form.get("source"), 100);

      const supplierProductId = cleanText(form.get("supplier_product_id"), 120);

      const sellingPrice = Number(form.get("selling_price"));

      const purchaseCost = Number(form.get("purchase_cost") || 0);

      const stock = Number(form.get("stock") || 0);
      const colors = cleanText(form.get("colors"), 500).split(",").map(x => x.trim()).filter(Boolean).slice(0, 10);
      const sizes = cleanText(form.get("sizes"), 300).split(",").map(x => x.trim()).filter(Boolean).slice(0, 15);
      const colorVariants = colors.map((color, imageIndex) => ({ color, imageIndex }));

      const files = form.getAll("images").filter(f =>

        f && typeof f.arrayBuffer === "function" && f.size > 0

      );



      if (name.length < 2 || !Number.isFinite(sellingPrice) || sellingPrice <= 0 ||

          !Number.isFinite(purchaseCost) || purchaseCost < 0 ||

          !Number.isInteger(stock) || stock < 0) {

        return json({ ok: false, error: "नाम, कीमत, खरीद मूल्य और स्टॉक सही भरें।" }, 400);

      }



      if (files.length < 1 || files.length > 5)

        return json({ ok: false, error: "कम से कम 1 और अधिकतम 5 फोटो चुनें।" }, 400);



      if (files.some(f =>

        f.size > 5 * 1024 * 1024 ||

        !/^image\/(jpeg|png|webp)$/.test(f.type)

      )) {

        return json({

          ok: false,

          error: "हर फोटो JPG, PNG या WEBP हो और 5 MB से छोटी हो।"

        }, 400);

      }



      const uploaded = [];



      try {

        for (const file of files) {

          const ext = file.type === "image/png"

            ? "png"

            : file.type === "image/webp" ? "webp" : "jpg";



          const key = `products/${Date.now()}-${randomId()}.${ext}`;



          await env.IMAGES.put(key, await file.arrayBuffer(), {

            httpMetadata: { contentType: file.type }

          });



          uploaded.push(key);

        }



        const next = await env.DB.prepare(

          "SELECT COALESCE(MAX(CAST(id AS INTEGER)), 0) + 1 AS id FROM products"

        ).first();



        const id = String(next.id);



        await env.DB.prepare(`

          INSERT INTO products

          (id, name, slug, description, price, selling_price, purchase_cost,

           stock, sku, category_name, source, supplier_product_id,

           main_image_key, gallery_images, variants_json, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1,

                  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

        `).bind(

          id,

          name,

          name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),

          description,

          sellingPrice,

          sellingPrice,

          purchaseCost,

          stock,

          sku || null,

          category || null,

          source || null,

          supplierProductId || null,

          uploaded[0],
          JSON.stringify(uploaded),
          JSON.stringify({ colors: colorVariants, sizes })
        ).run();



        return json({

          ok: true,

          product: {

            id,

            name,

            selling_price: sellingPrice,

            stock,

            image: `${url.origin}/api/images/${encodeURIComponent(uploaded[0])}`

          },

          message: "प्रोडक्ट और फोटो सफलतापूर्वक सेव हो गए।"

        }, 201);



      } catch {

        await Promise.all(

          uploaded.map(k => env.IMAGES.delete(k).catch(() => null))

        );



        return json({

          ok: false,

          error: "प्रोडक्ट सेव नहीं हुआ। D1 products table/schema जाँचें।"

        }, 500);

      }

    }



    // Edit product / soft delete

    if (url.pathname.startsWith("/api/admin/products/") &&

        (request.method === "PUT" || request.method === "DELETE")) {



      const auth = request.headers.get("Authorization") || "";



      if (!env.ADMIN_API_KEY || auth !== `Bearer ${env.ADMIN_API_KEY}`)

        return json({ ok: false, error: "Admin key सही नहीं है।" }, 401);



      const id = decodeURIComponent(

        url.pathname.slice("/api/admin/products/".length)

      );



      if (!id)

        return json({ ok: false, error: "Product ID missing." }, 400);



      if (request.method === "DELETE") {

        await env.DB.prepare(

          "UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?"

        ).bind(id).run();



        return json({

          ok: true,

          message: "प्रोडक्ट inactive कर दिया गया।"

        });

      }



      if (!env.IMAGES)

        return json({ ok: false, error: "R2 binding IMAGES is missing." }, 500);



      const form = await request.formData();



      const name = cleanText(form.get("name"), 160);

      const category = cleanText(form.get("category"), 80);

      const source = cleanText(form.get("source"), 100);

      const supplier = cleanText(form.get("supplier_product_id"), 120);

      const sku = cleanText(form.get("sku"), 80);

      const description = cleanText(form.get("description"), 3000);

      const price = Number(form.get("selling_price"));

      const cost = Number(form.get("purchase_cost") || 0);

      const stock = Number(form.get("stock") || 0);
      const colors = cleanText(form.get("colors"), 500).split(",").map(x => x.trim()).filter(Boolean).slice(0, 10);
      const sizes = cleanText(form.get("sizes"), 300).split(",").map(x => x.trim()).filter(Boolean).slice(0, 15);
      const colorVariants = colors.map((color, imageIndex) => ({ color, imageIndex }));

      if (name.length < 2 || !Number.isFinite(price) || price <= 0 ||

          !Number.isFinite(cost) || cost < 0 ||

          !Number.isInteger(stock) || stock < 0) {

        return json({ ok: false, error: "प्रोडक्ट की जानकारी सही भरें।" }, 400);

      }



      const files = form.getAll("images").filter(f =>

        f && typeof f.arrayBuffer === "function" && f.size > 0

      );



      if (files.length > 5 || files.some(f =>

        f.size > 5 * 1024 * 1024 ||

        !/^image\/(jpeg|png|webp)$/.test(f.type)

      )) {

        return json({

          ok: false,

          error: "अधिकतम 5 JPG/PNG/WEBP फोटो (हर एक 5 MB तक) चुनें।"

        }, 400);

      }



      const uploaded = [];



      try {

        for (const file of files) {

          const ext = file.type === "image/png"

            ? "png"

            : file.type === "image/webp" ? "webp" : "jpg";



          const key = `products/${Date.now()}-${randomId()}.${ext}`;



          await env.IMAGES.put(key, await file.arrayBuffer(), {

            httpMetadata: { contentType: file.type }

          });



          uploaded.push(key);

        }



        const old = await env.DB.prepare(

          "SELECT main_image_key, gallery_images FROM products WHERE id = ?"

        ).bind(id).first();



        if (!old)

          return json({ ok: false, error: "Product नहीं मिला।" }, 404);



        const gallery = uploaded.length

          ? JSON.stringify(uploaded)

          : old.gallery_images;



        const main = uploaded.length

          ? uploaded[0]

          : old.main_image_key;



        await env.DB.prepare(`

          UPDATE products SET

            name = ?, slug = ?, description = ?, price = ?,

            selling_price = ?, purchase_cost = ?, stock = ?, sku = ?,

            category_name = ?, source = ?, supplier_product_id = ?,

            main_image_key = ?, gallery_images = ?, variants_json = ?,
              updated_at = CURRENT_TIMESTAMP

          WHERE id = ?

        `).bind(

          name,

          name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),

          description,

          price,

          price,

          cost,

          stock,

          sku || null,

          category || null,

          source || null,

          supplier || null,

          main,
          gallery,
          JSON.stringify({ colors: colorVariants, sizes }),
          id
        ).run();



        return json({

          ok: true,

          message: "प्रोडक्ट अपडेट हो गया।"

        });



      } catch {

        await Promise.all(

          uploaded.map(k => env.IMAGES.delete(k).catch(() => null))

        );



        return json({

          ok: false,

          error: "प्रोडक्ट अपडेट नहीं हुआ।"

        }, 500);

      }

    }



    // COD orders - existing checkout flow retained

    if (request.method === "POST" && url.pathname === "/api/orders") {

      if (request.headers.get("Content-Type")?.includes("application/json") !== true)

        return json({ ok: false, error: "Content-Type must be application/json." }, 415);



      let body;

      try {

        body = await request.json();

      } catch {

        return json({ ok: false, error: "Invalid JSON." }, 400);

      }



      const name = cleanText(body.name, 100);

      const phone = cleanText(body.phone, 10);

      const pin = cleanText(body.pin, 6);

      const address = cleanText(body.address, 600);

      const incomingItems = Array.isArray(body.items) ? body.items : [];



      if (name.length < 2)

        return json({ ok: false, error: "पूरा नाम सही भरें।" }, 400);



      if (!/^[6-9]\d{9}$/.test(phone))

        return json({ ok: false, error: "10 अंकों का सही मोबाइल नंबर भरें।" }, 400);



      if (!/^\d{6}$/.test(pin))

        return json({ ok: false, error: "6 अंकों का सही PIN Code भरें।" }, 400);



      if (address.length < 8)

        return json({ ok: false, error: "पूरा पता लिखें।" }, 400);



      if (incomingItems.length < 1 || incomingItems.length > 30)

        return json({ ok: false, error: "Cart खाली है या उसमें बहुत अधिक items हैं।" }, 400);



      const items = [];

      let total = 0;



      for (const raw of incomingItems) {

        const id = String(raw?.id ?? "");

        const quantity = Number(raw?.quantity);
        const selectedColor = cleanText(raw?.color, 60);
        const selectedSize = cleanText(raw?.size, 30);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)

          return json({ ok: false, error: "Cart में अमान्य quantity है।" }, 400);



        let product = null;



        try {

          product = await env.DB.prepare(

            "SELECT id, name, selling_price AS price, stock, variants_json FROM products WHERE id = ? AND is_active = 1 LIMIT 1"

          ).bind(id).first();

        } catch {}



        if (!product && CATALOG[id])

          product = { id, ...CATALOG[id], stock: 9999 };



        if (!product || Number(product.stock) < quantity)

          return json({

            ok: false,

            error: "यह प्रोडक्ट उपलब्ध नहीं है या पर्याप्त स्टॉक नहीं है।"

          }, 400);



        const price = Number(product.price);

        const lineTotal = price * quantity;



        total += lineTotal;

        items.push({ id, quantity, price, lineTotal });

      }



      if (!Number.isSafeInteger(total) || total <= 0 || total > 200000)

        return json({ ok: false, error: "Order amount is invalid." }, 400);



      const orderId = randomId();



      const orderNumber = "NM-" +

        new Date().toISOString().slice(0, 10).replaceAll("-", "") +

        "-" + crypto.randomUUID().slice(0, 6).toUpperCase();



      try {

        let customer = await env.DB.prepare(

          "SELECT id FROM customers WHERE mobile = ? LIMIT 1"

        ).bind(phone).first();



        if (customer) {

          await env.DB.prepare(

            "UPDATE customers SET full_name = ?, address = ?, pincode = ? WHERE id = ?"

          ).bind(name, address, pin, customer.id).run();



        } else {

          const customerId = randomId();



          await env.DB.prepare(

            "INSERT INTO customers (id, full_name, mobile, address, pincode) VALUES (?, ?, ?, ?, ?)"

          ).bind(customerId, name, phone, address, pin).run();



          customer = { id: customerId };

        }



        const statements = [

          env.DB.prepare(`

            INSERT INTO orders

            (id, customer_id, order_number, total_amount, order_status,

             payment_status, payment_method, shipping_address, mobile)

            VALUES (?, ?, ?, ?, 'pending', 'pending', 'COD', ?, ?)

          `).bind(

            orderId, customer.id, orderNumber, total, address, phone

          ),



          env.DB.prepare(`

            INSERT INTO payments

            (id, order_id, payment_method, amount, payment_status)

            VALUES (?, ?, 'COD', ?, 'pending')

          `).bind(randomId(), orderId, total)

        ];



        for (const item of items) {

          statements.push(env.DB.prepare(`

            INSERT INTO order_items

            (id, order_id, product_id, quantity, unit_price, total_price, variant_color, variant_size)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)

          `).bind(

            randomId(), orderId, item.id,

            item.quantity, item.price, item.lineTotal, item.color || null, item.size || null
          ));

        }



        await env.DB.batch(statements);



        return json({

          ok: true,

          orderNumber,

          orderId,

          paymentMethod: "COD",

          paymentStatus: "Pending",

          codCharge: 0,

          totalAmount: total,

          message: "आपका COD ऑर्डर सफलतापूर्वक दर्ज हो गया है।"

        }, 201);



      } catch {

        return json({

          ok: false,

          error: "ऑर्डर सेव नहीं हो सका। कृपया बाद में दोबारा कोशिश करें।"

        }, 500);

      }

    }



    return json({ ok: false, error: "Not found." }, 404);

  }

};
