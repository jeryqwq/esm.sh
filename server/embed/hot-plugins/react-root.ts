/** @version: 18.2.0 */

function importAll(...urls: (string | URL)[]) {
  return Promise.all(urls.map((url) => import(url.toString())));
}

export default {
  name: "react-root",
  setup(hot: any) {
    hot.customImports.set(
      "@reactRefreshRuntime",
      "https://esm.sh/hot/_hmr_react_refresh.js",
    );
    hot.register(
      "_hmr_react_refresh.js",
      () => `
        // react-refresh
        // @link https://github.com/facebook/react/issues/16604#issuecomment-528663101

        import runtime from "https://esm.sh/v135/react-refresh@0.14.0/runtime";

        let timer;
        const refresh = () => {
          if (timer !== null) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            runtime.performReactRefresh()
            timer = null;
          }, 30);
        };

        runtime.injectIntoGlobalHook(window);
        window.$RefreshReg$ = () => {};
        window.$RefreshSig$ = () => type => type;

        export { refresh as __REACT_REFRESH__, runtime as __REACT_REFRESH_RUNTIME__ };
      `,
    );
    hot.onFire((_sw: ServiceWorker) => {
      customElements.define(
        "react-root",
        class ReactRoot extends HTMLElement {
          constructor() {
            super();
          }
          async connectedCallback() {
            const rootDiv = document.createElement("div");
            const src = this.getAttribute("src");
            this.appendChild(rootDiv);
            if (!src) {
              return;
            }
            if (hot.hmr) {
              try {
                // ensure react-refresh is injected before react-dom is loaded
                await import("https://esm.sh/hot/_hmr_react_refresh.js");
              } catch (err) {
                console.warn("Failed to load react-refresh runtime:", err);
              }
            }
            const [
              { createElement, StrictMode },
              { createRoot },
              { default: Component },
            ] = await importAll(
              "https://esm.sh/react@18.2.0",
              "https://esm.sh/react-dom@18.2.0/client",
              new URL(src, location.href),
            );
            createRoot(rootDiv).render(
              createElement(StrictMode, null, createElement(Component)),
            );
          }
        },
      );
    });
  },
};
