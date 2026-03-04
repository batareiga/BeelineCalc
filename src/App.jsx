import { useState, useEffect, useMemo } from "react";

// ─── TARIFF DATA ──────────────────────────────────────────────────────────────

const TARIFFS = [
  { id:"super",      name:"bee SUPER",       tag:"Народный хит",            color:"#FF5C2E", emoji:"🔥",
    gb:100,  min:700,  sms:true,  price:700,  priceFull:700,  pT:210,  disc:70,  badge:"ХИТ",   hasMnp:true,
    b:{ h:"Звонки, кино и соцсети — ничего не кончится", p:["700 мин = 11 часов разговоров с близкими","100 ГБ = 40 фильмов в HD за месяц","Билайн платит за ваши входящие звонки"] },
    s:{ h:"50+50 ГБ · 700 мин · 1 млн SMS",          p:["50 ГБ пакет + 50 ГБ для мессенджеров","∞ звонков на Билайн России","−70% на год при переносе номера"] } },
  { id:"hit",        name:"bee HIT",         tag:"Честный терабайт",        color:"#F59E0B", emoji:"⚡",
    gb:1024, min:9999, sms:true,  price:750,  priceFull:750,  pT:225,  disc:70,  badge:"ВЫГОДА",hasMnp:true,
    b:{ h:"Настоящий ТБ и звонки без лимита навсегда", p:["1 ТБ — не «до 1 ТБ», а именно 1 ТБ","Звони куда угодно каждый день без лимита","70% скидка — год за четверть цены"] },
    s:{ h:"1 024 ГБ · ∞ мин · 1 млн SMS",            p:["1 024 ГБ без снижения скорости","∞ мин на все мобильные и городские РФ","−70% при MNP на 12 месяцев"] } },
  { id:"planb",      name:"план б",          tag:"Нейронки без VPN",        color:"#818CF8", emoji:"🤖",
    gb:100,  gbB:1024, min:50,   sms:false, price:650,  priceFull:650,  pT:650,  disc:0,   badge:"AI",    hasMnp:false,
    b:{ h:"Netflix, ChatGPT, Spotify — без VPN",      p:["Ушедшие сервисы открываются как ни в чём не бывало","1 ТБ трафика внутри нейросетей и AI","Никаких VPN и обходных путей"] },
    s:{ h:"100 ГБ + 1 ТБ AI-трафика · 50 мин",       p:["100 ГБ + 1 024 ГБ внутри AI-платформ","Безлимит: Netflix, Spotify, ChatGPT, Midjourney","Доступ к заблокированным платформам"] } },
  { id:"multi",      name:"bee MULTI",       tag:"Для планшета",            color:"#2DD4BF", emoji:"📱",
    gb:100,  min:100,  sms:true,  price:650,  priceFull:650,  pT:195,  disc:70,  badge:null,    hasMnp:true,
    b:{ h:"Планшет онлайн — даже без Wi-Fi",           p:["100 ГБ специально для большого экрана","Работает в минусе — не отключится в нужный момент","195₽/мес первый год при переносе"] },
    s:{ h:"50+50 ГБ · 100 мин · 1 млн SMS",           p:["50 ГБ + 50 ГБ для мессенджеров","∞ звонков на Билайн России","−70% на год при переносе номера"] } },
  { id:"combo",      name:"Би Комбо",        tag:"Дом + телефон",           color:"#34D399", emoji:"🏠",
    gb:50,   min:400,  sms:false, price:590,  priceFull:590,  pT:295,  disc:50,  badge:"−50%",  hasMnp:false, isCombo:true,
    b:{ h:"Домашний + мобильный вдвое дешевле",        p:["−50% на мобильную связь 4 месяца","Один оператор — одна поддержка — один платёж","Подключаешь дома Билайн — телефон дешевеет"] },
    s:{ h:"50 ГБ · 400 мин · −50% с домашним",        p:["Скидка 50% при наличии домашнего тарифа","50 ГБ + 400 мин включены","Безлимиты на мессенджеры и соцсети"] } },
  { id:"max",        name:"bee MAX",         tag:"AI подберёт пакет",       color:"#E879F9", emoji:"✨",
    gb:1024, min:2000, sms:true,  price:1000, priceFull:1000, pT:300,  disc:70,  badge:"SMART", hasMnp:true,
    b:{ h:"Максимум сейчас — экономия потом через AI", p:["4 месяца всё включено без ограничений","AI анализирует расход и снижает цену","2 000 мин — точно ничего не кончится"] },
    s:{ h:"1 024 ГБ · 2 000 мин · AI-оптимизация",   p:["Оплати 1 200₽ сразу за 4 мес = 300₽/мес","После 4 мес AI пересчитает под реальный расход","−70% при MNP на 12 месяцев"] } },
  { id:"max4",       name:"bee MAX",         tag:"Абонемент на 4 месяца",  color:"#E879F9", emoji:"🎯",
    gb:1024, min:2000, sms:true,  price:300,  priceFull:1000, pT:300,  disc:70,  badge:"−70%",  hasMnp:true, isMax4:true,
    b:{ h:"Всё самое важное без ограничений на 4 месяца", p:["1 ТБ интернета и 2 000 минут","Безлимит на мессенджеры, видео, соцсети и музыку","После 4 месяцев переходи на тариф дешевле","Только здесь доступен Красивый номер"] },
    s:{ h:"1 024 ГБ · 2 000 мин · 1 млн SMS",           p:["Безлимитные звонки на Билайн России","Звонки по Wi-Fi и защита от спама","Оплата сервисов и подписок с баланса"] } },
  { id:"plusy",      name:"С Плюсами",       tag:"Яндекс экосистема",       color:"#FCD34D", emoji:"🎵",
    gb:1024, min:500,  sms:false, price:1290, priceFull:1290, pT:1290, disc:0,   badge:"ЯНДЕКС",hasMnp:false,
    b:{ h:"Музыка, кино, такси — один платёж",         p:["Яндекс Плюс уже включён в стоимость","1 ТБ хватит на весь Кинопоиск","Плюс компенсирует часть стоимости тарифа"] },
    s:{ h:"1 024 ГБ · 500 мин · Яндекс Плюс",        p:["Яндекс Плюс: Музыка, Кино, Такси, Маркет","1 024 ГБ интернета в месяц","500 мин на любые номера России"] } },
  { id:"cashback",   name:"С кешбэком 9%",  tag:"Деньги возвращаются",    color:"#C084FC", emoji:"💰",
    gb:50,   min:400,  sms:false, price:590,  priceFull:590,  pT:590,  disc:0,   badge:"9%",    hasMnp:false,
    b:{ h:"Платишь за связь — часть денег возвращается",p:["9% кешбэк — ~53₽ обратно каждый месяц","Деньгами, а не баллами — тратишь где хочешь","Пятёрочка, Перекрёсток, Карусель"] },
    s:{ h:"50 ГБ · 400 мин · 9% кешбэк X5",          p:["9% кешбэк через сервис «Пакет» X5 Group","50 ГБ интернета + 400 минут","Безлимиты на соцсети и мессенджеры"] } },
  { id:"kids",       name:"план б. kids",   tag:"Детский тариф",           color:"#F472B6", emoji:"🧒",
    gb:20,   min:100,  sms:false, price:570,  priceFull:570,  pT:570,  disc:0,   badge:"KIDS",  hasMnp:false,
    b:{ h:"Ребёнок онлайн — родители спокойны",        p:["Безопасные нейронки для учёбы без взрослого","Родительский контроль встроен — не нужно настраивать","Подарки и бонусы каждый месяц"] },
    s:{ h:"20 ГБ · 100 мин · Детский фильтр",         p:["20 ГБ с фильтром нежелательного контента","100 мин + безлимит на номера семьи","Безопасные AI-инструменты для учёбы"] } },
];

