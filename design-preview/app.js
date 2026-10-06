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
};

const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => new Intl.NumberFormat('pl-PL', {useGrouping:'always'}).format(value);
const money = value => new Intl.NumberFormat('pl-PL', {style:'currency',currency:'EUR'}).format(value);

const demoSource = {
  balance: {available:24850,earnedThisMonth:3450,expiring:2000,expiresAt:'31.10.2026',bonusOpportunity:800},
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

const VIEWS = { overview:'Przegląd', invoices:'Moje faktury', history:'Historia punktów', rewards:'Katalog nagród', orders:'Moje nagrody', rules:'Zasady programu' };
let state = {view:'overview',rewardCategory:'Wszystkie',invoiceStatus:'all',search:'',goal:'headphones'};
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
  const navItem = (view,name,ic,count='') => `<button class="nav-item ${state.view===view?'active':''}" data-view="${view}" ${state.view===view?'aria-current="page"':''}>${icon(ic)}<span>${name}</span>${count?`<span class="nav-count">${count}</span>`:''}</button>`;
  document.getElementById('app').innerHTML = `<div class="shell">
    <button class="nav-scrim" aria-label="Zamknij nawigację" data-action="menu-close"></button>
    <aside class="sidebar" id="primary-navigation" aria-label="Nawigacja panelu">
      <button class="icon-button mobile-nav-close" aria-label="Zamknij menu" data-action="menu-close">${icon('close')}</button>
      <button class="brand" data-view="overview" aria-label="AMG Miles — przegląd"><img src="assets/amg-logo-white.webp" alt="AMG European Transport"><span class="brand-word">miles<em>.</em></span><span class="brand-caption">Współpraca. Z korzyścią.</span></button>
      <div class="nav-label">Twój panel</div><nav class="nav-list" aria-label="Twoje rozliczenia">
        ${navItem('overview','Przegląd','grid')}${navItem('invoices','Moje faktury','invoice',3)}${navItem('history','Historia punktów','history')}
      </nav><div class="nav-label">Twoje korzyści</div><nav class="nav-list" aria-label="Nagrody i program">
        ${navItem('rewards','Katalog nagród','gift')}${navItem('orders','Moje nagrody','bag')}${navItem('rules','Zasady programu','spark')}
      </nav>
      <div class="sidebar-bottom"><div class="help-card">${icon('support')}<strong>Jesteśmy po drodze.</strong><p>Masz pytanie? Porozmawiajmy.</p><button class="help-link" data-action="contact">Skontaktuj się z nami ${icon('arrow')}</button></div>
      <div class="account"><span class="avatar">TF</span><div><strong>Twoja firma</strong><small>Konto demonstracyjne</small></div>${icon('shield')}</div></div>
    </aside>
    <header class="topbar"><button class="icon-button mobile-menu" aria-label="Otwórz nawigację" aria-expanded="false" aria-controls="primary-navigation" data-action="menu">${icon('menu')}</button><button class="mobile-brand" data-view="overview">AMG <em>Miles.</em></button><div class="breadcrumbs">Panel klienta ${icon('chevron')} <strong>${VIEWS[state.view]}</strong></div><div class="top-actions"><span class="demo-pill">Podgląd projektu · dane demo</span><button class="icon-button top-help" aria-label="Pomoc i zasady programu" data-view="rules">${icon('question')}</button><button class="icon-button" aria-label="Powiadomienia" data-action="notifications">${icon('bell')}<span class="notification-dot"></span></button></div></header>
    <main class="content" id="main-content" tabindex="-1"><div class="view">${renderView()}</div><footer class="page-footer"><span>© 2026 AMG Trans. Współpraca, która się opłaca.</span><button data-action="about-preview">Informacje o podglądzie ${icon('arrow')}</button></footer></main>
  </div>`;
}

function pageHead(eyebrow,title,description,cta='') {
  return `<div class="page-head"><div><div class="eyebrow"><span class="little-dot"></span>${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${cta}</div>`;
}

