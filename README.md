# অ্যাডমিশন ক্যালেন্ডার

একনজরে বিশ্ববিদ্যালয়সমূহের ভর্তি পরীক্ষার সূচি ও তথ্য — বাংলাদেশের মেডিকেল, ইঞ্জিনিয়ারিং ও সাধারণ বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার তারিখ, আবেদনের সময়সীমা ও গুরুত্বপূর্ণ তথ্য একটি জায়গায় দেখার জন্য তৈরি একটি data-driven admission information portal।

## ⚠️ ডেটা সম্পর্কে গুরুত্বপূর্ণ নোট

এই প্রজেক্টে এখনো কোনো **official admission circular** থেকে তথ্য (তারিখ, আসনসংখ্যা, যোগ্যতা, পরীক্ষার ধরন, ফলাফল পদ্ধতি, সার্কুলার লিংক) সরবরাহ করা হয়নি। তাই:

- সব informational field ডিফল্টভাবে `null` রাখা হয়েছে এবং UI-তে **"তথ্য প্রকাশিত হয়নি"** দেখায়।
- ইন্টারফেসের dynamic ফিচার (countdown, status badge, sorting, deadline alert) প্রদর্শনের জন্য কিছু ইউনিটে `isDemoData: true` সহ নমুনা তারিখ যুক্ত করা হয়েছে — সেগুলোর পাশে একটি বেগুনি **"ডেমো ডেটা"** ট্যাগ দেখা যাবে। এগুলো বাস্তব সার্কুলার নয়।
- প্রকৃত তথ্য যুক্ত করতে হয় **অ্যাডমিন প্যানেল (`/admin`)** ব্যবহার করুন, অথবা সরাসরি `src/data/universities/*.json` ফাইল এডিট করুন — নিচের "তথ্য আপডেট করা" অংশ দেখুন।

## টেক স্ট্যাক

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** — Hind Siliguri (Bengali) টাইপোগ্রাফি
- **lucide-react** — আইকন
- সম্পূর্ণভাবে ক্লায়েন্ট-সাইড dynamic date logic (Asia/Dhaka timezone), কোনো ব্যাকএন্ড/ডেটাবেজ প্রয়োজন নেই
- **Static export** (`output: "export"`) — বিল্ড করলে plain HTML/CSS/JS ফাইল তৈরি হয়, তাই Hostinger-এর মতো যেকোনো সাধারণ (shared) হোস্টিং-এ Node.js ছাড়াই চলে
- **Decap CMS** (`/admin`) — যেকোনো জায়গা থেকে ব্রাউজারে লগইন করে তথ্য এডিট করার জন্য ওয়েব-ভিত্তিক অ্যাডমিন প্যানেল, প্রতিটি সেভ সরাসরি GitHub-এ কমিট হয়
- **GitHub Actions** — `main`-এ push হলেই স্বয়ংক্রিয়ভাবে বিল্ড হয়ে `deploy` ব্রাঞ্চে পুশ হয়ে যায়; cPanel-এর Git ফিচার সেখান থেকে সরাসরি সার্ভারে পুল করে (নিচের "cPanel দিয়ে সরাসরি ডিপ্লয়" অংশ দেখুন)

## প্রজেক্ট চালানো (নিজের কম্পিউটারে)

```bash
npm install
npm run dev       # http://localhost:3000
```

স্ট্যাটিক প্রোডাকশন বিল্ড তৈরি করা (Hostinger-এ আপলোডের জন্য):

```bash
npm run build     # তৈরি হবে: out/ ফোল্ডার (plain HTML/CSS/JS)
```

আপলোডের আগে লোকালি চেক করতে চাইলে:

```bash
npx serve out     # http://localhost:3000-এর মতো একটি লিংক দেখাবে
```

## ফোল্ডার স্ট্রাকচার