const OFFERS = [
  { id:"transfer",  icon:"🔄", t:"Перенос номера −70%",         tag:"MNP",             color:"#FFE300", desc:"Переноси свой номер из любого оператора — скидка 70% на большинство тарифов на весь первый год. Номер сохраняется." },
  { id:"combo",     icon:"⚡", t:"Комбо: дом + телефон −50%",   tag:"−50% на 4 мес",   color:"#34D399", desc:"Подключи домашний интернет Билайн — и мобильная связь обойдётся вдвое дешевле на первые 4 месяца." },
  { id:"beautiful", icon:"✦", t:"Красивый номер",               tag:"С Абонементом",   color:"#FFE300", desc:"Запоминающийся номер навсегда. Доступен исключительно в связке с тарифом Абонемент." },
  { id:"abonement", icon:"📋", t:"Абонемент → дешевле потом",   tag:"Гибкость",         color:"#FFE300", desc:"Оплатил год — забыл о платёжках. После окончания переходи на тариф дешевле по фактическому расходу." },
  { id:"film",      icon:"🎬", t:"Плёнка + скидка на Абонемент", tag:"Акция",           color:"#60A5FA", desc:"Купи защитную плёнку в салоне — получи скидку на тариф Абонемент." },
  { id:"setup",     icon:"⚙️", t:"Настройка + скидка",          tag:"В салоне",         color:"#FCD34D", desc:"Услуга настройки телефона в салоне даёт дополнительную скидку при подключении Абонемента." },
  { id:"incoming",  icon:"📞", t:"Билайн платит за входящие",   tag:"На тарифах bee",   color:"#FF5C2E", desc:"На линейке bee оператор сам оплачивает входящие звонки с других сетей. Ваш баланс не расходуется." },
  { id:"kids",      icon:"🧒", t:"Детский тариф bee",           tag:"570₽/мес",         color:"#F472B6", desc:"план б. kids: 20 ГБ, 100 мин, безопасные нейросети для учёбы, родительский контроль и подарки." },
  { id:"ai",        icon:"🤖", t:"план б: нейронки без VPN",    tag:"1 ТБ для AI",      color:"#818CF8", desc:"ChatGPT, Netflix, Spotify — 1 ТБ трафика внутри AI-сервисов без VPN. Законно и быстро." },
  { id:"sim",       icon:"💳", t:"SIM с пополнением в день",    tag:"Сразу на счёте",   color:"#34D399", desc:"При заказе SIM можно сразу пополнить баланс. Деньги приходят в день подключения. Уточните у менеджера." },
  { id:"novpn",     icon:"🌐", t:"Netflix и Spotify без VPN",   tag:"план б",           color:"#C084FC", desc:"Netflix, Spotify, Ticketmaster и другие ушедшие платформы открываются напрямую без VPN." },
];

// ─── SCORE ───────────────────────────────────────────────────────────────────

