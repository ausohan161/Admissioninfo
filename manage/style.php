<?php
declare(strict_types=1);

/** Shared head contents for every admin screen — same font families and palette as the public site. */
function admin_style(): string
{
    return <<<'HTML'
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Lato:wght@400;700;900&family=Baloo+Da+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
:root{--ink:#14213d;--muted:#64748b;--line:#e2e8f0;--bg:#f5f7fc;--card:#ffffff;
  --indigo:#4f46e5;--violet:#7c3aed;--teal:#0d9488;--sky:#0284c7;--purple:#9333ea;--amber:#d97706;--emerald:#059669;--rose:#e11d48;}
*{box-sizing:border-box}
html,body{margin:0}
body{font-family:"Lato","Hind Siliguri",system-ui,sans-serif;font-weight:700;font-size:16px;color:var(--ink);background:var(--bg);line-height:1.6}
h1,h2,h3{font-family:"Baloo Da 2","Hind Siliguri",sans-serif;font-weight:800;letter-spacing:.2px;margin:0}
h3{font-size:22px;color:var(--ink);margin-bottom:14px}
code{font-family:"Lato",monospace;background:#eef2ff;padding:1px 6px;border-radius:6px;font-weight:700}

/* header */
.topbar{background:linear-gradient(120deg,var(--indigo),var(--violet));color:#fff;box-shadow:0 8px 24px -10px rgba(79,70,229,.6)}
.topbar-inner{max-width:1100px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.brand{font-family:"Baloo Da 2",sans-serif;font-weight:800;font-size:22px;display:flex;align-items:center;gap:10px}
.brand-dot{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:18px}
.user-chip{font-size:14px;background:rgba(255,255,255,.16);padding:6px 12px;border-radius:999px;font-weight:700}
.logout{color:#fff;text-decoration:none;background:rgba(255,255,255,.2);padding:6px 14px;border-radius:999px;font-size:14px;font-weight:700}
.logout:hover{background:rgba(255,255,255,.32)}

/* tabs as pills */
.tabs{max-width:1100px;margin:18px auto 0;padding:0 20px;display:flex;gap:10px;flex-wrap:wrap}
.tab{text-decoration:none;color:var(--muted);background:#fff;border:1px solid var(--line);padding:10px 16px;border-radius:999px;font-weight:700;font-size:15px;transition:.2s}
.tab:hover{color:var(--ink);transform:translateY(-1px);box-shadow:0 6px 16px -8px rgba(15,23,42,.25)}
.tab.active{color:#fff;border-color:transparent;background:linear-gradient(120deg,var(--indigo),var(--violet));box-shadow:0 10px 22px -10px rgba(79,70,229,.7)}

main{max-width:1100px;margin:22px auto 60px;padding:0 20px}
.flash{background:linear-gradient(120deg,#ecfdf5,#d1fae5);border:1px solid #6ee7b7;color:#065f46;padding:12px 16px;border-radius:14px;margin-bottom:18px;font-weight:700}

/* formatting bar */
.fmt-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:10px 14px;margin-bottom:18px;box-shadow:0 8px 20px -16px rgba(15,23,42,.3)}
.fmt-label{font-size:14px;color:var(--muted);margin-right:4px}
.fmt{border:1.5px solid #cfd8e6;background:#f8fafc;color:var(--ink);border-radius:10px;padding:7px 12px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:.15s}
.fmt:hover{border-color:var(--violet);color:var(--violet);background:#f5f3ff}
.fmt-color{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:700;margin:0 4px}
.fmt-color input{width:38px;height:34px;padding:2px;border:1.5px solid #cfd8e6;border-radius:8px;background:#fff;cursor:pointer}
.fmt-help{font-size:13px;color:var(--muted);margin-left:auto}

/* cards */
.box{background:var(--card);border-radius:20px;border:1px solid var(--line);box-shadow:0 1px 2px rgba(15,23,42,.04),0 18px 40px -24px rgba(15,23,42,.18);padding:24px;margin-bottom:22px}
.box-accent{border-top:4px solid var(--indigo)}
.hint{color:var(--muted);font-size:13px;font-weight:700}
label{display:block;font-weight:700;margin:14px 0 6px;font-size:15px}

/* fields */
input[type=text],input[type=number],input[type=password],select,textarea{width:100%;font:inherit;font-size:15px;font-weight:700;color:var(--ink);padding:11px 13px;border:1.5px solid #cfd8e6;border-radius:12px;background:#fff;transition:.2s}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--violet);box-shadow:0 0 0 4px rgba(124,58,237,.14)}
input[readonly]{background:#f1f5f9;color:var(--muted)}
textarea{min-height:96px;resize:vertical;line-height:1.6}
input[type=checkbox]{width:18px;height:18px;accent-color:var(--rose)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:700px){.grid{grid-template-columns:1fr}.topbar-inner{padding:12px 16px}}

/* selector */
.picker{display:flex;gap:10px;align-items:center}
.picker select{max-width:480px}

/* unit blocks */
.unit{border:1.5px dashed #c7d2e6;border-radius:16px;padding:18px;margin:16px 0;background:linear-gradient(180deg,#fbfcff,#fff)}
.unit-title{font-family:"Baloo Da 2",sans-serif;font-size:18px;font-weight:800;color:var(--indigo);margin-bottom:6px;display:flex;gap:8px;align-items:center}
.unit-title small{font-family:"Lato",sans-serif;font-size:12px;color:var(--muted);background:#eef2ff;padding:2px 8px;border-radius:999px}

/* buttons: one colour per action */
.btn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:14px;padding:12px 22px;font:inherit;font-weight:800;font-size:15px;color:#fff;cursor:pointer;transition:.2s;box-shadow:0 10px 20px -12px currentColor}
.btn:hover{transform:translateY(-2px);filter:brightness(1.06)}
.btn:active{transform:translateY(0)}
.btn-indigo{background:linear-gradient(120deg,#4f46e5,#6366f1)}
.btn-teal{background:linear-gradient(120deg,#0d9488,#14b8a6)}
.btn-sky{background:linear-gradient(120deg,#0284c7,#0ea5e9)}
.btn-purple{background:linear-gradient(120deg,#9333ea,#c026d3)}
.btn-amber{background:linear-gradient(120deg,#d97706,#f59e0b)}
.btn-emerald{background:linear-gradient(120deg,#059669,#10b981)}
.btn-rose{background:linear-gradient(120deg,#e11d48,#f43f5e)}
.btn-small{padding:8px 14px;font-size:13px;border-radius:10px}
.actions{margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.danger-zone{margin-top:16px;padding:14px 16px;border-radius:14px;background:#fff1f2;border:1px solid #fecdd3}
.danger-zone label{margin:0;color:#9f1239;display:flex;gap:10px;align-items:center}

/* users table */
table{width:100%;border-collapse:separate;border-spacing:0}
th{text-align:left;font-family:"Baloo Da 2",sans-serif;font-size:15px;color:var(--muted);padding:10px 12px;border-bottom:2px solid var(--line)}
td{padding:14px 12px;border-bottom:1.5px solid var(--line)}
.role{display:inline-block;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:800}
.role-admin{background:#ede9fe;color:#6d28d9}
.role-editor{background:#ccfbf1;color:#0f766e}

/* auth screens */
.auth{min-height:100vh;display:grid;place-items:center;padding:20px;background:radial-gradient(1200px 600px at 10% -10%,#c7d2fe,transparent),radial-gradient(900px 500px at 110% 110%,#ddd6fe,transparent),var(--bg)}
.auth-card{width:100%;max-width:400px;background:#fff;border-radius:24px;padding:32px;box-shadow:0 30px 60px -30px rgba(79,70,229,.45);border:1px solid var(--line)}
.auth-card h2{font-size:28px;margin-bottom:6px}
.auth-card .btn{width:100%;justify-content:center;margin-top:18px}
</style>
HTML;
}
