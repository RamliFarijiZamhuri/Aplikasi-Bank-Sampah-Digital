module.exports = [
"[project]/src/lib/session.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IndexPage,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [ssr] (ecmascript)");
;
function IndexPage() {
    return null;
}
const getServerSideProps = async (context)=>{
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getSessionUser"])(context.req);
    if (!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        };
    }
    const role = user.role;
    let destination = '/login';
    if (role === 'Nasabah') destination = '/dashboard/nasabah';
    else if (role === 'Petugas') destination = '/dashboard/petugas';
    else if (role === 'Pengepul') destination = '/dashboard/pengepul';
    return {
        redirect: {
            destination,
            permanent: false
        }
    };
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__13zypwg._.js.map