function invoiceTable(items,compact=false) {
  return `<div class="table-wrap"><table aria-label="${compact?'Ostatnie faktury — dane demonstracyjne':'Twoje faktury — dane demonstracyjne'}"><thead><tr><th>Faktura</th><th class="numeric">Kwota netto</th><th>Status</th><th class="numeric">${compact?'Punkty':'Punkty bazowe'}</th>${compact?'':'<th>Termin płatności</th>'}</tr></thead><tbody>${items.map(i=>`<tr><td><button class="row-detail" data-action="invoice-detail" data-id="${i.id}" aria-label="Szczegóły faktury ${i.id}">${i.id}${icon('arrow')}</button><small>${i.issued}</small></td><td class="numeric">${money(i.amount)}</td><td><span class="status ${i.status==='unpaid'?'amber':''}">${i.status==='paid'?'Opłacona':'Do opłacenia'}</span></td><td class="numeric">${i.status==='paid'?`+${number(i.points+i.bonus)}`:number(i.points)}${i.status==='unpaid'?'<small>po płatności</small>':i.bonus?'<small>w tym bonus 100%</small>':'<small>przyznane</small>'}</td>${compact?'':`<td>${i.due}</td>`}</tr>`).join('')}</tbody></table></div>`;
}

function goalCard() {
  const reward = demoSource.rewards.find(r=>r.id===state.goal);
  const progress=Math.min(100,demoSource.balance.available/reward.points*100);
  return `<section class="card goal-card"><div class="card-heading"><h2>Twój kolejny cel</h2><span class="tag">Nagroda demo</span></div><div class="goal-visual">${productArt(reward.art)}<span class="art-caption">ILUSTRACJA PRODUKTU</span></div><div class="goal-body"><div class="goal-title"><div><h3>${reward.name}</h3><small>${number(reward.points)} pkt</small></div>${icon('target')}</div><div class="goal-progress" role="progressbar" aria-label="Postęp do wybranej nagrody" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress)}"><span style="width:${progress}%"></span></div><div class="goal-meta"><span>${number(demoSource.balance.available)} / ${number(reward.points)} pkt</span><strong>${Math.round(progress)}%</strong></div><button class="text-action" data-action="reward-detail" data-id="${reward.id}">${progress<100?`Brakuje ${number(reward.points-demoSource.balance.available)} pkt`:'Cel w Twoim zasięgu'} ${icon('arrow')}</button></div></section>`;
}

function overviewView() {
  const b=demoSource.balance;
  return `${pageHead('Twój panel · 6 października 2026','Współpraca, która<br><em>się opłaca.</em>','Twoje faktury, punkty i nagrody. Wszystko w jednym miejscu.',button('Odkryj nagrody','open-rewards'))}
  <section class="summary-grid" aria-label="Podsumowanie punktów"><div class="balance-card card"><div class="orbit"><span class="orbit-point"></span></div><div class="balance-top"><span>Twoje dostępne punkty</span><span class="tiny-icon">${icon('spark')}</span></div><div class="points">${number(b.available)}<span>pkt</span></div><div class="balance-footer"><span class="trend">${icon('arrow')} +${number(b.earnedThisMonth)} pkt</span><span>w tym miesiącu</span></div></div><div class="card stat-card"><div class="stat-top"><span>Wykorzystaj wkrótce</span>${icon('clock')}</div><div class="stat-value">${number(b.expiring)} <small>pkt</small></div><p>Te punkty wygasną<br>${b.expiresAt}.</p><div class="stat-note">${icon('calendar')} Masz czas na dobrą nagrodę</div></div><div class="card stat-card bonus-card"><div class="stat-top"><span>Szybciej znaczy więcej</span>${icon('bolt')}</div><div class="stat-value">+100<small>%</small></div><p>Zapłać do 10 dni i podwój swoje punkty.</p><button class="stat-note" data-action="invoice-detail" data-id="DEMO/2026/1042">Do zyskania ${number(b.bonusOpportunity)} pkt ${icon('right')}</button></div></section>
  <div class="work-grid"><section class="card"><div class="card-heading"><div><h2>Ostatnie faktury</h2><p>Każda płatność przybliża Cię do nagrody.</p></div><button class="text-action" data-view="invoices">Wszystkie ${icon('arrow')}</button></div>${invoiceTable(demoSource.invoices.slice(0,4),true)}<div class="table-footer"><span>3 faktury czekają na płatność</span><button class="text-action" data-action="unpaid-invoices">Sprawdź faktury ${icon('right')}</button></div></section>${goalCard()}</div>
  <div class="rules-strip"><div class="rule-small"><div class="rule-icon">${icon('invoice')}</div><div><strong>1 euro = 5 punktów</strong><span>Za każdą opłaconą fakturę</span></div></div><div class="rule-small"><div class="rule-icon">${icon('bolt')}</div><div><strong>Do 100% więcej</strong><span>Za szybszą płatność</span></div></div><div class="rule-small"><div class="rule-icon">${icon('calendar')}</div><div><strong>12 miesięcy ważności</strong><span>Od przyznania punktów</span></div></div><button class="text-action" data-view="rules">Zasady ${icon('arrow')}</button></div>`;
}

