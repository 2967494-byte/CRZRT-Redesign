const COURSE_SLUG_TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
function slugifyCourseText(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  let out = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charAt(i);
    if (Object.prototype.hasOwnProperty.call(COURSE_SLUG_TRANSLIT, ch)) out += COURSE_SLUG_TRANSLIT[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else if (/[\s_./\\+,;:()[\]{}«»"']/.test(ch) || ch === '-' || ch === '—') out += '-';
  }
  return out.replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
function isLegacyCourseSlug(slug) {
  const value = String(slug || '').trim();
  if (!value) return true;
  return /^(distancionnyi|ochnyi)(-|$)/.test(value);
}
function buildCourseSlugBase(course) {
  const title = String(course?.title || '').trim();
  const isWebinar = /вебинар/i.test(title);
  const typePart = isWebinar ? 'vebinar' : 'kurs';
  const hoursMatch = title.match(/\((\d+)\s*ак/i);
  const hours = hoursMatch ? hoursMatch[1] : '';
  let core = title;
  core = core.replace(/[«»„""]/g, '');
  core = core.replace(/^\s*вебинар\s+для\s+(заказчиков|поставщиков)\s*(на\s+тему)?\s*:?\s*/i, '');
  core = core.replace(/^\s*вебинар\s*:?\s*/i, '');
  core = core.replace(/^\s*(дистанционный|очный)\s+/i, '');
  core = core.replace(/^\s*курс\s+повышения\s+квалификации(\s+для\s+поставщиков)?(\s+по)?\s*/i, '');
  core = core.replace(/^\s*по\s+/i, '');
  let coreSlug = slugifyCourseText(core);
  coreSlug = coreSlug.replace(/-?\d+-ak-ch-?/g, '-');
  coreSlug = coreSlug.replace(/-(44-fz|223-fz)(?=-|$)/g, '');
  coreSlug = coreSlug.replace(/^(44-fz|223-fz)(?=-|$)/g, '');
  coreSlug = coreSlug.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!coreSlug || /^(po|po-\d+-fz|\d+-fz)$/.test(coreSlug)) {
    coreSlug = isWebinar ? '' : 'pk';
  }
  if (coreSlug.length > 40) {
    coreSlug = coreSlug.slice(0, 40).replace(/-+$/g, '');
    const cut = coreSlug.lastIndexOf('-');
    if (cut >= 18) coreSlug = coreSlug.slice(0, cut);
  }
  const parts = [typePart];
  if (!isWebinar) parts.push(course?.format === 'dist' ? 'dist' : 'och');
  if (coreSlug) parts.push(coreSlug);
  if (hours) parts.push(hours);
  let joined = parts.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const lawParts = [];
  if (course?.is44fz && joined.indexOf('44') === -1) lawParts.push('44');
  if (course?.is223fz && joined.indexOf('223') === -1) lawParts.push('223');
  if (lawParts.length) joined += '-' + lawParts.join('-');
  joined = joined.replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (joined.length > 60) {
    joined = joined.slice(0, 60).replace(/-+$/g, '');
    const joinCut = joined.lastIndexOf('-');
    if (joinCut >= 24) joined = joined.slice(0, joinCut);
  }
  return joined || 'course';
}

const samples = [
  { title: 'Дистанционный курс повышения квалификации по 44-ФЗ (120 ак.ч)', format: 'dist', is44fz: true },
  { title: 'Вебинар для Заказчиков на тему: «Контракт с единственным поставщиком по ч.1 ст. 93»', format: 'dist', is44fz: true, is223fz: true },
  { title: 'Очный курс повышения квалификации по 44-ФЗ (108 ак. ч.) Предновогодний тур-пакет: обучение + экскурсионная программа', format: 'och', is44fz: true },
  { title: 'Очный курс повышения квалификации по 223-ФЗ (72 ак. ч.)', format: 'och', is223fz: true },
  { title: 'Вебинар для поставщиков: Что нужно, чтобы начать участвовать в государственных закупках?', format: 'dist' },
  { title: 'x', slug: 'distancionnyi-foo', format: 'dist', is44fz: true },
];
for (const c of samples) {
  const s = isLegacyCourseSlug(c.slug) ? buildCourseSlugBase(c) : (c.slug || buildCourseSlugBase(c));
  console.log(String(s.length).padStart(2), s);
}
