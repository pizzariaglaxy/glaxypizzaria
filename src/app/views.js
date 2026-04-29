(() => {
  const registerViews = (app) => {
    const DB = window.DB;

    app.router.views = {
      home: () => {
        let products = DB.getProducts();
        let categories = DB.getCategories();

        if (app.activeCategory !== 'all') {
          products = products.filter((p) => {
            return p.category === app.activeCategory;
          });
        }

        const getBtnClass = (cat) => app.activeCategory === cat
          ? 't-bg-primary text-white shadow-md transform scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200';

        return `
                            <div class="fade-in max-w-6xl mx-auto pb-10">
                                ${app.currentRole === 'counter'
            ? `<div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
                                    <p class="font-bold">Modo PDV Ativo</p>
                                    <p>Selecione os itens abaixo para montar o pedido do cliente no balcão.</p>
                                   </div>`
            : `<div class="relative bg-gray-900 rounded-2xl overflow-hidden mb-8 shadow-xl h-64 md:h-80">
                                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200" class="w-full h-full object-cover opacity-60">
                                    <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                                        <h2 class="text-4xl md:text-5xl font-bold mb-2">A Verdadeira Pizza</h2>
                                        <p class="text-lg md:text-xl text-gray-200 mb-6">Massa artesanal, ingredientes frescos e muito sabor.</p>
                                        <button onclick="document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'})" class="t-btn-accent font-bold py-3 px-8 rounded-full transition transform hover:scale-105">Ver Cardápio</button>
                                    </div>
                                   </div>`
          }

                                <div id="menu-section" class="flex flex-col md:flex-row justify-between items-center mb-6 sticky top-0 bg-gray-100 z-10 py-4">
                                    <h3 class="text-2xl font-bold text-gray-800">Cardápio</h3>
                                    <div class="flex gap-2 mt-4 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                                        <button onclick="app.setCategory('all')" class="px-5 py-2 rounded-full text-sm font-semibold transition duration-200 ${getBtnClass('all')}">Todos</button>
                                        ${categories.map((cat) => `
                                            <button onclick="app.setCategory('${cat}')" class="px-5 py-2 rounded-full text-sm font-semibold transition duration-200 ${getBtnClass(cat)} whitespace-nowrap">${cat}</button>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                    ${products.length > 0 ? products.map((p) => `
                                        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group">
                                            <div class="relative h-48 overflow-hidden">
                                                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                                                <span class="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">${p.category}</span>
                                            </div>
                                            <div class="p-5">
                                                <div class="flex justify-between items-start mb-2">
                                                    <h4 class="font-bold text-lg text-gray-800 leading-tight">${p.name}</h4>
                                                    <span class="font-bold t-text-primary text-lg">R$ ${p.price.toFixed(2)}</span>
                                                </div>
                                                <p class="text-gray-500 text-sm mb-4 h-10 overflow-hidden">${p.desc}</p>
                                                <button onclick="app.productModal.open(${p.id})" class="w-full t-btn-primary font-bold py-2 rounded-lg transition flex items-center justify-center gap-2">
                                                    <i class="fa-solid fa-cart-plus"></i> Adicionar
                                                </button>
                                            </div>
                                        </div>
                                    `).join('') : '<div class="col-span-3 text-center py-10 text-gray-500">Nenhum produto encontrado nesta categoria.</div>'}
                                </div>
                            </div>
                        `;
      },

      checkout: () => {
        const total = app.cart.reduce((acc, item) => acc + (item.finalPrice * item.qty), 0);
        const settings = DB.getSettings();

        if (app.cart.length === 0) return `<div class="text-center mt-20 fade-in"><h2 class="text-2xl font-bold mb-4">Seu carrinho está vazio :(</h2><button onclick="app.router.go('home')" class="t-text-primary underline">Voltar ao cardápio</button></div>`;

        return `
                            <div class="max-w-4xl mx-auto fade-in pb-24 md:pb-10">
                                <h2 class="text-3xl font-bold mb-6 flex items-center gap-2"><i class="fa-solid fa-check-circle text-green-600"></i> Finalizar Pedido</h2>
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div class="lg:col-span-2 space-y-6">
                                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 class="text-lg font-bold mb-4 border-b pb-2">1. Tipo de Pedido</h3>
                                            <div class="flex flex-col sm:flex-row gap-4">
                                                <label class="flex-1 cursor-pointer">
                                                    <input type="radio" name="orderType" value="delivery" class="peer t-peer hidden" checked onchange="app.checkoutLogic.toggleAddress(true)">
                                                    <div class="border-2 border-gray-200 t-peer-box rounded-lg p-4 text-center transition hover:bg-gray-50">
                                                        <i class="fa-solid fa-motorcycle text-2xl mb-2 text-gray-600 t-peer-icon"></i><div class="font-bold">Delivery</div>
                                                    </div>
                                                </label>
                                                <label class="flex-1 cursor-pointer">
                                                    <input type="radio" name="orderType" value="counter" class="peer t-peer hidden" onchange="app.checkoutLogic.toggleAddress(false)">
                                                    <div class="border-2 border-gray-200 t-peer-box rounded-lg p-4 text-center transition hover:bg-gray-50">
                                                        <i class="fa-solid fa-store text-2xl mb-2 text-gray-600 t-peer-icon"></i><div class="font-bold">Retirada/Balcão</div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 class="text-lg font-bold mb-4 border-b pb-2">2. Dados do Cliente</h3>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" id="custName" placeholder="Nome Completo *" class="w-full p-3 border rounded-lg outline-none">
                                                <input type="tel" id="custPhone" placeholder="WhatsApp (11) 99999-9999 *" class="w-full p-3 border rounded-lg outline-none">
                                            </div>
                                            <div id="address-section" class="mt-4 space-y-4">
                                                <div class="flex gap-2">
                                                    <input type="text" id="addrZip" placeholder="CEP" class="w-1/3 p-3 border rounded-lg">
                                                    <input type="text" id="addrStreet" placeholder="Rua/Av" class="w-2/3 p-3 border rounded-lg">
                                                </div>
                                                <div class="flex gap-2">
                                                    <input type="text" id="addrNum" placeholder="Número" class="w-1/3 p-3 border rounded-lg">
                                                    <input type="text" id="addrHood" placeholder="Bairro" class="w-2/3 p-3 border rounded-lg">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <h3 class="text-lg font-bold mb-4 border-b pb-2">3. Pagamento</h3>
                                            <select id="paymentMethod" class="w-full p-3 border rounded-lg mb-4 bg-white" onchange="app.checkoutLogic.handlePaymentChange(this.value)">
                                                <option value="" disabled selected>Selecione a forma de pagamento</option>
                                                ${settings.methods.pix ? '<option value="pix">Pix (QRCode)</option>' : ''}
                                                ${settings.methods.card ? '<option value="card">Cartão</option>' : ''}
                                                ${settings.methods.cash ? '<option value="cash">Dinheiro</option>' : ''}
                                                ${settings.methods.crypto ? '<option value="crypto">Criptomoeda (USDT/BTC)</option>' : ''}
                                            </select>
                                            <div id="pix-area" class="hidden bg-gray-50 p-4 rounded-lg border border-blue-200 mb-4 text-center">
                                                <p class="font-bold text-gray-700 mb-2">Chave Pix:</p>
                                                <p class="font-mono text-lg bg-white p-2 border rounded select-all text-blue-600 break-all">${settings.pix.mode === 'manual' ? settings.pix.key : 'Gerando QR Code via API...'}</p>
                                            </div>
                                            <div id="card-area" class="hidden bg-gray-50 p-4 rounded-lg border border-blue-200 mb-4 text-center">
                                                ${settings.gateway && settings.gateway.publicKey ? `<button class="w-full bg-blue-600 text-white font-bold py-3 rounded mb-2 hover:bg-blue-700"><i class="fa-regular fa-credit-card"></i> Pagar com ${settings.gateway.provider.toUpperCase()}</button>` : `<p class="font-bold text-gray-700">Máquina de Cartão</p>`}
                                            </div>
                                            <div id="cash-change" class="hidden">
                                                <label class="text-sm text-gray-600">Precisa de troco para quanto?</label>
                                                <input type="number" id="changeAmount" placeholder="Ex: 50,00" class="w-full p-3 border rounded-lg mt-1">
                                            </div>
                                            <div id="crypto-wallet" class="hidden bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm break-all">
                                                <p class="text-xs text-gray-400 mb-1">Rede TRC20 (USDT):</p>
                                                <span class="select-all block mb-2 break-all">${settings.crypto.wallet}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:border-none lg:shadow-none lg:p-0 z-40">
                                        <div class="lg:bg-white lg:p-6 lg:rounded-xl lg:shadow-lg lg:border lg:border-gray-200 lg:h-fit lg:sticky lg:top-24 max-w-4xl mx-auto lg:mx-0">
                                            <h3 class="text-xl font-bold mb-4 hidden lg:block">Resumo</h3>
                                            <div id="checkout-summary" class="hidden lg:block space-y-3 mb-4 max-h-60 overflow-y-auto">
                                                ${app.cart.map((item) => `
                                                    <div class="flex justify-between text-sm">
                                                        <span>${item.qty}x ${item.name}</span>
                                                        <span>R$ ${(item.finalPrice * item.qty).toFixed(2)}</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <div class="flex justify-between items-center mb-4 lg:border-t lg:pt-4">
                                                <div class="flex flex-col lg:flex-row lg:justify-between lg:w-full">
                                                    <span class="text-gray-600 text-sm lg:text-base">Total a Pagar</span>
                                                    <span class="text-2xl font-bold text-green-600 lg:text-xl">R$ ${total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <button onclick="app.checkoutLogic.placeOrder()" class="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                                                <span>CONFIRMAR PEDIDO</span>
                                                <i class="fa-solid fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="h-24 lg:hidden"></div>
                                </div>
                            </div>
                        `;
      },

      kds: () => { return app.router.views.admin(); },

      kds_view: () => {
        return `
                            <div class="fade-in h-full flex flex-col pb-10">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="text-3xl font-bold text-gray-800">Cozinha (KDS)</h2>
                                    <span class="text-sm bg-gray-200 px-3 py-1 rounded-full animate-pulse">Atualização em tempo real</span>
                                </div>
                                <div class="flex-1 overflow-x-auto">
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[800px] h-full pb-4">
                                        <div class="bg-gray-200 rounded-xl p-4 flex flex-col h-full"><h3 class="font-bold text-gray-700 mb-4 flex justify-between">PENDENTES <span id="count-received" class="bg-gray-400 text-white px-2 rounded text-sm">0</span></h3><div id="col-received" class="space-y-3 overflow-y-auto flex-1 pr-2"></div></div>
                                        <div class="bg-yellow-100 rounded-xl p-4 flex flex-col h-full"><h3 class="font-bold text-yellow-800 mb-4 flex justify-between">EM FORNO <span id="count-prep" class="bg-yellow-500 text-white px-2 rounded text-sm">0</span></h3><div id="col-prep" class="space-y-3 overflow-y-auto flex-1 pr-2"></div></div>
                                        <div class="bg-green-100 rounded-xl p-4 flex flex-col h-full"><h3 class="font-bold text-green-800 mb-4 flex justify-between">PRONTO/ENTREGA <span id="count-ready" class="bg-green-500 text-white px-2 rounded text-sm">0</span></h3><div id="col-ready" class="space-y-3 overflow-y-auto flex-1 pr-2"></div></div>
                                    </div>
                                </div>
                            </div>`;
      },

      admin: () => {
        const products = DB.getProducts();
        const employees = DB.getEmployees();
        const settings = DB.getSettings();
        const categories = DB.getCategories();
        const addons = DB.getAddons();
        const activeTab = app.adminLogic.activeTab || 'products';
        const tabClass = (tab) => activeTab === tab ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300';

        let reportsHtml = '';
        if (activeTab === 'reports') {
          reportsHtml = app.adminLogic.renderReports();
        }

        return `
                            <div class="fade-in max-w-6xl mx-auto pb-10">
                                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                    <h2 class="text-3xl font-bold">Administração</h2>
                                    <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                                        <button onclick="app.adminLogic.switchTab('products')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('products')}"><i class="fa-solid fa-pizza-slice mr-2"></i> Produtos</button>
                                        <button onclick="app.adminLogic.switchTab('categories')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('categories')}"><i class="fa-solid fa-tags mr-2"></i> Categorias</button>
                                        <button onclick="app.adminLogic.switchTab('addons')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('addons')}"><i class="fa-solid fa-carrot mr-2"></i> Adicionais</button>
                                        <button onclick="app.adminLogic.switchTab('employees')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('employees')}"><i class="fa-solid fa-users mr-2"></i> Equipe</button>
                                        <button onclick="app.adminLogic.switchTab('settings')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('settings')}"><i class="fa-solid fa-gear mr-2"></i> Config</button>
                                        <button onclick="app.adminLogic.switchTab('reports')" class="whitespace-nowrap px-4 py-2 rounded-lg font-bold transition ${tabClass('reports')}"><i class="fa-solid fa-chart-line mr-2"></i> Relatórios</button>
                                    </div>
                                </div>
                                
                                <div id="tab-products" class="${activeTab === 'products' ? '' : 'hidden'}">
                                    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                        <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fa-solid fa-plus-circle text-green-600"></i> <span id="form-product-title">Adicionar Novo Produto</span></h3>
                                        <form id="product-form" onsubmit="app.adminLogic.saveProduct(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="hidden" name="id" id="prod-id">
                                            <input name="name" id="prod-name" type="text" placeholder="Nome do Produto" required class="p-3 border rounded-lg outline-none">
                                            <div class="flex gap-2"><input name="price" id="prod-price" type="number" step="0.01" placeholder="Preço" required class="w-1/2 p-3 border rounded-lg outline-none"><input name="stock" id="prod-stock" type="number" placeholder="Estoque" class="w-1/2 p-3 border rounded-lg outline-none"></div>
                                            <select name="category" id="prod-category" class="p-3 border rounded-lg outline-none bg-white">
                                                ${categories.map((c) => `<option value="${c}">${c}</option>`).join('')}
                                            </select>
                                            <div class="flex gap-2 items-center"><input type="text" name="imageUrl" id="prod-image-url" placeholder="URL Imagem" class="flex-grow p-3 border rounded-lg outline-none"><label class="cursor-pointer bg-gray-200 px-4 py-3 rounded-lg"><i class="fa-solid fa-upload"></i><input type="file" accept="image/*" class="hidden" onchange="app.adminLogic.handleImageUpload(event)"></label><input type="hidden" name="imageFile" id="prod-image-file"></div>
                                            <textarea name="desc" id="prod-desc" placeholder="Descrição..." class="md:col-span-2 p-3 border rounded-lg outline-none"></textarea>
                                            <div class="md:col-span-2 flex gap-2"><button type="submit" class="flex-grow bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Salvar</button><button type="button" onclick="app.adminLogic.resetForm()" class="bg-gray-300 font-bold py-3 px-6 rounded-lg">Cancelar</button></div>
                                        </form>
                                    </div>
                                    <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                        <table class="w-full text-left">
                                            <thead class="bg-gray-50 text-gray-600 uppercase text-xs"><tr><th class="p-4">Produto</th><th class="p-4">Categoria</th><th class="p-4">Preço</th><th class="p-4 text-right">Ações</th></tr></thead>
                                            <tbody class="divide-y divide-gray-100">${products.map((p) => `<tr class="hover:bg-gray-50"><td class="p-4 flex items-center gap-3"><img src="${p.image}" class="w-10 h-10 rounded object-cover"><span>${p.name}</span></td><td class="p-4 text-sm">${p.category}</td><td class="p-4 font-bold">R$ ${p.price.toFixed(2)}</td><td class="p-4 text-right"><button onclick="app.adminLogic.editProduct(${p.id})" class="text-blue-600 mr-2"><i class="fa-solid fa-pen"></i></button><button onclick="app.adminLogic.deleteProduct(${p.id})" class="text-red-600"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('')}</tbody>
                                        </table>
                                    </div>
                                </div>

                                <div id="tab-categories" class="${activeTab === 'categories' ? '' : 'hidden'}">
                                    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                        <h3 class="text-xl font-bold mb-4">Gerenciar Categorias</h3>
                                        <form onsubmit="app.adminLogic.saveCategory(event)" class="flex gap-4">
                                            <input name="cat_name" type="text" placeholder="Nome da Categoria" required class="flex-grow p-3 border rounded-lg outline-none">
                                            <button type="submit" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">Adicionar</button>
                                        </form>
                                        <div class="mt-6 flex flex-wrap gap-3">
                                            ${categories.map((c) => `
                                                <div class="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                                                    <span>${c}</span>
                                                    <button onclick="app.adminLogic.deleteCategory('${c}')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-times"></i></button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>

                                <div id="tab-addons" class="${activeTab === 'addons' ? '' : 'hidden'}">
                                    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                        <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fa-solid fa-plus-circle text-green-600"></i> <span id="form-addon-title">Adicionar Item</span></h3>
                                        <form id="addon-form" onsubmit="app.adminLogic.saveAddon(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <input type="hidden" name="addon_id" id="addon-id">
                                            <input name="addon_name" id="addon-name" type="text" placeholder="Nome do Item" required class="md:col-span-2 p-3 border rounded-lg outline-none">
                                            <select name="addon_type" id="addon-type" class="p-3 border rounded-lg outline-none bg-white">
                                                <option value="add">Adicional (Soma Preço)</option>
                                                <option value="remove">Retirável (Opção de tirar)</option>
                                            </select>
                                            <input name="addon_price" id="addon-price" type="number" step="0.01" placeholder="Preço (R$)" required class="p-3 border rounded-lg outline-none">
                                            <div class="md:col-span-4 flex justify-end gap-2">
                                                <button type="button" onclick="app.adminLogic.resetAddonForm()" class="bg-gray-300 font-bold py-3 px-6 rounded-lg">Cancelar</button>
                                                <button type="submit" class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg">Salvar Item</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                                        <table class="w-full text-left">
                                            <thead class="bg-gray-50 text-gray-600 uppercase text-xs"><tr><th class="p-4">Item</th><th class="p-4">Tipo</th><th class="p-4">Preço</th><th class="p-4 text-right">Ação</th></tr></thead>
                                            <tbody class="divide-y divide-gray-100">
                                                ${addons.map((a) => `
                                                    <tr class="hover:bg-gray-50">
                                                        <td class="p-4 font-medium">${a.name}</td>
                                                        <td class="p-4"><span class="px-2 py-1 rounded text-xs font-bold ${a.type === 'add' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${a.type === 'add' ? 'ADICIONAL' : 'RETIRÁVEL'}</span></td>
                                                        <td class="p-4 font-bold">R$ ${a.price.toFixed(2)}</td>
                                                        <td class="p-4 text-right">
                                                            <button onclick="app.adminLogic.editAddon(${a.id})" class="text-blue-600 mr-2"><i class="fa-solid fa-pen"></i></button>
                                                            <button onclick="app.adminLogic.deleteAddon(${a.id})" class="text-red-600"><i class="fa-solid fa-trash"></i></button>
                                                        </td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div id="tab-employees" class="${activeTab === 'employees' ? '' : 'hidden'}">
                                    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                                        <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><i class="fa-solid fa-user-plus text-blue-600"></i> <span id="form-employee-title">Cadastrar Funcionário</span></h3>
                                        <form id="employee-form" onsubmit="app.adminLogic.saveEmployee(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="hidden" name="id" id="emp-id">
                                            <input name="name" id="emp-name" type="text" placeholder="Nome" required class="p-3 border rounded-lg outline-none">
                                            <input name="pin" id="emp-pin" type="text" maxlength="4" placeholder="PIN" required class="p-3 border rounded-lg outline-none">
                                            <select name="role" id="emp-role" class="p-3 border rounded-lg outline-none bg-white"><option value="counter">Atendente</option><option value="kitchen">Cozinha</option><option value="admin">Admin</option></select>
                                            <div class="md:col-span-2 flex gap-2 mt-2"><button type="submit" class="flex-grow bg-blue-600 text-white font-bold py-3 rounded-lg">Salvar</button><button type="button" onclick="app.adminLogic.resetEmpForm()" class="bg-gray-300 font-bold py-3 px-6 rounded-lg">Cancelar</button></div>
                                        </form>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${employees.map((e) => `<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"><div><h4 class="font-bold">${e.name}</h4><p class="text-xs uppercase">${e.role}</p></div><div class="text-right"><span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono">PIN: ${e.pin}</span><div class="mt-2"><button onclick="app.adminLogic.editEmployee(${e.id})" class="text-blue-500 mr-2"><i class="fa-solid fa-pen"></i></button><button onclick="app.adminLogic.deleteEmployee(${e.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button></div></div></div>`).join('')}</div>
                                </div>

                                <div id="tab-settings" class="${activeTab === 'settings' ? '' : 'hidden'}">
                                    <form onsubmit="app.adminLogic.saveSettings(event)" class="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <h3 class="text-xl font-bold mb-4">Configurações de Pagamento</h3>
                                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4"><label class="flex gap-2"><input type="checkbox" name="method_cash" ${settings.methods.cash ? 'checked' : ''}> Dinheiro</label><label class="flex gap-2"><input type="checkbox" name="method_card" ${settings.methods.card ? 'checked' : ''}> Cartão</label><label class="flex gap-2"><input type="checkbox" name="method_pix" ${settings.methods.pix ? 'checked' : ''}> Pix</label><label class="flex gap-2"><input type="checkbox" name="method_crypto" ${settings.methods.crypto ? 'checked' : ''}> Cripto</label></div>
                                        <div class="border-t pt-4">
                                            <h4 class="font-bold mb-2">Gateway Cartão</h4>
                                            <select name="gateway_provider" class="w-full p-2 border rounded mb-2"><option value="mercadopago" ${settings.gateway.provider==='mercadopago'?'selected':''}>Mercado Pago</option><option value="stripe" ${settings.gateway.provider==='stripe'?'selected':''}>Stripe</option><option value="other" ${settings.gateway.provider==='other'?'selected':''}>Outro Gateway</option></select>
                                            <input name="gateway_public" value="${settings.gateway.publicKey}" placeholder="Public Key" class="w-full p-2 border rounded mb-2">
                                            <input name="gateway_secret" type="password" value="${settings.gateway.secretKey}" placeholder="Secret Key" class="w-full p-2 border rounded mb-2">
                                            <div id="other-gateway-fields" class="${settings.gateway.provider !== 'other' ? 'hidden' : ''} pt-2 border-t mt-2">
                                                <input name="gateway_other_url" value="${settings.gateway.otherUrl || ''}" placeholder="API URL (ex: https://api.gateway.com)" class="w-full p-2 border rounded mb-2">
                                                <input name="gateway_other_token" value="${settings.gateway.otherToken || ''}" placeholder="Token Personalizado" class="w-full p-2 border rounded">
                                            </div>
                                        </div>
                                        <div class="flex justify-end"><button type="submit" class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg">Salvar</button></div>
                                    </form>
                                    <script>
                                        document.querySelector('select[name="gateway_provider"]').addEventListener('change', function(e) {
                                            const otherFields = document.getElementById('other-gateway-fields');
                                            if (e.target.value === 'other') {
                                                otherFields.classList.remove('hidden');
                                            } else {
                                                otherFields.classList.add('hidden');
                                            }
                                        });
                                    <\/script>
                                </div>

                                <div id="tab-reports" class="${activeTab === 'reports' ? '' : 'hidden'}">
                                    ${reportsHtml}
                                </div>
                            </div>
                        `;
      },

      saveCategory(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        DB.saveCategory(formData.get('cat_name'));
        app.router.go('admin');
      },
      deleteCategory(name) {
        if (confirm('Excluir categoria?')) {
          DB.deleteCategory(name);
          app.router.go('admin');
        }
      },
      saveAddon(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const addon = {
          id: formData.get('addon_id'),
          name: formData.get('addon_name'),
          type: formData.get('addon_type'),
          price: parseFloat(formData.get('addon_price'))
        };
        DB.saveAddon(addon);
        app.router.go('admin');
      },
      deleteAddon(id) {
        if (confirm('Excluir ingrediente?')) {
          DB.deleteAddon(id);
          app.router.go('admin');
        }
      },
      editAddon(id) {
        const addon = DB.getAddons().find((a) => a.id === id);
        if (addon) {
          document.getElementById('form-addon-title').innerText = 'Editar Item (ID: ' + id + ')';
          document.getElementById('addon-id').value = addon.id;
          document.getElementById('addon-name').value = addon.name;
          document.getElementById('addon-type').value = addon.type;
          document.getElementById('addon-price').value = addon.price;
          window.scrollTo(0, 0);
        }
      },
      resetAddonForm() {
        document.getElementById('addon-form').reset();
        document.getElementById('addon-id').value = '';
        document.getElementById('form-addon-title').innerText = 'Adicionar Item';
      },
      switchTab(tab) {
        this.activeTab = tab;
        app.router.go('admin');
      },
      togglePixMode(mode) { },
      saveSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const settings = {
          methods: {
            cash: formData.get('method_cash') === 'on',
            card: formData.get('method_card') === 'on',
            pix: formData.get('method_pix') === 'on',
            crypto: formData.get('method_crypto') === 'on'
          },
          gateway: {
            provider: formData.get('gateway_provider'),
            publicKey: formData.get('gateway_public'),
            secretKey: formData.get('gateway_secret'),
            otherUrl: formData.get('gateway_other_url'),
            otherToken: formData.get('gateway_other_token')
          },
          pix: {
            mode: formData.get('pix_mode'),
            key: formData.get('pix_key'),
            apiKey: formData.get('pix_api_key'),
            apiSecret: formData.get('pix_api_secret')
          },
          crypto: {
            wallet: formData.get('crypto_wallet')
          }
        };
        DB.saveSettings(settings);
        alert('Configurações salvas com sucesso!');
      },
      handleImageUpload(e) { },
      saveProduct(e) { },
      deleteProduct(id) { },
      editProduct(id) { },
      resetForm() { },
      saveEmployee(e) { },
      deleteEmployee(id) { },
      editEmployee(id) { },
      resetEmpForm() { },
      renderReports() { }
    };
  };

  window.pizzaosRegisterViews = registerViews;
})();

