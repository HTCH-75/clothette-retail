// ─── USERS ───────────────────────────────────────────────────────────────────
const USERS = {
  'admin@clothette.com': { pass: 'admin123', role: 'admin', name: 'Admin', initials: 'CR' },
  'lesdeux@clothette.com': { pass: 'lesdeux123', role: 'brand', brand: 'les-deux', name: 'Les Deux France', initials: 'LD' },
  'nn07@clothette.com': { pass: 'nn07123', role: 'brand', brand: 'nn07', name: 'NN07', initials: 'N7' },
};

// ─── BRANDS ──────────────────────────────────────────────────────────────────
const BRANDS = {
  'les-deux': {
    id: 'les-deux',
    name: 'Les Deux',
    fullName: 'Les Deux France',
    color: '#534AB7',
    colorLight: '#EEEDFE',
    colorText: '#3C3489',
    stores: ['GLH', 'GLCE'],
    collections: ['AW25', 'SS26'],
  },
  'nn07': {
    id: 'nn07',
    name: 'NN07',
    fullName: 'NN07',
    color: '#1D9E75',
    colorLight: '#E1F5EE',
    colorText: '#085041',
    stores: ['GLH'],
    collections: ['AW25', 'SS26'],
  },
};

const STORES = {
  GLH:  { code: 3050, label: 'GL Haussmann' },
  GLCE: { code: 3201, label: 'GL Champs-Élysées' },
};

// ─── STOCKS DATA ─────────────────────────────────────────────────────────────
const STOCKS = {
  'les-deux': [
    { ref:'1002138-211', style:'SS26 Cap',                  size:'ONE',   cat:'Accessoires', glh:2,  glce:1,  min:5  },
    { ref:'1001317-826', style:'Ty Beanie',                 size:'ONE',   cat:'Accessoires', glh:8,  glce:4,  min:4  },
    { ref:'1001546-201', style:'Carl T-shirt Black S',      size:'S',     cat:'T-SHIRT',     glh:5,  glce:3,  min:4  },
    { ref:'1001546-201', style:'Carl T-shirt Black M',      size:'M',     cat:'T-SHIRT',     glh:7,  glce:4,  min:4  },
    { ref:'1001546-201', style:'Carl T-shirt Black L',      size:'L',     cat:'T-SHIRT',     glh:3,  glce:2,  min:4  },
    { ref:'1001514-815', style:'James Blazer',              size:'48',    cat:'BLAZER',      glh:1,  glce:2,  min:3  },
    { ref:'1001320-826', style:'Sheldon Blazer',            size:'50',    cat:'BLAZER',      glh:0,  glce:1,  min:3  },
    { ref:'1001306-553', style:'Ricky Jeans',               size:'32/32', cat:'JEANS',       glh:3,  glce:0,  min:4  },
    { ref:'1002023-201', style:'Logo Tee',                  size:'L',     cat:'T-SHIRT',     glh:6,  glce:5,  min:4  },
    { ref:'1001298-571', style:'Como Suit Pants',           size:'46',    cat:'PANTS',       glh:4,  glce:2,  min:3  },
    { ref:'1001757-430', style:'Table Tie',                 size:'ONE',   cat:'Accessoires', glh:3,  glce:3,  min:3  },
    { ref:'LDM101008',   style:'LD Cap',                    size:'ONE',   cat:'Accessoires', glh:0,  glce:0,  min:3  },
    { ref:'1001162-460', style:'Mini Tile Flower Tie',      size:'ONE',   cat:'Accessoires', glh:4,  glce:2,  min:3  },
    { ref:'1001165-100', style:'LD Logo Socks',             size:'42',    cat:'Accessoires', glh:6,  glce:3,  min:4  },
    { ref:'1001187-460', style:'Table Tie Navy',            size:'ONE',   cat:'Accessoires', glh:5,  glce:2,  min:3  },
  ],
  'nn07': [
    { ref:'1963323487-003-S',  style:'Clive 3323 Egg White', size:'S',   cat:'JERSEY',  glh:4,  glce:0, min:3 },
    { ref:'1963323487-003-M',  style:'Clive 3323 Egg White', size:'M',   cat:'JERSEY',  glh:6,  glce:0, min:3 },
    { ref:'1963323487-003-L',  style:'Clive 3323 Egg White', size:'L',   cat:'JERSEY',  glh:3,  glce:0, min:3 },
    { ref:'1963323487-003-XL', style:'Clive 3323 Egg White', size:'XL',  cat:'JERSEY',  glh:2,  glce:0, min:3 },
    { ref:'1963323487-003-XXL',style:'Clive 3323 Egg White', size:'XXL', cat:'JERSEY',  glh:0,  glce:0, min:3 },
    { ref:'1963323487-200-S',  style:'Clive 3323 Navy Blue', size:'S',   cat:'JERSEY',  glh:5,  glce:0, min:3 },
    { ref:'1963323487-200-M',  style:'Clive 3323 Navy Blue', size:'M',   cat:'JERSEY',  glh:7,  glce:0, min:3 },
    { ref:'1963323487-200-L',  style:'Clive 3323 Navy Blue', size:'L',   cat:'JERSEY',  glh:4,  glce:0, min:3 },
  ],
};

