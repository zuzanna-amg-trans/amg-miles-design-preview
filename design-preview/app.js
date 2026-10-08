/* Independent visual prototype. All records below are fictional.
 * Replace demoSource with the dev project's actual data layer once its API is known.
 * This prototype does not authenticate, settle invoices, send mail, or order rewards.
 */
'use strict';

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  invoice: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 7h6M9 11h6M9 15h3"/>',
  history: '<path d="M3 11a9 9 0 1 1 2.5 7M3 4v7h7"/><path d="M12 7v5l3 2"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H8.5a2.5 2.5 0 1 1 2.5-2.5L12 8Zm0 0h3.5A2.5 2.5 0 1 0 13 5.5L12 8Z"/>',
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
  spark: '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3ZM20 2v4M18 4h4"/>',
  support: '<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 12h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 18v1a2 2 0 0 1-2 2h-3"/>',
  arrow: '<path d="M6 18 18 6M6 6h12v12"/>',
  right: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m7 10 5 5 5-5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  minus: '<path d="M5 12h14"/>',
  expand: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
  package: '<path d="m12 3 9 5v8l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v8M7.5 5.5l9 5"/>',
  camera: '<path d="M4 7h4l2-3h4l2 3h4v14H4Z"/><circle cx="12" cy="13" r="4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  book: '<path d="M12 5v15M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/>',
  truck: '<path d="M3 6h11v11H3zM14 10h4l3 4v3h-7M3 17h2M10 17h5M20 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  left: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  document: '<path d="M14 3H5v18h14V8l-5-5ZM14 3v5h5M8 12h8M8 16h6"/>',
};

const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => new Intl.NumberFormat('pl-PL', {useGrouping:'always'}).format(value);
const money = value => new Intl.NumberFormat('pl-PL', {style:'currency',currency:'EUR'}).format(value);

const demoSource = {
  customer: {companyName:'Firma przykładowa'},
  balance: {available:24850,earnedThisMonth:3450,expiring:2000,expiresAt:'31.10.2026',bonusOpportunity:800},
  orders: [
    {id:'DEMO-261001',registration:'DEMO 001',fromPostal:"60-001",toPostal:"69007",goods:"Części maszyn",packages:"8 palet",weightKg:3200,loadArrival:{"date":"06.10.2026","time":"13:45","window":"13:00–14:00","confirmed":true},unloadArrival:{"date":"07.10.2026","time":"18:30","window":"18:00–19:00","confirmed":false},reference:'AMG-DEMO-01',from:'Poznań',fromCountry:'PL',to:'Lyon',toCountry:'FR',status:'W drodze na rozładunek',kind:'driving',active:true,step:3,load:'06.10.2026, 14:00',delivery:'07.10.2026',deliveryTime:'18:30',window:'18:00–19:00',progress:75,documents:[{name:'CMR',kind:'document',detail:'Po załadunku · 06.10, 14:12'},{name:'Zdjęcie załadunku',kind:'camera',detail:'06.10, 14:08'}],stops:[['Załadunek','Poznań, PL','06.10.2026, 14:00'],['Punkt pośredni','Karlsruhe, DE','07.10.2026, 11:30 · plan'],['Rozładunek','Lyon, FR','07.10.2026, 18:00–19:00 · plan']],position:'Stuttgart, Niemcy',positionCoordinates:[48.7758,9.1829],updated:'07.10.2026, 10:24',vehicle:'Zestaw 13,6 m',cargo:'8 palet · 3 200 kg',fromXY:[752,138],toXY:[263,480],positionXY:[484,340],path:'M752 138 C686 140 650 192 607 225 S550 280 484 340 S344 421 263 480',traveled:'M752 138 C686 140 650 192 607 225 S550 280 484 340',events:[['Zlecenie przyjęte','05.10.2026, 11:20'],['W drodze na załadunek','06.10.2026, 11:35'],['Na załadunku','06.10.2026, 13:45'],['W drodze na rozładunek','06.10.2026, 14:30']],journeyDates:["05.10 · 11:20","06.10 · 11:35","06.10 · 14:00","06.10 · 14:30",null]},
    {id:'DEMO-261002',registration:'DEMO 002',fromPostal:"3011 AA",toPostal:"50-001",goods:"Opakowania kartonowe",packages:"12 palet",weightKg:4800,loadArrival:{"date":"07.10.2026","time":"10:00","window":"09:30–10:30","confirmed":false},unloadArrival:{"date":"08.10.2026","time":"11:00","window":"10:00–12:00","confirmed":false},reference:'AMG-DEMO-02',from:'Rotterdam',fromCountry:'NL',to:'Wrocław',toCountry:'PL',status:'W drodze na załadunek',kind:'to-loading',active:true,step:1,load:'07.10.2026, 10:00',delivery:'08.10.2026',deliveryTime:'11:00',window:'10:00–12:00',progress:null,documents:[],stops:[['Załadunek','Rotterdam, NL','07.10.2026, 10:00'],['Rozładunek','Wrocław, PL','08.10.2026, 10:00–12:00 · plan']],position:null,updated:null,vehicle:'Zestaw 13,6 m',cargo:'12 palet · 4 800 kg',fromXY:[373,107],toXY:[739,268],positionXY:null,path:'M373 107 C449 128 498 150 555 176 S672 242 739 268',traveled:null,events:[["Zlecenie przyjęte","06.10.2026, 09:10"],["W drodze na załadunek","07.10.2026, 08:20"]],journeyDates:["06.10 · 09:10","07.10 · 08:20",null,null,null]},
    {id:'DEMO-260903',registration:'DEMO 003',fromPostal:"04109",toPostal:"80-001",goods:"Elementy metalowe",packages:"10 palet",weightKg:4000,loadArrival:{"date":"04.10.2026","time":"08:00","window":"08:00–09:00","confirmed":true},unloadArrival:{"date":"05.10.2026","time":"09:15","window":"09:00–10:00","confirmed":true},reference:'AMG-DEMO-03',from:'Leipzig',fromCountry:'DE',to:'Gdańsk',toCountry:'PL',status:'Rozładowane',kind:'completed',active:false,step:4,progress:100,documents:[{name:'CMR',kind:'document',detail:'Po rozładunku · demo'},{name:'Faktura',kind:'invoice',detail:'Przykładowy dokument'}],load:'04.10.2026, 08:00',delivery:'05.10.2026',deliveryTime:'09:15',window:'09:00–10:00',vehicle:'Zestaw 13,6 m',cargo:'10 palet · 4 000 kg',events:[['Zlecenie przyjęte','03.10.2026, 11:00'],['Na załadunku','04.10.2026, 08:00'],['W drodze na rozładunek','04.10.2026, 09:10'],['Na rozładunku','05.10.2026, 08:55'],['Rozładowane','05.10.2026, 09:15']],journeyDates:["03.10 · 11:00","04.10 · 07:10","04.10 · 08:00","04.10 · 09:10","05.10 · 09:15"]},
    {id:'DEMO-260904',registration:'DEMO 004',fromPostal:"2000",toPostal:"40-001",goods:"Materiały budowlane",packages:"6 palet",weightKg:2100,loadArrival:{"date":"01.10.2026","time":"12:00","window":"12:00–13:00","confirmed":true},unloadArrival:{"date":"02.10.2026","time":"14:10","window":"14:00–15:00","confirmed":true},reference:'AMG-DEMO-04',from:'Antwerpia',fromCountry:'BE',to:'Katowice',toCountry:'PL',status:'Rozładowane',kind:'completed',active:false,step:4,progress:100,documents:[{name:'CMR',kind:'document',detail:'Po rozładunku · demo'},{name:'Faktura',kind:'invoice',detail:'Przykładowy dokument'}],load:'01.10.2026, 12:00',delivery:'02.10.2026',deliveryTime:'14:10',window:'14:00–15:00',vehicle:'Zestaw 13,6 m',cargo:'6 palet · 2 100 kg',events:[['Zlecenie przyjęte','30.09.2026, 10:00'],['Na załadunku','01.10.2026, 12:00'],['W drodze na rozładunek','01.10.2026, 13:20'],['Rozładowane','02.10.2026, 14:10']],journeyDates:["30.09 · 10:00","01.10 · 11:30","01.10 · 12:00","01.10 · 13:20","02.10 · 14:10"]},
    {id:'DEMO-260905',registration:'DEMO 005',fromPostal:"10115",toPostal:"00-001",goods:"Wyposażenie sklepów",packages:"14 palet",weightKg:5400,loadArrival:{"date":"28.09.2026","time":"09:00","window":"09:00–10:00","confirmed":true},unloadArrival:{"date":"29.09.2026","time":"08:45","window":"08:00–10:00","confirmed":true},reference:'AMG-DEMO-05',from:'Berlin',fromCountry:'DE',to:'Warszawa',toCountry:'PL',status:'Rozładowane',kind:'completed',active:false,step:4,progress:100,documents:[{name:'CMR',kind:'document',detail:'Po rozładunku · demo'},{name:'Faktura',kind:'invoice',detail:'Przykładowy dokument'}],load:'28.09.2026, 09:00',delivery:'29.09.2026',deliveryTime:'08:45',window:'08:00–10:00',vehicle:'Zestaw 13,6 m',cargo:'14 palet · 5 400 kg',events:[['Zlecenie przyjęte','27.09.2026, 12:00'],['Na załadunku','28.09.2026, 09:00'],['W drodze na rozładunek','28.09.2026, 10:15'],['Rozładowane','29.09.2026, 08:45']],journeyDates:["27.09 · 12:00","28.09 · 08:20","28.09 · 09:00","28.09 · 10:15","29.09 · 08:45"]},
  ],
  invoices: [
    {id:'DEMO/2026/1042',issued:'02.10.2026',amount:160,due:'16.10.2026',status:'unpaid',points:800,bonus:800,fastUntil:'12.10.2026'},
    {id:'DEMO/2026/1038',issued:'01.10.2026',amount:110,due:'15.10.2026',status:'unpaid',points:550,bonus:550,fastUntil:'11.10.2026'},
    {id:'DEMO/2026/1031',issued:'28.09.2026',amount:225,due:'12.10.2026',status:'paid',points:1125,bonus:1125,paidAt:'04.10.2026'},
    {id:'DEMO/2026/1027',issued:'24.09.2026',amount:140,due:'08.10.2026',status:'paid',points:700,bonus:0,paidAt:'03.10.2026'},
    {id:'DEMO/2026/1022',issued:'22.09.2026',amount:210,due:'06.10.2026',status:'unpaid',points:1050,bonus:0,fastUntil:'02.10.2026'},
    {id:'DEMO/2026/1014',issued:'18.09.2026',amount:100,due:'02.10.2026',status:'paid',points:500,bonus:0,paidAt:'01.10.2026'},
  ],
  rewards: [
    {id:'headphones',name:'Słuchawki bezprzewodowe',detail:'Twój rytm. W trasie i po godzinach.',category:'Elektronika',points:30000,art:'headphones',color:''},
    {id:'speaker',name:'Głośnik przenośny',detail:'Dobry dźwięk, gdziekolwiek jesteś.',category:'Elektronika',points:20000,art:'speaker',color:'blue'},
    {id:'bottle',name:'Kubek termiczny',detail:'Dobra kawa na dłuższą drogę.',category:'Lifestyle',points:8500,art:'bottle',color:'peach'},
    {id:'backpack',name:'Plecak podróżny',detail:'Wszystko, czego potrzebujesz, pod ręką.',category:'Lifestyle',points:18000,art:'backpack',color:''},
    {id:'charger',name:'Ładowarka bezprzewodowa',detail:'Więcej energii na kolejny dzień.',category:'Elektronika',points:12000,art:'charger',color:'peach'},
    {id:'voucher',name:'Voucher na zakupy',detail:'Wybierz coś dla siebie.',category:'Vouchery',points:15000,art:'voucher',color:'blue'},
  ],
};

