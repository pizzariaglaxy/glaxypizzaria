(() => {
  const parseTenantFromUrl = () => {
    try {
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('tenant');
      if (qp && qp.trim()) return qp.trim().toLowerCase();
      const host = (window.location.hostname || '').toLowerCase();
      const parts = host.split('.').filter(Boolean);
      if (parts.length >= 3) return parts[0];
      return null;
    } catch {
      return null;
    }
  };

  const tenantId = parseTenantFromUrl() || 'glaxy';

  const BUILTIN_TENANTS = {
    default: {
      name: 'PizzaOS',
      shortName: 'PizzaOS',
      logo: null,
      logoName: null,
      theme: { navBg: '#111827', navFg: '#ffffff', accent: '#facc15', primary: '#dc2626' }
    },
    glaxy: {
      name: 'Glaxy Pizzaria Delivery',
      shortName: 'GLAXY',
      logo: 'src/public/assets/logo/logo_glaxy.png',
      logoName: 'src/public/assets/logo/logo_name.png',
      theme: { navBg: '#0b0f19', navFg: '#ffffff', accent: '#facc15', primary: '#dc2626' }
    }
  };

  const tenant = {
    id: tenantId,
    storagePrefix: `tenant:${tenantId}:`,
    name: 'PizzaOS',
    shortName: 'PizzaOS',
    logo: null,
    logoName: null,
    theme: null
  };

  const applyBuiltin = (id) => {
    const cfg = BUILTIN_TENANTS[id] || BUILTIN_TENANTS.default;
    if (cfg && typeof cfg === 'object') Object.assign(tenant, cfg);
  };

  const fetchTenantConfig = async () => {
    const tryFetch = async (id) => {
      const res = await fetch(`src/tenants/${id}/tenant.json`, { cache: 'no-store' });
      if (!res.ok) return null;
      return res.json();
    };

    const cfg = (await tryFetch(tenantId)) || (await tryFetch('default'));
    if (cfg && typeof cfg === 'object') Object.assign(tenant, cfg, { id: tenantId, storagePrefix: `tenant:${tenantId}:` });
    return tenant;
  };

  const applyTenantBranding = () => {
    const t = tenant;
    if (t.theme && typeof t.theme === 'object') {
      const root = document.documentElement;
      if (t.theme.navBg) root.style.setProperty('--tenant-nav-bg', t.theme.navBg);
      if (t.theme.navFg) root.style.setProperty('--tenant-nav-fg', t.theme.navFg);
      if (t.theme.accent) root.style.setProperty('--tenant-accent', t.theme.accent);
      if (t.theme.primary) root.style.setProperty('--tenant-primary', t.theme.primary);
    }

    const logoEl = document.getElementById('tenant-logo');
    if (logoEl && t.logo) {
      logoEl.src = t.logo;
      logoEl.alt = t.shortName || t.name || 'Logo';
      logoEl.classList.remove('hidden');
    }

    const logoNameEl = document.getElementById('tenant-logo-name');
    if (logoNameEl && t.logoName) {
      logoNameEl.src = t.logoName;
      logoNameEl.alt = t.shortName || t.name || 'Marca';
      logoNameEl.classList.remove('hidden');
    }

    const titleEl = document.getElementById('tenant-title');
    if (titleEl) {
      if (t.logoName) {
        titleEl.classList.add('hidden');
      } else {
        titleEl.classList.remove('hidden');
        titleEl.textContent = t.shortName || t.name || 'PizzaOS';
      }
    }

    const docTitle = t.name ? `${t.name} - PizzaOS` : 'PizzaOS';
    document.title = docTitle;
  };

  window.__PIZZAOS_TENANT__ = tenant;
  window.pizzaosGetTenant = () => window.__PIZZAOS_TENANT__;
  window.pizzaosApplyTenantBranding = applyTenantBranding;
  applyBuiltin(tenantId);
  window.pizzaosTenantReady = fetchTenantConfig().then(() => {
    if (document.readyState === 'loading') return;
    applyTenantBranding();
  }).catch(() => {
    if (document.readyState !== 'loading') applyTenantBranding();
    return tenant;
  });
})();

