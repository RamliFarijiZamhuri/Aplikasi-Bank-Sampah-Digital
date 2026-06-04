module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db,
    "dbAll",
    ()=>dbAll,
    "dbGet",
    ()=>dbGet,
    "dbRun",
    ()=>dbRun,
    "initializeDatabase",
    ()=>initializeDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__ = __turbopack_context__.i("[externals]/sqlite3 [external] (sqlite3, cjs, [project]/node_modules/sqlite3)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import, [project]/node_modules/bcryptjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// Setup SQLite Connection
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].resolve(process.cwd(), 'database.sqlite');
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$sqlite3__$5b$external$5d$__$28$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sqlite3$29$__["default"].Database(dbPath);
const dbRun = (query, params = [])=>{
    return new Promise((resolve, reject)=>{
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};
const dbGet = (query, params = [])=>{
    return new Promise((resolve, reject)=>{
        db.get(query, params, (err, row)=>{
            if (err) reject(err);
            else resolve(row);
        });
    });
};
const dbAll = (query, params = [])=>{
    return new Promise((resolve, reject)=>{
        db.all(query, params, (err, rows)=>{
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
async function initializeDatabase() {
    await dbRun('PRAGMA foreign_keys = ON;');
    const userTable = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (!userTable) {
        console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis...");
        await dbRun(`
      CREATE TABLE users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `);
        await dbRun(`
      CREATE TABLE kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `);
        await dbRun(`
      CREATE TABLE transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);
        await dbRun(`
      CREATE TABLE detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `);
        await dbRun(`
      CREATE TABLE penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `);
        await dbRun(`
      CREATE TABLE pembelian_pengepul (
        id_pembelian INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        tanggal_pembelian TEXT NOT NULL,
        total_bayar REAL NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `);
        const salt = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__["default"].genSalt(10);
        const hashedDefaultPassword = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__["default"].hash('password123', salt);
        await dbRun('INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)', [
            'Budi Petugas',
            '081234567890',
            'Kantor Bank Sampah Indah',
            'Petugas',
            hashedDefaultPassword,
            0
        ]);
        await dbRun('INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)', [
            'Siti Nasabah',
            '081299999999',
            'Jl. Mawar No. 12, RT 02/03',
            'Nasabah',
            hashedDefaultPassword,
            50000
        ]);
        await dbRun('INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)', [
            'Rudi Pengepul',
            '081388888888',
            'Gudang Sukses Makmur, Bekasi',
            'Pengepul',
            hashedDefaultPassword,
            0
        ]);
        await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', [
            'Plastik PET',
            2000
        ]);
        await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', [
            'Kardus',
            1500
        ]);
        await dbRun('INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)', [
            'Besi',
            5000
        ]);
        await dbRun('INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)', [
            2,
            1,
            '2026-06-01 10:00:00'
        ]);
        await dbRun('INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)', [
            1,
            1,
            15,
            30000
        ]);
        await dbRun('INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)', [
            1,
            2,
            20,
            30000
        ]);
        await dbRun('UPDATE users SET saldo = saldo + ? WHERE id_user = ?', [
            60000,
            2
        ]);
        await dbRun('INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)', [
            2,
            10000,
            '2026-06-02 14:00:00',
            'Success'
        ]);
        await dbRun('INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)', [
            2,
            25000,
            '2026-06-03 09:00:00',
            'Pending'
        ]);
        await dbRun('INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)', [
            3,
            1,
            5,
            '2026-06-02 16:30:00',
            10000
        ]);
        console.log("Seeding awal SQLite di Next.js sukses!");
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/src/pages/api/auth/login.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, esm_import, [project]/node_modules/bcryptjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(455).json({
            message: 'Metode tidak diperbolehkan'
        });
    }
    const { nomor_hp, password } = req.body;
    if (!nomor_hp || !password) {
        return res.status(400).json({
            message: 'Mohon isi Nomor HP dan kata sandi Anda!'
        });
    }
    try {
        // Ensure DB is seeded and set up
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["initializeDatabase"])();
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["dbGet"])('SELECT * FROM users WHERE nomor_hp = ?', [
            nomor_hp
        ]);
        if (!user) {
            return res.status(401).json({
                message: 'Nomor HP atau kata sandi tidak cocok!'
            });
        }
        const match = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$bcryptjs$29$__["default"].compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                message: 'Nomor HP atau kata sandi tidak cocok!'
            });
        }
        // Set HTTP-only Cookie
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setSessionUser"])(res, {
            id: user.id_user,
            nama: user.nama,
            role: user.role,
            nomor_hp: user.nomor_hp
        });
        return res.status(200).json({
            status: 'success',
            message: 'Login berhasil!',
            role: user.role
        });
    } catch (error) {
        console.error('Login API error:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan sistem internal. Silakan coba lagi.'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1fzpxf3._.js.map