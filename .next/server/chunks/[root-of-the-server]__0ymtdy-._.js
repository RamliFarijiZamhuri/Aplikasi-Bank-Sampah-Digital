module.exports=[74400,a=>{"use strict";let e="bank_sampah_session";a.s(["clearSessionUser",0,function(a){a.setHeader("Set-Cookie",`${e}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)},"getSessionUser",0,function(a){let t=a.cookies[e];if(!t)return null;try{let a=Buffer.from(t,"base64").toString("utf-8");return JSON.parse(a)}catch{return null}},"setSessionUser",0,function(a,t){let s,r=(s=JSON.stringify(t),Buffer.from(s).toString("base64"));a.setHeader("Set-Cookie",`${e}=${r}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)}])},70406,(a,e,t)=>{e.exports=a.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(a,e,t)=>{e.exports=a.x("path",()=>require("path"))},77283,(a,e,t)=>{e.exports=a.x("sqlite3-03df7d93c81c1156",()=>require("sqlite3-03df7d93c81c1156"))},44950,a=>a.a(async(e,t)=>{try{let e=await a.y("bcryptjs-ee66c2bdc904f2cf");a.n(e),t()}catch(a){t(a)}},!0),54948,a=>a.a(async(e,t)=>{try{var s=a.i(77283),r=a.i(14747),i=a.i(44950),n=e([i]);[i]=n.then?(await n)():n;let o=r.default.resolve(process.cwd(),"database.sqlite"),u=new s.default.Database(o),d=(a,e=[])=>new Promise((t,s)=>{u.run(a,e,function(a){a?s(a):t(this)})}),l=(a,e=[])=>new Promise((t,s)=>{u.get(a,e,(a,e)=>{a?s(a):t(e)})});async function E(){if(await d("PRAGMA foreign_keys = ON;"),!await l("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")){console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis..."),await d(`
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
    `);let a=await i.default.genSalt(10),e=await i.default.hash("password123",a);await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Budi Petugas","081234567890","Kantor Bank Sampah Indah","Petugas",e,0]),await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Siti Nasabah","081299999999","Jl. Mawar No. 12, RT 02/03","Nasabah",e,5e4]),await d("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Rudi Pengepul","081388888888","Gudang Sukses Makmur, Bekasi","Pengepul",e,0]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Plastik PET",2e3]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Kardus",1500]),await d("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Besi",5e3]),await d("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[2,1,"2026-06-01 10:00:00"]),await d("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,1,15,3e4]),await d("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,2,20,3e4]),await d("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[6e4,2]),await d("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,1e4,"2026-06-02 14:00:00","Success"]),await d("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,25e3,"2026-06-03 09:00:00","Pending"]),await d("INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)",[3,1,5,"2026-06-02 16:30:00",1e4]),console.log("Seeding awal SQLite di Next.js sukses!")}}a.s(["dbGet",0,l,"dbRun",0,d,"initializeDatabase",0,E]),t()}catch(a){t(a)}},!1),29326,a=>a.a(async(e,t)=>{try{var s=a.i(54948),r=a.i(74400),i=e([s]);async function n(a,e){if("POST"!==a.method)return e.status(455).json({message:"Metode tidak diperbolehkan"});let t=(0,r.getSessionUser)(a);if(!t||"Petugas"!==t.role)return e.status(401).json({message:"Akses tidak sah"});let i=parseInt(a.body.id_tarik);if(!i)return e.status(400).json({message:"ID pengajuan tidak valid"});try{await (0,s.dbRun)("BEGIN TRANSACTION;");let a=await (0,s.dbGet)(`
      SELECT ps.*, u.saldo, u.id_user FROM penarikan_saldo ps 
      JOIN users u ON ps.id_user = u.id_user 
      WHERE ps.id_tarik = ? AND ps.status = 'Pending'
    `,[i]);if(!a)return await (0,s.dbRun)("ROLLBACK;"),e.status(404).json({message:"Data pengajuan tidak ditemukan atau sudah diproses"});if(a.saldo<a.jumlah_tarik)return await (0,s.dbRun)("ROLLBACK;"),e.status(400).json({message:`Saldo Nasabah tidak mencukupi untuk disetujui! (Saldo: Rp ${a.saldo.toLocaleString("id-ID")} - Pengajuan: Rp ${a.jumlah_tarik.toLocaleString("id-ID")})`});return await (0,s.dbRun)('UPDATE penarikan_saldo SET status = "Success" WHERE id_tarik = ?',[i]),await (0,s.dbRun)("UPDATE users SET saldo = saldo - ? WHERE id_user = ?",[a.jumlah_tarik,a.id_user]),await (0,s.dbRun)("COMMIT;"),e.status(200).json({status:"success",message:"Pengajuan penarikan dana berhasil disetujui. Saldo nasabah terpotong aman."})}catch(a){console.error("Error approving withdrawal:",a);try{await (0,s.dbRun)("ROLLBACK;")}catch(a){console.error("Rollback error:",a)}return e.status(500).json({message:"Sistem gagal menyelesaikan proses persetujuan"})}}[s]=i.then?(await i)():i,a.s(["default",0,n]),t()}catch(a){t(a)}},!1),2262,a=>a.a(async(e,t)=>{try{var s=a.i(26747),r=a.i(90406),i=a.i(44898),n=a.i(62950),E=a.i(29326),o=a.i(7031),u=a.i(81927),d=a.i(46432),l=e([E]);[E]=l.then?(await l)():l;let N=(0,n.hoist)(E,"default"),T=(0,n.hoist)(E,"config"),g=new i.PagesAPIRouteModule({definition:{kind:r.RouteKind.PAGES_API,page:"/api/petugas/approve-tarik",pathname:"/api/petugas/approve-tarik",bundlePath:"",filename:""},userland:E,distDir:".next",relativeProjectDir:""});async function p(a,e,t){t.requestMeta&&(0,d.setRequestMeta)(a,t.requestMeta),g.isDev&&(0,d.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/petugas/approve-tarik";r=r.replace(/\/index$/,"")||"/";let i=await g.prepare(a,e,{srcPage:r});if(!i){e.statusCode=400,e.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve());return}let{query:n,params:E,prerenderManifest:l,routerServerContext:p}=i;try{let t,s=a.method||"GET",i=(0,o.getTracer)(),d=i.getActiveScopeSpan(),N=!!(null==p?void 0:p.isWrappedByNextServer),T=g.instrumentationOnRequestError.bind(g),R=async o=>g.render(a,e,{query:{...n,...E},params:E,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:l.preview,propagateError:!1,dev:g.isDev,page:"/api/petugas/approve-tarik",internalRevalidate:null==p?void 0:p.revalidate,onError:(...e)=>T(a,...e)}).finally(()=>{if(!o)return;o.setAttributes({"http.status_code":e.statusCode,"next.rsc":!1});let a=i.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let a=`${s} ${n}`;o.setAttributes({"next.route":n,"http.route":n,"next.span_name":a}),o.updateName(a),t&&t!==o&&(t.setAttribute("http.route",n),t.updateName(a))}else o.updateName(`${s} ${r}`)});N&&d?await R(d):(t=i.getActiveScopeSpan(),await i.withPropagatedContext(a.headers,()=>i.trace(u.BaseServerSpan.handleRequest,{spanName:`${s} ${r}`,kind:o.SpanKind.SERVER,attributes:{"http.method":s,"http.target":a.url}},R),void 0,!N))}catch(a){if(g.isDev)throw a;(0,s.sendError)(e,500,"Internal Server Error")}finally{null==t.waitUntil||t.waitUntil.call(t,Promise.resolve())}}a.s(["config",0,T,"default",0,N,"handler",0,p]),t()}catch(a){t(a)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ymtdy-._.js.map