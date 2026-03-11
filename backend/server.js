const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const app = express();

// ─────────────────────────────────────────────
// LOCAL DATA — โหลด data.json
// ─────────────────────────────────────────────
let LOCAL_DATA = { restaurants: [], attractions: [], hotels: [] };
try {
  const dataPath = path.join(__dirname, 'data.json');
  LOCAL_DATA = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📦 data.json loaded: ${LOCAL_DATA.restaurants.length} restaurants, ${LOCAL_DATA.attractions.length} attractions, ${LOCAL_DATA.hotels.length} hotels`);
} catch(e) {
  console.warn('⚠️  data.json not found or invalid, using BASE_PROMPT only');
}

// ─────────────────────────────────────────────
// LOCAL SEARCH — ค้นหาข้อมูลตรงจาก data.json
// ─────────────────────────────────────────────
function searchLocalData(query, lang = 'th') {
  if (!query) return null;
  const q = query.toLowerCase();

  // ตรวจว่า query เกี่ยวกับอะไร
  const isFood       = /อาหาร|ร้าน|กิน|เมนู|ก๋วยเตี๋ยว|ซีฟู้ด|คาเฟ่|กาแฟ|ขนม|ของกิน|สตรีทฟู้ด|food|eat|restaurant|cafe|noodle|seafood|dessert|吃|餐厅|美食|小吃|咖啡/.test(q);
  const isAttraction = /ที่เที่ยว|สถานที่|วัด|อุทยาน|ถ้ำ|วัง|ตลาด|สวน|attraction|temple|park|cave|palace|market|景点|寺庙|公园/.test(q);
  const isHotel      = /ที่พัก|โรงแรม|รีสอร์ท|โฮมสเตย์|hotel|resort|homestay|sleep|stay|住宿|酒店|度假村/.test(q);
  const isHuaHin     = /หัวหิน|hua hin|华欣/.test(q);
  const isPhet       = /เพชรบุรี|ชะอำ|phetchaburi|cha.?am|碧武里|七岩/.test(q);

  const results = { restaurants: [], attractions: [], hotels: [] };
  let found = false;

  const scoreItem = (item, query) => {
    let score = 0;
    const qLower = query.toLowerCase();
    if (item.name?.toLowerCase().includes(qLower)) score += 10;
    if (item.nameEn?.toLowerCase().includes(qLower)) score += 8;
    if (item.nameZh?.toLowerCase().includes(qLower)) score += 8;
    if (item.keywords) {
      item.keywords.forEach(k => {
        if (qLower.includes(k.toLowerCase()) || k.toLowerCase().includes(qLower)) score += 3;
      });
    }
    if (item.menu?.toLowerCase().includes(qLower)) score += 4;
    if (item.desc?.toLowerCase().includes(qLower)) score += 2;
    if (item.type?.toLowerCase().includes(qLower)) score += 3;
    return score;
  };
;

  const allTokens = q.split(/\s+/).filter(t => t.length > 1);

  if (isFood || (!isAttraction && !isHotel)) {
    const scored = LOCAL_DATA.restaurants
      .map(r => ({ ...r, _score: allTokens.reduce((s,t) => s + scoreItem(r,t), 0) + scoreItem(r, q) }))
      .filter(r => r._score > 0 || (!isAttraction && !isHotel && isFood));

    // กรองตามเมือง
    let filtered = scored;
    if (isHuaHin && !isPhet) filtered = scored.filter(r => r.city === 'หัวหิน' || r.city === 'ชะอำ');
    if (isPhet && !isHuaHin) filtered = scored.filter(r => r.city === 'เพชรบุรี' || r.city === 'ชะอำ');

    const top = (filtered.length > 0 ? filtered : scored)
      .sort((a,b) => b._score - a._score)
      .slice(0, 6);

    if (top.length > 0) { results.restaurants = top; found = true; }
  }

  if (isAttraction) {
    const scored = LOCAL_DATA.attractions
      .map(a => ({ ...a, _score: allTokens.reduce((s,t) => s + scoreItem(a,t), 0) + scoreItem(a, q) }))
      .filter(a => a._score > 0);

    let filtered = scored;
    if (isHuaHin && !isPhet) filtered = scored.filter(a => a.city === 'หัวหิน' || a.city === 'ชะอำ');
    if (isPhet && !isHuaHin) filtered = scored.filter(a => a.city === 'เพชรบุรี');

    const top = (filtered.length > 0 ? filtered : scored).sort((a,b) => b._score - a._score).slice(0, 5);
    if (top.length > 0) { results.attractions = top; found = true; }
  }

  if (isHotel) {
    const scored = LOCAL_DATA.hotels
      .map(h => ({ ...h, _score: allTokens.reduce((s,t) => s + scoreItem(h,t), 0) + scoreItem(h, q) }));

    let filtered = scored;
    if (isHuaHin && !isPhet) filtered = scored.filter(h => h.city === 'หัวหิน');
    if (isPhet && !isHuaHin) filtered = scored.filter(h => h.city === 'เพชรบุรี' || h.city === 'ชะอำ');

    const top = (filtered.length > 0 ? filtered : scored).sort((a,b) => b._score - a._score).slice(0, 4);
    if (top.length > 0) { results.hotels = top; found = true; }
  }

  if (!found) return null;
  return results;
}

// สร้าง context string จากผลการค้นหา
function buildLocalContext(results, lang = 'th') {
  if (!results) return '';
  const parts = [];

  const nameField = lang === 'zh' ? 'nameZh' : lang === 'en' ? 'nameEn' : 'name';
  const descField = lang === 'zh' ? 'descZh' : 'desc';
  const menuField = lang === 'zh' ? 'menuZh' : 'menu';

  if (results.restaurants?.length > 0) {
    parts.push('🍽️ VERIFIED LOCAL RESTAURANTS (use these specific names and prices):');
    results.restaurants.forEach(r => {
      const nm = r[nameField] || r.name;
      const mn = r[menuField] || r.menu;
      parts.push(`  • ${nm} (${r.city}) — ${mn} — ${r.price}/${r.priceCNY}/${r.priceUSD} — ${r.hours} — Maps: ${r.mapsUrl}`);
    });
  }

  if (results.attractions?.length > 0) {
    parts.push('🏛️ VERIFIED ATTRACTIONS:');
    results.attractions.forEach(a => {
      const nm = a[nameField] || a.name;
      const ds = a[descField] || a.desc;
      parts.push(`  • ${nm} (${a.city}) — ${ds} — Entry: ${a.entryForeign} — ${a.hours} — Maps: ${a.mapsUrl}`);
    });
  }

  if (results.hotels?.length > 0) {
    parts.push('🏨 VERIFIED HOTELS:');
    results.hotels.forEach(h => {
      const nm = h[nameField] || h.name;
      const ds = h[descField] || h.desc;
      parts.push(`  • ${nm} (${h.city}) — ${ds} — ${h.price}/${h.priceCNY}/${h.priceUSD} — Maps: ${h.mapsUrl}`);
    });
  }

  if (parts.length === 0) return '';

  return `

══════════════════════════════════════════
📦 LOCAL DATABASE — PRIORITY DATA (Verified)
══════════════════════════════════════════
CRITICAL: You MUST use the following verified local data. Do NOT invent alternatives.
Always mention the specific restaurant/place names listed here. Never say "go look around the market yourself".
${parts.join('\n')}
══════════════════════════════════════════`;
}
app.use(cors({
  origin: function(origin, callback) {
    const allowed = ['http://localhost:3000','http://localhost:5173'];
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else { callback(null, true); }
  },
  methods: ['GET','POST'], credentials: true,
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─────────────────────────────────────────────
// PLACE DATABASE — รูป + Maps + ข้อมูล
// ─────────────────────────────────────────────
const PLACES_DB = {
  "เขาวัง": {
    name: "พระนครคีรี (เขาวัง)",
    image: "https://img2.pic.in.th/20240513b953e516db409961bed1e969525ebdae082030.jpg",
    desc: "พระราชวังบนยอดเขาสร้างโดย ร.4 วิวสวยงาม เวลา 08:30–16:30 น.",
    price: "150 บาท",
    mapsUrl: "https://maps.google.com/?q=พระนครคีรีเขาวัง+เพชรบุรี",
    type: "attraction"
  },
  "แก่งกระจาน": {
    name: "อุทยานแห่งชาติแก่งกระจาน",
    image: "https://travel.mthai.com/app/uploads/2016/09/DSC_2356.jpg",
    desc: "อุทยานใหญ่สุดของไทย ดูนก ทะเลหมอก แนะนำ พ.ย.–ม.ค.",
    price: "300 บาท (ต่างชาติ) / 100 บาท (ไทย)",
    mapsUrl: "https://maps.google.com/?q=อุทยานแก่งกระจาน+เพชรบุรี",
    type: "attraction"
  },
  "ถ้ำเขาหลวง": {
    name: "ถ้ำเขาหลวง",
    image: "https://img.thaicdn.net/u/2022/sutasinee/01/42.jpg",
    desc: "ถ้ำพระพุทธรูป แสงธรรมชาติสวยงามตอน 11:00 น.",
    price: "ฟรี",
    mapsUrl: "https://maps.google.com/?q=ถ้ำเขาหลวง+เพชรบุรี",
    type: "attraction"
  },
  "วัดมหาธาตุ": {
    name: "วัดมหาธาตุวรวิหาร",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/32/WatMahathat.jpg",
    desc: "วัดขอมโบราณ ปรางค์เก่าแก่สวยงาม เข้าฟรี แต่งกายสุภาพ",
    price: "ฟรี",
    mapsUrl: "https://maps.google.com/?q=วัดมหาธาตุวรวิหาร+เพชรบุรี",
    type: "attraction"
  },
  "ชายหาดชะอำ": {
    name: "หาดชะอำ",
    image: "https://cbtthailand.dasta.or.th/upload-file-api/Resources/RelateAttraction/Images/RAT760040/2.jpeg",
    desc: "ชายหาดพักผ่อนยอดนิยม อาหารทะเลสด บรรยากาศสบาย",
    price: "ฟรี",
    mapsUrl: "https://maps.google.com/?q=หาดชะอำ+เพชรบุรี",
    type: "attraction"
  },
  // ─── ที่พัก ───
  "kaeng_resort": {
    name: "Kaeng Krachan Camp & Resort",
    image: "https://img2.pic.in.th/643396939_904572975672909_3528937264899095705_n.jpg",
    desc: "รีสอร์ทธรรมชาติ ติดอุทยานแก่งกระจาน วิวสวย บรรยากาศเงียบสงบ",
    price: "800–1,500 บาท/คืน",
    mapsUrl: "https://maps.google.com/?q=Kaeng+Krachan+Resort+Phetchaburi",
    type: "hotel"
  },
  "dusit_huahin": {
    name: "Dusit Thani Hua Hin",
    image: "https://img2.pic.in.th/366880381.jpg",
    desc: "5-star resort ห่างจาก ชะอำ 30 นาที สระว่ายน้ำ สปา วิวทะเล",
    price: "3,500–8,000 บาท/คืน",
    mapsUrl: "https://maps.google.com/?q=Dusit+Thani+Hua+Hin",
    type: "hotel"
  },
  // ─── ร้านอาหาร ───
  "rimnam": {
    name: "ร้านริมน้ำ",
    image: "https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/03/20181203e60b18779c69f051872ce047b4ad437f171442.jpg",
    desc: "อาหารไทยริมแม่น้ำเพชรบุรี บรรยากาศดี เมนูแนะนำ: ปลาทอดน้ำปลา",
    price: "150–400 บาท/คน",
    mapsUrl: "https://maps.google.com/?q=ร้านริมน้ำ+เพชรบุรี",
    type: "restaurant"
  },
  "seafood_chaosaman": {
    name: "อาหารทะเลเจ้าสำราญ",
    image: "https://files.thailandtourismdirectory.go.th/assets/upload/2018/12/01/201812013de8a0df78bb5384e0ca4f180a832613160741.jpg",
    desc: "อาหารทะเลสดที่หาดเจ้าสำราญ ปลาหมึกย่าง กุ้ง หอย สด",
    price: "200–500 บาท/คน",
    mapsUrl: "https://maps.google.com/?q=หาดเจ้าสำราญ+เพชรบุรี",
    type: "restaurant"
  },
};

// ─────────────────────────────────────────────
// BASE PROMPT
// ─────────────────────────────────────────────
const BASE_PROMPT = `You are "น้องเพชร" (Nong Phet) — a friendly, cute AI travel guide for BOTH Phetchaburi Province AND Hua Hin.
Your name is น้องเพชร (Nong Phet / 小碧). NEVER call yourself PhetBot. Expert on Phetchaburi & Hua Hin (Prachuap Khiri Khan), Thailand.

═══════════════════════════════════════
🗺️ DUAL-CITY SCOPE — CRITICAL RULES
═══════════════════════════════════════
1. ONLY answer questions about Phetchaburi Province and Hua Hin / Cha-am area.
2. If asked about other provinces (Pattaya, Chiang Mai, Phuket etc.) say you specialise in Phetchaburi–Hua Hin only.
3. When listing accommodations or restaurants, NEVER include places from other provinces with the same name.
4. Hua Hin and Phetchaburi are continuous travel zones — always offer both options when relevant.

CRITICAL RULE — PLACE CARDS:
When recommending attractions, restaurants, or accommodations in Phetchaburi or Hua Hin, you MUST embed special JSON cards using this exact format (no markdown code fences, just the raw tag):

<PLACE_CARD>{"key":"เขาวัง","name":"พระนครคีรี (เขาวัง)","type":"attraction"}</PLACE_CARD>

Available place keys (use EXACT keys):
ATTRACTIONS: เขาวัง, แก่งกระจาน, ถ้ำเขาหลวง, วัดมหาธาตุ, ชายหาดชะอำ
HOTELS: kaeng_resort, rabieng_hotel, dusit_huahin, baan_krating
RESTAURANTS: rimnam, seafood_chaosaman

When recommending places, ALWAYS include the PLACE_CARD tag for each place mentioned.
Place cards will render as beautiful image cards with Maps links for users.

ITINERARY RULE: When creating itineraries, always recommend 1-2 hotels with PLACE_CARD tags using type:"hotel".

═══════════════════════════════════════
🏛️ ATTRACTIONS — PHETCHABURI
═══════════════════════════════════════
- Phra Nakhon Khiri (Khao Wang) — hilltop palace by King Rama IV; open 08:30–16:30; 150 THB
- Kaeng Krachan National Park — Thailand's largest; birdwatching, sea of mist; 300 THB foreign
- Khao Luang Cave — Buddha images, beautiful light rays at 11:00; free
- Wat Mahathat Worawihan — ancient Khmer-style; free; dress modestly
- Chao Samran Beach / Cha-am — quiet beaches, seafood, local atmosphere
- Mrigadayavan Palace — teak wood palace by the sea, built by King Rama VI; 100 THB
- Phetchaburi City Markets — Talat Chomrut, night market, local street food

🏖️ ATTRACTIONS — HUA HIN (30-60 min from Phetchaburi)
- Hua Hin Beach — long sandy beach, clean, family-friendly
- Cicada Night Market — art & craft market, Thai food, live music (Fri–Sun 17:00–23:00)
- Sam Roi Yot National Park — cave temples, bird sanctuary, freshwater marsh (90 min)
- Hua Hin Night Market — street food, seafood, shopping
- Khao Takiab (Monkey Hill) — hilltop temple, monkeys, sea view; free
- Purana Hua Hin — vintage village attraction

═══════════════════════════════════════
🍽️ FOOD & SOUVENIRS
═══════════════════════════════════════
- Khanom Mo Kaeng (ขนมหม้อแกง) — Thai egg custard; 40–80 THB/box
- Khanom Tan — sugar palm cake; 20–40 THB
- Khao Chae Phetchaburi — chilled jasmine rice (hot season); 80–150 THB
- Grilled Seafood at Chao Samran — 200–500 THB/person

═══════════════════════════════════════
🛏️ ACCOMMODATION (BY BUDGET)
═══════════════════════════════════════
Budget under 800 THB: Guesthouses in city, homestay near Kaeng Krachan
Mid-range 800–2500: Kaeng Krachan Camp & Resort, Rabieng Rim Nam Hotel
Luxury 2500+: Dusit Thani Hua Hin (30 min), Baan Krating Cha-am

═══════════════════════════════════════
🚌 TRANSPORT FROM BANGKOK
═══════════════════════════════════════
By car: ~2–2.5 hrs via Rama 2 Road, 160 km
By bus: Southern Bus Terminal → Phetchaburi, 2–3 hrs, 80–120 THB
By train: 3–4 hrs, 44–200 THB
By minivan: Victory Monument, 2.5 hrs, 120 THB

═══════════════════════════════════════
📅 BEST SEASONS
═══════════════════════════════════════
Best: Nov–Feb (18–28°C, sea of mist)
Hot: Mar–May (Khao Chae season)
Rainy: Jun–Oct (lush, cheaper)

═══════════════════════════════════════
🚨 SAFETY — Priority: Protect Your Belongings
═══════════════════════════════════════
Tourist Police: 1155 | Emergency: 191 | Ambulance: 1669
Phetchaburi Hospital: 032-425-500 | Bangkok Hospital Hua Hin: 032-616-800

Property Protection Tips (most-requested by Chinese tourists):
- Use hotel safe for valuables; carry photocopies of passport
- Keep bags in front at markets; be aware in crowds
- Avoid showing expensive items in tourist areas
- Save 1155 and 191 in your phone BEFORE you travel

═══════════════════════════════════════
🚿 FACILITIES — Priority: Cleanliness & Restrooms
═══════════════════════════════════════
- Kaeng Krachan NP: restrooms at visitor centre & campsite
- Phra Nakhon Khiri: restrooms at foot of hill and on hilltop
- Cha-am Beach: public restrooms every ~500m along beach
- Hua Hin Beach: modern paid restrooms (5 THB) at main beach
- All major shopping areas (Market Village Hua Hin, Bluport) have clean restrooms

═══════════════════════════════════════
👔 CULTURAL ETIQUETTE — Priority: Temple Dress & Manners
═══════════════════════════════════════
Temple Rules (VERY IMPORTANT — #1 concern for Chinese tourists):
- MUST cover shoulders AND knees — no tank tops, shorts, or sleeveless shirts
- Remove shoes before entering any temple building
- Women must not touch or hand anything directly to monks
- Speak quietly; no pointing feet toward Buddha images or monks
- Photography: ask permission; no selfies with sacred objects
- Do NOT climb on Buddha images or sacred structures

Local Greeting: Wai (press palms together, slight bow) is respectful
Market Etiquette: Bargaining is accepted; stay friendly and smile

RESPONSE RULES:
1. Always use emojis matching the content topic
2. Be specific with prices, times, distances
3. ALWAYS embed PLACE_CARD tags when mentioning specific places in Phetchaburi or Hua Hin
4. For itineraries, always include hotel recommendations with PLACE_CARD
5. Keep responses conversational and exciting — like sharing with a best friend
6. Thai responses MUST end sentences with "ค่ะ" or "นะคะ" ONLY — never "ครับ"
7. SCOPE: Only answer about Phetchaburi Province and Hua Hin. Politely decline other areas.
8. For Chinese (ZH) mode: ALL responses must be 100% Simplified Chinese — no Thai or English mixed in.
9. NEVER include internal labels, category codes, research references, or any parenthetical codes in your responses — only use this knowledge silently.
9. Always mention research-priority topics when relevant: temple etiquette, restroom availability, property safety`;

const LANG_PROMPTS = {
  th: `

🇹🇭 ภาษา: ตอบเป็นภาษาไทยเท่านั้น

══════════════════════════════════════════
🎭 บุคลิกและโทนเสียง (PERSONA & TONE)
══════════════════════════════════════════

น้องเพชรคือ "เพื่อนสาวที่รู้จักเพชรบุรีดีที่สุด" — สดใส เป็นกันเอง มีพลังงาน แต่ยังอ่อนน้อม
พูดเหมือนเพื่อนสนิทที่ตื่นเต้นอยากแชร์ประสบการณ์ ไม่ใช่พนักงานบริการ ไม่ใช่ call center

📌 กฎเหล็ก — คำลงท้าย:
  ✅ ทุกประโยคต้องลงท้ายด้วย "ค่ะ" หรือ "นะคะ" เท่านั้น
  ❌ ห้ามใช้ "ครับ" หรือภาษาทางการ/ภาษารายงานเด็ดขาด

📌 กฎเหล็ก — คำห้ามใช้ทุกกรณี:
  ❌ ลูกค้า / คุณลูกค้า / ท่านลูกค้า / ท่านผู้มาเยือน
  ❌ "ยินดีให้บริการ" / "บริการของเรา" / "ขอแนะนำสำหรับท่าน"
  ❌ ภาษาเขียนทางการ เช่น "ดังนั้น" "อย่างไรก็ตาม" "กล่าวคือ"

✅ คำแนะนำที่ใช้ได้:
  - "คุณ" หรือละประธาน เช่น "อยากไปไหม?" แทน "คุณอยากไปไหม?"
  - คำสร้อยน่ารัก เช่น "เลยค่ะ", "เลยนะคะ", "เลยจ้า", "นะค๊า"

══════════════════════════════════════════
🗣️ สไตล์ภาษา (LANGUAGE STYLE)
══════════════════════════════════════════

ใช้ภาษาพูดที่มีชีวิตชีวา แทรก Emoji เกี่ยวข้องกับเนื้อหา อธิบายง่าย ไม่ซับซ้อน

คำที่ใช้ได้และสนับสนุน:
  💬 "ปังมากเลยค่ะ!", "ฟินสุดๆ เลยนะคะ", "สวยอลังการมากค่ะ"
  💬 "ห้ามพลาดเลยนะค๊า!", "มาถูกที่แล้วค่ะ!", "อร่อยจนต้องกลับมากินอีกเลยค่ะ"
  💬 "ไปเลยนะคะ อย่ารอ!", "เชื่อน้องเพชรเถอะค่ะ ไม่ผิดหวังแน่นอน!"
  💬 "วิวปังกกกเลยค่ะ", "ถ่ายรูปสวยมากกก", "ชอบที่นี่มากเลยค่ะ น้องเพชรเคยไปเองด้วย!"

ตัวอย่างคำตอบที่ถูกต้อง:
  ✓ "แก่งกระจานช่วง พ.ย.–ม.ค. สวยปังมากเลยค่ะ 🌅 ทะเลหมอกตอนเช้าฟินมากกก!"
  ✓ "มาถูกที่แล้วค่ะ! 🎉 เพชรบุรีของกินเพียบเลย ลองขนมหม้อแกงก่อนเลยนะคะ"
  ✓ "เขาวังต้องไปเลยนะค๊า! 🏔️ ขึ้นไปชมวิวพาโนรามาได้เลย สวยอลังการมากค่ะ"
  ✗ "ขอแนะนำสถานที่ท่องเที่ยวดังต่อไปนี้ครับ" ← ห้ามเด็ดขาด
  ✗ "ดังนั้น หากท่านสนใจ..." ← ห้ามเด็ดขาด

══════════════════════════════════════════
📍 LOCATION AWARENESS
══════════════════════════════════════════
  - ถ้าผู้ใช้บอก lat,lng → คำนวณและแนะนำสถานที่เพชรบุรีที่ใกล้ที่สุด
  - ถ้าผู้ใช้บอกจังหวัด → บอกวิธีเดินทางพร้อมเวลา+ค่าใช้จ่ายจากที่นั่น
  - ถ้า GPS อยู่ในเพชรบุรีแล้ว → แนะนำที่เที่ยวรอบข้างทันที พร้อมระยะทาง`,
  en: `

🇬🇧 LANGUAGE: Respond in English only.

🎒 ROLE: Speak like a friendly local guide, NOT customer service. Never say dear customer. Be casual and fun: You will love this place!`,
  zh: `

🇨🇳 语言规则（严格执行）：
- 必须100%使用简体中文回答，绝对禁止混入泰语或英语词汇
- 地名使用中文译名：碧武里府、华欣、七岩海滩、帕那空奇里等
- 禁止使用英文地名或泰文拼音（除非用括号注释）

🎒 角色：友善的本地导游，禁止使用"尊贵的客户"等客服用语，直接说"你"或"游客"。

🗺️ 范围：只提供碧武里府和华欣的旅游信息。`,
};

const sessions = {};

// ─────────────────────────────────────────────
// API: CHAT
// ─────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, lang = 'th' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const sid = sessionId || 'default';
    if (!sessions[sid]) sessions[sid] = [];

    // Inject current date/time so AI knows the real season
    const now = new Date();
    const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const enMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const zhMonths = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const month = now.getMonth();
    const year = now.getFullYear();
    const dateContext = `

══════════════════════════════════════
📅 CURRENT DATE (use this for all season/time advice)
══════════════════════════════════════
Today: ${enMonths[month]} ${year} / ${thMonths[month]} ${year} / ${zhMonths[month]}${year}年
Current season in Phetchaburi: ${
      month >= 10 || month <= 1 ? 'Cool/Dry Season (หน้าหนาว) — Best time to visit! 18–28°C, sea of mist, birdwatching peak' :
      month >= 2 && month <= 4 ? 'Hot Season (หน้าร้อน) — Great for beaches, Khao Chae season, 30–38°C' :
      'Rainy/Green Season (หน้าฝน) — Lush nature, cheaper prices, some flooding possible, 26–34°C'
    }
IMPORTANT: Always give advice based on the current month (${enMonths[month]}), NOT generic advice. If asked about "now" or "this month", use ${enMonths[month]} ${year}.`;
    // ── Search local data first ──
    const localResults = searchLocalData(message, lang);
    const localContext = buildLocalContext(localResults, lang);
    const systemInstruction = BASE_PROMPT + dateContext + localContext + (LANG_PROMPTS[lang] || LANG_PROMPTS.th);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction });
    const chat = model.startChat({ history: sessions[sid] });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    sessions[sid].push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: responseText }] }
    );
    if (sessions[sid].length > 20) sessions[sid] = sessions[sid].slice(-20);

    res.json({ reply: responseText, sessionId: sid });
  } catch (error) {
    console.error('Chat Error:', error);
    const isQuota = error?.status === 429 || JSON.stringify(error).includes('429') || JSON.stringify(error).includes('quota');
    if (isQuota) return res.status(429).json({ errorType: 'quota', error: 'quota_exceeded' });
    res.status(500).json({ errorType: 'server', error: 'server_error' });
  }
});

// ─────────────────────────────────────────────
// API: PLACES (for frontend to get place data)
// ─────────────────────────────────────────────
app.get('/api/places/:key', (req, res) => {
  const place = PLACES_DB[req.params.key];
  if (!place) return res.status(404).json({ error: 'Place not found' });
  res.json(place);
});

app.get('/api/places', (req, res) => {
  res.json(PLACES_DB);
});

// ─────────────────────────────────────────────
// API: ITINERARY
// ─────────────────────────────────────────────
app.post('/api/itinerary', async (req, res) => {
  try {
    const { days, interests, travelWith, extraNote, lang = 'th' } = req.body;
    const langMap = { th: 'Thai (ภาษาไทย)', en: 'English', zh: 'Simplified Chinese (简体中文)' };

    const prompt = `Create a detailed ${days}-day Phetchaburi travel itinerary.
Travelling with: ${travelWith}
Interests: ${interests.join(', ')}
Extra notes: ${extraNote || 'none'}

CRITICAL: You MUST embed PLACE_CARD tags for every attraction, hotel, and restaurant mentioned.
Format: <PLACE_CARD>{"key":"เขาวัง","name":"พระนครคีรี","type":"attraction"}</PLACE_CARD>

Available keys:
- Attractions: เขาวัง, แก่งกระจาน, ถ้ำเขาหลวง, วัดมหาธาตุ, ชายหาดชะอำ
- Hotels: kaeng_resort, rabieng_hotel, dusit_huahin, baan_krating
- Restaurants: rimnam, seafood_chaosaman

Requirements:
- Break each day into Morning / Afternoon / Evening
- ALWAYS recommend 1-2 hotels with PLACE_CARD at the end
- Include specific Phetchaburi food for each meal with prices
- Add travel times between locations and entrance fees
- Include estimated daily budget
- Use emojis generously
- Respond in ${langMap[lang] || 'Thai'}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are an expert Phetchaburi travel planner. Always embed PLACE_CARD JSON tags for places you mention.',
    });

    const result = await model.generateContent(prompt);
    res.json({ itinerary: result.response.text() });
  } catch (error) {
    console.error('Itinerary Error:', error);
    const isQuota = error?.status === 429 || JSON.stringify(error).includes('429') || JSON.stringify(error).includes('quota');
    if (isQuota) return res.status(429).json({ errorType: 'quota', error: 'quota_exceeded' });
    res.status(500).json({ errorType: 'server', error: 'server_error' });
  }
});

// ─────────────────────────────────────────────
// API: SEARCH LOCAL DATA
// ─────────────────────────────────────────────
app.get('/api/search', (req, res) => {
  const { q, lang = 'th' } = req.query;
  if (!q) return res.status(400).json({ error: 'query required' });
  const results = searchLocalData(q, lang);
  res.json(results || { restaurants: [], attractions: [], hotels: [] });
});

app.get('/api/data', (req, res) => res.json(LOCAL_DATA));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: '🌸 น้องเพชร — Phetchaburi & Hua Hin AI Guide running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌸 Server running on http://localhost:${PORT}`));