const VIEWS = {orders:'Zlecenia',tracking:'Podgląd zlecenia',invoices:'Faktury',rewards:'Nagrody',history:'Historia punktów',claims:'Moje nagrody',rules:'Zasady programu'};
let state = {view:'orders',orderStatus:'active',orderSearch:'',selectedOrder:'DEMO-261001',rewardCategory:'Wszystkie',invoiceStatus:'all',search:'',goal:'headphones',mapZoom:1,expandedOrder:null};
let toastTimer;
let modalTrigger;

// Original vector product studies: illustrative placeholders, not a real catalog.
function productArt(kind) {
  const art = {
    headphones: '<ellipse cx="120" cy="166" rx="65" ry="9" fill="#162022" opacity=".12"/><path d="M65 106V79a55 55 0 0 1 110 0v27" fill="none" stroke="#232b2b" stroke-width="18"/><path d="M70 80a50 50 0 0 1 100 0" fill="none" stroke="#606b65" stroke-width="5"/><path d="M67 89v33M173 89v33" stroke="#515d57" stroke-width="10"/><rect x="50" y="95" width="29" height="61" rx="13" fill="#28352e" transform="rotate(-8 64 125)"/><rect x="61" y="98" width="18" height="57" rx="8" fill="#435447" transform="rotate(-8 70 125)"/><rect x="160" y="95" width="29" height="61" rx="13" fill="#28352e" transform="rotate(8 174 125)"/><rect x="160" y="98" width="18" height="57" rx="8" fill="#435447" transform="rotate(8 169 125)"/><path d="M166 112v17" stroke="#839174" stroke-width="2"/><circle cx="174" cy="139" r="2" fill="#c9b497"/>',
    speaker: '<ellipse cx="120" cy="165" rx="58" ry="8" fill="#1c2930" opacity=".12"/><path d="M71 60q49-20 98 0v85q-49 21-98 0Z" fill="#39474d"/><ellipse cx="120" cy="60" rx="49" ry="17" fill="#60717a"/><ellipse cx="120" cy="60" rx="39" ry="12" fill="#34434c"/><path d="M80 77v64M89 80v63M98 82v64M107 84v64M116 85v64M125 85v64M134 84v64M143 82v64M152 80v63M161 77v64" stroke="#83939d" opacity=".45" stroke-width="1.5"/><path d="M150 52c14-19 24-5 19 8" fill="none" stroke="#b88765" stroke-width="5"/><rect x="111" y="116" width="18" height="6" rx="3" fill="#c5cbbb"/>',
    bottle: '<ellipse cx="120" cy="169" rx="37" ry="7" fill="#593b23" opacity=".11"/><path d="M89 48h62l-7 105c-1 20-47 20-48 0Z" fill="#ad683e"/><path d="M96 55h9l-2 94c0 12-5 12-5 0Z" fill="#e7ad83" opacity=".65"/><rect x="85" y="36" width="70" height="17" rx="6" fill="#383b35"/><rect x="93" y="31" width="54" height="10" rx="4" fill="#626257"/><path d="M108 99h24" stroke="#e8c8a7" stroke-width="3"/><path d="M112 109h16" stroke="#e8c8a7" stroke-width="2"/>',
    backpack: '<ellipse cx="120" cy="168" rx="55" ry="8" fill="#162022" opacity=".1"/><path d="M106 46V32h28v14" fill="none" stroke="#606447" stroke-width="7"/><path d="M88 49c5-12 59-12 64 0l11 97c2 26-89 26-86 0Z" fill="#727957"/><path d="M94 52c8-7 45-7 53 0l8 94c2 12-68 12-66 0Z" fill="#8a9470"/><rect x="93" y="107" width="54" height="43" rx="7" fill="#697351"/><path d="M93 117h54M96 62h48" stroke="#c2c4a4" stroke-width="2"/><rect x="113" y="78" width="15" height="9" rx="2" fill="#cfb78e"/><path d="M109 121v5" stroke="#dbcbb0" stroke-width="3"/>',
    charger: '<ellipse cx="119" cy="151" rx="78" ry="12" fill="#5b3b20" opacity=".1"/><path d="M45 112q75-39 150 0v10q-75 41-150 0Z" fill="#5a4b40"/><ellipse cx="120" cy="111" rx="75" ry="32" fill="#aa9b8c"/><ellipse cx="120" cy="110" rx="68" ry="27" fill="#c5b7a6"/><ellipse cx="120" cy="110" rx="35" ry="14" fill="none" stroke="#948475" stroke-width="2"/><path d="m122 95-10 15h10l-6 15 15-17h-10Z" fill="#655447"/><path d="M190 111c23-4 25 11 24 29" fill="none" stroke="#5c5147" stroke-width="4"/>',
    voucher: '<ellipse cx="120" cy="163" rx="73" ry="9" fill="#1b3040" opacity=".1"/><g transform="rotate(-11 120 96)"><rect x="41" y="49" width="158" height="96" rx="12" fill="#25313b"/><path d="M143 50c-20 13-20 28 0 41s20 29 0 53M163 50c-20 13-20 28 0 41s20 29 0 53M183 50c-20 13-20 28 0 41s20 29 0 53" fill="none" stroke="#ff8145" opacity=".48"/><path d="M58 78h38M58 88h26" stroke="#ecece2" stroke-width="5"/><path d="M58 122h37" stroke="#a6aaa4" stroke-width="3"/><circle cx="177" cy="120" r="8" fill="#ff8145"/></g>',
  };
  return `<svg class="product-art" viewBox="0 0 240 190" role="img" aria-label="Ilustracja: ${esc(kind === 'headphones' ? 'słuchawki' : kind === 'speaker' ? 'głośnik' : kind === 'bottle' ? 'kubek termiczny' : kind === 'backpack' ? 'plecak' : kind === 'charger' ? 'ładowarka' : 'voucher')}">${art[kind] || art.headphones}</svg>`;
}

