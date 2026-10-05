<?php
declare(strict_types=1);

session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Strict']);
require __DIR__ . '/lib.php';

const CATEGORIES = [
    'medical' => 'মেডিকেল অ্যান্ড ডেন্টাল কলেজ',
    'engineering-independent' => 'ইঞ্জিনিয়ারিং বিশ্ববিদ্যালয় (স্বতন্ত্র)',
    'engineering-cluster' => 'ইঞ্জিনিয়ারিং বিশ্ববিদ্যালয় (গুচ্ছ)',
    'general-independent' => 'সাধারণ বিশ্ববিদ্যালয় (স্বতন্ত্র)',
    'general-cluster' => 'সাধারণ বিশ্ববিদ্যালয় (গুচ্ছ)',
];
const GROUPS = ['science' => 'বিজ্ঞান', 'commerce' => 'বাণিজ্য', 'arts' => 'মানবিক', 'any' => 'সব গ্রুপ'];
const TABS = ['home' => '১. হোম পেজ', 'info' => '২. তথ্যকণিকা', 'checker' => '৩. আবেদনযোগ্যতা যাচাই', 'texts' => '৪. সাধারণ লেখা'];

// ---------- first-time setup: create the admin account once ----------
if (!file_exists(config_path())) {
    $message = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        if ($username === '' || strlen($password) < 10 || $password !== ($_POST['confirm'] ?? '')) {
            $message = 'ইউজারনেম দিন, পাসওয়ার্ড কমপক্ষে ১০ অক্ষর হতে হবে এবং দুবার একই হতে হবে।';
        } else {
            $config = "<?php\nreturn " . var_export(['username' => $username, 'hash' => password_hash($password, PASSWORD_DEFAULT)], true) . ";\n";
            file_put_contents(config_path(), $config, LOCK_EX);
            header('Location: ./');
            exit;
        }
    }
    ?>
<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>অ্যাডমিন সেটআপ</title></head>
<body style="font-family:sans-serif;max-width:420px;margin:40px auto;padding:0 16px">
<h2>প্রথমবার সেটআপ</h2>
<p>অ্যাডমিন অ্যাকাউন্ট তৈরি করুন। এই পেজ একবারই কাজ করে — সেট করার পর এখনই পাসওয়ার্ড দিন।</p>
<?php if ($message !== '') echo '<p style="color:#b91c1c">' . h($message) . '</p>'; ?>
<form method="post">
<p><label>ইউজারনেম<br><input name="username" required style="width:100%;padding:8px"></label></p>
<p><label>পাসওয়ার্ড (কমপক্ষে ১০ অক্ষর)<br><input type="password" name="password" required style="width:100%;padding:8px"></label></p>
<p><label>পাসওয়ার্ড আবার<br><input type="password" name="confirm" required style="width:100%;padding:8px"></label></p>
<p><button style="padding:10px 18px">অ্যাকাউন্ট তৈরি করুন</button></p>
</form></body></html>
<?php
    exit;
}

$config = require config_path();

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ./');
    exit;
}

// ---------- login ----------
if (empty($_SESSION['user'])) {
    $loginError = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        if (hash_equals($config['username'], $username) && password_verify($password, $config['hash'])) {
            session_regenerate_id(true);
            $_SESSION['user'] = $username;
            header('Location: ./');
            exit;
        }
        $loginError = 'ইউজারনেম বা পাসওয়ার্ড ভুল।';
    }
    ?>
<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>অ্যাডমিন লগইন</title></head>
<body style="font-family:sans-serif;max-width:360px;margin:60px auto;padding:0 16px">
<h2>অ্যাডমিন লগইন</h2>
<?php if ($loginError !== '') echo '<p style="color:#b91c1c">' . h($loginError) . '</p>'; ?>
<form method="post">
<p><label>ইউজারনেম<br><input name="username" required style="width:100%;padding:8px"></label></p>
<p><label>পাসওয়ার্ড<br><input type="password" name="password" required style="width:100%;padding:8px"></label></p>
<p><button style="padding:10px 18px">লগইন</button></p>
</form></body></html>
<?php
    exit;
}

ensure_content();
$tab = array_key_exists($_GET['tab'] ?? '', TABS) ? $_GET['tab'] : 'home';
$message = '';

// ---------- save handlers ----------
function find_index(array $list, string $id): ?int
{
    foreach ($list as $i => $item) {
        if (($item['id'] ?? '') === $id) {
            return $i;
        }
    }
    return null;
}

