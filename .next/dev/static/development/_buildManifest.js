self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/_error": [
    "static/chunks/pages/_error.js"
  ],
  "/dashboard/nasabah": [
    "static/chunks/pages/dashboard/nasabah.js"
  ],
  "/dashboard/pengepul": [
    "static/chunks/pages/dashboard/pengepul.js"
  ],
  "/dashboard/petugas": [
    "static/chunks/pages/dashboard/petugas.js"
  ],
  "/login": [
    "static/chunks/pages/login.js"
  ],
  "/register": [
    "static/chunks/pages/register.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/admin/create-staff",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
    "/api/nasabah/tarik",
    "/api/pengepul/beli",
    "/api/petugas/approve-tarik",
    "/api/petugas/reject-tarik",
    "/api/petugas/setor",
    "/api/petugas/update-harga",
    "/dashboard/nasabah",
    "/dashboard/pengepul",
    "/dashboard/pengepul/manifest/[id]",
    "/dashboard/petugas",
    "/login",
    "/register"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()