function scoreT(t, p) {
  let s = 40;
  const gbTotal = (t.gb||0) + (t.gbB||0);
  const m = t.min === 9999 ? 99999 : t.min;
  const eff = p.mnp && t.hasMnp ? t.pT : p.combo && t.isCombo ? t.pT : t.price;

  // GB fit
  const gbRatio = Math.min(gbTotal, p.gb * 2) / (p.gb || 1);
  s += gbTotal >= p.gb ? 20 : -Math.min(20, (p.gb - gbTotal) * 0.25);

  // Minutes fit
  s += m >= p.min ? 15 : -Math.min(15, (p.min - m) * 0.05);

  // Budget fit
  s += eff <= p.budget ? 20 : -Math.min(25, (eff - p.budget) * 0.08);

  // Profile bonuses
  if (p.mnp && t.hasMnp)           s += 12;
  if (p.ai && (t.id==="planb"||t.id==="max"||t.id==="max4")) s += 18;
  if (p.yandex && t.id==="plusy")   s += 22;
  if (p.cash && t.id==="cashback")  s += 22;
  if (p.combo && t.id==="combo")    s += 22;
  if (p.kids && t.id==="kids")      s += 28;
  if (p.tablet && t.id==="multi")   s += 22;
  if (p.mnp && t.isMax4)            s += 15;

  return Math.max(0, Math.min(100, s));
}

function getEff(t, p) {
  if (p.mnp && t.hasMnp) return t.pT;
  if (p.combo && t.isCombo) return t.pT;
  if (t.isMax4) return t.price;
  return t.price;
}

function gbLabel(n) { return n >= 1000 ? `${(n/1024)|0} ТБ` : `${n} ГБ`; }
function minLabel(n) { return n >= 9999 ? "∞ мин" : `${n} мин`; }

// ─── BEAUTIFUL NUMBER GENERATOR ──────────────────────────────────────────────

function generateBeautifulNumbers(count = 6) {
  const patterns = [
    // XX-XX-XX (одинаковые пары)
    () => {
      const d = Math.floor(Math.random() * 9) + 1;
      return `${d}${d}-${d}${d}-${d}${d}`;
    },
    // XX-XX-YY (две пары)
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      return `${a}${a}-${b}${b}-${a}${b}`;
    },
    // XXX-XX-X (три одинаковые)
    () => {
      const d = Math.floor(Math.random() * 9) + 1;
      const r = Math.floor(Math.random() * 9) + 1;
      return `${d}${d}${d}-${r}${r}-${d}`;
    },
    // По возрастанию/убыванию
    () => {
      const start = Math.floor(Math.random() * 5) + 1;
      const asc = Math.random() > 0.5;
      const nums = [];
      for (let i = 0; i < 6; i++) {
        nums.push(asc ? start + i : start + 5 - i);
      }
      return `${nums[0]}${nums[1]}-${nums[2]}${nums[3]}-${nums[4]}${nums[5]}`;
    },
    // Зеркальные
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const c = Math.floor(Math.random() * 9) + 1;
      return `${a}${b}${c}-${c}${b}${a}`;
    },
    // Счастливые (сумма первой половины = сумме второй)
    () => {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const c = Math.floor(Math.random() * 9) + 1;
      const sum = a + b + c;
      const d = Math.floor(Math.random() * Math.min(sum, 9)) + 1;
      const e = Math.floor(Math.random() * Math.min(sum - d, 9)) + 1;
      const f = sum - d - e;
      if (f >= 0 && f <= 9) {
        return `${a}${b}${c}-${d}${e}${f}`;
      }
      return `${a}${a}-${b}${b}-${c}${c}`;
    },
  ];

  const result = [];
  for (let i = 0; i < count; i++) {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    result.push(pattern());
  }
  return result;
}

// ─── SCRIPT GENERATOR ────────────────────────────────────────────────────────

function buildScript(tariff, offers, prefs, lang) {
  if (!tariff) return null;
  const eff = getEff(tariff, prefs);
  const activeO = OFFERS.filter(o => offers.includes(o.id));
  const hasDisc = eff < tariff.price;

  const lines = [];
  lines.push(`«Смотрите, под ваши задачи я бы порекомендовал тариф **${tariff.name}**.`);

  if (lang === "b") {
    lines.push(tariff.b.h + ".");
    lines.push(tariff.b.p[0] + ".");
    if (tariff.b.p[1]) lines.push(tariff.b.p[1] + ".");
  } else {
    lines.push(tariff.s.p[0] + ".");
    if (tariff.s.p[1]) lines.push(tariff.s.p[1] + ".");
  }

  if (hasDisc) {
    lines.push(`По цене выходит **${eff}₽/мес** — это уже с вашей скидкой ${tariff.disc}% за перенос номера. Обычная цена ${tariff.price}₽.`);
  } else {
    lines.push(`Стоимость — **${eff}₽/мес**.`);
  }

  if (activeO.length > 0) {
    lines.push(`\nА ещё есть несколько вещей, которые сделают подключение ещё выгоднее:`);
    activeO.slice(0,3).forEach(o => {
      lines.push(`• **${o.t}** — ${o.desc.split(".")[0]}.`);
    });
  }

  lines.push(`\nЧто думаете, оформляем?»`);
  return lines.join("\n");
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
:root {
  --bg:   #0B0C0F;
  --s0:   #0F1014;
  --s1:   #14151A;
  --s2:   #1E1F26;
  --s3:   #27282F;
  --b0:   rgba(255,255,255,0.06);
  --b1:   rgba(255,255,255,0.10);
  --b2:   rgba(255,255,255,0.16);
  --t0:   #F2F2F5;
  --t1:   #B4B4C0;
  --t2:   #6E6E82;
  --y:    #FFE300;
  --r:    10px;
}
html,body,#root { height:100%; overflow:hidden; }
body { background:var(--bg); color:var(--t0); font-family:'Bricolage Grotesque',sans-serif; }
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--s3); border-radius:2px; }
input[type=range] { -webkit-appearance:none; width:100%; height:2px; background:var(--s3); border-radius:1px; outline:none; cursor:pointer; display:block; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; background:var(--y); border-radius:50%; cursor:pointer; box-shadow:0 0 0 3px rgba(255,227,0,0.18); transition:box-shadow .15s; }
input[type=range]::-webkit-slider-thumb:hover { box-shadow:0 0 0 6px rgba(255,227,0,0.25); }
.btn { font-family:inherit; cursor:pointer; transition:all .15s; border:none; outline:none; }
@keyframes up  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes in  { from{opacity:0} to{opacity:1} }
@keyframes sin { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
.anim  { animation:up .3s ease both; }
.fin   { animation:in .2s ease both; }
.sin   { animation:sin .25s cubic-bezier(.16,1,.3,1) both; }
.hover-card:hover { border-color:var(--b2) !important; background:var(--s1) !important; }
strong { font-weight:700; color:var(--t0); }
`;

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function Slider({ label, value, min, max, step, format, onChange }) {
  const pct = (value - min) / (max - min) * 100;
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:11, color:"var(--t2)", letterSpacing:.6, textTransform:"uppercase", fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:14, fontWeight:700, color:"var(--y)", fontVariantNumeric:"tabular-nums" }}>{format(value)}</span>
      </div>
      <div style={{ position:"relative", height:2 }}>
        <div style={{ position:"absolute", inset:0, background:"var(--s3)", borderRadius:1 }} />
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`, background:"var(--y)", borderRadius:1, pointerEvents:"none", transition:"width .06s" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{ position:"absolute", top:-5, left:0, margin:0 }} />
      </div>
    </div>
  );
}