function institutions(): array
{
    return load_json('admissions', ['universities' => []])['universities'] ?? [];
}

function save_home(): string
{
    $data = load_json('admissions', ['universities' => []]);
    $list = $data['universities'] ?? [];
    $origId = trim($_POST['orig_id'] ?? '');

    if (!empty($_POST['delete']) && $origId !== '') {
        $list = array_values(array_filter($list, fn($u) => ($u['id'] ?? '') !== $origId));
        save_json('admissions', ['universities' => $list]);
        foreach (['info', 'eligibility'] as $name) {
            $map = load_json($name);
            unset($map[$origId]);
            save_json($name, $map);
        }
        return 'প্রতিষ্ঠানটি মুছে ফেলা হয়েছে।';
    }

    $id = $origId !== '' ? $origId : trim($_POST['id'] ?? '');
    if (!valid_id($id)) {
        return 'আইডি শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও হাইফেন হতে পারে।';
    }
    if ($origId === '' && find_index($list, $id) !== null) {
        return 'এই আইডি আগে থেকেই আছে।';
    }
    $nameBn = trim($_POST['nameBn'] ?? '');
    $category = $_POST['category'] ?? '';
    if ($nameBn === '' || !array_key_exists($category, CATEGORIES)) {
        return 'নাম ও ক্যাটাগরি দিন।';
    }

    $units = [];
    foreach (text_lines($_POST['units'] ?? '') as $line) {
        $parts = array_map('trim', explode('|', $line));
        $parts = array_pad($parts, 6, '');
        [$uid, $uname, $start, $end, $exam, $demo] = $parts;
        if (!valid_id($uid)) {
            return 'ইউনিট আইডি ঠিক নেই: ' . $line;
        }
        if (!valid_date($start) || !valid_date($end) || !valid_date($exam)) {
            return 'তারিখ YYYY-MM-DD ফরম্যাটে লিখুন: ' . $line;
        }
        $units[] = [
            'id' => $uid,
            'nameBn' => nullable($uname),
            'applicationStart' => nullable($start),
            'applicationEnd' => nullable($end),
            'examDate' => nullable($exam),
            'isDemoData' => in_array(strtolower($demo), ['1', 'yes', 'true'], true),
        ];
    }
    if ($units === []) {
        return 'কমপক্ষে একটি ইউনিট লাগবে।';
    }

    $record = [
        'id' => $id,
        'nameBn' => $nameBn,
        'nameEn' => trim($_POST['nameEn'] ?? ''),
        'shortName' => trim($_POST['shortName'] ?? ''),
        'category' => $category,
        'subGroupBn' => nullable($_POST['subGroupBn'] ?? ''),
        'admissionSession' => trim($_POST['admissionSession'] ?? ''),
        'units' => $units,
    ];
    $idx = $origId !== '' ? find_index($list, $origId) : null;
    if ($idx !== null) {
        $list[$idx] = $record;
    } else {
        $list[] = $record;
    }
    save_json('admissions', ['universities' => $list]);
    return 'সংরক্ষিত হয়েছে।';
}

function save_notices(): string
{
    save_json('notices', ['notices' => text_lines($_POST['notices'] ?? '')]);
    return 'নোটিশ সংরক্ষিত হয়েছে।';
}

function save_info(): string
{
    $id = trim($_POST['id'] ?? '');
    $uni = null;
    foreach (institutions() as $u) {
        if (($u['id'] ?? '') === $id) {
            $uni = $u;
        }
    }
    if ($uni === null) {
        return 'প্রতিষ্ঠান পাওয়া যায়নি।';
    }
    $map = load_json('info');
    $old = $map[$id]['units'] ?? [];
    $units = [];
    foreach ($uni['units'] as $unit) {
        $uid = $unit['id'];
        $prev = $old[$uid] ?? [];
        $seatTotal = nullable_number($_POST['seats'][$uid] ?? '');
        $desc = trim($_POST['eligdesc'][$uid] ?? '');
        $subjects = [];
        foreach (text_lines($_POST['subjects'][$uid] ?? '') as $line) {
            [$name, $marks] = array_pad(array_map('trim', explode('|', $line)), 2, '');
            if ($name !== '') {
                $subjects[] = ['nameBn' => $name, 'marks' => (int) $marks];
            }
        }
        $units[$uid] = [
            'seats' => $seatTotal === null ? null : [
                'total' => (int) $seatTotal,
                'breakdown' => $prev['seats']['breakdown'] ?? [],
            ],
            'eligibility' => $desc === '' ? null : [
                'descriptionBn' => $desc,
                'points' => $prev['eligibility']['points'] ?? [],
            ],
            'examPattern' => nullable($_POST['exampattern'][$uid] ?? ''),
            'subjects' => $subjects,
            'resultMethod' => nullable($_POST['result'][$uid] ?? ''),
            'circularUrl' => nullable($_POST['circular'][$uid] ?? ''),
        ];
    }
    $map[$id] = ['introBn' => nullable($_POST['introBn'] ?? ''), 'units' => $units];
    save_json('info', $map);
    return 'তথ্যকণিকা সংরক্ষিত হয়েছে।';
}