function button(label, action, style='primary', extras='') {
  return `<button class="button button-${style}" data-action="${action}" ${extras}><span>${label}</span><span class="button-circle">${icon('arrow')}</span></button>`;
}


function shell() {
  const active=['orders','tracking'].includes(state.view)?'orders':state.view==='invoices'?'invoices':'rewards';
  const navItem=(view,name,ic)=>`<button class="nav-item ${active===view?'active':''}" data-view="${view}" ${active===view?'aria-current="page"':''}>${icon(ic)}<span>${name}</span></button>`;
  document.getElementById('app').innerHTML=`<div class="shell ${state.view==='orders'&&state.expandedOrder?'has-tracking':''}">
    <header class="topbar"><div class="header-inner">
      <button class="brand" data-view="orders" aria-label="AMG Miles — zlecenia"><img src="assets/amg-logo-white.webp" alt="AMG European Transport"><span class="brand-word">miles<em>.</em></span></button>
      <nav class="primary-nav" aria-label="Nawigacja panelu">${navItem('orders','Zlecenia','truck')}${navItem('invoices','Faktury','invoice')}${navItem('rewards','Nagrody','gift')}</nav>
      <div class="header-actions"><button class="header-points" data-action="open-balance" aria-label="Twoje punkty demonstracyjne: ${number(demoSource.balance.available)}">${icon('spark')}<strong>${number(demoSource.balance.available)}</strong><span>pkt</span></button><button class="contact-button" data-action="contact" aria-label="Kontakt z AMG">${icon('support')}<span>Kontakt z AMG</span></button><span class="header-separator"></span><div class="account-label"><strong>${esc(demoSource.customer.companyName)}</strong><span>Konto demonstracyjne</span></div><span class="avatar" aria-label="Konto demonstracyjne">FP</span></div>
    </div></header>
    <main class="content ${state.view==='orders'?'orders-content':''}" id="main-content" tabindex="-1"><div class="preview-note">Podgląd projektu <span>·</span> wszystkie dane są przykładowe</div><div class="view">${renderView()}</div><footer class="page-footer"><span>© 2026 AMG Trans</span><div><button data-view="rules">Zasady AMG Miles</button><button data-action="about-preview">O podglądzie ${icon('arrow')}</button></div></footer></main>
  </div>`;
  document.title=`${VIEWS[state.view]} · AMG Miles — podgląd`;
}

function pageHead(eyebrow,title,description,cta='') {
  return `<div class="page-head"><div><div class="eyebrow"><span class="little-dot"></span>${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${cta}</div>`;
}

function invoiceTable(items,compact=false) {
  return `<div class="table-wrap"><table aria-label="${compact?'Ostatnie faktury — dane demonstracyjne':'Twoje faktury — dane demonstracyjne'}"><thead><tr><th>Faktura</th><th class="numeric">Kwota netto</th><th>Status</th><th class="numeric">Punkty</th>${compact?'':'<th>Termin płatności</th>'}</tr></thead><tbody>${items.map(i=>`<tr><td><button class="row-detail" data-action="invoice-detail" data-id="${i.id}" aria-label="Szczegóły faktury ${i.id}">${i.id}${icon('arrow')}</button><small>${i.issued}</small></td><td class="numeric">${money(i.amount)}</td><td><span class="status ${i.status==='unpaid'?'amber':''}">${i.status==='paid'?'Opłacona':'Do opłacenia'}</span></td><td class="numeric">${i.status==='paid'?`+${number(i.points+i.bonus)}`:number(i.points)}${i.status==='unpaid'?'<small>po płatności</small>':i.bonus?'<small>w tym bonus 100%</small>':'<small>przyznane</small>'}</td>${compact?'':`<td>${i.due}</td>`}</tr>`).join('')}</tbody></table></div>`;
}

const ORDER_GROUPS=[['active','W realizacji'],['completed','Zakończone'],['all','Wszystkie']];

function operationStage(o) {
  return o.active&&!o.loadArrival.confirmed?'load':'unload';
}

function operationTime(o) {
  const a=operationStage(o)==='load'?o.loadArrival:o.unloadArrival;
  if(!a?.date||!a?.time)return Infinity;
  const [day,month,year]=a.date.split('.').map(Number),[hour,minute]=a.time.split(':').map(Number);
  const value=Date.UTC(year,month-1,day,hour,minute);
  return Number.isFinite(value)?value:Infinity;
}

function ordersInGroup(group,withSearch=true) {
  const query=withSearch?state.orderSearch.trim().toLocaleLowerCase('pl'):'';
  return demoSource.orders.filter(o=>(group==='all'||(group==='active'?o.active:!o.active))&&`${o.id} ${o.reference} ${o.from} ${o.to} ${o.fromCountry} ${o.fromPostal} ${o.toCountry} ${o.toPostal} ${o.goods} ${o.registration}`.toLocaleLowerCase('pl').includes(query)).sort((a,b)=>{
    if(a.active!==b.active)return a.active?-1:1;
    const aTime=operationTime(a),bTime=operationTime(b);
    if(aTime!==bTime)return a.active?aTime-bTime:bTime-aTime;
    return a.reference.localeCompare(b.reference,'pl');
  });
}

function matchingOrders() { return ordersInGroup(state.orderStatus); }

function orderStatus(o) {
  return `<span class="status ${o.kind==='to-loading'?'amber':o.active?'':'neutral'}">${esc(o.status)}</span>`;
}

function orderFilters() {
  return ORDER_GROUPS.map(([key,name])=>`<button class="filter ${state.orderStatus===key?'active':''}" data-action="order-filter" data-id="${key}" aria-pressed="${state.orderStatus===key}">${name}<span>${ordersInGroup(key,false).length}</span></button>`).join('');
}

function routeLocation(city,country,postal) {
  return `<span class='route-code route-address'>${esc(country)} ${esc(postal)}</span><span class='route-city'>${esc(city)}</span>`;
}

function arrivalLabel(o,stage) {
  const arrival=stage==='load'?o.loadArrival:o.unloadArrival;
  return `${arrival.confirmed?'Dojazd':'Przewidywany dojazd'} na ${stage==='load'?'załadunek':'rozładunek'}`;
}

function orderArrivalPanel(o) {
  const arrival=o.unloadArrival;
  return `<div class='arrival-tile order-eta-panel ${arrival.confirmed?'confirmed':''}' data-arrival='unload'><span class='arrival-label'>${arrival.confirmed?'Rozładunek potwierdzony':'ETA na rozładunek'}</span><strong><span class='eta-hour'>${arrival.time}</span><small>${arrival.date}</small></strong><span class='arrival-note'>${arrival.confirmed?'Dojazd potwierdzony':'Godzina szacunkowa'}</span></div>`;
}

