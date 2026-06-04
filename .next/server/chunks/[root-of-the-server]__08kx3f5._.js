module.exports=[74400,e=>{"use strict";let a="bank_sampah_session";e.s(["clearSessionUser",0,function(e){e.setHeader("Set-Cookie",`${a}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)},"getSessionUser",0,function(e){let t=e.cookies[a];if(!t)return null;try{let e=Buffer.from(t,"base64").toString("utf-8");return JSON.parse(e)}catch{return null}},"setSessionUser",0,function(e,t){let s,r=(s=JSON.stringify(t),Buffer.from(s).toString("base64"));e.setHeader("Set-Cookie",`${a}=${r}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)}])},70406,(e,a,t)=>{a.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,a,t)=>{a.exports=e.x("path",()=>require("path"))},77283,(e,a,t)=>{a.exports=e.x("sqlite3-03df7d93c81c1156",()=>require("sqlite3-03df7d93c81c1156"))},44950,e=>e.a(async(a,t)=>{try{let a=await e.y("bcryptjs-ee66c2bdc904f2cf");e.n(a),t()}catch(e){t(e)}},!0),54948,e=>e.a(async(a,t)=>{try{var s=e.i(77283),r=e.i(14747),i=e.i(44950),n=a([i]);[i]=n.then?(await n)():n;let E=r.default.resolve(process.cwd(),"database.sqlite"),d=new s.default.Database(E),l=(e,a=[])=>new Promise((t,s)=>{d.run(e,a,function(e){e?s(e):t(this)})}),u=(e,a=[])=>new Promise((t,s)=>{d.get(e,a,(e,a)=>{e?s(e):t(a)})});async function o(){if(await l("PRAGMA foreign_keys = ON;"),!await u("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")){console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis..."),await l(`
      CREATE TABLE users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `),await l(`
      CREATE TABLE kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `),await l(`
      CREATE TABLE transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await l(`
      CREATE TABLE detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `),await l(`
      CREATE TABLE penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await l(`
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
    `);let e=await i.default.genSalt(10),a=await i.default.hash("password123",e);await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Budi Petugas","081234567890","Kantor Bank Sampah Indah","Petugas",a,0]),await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Siti Nasabah","081299999999","Jl. Mawar No. 12, RT 02/03","Nasabah",a,5e4]),await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Rudi Pengepul","081388888888","Gudang Sukses Makmur, Bekasi","Pengepul",a,0]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Plastik PET",2e3]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Kardus",1500]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Besi",5e3]),await l("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[2,1,"2026-06-01 10:00:00"]),await l("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,1,15,3e4]),await l("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,2,20,3e4]),await l("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[6e4,2]),await l("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,1e4,"2026-06-02 14:00:00","Success"]),await l("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,25e3,"2026-06-03 09:00:00","Pending"]),await l("INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)",[3,1,5,"2026-06-02 16:30:00",1e4]),console.log("Seeding awal SQLite di Next.js sukses!")}}e.s(["dbGet",0,u,"dbRun",0,l,"initializeDatabase",0,o]),t()}catch(e){t(e)}},!1),95650,e=>e.a(async(a,t)=>{try{var s=e.i(54948),r=e.i(74400),i=a([s]);async function n(e,a){if("POST"!==e.method)return a.status(455).json({message:"Metode tidak diperbolehkan"});let t=(0,r.getSessionUser)(e);if(!t||"Petugas"!==t.role)return a.status(401).json({message:"Akses tidak sah"});let i=parseInt(e.body.id_nasabah),n=e.body.items;if(!i||!n||!Array.isArray(n)||0===n.length)return a.status(400).json({message:"Parameter setoran tidak lengkap atau tidak valid"});try{await (0,s.dbRun)("BEGIN TRANSACTION;");let e=new Date().toISOString().replace("T"," ").substring(0,19),r=(await (0,s.dbRun)("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[i,t.id,e])).lastID,o=0;for(let e of n){let a=parseInt(e.id_kategori),t=parseFloat(e.berat_kg);if(isNaN(a)||isNaN(t)||t<=0)throw Error("Data item timbangan tidak valid");let i=await (0,s.dbGet)("SELECT harga_per_kg FROM kategori_sampah WHERE id_kategori = ?",[a]);if(!i)throw Error("Kategori sampah tidak ditemukan");let n=i.harga_per_kg,E=t*n;o+=E,await (0,s.dbRun)("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[r,a,t,E])}return await (0,s.dbRun)("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[o,i]),await (0,s.dbRun)("COMMIT;"),a.status(200).json({status:"success",message:`Setoran sampah berhasil disimpan. Saldo nasabah bertambah Rp ${o.toLocaleString("id-ID")}`})}catch(e){console.error("Error in Petugas Setor transaction:",e);try{await (0,s.dbRun)("ROLLBACK;")}catch(e){console.error("Rollback error:",e)}return a.status(500).json({message:e.message||"Terjadi kesalahan sistem saat menyimpan data setoran. Transaksi dibatalkan."})}}[s]=i.then?(await i)():i,e.s(["default",0,n]),t()}catch(e){t(e)}},!1),94928,e=>e.a(async(a,t)=>{try{var s=e.i(26747),r=e.i(90406),i=e.i(44898),n=e.i(62950),o=e.i(95650),E=e.i(7031),d=e.i(81927),l=e.i(46432),u=a([o]);[o]=u.then?(await u)():u;let T=(0,n.hoist)(o,"default"),g=(0,n.hoist)(o,"config"),p=new i.PagesAPIRouteModule({definition:{kind:r.RouteKind.PAGES_API,page:"/api/petugas/setor",pathname:"/api/petugas/setor",bundlePath:"",filename:""},userland:o,distDir:".next",relativeProjectDir:""});async function N(e,a,t){t.requestMeta&&(0,l.setRequestMeta)(e,t.requestMeta),p.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/petugas/setor";r=r.replace(/\/index$/,"")||"/";let i=await p.prepare(e,a,{srcPage:r});if(!i){a.statusCode=400,a.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve());return}let{query:n,params:o,prerenderManifest:u,routerServerContext:N}=i;try{let t,s=e.method||"GET",i=(0,E.getTracer)(),l=i.getActiveScopeSpan(),T=!!(null==N?void 0:N.isWrappedByNextServer),g=p.instrumentationOnRequestError.bind(p),_=async E=>p.render(e,a,{query:{...n,...o},params:o,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:u.preview,propagateError:!1,dev:p.isDev,page:"/api/petugas/setor",internalRevalidate:null==N?void 0:N.revalidate,onError:(...a)=>g(e,...a)}).finally(()=>{if(!E)return;E.setAttributes({"http.status_code":a.statusCode,"next.rsc":!1});let e=i.getRootSpanAttributes();if(!e)return;if(e.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${e.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=e.get("next.route");if(n){let e=`${s} ${n}`;E.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),E.updateName(e),t&&t!==E&&(t.setAttribute("http.route",n),t.updateName(e))}else E.updateName(`${s} ${r}`)});T&&l?await _(l):(t=i.getActiveScopeSpan(),await i.withPropagatedContext(e.headers,()=>i.trace(d.BaseServerSpan.handleRequest,{spanName:`${s} ${r}`,kind:E.SpanKind.SERVER,attributes:{"http.method":s,"http.target":e.url}},_),void 0,!T))}catch(e){if(p.isDev)throw e;(0,s.sendError)(a,500,"Internal Server Error")}finally{null==t.waitUntil||t.waitUntil.call(t,Promise.resolve())}}e.s(["config",0,g,"default",0,T,"handler",0,N]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__08kx3f5._.js.map