```
src/
  app/
    page.tsx                  # হোম পেজ — ৩টি প্রধান ট্যাব পরিচালনা করে
    layout.tsx                # রুট লেআউট, ফন্ট, SEO metadata
    globals.css
    university/[id]/page.tsx  # একটি নির্দিষ্ট বিশ্ববিদ্যালয়ের deep-link পেজ
    category/[slug]/page.tsx  # একটি ক্যাটাগরির deep-link পেজ

  data/
    types.ts                  # University, AdmissionUnit ইত্যাদি TypeScript টাইপ
    categories.ts              # ৫টি প্রধান ক্যাটাগরি
    universities/              # ⭐ প্রতিটি প্রতিষ্ঠানের জন্য একটি JSON ফাইল — /admin CMS এখানেই লেখে
    universities.ts             # generated JSON ইম্পোর্ট করে + helper ফাংশন এক্সপোর্ট করে
    universities.generated.json # অটো-জেনারেটেড, .gitignore-এ আছে, হাতে এডিট করবেন না

scripts/
  build-data.js              # universities/*.json গুলো একত্র করে generated JSON বানায় (prebuild/predev-এ চলে)

public/
  admin/                     # Decap CMS অ্যাডমিন প্যানেল (index.html + config.yml)

cms-oauth/                   # আলাদাভাবে Cloudflare Pages-এ ডিপ্লয় করার জন্য — CMS লগইনের OAuth proxy

  lib/
    date.ts                   # Asia/Dhaka today, day-diff হিসাব
    bangla.ts                 # বাংলা সংখ্যা ও তারিখ ফরম্যাটিং
    status.ts                 # countdown ও application status গণনা
    summary.ts                # সামারি স্ট্যাটস, আসন্ন পরীক্ষা, deadline alert
    filters.ts                # সার্চ, ফিল্টার, সর্টিং লজিক
    flatten.ts                # University[] -> unit-ভিত্তিক row[]
    useToday.ts                # রিয়েল-টাইম "আজ" hook (মধ্যরাতে অটো-রিফ্রেশ)

  components/
    layout/                   # Header, Footer, MainTabs
    ui/                       # StatusBadge, CountdownBadge, EmptyState, ErrorState, Skeleton, DemoTag
    calendar/                 # Tab 1: একনজরে অ্যাডমিশন ক্যালেন্ডার
    category/                 # Tab 2: ক্যাটাগরি অনুযায়ী অ্যাডমিশন ক্যালেন্ডার
    info/                     # Tab 3: অ্যাডমিশন তথ্যকণিকা
```

## তারিখ পরিবর্তন — সরাসরি হোস্টিং (cPanel / hPanel File Manager) থেকে

আবেদন শুরু/শেষ ও ভর্তি পরীক্ষার তারিখ বদলাতে বিল্ড বা GitHub লাগে না। সাইটের রুট ফোল্ডারে (যেখানে `index.html` আছে) থাকা **`dates.json`** ফাইলটি এডিট করলেই সাইটে তারিখ বদলে যায়।

1. cPanel / hPanel → **File Manager** → `public_html` (বা আপনার সাইটের ফোল্ডার) খুলুন।
2. `dates.json` ফাইলে ডান ক্লিক → **Edit**।
3. প্রতিটি ইউনিটের নিচে `applicationStart`, `applicationEnd`, `examDate` এর মান `"YYYY-MM-DD"` ফরম্যাটে লিখুন (যেমন `"2026-03-15"`)। `_নাম` দেখে বুঝবেন কোনটা কোন প্রতিষ্ঠান।
4. **Save** করে সাইট রিফ্রেশ করুন — সাথে সাথে নতুন তারিখ, বাকি দিন ও সারসংক্ষেপ আপডেট হবে।

নিয়ম:
- ফাঁকা `""` বা `null` রাখলে সাইটের মূল তারিখই থাকবে; ভুল ফরম্যাটের তারিখ উপেক্ষা হবে।
- JSON-এর কমা (`,`) ও কোটেশন (`"`) ঠিক রাখুন — ভুল হলে ফাইলটি পুরোটাই উপেক্ষা হয়ে মূল তারিখ দেখাবে।
- তারিখ সেট করলে ওই ইউনিটের "নমুনা তারিখ" ট্যাগ আর দেখাবে না।
- এই ফাইলের তারিখ সবসময় অ্যাডমিন প্যানেল/কোডের তারিখের **উপরে** অগ্রাধিকার পায়।
- **প্রথমবার:** GitHub Actions ডিপ্লয় `dates.json` আপলোড করে না (যাতে আপনার এডিট মুছে না যায়)। তাই প্রথমবার `out/dates.json` (বা রিপোর `public/dates.json`) File Manager দিয়ে একবার সাইটের রুটে আপলোড করুন। নতুন ইউনিট যোগ হলে `npm run build` চালালে `public/dates.json`-এ নতুন এন্ট্রি যোগ হয় (আপনার আগের মান বদলায় না) — সেটা আবার আপলোড করে নিন।