function orderCard(o) {
  const compact=Boolean(state.expandedOrder),selected=state.expandedOrder===o.id;
  const arrival=o.unloadArrival;
  if(compact)return `<article class="card order-card compact-card ${o.active?'active-order':'completed-order'} ${selected?'selected':''}" data-order-id="${o.id}" aria-labelledby="order-title-${o.id}"><h2 id="order-title-${o.id}" class="sr-only">${o.from} — ${o.to}</h2><button class="order-option" data-action="order-select" data-id="${o.id}" aria-label="Zlecenie klienta ${o.reference}: ${o.from} — ${o.to}" aria-pressed="${selected}" aria-controls="order-detail">
    <span class="compact-reference">${o.reference}${selected?icon('right'):''}</span>
    <span class='compact-route'><span class='route-location'>${routeLocation(o.from,o.fromCountry,o.fromPostal)}</span><span class='route-divider'>${icon('right')}</span><span class='route-location'>${routeLocation(o.to,o.toCountry,o.toPostal)}</span></span>
    ${orderStatus(o)}
    <span class="compact-cargo">${o.goods} · ${number(o.weightKg)} kg · ${o.packages}</span>
    <span class="compact-bottom"><span class="compact-operation"><small>${arrival.confirmed?'Rozładunek potwierdzony':'ETA na rozładunek'}</small><strong>${arrival.time}</strong><span>${arrival.date}</span></span><span class="compact-plate">${icon('truck')}${o.registration}</span></span>
  </button></article>`;
  return `<article class="card order-card ${o.active?'active-order':'completed-order'}" data-order-id="${o.id}" data-action="order-detail" data-id="${o.id}" aria-labelledby="order-title-${o.id}">
    <div class="order-top">${orderStatus(o)}<div class="order-reference"><span>Numer zlecenia klienta</span><strong>${o.reference}</strong></div><button class="button order-card-action ${o.active?'button-primary':'button-secondary'}" data-action="order-detail" data-id="${o.id}"><span>${o.active?'GPS pojazdu':'Zobacz zlecenie'}</span><span class="button-circle">${icon('arrow')}</span></button></div>
    <h2 id="order-title-${o.id}" class="sr-only">${o.from} — ${o.to}</h2>
    <div class="order-main"><div class='order-journey'><div class='order-route'><div><span class='route-label'>Załadunek</span><h3>${routeLocation(o.from,o.fromCountry,o.fromPostal)}</h3></div><span class='route-connector'>${icon('right')}</span><div><span class='route-label'>Rozładunek</span><h3>${routeLocation(o.to,o.toCountry,o.toPostal)}</h3></div></div>
    <div class="order-cargo"><div class="cargo-goods"><span class='sr-only'>Towar</span><strong>${icon('package')}${o.goods}</strong></div><div class='cargo-meta'><span>${number(o.weightKg)} kg</span><span>${o.packages}</span><span class='cargo-vehicle'>${icon('truck')}<strong class='vehicle-plate'>${o.registration}</strong><small class='vehicle-type'>${o.vehicle}</small></span></div></div></div>${orderArrivalPanel(o)}</div>
  </article>`;
}

function orderResults() {
  const orders=matchingOrders();
  return `${orders.length?orders.map(orderCard).join(''):emptyState('search','Nie ma takich zleceń','Zmień filtr lub wyszukaj inny numer, miasto lub rejestrację.')}<div class="results-count" role="status">${orders.length} z ${demoSource.orders.length} zleceń demonstracyjnych</div>`;
}

function orderWorkspace() {
  const o=demoSource.orders.find(o=>o.id===state.expandedOrder);
  const label=ORDER_GROUPS.find(([key])=>key===state.orderStatus)[1];
  return `<section class="orders-list-pane" aria-label="Lista zleceń"><div class="order-section-head"><h2 id="order-scope-label">${label}</h2><span class="sort-note">${state.orderStatus==='completed'?'Ostatnio zakończone najpierw':'Najbliższa operacja najpierw'}</span></div><div class="order-list" id="order-results">${orderResults()}</div></section>${o?`<section class="order-detail-pane" id="order-detail" role="region" aria-label="Podgląd zlecenia klienta ${o.reference}">${trackingView(o)}</section>`:''}`;
}

function ordersView() {
  return `<section class="orders-page">${pageHead('Twoje transporty z AMG','Twoje <em>zlecenia.</em>','Aktywne transporty według najbliższej operacji. Wybierz zlecenie, aby zobaczyć mapę.',`<div class='company-welcome'><span>Dzień dobry!</span><strong>${esc(demoSource.customer.companyName)}</strong></div>`)}
    <div class="orders-toolbar"><div class="filters" id="order-filters" aria-label="Filtruj zlecenia">${orderFilters()}</div><label class="search-field">${icon('search')}<input id="order-search" type="search" placeholder="Numer, miasto lub rejestracja" aria-label="Szukaj zlecenia po numerze, mieście lub rejestracji" value="${esc(state.orderSearch)}"></label></div>
    <div class="orders-workspace ${state.expandedOrder?'has-selection':''}" id="orders-workspace">${orderWorkspace()}</div>
    <div class="miles-strip"><span class="miles-symbol">${icon('gift')}</span><div><strong>Z AMG każdy kilometr daje więcej.</strong><span>Sprawdź, na co wymienisz swoje punkty Miles.</span></div><button class="text-action" data-view="rewards">Zobacz nagrody ${icon('arrow')}</button></div></section>`;
}

// Schematic illustration only. Production tracking must use the actual map and GPS data.

function mapViewBox() {
  if(state.mapZoom===1)return '0 0 900 550';
  const o=demoSource.orders.find(o=>o.id===state.selectedOrder);
  const width=900/state.mapZoom,height=550/state.mapZoom;
  const center=o?.positionXY||[o?(o.fromXY[0]+o.toXY[0])/2:450,o?(o.fromXY[1]+o.toXY[1])/2:275];
  const x=Math.max(0,Math.min(900-width,center[0]-width/2));
  const y=Math.max(0,Math.min(550-height,center[1]-height/2));
  return `${x} ${y} ${width} ${height}`;
}

function mapControls(expanded=false) {
  return `<div class='map-controls' aria-label='Sterowanie mapą poglądową'><button class='icon-button' data-action='map-zoom-in' aria-label='Przybliż mapę' ${state.mapZoom>=2.4?'disabled':''}>${icon('plus')}</button><button class='icon-button' data-action='map-zoom-out' aria-label='Oddal mapę' ${state.mapZoom<=1?'disabled':''}>${icon('minus')}</button><button class='icon-button' data-action='map-reset' aria-label='Pokaż całą trasę'>${icon('target')}</button>${expanded?'':`<button class='icon-button' data-action='map-expand' aria-label='Powiększ mapę'>${icon('expand')}</button>`}</div>`;
}

function expandedMap() {
  const o=demoSource.orders.find(o=>o.id===state.selectedOrder);
  if(!o?.active)return;
  openDialog('Mapa poglądowa · dane przykładowe',`${o.fromCountry} ${o.fromPostal} ${o.from} → ${o.toCountry} ${o.toPostal} ${o.to}`,`<div class='expanded-map-body'><div class='map-area'>${routeMap(o)}${mapControls(true)}<span class='map-scale'>Schemat trasy</span></div><div class='map-footer'>${icon('pin')}<div><strong>${o.position||'Pozycja GPS niedostępna'}</strong><span>${o.position?`Przykładowa pozycja · ${o.updated}`:'Pokazujemy planowaną trasę, bez pozycji pojazdu.'}</span></div></div></div>`,button('Wróć do zlecenia','close-dialog','secondary'));
  document.getElementById('detail-dialog').classList.add('map-dialog');
}