// ─── SALES DATA ──────────────────────────────────────────────────────────────
const SALES_SUMMARY = {
  'les-deux': {
    week: '23–30 mars 2026',
    total: 195, returns: 7, ca: 20150,
    byStore: { GLH: 137, GLCE: 58 },
    byDay: [
      { label:'Lu 23', val:13 }, { label:'Ma 24', val:20 }, { label:'Me 25', val:18 },
      { label:'Je 26', val:10 }, { label:'Ve 27', val:49 }, { label:'Sa 28', val:57 },
      { label:'Di 29', val:30 },
    ],
    topRefs: [
      { ref:'1002138-211', qty:6 }, { ref:'1001317-826', qty:5 },
      { ref:'1001546-201', qty:4 }, { ref:'1001514-815', qty:4 },
      { ref:'1001320-826', qty:4 },
    ],
    sellThrough: 68,
  },
  'nn07': {
    week: '23–30 mars 2026',
    total: 84, returns: 3, ca: 8760,
    byStore: { GLH: 84, GLCE: 0 },
    byDay: [
      { label:'Lu 23', val:8 }, { label:'Ma 24', val:11 }, { label:'Me 25', val:9 },
      { label:'Je 26', val:6 }, { label:'Ve 27', val:21 }, { label:'Sa 28', val:24 },
      { label:'Di 29', val:5 },
    ],
    topRefs: [
      { ref:'1963323487-200-M', qty:5 }, { ref:'1963323487-003-M', qty:4 },
      { ref:'1963323487-200-L', qty:4 }, { ref:'1963323487-003-S', qty:3 },
      { ref:'1963323487-200-S', qty:3 },
    ],
    sellThrough: 61,
  },
};

// ─── IMPORT HISTORY ──────────────────────────────────────────────────────────
const IMPORT_HISTORY = {
  'les-deux': [
    { file:'VENTES_23-30_MARS.xls',      type:'ventes',  date:'30 mars 2026',  lines:202, status:'ok' },
    { file:'179683_Delivery_Note.xls',   type:'reassort',date:'12 fév 2026',   lines:43,  status:'partial' },
    { file:'VENTES_16-22_MARS.xls',      type:'ventes',  date:'23 mars 2026',  lines:178, status:'ok' },
    { file:'VENTES_09-15_MARS.xls',      type:'ventes',  date:'16 mars 2026',  lines:163, status:'ok' },
    { file:'178244_Delivery_Note.xls',   type:'reassort',date:'20 janv 2026',  lines:87,  status:'ok' },
  ],
  'nn07': [
    { file:'VENTES_NN07_23-30_MARS.xls', type:'ventes',  date:'30 mars 2026',  lines:88,  status:'ok' },
    { file:'NN07_Delivery_Note.xls',     type:'reassort',date:'5 fév 2026',    lines:52,  status:'ok' },
    { file:'VENTES_NN07_16-22_MARS.xls', type:'ventes',  date:'23 mars 2026',  lines:71,  status:'ok' },
  ],
};

// ─── MISSING REFS ─────────────────────────────────────────────────────────────
const MISSING_REFS = {
  'les-deux': [
    { ref:'1001597-714-ONE', style:'Paisley Tie',        colorSize:'Tawny Olive / One size', qty:1 },
    { ref:'100510070-3434-282', style:'Como Suit Pants', colorSize:'Anthrazit / 28/32',      qty:1 },
    { ref:'1001162-460-S', style:'Mini Tile Flower Tie', colorSize:'Dark Navy / S',          qty:3 },
  ],
  'nn07': [],
};
