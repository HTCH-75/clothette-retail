// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://iqimndaucedbgavbtlen.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaW1uZGF1Y2VkYmdhdmJ0bGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTE2NzgsImV4cCI6MjA5MDUyNzY3OH0.WayuEccuTsdzmIYl-0MZmDPGDckWEtqyHI-ZEu0rtKE';

let supabase = null;

function initSupabase() {
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase connecté ✓');
  }
}

const USERS = {
  'admin@clothette.com':   { pass: 'admin123',   role: 'admin', name: 'Admin',          initials: 'CR' },
  'lesdeux@clothette.com': { pass: 'lesdeux123', role: 'brand', brand: 'les-deux',      name: 'Les Deux France', initials: 'LD' },
  'nn07@clothette.com':    { pass: 'nn07123',    role: 'brand', brand: 'nn07',          name: 'NN07',            initials: 'N7' },
};

const BRANDS = {
  'les-deux': { id:'les-deux', name:'Les Deux', fullName:'Les Deux France', color:'#534AB7', colorLight:'#EEEDFE', colorText:'#3C3489', stores:['GLH','GLCE'] },
  'nn07':     { id:'nn07',     name:'NN07',     fullName:'NN07',            color:'#1D9E75', colorLight:'#E1F5EE', colorText:'#085041', stores:['GLH-NN07'] },
};

const STORES = {
  'GLH':     { code:3050, label:'GL Haussmann' },
  'GLCE':    { code:3201, label:'GL Champs-Élysées' },
  'GLH-NN07':{ code:3050, label:'GL Haussmann' },
};

// ─── SUPABASE FUNCTIONS ───────────────────────────────────────────────────────
async function fetchStocksDB(brandId) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('stocks').select('*, catalogue(style_name, category, size, color, style_no)').eq('brand_id', brandId);
  if (error) { console.error(error); return null; }
  return data;
}

async function fetchHistoryDB(brandId) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('import_history').select('*').eq('brand_id', brandId).order('created_at', { ascending: false }).limit(20);
  if (error) { console.error(error); return null; }
  return data;
}

async function insertSalesDB(rows) {
  if (!supabase) return false;
  const { error } = await supabase.from('sales').insert(rows);
  if (error) { console.error(error); return false; }
  return true;
}

async function logImport(brandId, fileName, type, total, ok, failed, status) {
  if (!supabase) return;
  await supabase.from('import_history').insert({ brand_id: brandId, file_name: fileName, import_type: type, lines_total: total, lines_ok: ok, lines_failed: failed, status });
}

async function importCatalogueDB(brandId, rows) {
  if (!supabase) return { ok:0, failed:0 };
  let ok = 0, failed = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100).map(r => ({ ...r, brand_id: brandId }));
    const { error } = await supabase.from('catalogue').upsert(chunk, { onConflict: 'ean' });
    if (error) { failed += chunk.length; } else { ok += chunk.length; }
  }
  return { ok, failed };
}

// ─── FALLBACK DATA ────────────────────────────────────────────────────────────
const STOCKS_FALLBACK = {
  'les-deux': [
    {ref:'1002138-211',style:'SS26 Cap',      size:'ONE',  cat:'Accessoires',glh:2, glce:1,min:5},
    {ref:'1001317-826',style:'Ty Beanie',     size:'ONE',  cat:'Accessoires',glh:8, glce:4,min:4},
    {ref:'1001546-201',style:'Carl T-shirt',  size:'S',    cat:'T-SHIRT',    glh:5, glce:3,min:4},
    {ref:'1001546-201',style:'Carl T-shirt',  size:'M',    cat:'T-SHIRT',    glh:7, glce:4,min:4},
    {ref:'1001514-815',style:'James Blazer',  size:'48',   cat:'BLAZER',     glh:1, glce:2,min:3},
    {ref:'1001320-826',style:'Sheldon Blazer',size:'50',   cat:'BLAZER',     glh:0, glce:1,min:3},
    {ref:'1001306-553',style:'Ricky Jeans',   size:'32/32',cat:'JEANS',      glh:3, glce:0,min:4},
    {ref:'1002023-201',style:'Logo Tee',      size:'L',    cat:'T-SHIRT',    glh:6, glce:5,min:4},
    {ref:'LDM101008',  style:'LD Cap',        size:'ONE',  cat:'Accessoires',glh:0, glce:0,min:3},
  ],
  'nn07': [
    {ref:'1963323487-003-S',style:'Clive Egg White',size:'S',cat:'JERSEY',glh:4,glce:0,min:3},
    {ref:'1963323487-003-M',style:'Clive Egg White',size:'M',cat:'JERSEY',glh:6,glce:0,min:3},
    {ref:'1963323487-200-S',style:'Clive Navy Blue', size:'S',cat:'JERSEY',glh:5,glce:0,min:3},
    {ref:'1963323487-200-M',style:'Clive Navy Blue', size:'M',cat:'JERSEY',glh:7,glce:0,min:3},
  ],
};

const SALES_SUMMARY = {
  'les-deux': {
    week:'23–30 mars 2026',total:195,returns:7,ca:20150,
    byStore:{GLH:137,GLCE:58},
    byDay:[{label:'Lu 23',val:13},{label:'Ma 24',val:20},{label:'Me 25',val:18},{label:'Je 26',val:10},{label:'Ve 27',val:49},{label:'Sa 28',val:57},{label:'Di 29',val:30}],
    topRefs:[{ref:'1002138-211',qty:6},{ref:'1001317-826',qty:5},{ref:'1001546-201',qty:4},{ref:'1001514-815',qty:4},{ref:'1001320-826',qty:4}],
    sellThrough:68,
  },
  'nn07': {
    week:'23–30 mars 2026',total:84,returns:3,ca:8760,
    byStore:{'GLH-NN07':84},
    byDay:[{label:'Lu 23',val:8},{label:'Ma 24',val:11},{label:'Me 25',val:9},{label:'Je 26',val:6},{label:'Ve 27',val:21},{label:'Sa 28',val:24},{label:'Di 29',val:5}],
    topRefs:[{ref:'1963323487-200-M',qty:5},{ref:'1963323487-003-M',qty:4},{ref:'1963323487-200-L',qty:4}],
    sellThrough:61,
  },
};

const IMPORT_HISTORY_FALLBACK = {
  'les-deux': [
    {file:'VENTES_23-30_MARS.xls',    type:'ventes',  date:'30 mars 2026',lines:202,status:'ok'},
    {file:'179683_Delivery_Note.xls', type:'reassort',date:'12 fév 2026', lines:43, status:'partial'},
    {file:'VENTES_16-22_MARS.xls',    type:'ventes',  date:'23 mars 2026',lines:178,status:'ok'},
  ],
  'nn07': [
    {file:'VENTES_NN07_23-30_MARS.xls',type:'ventes',date:'30 mars 2026',lines:88,status:'ok'},
  ],
};

const MISSING_REFS = {
  'les-deux': [
    {ref:'1001597-714-ONE',    style:'Paisley Tie',         colorSize:'Tawny Olive / One size',qty:1},
    {ref:'100510070-3434-282', style:'Como Suit Pants',     colorSize:'Anthrazit / 28/32',     qty:1},
    {ref:'1001162-460-S',      style:'Mini Tile Flower Tie',colorSize:'Dark Navy / S',         qty:3},
  ],
  'nn07':[],
};
