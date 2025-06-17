var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../../sites/common_site_config.json
var require_common_site_config = __commonJS({
  "../../../sites/common_site_config.json"(exports, module) {
    module.exports = {
      allow_cors: "*",
      background_workers: 1,
      default_site: "esign.test",
      developer_mode: 1,
      file_watcher_port: 6787,
      frappe_types_pause_generation: 0,
      frappe_user: "dexciss",
      gunicorn_workers: 9,
      ignore_csrf: true,
      live_reload: true,
      rebase_on_pull: false,
      redis_cache: "redis://127.0.0.1:13000",
      redis_queue: "redis://127.0.0.1:11000",
      redis_socketio: "redis://127.0.0.1:13000",
      restart_supervisor_on_update: false,
      restart_systemd_on_update: false,
      serve_default_site: true,
      shallow_clone: true,
      socketio_port: 9e3,
      use_redis_auth: false,
      webserver_port: 8e3
    };
  }
});

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///home/dexciss/frappe-bench/apps/esign_app/esignDash/node_modules/vite/dist/node/index.js";
import react from "file:///home/dexciss/frappe-bench/apps/esign_app/esignDash/node_modules/@vitejs/plugin-react/dist/index.mjs";

// proxyOptions.ts
var common_site_config = require_common_site_config();
var { webserver_port } = common_site_config;
var proxyOptions_default = {
  "^/(app|api|assets|files|private)": {
    target: `http://127.0.0.1:${webserver_port}`,
    ws: true,
    router: function(req) {
      const site_name = req.headers.host.split(":")[0];
      return `http://${site_name}:${webserver_port}`;
    }
  }
};