function Chip({ label, active, color="#FFE300", onClick }) {
  return (
    <button onClick={onClick} className="btn" style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"5px 10px", borderRadius:6,
      background: active ? `${color}16` : "transparent",
      border:`1px solid ${active ? color+"55" : "var(--b0)"}`,
      color: active ? color : "var(--t2)",
      fontSize:11, fontWeight: active ? 600 : 400,
      fontFamily:"inherit",
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background: active ? color : "var(--s3)", flexShrink:0, transition:"background .15s" }} />
      {label}
    </button>
  );
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:3, background:"var(--s3)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ width:`${score}%`, height:"100%", background:color, borderRadius:2, transition:"width .4s ease" }} />
      </div>
      <span style={{ fontSize:10, color:"var(--t2)", fontVariantNumeric:"tabular-nums", width:26, textAlign:"right" }}>{score}%</span>
    </div>
  );
}

function TariffCard({ t, lang, prefs, score, selected, rank, onClick }) {
  const eff = getEff(t, prefs);
  const hasDisc = eff < t.price;
  const content = lang==="b" ? t.b : t.s;
  const isTop = rank===0;

  return (
    <div onClick={onClick} className={`btn ${!selected ? "hover-card" : ""}`} style={{
      position:"relative", borderRadius:12, textAlign:"left",
      border:`1px solid ${selected ? t.color+"55" : isTop ? "var(--b1)" : "var(--b0)"}`,
      background: selected ? `${t.color}0C` : isTop ? "var(--s1)" : "var(--s0)",
      boxShadow: selected ? `0 0 0 1px ${t.color}33, 0 8px 32px ${t.color}12` : "none",
      overflow:"hidden", padding:"18px 18px 14px",
      transition:"all .2s",
    }}>
      {/* Left accent stripe */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:t.color, borderRadius:"12px 0 0 12px" }} />

      {/* Rank badge */}
      {isTop && (
        <div style={{ position:"absolute", top:12, right:12, background:"var(--y)", color:"#000", fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:4, letterSpacing:.8 }}>
          ЛУЧШИЙ
        </div>
      )}
      {!isTop && rank <= 2 && (
        <div style={{ position:"absolute", top:12, right:12, background:"var(--s2)", color:"var(--t2)", fontSize:9, fontWeight:600, padding:"2px 6px", borderRadius:4 }}>
          #{rank+1}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom:12, paddingRight:48 }}>
        <div style={{ fontSize:11, color:t.color, fontWeight:600, letterSpacing:.5, marginBottom:3, textTransform:"uppercase", opacity:.9 }}>{t.tag}</div>
        <div style={{ fontSize:22, fontWeight:800, letterSpacing:-.5, color:"var(--t0)", lineHeight:1.1 }}>{t.name}</div>
      </div>

      {/* Price */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:12 }}>
        <div>
          {hasDisc && <div style={{ fontSize:11, color:"var(--t2)", textDecoration:"line-through", lineHeight:1, marginBottom:1 }}>{t.price}₽</div>}
          <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
            <span style={{ fontSize:32, fontWeight:800, color: eff===0?"#34D399":"var(--t0)", lineHeight:1, fontVariantNumeric:"tabular-nums", letterSpacing:"-1px" }}>
              {eff===0?"0":eff}
            </span>
            {eff>0 && <span style={{ fontSize:13, color:"var(--t2)", fontWeight:400 }}>₽/мес</span>}
          </div>
          {hasDisc && <div style={{ fontSize:10, color:t.color, fontWeight:600, marginTop:1 }}>−{t.disc}% на год</div>}
          {t.isAnnual && <div style={{ fontSize:10, color:t.color, fontWeight:600, marginTop:1 }}>= 4 740₽/год</div>}
          {t.isMax4 && <div style={{ fontSize:10, color:t.color, fontWeight:600, marginTop:1 }}>= 1 200₽ за 4 месяца</div>}
        </div>
        {t.badge && !isTop && (
          <span style={{ marginLeft:"auto", fontSize:10, fontWeight:800, background:t.color, color:"#000", borderRadius:5, padding:"3px 8px", letterSpacing:.5, alignSelf:"flex-start" }}>{t.badge}</span>
        )}
      </div>

      {/* Stat pills */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
        {[
          gbLabel(t.gb),
          t.gbB ? `+${gbLabel(t.gbB)} AI` : null,
          t.min>=9999?"∞ мин":`${t.min} мин`,
          t.sms ? "SMS ∞" : null,
        ].filter(Boolean).map(s => (
          <span key={s} style={{
            fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:5,
            background: s.includes("AI") ? `${t.color}20` : "var(--s2)",
            color: s.includes("AI") ? t.color : "var(--t1)",
          }}>{s}</span>
        ))}
      </div>

      {/* Content */}
      <div style={{ borderTop:"1px solid var(--b0)", paddingTop:10 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"var(--t1)", marginBottom:6, lineHeight:1.4 }}>{content.h}</div>
        {content.p.map((pt,i)=>(
          <div key={i} style={{ display:"flex", gap:7, marginBottom:3 }}>
            <span style={{ color:t.color, fontSize:10, flexShrink:0, marginTop:3 }}>▸</span>
            <span style={{ fontSize:11, color:"var(--t2)", lineHeight:1.5 }}>{pt}</span>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div style={{ marginTop:10 }}>
        <ScoreBar score={score} color={t.color} />
      </div>
    </div>
  );
}

function OfferRow({ o, active, onClick }) {
  return (
    <div onClick={onClick} className="btn" style={{
      display:"flex", gap:10, alignItems:"flex-start",
      padding:"10px 10px", borderRadius:8,
      background: active ? `${o.color}0E` : "transparent",
      border:`1px solid ${active ? o.color+"44" : "var(--b0)"}`,
      transition:"all .15s", textAlign:"left", fontFamily:"inherit",
      cursor:"pointer",
    }}>
      <span style={{ fontSize:20, flexShrink:0, lineHeight:1, marginTop:1 }}>{o.icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:6, alignItems:"flex-start", marginBottom:active?4:0 }}>
          <span style={{ fontSize:12, fontWeight:600, color: active?"var(--t0)":"var(--t1)", lineHeight:1.3 }}>{o.t}</span>
          <span style={{ fontSize:9, fontWeight:700, color:o.color, background:`${o.color}18`, borderRadius:99, padding:"2px 7px", whiteSpace:"nowrap", flexShrink:0 }}>{o.tag}</span>
        </div>
        {active && <p className="fin" style={{ fontSize:11, color:"var(--t2)", lineHeight:1.55, margin:0 }}>{o.desc}</p>}
      </div>
    </div>
  );
}

function ScriptBlock({ tariff, offers, prefs, lang }) {
  const script = useMemo(()=>buildScript(tariff,offers,prefs,lang),[tariff,offers,prefs,lang]);
  const [copied,setCopied] = useState(false);

  if (!script) return null;

  const copy = () => {
    const plain = script.replace(/\*\*/g,"");
    navigator.clipboard.writeText(plain).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const renderLine = (line, i) => {
    const parts = line.split(/\*\*([^*]+)\*\*/g);
    return (
      <p key={i} style={{ margin:"0 0 6px", fontSize:11, lineHeight:1.55, color: line.startsWith("•")?"var(--t1)":"var(--t0)" }}>
        {parts.map((p,j)=> j%2===1 ? <strong key={j}>{p}</strong> : p)}
      </p>
    );
  };

  return (
    <div className="fin" style={{ marginTop:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:9, color:"var(--t2)", letterSpacing:1.2, textTransform:"uppercase", fontWeight:600 }}>Скрипт для клиента</span>
        <button onClick={copy} className="btn" style={{
          background: copied?"rgba(52,211,153,.15)":"var(--s2)",
          border:`1px solid ${copied?"rgba(52,211,153,.3)":"var(--b0)"}`,
          color: copied?"#34D399":"var(--t2)",
          borderRadius:5, padding:"3px 8px", fontSize:9, fontFamily:"inherit",
          display:"flex", alignItems:"center", gap:4,
        }}>
          {copied?"✓":"📋"} {copied?"Скопировано":"Копировать"}
        </button>
      </div>
      <div style={{ background:"var(--s0)", border:"1px solid var(--b0)", borderRadius:8, padding:"10px" }}>
        {script.split("\n").map((line,i) => renderLine(line, i))}
      </div>
    </div>
  );
}

function UploadModal({ onClose, onLoad }) {
  const [text,setText] = useState(""); const [busy,setBusy]=useState(false); const [err,setErr]=useState("");
  const run = async () => {
    if(!text.trim())return; setBusy(true); setErr("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:`Извлеки тарифы Билайн из текста. Верни ТОЛЬКО валидный JSON-массив без markdown и пояснений.\n\nСхема: {"id":"snake","name":"","tag":"","color":"#HEX","emoji":"эмодзи","gb":число,"gbB":0,"min":число_или_9999,"sms":true/false,"price":число,"pT":число,"disc":число,"badge":null,"hasMnp":true/false,"isAnnual":false,"isCombo":false,"b":{"h":"выгода","p":["п1","п2","п3"]},"s":{"h":"техника","p":["п1","п2","п3"]}}\n\nЦвета: #FFE300 #FF5C2E #F59E0B #34D399 #818CF8 #2DD4BF #E879F9 #FCD34D #C084FC #F472B6 #60A5FA\n\nТекст:\n${text}`}]})});
      const d=await r.json(); const raw=d.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      const arr=JSON.parse(raw);
      if(Array.isArray(arr)&&arr.length){onLoad(arr);onClose();}else setErr("Не удалось разобрать");
    }catch(e){setErr("Ошибка: "+e.message);} setBusy(false);
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div className="sin" style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:14,padding:28,width:"100%",maxWidth:500}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:18,fontWeight:800,letterSpacing:-.3}}>Обновить тарифы</div>
          <button onClick={onClose} className="btn" style={{background:"none",color:"var(--t2)",fontSize:20}}>✕</button>
        </div>
        <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>
          Вставь текст из Тарифы.md или со страницы Билайн — AI разберёт структуру автоматически.<br/>
          <a href="https://spb.beeline.ru/customers/products/toptariffs/" target="_blank" rel="noreferrer" style={{color:"var(--y)",textDecoration:"none",fontWeight:600}}>→ Открыть тарифы на сайте Билайн</a>
        </p>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Вставь текст здесь..." style={{width:"100%",height:180,background:"var(--bg)",border:"1px solid var(--b1)",borderRadius:8,color:"var(--t0)",fontFamily:"DM Mono, monospace",fontSize:11,padding:12,resize:"vertical",outline:"none"}}/>
        {err&&<div style={{fontSize:11,color:"#f87171",marginTop:8}}>{err}</div>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
          <button onClick={onClose} className="btn" style={{background:"var(--s2)",color:"var(--t1)",borderRadius:8,padding:"9px 16px",fontSize:12,fontFamily:"inherit"}}>Отмена</button>
          <button onClick={run} disabled={busy||!text.trim()} className="btn" style={{background:busy?"rgba(255,227,0,.4)":"var(--y)",color:"#000",borderRadius:8,padding:"9px 22px",fontSize:12,fontWeight:700,fontFamily:"inherit",cursor:busy?"wait":"pointer"}}>{busy?"Разбираю...":"Загрузить"}</button>
        </div>
      </div>
    </div>
  );
}

function BeautyNumberModal({ onClose }) {
  const [numbers, setNumbers] = useState(() => generateBeautifulNumbers(6));

  const regenerate = () => setNumbers(generateBeautifulNumbers(6));

  const copyNumber = (num) => {
    const full = `+7 (999) ${num.slice(0,2)}-${num.slice(3,5)}-${num.slice(6,8)}`;
    navigator.clipboard.writeText(full);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div className="sin" style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:14,padding:24,width:"100%",maxWidth:420}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:-.3}}>✨ Красивые номера</div>
            <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>Подбери и проверь на сайте Билайн</div>
          </div>
          <button onClick={onClose} className="btn" style={{background:"none",color:"var(--t2)",fontSize:20}}>✕</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {numbers.map((num, i) => (
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              background:"var(--bg)",border:"1px solid var(--b0)",borderRadius:8,
            }}>
              <span style={{fontSize:16,fontWeight:700,color:"var(--y)",letterSpacing:1,fontVariantNumeric:"tabular-nums"}}>
                {num}
              </span>
              <button onClick={()=>copyNumber(num)} className="btn" style={{
                marginLeft:"auto",padding:"4px 8px",background:"var(--s2)",
                border:"1px solid var(--b0)",borderRadius:6,color:"var(--t2)",fontSize:10,
              }}>Скопировать</button>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={regenerate} className="btn" style={{
            flex:1,background:"var(--s2)",color:"var(--t1)",borderRadius:8,
            padding:"10px 16px",fontSize:12,fontFamily:"inherit",
          }}>🔄 Сгенерировать ещё</button>
          <a
            href="https://spb.beeline.ru/customers/products/toptariffs/"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              flex:1,background:"var(--y)",color:"#000",borderRadius:8,
              padding:"10px 16px",fontSize:12,fontWeight:700,fontFamily:"inherit",
              textAlign:"center",textDecoration:"none",
            }}
          >🔗 Проверить на сайте</a>
        </div>

        <div style={{marginTop:12,fontSize:10,color:"var(--t2)",lineHeight:1.5}}>
          💡 <strong>Как использовать:</strong> скопируй понравившийся номер и вставь на сайте Билайн при оформлении SIM-карты
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tariffs,setTariffs] = useState(TARIFFS);
  const [lang,setLang] = useState("b");
  const [rightOpen,setRightOpen] = useState(true);
  const [activeOffers,setActiveOffers] = useState([]);
  const [selectedId,setSelectedId] = useState(null);
  const [animKey,setAnimKey] = useState(0);
  const [showUpload,setShowUpload] = useState(false);
  const [showBeautyNum,setShowBeautyNum] = useState(false);
  const [generatedNumbers,setGeneratedNumbers] = useState([]);

  const [gb,setGb]=useState(30);   const [min,setMin]=useState(300);
  const [budget,setBudget]=useState(600);
  const [mnp,setMnp]=useState(false); const [ai,setAi]=useState(false);
  const [yandex,setYandex]=useState(false); const [cash,setCash]=useState(false);
  const [combo,setCombo]=useState(false); const [kids,setKids]=useState(false);
  const [tablet,setTablet]=useState(false);

  const prefs = {gb,min,budget,mnp,ai,yandex,cash,combo,kids,tablet};

  const ranked = useMemo(()=>[...tariffs].map(t=>({...t,_s:scoreT(t,prefs)})).sort((a,b)=>b._s-a._s).slice(0,6), [tariffs,gb,min,budget,mnp,ai,yandex,cash,combo,kids,tablet]);

  useEffect(()=>{ setAnimKey(k=>k+1); setSelectedId(null); },[gb,min,budget,mnp,ai,yandex,cash,combo,kids,tablet]);

  const selTariff = selectedId ? tariffs.find(t=>t.id===selectedId) : ranked[0];
  const bestEff = selTariff ? getEff(selTariff,prefs) : 0;
  const saved = selTariff ? selTariff.price - bestEff : 0;

  const toggleOffer = id => setActiveOffers(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  return (
    <>
      <style>{G}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>

        {/* ══ HEADER ══ */}
        <header style={{
          height:52, flexShrink:0, display:"flex", alignItems:"center",
          padding:"0 20px", gap:12, borderBottom:"1px solid var(--b0)",
          background:"var(--bg)",
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:32,height:32,background:"var(--y)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#000",letterSpacing:-1}}>🐝</div>
            <div>
              <div style={{fontSize:14,fontWeight:700,letterSpacing:-.2,lineHeight:1.1}}>Калькулятор выгод</div>
              <div style={{fontSize:10,color:"var(--t0)",fontWeight:500}}>Билайн · {ranked.length} тарифов подобрано</div>
            </div>
          </div>

          <div style={{width:1,height:20,background:"var(--b0)",margin:"0 4px"}}/>

          {/* Lang toggle */}
          <div style={{display:"flex",background:"var(--s1)",border:"1px solid var(--b0)",borderRadius:8,padding:3,gap:2}}>
            {[["b","💡 Выгоды"],["s","⚙️ Характеристики"]].map(([id,label])=>(
              <button key={id} onClick={()=>setLang(id)} className="btn" style={{
                background:lang===id?"var(--y)":"transparent",color:lang===id?"#000":"var(--t2)",
                border:"none",borderRadius:6,padding:"5px 13px",fontSize:11,fontWeight:lang===id?700:400,fontFamily:"inherit",
              }}>{label}</button>
            ))}
          </div>

          {/* Site check */}
          <a href="https://spb.beeline.ru/customers/products/toptariffs/" target="_blank" rel="noreferrer" style={{
            display:"flex",alignItems:"center",gap:5,
            background:"var(--s1)",border:"1px solid var(--b0)",
            color:"var(--t1)",borderRadius:8,padding:"7px 12px",
            fontSize:10,fontWeight:500,textDecoration:"none",
            transition:"all .15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--y)";e.currentTarget.style.color="var(--y)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b0)";e.currentTarget.style.color="var(--t1)";}}>
            <span>🔗</span> Проверить на сайте
          </a>

          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button onClick={()=>setShowBeautyNum(true)} className="btn" style={{
              background:"var(--s1)",border:"1px solid var(--b0)",color:"var(--t1)",
              borderRadius:8,padding:"7px 13px",fontSize:11,fontFamily:"inherit",
            }}>✨ Подобрать номер</button>

            <button onClick={()=>setShowUpload(true)} className="btn" style={{
              background:"var(--s1)",border:"1px solid var(--b0)",color:"var(--t1)",
              borderRadius:8,padding:"7px 13px",fontSize:11,fontFamily:"inherit",
            }}>📁 Обновить тарифы</button>

            <button onClick={()=>setRightOpen(o=>!o)} className="btn" style={{
              background:rightOpen?"var(--y)":"var(--s1)",
              border:`1px solid ${rightOpen?"var(--y)":"var(--b0)"}`,
              color:rightOpen?"#000":"var(--t1)",
              borderRadius:8,padding:"7px 14px",
              fontSize:11,fontWeight:700,fontFamily:"inherit",position:"relative",
            }}>
              {rightOpen?"✕ Закрыть":"✦ Инструменты"}
              {activeOffers.length>0&&!rightOpen&&(
                <span style={{position:"absolute",top:-4,right:-4,background:"#FF5C2E",color:"#fff",borderRadius:99,width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900}}>{activeOffers.length}</span>
              )}
            </button>
          </div>
        </header>

        {/* ══ BODY ══ */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* ── LEFT: Prefs ── */}
          <aside style={{
            width:240,flexShrink:0,overflowY:"auto",
            borderRight:"1px solid var(--b0)",padding:"20px 16px",
            background:"var(--bg)",display:"flex",flexDirection:"column",
          }}>
            <div style={{fontSize:10,color:"var(--t2)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:20,fontWeight:600}}>Параметры</div>

            <Slider label="Интернет" min={1} max={1024} step={1}    value={gb}     onChange={setGb}     format={v=>v>=1000?`${(v/1024).toFixed(0)} ТБ`:`${v} ГБ`} />
            <Slider label="Звонки"   min={0} max={2000} step={50}   value={min}    onChange={setMin}    format={v=>v>=2000?"∞ мин":`${v} мин`} />
            <Slider label="Бюджет"   min={0} max={1300} step={50}   value={budget} onChange={setBudget} format={v=>v>=1300?"любой":`${v} ₽`} />

            <div style={{borderTop:"1px solid var(--b0)",paddingTop:16,marginTop:4}}>
              <div style={{fontSize:10,color:"var(--t2)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Уточните профиль</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {[
                  ["🔄 Перенос номера", mnp,    setMnp,    "#FFE300"],
                  ["🤖 Нейронки / AI",  ai,     setAi,     "#818CF8"],
                  ["🎵 Яндекс Плюс",   yandex, setYandex, "#FCD34D"],
                  ["💰 Кешбэк 9%",     cash,   setCash,   "#C084FC"],
                  ["⚡ Комбо с домом",  combo,  setCombo,  "#34D399"],
                  ["🧒 Есть дети",      kids,   setKids,   "#F472B6"],
                  ["📱 Планшет",        tablet, setTablet, "#2DD4BF"],
                ].map(([l,v,s,c])=>(
                  <Chip key={l} label={l} active={v} color={c} onClick={()=>s(!v)}/>
                ))}
              </div>
            </div>

            {/* Best summary */}
            {selTariff && (
              <div className="fin" style={{marginTop:"auto",paddingTop:16,borderTop:"1px solid var(--b0)"}}>
                <div style={{fontSize:10,color:"var(--t2)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Лучший выбор</div>
                <div style={{borderLeft:`2px solid ${selTariff.color}`,paddingLeft:12}}>
                  <div style={{fontSize:10,color:selTariff.color,fontWeight:600,marginBottom:2}}>{selTariff.tag}</div>
                  <div style={{fontSize:20,fontWeight:800,letterSpacing:-.4,marginBottom:8,lineHeight:1.1}}>{selTariff.name}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                    <span style={{fontSize:34,fontWeight:800,letterSpacing:"-1px",fontVariantNumeric:"tabular-nums"}}>{bestEff===0?"0":bestEff}</span>
                    <span style={{fontSize:13,color:"var(--t2)"}}>₽/мес</span>
                  </div>
                  {saved>0&&(
                    <div style={{marginTop:8,fontSize:11,color:"#34D399",fontWeight:600}}>
                      Экономия {saved}₽/мес · {saved*12}₽/год
                    </div>
                  )}
                </div>
                <ScriptBlock tariff={selTariff} offers={activeOffers} prefs={prefs} lang={lang} />
              </div>
            )}
          </aside>

          {/* ── CENTER: Grid ── */}
          <main style={{flex:1,overflowY:"auto",padding:"20px",background:"var(--bg)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <span style={{fontSize:10,color:"var(--t2)",letterSpacing:1.2,textTransform:"uppercase",fontWeight:600}}>Подобрано для вас</span>
              <div style={{flex:1,height:1,background:"var(--b0)"}}/>
              {mnp&&(
                <span style={{fontSize:10,color:"var(--y)",background:"rgba(255,227,0,.08)",border:"1px solid rgba(255,227,0,.18)",borderRadius:99,padding:"3px 10px"}}>
                  🔄 Цены с MNP−{ranked[0]?.disc}%
                </span>
              )}
            </div>
            <div key={animKey} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
              {ranked.map((t,i)=>(
                <div key={t.id} className="anim" style={{animationDelay:`${i*.04}s`}}>
                  <TariffCard t={t} lang={lang} prefs={prefs} score={t._s} selected={selectedId===t.id} rank={i}
                    onClick={()=>setSelectedId(s=>s===t.id?null:t.id)}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:20,fontSize:10,color:"var(--t2)",textAlign:"center",lineHeight:1.7}}>
              Цены актуальны на дату обновления файла тарифов.&nbsp;
              <a href="https://spb.beeline.ru/customers/products/toptariffs/" target="_blank" rel="noreferrer"
                style={{color:"var(--y)",textDecoration:"none",fontWeight:600}}>Проверить актуальность на сайте →</a>
            </div>
            <div style={{marginTop:12,fontSize:10,color:"var(--t2)",textAlign:"center",lineHeight:1.7}}>
              🏠&nbsp;
              <a href="https://fastnetspb.ru" target="_blank" rel="noreferrer"
                style={{color:"var(--t0)",textDecoration:"none",fontWeight:600}}>Подключить домашний интернет Fastnet →</a>
            </div>
          </main>

          {/* ── RIGHT: Offers ── */}
          {rightOpen && (
            <aside className="sin" style={{
              width:300,flexShrink:0,display:"flex",flexDirection:"column",
              borderLeft:"1px solid var(--b0)",background:"var(--s0)",
            }}>
              <div style={{padding:"14px 14px 0",borderBottom:"1px solid var(--b0)",flexShrink:0}}>
                <div style={{fontSize:9,color:"var(--t2)",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>Предложения</div>
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {OFFERS.map(o=>(
                    <OfferRow key={o.id} o={o} active={activeOffers.includes(o.id)} onClick={()=>toggleOffer(o.id)}/>
                  ))}
                </div>
                {activeOffers.length>0&&(
                  <div className="fin" style={{marginTop:12,padding:"12px",borderRadius:8,background:"rgba(52,211,153,.07)",border:"1px solid rgba(52,211,153,.2)"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#34D399",marginBottom:4}}>Отмечено {activeOffers.length} предложений</div>
                    <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.6}}>Скрипт для клиента в блоке «Лучший выбор» уже учитывает все отмеченные предложения</div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
      {showUpload&&<UploadModal onClose={()=>setShowUpload(false)} onLoad={t=>{setTariffs(t);setAnimKey(k=>k+1);}}/>}
      {showBeautyNum&&<BeautyNumberModal onClose={()=>setShowBeautyNum(false)}/>}
    </>
  );
}