function save_checker(): string
{
    $id = trim($_POST['id'] ?? '');
    $uni = null;
    foreach (institutions() as $u) {
        if (($u['id'] ?? '') === $id) {
            $uni = $u;
        }
    }
    if ($uni === null) {
        return 'প্রতিষ্ঠান পাওয়া যায়নি।';
    }
    $criteriaByUnit = [];
    foreach ($uni['units'] as $unit) {
        $uid = $unit['id'];
        $group = $_POST['group'][$uid] ?? '';
        if (!array_key_exists($group, GROUPS)) {
            continue;
        }
        $criteria = [
            'group' => $group,
            'minSscGpa' => nullable_number($_POST['minssc'][$uid] ?? ''),
            'minHscGpa' => nullable_number($_POST['minhsc'][$uid] ?? ''),
            'minCombinedGpa' => nullable_number($_POST['mincomb'][$uid] ?? ''),
            'subjectMinimums' => [],
            'subjectGroupMinTotal' => null,
            'noteBn' => nullable($_POST['note'][$uid] ?? ''),
        ];
        foreach (text_lines($_POST['submin'][$uid] ?? '') as $line) {
            [$subject, $min] = array_pad(array_map('trim', explode('|', $line)), 2, '');
            if ($subject !== '' && $min !== '') {
                $criteria['subjectMinimums'][] = ['subjectBn' => $subject, 'minGpa' => (float) $min];
            }
        }
        $groupLine = trim($_POST['subgroup'][$uid] ?? '');
        if ($groupLine !== '') {
            [$subjectsPart, $total] = array_pad(array_map('trim', explode('|', $groupLine)), 2, '');
            $subjects = array_values(array_filter(array_map('trim', explode(',', $subjectsPart)), fn($s) => $s !== ''));
            if ($subjects !== [] && $total !== '') {
                $criteria['subjectGroupMinTotal'] = ['subjectsBn' => $subjects, 'minTotal' => (float) $total];
            }
        }
        $criteriaByUnit[$uid] = $criteria;
    }
    $map = load_json('eligibility');
    if ($criteriaByUnit === []) {
        unset($map[$id]);
    } else {
        $map[$id] = $criteriaByUnit;
    }
    save_json('eligibility', $map);
    return 'আবেদনযোগ্যতার শর্ত সংরক্ষিত হয়েছে।';
}

function save_texts(): string
{
    $seed = load_json('site-texts');
    $current = $seed;
    foreach (array_keys($seed) as $key) {
        $value = trim($_POST['t'][$key] ?? '');
        if ($value !== '') {
            $current[$key] = $value;
        }
    }
    save_json('site-texts', $current);
    return 'লেখাগুলো সংরক্ষিত হয়েছে।';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $action = $_POST['action'] ?? '';
    $message = match ($action) {
        'home' => save_home(),
        'notices' => save_notices(),
        'info' => save_info(),
        'checker' => save_checker(),
        'texts' => save_texts(),
        default => 'অজানা অনুরোধ।',
    };
}

// ---------- rendering ----------
function val(array $arr, string $key): string
{
    return h((string) ($arr[$key] ?? ''));
}

function selected_id(): string
{
    return trim($_GET['id'] ?? '');
}

