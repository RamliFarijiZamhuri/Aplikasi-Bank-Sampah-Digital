module.exports=[74400,e=>{"use strict";let a="bank_sampah_session";e.s(["clearSessionUser",0,function(e){e.setHeader("Set-Cookie",`${a}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)},"getSessionUser",0,function(e){let t=e.cookies[a];if(!t)return null;try{let e=Buffer.from(t,"base64").toString("utf-8");return JSON.parse(e)}catch{return null}},"setSessionUser",0,function(e,t){let s,i=(s=JSON.stringify(t),Buffer.from(s).toString("base64"));e.setHeader("Set-Cookie",`${a}=${i}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)}])},70406,(e,a,t)=>{a.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,a,t)=>{a.exports=e.x("path",()=>require("path"))},77283,(e,a,t)=>{a.exports=e.x("sqlite3-03df7d93c81c1156",()=>require("sqlite3-03df7d93c81c1156"))},44950,e=>e.a(async(a,t)=>{try{let a=await e.y("bcryptjs-ee66c2bdc904f2cf");e.n(a),t()}catch(e){t(e)}},!0),54948,e=>e.a(async(a,t)=>{try{var s=e.i(77283),i=e.i(14747),r=e.i(44950),n=a([r]);[r]=n.then?(await n)():n;let o=i.default.resolve(process.cwd(),"database.sqlite"),l=new s.default.Database(o),d=(e,a=[])=>new Promise((t,s)=>{l.run(e,a,function(e){e?s(e):t(this)})}),u=(e,a=[])=>new Promise((t,s)=>{l.get(e,a,(e,a)=>{e?s(e):t(a)})});async function E(){if(await d("PRAGMA foreign_keys = ON;"),!await u("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")){console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis..."),await d(`
      CREATE TABLE users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `),await d(`
      CREATE TABLE kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `),await d(`
      CREATE TABLE transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await d(`
      CREATE TABLE detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `),await d(`
      CREATE TABLE penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await d(`
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
    `);let e=await r.default.genSalt(10),a=await r.default.hash("password123",e);await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Budi Petugas","081234567890","Kantor Bank Sampah Indah","Petugas",a,0]),await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Siti Nasabah","081299999999","Jl. Mawar No. 12, RT 02/03","Nasabah",a,5e4]),await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Rudi Pengepul","081388888888","Gudang Sukses Makmur, Bekasi","Pengepul",a,0]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Plastik PET",2e3]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Kardus",1500]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Besi",5e3]),await d("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[2,1,"2026-06-01 10:00:00"]),await d("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,1,15,3e4]),await d("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,2,20,3e4]),await d("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[6e4,2]),await d("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,1e4,"2026-06-02 14:00:00","Success"]),await d("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,25e3,"2026-06-03 09:00:00","Pending"]),await d("INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)",[3,1,5,"2026-06-02 16:30:00",1e4]),console.log("Seeding awal SQLite di Next.js sukses!")}}e.s(["dbGet",0,u,"dbRun",0,d,"initializeDatabase",0,E]),t()}catch(e){t(e)}},!1),73904,e=>e.a(async(a,t)=>{try{var s=e.i(54948),i=e.i(74400),r=a([s]);async function n(e,a){if("POST"!==e.method)return a.status(455).json({message:"Metode tidak diperbolehkan"});let t=(0,i.getSessionUser)(e);if(!t||"Nasabah"!==t.role)return a.status(401).json({message:"Akses tidak sah"});let r=parseFloat(e.body.jumlah_tarik);if(isNaN(r)||r<=0)return a.status(400).json({message:"Nominal penarikan tidak valid"});try{let e=await (0,s.dbGet)("SELECT saldo FROM users WHERE id_user = ?",[t.id]);if(!e||e.saldo<r)return a.status(400).json({message:`Saldo tidak mencukupi. Saldo Anda saat ini Rp ${(e?.saldo||0).toLocaleString("id-ID")}`});let i=new Date().toISOString().replace("T"," ").substring(0,19);return await (0,s.dbRun)('INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, "Pending")',[t.id,r,i]),a.status(200).json({status:"success",message:"Pengajuan penarikan saldo berhasil dikirim. Silakan tunggu validasi petugas."})}catch(e){return console.error("Withdrawal error:",e),a.status(500).json({message:"Terjadi kesalahan sistem internal."})}}[s]=r.then?(await r)():r,e.s(["default",0,n]),t()}catch(e){t(e)}},!1),35313,e=>e.a(async(a,t)=>{try{var s=e.i(26747),i=e.i(90406),r=e.i(44898),n=e.i(62950),E=e.i(73904),o=e.i(7031),l=e.i(81927),d=e.i(46432),u=a([E]);[E]=u.then?(await u)():u;let T=(0,n.hoist)(E,"default"),p=(0,n.hoist)(E,"config"),g=new r.PagesAPIRouteModule({definition:{kind:i.RouteKind.PAGES_API,page:"/api/nasabah/tarik",pathname:"/api/nasabah/tarik",bundlePath:"",filename:""},userland:E,distDir:".next",relativeProjectDir:""});async function N(e,a,t){t.requestMeta&&(0,d.setRequestMeta)(e,t.requestMeta),g.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/nasabah/tarik";i=i.replace(/\/index$/,"")||"/";let r=await g.prepare(e,a,{srcPage:i});if(!r){a.statusCode=400,a.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve());return}let{query:n,params:E,prerenderManifest:u,routerServerContext:N}=r;try{let t,s=e.method||"GET",r=(0,o.getTracer)(),d=r.getActiveScopeSpan(),T=!!(null==N?void 0:N.isWrappedByNextServer),p=g.instrumentationOnRequestError.bind(g),_=async o=>g.render(e,a,{query:{...n,...E},params:E,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:u.preview,propagateError:!1,dev:g.isDev,page:"/api/nasabah/tarik",internalRevalidate:null==N?void 0:N.revalidate,onError:(...a)=>p(e,...a)}).finally(()=>{if(!o)return;o.setAttributes({"http.status_code":a.statusCode,"next.rsc":!1});let e=r.getRootSpanAttributes();if(!e)return;if(e.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${e.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=e.get("next.route");if(n){let e=`${s} ${n}`;o.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),o.updateName(e),t&&t!==o&&(t.setAttribute("http.route",n),t.updateName(e))}else o.updateName(`${s} ${i}`)});T&&d?await _(d):(t=r.getActiveScopeSpan(),await r.withPropagatedContext(e.headers,()=>r.trace(l.BaseServerSpan.handleRequest,{spanName:`${s} ${i}`,kind:o.SpanKind.SERVER,attributes:{"http.method":s,"http.target":e.url}},_),void 0,!T))}catch(e){if(g.isDev)throw e;(0,s.sendError)(a,500,"Internal Server Error")}finally{null==t.waitUntil||t.waitUntil.call(t,Promise.resolve())}}e.s(["config",0,p,"default",0,T,"handler",0,N]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__1cas2f7._.js.map