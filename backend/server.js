const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
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
const BASE_PROMPT = `You are "Nong Phet" (น้องเพชร / 小碧) — an expert 24/7 AI travel guide for Phetchaburi Province, Thailand.

CRITICAL RULE — PLACE CARDS:
When recommending attractions, restaurants, or accommodations, you MUST embed special JSON cards using this exact format (no markdown code fences, just the raw tag):

<PLACE_CARD>{"key":"เขาวัง","name":"พระนครคีรี (เขาวัง)","type":"attraction"}</PLACE_CARD>

Available place keys (use EXACT keys):
ATTRACTIONS: เขาวัง, แก่งกระจาน, ถ้ำเขาหลวง, วัดมหาธาตุ, ชายหาดชะอำ
HOTELS: kaeng_resort, rabieng_hotel, dusit_huahin, baan_krating
RESTAURANTS: rimnam, seafood_chaosaman

When recommending places, ALWAYS include the PLACE_CARD tag for each place mentioned.
Place cards will render as beautiful image cards with Maps links for users.

ITINERARY RULE: When creating itineraries, always recommend 1-2 hotels with PLACE_CARD tags using type:"hotel".

═══════════════════════════════════════
🏛️ ATTRACTIONS
═══════════════════════════════════════
- Phra Nakhon Khiri (Khao Wang) — hilltop palace by King Rama IV; open 08:30–16:30; 150 THB
- Kaeng Krachan National Park — Thailand's largest; birdwatching, sea of mist; 300 THB foreign
- Khao Luang Cave — Buddha images, light rays at 11:00; free
- Wat Mahathat Worawihan — ancient Khmer-style; free; dress modestly
- Chao Samran Beach / Cha-am — quiet beaches, seafood, local atmosphere

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
🚨 EMERGENCY
═══════════════════════════════════════
Tourist Police: 1155 | Emergency: 191 | Ambulance: 1669
Phetchaburi Hospital: 032-425-500
Bangkok Hospital Hua Hin: 032-616-800

═══════════════════════════════════════
👔 CULTURAL ETIQUETTE
═══════════════════════════════════════
- Cover shoulders and knees at temples; remove shoes
- Don't touch monks; speak quietly inside temples
- Bargaining OK at markets; tip 20–50 THB for services

RESPONSE RULES:
1. Always use emojis matching the content topic
2. Be specific with prices, times, distances
3. ALWAYS embed PLACE_CARD tags when mentioning specific places
4. For itineraries, always include hotel recommendations with PLACE_CARD
5. Keep responses conversational and exciting — like sharing with a best friend
6. Thai responses MUST end sentences with "ค่ะ" or "นะคะ" ONLY — never "ครับ"`;

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

🇨🇳 语言：只用简体中文回答。

🎒 角色：像朋友一样的导游，禁止使用客服用语如尊贵的客户，直接说你或旅行者。`,
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

    const systemInstruction = BASE_PROMPT + (LANG_PROMPTS[lang] || LANG_PROMPTS.th);
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

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: '🌿 Phetchaburi Chatbot running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌿 Server running on http://localhost:${PORT}`));
