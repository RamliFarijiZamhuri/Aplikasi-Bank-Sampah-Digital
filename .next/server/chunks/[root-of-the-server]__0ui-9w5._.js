module.exports=[70406,(a,e,t)=>{e.exports=a.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(a,e,t)=>{e.exports=a.x("path",()=>require("path"))},44950,a=>a.a(async(e,t)=>{try{let e=await a.y("bcryptjs-ee66c2bdc904f2cf");a.n(e),t()}catch(a){t(a)}},!0),77283,(a,e,t)=>{e.exports=a.x("sqlite3-03df7d93c81c1156",()=>require("sqlite3-03df7d93c81c1156"))},54948,a=>a.a(async(e,t)=>{try{var r=a.i(77283),s=a.i(14747),i=a.i(44950),E=e([i]);[i]=E.then?(await E)():E;let o=s.default.resolve(process.cwd(),"database.sqlite"),d=new r.default.Database(o),l=(a,e=[])=>new Promise((t,r)=>{d.run(a,e,function(a){a?r(a):t(this)})}),u=(a,e=[])=>new Promise((t,r)=>{d.get(a,e,(a,e)=>{a?r(a):t(e)})});async function n(){if(await l("PRAGMA foreign_keys = ON;"),!await u("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")){console.log("Database file atau tabel 'users' belum ada di Next.js. Menjalankan DDL dan Seed otomatis..."),await l(`
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
    `);let a=await i.default.genSalt(10),e=await i.default.hash("password123",a);await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Budi Petugas","081234567890","Kantor Bank Sampah Indah","Petugas",e,0]),await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Siti Nasabah","081299999999","Jl. Mawar No. 12, RT 02/03","Nasabah",e,5e4]),await l("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",["Rudi Pengepul","081388888888","Gudang Sukses Makmur, Bekasi","Pengepul",e,0]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Plastik PET",2e3]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Kardus",1500]),await l("INSERT INTO kategori_sampah (nama_kategori, harga_per_kg) VALUES (?, ?)",["Besi",5e3]),await l("INSERT INTO transaksi_setor (id_user, id_petugas, tanggal_setor) VALUES (?, ?, ?)",[2,1,"2026-06-01 10:00:00"]),await l("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,1,15,3e4]),await l("INSERT INTO detail_setor (id_setor, id_kategori, berat_kg, subtotal) VALUES (?, ?, ?, ?)",[1,2,20,3e4]),await l("UPDATE users SET saldo = saldo + ? WHERE id_user = ?",[6e4,2]),await l("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,1e4,"2026-06-02 14:00:00","Success"]),await l("INSERT INTO penarikan_saldo (id_user, jumlah_tarik, tanggal_pengajuan, status) VALUES (?, ?, ?, ?)",[2,25e3,"2026-06-03 09:00:00","Pending"]),await l("INSERT INTO pembelian_pengepul (id_user, id_kategori, berat_kg, tanggal_pembelian, total_bayar) VALUES (?, ?, ?, ?, ?)",[3,1,5,"2026-06-02 16:30:00",1e4]),console.log("Seeding awal SQLite di Next.js sukses!")}}a.s(["dbGet",0,u,"dbRun",0,l,"initializeDatabase",0,n]),t()}catch(a){t(a)}},!1),19631,a=>a.a(async(e,t)=>{try{var r=a.i(44950),s=a.i(54948),i=e([r,s]);async function E(a){let{nama:e,nomor_hp:t,alamat:i,role:E,password:n}=a;if(!e||!t||!E||!n)throw Error("Semua field wajib diisi");let o=E.trim().toLowerCase();if("petugas"===o||"pengepul"===o)throw Error("Pendaftaran petugas atau pengepul harus dilakukan secara manual oleh Admin/Staff");if("nasabah"!==o)throw Error("Halaman registrasi publik hanya dapat digunakan untuk pendaftaran role NASABAH");if(await (0,s.dbGet)("SELECT * FROM users WHERE nomor_hp = ?",[t]))throw Error("Nomor HP sudah terdaftar");let d=await r.default.genSalt(10),l=await r.default.hash(n,d),u=await (0,s.dbRun)("INSERT INTO users (nama, nomor_hp, alamat, role, password, saldo) VALUES (?, ?, ?, ?, ?, ?)",[e,t,i||"","Nasabah",l,0]);return{success:!0,userId:u.lastID,message:"Registrasi nasabah berhasil!"}}[r,s]=i.then?(await i)():i,a.s(["registerUser",0,E]),t()}catch(a){t(a)}},!1),82348,a=>a.a(async(e,t)=>{try{var r=a.i(19631),s=e([r]);async function i(a,e){if("POST"!==a.method)return e.status(455).json({message:"Metode tidak diperbolehkan"});try{let t=await (0,r.registerUser)(a.body);return e.status(200).json(t)}catch(a){return console.error("Registration API error:",a),e.status(400).json({message:a.message||"Terjadi kesalahan saat registrasi"})}}[r]=s.then?(await s)():s,a.s(["default",0,i]),t()}catch(a){t(a)}},!1),71039,a=>a.a(async(e,t)=>{try{var r=a.i(26747),s=a.i(90406),i=a.i(44898),E=a.i(62950),n=a.i(82348),o=a.i(7031),d=a.i(81927),l=a.i(46432),u=e([n]);[n]=u.then?(await u)():u;let T=(0,E.hoist)(n,"default"),p=(0,E.hoist)(n,"config"),g=new i.PagesAPIRouteModule({definition:{kind:s.RouteKind.PAGES_API,page:"/api/auth/register",pathname:"/api/auth/register",bundlePath:"",filename:""},userland:n,distDir:".next",relativeProjectDir:""});async function N(a,e,t){t.requestMeta&&(0,l.setRequestMeta)(a,t.requestMeta),g.isDev&&(0,l.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/auth/register";s=s.replace(/\/index$/,"")||"/";let i=await g.prepare(a,e,{srcPage:s});if(!i){e.statusCode=400,e.end("Bad Request"),null==t.waitUntil||t.waitUntil.call(t,Promise.resolve());return}let{query:E,params:n,prerenderManifest:u,routerServerContext:N}=i;try{let t,r=a.method||"GET",i=(0,o.getTracer)(),l=i.getActiveScopeSpan(),T=!!(null==N?void 0:N.isWrappedByNextServer),p=g.instrumentationOnRequestError.bind(g),R=async o=>g.render(a,e,{query:{...E,...n},params:n,allowedRevalidateHeaderKeys:[],multiZoneDraftMode:!1,trustHostHeader:!1,previewProps:u.preview,propagateError:!1,dev:g.isDev,page:"/api/auth/register",internalRevalidate:null==N?void 0:N.revalidate,onError:(...e)=>p(a,...e)}).finally(()=>{if(!o)return;o.setAttributes({"http.status_code":e.statusCode,"next.rsc":!1});let a=i.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let E=a.get("next.route");if(E){let a=`${r} ${E}`;o.setAttributes({"next.route":E,"http.route":E,"next.span_name":a}),o.updateName(a),t&&t!==o&&(t.setAttribute("http.route",E),t.updateName(a))}else o.updateName(`${r} ${s}`)});T&&l?await R(l):(t=i.getActiveScopeSpan(),await i.withPropagatedContext(a.headers,()=>i.trace(d.BaseServerSpan.handleRequest,{spanName:`${r} ${s}`,kind:o.SpanKind.SERVER,attributes:{"http.method":r,"http.target":a.url}},R),void 0,!T))}catch(a){if(g.isDev)throw a;(0,r.sendError)(e,500,"Internal Server Error")}finally{null==t.waitUntil||t.waitUntil.call(t,Promise.resolve())}}a.s(["config",0,p,"default",0,T,"handler",0,N]),t()}catch(a){t(a)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ui-9w5._.js.map