## তথ্য আপডেট করা

দুইভাবে তথ্য আপডেট করা যায় (তারিখ ছাড়া অন্য তথ্যের জন্য):

### পদ্ধতি ১ — অ্যাডমিন প্যানেল দিয়ে (সুপারিশকৃত)

`https://আপনার-ডোমেইন/admin` এ যান, GitHub দিয়ে লগইন করুন, "বিশ্ববিদ্যালয় / প্রতিষ্ঠান" থেকে যেটা এডিট করতে চান সেটা খুলুন (বা নতুন একটা "New universities" দিয়ে তৈরি করুন), ফর্ম পূরণ করে **Publish** চাপুন — সরাসরি GitHub-এ কমিট হয়ে যাবে এবং GitHub Actions স্বয়ংক্রিয়ভাবে বিল্ড করে Hostinger-এ লাইভ করে দেবে (২-৩ মিনিট লাগতে পারে)। কোনো কোড/টার্মিনাল লাগবে না — শুধু ব্রাউজার।

এই অ্যাডমিন প্যানেল প্রথমবার কাজ করার আগে একবার সেটআপ করতে হবে — নিচের **"অ্যাডমিন প্যানেল সেটআপ"** অংশ দেখুন।

### পদ্ধতি ২ — সরাসরি JSON ফাইল এডিট করে

প্রতিটি প্রতিষ্ঠানের তথ্য `src/data/universities/<id>.json` এ আলাদা ফাইলে থাকে (যেমন `buet.json`, `du.json`)। ফাইলটি সরাসরি এডিট করে `npm run dev` বা `npm run build` চালালেই পরিবর্তন প্রতিফলিত হবে (এই দুটো কমান্ডের আগে `scripts/build-data.js` অটোমেটিক চলে সব ফাইল একত্র করে)।

```json
{
  "id": "example-uni",
  "nameBn": "উদাহরণ বিশ্ববিদ্যালয়",
  "nameEn": "Example University",
  "shortName": "EU",
  "category": "general-independent",
  "admissionSession": "২০২৬-২৭",
  "units": [
    {
      "id": "science",
      "nameBn": "বিজ্ঞান ইউনিট",
      "applicationStart": "2026-11-01",
      "applicationEnd": "2026-11-25",
      "examDate": "2026-12-20",
      "seats": { "total": 1200 },
      "eligibility": { "descriptionBn": "..." },
      "examPattern": "MCQ",
      "subjects": [{ "nameBn": "পদার্থবিজ্ঞান", "marks": 25 }],
      "resultMethod": "...",
      "circularUrl": "https://..."
    }
  ]
}
```

তারিখ না জানা থাকলে `null` রাখুন — countdown/status স্বয়ংক্রিয়ভাবে "তথ্য প্রকাশিত হয়নি" দেখাবে, কোনো fake তথ্য দেখাবে না। **নতুন প্রতিষ্ঠান যোগ করতে**: `src/data/universities/` এ একটি নতুন `<id>.json` ফাইল তৈরি করুন — ফাইলের নাম আর ভেতরের `"id"` ফিল্ড অবশ্যই একই হতে হবে।

## অ্যাডমিন প্যানেল (CMS) সেটআপ — একবারের জন্য