function routeMap(o) {
  return `<svg class="route-map" viewBox="${mapViewBox()}" role="img" aria-label="Poglądowa mapa demonstracyjnej trasy ${o.from} — ${o.to}. ${o.position?`Pozycja przykładowa: ${o.position}.`:'Brak pozycji GPS. Pokazano planowaną trasę.'}">
    <defs><pattern id="map-grain" width="42" height="42" patternUnits="userSpaceOnUse"><circle cx="9" cy="14" r="1" fill="#889383" opacity=".11"/></pattern><filter id="marker-shadow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#15221e" flood-opacity=".15"/></filter></defs>
    <rect width="900" height="550" fill="#edf0e9"/><path d="M0 0h363l-23 46-58 35-30 52-61 11-17 38-60 30L0 224Z" fill="#dce7e5"/>
    <path d="M176 550 205 476 241 445 244 399 291 371 336 316 390 302 425 261 461 227 489 182 480 131 504 78 530 0M627 0 646 94 625 150 661 211 644 277 677 328 659 381 701 433 722 550M0 361 96 348 183 341 240 310 294 324 339 313 397 324 449 346 465 397 482 437 534 451 579 485 637 499 691 479 736 488 790 485 900 509" fill="none" stroke="#cdd4c8" stroke-width="1.5"/>
    <path d="M700 366 749 370 783 388 804 389 814 377 844 386 874 399 900 397M407 0 404 52 379 88 355 125 342 155 330 192 294 216 262 220" fill="none" stroke="#d1d9d3" stroke-width="2"/>
    <g fill="#dfe6d6" opacity=".65"><path d="m580 40 20 62-43 21-33-17 4-45Z"/><path d="m716 346 81 33-24 61-68-17-24-46Z"/><path d="m127 406 92-39 28 63-84 33-54-26Z"/><path d="m804 25 80 64-37 47-71-51Z"/></g>
    <g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"><path d="M62 304C175 276 231 267 304 249S446 213 500 180 619 132 788 84M112 499C223 439 313 386 394 318S484 255 545 229 701 229 864 181M343 38C384 138 452 223 514 284S603 360 620 429 647 507 664 550M783 0C768 78 739 160 727 207S703 277 752 342 815 444 850 550M0 425C117 407 207 385 313 386S447 366 546 365 732 377 900 365"/></g>
    <g fill="none" stroke="#d9e4e4" stroke-width="2"><path d="M563 0C544 117 576 167 567 232S534 306 580 371 622 439 607 550M283 267C315 317 334 346 314 408S302 469 307 550"/></g>
    <g fill="#8d9789" font-size="14" font-family="Onest, sans-serif" letter-spacing="4"><text x="184" y="359">FRANCJA</text><text x="497" y="216">NIEMCY</text><text x="730" y="207">POLSKA</text><text x="357" y="67" font-size="10" letter-spacing="2">HOLANDIA</text><text x="325" y="202" font-size="10" letter-spacing="2">BELGIA</text><text x="530" y="455" font-size="10" letter-spacing="2">SZWAJCARIA</text><text x="721" y="371" font-size="10" letter-spacing="2">CZECHY</text></g>
    <g fill="#9ca796" font-family="Onest, sans-serif" font-size="12"><circle cx="401" cy="273" r="3"/><text x="411" y="277">Frankfurt</text><circle cx="587" cy="96" r="3"/><text x="598" y="100">Berlin</text><circle cx="230" cy="295" r="3"/><text x="241" y="299">Paris</text><circle cx="683" cy="419" r="3"/><text x="692" y="423">München</text></g>
    <path d="${o.path}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><path d="${o.path}" fill="none" stroke="#aab4a6" stroke-width="5" stroke-linecap="round" stroke-dasharray="6 7"/>
    ${o.traveled?`<path d="${o.traveled}" fill="none" stroke="#e2743d" stroke-width="5" stroke-linecap="round"/>`:''}
    <g fill="#fff" stroke="#273c32" stroke-width="3"><circle cx="${o.fromXY[0]}" cy="${o.fromXY[1]}" r="7"/><circle cx="${o.toXY[0]}" cy="${o.toXY[1]}" r="7"/></g>
    <g font-family="Onest, sans-serif" font-size="19" font-weight="500" fill="#354038"><text x="${o.fromXY[0]+15}" y="${o.fromXY[1]-11}">${o.from}</text><text x="${o.toXY[0]+15}" y="${o.toXY[1]+27}">${o.to}</text></g>
    ${o.positionXY?`<g class='vehicle-marker' transform="translate(${o.positionXY[0]},${o.positionXY[1]})" filter="url(#marker-shadow)"><circle r="37" fill="#ff8145" opacity=".14"/><circle class='vehicle-marker-core' r="26" fill="#202923" stroke="#fff" stroke-width="4"/><g transform="translate(-12,-12)" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">${ICONS.truck}</g><rect x="-61" y="37" width="122" height="31" rx="15.5" fill="#fff"/><text x="0" y="57" text-anchor="middle" font-family="Onest, sans-serif" font-size="14" font-weight="500" fill="#28352d">${o.position.split(',')[0]}</text></g>`: ''}
  </svg>`;
}

function journey(o) {
  const stages=['Przyjęte','W drodze na załadunek','Załadowane','W drodze na rozładunek','Rozładowane'];
  return `<ol class="journey" aria-label="Etapy realizacji zlecenia">${stages.map((label,i)=>{const done=i<o.step||(!o.active&&i===o.step); const current=i===o.step&&o.active;return `<li class="${done?'done':current?'current':'upcoming'}" ${current?'aria-current="step"':''}><span class="step-dot">${done?icon('check'):current?icon('truck'):(i+1)}</span><div><strong>${label}</strong><span>${o.journeyDates[i]||'Przed nami'}</span></div></li>`;}).join('')}</ol>`;
}

function orderDocuments(o) {
  return `<section class="card documents-card" aria-labelledby="documents-title"><div class="card-heading"><div><h2 id="documents-title">Dokumenty zlecenia</h2><p>${o.documents.length?'Dostępne na tym etapie transportu.':'Dodamy je tutaj, gdy będą dostępne.'}</p></div><span class="document-count">${o.documents.length}</span></div>${o.documents.length?`<div class="document-list">${o.documents.map(d=>`<button class="document-button" data-action="document-demo" data-id="${o.id}" data-document="${esc(d.name)}" aria-label="${esc(d.name)}"><span class="document-icon">${icon(d.kind)}</span><span><strong>${d.name}</strong><small>${d.detail}</small></span><span class="document-arrow">${icon('arrow')}</span></button>`).join('')}</div>`:`<div class="document-empty">${icon('document')}<div><strong>Dokumenty w przygotowaniu</strong><span>Obecnie nie ma dokumentów do podglądu.</span></div></div>`}</section>`;
}

function transportDetails(o) {
  const stops=o.stops||[['Załadunek',`${o.from}, ${o.fromCountry}`,o.load],['Rozładunek',`${o.to}, ${o.toCountry}`,`${o.delivery}, ${o.deliveryTime}`]];
  return `<details class="card transport-details"><summary><span>${icon('truck')} Szczegóły transportu</span>${icon('down')}</summary><div class="transport-detail-body"><dl class="transport-facts"><div><dt>Numer zlecenia klienta</dt><dd>${o.reference}</dd></div><div><dt>Numer zlecenia AMG</dt><dd>${o.id}</dd></div><div><dt>Towar</dt><dd>${o.goods}</dd></div><div><dt>Rejestracja auta</dt><dd>${o.registration}</dd></div><div><dt>Pojazd</dt><dd>${o.vehicle}</dd></div><div><dt>Ładunek</dt><dd>${o.cargo}</dd></div></dl><div class="route-points"><h3>Punkty trasy</h3><ol>${stops.map(([label,city,time])=>`<li><span class="route-point-dot"></span><div><small>${label}</small><strong>${city}</strong><span>${time}</span></div></li>`).join('')}</ol></div></div></details>`;
}

function operationPanel(o) {
  const stage=operationStage(o),arrival=stage==='load'?o.loadArrival:o.unloadArrival;
  return `<section class='card delivery-card' aria-label='Dane operacji'><div class='operation-current'><span class='operation-label'>${o.active?'Najbliższa operacja':'Zakończona operacja'}</span><strong class='operation-name'>${stage==='load'?'Załadunek':'Rozładunek'}</strong></div><div class='delivery-estimate'><span>${arrivalLabel(o,stage)}</span><div class='eta-values'><span class='eta-label'>${arrival.confirmed?'Dojazd':'ETA'}</span><strong>${arrival.time}</strong><span class='delivery-date'>${arrival.date}</span></div></div><div class='delivery-window'><span class='operation-label'>Okno ${stage==='load'?'załadunku':'dostawy'} ze zlecenia</span><strong>${arrival.window}</strong></div><div class='delivery-confidence'>${icon('info')}<span>${arrival.confirmed?'Dojazd potwierdzony w danych demonstracyjnych.':o.position?'Godzina szacunkowa. Może się zmienić w trakcie realizacji.':'Godzina szacunkowa według planu. Brak bieżącej pozycji GPS.'}</span></div></section>`;
}

function nextOperationStrip(o) {
  if(!o.active)return '';
  if(operationStage(o)==='unload')return `<section class='card next-operation-strip' aria-label='Następna operacja'><div><span class='next-operation-label'>Następna operacja</span><strong class='next-operation-name'>To ostatnia operacja w zleceniu</strong></div><span class='last-operation-note'>Po rozładunku transport zostanie zakończony.</span></section>`;
  const arrival=o.unloadArrival;
  return `<section class='card next-operation-strip' aria-label='Następna operacja'><div><span class='next-operation-label'>Następna operacja</span><strong class='next-operation-name'>Rozładunek</strong></div><div class='next-operation-place'><strong>${esc(o.toCountry)} ${esc(o.toPostal)}</strong><span>${esc(o.to)}</span></div><div class='next-operation-arrival'><span class='next-arrival-label'>ETA na rozładunek</span><div class='next-arrival-time'><strong>${arrival.time}</strong><small>${arrival.date}</small></div></div></section>`;
}

function vehiclePositionLink(o) {
  const coordinates=o.positionCoordinates;
  const available=Boolean(o.position)&&Array.isArray(coordinates)&&coordinates.length===2&&coordinates.every(Number.isFinite)&&Math.abs(coordinates[0])<=90&&Math.abs(coordinates[1])<=180;
  const label=`${icon('pin')}<span>Link do pozycji pojazdu</span>${icon('arrow')}`;
  if(!available)return `<button class='vehicle-position-link' disabled aria-describedby='vehicle-position-note'>${label}</button>`;
  const url=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates.join(','))}`;
  return `<a class='vehicle-position-link' href='${esc(url)}' target='_blank' rel='noopener noreferrer' aria-describedby='vehicle-position-note'>${label}</a>`;
}

