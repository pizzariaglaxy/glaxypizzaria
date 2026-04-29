(() => {
  const getTenant = () => (window.pizzaosGetTenant && window.pizzaosGetTenant()) || { id: 'default', storagePrefix: 'tenant:default:' };
  const storageKey = (key) => {
    const t = getTenant();
    const prefix = t.storagePrefix || `tenant:${t.id}:`;
    return `${prefix}${key}`;
  };

  const redactSecrets = (settings) => {
    if (!settings || typeof settings !== 'object') return settings;
    const s = JSON.parse(JSON.stringify(settings));

    if (s.gateway && typeof s.gateway === 'object') {
      if ('secretKey' in s.gateway) s.gateway.secretKey = '';
      if ('otherToken' in s.gateway) s.gateway.otherToken = '';
    }

    if (s.pix && typeof s.pix === 'object') {
      if ('apiSecret' in s.pix) s.pix.apiSecret = '';
    }

    return s;
  };

  const DB = {
    init() {
      if (!localStorage.getItem(storageKey('pizzaos_products'))) {
        const initialProducts = [
          { id: 1, name: 'Calabresa Especial', desc: 'Mussarela, calabresa artesanal, cebola roxa e azeitonas.', price: 45.0, category: 'Salgada', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600' },
          { id: 2, name: 'Marguerita Premium', desc: 'Tomates frescos, bocconcini de búfala e manjericão.', price: 42.0, category: 'Vegetariana', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600' },
          { id: 3, name: 'Frango Catupiry', desc: 'Frango desfiado temperado e Catupiry original.', price: 48.0, category: 'Salgada', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600' },
          { id: 4, name: 'Quatro Queijos', desc: 'Gorgonzola, parmesão, provolone e mussarela.', price: 50.0, category: 'Salgada', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600' },
          { id: 5, name: 'Chocolate com Morango', desc: 'Ganache de chocolate meio amargo com morangos frescos.', price: 38.0, category: 'Doce', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600' },
          { id: 6, name: 'Coca-Cola 2L', desc: 'Refrigerante gelado.', price: 12.0, category: 'Bebida', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600' },
          { id: 7, name: 'Suco de Laranja 500ml', desc: 'Suco natural da fruta, feito na hora.', price: 10.0, category: 'Bebida', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600' }
        ];
        localStorage.setItem(storageKey('pizzaos_products'), JSON.stringify(initialProducts));
      }

      if (!localStorage.getItem(storageKey('pizzaos_orders'))) localStorage.setItem(storageKey('pizzaos_orders'), JSON.stringify([]));

      if (!localStorage.getItem(storageKey('pizzaos_employees'))) {
        const initialEmployees = [
          { id: 1, name: 'Administrador', role: 'admin', pin: '9999' },
          { id: 2, name: 'Chef Mario', role: 'kitchen', pin: '1111' },
          { id: 3, name: 'Atendente Julia', role: 'counter', pin: '2222' }
        ];
        localStorage.setItem(storageKey('pizzaos_employees'), JSON.stringify(initialEmployees));
      }

      if (!localStorage.getItem(storageKey('pizzaos_settings'))) {
        const defaultSettings = {
          methods: { cash: true, card: true, pix: true, crypto: true },
          pix: { mode: 'manual', key: '', apiKey: '', apiSecret: '' },
          crypto: { wallet: '' },
          gateway: { provider: 'mercadopago', publicKey: '', secretKey: '', otherUrl: '', otherToken: '' }
        };
        localStorage.setItem(storageKey('pizzaos_settings'), JSON.stringify(redactSecrets(defaultSettings)));
      }

      if (!localStorage.getItem(storageKey('pizzaos_categories'))) {
        const initialCats = ['Salgada', 'Vegetariana', 'Doce', 'Bebida'];
        localStorage.setItem(storageKey('pizzaos_categories'), JSON.stringify(initialCats));
      }

      if (!localStorage.getItem(storageKey('pizzaos_addons'))) {
        const initialAddons = [
          { id: 1, name: 'Cebola', type: 'remove', price: 0 },
          { id: 2, name: 'Azeitona', type: 'remove', price: 0 },
          { id: 3, name: 'Tomate', type: 'remove', price: 0 },
          { id: 4, name: 'Orégano', type: 'remove', price: 0 },
          { id: 5, name: 'Borda Catupiry', type: 'add', price: 5.0 },
          { id: 6, name: 'Borda Cheddar', type: 'add', price: 5.0 },
          { id: 7, name: 'Extra Bacon', type: 'add', price: 4.0 }
        ];
        localStorage.setItem(storageKey('pizzaos_addons'), JSON.stringify(initialAddons));
      }
    },

    getProducts() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_products'))); },
    getOrders() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_orders'))); },
    getEmployees() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_employees'))); },
    getSettings() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_settings'))); },
    getCategories() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_categories'))); },
    getAddons() { return JSON.parse(localStorage.getItem(storageKey('pizzaos_addons'))); },

    saveOrder(order) {
      const orders = this.getOrders();
      orders.push(order);
      localStorage.setItem(storageKey('pizzaos_orders'), JSON.stringify(orders));
      return order;
    },

    updateOrderStatus(id, status) {
      const orders = this.getOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        orders[idx].status = status;
        localStorage.setItem(storageKey('pizzaos_orders'), JSON.stringify(orders));
      }
    },

    saveProduct(product) {
      let list = this.getProducts();
      if (product.id) {
        const idx = list.findIndex((p) => p.id === parseInt(product.id));
        if (idx !== -1) list[idx] = { ...list[idx], ...product, id: parseInt(product.id) };
        else list.push({ ...product, id: Date.now() });
      } else {
        product.id = Date.now();
        list.push(product);
      }
      localStorage.setItem(storageKey('pizzaos_products'), JSON.stringify(list));
    },

    deleteProduct(id) {
      let products = this.getProducts();
      products = products.filter((p) => p.id !== id);
      localStorage.setItem(storageKey('pizzaos_products'), JSON.stringify(products));
    },

    saveEmployee(emp) {
      let list = this.getEmployees();
      if (emp.id) {
        const idx = list.findIndex((e) => e.id === parseInt(emp.id));
        if (idx !== -1) list[idx] = { ...list[idx], ...emp, id: parseInt(emp.id) };
        else list.push({ ...emp, id: Date.now() });
      } else {
        emp.id = Date.now();
        list.push(emp);
      }
      localStorage.setItem(storageKey('pizzaos_employees'), JSON.stringify(list));
    },

    deleteEmployee(id) {
      const list = this.getEmployees().filter((e) => e.id !== id);
      localStorage.setItem(storageKey('pizzaos_employees'), JSON.stringify(list));
    },

    saveSettings(settings) {
      localStorage.setItem(storageKey('pizzaos_settings'), JSON.stringify(redactSecrets(settings)));
    },

    saveCategory(name) {
      let cats = this.getCategories();
      if (!cats.includes(name)) {
        cats.push(name);
        localStorage.setItem(storageKey('pizzaos_categories'), JSON.stringify(cats));
      }
    },

    deleteCategory(name) {
      const cats = this.getCategories().filter((c) => c !== name);
      localStorage.setItem(storageKey('pizzaos_categories'), JSON.stringify(cats));
    },

    saveAddon(addon) {
      let list = this.getAddons();
      if (addon.id) {
        const idx = list.findIndex((a) => a.id === parseInt(addon.id));
        if (idx !== -1) list[idx] = { ...list[idx], ...addon, id: parseInt(addon.id) };
        else list.push({ ...addon, id: Date.now() });
      } else {
        addon.id = Date.now();
        list.push(addon);
      }
      localStorage.setItem(storageKey('pizzaos_addons'), JSON.stringify(list));
    },

    deleteAddon(id) {
      const list = this.getAddons().filter((a) => a.id !== id);
      localStorage.setItem(storageKey('pizzaos_addons'), JSON.stringify(list));
    }
  };

  window.pizzaosStorageKey = storageKey;
  window.DB = DB;
})();

