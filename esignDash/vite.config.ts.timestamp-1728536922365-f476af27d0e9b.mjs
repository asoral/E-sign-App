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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc2l0ZXMvY29tbW9uX3NpdGVfY29uZmlnLmpzb24iLCAidml0ZS5jb25maWcudHMiLCAicHJveHlPcHRpb25zLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gXCJhbGxvd19jb3JzXCI6IFwiKlwiLFxuIFwiYmFja2dyb3VuZF93b3JrZXJzXCI6IDEsXG4gXCJkZWZhdWx0X3NpdGVcIjogXCJlc2lnbi50ZXN0XCIsXG4gXCJmaWxlX3dhdGNoZXJfcG9ydFwiOiA2Nzg3LFxuIFwiZnJhcHBlX3R5cGVzX3BhdXNlX2dlbmVyYXRpb25cIjogMCxcbiBcImZyYXBwZV91c2VyXCI6IFwiZGV4Y2lzc1wiLFxuIFwiZ3VuaWNvcm5fd29ya2Vyc1wiOiA5LFxuIFwiaWdub3JlX2NzcmZcIjogdHJ1ZSxcbiBcImxpdmVfcmVsb2FkXCI6IHRydWUsXG4gXCJyZWJhc2Vfb25fcHVsbFwiOiBmYWxzZSxcbiBcInJlZGlzX2NhY2hlXCI6IFwicmVkaXM6Ly8xMjcuMC4wLjE6MTMwMDBcIixcbiBcInJlZGlzX3F1ZXVlXCI6IFwicmVkaXM6Ly8xMjcuMC4wLjE6MTEwMDBcIixcbiBcInJlZGlzX3NvY2tldGlvXCI6IFwicmVkaXM6Ly8xMjcuMC4wLjE6MTMwMDBcIixcbiBcInJlc3RhcnRfc3VwZXJ2aXNvcl9vbl91cGRhdGVcIjogZmFsc2UsXG4gXCJyZXN0YXJ0X3N5c3RlbWRfb25fdXBkYXRlXCI6IGZhbHNlLFxuIFwic2VydmVfZGVmYXVsdF9zaXRlXCI6IHRydWUsXG4gXCJzaGFsbG93X2Nsb25lXCI6IHRydWUsXG4gXCJzb2NrZXRpb19wb3J0XCI6IDkwMDAsXG4gXCJ1c2VfcmVkaXNfYXV0aFwiOiBmYWxzZSxcbiBcIndlYnNlcnZlcl9wb3J0XCI6IDgwMDBcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2RleGNpc3MvZnJhcHBlLWJlbmNoL2FwcHMvZXNpZ25fYXBwL2VzaWduRGFzaFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV4Y2lzcy9mcmFwcGUtYmVuY2gvYXBwcy9lc2lnbl9hcHAvZXNpZ25EYXNoL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RleGNpc3MvZnJhcHBlLWJlbmNoL2FwcHMvZXNpZ25fYXBwL2VzaWduRGFzaC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgcHJveHlPcHRpb25zIGZyb20gJy4vcHJveHlPcHRpb25zJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtyZWFjdCgpXSxcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogODA4MCxcblx0XHRwcm94eTogcHJveHlPcHRpb25zXG5cdH0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJylcblx0XHR9XG5cdH0sXG5cdGJ1aWxkOiB7XG5cdFx0b3V0RGlyOiAnLi4vZXNpZ25fYXBwL3B1YmxpYy9lc2lnbkRhc2gnLFxuXHRcdGVtcHR5T3V0RGlyOiB0cnVlLFxuXHRcdHRhcmdldDogJ2VzMjAxNScsXG5cdH0sXG5cdGNzczoge1xuXHRcdHBvc3Rjc3M6IHtcblx0XHQgIHBsdWdpbnM6IFtcblx0XHRcdHRhaWx3aW5kY3NzLFxuXHRcdFx0YXV0b3ByZWZpeGVyXG5cdFx0ICBdLFxuXHRcdH0sXG5cdCAgfSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXhjaXNzL2ZyYXBwZS1iZW5jaC9hcHBzL2VzaWduX2FwcC9lc2lnbkRhc2hcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2RleGNpc3MvZnJhcHBlLWJlbmNoL2FwcHMvZXNpZ25fYXBwL2VzaWduRGFzaC9wcm94eU9wdGlvbnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZGV4Y2lzcy9mcmFwcGUtYmVuY2gvYXBwcy9lc2lnbl9hcHAvZXNpZ25EYXNoL3Byb3h5T3B0aW9ucy50c1wiO2NvbnN0IGNvbW1vbl9zaXRlX2NvbmZpZyA9IHJlcXVpcmUoJy4uLy4uLy4uL3NpdGVzL2NvbW1vbl9zaXRlX2NvbmZpZy5qc29uJyk7XG5jb25zdCB7IHdlYnNlcnZlcl9wb3J0IH0gPSBjb21tb25fc2l0ZV9jb25maWc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0J14vKGFwcHxhcGl8YXNzZXRzfGZpbGVzfHByaXZhdGUpJzoge1xuXHRcdHRhcmdldDogYGh0dHA6Ly8xMjcuMC4wLjE6JHt3ZWJzZXJ2ZXJfcG9ydH1gLFxuXHRcdHdzOiB0cnVlLFxuXHRcdHJvdXRlcjogZnVuY3Rpb24ocmVxKSB7XG5cdFx0XHRjb25zdCBzaXRlX25hbWUgPSByZXEuaGVhZGVycy5ob3N0LnNwbGl0KCc6JylbMF07XG5cdFx0XHRyZXR1cm4gYGh0dHA6Ly8ke3NpdGVfbmFtZX06JHt3ZWJzZXJ2ZXJfcG9ydH1gO1xuXHRcdH1cblx0fVxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQ0MsWUFBYztBQUFBLE1BQ2Qsb0JBQXNCO0FBQUEsTUFDdEIsY0FBZ0I7QUFBQSxNQUNoQixtQkFBcUI7QUFBQSxNQUNyQiwrQkFBaUM7QUFBQSxNQUNqQyxhQUFlO0FBQUEsTUFDZixrQkFBb0I7QUFBQSxNQUNwQixhQUFlO0FBQUEsTUFDZixhQUFlO0FBQUEsTUFDZixnQkFBa0I7QUFBQSxNQUNsQixhQUFlO0FBQUEsTUFDZixhQUFlO0FBQUEsTUFDZixnQkFBa0I7QUFBQSxNQUNsQiw4QkFBZ0M7QUFBQSxNQUNoQywyQkFBNkI7QUFBQSxNQUM3QixvQkFBc0I7QUFBQSxNQUN0QixlQUFpQjtBQUFBLE1BQ2pCLGVBQWlCO0FBQUEsTUFDakIsZ0JBQWtCO0FBQUEsTUFDbEIsZ0JBQWtCO0FBQUEsSUFDbkI7QUFBQTtBQUFBOzs7QUNyQjJVLE9BQU8sVUFBVTtBQUM1VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7OztBQ0YyVCxJQUFNLHFCQUFxQjtBQUN4VyxJQUFNLEVBQUUsZUFBZSxJQUFJO0FBRTNCLElBQU8sdUJBQVE7QUFBQSxFQUNkLG9DQUFvQztBQUFBLElBQ25DLFFBQVEsb0JBQW9CLGNBQWM7QUFBQSxJQUMxQyxJQUFJO0FBQUEsSUFDSixRQUFRLFNBQVMsS0FBSztBQUNyQixZQUFNLFlBQVksSUFBSSxRQUFRLEtBQUssTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUMvQyxhQUFPLFVBQVUsU0FBUyxJQUFJLGNBQWM7QUFBQSxJQUM3QztBQUFBLEVBQ0Q7QUFDRDs7O0FEUkEsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFMekIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDbkM7QUFBQSxFQUNEO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsRUFDVDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0osU0FBUztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsTUFDQztBQUFBLElBQ0Y7QUFBQSxFQUNDO0FBQ0gsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