function trackingView(order) {
  const o=order||demoSource.orders.find(item=>item.id===state.selectedOrder);
  const arrival=o.unloadArrival;
  return `<div class='detail-heading'><div><div class='detail-kicker'><div class='detail-current-status'><span>Aktualny status</span>${orderStatus(o)}</div></div><h2 class='detail-route'><span class='route-location'>${routeLocation(o.from,o.fromCountry,o.fromPostal)}</span><span class='route-divider'>${icon('right')}</span><span class='route-location'>${routeLocation(o.to,o.toCountry,o.toPostal)}</span></h2><p><strong>Nr klienta: ${o.reference}</strong><span>Numer AMG: ${o.id}</span></p></div><button class='detail-close' data-action='order-close' aria-label='Wróć do pełnej listy zleceń'>${icon('close')}<span>Pełna lista</span></button></div>
    <section class='card detail-facts' aria-label='Ładunek i pojazd'><div class='detail-goods'><span>${icon('package')} Towar</span><strong>${o.goods}</strong></div><div><span>Waga ładunku</span><strong>${number(o.weightKg)} kg</strong></div><div><span>Ilość palet</span><strong>${o.packages}</strong></div><div class='detail-vehicle'><span>${icon('truck')} Pojazd</span><strong class='vehicle-plate'>${o.registration}</strong><small class='vehicle-type'>${o.vehicle}</small></div></section>
    <div class='tracking-grid'>${operationPanel(o)}<section class='card map-card'><div class='map-heading'><h3>${icon(o.active?'pin':'check')}${o.active?'Pozycja pojazdu':'Dostawa zakończona'}</h3><div class='map-heading-actions'>${o.active?vehiclePositionLink(o):"<span class='demo-tag'>Zlecenie demo</span>"}</div></div>
      ${o.active?`<div class='map-area'>${routeMap(o)}${mapControls()}<span class='map-scale'>Mapa poglądowa · demo</span></div><div class='map-footer'>${icon('pin')}<div><strong>${o.position||'Pozycja GPS niedostępna'}</strong><span id='vehicle-position-note'>${o.position?`Przykładowa pozycja · ${o.updated}`:'Link będzie dostępny po otrzymaniu pozycji GPS. Na mapie jest planowana trasa.'}</span></div></div>`:`<div class='completed-panel'><span class='completion-icon'>${icon('check')}</span><h3>Transport dotarł na miejsce.</h3><p>${o.to} · ${arrival.date}, ${arrival.time}</p><span class='completion-caption'>Dokumenty znajdziesz poniżej.</span></div>`}
    </section></div>
    ${nextOperationStrip(o)}
    <details class='card progress-card'><summary><span>${icon('history')} Historia i etapy realizacji</span>${icon('down')}</summary><div class='progress-body'><div class='card-heading'><h3>Realizacja zlecenia</h3><button class='text-action' data-action='order-history' data-id='${o.id}'>${icon('history')} Historia statusów ${icon('arrow')}</button></div>${journey(o)}${o.active&&o.progress!==null?`<div class='transport-progress'><div><span>Postęp transportu <small>· szacunkowy</small></span><strong>${o.progress}%</strong></div><div class='transport-progress-track' role='progressbar' aria-label='Szacunkowy postęp transportu' aria-valuemin='0' aria-valuemax='100' aria-valuenow='${o.progress}'><span style='width:${o.progress}%'></span></div></div>`:''}</div></details>
    ${orderDocuments(o)}${transportDetails(o)}`;
}

function orderHistory(id) {
  const o=demoSource.orders.find(item=>item.id===id); if(!o)return;
  openDialog('Historia · dane przykładowe',o.id,`<ol class="status-history">${o.events.map(([label,time])=>`<li><span class="history-point"></span><div><strong>${label}</strong><span>${time}</span></div></li>`).join('')}</ol>`,button('Wróć do zlecenia','close-dialog','secondary'));
}

function rewardNav() {
  return `<nav class="reward-nav" aria-label="Program AMG Miles">${[['rewards','Katalog nagród'],['history','Historia punktów'],['claims','Moje nagrody'],['rules','Zasady programu']].map(([key,name])=>`<button data-view="${key}" class="${state.view===key?'active':''}" ${state.view===key?'aria-current="page"':''}>${name}</button>`).join('')}</nav>`;
}

function invoicesView() {
  const filtered = demoSource.invoices.filter(i=>(state.invoiceStatus==='all'||i.status===state.invoiceStatus)&&i.id.toLowerCase().includes(state.search.toLowerCase()));
  return `${pageHead('Twoje rozliczenia','Twoje <em>faktury.</em>','Dokumenty i terminy płatności w jednym miejscu.')}
  <div class="filter-bar"><div class="filters" aria-label="Filtruj faktury">${[['all','Wszystkie',6],['unpaid','Do opłacenia',3],['paid','Opłacone',3]].map(([key,name,count])=>`<button class="filter ${state.invoiceStatus===key?'active':''}" aria-pressed="${state.invoiceStatus===key}" data-action="invoice-filter" data-id="${key}">${name} · ${count}</button>`).join('')}</div><label class="search-field">${icon('search')}<input id="invoice-search" type="search" placeholder="Szukaj numeru faktury" aria-label="Szukaj numeru faktury" value="${esc(state.search)}"></label></div>
  <section class="card" id="invoice-results">${filtered.length?invoiceTable(filtered):emptyState('search','Brak pasujących faktur','Spróbuj innego numeru lub zmień wybrany filtr.')}<div class="table-footer"><span>${filtered.length} z ${demoSource.invoices.length} faktur · dane demonstracyjne</span><span>Kwoty netto w EUR</span></div></section>`;
}

function rewardsView() {
  const rewards=demoSource.rewards.filter(r=>state.rewardCategory==='Wszystkie'||r.category===state.rewardCategory);
  const balance=`<button class="reward-balance" data-action="open-balance" aria-label="Twoje punkty AMG Miles"><span class="balance-symbol">${icon('spark')}</span><span><small>Dostępne punkty · demo</small><strong>${number(demoSource.balance.available)} <small>pkt</small></strong></span>${icon('arrow')}</button>`;
  return `${rewardNav()}${pageHead('Program AMG Miles','Twoje <em>nagrody.</em>','Wybierz coś dla siebie za punkty ze współpracy z AMG.',balance)}
  <div class="filter-bar"><div class="filters" aria-label="Kategorie nagród">${['Wszystkie','Elektronika','Lifestyle','Vouchery'].map(c=>`<button class="filter ${state.rewardCategory===c?'active':''}" data-action="reward-filter" data-id="${c}" aria-pressed="${state.rewardCategory===c}">${c}</button>`).join('')}</div><span style="font-size:10px;color:var(--muted)">Przykładowy katalog do oceny wyglądu</span></div>
  <div class="reward-grid">${rewards.map(r=>`<article class="card reward-card"><div class="reward-art ${r.color}"><span class="reward-category">${r.category}</span>${r.id===state.goal?'<span class="goal-label">Twój cel</span>':''}${productArt(r.art)}</div><div class="reward-body"><h2>${r.name}</h2><p>${r.detail}</p><div class="reward-bottom"><strong>${number(r.points)} <small>pkt</small></strong><button class="icon-button" aria-label="Zobacz nagrodę: ${r.name}" data-action="reward-detail" data-id="${r.id}">${icon('arrow')}</button></div></div></article>`).join('')}</div>`;
}