function invoicesView() {
  const filtered = demoSource.invoices.filter(i=>(state.invoiceStatus==='all'||i.status===state.invoiceStatus)&&i.id.toLowerCase().includes(state.search.toLowerCase()));
  return `${pageHead('Twoje rozliczenia','Moje <em>faktury.</em>','Przejrzyste płatności. Więcej punktów za terminową współpracę.')}
  <div class="filter-bar"><div class="filters" aria-label="Filtruj faktury">${[['all','Wszystkie',6],['unpaid','Do opłacenia',3],['paid','Opłacone',3]].map(([key,name,count])=>`<button class="filter ${state.invoiceStatus===key?'active':''}" aria-pressed="${state.invoiceStatus===key}" data-action="invoice-filter" data-id="${key}">${name} · ${count}</button>`).join('')}</div><label class="search-field">${icon('search')}<input id="invoice-search" type="search" placeholder="Szukaj numeru faktury" aria-label="Szukaj numeru faktury" value="${esc(state.search)}"></label></div>
  <section class="card" id="invoice-results">${filtered.length?invoiceTable(filtered):emptyState('search','Brak pasujących faktur','Spróbuj innego numeru lub zmień wybrany filtr.')}<div class="table-footer"><span>${filtered.length} z ${demoSource.invoices.length} faktur · dane demonstracyjne</span><span>Kwoty netto w EUR</span></div></section>`;
}

function rewardsView() {
  const rewards=demoSource.rewards.filter(r=>state.rewardCategory==='Wszystkie'||r.category===state.rewardCategory);
  return `${pageHead('Twoje korzyści','Dobra współpraca.<br><em>Dobre nagrody.</em>','Wybierz kolejny cel i zobacz, jak blisko już jesteś.',button(`${number(demoSource.balance.available)} pkt`,'open-balance','secondary'))}
  <div class="filter-bar"><div class="filters" aria-label="Kategorie nagród">${['Wszystkie','Elektronika','Lifestyle','Vouchery'].map(c=>`<button class="filter ${state.rewardCategory===c?'active':''}" data-action="reward-filter" data-id="${c}" aria-pressed="${state.rewardCategory===c}">${c}</button>`).join('')}</div><span style="font-size:10px;color:var(--muted)">Przykładowy katalog do oceny wyglądu</span></div>
  <div class="reward-grid">${rewards.map(r=>`<article class="card reward-card"><div class="reward-art ${r.color}"><span class="reward-category">${r.category}</span>${productArt(r.art)}</div><div class="reward-body"><h2>${r.name}</h2><p>${r.detail}</p><div class="reward-bottom"><strong>${number(r.points)} <small>pkt</small></strong><button class="icon-button" aria-label="Zobacz nagrodę: ${r.name}" data-action="reward-detail" data-id="${r.id}">${icon('arrow')}</button></div></div></article>`).join('')}</div>`;
}

function historyView() {
  const paid=demoSource.invoices.filter(i=>i.status==='paid');
  return `${pageHead('Twoja aktywność','Każdy punkt<br><em>ma swoją historię.</em>','Zobacz przyznane punkty i bonusy za szybsze płatności.')}
  <section class="card"><div class="card-heading"><div><h2>Październik 2026</h2><p>3 płatności · dane demonstracyjne</p></div><span class="trend">+${number(demoSource.balance.earnedThisMonth)} pkt</span></div><div class="history-list">${paid.map(i=>`<div class="history-row"><div class="history-symbol">${icon(i.bonus?'bolt':'invoice')}</div><div><h3>${i.bonus?'Płatność z bonusem 100%':'Punkty za opłaconą fakturę'}</h3><p>${i.id} · ${i.paidAt}</p></div><div class="history-amount">+${number(i.points+i.bonus)} pkt<small>${i.bonus?`${number(i.points)} bazowe + ${number(i.bonus)} bonusowe`:'punkty bazowe'}</small></div></div>`).join('')}</div></section>`;
}

function emptyState(ic,title,text,action='') {
  return `<div class="empty-state"><div class="empty-icon">${icon(ic)}</div><h2>${title}</h2><p>${text}</p>${action}</div>`;
}

function ordersView() {
  return `${pageHead('Twoje nagrody','Coś dobrego<br><em>jest przed Tobą.</em>','Tutaj znajdziesz status i historię zamówionych nagród.')}<section class="card">${emptyState('bag','Pierwsza nagroda jeszcze przed Tobą','Wybierz coś dla siebie i ustaw kolejny cel. W tym podglądzie nie składamy zamówień.',button('Przejdź do katalogu','open-rewards'))}</section>`;
}

