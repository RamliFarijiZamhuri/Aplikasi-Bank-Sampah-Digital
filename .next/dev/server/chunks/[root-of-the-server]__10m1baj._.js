module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/session.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSessionUser",
    ()=>clearSessionUser,
    "deserializeSession",
    ()=>deserializeSession,
    "getSessionUser",
    ()=>getSessionUser,
    "serializeSession",
    ()=>serializeSession,
    "setSessionUser",
    ()=>setSessionUser
]);
const COOKIE_NAME = 'bank_sampah_session';
function serializeSession(user) {
    const jsonStr = JSON.stringify(user);
    return Buffer.from(jsonStr).toString('base64');
}
function deserializeSession(serialized) {
    try {
        const jsonStr = Buffer.from(serialized, 'base64').toString('utf-8');
        return JSON.parse(jsonStr);
    } catch  {
        return null;
    }
}
function getSessionUser(req) {
    const cookieVal = req.cookies[COOKIE_NAME];
    if (!cookieVal) return null;
    return deserializeSession(cookieVal);
}
function setSessionUser(res, user) {
    const serialized = serializeSession(user);
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${serialized}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
}
function clearSessionUser(res) {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
}),
"[project]/src/pages/api/auth/logout.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [api] (ecmascript)");
;
async function handler(req, res) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["clearSessionUser"])(res);
    return res.status(200).json({
        status: 'success',
        message: 'Berhasil keluar'
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__10m1baj._.js.map