(() => {
  const attachRouter = (app) => {
    app.router = {
      go(viewName) {
        const content = document.getElementById('app-content');
        content.innerHTML = '';
        window.scrollTo(0, 0);
        if (this.views[viewName]) {
          content.innerHTML = this.views[viewName]();
          this.initScripts(viewName);
        } else {
          content.innerHTML = '<h2 class="text-red-500">Erro 404: Página não encontrada</h2>';
        }
      },
      initScripts(viewName) {
        if (viewName === 'checkout') app.checkoutLogic.init();
        if (viewName === 'kds') app.kdsLogic.init();
        if (viewName === 'admin') app.adminLogic.init();
      },
      views: {}
    };
  };

  window.pizzaosAttachRouter = attachRouter;
})();