// vite.config.ts
import tailwindcss from "file:///home/dexciss/frappe-bench/apps/esign_app/esignDash/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///home/dexciss/frappe-bench/apps/esign_app/esignDash/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "/home/dexciss/frappe-bench/apps/esign_app/esignDash";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: proxyOptions_default
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    outDir: "../esign_app/public/esignDash",
    emptyOutDir: true,
    target: "es2015"
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc2l0ZXMvY29tbW9uX3NpdGVfY29uZmlnLmpzb24iLCAidml0ZS5jb25maWcudHMiLCAicHJveHlPcHRpb25zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gXCJhbGxvd19jb3JzXCI6IFwiKlwiLFxuIFwiYmFja2dyb3VuZF93b3JrZXJzXCI6IDEsXG4gXCJkZWZhdWx0X3NpdGVcIjogXCJlc2lnbi50ZXN0XCIsXG4gXCJkZXZlbG9wZXJfbW9kZVwiOiAxLFxuIFwiZmlsZV93YXRjaGVyX3BvcnRcIjogNjc4NyxcbiBcImZyYXBwZV90eXBlc19wYXVzZV9nZW5lcmF0aW9uXCI6IDAsXG4gXCJmcmFwcGVfdXNlclwiOiBcImRleGNpc3NcIixcbiBcImd1bmljb3JuX3dvcmtlcnNcIjogOSxcbiBcImlnbm9yZV9jc3JmXCI6IHRydWUsXG4gXCJsaXZlX3JlbG9hZFwiOiB0cnVlLFxuIFwicmViYXNlX29uX3B1bGxcIjogZmFsc2UsXG4gXCJyZWRpc19jYWNoZVwiOiBcInJlZGlzOi8vMTI3LjAuMC4xOjEzMDAwXCIsXG4gXCJyZWRpc19xdWV1ZVwiOiBcInJlZGlzOi8vMTI3LjAuMC4xOjExMDAwXCIsXG4gXCJyZWRpc19zb2NrZXRpb1wiOiBcInJlZGlzOi8vMTI3LjAuMC4xOjEzMDAwXCIsXG4gXCJyZXN0YXJ0X3N1cGVydmlzb3Jfb25fdXBkYXRlXCI6IGZhbHNlLFxuIFwicmVzdGFydF9zeXN0ZW1kX29uX3VwZGF0ZVwiOiBmYWxzZSxcbiBcInNlcnZlX2RlZmF1bHRfc2l0ZVwiOiB0cnVlLFxuIFwic2hhbGxvd19jbG9uZVwiOiB0cnVlLFxuIFwic29ja2V0aW9fcG9ydFwiOiA5MDAwLFxuIFwidXNlX3JlZGlzX2F1dGhcIjogZmFsc2UsXG4gXCJ3ZWJzZXJ2ZXJfcG9ydFwiOiA4MDAwXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXhjaXNzL2ZyYXBwZS1iZW5jaC9hcHBzL2VzaWduX2FwcC9lc2lnbkRhc2hcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RleGNpc3MvZnJhcHBlLWJlbmNoL2FwcHMvZXNpZ25fYXBwL2VzaWduRGFzaC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXhjaXNzL2ZyYXBwZS1iZW5jaC9hcHBzL2VzaWduX2FwcC9lc2lnbkRhc2gvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHByb3h5T3B0aW9ucyBmcm9tICcuL3Byb3h5T3B0aW9ucyc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbcmVhY3QoKV0sXG5cdHNlcnZlcjoge1xuXHRcdHBvcnQ6IDgwODAsXG5cdFx0cHJveHk6IHByb3h5T3B0aW9uc1xuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpXG5cdFx0fVxuXHR9LFxuXHRidWlsZDoge1xuXHRcdG91dERpcjogJy4uL2VzaWduX2FwcC9wdWJsaWMvZXNpZ25EYXNoJyxcblx0XHRlbXB0eU91dERpcjogdHJ1ZSxcblx0XHR0YXJnZXQ6ICdlczIwMTUnLFxuXHR9LFxuXHRjc3M6IHtcblx0XHRwb3N0Y3NzOiB7XG5cdFx0ICBwbHVnaW5zOiBbXG5cdFx0XHR0YWlsd2luZGNzcyxcblx0XHRcdGF1dG9wcmVmaXhlclxuXHRcdCAgXSxcblx0XHR9LFxuXHQgIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV4Y2lzcy9mcmFwcGUtYmVuY2gvYXBwcy9lc2lnbl9hcHAvZXNpZ25EYXNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXhjaXNzL2ZyYXBwZS1iZW5jaC9hcHBzL2VzaWduX2FwcC9lc2lnbkRhc2gvcHJveHlPcHRpb25zLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RleGNpc3MvZnJhcHBlLWJlbmNoL2FwcHMvZXNpZ25fYXBwL2VzaWduRGFzaC9wcm94eU9wdGlvbnMudHNcIjtjb25zdCBjb21tb25fc2l0ZV9jb25maWcgPSByZXF1aXJlKCcuLi8uLi8uLi9zaXRlcy9jb21tb25fc2l0ZV9jb25maWcuanNvbicpO1xuY29uc3QgeyB3ZWJzZXJ2ZXJfcG9ydCB9ID0gY29tbW9uX3NpdGVfY29uZmlnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdCdeLyhhcHB8YXBpfGFzc2V0c3xmaWxlc3xwcml2YXRlKSc6IHtcblx0XHR0YXJnZXQ6IGBodHRwOi8vMTI3LjAuMC4xOiR7d2Vic2VydmVyX3BvcnR9YCxcblx0XHR3czogdHJ1ZSxcblx0XHRyb3V0ZXI6IGZ1bmN0aW9uKHJlcSkge1xuXHRcdFx0Y29uc3Qgc2l0ZV9uYW1lID0gcmVxLmhlYWRlcnMuaG9zdC5zcGxpdCgnOicpWzBdO1xuXHRcdFx0cmV0dXJuIGBodHRwOi8vJHtzaXRlX25hbWV9OiR7d2Vic2VydmVyX3BvcnR9YDtcblx0XHR9XG5cdH1cbn07XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUNDLFlBQWM7QUFBQSxNQUNkLG9CQUFzQjtBQUFBLE1BQ3RCLGNBQWdCO0FBQUEsTUFDaEIsZ0JBQWtCO0FBQUEsTUFDbEIsbUJBQXFCO0FBQUEsTUFDckIsK0JBQWlDO0FBQUEsTUFDakMsYUFBZTtBQUFBLE1BQ2Ysa0JBQW9CO0FBQUEsTUFDcEIsYUFBZTtBQUFBLE1BQ2YsYUFBZTtBQUFBLE1BQ2YsZ0JBQWtCO0FBQUEsTUFDbEIsYUFBZTtBQUFBLE1BQ2YsYUFBZTtBQUFBLE1BQ2YsZ0JBQWtCO0FBQUEsTUFDbEIsOEJBQWdDO0FBQUEsTUFDaEMsMkJBQTZCO0FBQUEsTUFDN0Isb0JBQXNCO0FBQUEsTUFDdEIsZUFBaUI7QUFBQSxNQUNqQixlQUFpQjtBQUFBLE1BQ2pCLGdCQUFrQjtBQUFBLE1BQ2xCLGdCQUFrQjtBQUFBLElBQ25CO0FBQUE7QUFBQTs7O0FDdEIyVSxPQUFPLFVBQVU7QUFDNVYsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXOzs7QUNGMlQsSUFBTSxxQkFBcUI7QUFDeFcsSUFBTSxFQUFFLGVBQWUsSUFBSTtBQUUzQixJQUFPLHVCQUFRO0FBQUEsRUFDZCxvQ0FBb0M7QUFBQSxJQUNuQyxRQUFRLG9CQUFvQixjQUFjO0FBQUEsSUFDMUMsSUFBSTtBQUFBLElBQ0osUUFBUSxTQUFTLEtBQUs7QUFDckIsWUFBTSxZQUFZLElBQUksUUFBUSxLQUFLLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDL0MsYUFBTyxVQUFVLFNBQVMsSUFBSSxjQUFjO0FBQUEsSUFDN0M7QUFBQSxFQUNEO0FBQ0Q7OztBRFJBLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBTHpCLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ25DO0FBQUEsRUFDRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ04sUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsUUFBUTtBQUFBLEVBQ1Q7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLE1BQ0M7QUFBQSxJQUNGO0FBQUEsRUFDQztBQUNILENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
