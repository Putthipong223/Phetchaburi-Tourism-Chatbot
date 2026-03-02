import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

// ============================================================
// LANGUAGE CONFIG
// ============================================================
const LANGS = {
  th: {
    code: "th", label: "🇹🇭 ไทย",
    placeholder: "ถามน้องเพชรเรื่องเพชรบุรี...",
    welcome: "สวัสดีค่ะ! 🌿 ฉันชื่อ **น้องเพชร** ไกด์ท่องเที่ยว AI สำหรับเพชรบุรีของคุณ\n\nจะถามเรื่องที่เที่ยว 🏛️ อาหาร 🍽️ ที่พัก 🏨 หรือการเดินทาง 🚗 ก็ได้เลยนะคะ!",
    newChat: "แชทใหม่", subtitle: "AI Tourism Guide",
    errorMsg: "❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server และลองใหม่นะคะ",
    quotaMsg: "⚠️ ขณะนี้ AI ให้บริการเกินโควต้าต่อวันแล้วค่ะ 😔\n\nกรุณาลองใหม่อีกครั้งในวันพรุ่งนี้ หรือติดต่อผู้ดูแลระบบเพื่อเพิ่ม API quota ค่ะ 🙏",
    plannerTab: "🗺️ จัดทริป", chatTab: "💬 แชท",
    plannerTitle: "วางแผนทริปเพชรบุรี",
    plannerSubtitle: "บอกความต้องการ แล้วปล่อยให้ AI จัดแผนให้!",
    days: "จำนวนวัน", interests: "ความสนใจ", travelWith: "เดินทางกับ",
    generateBtn: "✨ สร้างแผนทริป", generating: "⏳ กำลังวางแผน...",
    interestOptions: ["🏔️ ภูเขา/ป่า", "🏖️ ทะเล/ชายหาด", "🏛️ ประวัติศาสตร์", "🍽️ อาหาร/ของฝาก", "🌅 พระอาทิตย์ตก", "🦜 ดูนก/ธรรมชาติ"],
    travelOptions: ["คนเดียว", "คู่รัก", "ครอบครัว", "เพื่อนกลุ่ม"],
    quickMenu: [
      { icon: "📸", label: "สถานที่ถ่ายรูป", msg: "แนะนำสถานที่ถ่ายรูปสวยๆ ในเพชรบุรี" },
      { icon: "🛍️", label: "ของฝากขึ้นชื่อ", msg: "ของฝากขึ้นชื่อเพชรบุรีมีอะไรบ้าง และราคาเท่าไหร่?" },
      { icon: "🏨", label: "ที่พักแนะนำ", msg: "แนะนำที่พักในเพชรบุรีตามงบประมาณ" },
      { icon: "🚨", label: "เบอร์ฉุกเฉิน", msg: "เบอร์โทรฉุกเฉินและโรงพยาบาลในเพชรบุรี" },
      { icon: "🎭", label: "กิจกรรมวัฒนธรรม", msg: "กิจกรรมเชิงวัฒนธรรมในเพชรบุรีมีอะไรบ้าง?" },
      { icon: "👔", label: "มารยาทวัด", msg: "การแต่งกายเข้าวัดและมารยาทสำคัญในเพชรบุรี" },
      { icon: "💰", label: "คำนวณงบ", msg: "ช่วยประมาณค่าใช้จ่ายเที่ยวเพชรบุรี 2 วัน 1 คืน" },
      { icon: "🎪", label: "เทศกาล", msg: "เทศกาลและงานประจำปีในเพชรบุรีมีอะไรบ้าง?" },
    ],
    sidebarItems: [
      { icon: "🏛️", label: "สถานที่ท่องเที่ยว", msg: "แนะนำสถานที่ท่องเที่ยวทั้งหมดในเพชรบุรี" },
      { icon: "🍽️", label: "ร้านอาหาร", msg: "แนะนำร้านอาหารยอดนิยมในเพชรบุรี" },
      { icon: "🌤️", label: "ฤดูกาลท่องเที่ยว", msg: "ช่วงเวลาที่เหมาะสมในการท่องเที่ยวเพชรบุรีคือเมื่อไหร่?" },
      { icon: "🚌", label: "การเดินทาง", msg: "วิธีเดินทางจากกรุงเทพไปเพชรบุรีมีอะไรบ้าง?" },
      { icon: "🏕️", label: "แก่งกระจาน", msg: "อุทยานแห่งชาติแก่งกระจานมีอะไรน่าสนใจบ้าง?" },
      { icon: "🍮", label: "ขนมหม้อแกง", msg: "ขนมหม้อแกงเพชรบุรี ราคาเท่าไหร่ ซื้อได้ที่ไหน?" },
    ],
    suggestions: ["🏛️ ที่เที่ยวแนะนำ?", "🍮 ของกินขึ้นชื่อ?", "🚗 เดินทางยังไง?", "📅 ช่วงไหนดีที่สุด?"],
  },
  en: {
    code: "en", label: "🇬🇧 EN",
    placeholder: "Ask about Phetchaburi...",
    welcome: "Hello! 🌿 I'm **Nong Phet**, your AI travel guide for Phetchaburi.\n\nAsk me about attractions 🏛️, food 🍽️, accommodation 🏨, or transport 🚗!",
    newChat: "New Chat", subtitle: "AI Tourism Guide",
    errorMsg: "❌ An error occurred. Please check the server and try again.",
    quotaMsg: "⚠️ AI service has reached its daily quota limit 😔\n\nPlease try again tomorrow, or contact the admin to increase the API quota 🙏",
    plannerTab: "🗺️ Plan Trip", chatTab: "💬 Chat",
    plannerTitle: "Plan Your Phetchaburi Trip",
    plannerSubtitle: "Tell us your preferences and let AI plan for you!",
    days: "Days", interests: "Interests", travelWith: "Travelling With",
    generateBtn: "✨ Generate Itinerary", generating: "⏳ Planning...",
    interestOptions: ["🏔️ Mountain/Forest", "🏖️ Beach/Sea", "🏛️ History", "🍽️ Food/Souvenirs", "🌅 Sunset", "🦜 Birdwatching"],
    travelOptions: ["Solo", "Couple", "Family", "Friends"],
    quickMenu: [
      { icon: "📸", label: "Photo Spots", msg: "Best photography spots in Phetchaburi" },
      { icon: "🛍️", label: "Souvenirs", msg: "Famous souvenirs from Phetchaburi and their prices" },
      { icon: "🏨", label: "Accommodation", msg: "Accommodation recommendations by budget in Phetchaburi" },
      { icon: "🚨", label: "Emergency", msg: "Emergency numbers and hospitals in Phetchaburi" },
      { icon: "🎭", label: "Cultural Activities", msg: "Cultural activities available in Phetchaburi" },
      { icon: "👔", label: "Temple Etiquette", msg: "Dress code and etiquette for visiting temples" },
      { icon: "💰", label: "Budget", msg: "Estimate travel expenses for 2 days in Phetchaburi" },
      { icon: "🎪", label: "Festivals", msg: "Annual festivals and special events in Phetchaburi" },
    ],
    sidebarItems: [
      { icon: "🏛️", label: "Attractions", msg: "All tourist attractions in Phetchaburi" },
      { icon: "🍽️", label: "Restaurants", msg: "Top restaurants in Phetchaburi" },
      { icon: "🌤️", label: "Best Season", msg: "Best time to visit Phetchaburi?" },
      { icon: "🚌", label: "Transport", msg: "How to get from Bangkok to Phetchaburi?" },
      { icon: "🏕️", label: "Kaeng Krachan", msg: "What's great about Kaeng Krachan National Park?" },
      { icon: "🍮", label: "Khanom Mo Kaeng", msg: "What is Khanom Mo Kaeng and where to buy it?" },
    ],
    suggestions: ["🏛️ Top attractions?", "🍮 Famous food?", "🚗 Getting there?", "📅 Best season?"],
  },
  zh: {
    code: "zh", label: "🇨🇳 中文",
    placeholder: "询问碧武里旅游...",
    welcome: "您好！🌿 我是**小碧**，您的碧武里AI旅游向导。\n\n可以问我景点 🏛️、美食 🍽️、住宿 🏨 或交通 🚗！",
    newChat: "新对话", subtitle: "AI旅游向导",
    errorMsg: "❌ 发生错误，请检查服务器后重试。",
    quotaMsg: "⚠️ AI服务已达到每日配额限制 😔\n\n请明天再试，或联系管理员增加API配额 🙏",
    plannerTab: "🗺️ 行程规划", chatTab: "💬 聊天",
    plannerTitle: "碧武里行程规划", plannerSubtitle: "告诉我们您的需求，让AI为您规划！",
    days: "天数", interests: "兴趣", travelWith: "出行方式",
    generateBtn: "✨ 生成行程", generating: "⏳ 规划中...",
    interestOptions: ["🏔️ 山/森林", "🏖️ 海滩", "🏛️ 历史", "🍽️ 美食/纪念品", "🌅 日落", "🦜 观鸟"],
    travelOptions: ["独行", "情侣", "家庭", "朋友"],
    quickMenu: [
      { icon: "📸", label: "拍照胜地", msg: "碧武里最佳拍照地点推荐" },
      { icon: "🛍️", label: "特产纪念品", msg: "碧武里著名特产和纪念品有哪些？" },
      { icon: "🏨", label: "住宿推荐", msg: "按预算推荐碧武里住宿" },
      { icon: "🚨", label: "紧急联系", msg: "碧武里紧急电话和医院信息" },
      { icon: "🎭", label: "文化活动", msg: "碧武里有哪些文化体验活动？" },
      { icon: "👔", label: "寺庙礼仪", msg: "参观碧武里寺庙的着装要求和礼仪" },
      { icon: "💰", label: "预算计算", msg: "帮我估算1人在碧武里游玩2天的费用" },
      { icon: "🎪", label: "节庆活动", msg: "碧武里有哪些年度节庆？" },
    ],
    sidebarItems: [
      { icon: "🏛️", label: "所有景点", msg: "碧武里所有旅游景点介绍" },
      { icon: "🍽️", label: "餐厅推荐", msg: "碧武里热门餐厅推荐" },
      { icon: "🌤️", label: "最佳季节", msg: "碧武里最佳旅游时间是什么时候？" },
      { icon: "🚌", label: "交通方式", msg: "从曼谷到碧武里怎么去？" },
      { icon: "🏕️", label: "凯恩格拉占", msg: "凯恩格拉占国家公园有什么特色？" },
      { icon: "🍮", label: "椰奶蛋糕", msg: "碧武里椰奶蛋糕在哪里买？多少钱？" },
    ],
    suggestions: ["🏛️ 推荐景点？", "🍮 著名美食？", "🚗 怎么去？", "📅 最佳季节？"],
  },
};