function historyView() {
  const paid=demoSource.invoices.filter(i=>i.status==='paid');
  return `${rewardNav()}${pageHead('Program AMG Miles','Historia <em>punktów.</em>','Przyznane punkty i bonusy za szybsze płatności.')}
  <section class="card"><div class="card-heading"><div><h2>Październik 2026</h2><p>3 płatności · dane demonstracyjne</p></div><span class="trend">+${number(demoSource.balance.earnedThisMonth)} pkt</span></div><div class="history-list">${paid.map(i=>`<div class="history-row"><div class="history-symbol">${icon(i.bonus?'bolt':'invoice')}</div><div><h3>${i.bonus?'Płatność z bonusem 100%':'Punkty za opłaconą fakturę'}</h3><p>${i.id} · ${i.paidAt}</p></div><div class="history-amount">+${number(i.points+i.bonus)} pkt<small>${i.bonus?`${number(i.points)} bazowe + ${number(i.bonus)} bonusowe`:'punkty bazowe'}</small></div></div>`).join('')}</div></section>`;
}

function emptyState(ic,title,text,action='') {
  return `<div class="empty-state"><div class="empty-icon">${icon(ic)}</div><h2>${title}</h2><p>${text}</p>${action}</div>`;
}

function claimsView() {
  return `${rewardNav()}${pageHead('Twoje nagrody','Moje <em>nagrody.</em>','Status i historia Twoich zamówionych nagród.')}<section class="card">${emptyState('bag','Pierwsza nagroda jeszcze przed Tobą','Wybierz coś dla siebie i ustaw kolejny cel. W tym podglądzie nie składamy zamówień.',button('Przejdź do katalogu','open-rewards'))}</section>`;
}

function rulesView() {
  return `${rewardNav()}${pageHead('Program AMG Miles','Zasady <em>programu.</em>','Jak zdobywać punkty i korzystać z nagród.')}
  <div class="rule-layout"><div><section class="card rule-detail"><h2>${icon('invoice')} Punkty za współpracę</h2><p>Za każde 1 euro netto z opłaconej faktury otrzymujesz 5 punktów AMG Miles.</p><div class="formula"><b>1 <span>EUR</span></b><span>=</span><b>5 <span>PKT</span></b></div></section><section class="card rule-detail"><h2>${icon('bolt')} Szybsza płatność, większy bonus</h2><p>Zasady wyświetlane na aktualnej stronie programu:</p><div class="bonus-row"><span>Płatność do 10 dni od wystawienia</span><strong>+100%</strong></div><div class="bonus-row"><span>Płatność do połowy terminu</span><strong>+30%</strong></div><div class="bonus-row"><span>Punkty bazowe za płatność</span><strong>5 pkt / EUR</strong></div></section><section class="card rule-detail"><h2>${icon('calendar')} Czas na Twoje korzyści</h2><p>Punkty są ważne przez 12 miesięcy od daty przyznania. Datę wygaśnięcia zobaczysz w swoim panelu.</p></section></div><section class="card faq"><h2>Wszystko jasne?</h2><details open><summary>Kiedy pojawią się moje punkty?</summary><p>Po zarejestrowaniu płatności za fakturę w systemie. Punkty są przyznawane automatycznie.</p></details><details><summary>Jak wymienić punkty na nagrody?</summary><p>Zaloguj się, otwórz katalog nagród i wybierz nagrodę. Ten podgląd pozwala obejrzeć interfejs i ustawić przykładowy cel.</p></details><details><summary>Ile trwa realizacja nagrody?</summary><p>Aktualna strona programu podaje zwykle do 14 dni. Docelowy status realizacji będzie pochodził z backendu.</p></details><details><summary>Co oznaczają dane demo?</summary><p>Kwoty, faktury, saldo i katalog w tym projekcie służą wyłącznie do oceny wyglądu. Nie są rzeczywistymi danymi Twojej firmy.</p></details><div style="margin-top:20px">${button('Porozmawiajmy','contact','secondary')}</div></section></div>`;
}

function renderView() {
  return ({orders:ordersView,tracking:trackingView,invoices:invoicesView,rewards:rewardsView,history:historyView,claims:claimsView,rules:rulesView}[state.view]||ordersView)();
}

function navigate(view,focus=true) {
  if (!VIEWS[view]) return;
  state.view=view==='tracking'?'orders':view;
  state.search='';
  state.mapZoom=1;
  state.expandedOrder=null;
  const hash=`#${state.view}`;
  if (window.location.hash!==hash) window.history.pushState(null,'',hash);
  shell();
  window.scrollTo({top:0,behavior:'instant'});
  if(focus) document.getElementById('main-content').focus({preventScroll:true});
}

function refreshOrderContent(resetDetail=false) {
  const listScroll=document.getElementById('order-results')?.scrollTop||0;
  const listScrollLeft=document.getElementById('order-results')?.scrollLeft||0;
  const detailScroll=resetDetail?0:document.getElementById('order-detail')?.scrollTop||0;
  document.getElementById('order-filters').innerHTML=orderFilters();
  const workspace=document.getElementById('orders-workspace');
  workspace.classList.toggle('has-selection',Boolean(state.expandedOrder));
  document.querySelector('.shell').classList.toggle('has-tracking',Boolean(state.expandedOrder));
  workspace.innerHTML=orderWorkspace();
  document.getElementById('order-results').scrollTop=listScroll;
  document.getElementById('order-results').scrollLeft=listScrollLeft;
  const pane=document.getElementById('order-detail');
  if(pane)pane.scrollTop=detailScroll;
}