অ্যাডমিন প্যানেল ([Decap CMS](https://decapcms.org)) GitHub-এ সরাসরি কমিট করে, তাই লগইনের জন্য একটি GitHub OAuth অ্যাপ ও একটি ছোট্ট (বিনামূল্যে) প্রক্সি সার্ভিস লাগে — কারণ Hostinger-এ কোনো সার্ভার নেই যেখানে এই লগইন হ্যান্ডশেক চালানো যায়। এটি **Cloudflare Pages**-এ (ফ্রি) হোস্ট হবে।

**ধাপ ১ — Cloudflare Pages-এ OAuth proxy ডিপ্লয় করা**

1. [dash.cloudflare.com](https://dash.cloudflare.com) এ একটি ফ্রি অ্যাকাউন্ট বানান/লগইন করুন।
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**।
3. আপনার GitHub অ্যাকাউন্ট কানেক্ট করে **ausohan161/Admission-Info** রিপো সিলেক্ট করুন।
4. বিল্ড সেটিংসে:
   - **Root directory**: `cms-oauth`
   - **Build command**: খালি রাখুন
   - **Build output directory**: `public`
5. **Save and Deploy** চাপুন। ডিপ্লয় শেষে একটি URL পাবেন, যেমন `https://admission-info-xyz.pages.dev` — এটা কপি করে রাখুন।

**ধাপ ২ — GitHub OAuth App তৈরি করা**

1. [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**।
2. পূরণ করুন:
   - **Application name**: যা খুশি, যেমন `Admission Calendar CMS`
   - **Homepage URL**: `https://github.com/ausohan161/Admission-Info`
   - **Authorization callback URL**: ধাপ ১-এর URL + `/callback`, যেমন `https://admission-info-xyz.pages.dev/callback`
3. **Register application** চাপুন।
4. **Client ID** কপি করুন। **Generate a new client secret** চেপে **Client Secret**-ও কপি করুন (এটা শুধু একবারই দেখাবে)।

**ধাপ ৩ — Cloudflare Pages-এ secret বসানো**

1. Cloudflare Pages-এ ফিরে যান → আপনার প্রজেক্ট → **Settings** → **Environment variables**।
2. দুটো variable যোগ করুন (Production ও Preview দুই জায়গাতেই):
   - `GITHUB_CLIENT_ID` = ধাপ ২-এর Client ID
   - `GITHUB_CLIENT_SECRET` = ধাপ ২-এর Client Secret
3. **Save** করার পর প্রজেক্টটি একবার আবার Deploy করুন (Deployments ট্যাব থেকে "Retry deployment"), যাতে নতুন variable কার্যকর হয়।

**ধাপ ৪ — অ্যাডমিন প্যানেলকে এই URL-এর সাথে যুক্ত করা**

`public/admin/config.yml` ফাইলে `base_url: https://REPLACE-WITH-YOUR-CLOUDFLARE-PAGES-URL` লাইনটা ধাপ ১-এর আসল URL দিয়ে বদলে দিন (আমাকে URL দিলে আমি এডিট করে push করে দেব)। এরপর `git push` করলে (বা আমাকে বললে আমি করে দেব) সাইট বিল্ড হয়ে `/admin` কাজ করা শুরু করবে।

**যাচাই করা**: `https://আপনার-ডোমেইন/admin` এ গিয়ে "Login with GitHub" চাপুন — GitHub-এ authorize করলে অ্যাডমিন প্যানেল খুলে যাবে।

## cPanel দিয়ে সরাসরি ডিপ্লয় (সুপারিশকৃত — কোনো FTP লাগে না)

GitHub-এ push হলেই GitHub Actions সাইট বিল্ড করে **`deploy`** নামের একটি ব্রাঞ্চে বিল্ড হওয়া plain HTML/CSS/JS পুশ করে দেয় (সোর্স কোড না, শুধু ready-to-serve ফাইল)। cPanel-এর **Git™ Version Control** ফিচার সরাসরি এই `deploy` ব্রাঞ্চ থেকে সার্ভারে পুল করে সাইট লাইভ করে — কোনো FTP username/password GitHub-এ secret হিসেবে রাখার দরকার নেই।

**ধাপ ১ — প্রথমবার সাইট বিল্ড হওয়া নিশ্চিত করা**

এই ফাইলগুলো GitHub-এ push করার পর (নিচে "পুশ করা" অংশ দেখুন) GitHub-এর **Actions** ট্যাবে গিয়ে "Build and publish static site" workflow-টা সফল হয়েছে কিনা দেখুন। সফল হলে রিপোতে একটা নতুন **`deploy`** ব্রাঞ্চ তৈরি হয়ে যাবে (শুধু বিল্ড ফাইল থাকবে, `.github/`, `src/` ইত্যাদি থাকবে না)।

> রিপো **প্রাইভেট** হলে cPanel-কে clone করার জন্য GitHub-এ read অ্যাক্সেসের একটা [Personal Access Token](https://github.com/settings/tokens) লাগবে (ধাপ ২-এ HTTPS URL-এর জায়গায় `https://<token>@github.com/ausohan161/Admission-Info.git` এভাবে ব্যবহার করবেন)। রিপো **পাবলিক** হলে টোকেন ছাড়াই কাজ করবে।

**ধাপ ২ — cPanel-এ Git repository কানেক্ট করা**

1. cPanel (বা Hostinger hPanel-এ যদি "Git" নামের সমতুল্য ফিচার থাকে) → **Git™ Version Control** → **Create**।
2. **Clone a Repository** অন করুন, **Repository URL**: `https://github.com/ausohan161/Admission-Info.git`।
3. **Repository Path**: সরাসরি আপনার ডোমেইনের `public_html` ফোল্ডার দিন (যেমন `/home/আপনার-ইউজারনেম/public_html`)। এটা খালি/প্রায়-খালি থাকা লাগবে — আগে থেকে কোনো ডিফল্ট ফাইল থাকলে ব্যাকআপ নিয়ে সরিয়ে ফেলুন।
   - সাবডোমেইন/অ্যাডঅন ডোমেইন হলে cPanel-এ দেখানো সেই ডোমেইনের নির্দিষ্ট পাবলিক ফোল্ডার দিন।
4. **Branch**: `deploy` লিখুন (ডিফল্ট `main`/`master` না — অবশ্যই `deploy`)।
5. **Create** চাপুন।

এখন public_html-এর কন্টেন্ট = `deploy` ব্রাঞ্চের কন্টেন্ট, অর্থাৎ সাইট সাথে সাথে লাইভ হয়ে যাবে।

> যদি cPanel `public_html`-কে সরাসরি Repository Path হিসেবে নিতে না দেয় (কিছু হোস্টে নিষেধ থাকে), তাহলে একটা আলাদা ফোল্ডারে (যেমন `/home/আপনার-ইউজারনেম/repo-deploy`) ক্লোন করুন — রিপোতে থাকা [`cpanel/.cpanel.yml`](cpanel/.cpanel.yml) ফাইলটা ঠিক এই পরিস্থিতির জন্যই তৈরি করা, শুধু তার ভেতরের `DEPLOYPATH` আপনার আসল `public_html` পাথ দিয়ে বদলে দিন — তাহলে cPanel-এর "Deploy HEAD Commit" বাটন চাপলে ফাইলগুলো নিজে থেকে `public_html`-এ কপি হয়ে যাবে।

**ধাপ ৩ — পরবর্তীতে আপডেট আনা**

GitHub-এ নতুন push হলে `deploy` ব্রাঞ্চও স্বয়ংক্রিয়ভাবে আপডেট হয়, কিন্তু cPanel নিজে থেকে বুঝবে না — নিচের যেকোনো একটা উপায়ে সার্ভারকে বলতে হবে নতুন কমিট টেনে আনতে:

- **ম্যানুয়াল (সহজ, সবসময় কাজ করে):** cPanel → Git™ Version Control → রিপোর পাশে **Manage** → **Pull or Deploy** ট্যাব → **Update from Remote**, তারপর **Deploy HEAD Commit**।
- **স্বয়ংক্রিয় (ঐচ্ছিক):** cPanel-এর নতুন ভার্সনে এই একই "Manage" পেজে একটা **Webhook URL** দেখানো হতে পারে — সেটা GitHub রিপোর **Settings → Webhooks → Add webhook**-এ বসিয়ে দিলে প্রতিটি push-এ নিজে থেকেই ডিপ্লয় হয়ে যাবে। এই অপশন না থাকলে cPanel-এর **Cron Jobs**-এ একটা এন্ট্রি দিয়ে (যেমন প্রতি ৫ মিনিটে) `cd /home/আপনার-ইউজারনেম/public_html && git pull origin deploy` কমান্ডটা চালিয়েও একই কাজ করা যায়।

**প্রথম ডিপ্লয়ের পর একটা কাজ বাকি থাকবে:** `dates.json` ফাইলটা ইচ্ছাকৃতভাবে `deploy` ব্রাঞ্চে রাখা হয় না (কারণ ওটা আপনি সরাসরি সার্ভারে এডিট করবেন — উপরের "তারিখ পরিবর্তন" অংশ দেখুন), তাই প্রথমবার File Manager দিয়ে রিপোর `public/dates.json`-এর কন্টেন্ট কপি করে `public_html/dates.json` নামে একটা ফাইল বানিয়ে নিন।

**বিকল্প পদ্ধতি — শুধু একবার/হাতে আপলোড করতে চাইলে:**

1. লোকালি `npm run build` চালান — `out/` ফোল্ডার তৈরি হবে।
2. hPanel/cPanel **File Manager**-এ `public_html`-এ ঢুকে `out/`-এর **ভেতরের** সব ফাইল আপলোড করুন (`out` ফোল্ডারটা নিজে না)।
3. পরের বার আপডেট দিতে একই কাজ আবার করতে হবে — এটাতে স্বয়ংক্রিয়তা নেই, তাই উপরের cPanel Git পদ্ধতিই সুপারিশ করা হচ্ছে।

**যা আপডেট করার জন্য rebuild/reupload/pull কিছুই লাগবে না:** প্রতিদিনের countdown ("বাকি দিন"), current status ("আবেদন চলছে" / "আবেদন শেষ" ইত্যাদি) — এগুলো ভিজিটরের ব্রাউজারে সরাসরি জাভাস্ক্রিপ্ট দিয়ে হিসাব হয় (আজকের তারিখের ভিত্তিতে), তাই প্রতিদিন এগুলো এমনিতেই সঠিক থাকবে। তারিখ বদল দিতে চাইলে `dates.json` এডিট করাই যথেষ্ট (rebuild লাগে না); নতুন প্রতিষ্ঠান/ইউনিট যোগ করতে চাইলে অ্যাডমিন প্যানেল বা `src/data/universities/` এডিট করে push করলেই বাকিটা স্বয়ংক্রিয় হয়ে যায়।

**টিপস:**
- আপলোড/ডিপ্লয়ের আগে `npx serve out` দিয়ে লোকালি চেক করে নিন সব ঠিক আছে কিনা।
- বড় পরিবর্তনের আগে `public_html`-এর একটা ব্যাকআপ রাখুন (hPanel/cPanel-এর "Backups" ফিচার থেকে নেওয়া যায়), যাতে কিছু ভুল হলে সহজে ফিরিয়ে আনা যায়।

## জানা সীমাবদ্ধতা

- `npm audit`-এ Next.js-এর নিজস্ব বান্ডলড `postcss` (build-time dev dependency) এর একটি moderate/high অ্যাডভাইজরি থেকে যায়, যা কেবল Next.js 16-এ upgrade করলে সম্পূর্ণ সমাধান হয় — এটি একটি major breaking upgrade, তাই এই প্রজেক্টে অন্তর্ভুক্ত করা হয়নি। রানটাইমে ব্যবহারকারীর ব্রাউজারে এর কোনো প্রভাব নেই, শুধু বিল্ড-টাইম টুলিং সংক্রান্ত।
- Static export মোডে (`output: "export"`) API route বা server action ব্যবহার করা যায় না — ভবিষ্যতে যদি database-ভিত্তিক dynamic backend দরকার হয় (Node.js/VPS হোস্টিং-এ), তখন `next.config.mjs` থেকে `output: "export"` লাইনটি সরিয়ে ফেলতে হবে।
- অ্যাডমিন প্যানেল (`/admin`) কাজ করার আগে একবার বাইরের সেটআপ লাগে (GitHub OAuth App + Cloudflare Pages-এ `cms-oauth/` ডিপ্লয়) — "অ্যাডমিন প্যানেল (CMS) সেটআপ" অংশ দেখুন। সেটআপ না করা পর্যন্ত `/admin`-এ গেলে GitHub লগইন কাজ করবে না।
