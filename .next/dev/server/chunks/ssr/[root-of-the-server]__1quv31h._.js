module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
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
"[project]/src/lib/db.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/pages/dashboard/petugas.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>PetugasDashboard,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/session.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/leaf.js [ssr] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-check-big.js [ssr] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scale.js [ssr] (ecmascript) <export default as Scale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.js [ssr] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [ssr] (ecmascript) <export default as UserPlus>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function PetugasDashboard({ user, nasabah_list, kategori, total_setor_count, all_setor_list, pending_withdrawals }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Form input builders
    const [idNasabah, setIdNasabah] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [selectedKategoriId, setSelectedKategoriId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [beratKg, setBeratKg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [buildingReceipt, setBuildingReceipt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Update Harga Form states
    const [updateKategoriId, setUpdateKategoriId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [hargaBaru, setHargaBaru] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Register Staff Form states
    const [staffNama, setStaffNama] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [staffNomorHp, setStaffNomorHp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [staffAlamat, setStaffAlamat] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [staffRole, setStaffRole] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('Petugas');
    const [staffPassword, setStaffPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [staffSubmitting, setStaffSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleLogout = async ()=>{
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
        router.push('/login?success=Berhasil+keluar');
    };
    const handleCategoryPriceSelected = (e)=>{
        const value = e.target.value;
        setUpdateKategoriId(value);
        const selectedItem = kategori.find((k)=>k.id_kategori === parseInt(value));
        if (selectedItem) {
            setHargaBaru(selectedItem.harga_per_kg.toString());
        }
    };
    const addItemToReceipt = ()=>{
        setError('');
        setSuccess('');
        if (!selectedKategoriId) {
            alert("Pilih kategori sampah terlebih dahulu!");
            return;
        }
        const berat = parseFloat(beratKg);
        if (isNaN(berat) || berat <= 0) {
            alert("Masukkan berat sampah yang valid (> 0)!");
            return;
        }
        const selectedOption = kategori.find((k)=>k.id_kategori === parseInt(selectedKategoriId));
        if (!selectedOption) return;
        const idKategori = selectedOption.id_kategori;
        const namaKategori = selectedOption.nama_kategori;
        const hargaPerKg = selectedOption.harga_per_kg;
        // Check if item already exists in builders
        const existIdx = buildingReceipt.findIndex((item)=>item.id_kategori === idKategori);
        if (existIdx > -1) {
            const updated = [
                ...buildingReceipt
            ];
            updated[existIdx].berat_kg += berat;
            updated[existIdx].subtotal = updated[existIdx].berat_kg * updated[existIdx].harga_per_kg;
            setBuildingReceipt(updated);
        } else {
            setBuildingReceipt((prev)=>[
                    ...prev,
                    {
                        id_kategori: idKategori,
                        nama_kategori: namaKategori,
                        harga_per_kg: hargaPerKg,
                        berat_kg: berat,
                        subtotal: berat * hargaPerKg
                    }
                ]);
        }
        // Reset weight/category builder input
        setBeratKg('');
        setSelectedKategoriId('');
    };
    const removeItemFromReceipt = (idx)=>{
        setBuildingReceipt((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const receiptGrandTotal = buildingReceipt.reduce((acc, curr)=>acc + curr.subtotal, 0);
    const handleSubmitSetor = async (e)=>{
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!idNasabah) {
            setError('Harap pilih nasabah penerima!');
            return;
        }
        if (buildingReceipt.length === 0) {
            setError('Tambahkan minimal 1 item sampah ke dalam tabel setoran sebelum menyimpan!');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/petugas/setor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_nasabah: parseInt(idNasabah),
                    items: buildingReceipt
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menyimpan transaksi');
            }
            setSuccess(data.message || 'Transaksi setor sampah berhasil disimpan!');
            setBuildingReceipt([]);
            setIdNasabah('');
            // Refresh state from database
            router.replace(router.asPath);
        } catch (err) {
            setError(err.message || 'Gagal menyimpan setoran.');
        } finally{
            setSubmitting(false);
        }
    };
    const handleApproveTarik = async (idTarik)=>{
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/petugas/approve-tarik', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_tarik: idTarik
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menyetujui penarikan');
            }
            setSuccess(data.message || 'Penarikan berhasil disetujui');
            router.replace(router.asPath);
        } catch (err) {
            setError(err.message || 'Gagal menyetujui penarikan');
        }
    };
    const handleRejectTarik = async (idTarik)=>{
        setError('');
        setSuccess('');
        if (!confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
            return;
        }
        try {
            const res = await fetch('/api/petugas/reject-tarik', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_tarik: idTarik
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal menolak penarikan');
            }
            setSuccess(data.message || 'Pengajuan penarikan ditolak');
            router.replace(router.asPath);
        } catch (err) {
            setError(err.message || 'Gagal menolak penarikan');
        }
    };
    const handleUpdateHarga = async (e)=>{
        e.preventDefault();
        setError('');
        setSuccess('');
        const idKat = parseInt(updateKategoriId);
        const price = parseFloat(hargaBaru);
        if (isNaN(idKat) || isNaN(price) || price <= 0) {
            setError('Masukkan harga baru yang valid!');
            return;
        }
        try {
            const res = await fetch('/api/petugas/update-harga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_kategori: idKat,
                    harga_per_kg: price
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal memperbarui harga');
            }
            setSuccess(data.message || 'Harga kategori berhasil diperbarui!');
            setUpdateKategoriId('');
            setHargaBaru('');
            router.replace(router.asPath);
        } catch (err) {
            setError(err.message || 'Gagal memperbarui harga.');
        }
    };
    const handleCreateStaff = async (e)=>{
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!staffNama || !staffNomorHp || !staffRole || !staffPassword) {
            setError('Semua field wajib diisi (kecuali alamat)!');
            return;
        }
        setStaffSubmitting(true);
        try {
            const res = await fetch('/api/admin/create-staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nama: staffNama,
                    nomor_hp: staffNomorHp,
                    alamat: staffAlamat,
                    role: staffRole,
                    password: staffPassword
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Gagal membuat akun staff');
            }
            setSuccess(data.message || `Akun ${staffRole} berhasil dibuat secara manual.`);
            // Reset form
            setStaffNama('');
            setStaffNomorHp('');
            setStaffAlamat('');
            setStaffRole('Petugas');
            setStaffPassword('');
            router.replace(router.asPath);
        } catch (err) {
            setError(err.message || 'Gagal membuat akun staff.');
        } finally{
            setStaffSubmitting(false);
        }
    };
    // Group setoran logs
    const groupedSetor = {};
    all_setor_list.forEach((item)=>{
        if (!groupedSetor[item.id_setor]) {
            groupedSetor[item.id_setor] = {
                id_setor: item.id_setor,
                tanggal_setor: item.tanggal_setor,
                nama_nasabah: item.nama_nasabah,
                nomor_hp_nasabah: item.nomor_hp_nasabah,
                nama_petugas: item.nama_petugas,
                total: 0,
                details: []
            };
        }
        groupedSetor[item.id_setor].details.push(item);
        groupedSetor[item.id_setor].total += item.subtotal;
    });
    const sortedGroupedIds = Object.keys(groupedSetor).map(Number).sort((a, b)=>b - a);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-slate-50 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: "bg-emerald-700 text-white shadow-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
                                        className: "w-6 h-6 text-emerald-200"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 325,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-lg tracking-tight",
                                        children: "Bank Sampah Digital"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "hidden md:flex flex-col text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold",
                                                children: user.nama
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 330,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-emerald-200 uppercase font-mono tracking-wider",
                                                children: [
                                                    "Role: ",
                                                    user.role
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "bg-emerald-800 text-emerald-100 text-[11px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider md:hidden",
                                        children: user.role
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        className: "bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 340,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Keluar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 341,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 336,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 323,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-extrabold text-slate-800 tracking-tight",
                                children: "Dashboard Petugas"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500 mt-1",
                                children: "Kelola transaksi timbangan setoran sampah warga, persetujuan penarikan saldo, serta update katalog harga."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-sm text-red-700 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-4 h-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this),
                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg text-sm text-green-700 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "w-4 h-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: success
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 365,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-2 space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__["Scale"], {
                                                                className: "w-5 h-5 text-emerald-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 378,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-slate-800 text-sm uppercase tracking-wide",
                                                                children: "Input Setoran Sampah Baru"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 379,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans",
                                                        children: "Fast Entry"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 376,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                                    onSubmit: handleSubmitSetor,
                                                    className: "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "id_nasabah",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-sans",
                                                                    children: "Pilih Nasabah (Warga)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 388,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    name: "id_nasabah",
                                                                    id: "id_nasabah",
                                                                    required: true,
                                                                    value: idNasabah,
                                                                    onChange: (e)=>setIdNasabah(e.target.value),
                                                                    className: "block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            disabled: true,
                                                                            children: "-- Pilih Nasabah Penerima --"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 397,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        nasabah_list.map((nasabah)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: nasabah.id_user,
                                                                                children: [
                                                                                    nasabah.nama,
                                                                                    " • ",
                                                                                    nasabah.nomor_hp,
                                                                                    " (Saldo: Rp ",
                                                                                    nasabah.saldo.toLocaleString('id-ID'),
                                                                                    ")"
                                                                                ]
                                                                            }, nasabah.id_user, true, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 399,
                                                                                columnNumber: 25
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 389,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "border border-slate-200 rounded-xl p-4 bg-slate-50/50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex lg:items-end flex-wrap gap-4 mb-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex-grow min-w-[200px]",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans",
                                                                                    children: "Kategori Sampah"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 411,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    id: "select-kategori",
                                                                                    value: selectedKategoriId,
                                                                                    onChange: (e)=>setSelectedKategoriId(e.target.value),
                                                                                    className: "block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-normal font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "",
                                                                                            disabled: true,
                                                                                            children: "-- Pilih Kategori --"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 418,
                                                                                            columnNumber: 27
                                                                                        }, this),
                                                                                        kategori.map((kat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: kat.id_kategori,
                                                                                                children: [
                                                                                                    kat.nama_kategori,
                                                                                                    " (Rp ",
                                                                                                    kat.harga_per_kg.toLocaleString('id-ID'),
                                                                                                    "/Kg)"
                                                                                                ]
                                                                                            }, kat.id_kategori, true, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 420,
                                                                                                columnNumber: 29
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 412,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 410,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-32",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans",
                                                                                    children: "Berat (Kg)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 429,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    id: "input-berat",
                                                                                    step: "0.1",
                                                                                    min: "0.1",
                                                                                    placeholder: "0.0",
                                                                                    value: beratKg,
                                                                                    onChange: (e)=>setBeratKg(e.target.value),
                                                                                    className: "block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 430,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 428,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: addItemToReceipt,
                                                                                className: "w-full lg:w-auto py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                                                                                        className: "w-4 h-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                        lineNumber: 449,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        children: "Tambah Item"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                        lineNumber: 450,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 444,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 443,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 408,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "bg-white rounded-lg border border-slate-200 overflow-hidden",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                                        className: "w-full text-left border-collapse text-xs",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                    className: "bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                            className: "px-4 py-2",
                                                                                            children: "Kategori"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 460,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                            className: "px-4 py-2 text-right",
                                                                                            children: "Harga / Kg"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 461,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                            className: "px-4 py-2 text-right",
                                                                                            children: "Berat (Kg)"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 462,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                            className: "px-4 py-2 text-right",
                                                                                            children: "Subtotal"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 463,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                            className: "px-4 py-2 text-center w-16",
                                                                                            children: "Aksi"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 464,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 459,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 458,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                                                className: "divide-y divide-slate-100 text-slate-700",
                                                                                children: buildingReceipt.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                        colSpan: 5,
                                                                                        className: "px-4 py-6 text-center text-slate-400 italic font-sans font-normal",
                                                                                        children: "Belum ada item ditambahkan. Gunakan pilihan di atas untuk menambah sampah timbangan."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                        lineNumber: 470,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 469,
                                                                                    columnNumber: 29
                                                                                }, this) : buildingReceipt.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                        className: "hover:bg-slate-50",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "px-4 py-3 font-semibold text-slate-800",
                                                                                                children: item.nama_kategori
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 477,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "px-4 py-3 text-right font-mono text-slate-600",
                                                                                                children: [
                                                                                                    "Rp ",
                                                                                                    item.harga_per_kg.toLocaleString('id-ID')
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 478,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "px-4 py-3 text-right font-bold text-slate-900 font-mono",
                                                                                                children: [
                                                                                                    item.berat_kg.toFixed(1),
                                                                                                    " Kg"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 479,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "px-4 py-3 text-right text-emerald-800 font-semibold font-mono",
                                                                                                children: [
                                                                                                    "Rp ",
                                                                                                    item.subtotal.toLocaleString('id-ID')
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 480,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "px-4 py-3 text-center",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                    type: "button",
                                                                                                    onClick: ()=>removeItemFromReceipt(index),
                                                                                                    className: "text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition cursor-pointer",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                                        className: "w-4 h-4"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                        lineNumber: 487,
                                                                                                        columnNumber: 37
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                    lineNumber: 482,
                                                                                                    columnNumber: 35
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                                lineNumber: 481,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        ]
                                                                                    }, index, true, {
                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                        lineNumber: 476,
                                                                                        columnNumber: 31
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 467,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tfoot", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                    className: "bg-slate-50 border-t border-slate-200 font-bold text-slate-900",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                            colSpan: 3,
                                                                                            className: "px-4 py-3 text-right text-xs uppercase tracking-wider font-bold",
                                                                                            children: "Grand Total:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 496,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                            className: "px-4 py-3 text-right text-emerald-700 font-mono text-sm",
                                                                                            children: [
                                                                                                "Rp ",
                                                                                                receiptGrandTotal.toLocaleString('id-ID')
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 497,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 498,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 495,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 494,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-end pt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                type: "submit",
                                                                disabled: submitting,
                                                                className: "w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-md transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 511,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        children: submitting ? 'Menyimpan...' : 'Simpan Transaksi Setor & Update Saldo'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 512,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 384,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-slate-800 text-sm uppercase tracking-wide",
                                                        children: "Daftar Setoran Terbaru (Nasabah)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full",
                                                        children: [
                                                            sortedGroupedIds.length,
                                                            " Setoran"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 521,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "overflow-x-auto max-h-96",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                    className: "w-full text-left border-collapse text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                className: "bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                        className: "px-6 py-3",
                                                                        children: "Tanggal Setor"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 530,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                        className: "px-6 py-3",
                                                                        children: "Nasabah"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 531,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                        className: "px-6 py-3",
                                                                        children: "Timbangan Item"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 532,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                        className: "px-6 py-3 text-right",
                                                                        children: "Total Tabungan"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                        lineNumber: 533,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 529,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 528,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                            className: "divide-y divide-slate-100 text-slate-700 text-xs",
                                                            children: sortedGroupedIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    colSpan: 4,
                                                                    className: "px-6 py-8 text-center text-slate-400",
                                                                    children: "Belum ada transaksi di dalam sistem."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 23
                                                            }, this) : sortedGroupedIds.map((id)=>{
                                                                const tr = groupedSetor[id];
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                    className: "hover:bg-slate-50/50",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                            className: "px-6 py-3 font-mono text-slate-400 whitespace-nowrap",
                                                                            children: new Date(tr.tanggal_setor).toLocaleString('id-ID')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 548,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                            className: "px-6 py-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "font-bold text-slate-800",
                                                                                    children: tr.nama_nasabah
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 552,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "text-[10px] text-slate-400 font-mono",
                                                                                    children: tr.nomor_hp_nasabah
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 553,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 551,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                            className: "px-6 py-3",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-wrap gap-1",
                                                                                children: tr.details.map((detail, dIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "inline-flex bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide mr-1 mb-1 font-semibold",
                                                                                        children: [
                                                                                            detail.nama_kategori,
                                                                                            ": ",
                                                                                            detail.berat_kg,
                                                                                            " Kg"
                                                                                        ]
                                                                                    }, dIdx, true, {
                                                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                        lineNumber: 558,
                                                                                        columnNumber: 35
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 556,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 555,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                            className: "px-6 py-3 text-right font-bold text-emerald-800 font-mono whitespace-nowrap",
                                                                            children: [
                                                                                "Rp ",
                                                                                tr.total.toLocaleString('id-ID')
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 564,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, id, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 547,
                                                                    columnNumber: 27
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 527,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 526,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-6 py-4 border-b border-slate-200 bg-emerald-50/50 flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"], {
                                                                className: "w-5 h-5 text-emerald-800"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-emerald-900 text-xs uppercase tracking-wider",
                                                                children: "Antrean Persetujuan Saldo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                lineNumber: 586,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-xs bg-amber-100 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full font-mono",
                                                        children: pending_withdrawals.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 583,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-6",
                                                children: pending_withdrawals.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"], {
                                                            className: "w-10 h-10 text-slate-200"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 596,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Tidak ada antrean penarikan dana pending saat ini."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 597,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 595,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: pending_withdrawals.map((tarik)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between hover:border-emerald-500 transition duration-150",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex justify-between items-start",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                                            className: "font-bold text-slate-800 text-sm",
                                                                                            children: tarik.nama_nasabah
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 606,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[10px] font-mono text-slate-400",
                                                                                            children: [
                                                                                                "Hp: ",
                                                                                                tarik.nomor_hp_nasabah
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 607,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 605,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-mono font-bold",
                                                                                    children: [
                                                                                        "Rp ",
                                                                                        tarik.jumlah_tarik.toLocaleString('id-ID')
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 609,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 604,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-[11px] text-slate-500 mt-2 flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                    className: "w-3 h-3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 614,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "Diajukan: ",
                                                                                        new Date(tarik.tanggal_pengajuan).toLocaleString('id-ID')
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 615,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 613,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-[11px] text-slate-500 flex items-center gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                                                                    className: "w-3 h-3 text-emerald-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 618,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    children: [
                                                                                        "Saldo Terakhir: ",
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                                            className: "text-slate-800 font-mono",
                                                                                            children: [
                                                                                                "Rp ",
                                                                                                tarik.saldo_nasabah.toLocaleString('id-ID')
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                            lineNumber: 619,
                                                                                            columnNumber: 51
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                    lineNumber: 619,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 617,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 603,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-2 gap-2 border-t border-slate-200 pt-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleApproveTarik(tarik.id_tarik),
                                                                            type: "button",
                                                                            className: "w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-[11px] rounded-lg shadow-sm transition block cursor-pointer",
                                                                            children: "Approve / Setujui"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 624,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleRejectTarik(tarik.id_tarik),
                                                                            type: "button",
                                                                            className: "w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-center text-[11px] rounded-lg transition block cursor-pointer",
                                                                            children: "Tolak / Batalkan"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 631,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 623,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, tarik.id_tarik, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 602,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 600,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 593,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 582,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                                        className: "w-5 h-5 text-slate-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-slate-800 text-xs uppercase tracking-wider",
                                                        children: "Perbarui Harga Sampah"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 650,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 648,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                                    onSubmit: handleUpdateHarga,
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "update_id_kategori",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Pilih Kategori Sampah"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 656,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    name: "id_kategori",
                                                                    id: "update_id_kategori",
                                                                    required: true,
                                                                    value: updateKategoriId,
                                                                    onChange: handleCategoryPriceSelected,
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            disabled: true,
                                                                            children: "-- Pilih Kategori --"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 665,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        kategori.map((kat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: kat.id_kategori,
                                                                                children: [
                                                                                    kat.nama_kategori,
                                                                                    " (Sekarang: Rp ",
                                                                                    kat.harga_per_kg,
                                                                                    "/Kg)"
                                                                                ]
                                                                            }, kat.id_kategori, true, {
                                                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                                lineNumber: 667,
                                                                                columnNumber: 25
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 657,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "harga_baru",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Harga Baru Per Kg (Rupiah)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 675,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-xs",
                                                                            children: "Rp"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 677,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            name: "harga_per_kg",
                                                                            id: "harga_baru",
                                                                            required: true,
                                                                            min: "100",
                                                                            step: "50",
                                                                            placeholder: "Contoh: 2500",
                                                                            value: hargaBaru,
                                                                            onChange: (e)=>setHargaBaru(e.target.value),
                                                                            className: "block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none font-mono"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 680,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 676,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 674,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            className: "w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer",
                                                            children: "Perbarui Harga Katalog"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 695,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 653,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 647,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"], {
                                                        className: "w-5 h-5 text-slate-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 705,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-slate-800 text-xs uppercase tracking-wider",
                                                        children: "Tambah Petugas / Pengepul"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                        lineNumber: 706,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 704,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                                    onSubmit: handleCreateStaff,
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "staff_nama",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Nama Lengkap"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 712,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "staff_nama",
                                                                    required: true,
                                                                    placeholder: "Nama Lengkap Staff",
                                                                    value: staffNama,
                                                                    onChange: (e)=>setStaffNama(e.target.value),
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white transition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 713,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 711,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "staff_nomor_hp",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Nomor HP"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 725,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    id: "staff_nomor_hp",
                                                                    required: true,
                                                                    placeholder: "Contoh: 0812xxxxxxxx",
                                                                    value: staffNomorHp,
                                                                    onChange: (e)=>setStaffNomorHp(e.target.value),
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white transition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 726,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "staff_alamat",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Alamat (Opsional)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 738,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                    id: "staff_alamat",
                                                                    rows: 2,
                                                                    placeholder: "Alamat Lengkap",
                                                                    value: staffAlamat,
                                                                    onChange: (e)=>setStaffAlamat(e.target.value),
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white transition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 739,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "staff_role",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Pilihan Role"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 750,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    id: "staff_role",
                                                                    required: true,
                                                                    value: staffRole,
                                                                    onChange: (e)=>setStaffRole(e.target.value),
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "Petugas",
                                                                            children: "Petugas"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 758,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "Pengepul",
                                                                            children: "Pengepul"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                            lineNumber: 759,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 751,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 749,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "staff_password",
                                                                    className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 font-sans",
                                                                    children: "Kata Sandi"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 764,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "password",
                                                                    id: "staff_password",
                                                                    required: true,
                                                                    placeholder: "••••••••",
                                                                    value: staffPassword,
                                                                    onChange: (e)=>setStaffPassword(e.target.value),
                                                                    className: "block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:bg-white transition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                                    lineNumber: 765,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 763,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            disabled: staffSubmitting,
                                                            className: "w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50",
                                                            children: staffSubmitting ? 'Memproses...' : 'Daftarkan Staff Baru'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                            lineNumber: 776,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                    lineNumber: 710,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                                lineNumber: 709,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                        lineNumber: 703,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: "bg-slate-800 text-slate-400 text-center py-6 border-t border-slate-700 text-xs mt-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: "© 2026 Bank Sampah Digital. Semua hak dilindungi • Tata Kelola Hijau Mandiri Sektor Petugas."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/dashboard/petugas.tsx",
                        lineNumber: 795,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/dashboard/petugas.tsx",
                    lineNumber: 794,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/dashboard/petugas.tsx",
                lineNumber: 793,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/dashboard/petugas.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
const getServerSideProps = async (context)=>{
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$session$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getSessionUser"])(context.req);
    if (!user || user.role !== 'Petugas') {
        return {
            redirect: {
                destination: '/login?error=Silakan+masuk+terlebih+dahulu',
                permanent: false
            }
        };
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["initializeDatabase"])();
        const nasabah_list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["dbAll"])("SELECT id_user, nama, nomor_hp, saldo FROM users WHERE role = 'Nasabah' ORDER BY nama ASC");
        const kategori = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["dbAll"])('SELECT * FROM kategori_sampah ORDER BY id_kategori ASC');
        const countRow = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["dbGet"])('SELECT COUNT(DISTINCT id_setor) AS c FROM transaksi_setor');
        const total_setor_count = countRow ? countRow.c : 0;
        // Detailed deposit list
        const all_setor_list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["dbAll"])(`
      SELECT ts.id_setor, ts.tanggal_setor, ds.berat_kg, ds.subtotal, k.nama_kategori, 
             u_nasabah.nama AS nama_nasabah, u_nasabah.nomor_hp AS nomor_hp_nasabah, 
             u_petugas.nama AS nama_petugas
      FROM transaksi_setor ts
      JOIN detail_setor ds ON ts.id_setor = ds.id_setor
      JOIN kategori_sampah k ON ds.id_kategori = k.id_kategori
      JOIN users u_nasabah ON ts.id_user = u_nasabah.id_user
      JOIN users u_petugas ON ts.id_petugas = u_petugas.id_user
      ORDER BY ts.tanggal_setor DESC
    `);
        // Pending withdrawal requests with user current details
        const pending_withdrawals = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["dbAll"])(`
      SELECT ps.*, u.nama AS nama_nasabah, u.nomor_hp AS nomor_hp_nasabah, u.saldo AS saldo_nasabah
      FROM penarikan_saldo ps
      JOIN users u ON ps.id_user = u.id_user
      WHERE ps.status = 'Pending'
      ORDER BY ps.tanggal_pengajuan ASC
    `);
        return {
            props: {
                user,
                nasabah_list: JSON.parse(JSON.stringify(nasabah_list)),
                kategori: JSON.parse(JSON.stringify(kategori)),
                total_setor_count,
                all_setor_list: JSON.parse(JSON.stringify(all_setor_list)),
                pending_withdrawals: JSON.parse(JSON.stringify(pending_withdrawals))
            }
        };
    } catch (err) {
        console.error('Error on Petugas dashboard getServerSideProps:', err);
        return {
            notFound: true
        };
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1quv31h._.js.map