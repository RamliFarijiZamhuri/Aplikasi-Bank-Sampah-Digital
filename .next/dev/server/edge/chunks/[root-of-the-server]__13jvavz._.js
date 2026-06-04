(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__13jvavz._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    const { pathname } = request.nextUrl;
    // Ambil cookie session yang diset oleh aplikasi
    const sessionCookie = request.cookies.get('bank_sampah_session')?.value;
    let user = null;
    if (sessionCookie) {
        try {
            // Decode base64 menggunakan atob yang didukung Edge Runtime
            const decoded = atob(sessionCookie);
            user = JSON.parse(decoded);
        } catch (e) {
        // Sesi tidak valid / error parsing
        }
    }
    // Cek otorisasi rute dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            // Arahkan ke halaman login jika belum autentikasi
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('error', 'Silakan masuk terlebih dahulu untuk mengakses dashboard.');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        // Batasi akses rute berdasarkan role masing-masing
        if (pathname.startsWith('/dashboard/nasabah')) {
            if (user.role !== 'Nasabah') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(getRedirectUrl(user.role), request.url));
            }
        }
        if (pathname.startsWith('/dashboard/petugas')) {
            if (user.role !== 'Petugas') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(getRedirectUrl(user.role), request.url));
            }
        }
        if (pathname.startsWith('/dashboard/pengepul')) {
            if (user.role !== 'Pengepul') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(getRedirectUrl(user.role), request.url));
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
/**
 * Mendapatkan rute dashboard default berdasarkan role user
 */ function getRedirectUrl(role) {
    switch(role){
        case 'Nasabah':
            return '/dashboard/nasabah';
        case 'Petugas':
            return '/dashboard/petugas';
        case 'Pengepul':
            return '/dashboard/pengepul';
        default:
            return '/login';
    }
}
const config = {
    matcher: [
        '/dashboard/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__13jvavz._.js.map