function rulesView() {
  return `${pageHead('Program AMG Miles','Proste zasady.<br><em>Konkretny zysk.</em>','Płać za faktury, zbieraj punkty i wybieraj nagrody.')}
  <div class="rule-layout"><div><section class="card rule-detail"><h2>${icon('invoice')} Punkty za współpracę</h2><p>Za każde 1 euro netto z opłaconej faktury otrzymujesz 5 punktów AMG Miles.</p><div class="formula"><b>1 <span>EUR</span></b><span>=</span><b>5 <span>PKT</span></b></div></section><section class="card rule-detail"><h2>${icon('bolt')} Szybsza płatność, większy bonus</h2><p>Zasady wyświetlane na aktualnej stronie programu:</p><div class="bonus-row"><span>Płatność do 10 dni od wystawienia</span><strong>+100%</strong></div><div class="bonus-row"><span>Płatność do połowy terminu</span><strong>+30%</strong></div><div class="bonus-row"><span>Punkty bazowe za płatność</span><strong>5 pkt / EUR</strong></div></section><section class="card rule-detail"><h2>${icon('calendar')} Czas na Twoje korzyści</h2><p>Punkty są ważne przez 12 miesięcy od daty przyznania. Datę wygaśnięcia zobaczysz w swoim panelu.</p></section></div><section class="card faq"><h2>Wszystko jasne?</h2><details open><summary>Kiedy pojawią się moje punkty?</summary><p>Po zarejestrowaniu płatności za fakturę w systemie. Punkty są przyznawane automatycznie.</p></details><details><summary>Jak wymienić punkty na nagrody?</summary><p>Zaloguj się, otwórz katalog nagród i wybierz nagrodę. Ten podgląd pozwala obejrzeć interfejs i ustawić przykładowy cel.</p></details><details><summary>Ile trwa realizacja nagrody?</summary><p>Aktualna strona programu podaje zwykle do 14 dni. Docelowy status realizacji będzie pochodził z backendu.</p></details><details><summary>Co oznaczają dane demo?</summary><p>Kwoty, faktury, saldo i katalog w tym projekcie służą wyłącznie do oceny wyglądu. Nie są rzeczywistymi danymi Twojej firmy.</p></details><div style="margin-top:20px">${button('Porozmawiajmy','contact','secondary')}</div></section></div>`;
}

function renderView() {
  return ({overview:overviewView,invoices:invoicesView,rewards:rewardsView,history:historyView,orders:ordersView,rules:rulesView}[state.view]||overviewView)();
}

function navigate(view,focus=true) {
  if (!VIEWS[view]) return;
  state.view=view;
  state.search='';
  const hash=`#${view}`;
  if (window.location.hash!==hash) window.history.pushState(null,'',hash);
  shell();
  window.scrollTo({top:0,behavior:'instant'});
  if(focus) document.getElementById('main-content').focus({preventScroll:true});
}

function openDialog(eyebrow,title,body,actions='') {
  const dialog=document.getElementById('detail-dialog');
  modalTrigger=document.activeElement;
  dialog.innerHTML=`<div class="dialog-heading"><div><div class="eyebrow">${eyebrow}</div><h2 id="dialog-title">${title}</h2></div><button class="icon-button" data-action="close-dialog" aria-label="Zamknij okno">${icon('close')}</button></div>${body}${actions?`<div class="dialog-actions">${actions}</div>`:''}`;
  if(!dialog.open) dialog.showModal();
}

function closeDialog() {
  document.getElementById('detail-dialog').close();
  if(modalTrigger && modalTrigger.isConnected) modalTrigger.focus();
}