function isNightTime() {
  const h = new Date().getHours();
  return h >= 18 || h < 6;
}

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/### (.+)/g, "<h4>$1</h4>")
    .replace(/## (.+)/g, "<h3>$1</h3>")
    .replace(/\n/g, "<br/>");
}

function TypingIndicator() {
  return (
    <div className="message bot-message typing">
      <div className="msg-avatar">🌿</div>
      <div className="bubble"><span className="dot"/><span className="dot"/><span className="dot"/></div>
    </div>
  );
}

function Message({ msg }) {
  return (
    <div className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
      {msg.role === "bot" && <div className="msg-avatar">{msg.isQuota ? "⚠️" : "🌿"}</div>}
      <div className={`bubble ${msg.isQuota ? "quota-bubble" : ""}`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}/>
      {msg.role === "user" && <div className="msg-avatar user-avatar">👤</div>}
    </div>
  );
}

// ============================================================
// ITINERARY PLANNER
// ============================================================
function ItineraryPlanner({ lang }) {
  const L = LANGS[lang];
  const [days, setDays] = useState(1);
  const [interests, setInterests] = useState([]);
  const [travelWith, setTravelWith] = useState(L.travelOptions[0]);
  const [extraNote, setExtraNote] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item) =>
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const generate = async () => {
    if (interests.length === 0) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, interests, travelWith, extraNote, lang }),
      });
      const data = await res.json();
      if (res.status === 429 || data.errorType === "quota") { setResult("QUOTA_ERROR"); return; }
      setResult(data.itinerary || data.error);
    } catch { setResult("❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server"); }
    finally { setLoading(false); }
  };

  return (
    <div className="planner-page">
      <div className="planner-inner">
        <div className="planner-hero">
          <h2>{L.plannerTitle}</h2>
          <p>{L.plannerSubtitle}</p>
        </div>
        <div className="planner-card">
          <div className="form-row">
            <div className="form-group">
              <label>{L.days}</label>
              <div className="day-selector">
                {[1,2,3,4,5].map(d => (
                  <button key={d} className={`day-btn ${days === d ? "active" : ""}`} onClick={() => setDays(d)}>
                    {d}{lang === "th" ? "วัน" : lang === "zh" ? "天" : "d"}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>{L.travelWith}</label>
              <div className="travel-selector">
                {L.travelOptions.map(t => (
                  <button key={t} className={`travel-btn ${travelWith === t ? "active" : ""}`} onClick={() => setTravelWith(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>{L.interests}</label>
            <div className="interest-grid">
              {L.interestOptions.map(item => (
                <button key={item} className={`interest-chip ${interests.includes(item) ? "selected" : ""}`} onClick={() => toggleInterest(item)}>{item}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>{lang === "th" ? "📝 หมายเหตุเพิ่มเติม" : lang === "zh" ? "📝 备注" : "📝 Extra notes"}</label>
            <input className="extra-input"
              placeholder={lang === "th" ? "เช่น มีเด็กเล็ก, ไม่ชอบรถทางไกล..." : lang === "zh" ? "如：有小孩..." : "e.g. travelling with kids..."}
              value={extraNote} onChange={e => setExtraNote(e.target.value)}/>
          </div>
          <button className={`generate-btn ${loading ? "loading" : ""} ${interests.length === 0 ? "disabled" : ""}`}
            onClick={generate} disabled={loading || interests.length === 0}>
            {loading ? L.generating : L.generateBtn}
          </button>
          {interests.length === 0 && <p className="hint-text">⬆️ {lang === "th" ? "เลือกความสนใจอย่างน้อย 1 อย่าง" : lang === "zh" ? "请至少选择一个兴趣" : "Select at least one interest"}</p>}
        </div>

        {loading && (
          <div className="itinerary-loading">
            <div className="loading-dots"><span/><span/><span/></div>
            <p>{lang === "th" ? "AI กำลังวางแผนทริปให้คุณ..." : lang === "zh" ? "AI正在规划..." : "AI is planning your trip..."}</p>
          </div>
        )}
        {result && !loading && result === "QUOTA_ERROR" && (
          <div className="quota-notice">
            <div className="quota-icon">⚠️</div>
            <div className="quota-title">{lang === "th" ? "AI เกินโควต้าต่อวัน" : lang === "zh" ? "超出每日配额" : "Daily Quota Exceeded"}</div>
            <p>{lang === "th" ? "กรุณาลองใหม่พรุ่งนี้" : lang === "zh" ? "请明天再试" : "Try again tomorrow"}</p>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="quota-link">🔑 Create New API Key</a>
          </div>
        )}
        {result && !loading && result !== "QUOTA_ERROR" && (
          <div className="itinerary-result">
            <div className="result-header">
              <span>🗺️ {lang === "th" ? "แผนทริปของคุณ" : lang === "zh" ? "您的行程" : "Your Itinerary"}</span>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result)}>📋 {lang === "th" ? "คัดลอก" : lang === "zh" ? "复制" : "Copy"}</button>
            </div>
            <div className="result-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP — FULL SCREEN DASHBOARD
// ============================================================
export default function App() {
  const [lang, setLang] = useState("th");
  const [darkMode, setDarkMode] = useState(isNightTime());
  const [autoNight, setAutoNight] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [showQuickMenu, setShowQuickMenu] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const L = LANGS[lang];

  const [messages, setMessages] = useState([{ role: "bot", text: LANGS["th"].welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!autoNight) return;
    const interval = setInterval(() => setDarkMode(isNightTime()), 60000);
    return () => clearInterval(interval);
  }, [autoNight]);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);
  useEffect(() => { setMessages([{ role: "bot", text: LANGS[lang].welcome }]); }, [lang]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const newChat = () => {
    setMessages([{ role: "bot", text: LANGS[lang].welcome }]);
    setInput("");
  };

  const sendMessage = useCallback(async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    if (activeTab !== "chat") setActiveTab("chat");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId, lang }),
      });
      const data = await res.json();
      if (res.status === 429 || data.errorType === "quota") {
        setMessages(prev => [...prev, { role: "bot", text: LANGS[lang].quotaMsg, isQuota: true }]);
        return;
      }
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: LANGS[lang].errorMsg }]);
    } finally { setLoading(false); }
  }, [input, loading, sessionId, lang, activeTab]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isWelcome = messages.length <= 1;

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""} ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">🌿</span>
            {sidebarOpen && <span className="brand-name">น้องเพชร</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(s => !s)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {sidebarOpen && (
          <>
            <button className="new-chat-btn" onClick={newChat}>
              ✏️ {L.newChat}
            </button>

            <nav className="sidebar-nav">
              <button className={`nav-item ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
                <span>💬</span><span className="nav-label">{L.chatTab}</span>
              </button>
              <button className={`nav-item ${activeTab === "planner" ? "active" : ""}`} onClick={() => setActiveTab("planner")}>
                <span>🗺️</span><span className="nav-label">{L.plannerTab}</span>
              </button>
            </nav>

            <div className="sidebar-section-label">เมนูด่วน</div>
            <nav className="sidebar-nav">
              {L.sidebarItems.map((item, i) => (
                <button key={i} className="nav-item" onClick={() => sendMessage(item.msg)}>
                  <span>{item.icon}</span><span className="nav-label">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-bottom">
              <div className="sidebar-section-label">การตั้งค่า</div>
              {/* Language */}
              <div className="lang-selector-side">
                <button className="nav-item" onClick={() => setShowLangMenu(s => !s)}>
                  <span>{LANGS[lang].label.split(" ")[0]}</span>
                  <span className="nav-label">{LANGS[lang].label.split(" ")[1]} ▾</span>
                </button>
                {showLangMenu && (
                  <div className="lang-dropdown">
                    {Object.values(LANGS).map(l => (
                      <button key={l.code} className={`lang-opt ${lang === l.code ? "active" : ""}`}
                        onClick={() => { setLang(l.code); setShowLangMenu(false); }}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Dark mode */}
              <button className="nav-item" onClick={() => { setAutoNight(false); setDarkMode(d => !d); }}>
                <span>{darkMode ? "☀️" : "🌙"}</span>
                <span className="nav-label">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </>
        )}

        {/* Collapsed icons */}
        {!sidebarOpen && (
          <div className="sidebar-icons">
            <button className="icon-btn" onClick={newChat} title={L.newChat}>✏️</button>
            <button className={`icon-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")} title="Chat">💬</button>
            <button className={`icon-btn ${activeTab === "planner" ? "active" : ""}`} onClick={() => setActiveTab("planner")} title="Planner">🗺️</button>
            <button className="icon-btn" onClick={() => { setAutoNight(false); setDarkMode(d => !d); }}>{darkMode ? "☀️" : "🌙"}</button>
          </div>
        )}
      </aside>

      {/* ── MAIN AREA ── */}
      <main className="main-area">

        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-title">
              {activeTab === "chat" ? "💬 " + L.chatTab : "🗺️ " + L.plannerTab}
            </span>
            {activeTab === "chat" && autoNight && darkMode && (
              <span className="night-pill">🌙 Dark Mode อัตโนมัติ</span>
            )}
          </div>
          <div className="topbar-right">
            {activeTab === "chat" && (
              <button className="qm-toggle-btn" onClick={() => setShowQuickMenu(s => !s)}
                title={showQuickMenu ? "ซ่อนเมนูด่วน" : "แสดงเมนูด่วน"}>
                {showQuickMenu ? "🔼 ซ่อนเมนูด่วน" : "🔽 เมนูด่วน"}
              </button>
            )}
            <button className="new-chat-btn-top" onClick={newChat}>✏️ {L.newChat}</button>
          </div>
        </header>

        {/* Content */}
        {activeTab === "chat" ? (
          <div className="chat-layout">
            {/* Messages */}
            <div className="messages-area">
              {isWelcome && (
                <div className="welcome-screen">
                  <div className="welcome-avatar">🌿</div>
                  <h1>{lang === "th" ? "สวัสดี! ฉันคือน้องเพชร" : lang === "zh" ? "您好！我是小碧" : "Hello! I'm Nong Phet"}</h1>
                  <p>{lang === "th" ? "ไกด์ท่องเที่ยว AI สำหรับจังหวัดเพชรบุรี" : lang === "zh" ? "碧武里AI旅游向导" : "AI Tourism Guide for Phetchaburi"}</p>
                  <div className="welcome-chips">
                    {L.suggestions.map((q, i) => (
                      <button key={i} className="welcome-chip" onClick={() => sendMessage(q)}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {!isWelcome && messages.map((msg, i) => <Message key={i} msg={msg}/>)}
              {loading && <TypingIndicator/>}
              <div ref={bottomRef}/>
            </div>

            {/* Bottom Input Area */}
            <div className="input-section">
              {/* Quick Menu above input */}
              {showQuickMenu && (
                <div className="quick-menu-bar">
                  {L.quickMenu.map((item, i) => (
                    <button key={i} className="qm-chip" onClick={() => sendMessage(item.msg)}>
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="input-box">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown} placeholder={L.placeholder} rows={1} disabled={loading}/>
                <button className={`send-btn ${loading ? "loading" : ""}`}
                  onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                  {loading ? "⏳" : "➤"}
                </button>
              </div>
              <p className="input-hint">{lang === "th" ? "Enter ส่ง • Shift+Enter ขึ้นบรรทัดใหม่" : lang === "zh" ? "Enter发送 • Shift+Enter换行" : "Enter to send • Shift+Enter for new line"}</p>
            </div>
          </div>
        ) : (
          <div className="planner-area">
            <ItineraryPlanner lang={lang}/>
          </div>
        )}
      </main>
    </div>
  );
}