function selectOrder(id) {
  if(state.expandedOrder===id)return;
  if(!matchingOrders().some(o=>o.id===id))return;
  state.selectedOrder=id;state.expandedOrder=id;state.mapZoom=1;
  const hash=`#tracking/${id}`;
  if(window.location.hash!==hash)window.history.pushState(null,'',hash);
  refreshOrderContent(true);
  window.scrollTo({top:0,behavior:'instant'});
  const trigger=document.querySelector(`.order-option[data-id="${id}"]`);
  if(trigger){trigger.focus({preventScroll:true});trigger.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
}

function closeOrder() {
  const id=state.selectedOrder;
  state.expandedOrder=null;state.mapZoom=1;
  if(window.location.hash!=='#orders')window.history.pushState(null,'','#orders');
  refreshOrderContent(true);
  document.querySelector(`.order-card[data-order-id="${id}"] .order-card-action`)?.focus({preventScroll:true});
}

function openDialog(eyebrow,title,body,actions='') {
  const dialog=document.getElementById('detail-dialog');
  dialog.classList.remove('map-dialog');
  modalTrigger=document.activeElement;
  dialog.innerHTML=`<div class="dialog-heading"><div><div class="eyebrow">${eyebrow}</div><h2 id="dialog-title">${title}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="Zamknij okno">${icon('close')}</button></div>${body}${actions?`<div class="dialog-actions">${actions}</div>`:''}`;
  if(!dialog.open) dialog.showModal();
}

function closeDialog() {
  document.getElementById('detail-dialog').close();
  if(modalTrigger && modalTrigger.isConnected) modalTrigger.focus();
}

function showToast(message) {
  const toast=document.getElementById('toast');
  clearTimeout(toastTimer); toast.textContent=message; toast.classList.add('visible');
  toastTimer=setTimeout(()=>toast.classList.remove('visible'),4200);
}

function rewardDetail(id) {
  const r=demoSource.rewards.find(r=>r.id===id); if(!r)return;
  const missing=Math.max(0,r.points-demoSource.balance.available);
  openDialog('Katalog · nagroda demonstracyjna',r.name,`<div class="dialog-art">${productArt(r.art)}</div><p class="dialog-copy">${r.detail} To przykładowa nagroda przygotowana do oceny identyfikacji wizualnej.</p><div class="dialog-stats"><div class="dialog-stat"><span>Punkty na nagrodę</span><strong>${number(r.points)} pkt</strong></div><div class="dialog-stat"><span>Twoje saldo demo</span><strong>${number(demoSource.balance.available)} pkt</strong></div><div class="dialog-stat"><span>${missing?'Do Twojego celu':'Twój cel'}</span><strong>${missing?`Brakuje ${number(missing)} pkt`:'W zasięgu'}</strong></div></div>`,button(state.goal===id?'Twój obecny cel':'Ustaw jako cel','set-goal','primary',`data-id="${r.id}"`));
}

function invoiceDetail(id) {
  const i=demoSource.invoices.find(x=>x.id===id); if(!i)return;
  openDialog('Faktura · dane demonstracyjne',i.id,`<p class="dialog-copy">Szczegóły przykładowej faktury i naliczania punktów.</p><div class="dialog-stats"><div class="dialog-stat"><span>Kwota netto</span><strong>${money(i.amount)}</strong></div><div class="dialog-stat"><span>Wystawiono</span><strong>${i.issued}</strong></div><div class="dialog-stat"><span>Termin płatności</span><strong>${i.due}</strong></div><div class="dialog-stat"><span>Status</span><span class="status ${i.status==='unpaid'?'amber':''}">${i.status==='paid'?'Opłacona':'Do opłacenia'}</span></div><div class="dialog-stat"><span>Punkty bazowe</span><strong>${number(i.points)} pkt</strong></div>${i.bonus?`<div class="dialog-stat"><span>${i.status==='paid'?'Przyznany bonus':'Potencjalny bonus 100%'}</span><strong>+${number(i.bonus)} pkt</strong></div>`:''}</div><div class="notice">${icon('info')}<span>${i.status==='paid'?'Przykładowa płatność została oznaczona jako opłacona w danych demo.':i.bonus?`W tym przykładzie bonus 100% przy płatności do ${i.fastUntil}. Warunki naliczania zweryfikuje docelowy backend.`:'Przykładowa faktura czeka na płatność. Status docelowo będzie pochodził z systemu rozliczeń.'}</span></div>`,button('Zamknij szczegóły','close-dialog','secondary'));
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action],[data-view]'); if(!target)return;
  if(target.dataset.view) {closeDialog(); navigate(target.dataset.view); return;}
  const {action,id}=target.dataset;
  if(['map-zoom-in','map-zoom-out','map-reset'].includes(action)){
    state.mapZoom=action==='map-reset'?1:Math.max(1,Math.min(2.4,Math.round((state.mapZoom+(action==='map-zoom-in' ? 0.35 : -0.35))*100)/100));
    document.querySelectorAll('.route-map').forEach(map=>map.setAttribute('viewBox',mapViewBox()));
    document.querySelectorAll('[data-action="map-zoom-in"]').forEach(control=>control.disabled=state.mapZoom>=2.4);
    document.querySelectorAll('[data-action="map-zoom-out"]').forEach(control=>control.disabled=state.mapZoom<=1);
  }
  if(action==='map-expand')expandedMap();
  if(action==='open-rewards')navigate('rewards');
  if(action==='order-detail'||action==='order-select')selectOrder(id);
  if(action==='order-close')closeOrder();
  if(action==='order-filter'){
    state.orderStatus=id;
    if(state.expandedOrder&&!matchingOrders().some(o=>o.id===state.expandedOrder)){
      state.expandedOrder=null;state.mapZoom=1;
      if(window.location.hash!=='#orders')window.history.pushState(null,'','#orders');
    }
    refreshOrderContent();
    document.querySelector(`[data-action="order-filter"][data-id="${id}"]`).focus({preventScroll:true});
  }
  if(action==='order-history')orderHistory(id);
  if(action==='document-demo')openDialog('Dokument demonstracyjny',target.dataset.document,`<p class="dialog-copy">To podgląd miejsca, w którym otworzysz dokument lub zdjęcie przypisane do zlecenia. Ten przykład nie zawiera rzeczywistego pliku.</p><div class="dialog-stats"><div class="dialog-stat"><span>Zlecenie</span><strong>${esc(id)}</strong></div><div class="dialog-stat"><span>Dokument</span><strong>${esc(target.dataset.document)} · demo</strong></div></div>`,button('Wróć','close-dialog','secondary'));
  if(action==='reward-filter'){state.rewardCategory=id; shell(); document.querySelector(`[data-action="reward-filter"][data-id="${id}"]`).focus();}
  if(action==='invoice-filter'){state.invoiceStatus=id; shell(); document.querySelector(`[data-action="invoice-filter"][data-id="${id}"]`).focus();}
  if(action==='unpaid-invoices'){state.invoiceStatus='unpaid'; navigate('invoices');}
  if(action==='reward-detail')rewardDetail(id);
  if(action==='invoice-detail')invoiceDetail(id);
  if(action==='set-goal'){state.goal=id;closeDialog();shell();document.querySelector(`[data-action="reward-detail"][data-id="${id}"]`)?.focus();showToast('Cel nagrody ustawiony w tym podglądzie.');}
  if(action==='close-dialog')closeDialog();
  if(action==='open-balance')openDialog('Twoje punkty · dane demo','Twoje punkty AMG Miles.',`<div class="dialog-stats"><div class="dialog-stat"><span>Dostępne punkty</span><strong>${number(demoSource.balance.available)} pkt</strong></div><div class="dialog-stat"><span>Przyznane w październiku</span><strong>+${number(demoSource.balance.earnedThisMonth)} pkt</strong></div><div class="dialog-stat"><span>Wygasają 31.10.2026</span><strong>${number(demoSource.balance.expiring)} pkt</strong></div></div><p class="dialog-copy">To przykładowe saldo służące do oceny wyglądu panelu.</p>`,button('Historia punktów','open-history','secondary'));
  if(action==='open-history'){closeDialog();navigate('history');}
  if(action==='contact')openDialog('AMG Trans · kontakt','Jesteśmy po drodze.',`<p class="dialog-copy">Porozmawiajmy o Twojej współpracy z AMG.</p><div class="dialog-stats"><div class="dialog-stat"><span>E-mail</span><strong>hello@amg-trans.eu</strong></div><div class="dialog-stat"><span>Telefon</span><strong>+48 508 24 5555</strong></div></div><p class="dialog-copy">Dane kontaktowe z aktualnej strony AMG Trans. Ten podgląd nie wysyła wiadomości.</p>`,button('Zamknij','close-dialog','secondary'));
  if(action==='about-preview')openDialog('AMG Miles · projekt wizualny','Nowy kierunek.<br>Ten sam charakter.',`<p class="dialog-copy">Jasny panel oparty na identyfikacji AMG: Onest, grafit, ciepły pomarańcz i przyciski ze strzałką w osobnym kółku.</p><p class="dialog-copy">To niezależny podgląd wyglądu. Zlecenia, trasy, pozycje pojazdów, czasy dostawy, faktury, saldo i nagrody są demonstracyjne. Podłączenie właściwego backendu i przeniesienie do repozytorium dev są osobnym etapem.</p>`,button('Wróć do panelu','close-dialog','secondary'));
});

document.addEventListener('keydown',event=>{
  if(!event.target.matches('.order-option')||!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();
  const orders=matchingOrders(),index=orders.findIndex(o=>o.id===event.target.dataset.id);
  const next=event.key==='Home'?0:event.key==='End'?orders.length-1:Math.max(0,Math.min(orders.length-1,index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)));
  selectOrder(orders[next].id);
});

document.addEventListener('input',event=>{
  if(event.target.id==='order-search'){
    state.orderSearch=event.target.value;
    if(state.expandedOrder&&!matchingOrders().some(o=>o.id===state.expandedOrder)){
      state.expandedOrder=null;state.mapZoom=1;
      if(window.location.hash!=='#orders')window.history.pushState(null,'','#orders');
    }
    refreshOrderContent();return;
  }
  if(event.target.id!=='invoice-search')return;
  state.search=event.target.value;
  const filtered=demoSource.invoices.filter(i=>(state.invoiceStatus==='all'||i.status===state.invoiceStatus)&&i.id.toLowerCase().includes(state.search.toLowerCase()));
  document.getElementById('invoice-results').innerHTML=`${filtered.length?invoiceTable(filtered):emptyState('search','Brak pasujących faktur','Spróbuj innego numeru lub zmień wybrany filtr.')}<div class="table-footer"><span>${filtered.length} z 6 faktur · dane demonstracyjne</span><span>Kwoty netto w EUR</span></div>`;
});
document.getElementById('detail-dialog').addEventListener('cancel',()=>{if(modalTrigger?.isConnected)modalTrigger.focus();});
document.querySelector('.skip-link').addEventListener('click',event=>{
  event.preventDefault();
  const main=document.getElementById('main-content');
  main.focus({preventScroll:true});
  main.scrollIntoView({block:'start'});
});
document.getElementById('detail-dialog').addEventListener('click',event=>{
  if(event.target!==event.currentTarget)return;
  const r=event.currentTarget.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();
});

function applyRoute() {
  if(document.getElementById('detail-dialog').open)closeDialog();
  state.mapZoom=1;
  state.expandedOrder=null;
  const [view,id]=window.location.hash.slice(1).split('/');
  state.view=view==='overview'||view==='tracking'?'orders':VIEWS[view]?view:'orders';
  if(view==='tracking'){
    const order=demoSource.orders.find(o=>o.id===id);
    if(order){
      state.selectedOrder=id;state.expandedOrder=id;state.orderSearch='';
      state.orderStatus=order.active?'active':'completed';
    }
  }
  shell();
}
window.addEventListener('popstate',applyRoute);
applyRoute();