function institution_select(string $tab): string
{
    $html = '<form method="get"><input type="hidden" name="tab" value="' . h($tab) . '"><select name="id" onchange="this.form.submit()">';
    $html .= '<option value="">— প্রতিষ্ঠান বেছে নিন —</option>';
    if ($tab === 'home') {
        $html .= '<option value="new"' . (selected_id() === 'new' ? ' selected' : '') . '>+ নতুন প্রতিষ্ঠান</option>';
    }
    foreach (institutions() as $u) {
        $sel = selected_id() === $u['id'] ? ' selected' : '';
        $html .= '<option value="' . h($u['id']) . '"' . $sel . '>' . h($u['nameBn']) . ' (' . h($u['id']) . ')</option>';
    }
    return $html . '</select> <noscript><button>দেখুন</button></noscript></form>';
}

function current_institution(): ?array
{
    foreach (institutions() as $u) {
        if (($u['id'] ?? '') === selected_id()) {
            return $u;
        }
    }
    return null;
}

$csrf = h(csrf_token());
?>
<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>অ্যাডমিন প্যানেল — অ্যাডমিশন ক্যালেন্ডার</title>
<style>
body{font-family:sans-serif;margin:0;background:#f5f7fb;color:#14213d;font-size:16px}
header{background:#4f46e5;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
nav a{color:#fff;margin-right:12px;text-decoration:none;font-weight:600}
nav a.active{text-decoration:underline}
main{max-width:980px;margin:16px auto;padding:0 12px}
.box{background:#fff;border:1px solid #d7dce6;border-radius:10px;padding:16px;margin-bottom:16px}
.box h3{margin-top:0}
label{display:block;font-weight:600;margin:10px 0 4px}
input[type=text],input[type=number],textarea,select{width:100%;box-sizing:border-box;padding:8px;font-size:15px;border:1px solid #c5ccd9;border-radius:6px}
textarea{min-height:90px;font-family:inherit}
.unit{border:1px dashed #b8c1d1;border-radius:8px;padding:10px;margin:10px 0}
.hint{color:#64708a;font-size:13px;font-weight:400}
button{background:#4f46e5;color:#fff;border:0;border-radius:6px;padding:10px 18px;font-size:15px;cursor:pointer}
.ok{background:#dcfce7;border:1px solid #86efac;padding:10px;border-radius:6px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <strong>অ্যাডমিন প্যানেল</strong>
  <nav>
    <?php foreach (TABS as $key => $label): ?>
      <a href="?tab=<?= h($key) ?>" class="<?= $tab === $key ? 'active' : '' ?>"><?= h($label) ?></a>
    <?php endforeach; ?>
    <a href="?logout=1">লগআউট</a>
  </nav>
</header>
<main>
<?php if ($message !== ''): ?>
  <div class="ok"><?= h($message) ?></div>
<?php endif; ?>

<?php if ($tab === 'home'): ?>
  <div class="box">
    <h3>প্রতিষ্ঠান ও ইউনিট (একনজরে ক্যালেন্ডার)</h3>
    <?= institution_select('home') ?>
    <?php
    $u = current_institution();
    $isNew = selected_id() === 'new';
    if ($u !== null || $isNew):
        $unitLines = '';
        if ($u !== null) {
            foreach ($u['units'] as $unit) {
                $unitLines .= implode('|', [$unit['id'], $unit['nameBn'] ?? '', $unit['applicationStart'] ?? '', $unit['applicationEnd'] ?? '', $unit['examDate'] ?? '', !empty($unit['isDemoData']) ? '1' : '0']) . "\n";
            }
        }
    ?>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="home">
      <input type="hidden" name="orig_id" value="<?= h($u['id'] ?? '') ?>">
      <div class="grid">
        <div><label>আইডি <span class="hint">(একবার সেভ হলে বদলাবেন না)</span></label>
          <input type="text" name="id" value="<?= val($u ?? [], 'id') ?>" <?= $u ? 'readonly' : 'required' ?>></div>
        <div><label>ক্যাটাগরি</label>
          <select name="category"><?php foreach (CATEGORIES as $v => $l): ?>
            <option value="<?= h($v) ?>" <?= ($u['category'] ?? '') === $v ? 'selected' : '' ?>><?= h($l) ?></option>
          <?php endforeach; ?></select></div>
        <div><label>নাম (বাংলা)</label><input type="text" name="nameBn" value="<?= val($u ?? [], 'nameBn') ?>" required></div>
        <div><label>নাম (ইংরেজি)</label><input type="text" name="nameEn" value="<?= val($u ?? [], 'nameEn') ?>"></div>
        <div><label>সংক্ষিপ্ত নাম</label><input type="text" name="shortName" value="<?= val($u ?? [], 'shortName') ?>"></div>
        <div><label>ভর্তি সেশন <span class="hint">(যেমন ২০২৬-২৭)</span></label><input type="text" name="admissionSession" value="<?= val($u ?? [], 'admissionSession') ?>"></div>
        <div><label>সাব-গ্রুপ <span class="hint">(ঐচ্ছিক)</span></label><input type="text" name="subGroupBn" value="<?= val($u ?? [], 'subGroupBn') ?>"></div>
      </div>
      <label>ইউনিট ও তারিখ <span class="hint">প্রতি লাইনে একটি ইউনিট: আইডি | নাম | আবেদন শুরু | আবেদন শেষ | পরীক্ষার তারিখ | নমুনা (১ বা ০)। তারিখ YYYY-MM-DD, না জানলে খালি।</span></label>
      <textarea name="units" rows="6" required><?= h($unitLines !== '' ? $unitLines : "default||||0\n") ?></textarea>
      <p><button name="save" value="1">সংরক্ষণ করুন</button></p>
      <?php if ($u !== null): ?>
        <label><input type="checkbox" name="delete" value="1" style="width:auto"> এই প্রতিষ্ঠানটি মুছে ফেলুন (তথ্যকণিকা ও শর্তসহ)</label>
      <?php endif; ?>
    </form>
    <?php endif; ?>
  </div>

  <div class="box">
    <h3>জরুরি নোটিশ (স্ক্রলিং ব্যানার)</h3>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="notices">
      <label>প্রতি লাইনে একটি নোটিশ</label>
      <textarea name="notices" rows="6"><?= h(implode("\n", load_json('notices')['notices'] ?? [])) ?></textarea>
      <p><button>নোটিশ সংরক্ষণ করুন</button></p>
    </form>
  </div>

<?php elseif ($tab === 'info'): ?>
  <div class="box">
    <h3>তথ্যকণিকা</h3>
    <?= institution_select('info') ?>
    <?php $u = current_institution(); if ($u !== null):
        $info = load_json('info')[$u['id']] ?? [];
        $units = $info['units'] ?? [];
    ?>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="info">
      <input type="hidden" name="id" value="<?= h($u['id']) ?>">
      <label>সংক্ষিপ্ত পরিচিতি</label>
      <textarea name="introBn"><?= val($info, 'introBn') ?></textarea>
      <?php foreach ($u['units'] as $unit): $uid = $unit['id'];
          $i = $units[$uid] ?? [];
          $subjectLines = '';
          foreach (($i['subjects'] ?? []) as $s) { $subjectLines .= ($s['nameBn'] ?? '') . '|' . ($s['marks'] ?? '') . "\n"; }
      ?>
      <div class="unit">
        <strong><?= h($unit['nameBn'] ?: $u['nameBn']) ?></strong> <span class="hint">(<?= h($uid) ?>)</span>
        <div class="grid">
          <div><label>মোট আসন</label><input type="number" name="seats[<?= h($uid) ?>]" value="<?= h((string) ($i['seats']['total'] ?? '')) ?>"></div>
          <div><label>পরীক্ষার ধরন</label><input type="text" name="exampattern[<?= h($uid) ?>]" value="<?= val($i, 'examPattern') ?>"></div>
          <div><label>ফলাফল নির্ণয় পদ্ধতি</label><input type="text" name="result[<?= h($uid) ?>]" value="<?= val($i, 'resultMethod') ?>"></div>
          <div><label>সার্কুলার লিংক</label><input type="text" name="circular[<?= h($uid) ?>]" value="<?= val($i, 'circularUrl') ?>"></div>
        </div>
        <label>আবেদন যোগ্যতা (বিবরণ)</label>
        <textarea name="eligdesc[<?= h($uid) ?>]"><?= h($i['eligibility']['descriptionBn'] ?? '') ?></textarea>
        <label>বিষয় ও নম্বর <span class="hint">প্রতি লাইনে: বিষয় | নম্বর</span></label>
        <textarea name="subjects[<?= h($uid) ?>]"><?= h($subjectLines) ?></textarea>
      </div>
      <?php endforeach; ?>
      <p><button>তথ্যকণিকা সংরক্ষণ করুন</button></p>
    </form>
    <?php endif; ?>
  </div>

<?php elseif ($tab === 'checker'): ?>
  <div class="box">
    <h3>আবেদনযোগ্যতা যাচাই — জিপিএ শর্ত</h3>
    <?= institution_select('checker') ?>
    <?php $u = current_institution(); if ($u !== null):
        $elig = load_json('eligibility')[$u['id']] ?? [];
    ?>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="checker">
      <input type="hidden" name="id" value="<?= h($u['id']) ?>">
      <?php foreach ($u['units'] as $unit): $uid = $unit['id'];
          $c = $elig[$uid] ?? [];
          $subMin = '';
          foreach (($c['subjectMinimums'] ?? []) as $s) { $subMin .= ($s['subjectBn'] ?? '') . '|' . ($s['minGpa'] ?? '') . "\n"; }
          $sgt = $c['subjectGroupMinTotal'] ?? null;
          $sgtLine = $sgt ? implode(',', $sgt['subjectsBn'] ?? []) . '|' . ($sgt['minTotal'] ?? '') : '';
      ?>
      <div class="unit">
        <strong><?= h($unit['nameBn'] ?: $u['nameBn']) ?></strong> <span class="hint">(<?= h($uid) ?>)</span>
        <div class="grid">
          <div><label>গ্রুপ <span class="hint">(খালি রাখলে এই ইউনিট চেকারে আসবে না)</span></label>
            <select name="group[<?= h($uid) ?>]"><option value="">— নেই —</option>
              <?php foreach (GROUPS as $v => $l): ?><option value="<?= h($v) ?>" <?= ($c['group'] ?? '') === $v ? 'selected' : '' ?>><?= h($l) ?></option><?php endforeach; ?>
            </select></div>
          <div><label>ন্যূনতম SSC জিপিএ</label><input type="number" step="0.01" name="minssc[<?= h($uid) ?>]" value="<?= h((string) ($c['minSscGpa'] ?? '')) ?>"></div>
          <div><label>ন্যূনতম HSC জিপিএ</label><input type="number" step="0.01" name="minhsc[<?= h($uid) ?>]" value="<?= h((string) ($c['minHscGpa'] ?? '')) ?>"></div>
          <div><label>ন্যূনতম মোট জিপিএ (SSC+HSC)</label><input type="number" step="0.01" name="mincomb[<?= h($uid) ?>]" value="<?= h((string) ($c['minCombinedGpa'] ?? '')) ?>"></div>
        </div>
        <label>বিষয়ভিত্তিক ন্যূনতম জিপিএ <span class="hint">প্রতি লাইনে: বিষয় | জিপিএ (যেমন পদার্থবিজ্ঞান | 4)</span></label>
        <textarea name="submin[<?= h($uid) ?>]"><?= h($subMin) ?></textarea>
        <label>বিষয়সমষ্টির শর্ত <span class="hint">বিষয়গুলো কমা দিয়ে | মোট (যেমন পদার্থবিজ্ঞান,রসায়ন,উচ্চতর গণিত | 14)</span></label>
        <input type="text" name="subgroup[<?= h($uid) ?>]" value="<?= h($sgtLine) ?>">
        <label>টীকা (চেকারে দেখাবে)</label>
        <textarea name="note[<?= h($uid) ?>]"><?= h($c['noteBn'] ?? '') ?></textarea>
      </div>
      <?php endforeach; ?>
      <p><button>শর্ত সংরক্ষণ করুন</button></p>
    </form>
    <?php endif; ?>
  </div>

<?php elseif ($tab === 'texts'): ?>
  <div class="box">
    <h3>সাধারণ লেখা (টাইটেল, মেনু, হেডিং, বাটন — সব পেজ)</h3>
    <p class="hint">বাম পাশের নাম (যেমন sectionUpcoming) বদলাবেন না, শুধু ডানের লেখা বদলান। <code>{n}</code>, <code>{year}</code> চিহ্ন ঠিক রাখুন।</p>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= $csrf ?>">
      <input type="hidden" name="action" value="texts">
      <?php foreach (load_json('site-texts') as $key => $value): ?>
        <label><?= h($key) ?></label>
        <?php if (mb_strlen((string) $value) > 60): ?>
          <textarea name="t[<?= h($key) ?>]"><?= h((string) $value) ?></textarea>
        <?php else: ?>
          <input type="text" name="t[<?= h($key) ?>]" value="<?= h((string) $value) ?>">
        <?php endif; ?>
      <?php endforeach; ?>
      <p><button>লেখাগুলো সংরক্ষণ করুন</button></p>
    </form>
  </div>
<?php endif; ?>
</main>
</body>
</html>
