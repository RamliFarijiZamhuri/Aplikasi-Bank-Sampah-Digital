module.exports=[74400,e=>{"use strict";let a="bank_sampah_session";e.s(["clearSessionUser",0,function(e){e.setHeader("Set-Cookie",`${a}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)},"getSessionUser",0,function(e){let t=e.cookies[a];if(!t)return null;try{let e=Buffer.from(t,"base64").toString("utf-8");return JSON.parse(e)}catch{return null}},"setSessionUser",0,function(e,t){let r,s=(r=JSON.stringify(t),Buffer.from(r).toString("base64"));e.setHeader("Set-Cookie",`${a}=${s}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)}])},70406,(e,a,t)=>{a.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,a,t)=>{a.exports=e.x("path",()=>require("path"))},44950,e=>e.a(async(a,t)=>{try{let a=await e.y("bcryptjs-ee66c2bdc904f2cf");e.n(a),t()}catch(e){t(e)}},!0),77283,(e,a,t)=>{a.exports=e.x("sqlite3-03df7d93c81c1156",()=>require("sqlite3-03df7d93c81c1156"))},54948,e=>e.a(async(a,t)=>{try{var r=e.i(77283),s=e.i(14747),i=e.i(44950),n=a([i]);[i]=n.then?(await n)():n;let o=s.default.resolve(process.cwd(),"database.sqlite"),l=new r.default.Database(o),u=(e,a=[])=>new Promise((t,r)=>{l.run(e,a,function(e){e?r(e):t(this)})}),d=(e,a=[])=>new Promise((t,r)=>{l.get(e,a,(e,a)=>{e?r(e):t(a)})});async function E(){if(await u("PRAGMA foreign_keys = ON;"),!await d("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")){console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis..."),await u(`
      CREATE TABLE users (
        id_user INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nomor_hp TEXT UNIQUE NOT NULL,
        alamat TEXT,
        role TEXT CHECK(role IN ('Nasabah', 'Petugas', 'Pengepul')) NOT NULL,
        password TEXT NOT NULL,
        saldo REAL DEFAULT 0
      );
    `),await u(`
      CREATE TABLE kategori_sampah (
        id_kategori INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kategori TEXT NOT NULL,
        harga_per_kg REAL NOT NULL
      );
    `),await u(`
      CREATE TABLE transaksi_setor (
        id_setor INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_petugas INTEGER NOT NULL,
        tanggal_setor TEXT NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await u(`
      CREATE TABLE detail_setor (
        id_detail INTEGER PRIMARY KEY AUTOINCREMENT,
        id_setor INTEGER NOT NULL,
        id_kategori INTEGER NOT NULL,
        berat_kg REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (id_setor) REFERENCES transaksi_setor (id_setor) ON DELETE CASCADE,
        FOREIGN KEY (id_kategori) REFERENCES kategori_sampah (id_kategori) ON DELETE CASCADE
      );
    `),await u(`
      CREATE TABLE penarikan_saldo (
        id_tarik INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user INTEGER NOT NULL,
        id_tarik_dummy INTEGER,
        jumlah_tarik REAL NOT NULL,
        tanggal_pengajuan TEXT NOT NULL,
        status TEXT CHECK(status IN ('Pending', 'Success')) DEFAULT 'Pending',
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
      );
    `),await u(`
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
    `);let e=await i.default.genSalt(10),a=await i.default.hash("password123",e);await u("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Budi Petugas","081234567890","Kantor Bank Sampah Indah","Petugas",a,0]),await u("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Siti Nasabah","081299999999","Jl. Mawar No. 12, RT 02/03","Nasabah",a,5e4]),await u("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Rudi Pengepul","081388888888","Gudang Sukses Makmur, Bekasi","Pengepul",a,0]),await u("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Plastik PET",2e3]),await u("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Kardus",1500]),await u("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Besi",5e3]),await u("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[2,1,"2026-06-01 10:00:00"]),await u("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,1,15,3e4]),await u("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,2,20,3e4]),await u("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[6e4,2]),await u("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,1e4,"2026-06-02 14:00:00","Success"]),await u("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,25e3,"2026-06-03 09:00:00","Pending"]),await u("INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)",[3,1,5,"2026-06-02 16:30:00",1e4]),console.log("Seeding awal SQLite di Next.js sukses!")}}e.s(["dbGet",0,d,"dbRun",0,u,"initializeDatabase",0,E]),t()}catch(e){t(e)}},!1),78042,(e,a,t)=>{a.exports=e.x("next-auth-c77c3a03231bb629",()=>require("next-auth-c77c3a03231bb629"))},66687,e=>e.a(async(a,t)=>{try{var r=e.i(78042),s=e.i(44950),i=e.i(54948),n=e.i(74400),E=a([s,i]);async function o(e,a,t,E){let o=null;try{let e=await (0,r.getServerSession)(a,t,E);e?.user&&(o=e.user.role)}catch(e){}if(!o&&a){let e=(0,n.getSessionUser)(a);e&&(o=e.role)}if(!o||"Petugas"!==o&&"Admin"!==o)throw Error("Akses ditolak: Hanya Admin/Staff yang dapat melakukan aksi ini.");let{nama:l,nomor_hp:u,alamat:d,role:N,password:T}=e;if(!l||!u||!N||!T)throw Error("Semua field wajib diisi");let p=N.trim(),g=p.charAt(0).toUpperCase()+p.slice(1).toLowerCase();if("Petugas"!==g&&"Pengepul"!==g)throw Error("Hanya dapat mendaftarkan akun dengan role Petugas atau Pengepul.");if(await (0,i.dbGet)("SELECT * FROM users WHERE nomor_hp = ?",[u]))throw Error("Nomor HP sudah terdaftar");let R=await s.default.genSalt(10),_=await s.default.hash(T,R),c=await (0,i.dbRun)("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",[l,u,d||"",g,_,0]);return{success:!0,userId:c.lastID,message:`Akun ${g} berhasil dibuat secara manual.`}}[s,i]=E.then?(await E)():E,e.s(["createStaffAccount",0,o]),t()}catch(e){t(e)}},!1),17294,e=>e.a(async(a,t)=>{try{var r=e.i(66687),s=a([r]);async function i(e,a){if("POST"!==e.method)return a.status(405).json({message:"Metode tidak diperbolehkan"});try{let t=await (0,r.createStaffAccount)(e.body,e,a);return a.status(200).json(t)}catch(e){return console.error("Create staff API error:",e),a.status(400).json({message:e.message||"Gagal membuat akun staff"})}}[r]=s.then?(await s)():s,e.s(["default",0,i]),t()}catch(e){t(e)}},!1),80321,e=>e.a(async(a,t)=>{try{var r=e.i(26747),s=e.i(90406),i=e.i(44898),n=e.i(62950),E=e.i(17294),o=e.i(7031),l=e.i(81927),u=e.i(46432),d=a([E]);[E]=d.then?(await d)():d;let T=(0,n.hoist)(E,"default"),p=(0,n.hoist)(E,"config"),g=new i.PagesAPIRouteModule({definition:{kind:s.RouteKind.PAGES_API,page:"/api/admin/create-staff",pathname:"/api/admin/create-staff",bundlePath:"",filename:""},userland:E,distDir:".next",relativeProjectDir:""});async function N(e,a,t){t.requestMeta&&(0,u.setRequestMeta)(e,t.requestMeta),g.isDev&&(0,u.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/admin/create-staff";s=s.replace(/\/index$/,"")||"/";let i=await g.prepare(e,a,{srcPage:s});if(!i){a.statusCode=400,a.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve());return}let{query:n,params:E,prerenderManifest:d,routerServerContext:N}=i;try{let t,r=e.method||"GET",i=(0,o.getTracer)(),u=i.getActiveScopeSpan(),T=!!(null==N?void 0:N.isWrappedByNextServer),p=g.instrumentationOnRequestError.bind(g),R=async o=>g.render(e,a,{query:{...n,...E},params:E,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:d.preview,propagateError:!1,dev:g.isDev,page:"/api/admin/create-staff",internalRevalidate:null==N?void 0:N.revalidate,onError:(...a)=>p(e,...a)}).finally(()=>{if(!o)return;o.setAttributes({"http.status_code":a.statusCode,"next.rsc":!1});let e=i.getRootSpanAttributes();if(!e)return;if(e.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${e.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=e.get("next.route");if(n){let e=`${r} ${n}`;o.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),o.updateName(e),t&&t!==o&&(t.setAttribute("http.route",n),t.updateName(e))}else o.updateName(`${r} ${s}`)});T&&u?await R(u):(t=i.getActiveScopeSpan(),await i.withPropagatedContext(e.headers,()=>i.trace(l.BaseServerSpan.handleRequest,{spanName:`${r} ${s}`,kind:o.SpanKind.SERVER,attributes:{"http.method":r,"http.target":e.url}},R),void 0,!T))}catch(e){if(g.isDev)throw e;(0,r.sendError)(a,500,"Internal Server Error")}finally{null==t.waitUntil||t.waitUntil.call(t,Promise.resolve())}}e.s(["config",0,p,"default",0,T,"handler",0,N]),t()}catch(e){t(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n-nxyz._.js.map