function setMenuOpen(open) {
  document.querySelector('.shell').classList.toggle('nav-open',open);
  document.querySelector('.mobile-menu').setAttribute('aria-expanded',String(open));
  document.querySelector('.topbar').inert=open;
  document.getElementById('main-content').inert=open;
  const nav=document.querySelector('.sidebar');
  if(open){nav.setAttribute('role','dialog');nav.setAttribute('aria-modal','true');document.querySelector('.mobile-nav-close').focus();}
  else{nav.removeAttribute('role');nav.removeAttribute('aria-modal');document.querySelector('.mobile-menu').focus();}
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
  if(action==='open-rewards')navigate('rewards');
  if(action==='menu'||action==='menu-close'){
    const open=action==='menu'&&!document.querySelector('.shell').classList.contains('nav-open');
    setMenuOpen(open);
  }
  if(action==='reward-filter'){state.rewardCategory=id; shell(); document.querySelector(`[data-action="reward-filter"][data-id="${id}"]`).focus();}
  if(action==='invoice-filter'){state.invoiceStatus=id; shell(); document.querySelector(`[data-action="invoice-filter"][data-id="${id}"]`).focus();}
  if(action==='unpaid-invoices'){state.invoiceStatus='unpaid'; navigate('invoices');}
  if(action==='reward-detail')rewardDetail(id);
  if(action==='invoice-detail')invoiceDetail(id);
  if(action==='set-goal'){state.goal=id;closeDialog();showToast('Cel ustawiony w podglądzie. Zobacz go w Przeglądzie.');}
  if(action==='close-dialog')closeDialog();
  if(action==='open-balance')openDialog('Twoje punkty · dane demo','Dobra współpraca.<br>Dobre saldo.',`<div class="dialog-stats"><div class="dialog-stat"><span>Dostępne punkty</span><strong>${number(demoSource.balance.available)} pkt</strong></div><div class="dialog-stat"><span>Przyznane w październiku</span><strong>+${number(demoSource.balance.earnedThisMonth)} pkt</strong></div><div class="dialog-stat"><span>Wygasają 31.10.2026</span><strong>${number(demoSource.balance.expiring)} pkt</strong></div></div><p class="dialog-copy">To przykładowe saldo służące do oceny wyglądu panelu.</p>`,button('Historia punktów','open-history','secondary'));
  if(action==='open-history'){closeDialog();navigate('history');}
  if(action==='notifications')openDialog('Powiadomienia · przykładowe','Bądź na bieżąco.',`<div class="history-row"><div class="history-symbol">${icon('bolt')}</div><div><h3>Nowe punkty za szybką płatność</h3><p>+2 250 pkt · przykładowe powiadomienie</p></div></div><div class="history-row"><div class="history-symbol">${icon('clock')}</div><div><h3>Wykorzystaj punkty do końca miesiąca</h3><p>2 000 pkt wygasa 31.10.2026 · dane demo</p></div></div>`,button('Przejdź do historii','open-history','secondary'));
  if(action==='contact')openDialog('AMG Trans · kontakt','Jesteśmy po drodze.',`<p class="dialog-copy">Porozmawiajmy o Twojej współpracy z AMG.</p><div class="dialog-stats"><div class="dialog-stat"><span>E-mail</span><strong>hello@amg-trans.eu</strong></div><div class="dialog-stat"><span>Telefon</span><strong>+48 508 24 5555</strong></div></div><p class="dialog-copy">Dane kontaktowe z aktualnej strony AMG Trans. Ten podgląd nie wysyła wiadomości.</p>`,button('Zamknij','close-dialog','secondary'));
  if(action==='about-preview')openDialog('AMG Miles · projekt wizualny','Nowy kierunek.<br>Ten sam charakter.',`<p class="dialog-copy">Jasny panel oparty na identyfikacji AMG: Onest, grafit, ciepły pomarańcz i przyciski ze strzałką w osobnym kółku.</p><p class="dialog-copy">To niezależny podgląd wyglądu. Faktury, saldo, nagrody i powiadomienia są demonstracyjne. Podłączenie właściwego backendu i przeniesienie do repozytorium dev są osobnym etapem.</p>`,button('Wróć do panelu','close-dialog','secondary'));
});

document.addEventListener('input',event=>{
  if(event.target.id!=='invoice-search')return;
  state.search=event.target.value;
  const filtered=demoSource.invoices.filter(i=>(state.invoiceStatus==='all'||i.status===state.invoiceStatus)&&i.id.toLowerCase().includes(state.search.toLowerCase()));
  document.getElementById('invoice-results').innerHTML=`${filtered.length?invoiceTable(filtered):emptyState('search','Brak pasujących faktur','Spróbuj innego numeru lub zmień wybrany filtr.')}<div class="table-footer"><span>${filtered.length} z 6 faktur · dane demonstracyjne</span><span>Kwoty netto w EUR</span></div>`;
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&document.querySelector('.shell.nav-open')){
    setMenuOpen(false);
  }
  if(event.key==='Tab'&&document.querySelector('.shell.nav-open')){
    const buttons=Array.from(document.querySelectorAll('.sidebar button')).filter(b=>b.getClientRects().length);
    const first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
document.getElementById('detail-dialog').addEventListener('click',event=>{
  if(event.target!==event.currentTarget)return;
  const r=event.currentTarget.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();
});
window.addEventListener('popstate',()=>{const v=window.location.hash.slice(1);if(VIEWS[v]){state.view=v;state.search='';shell();}});
const initialView=window.location.hash.slice(1);if(VIEWS[initialView])state.view=initialView;
shell();
