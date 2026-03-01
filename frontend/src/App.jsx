import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

// ============================================================
// LANGUAGE CONFIG
// ============================================================
const LANGS = {
  th: {
    code: "th", label: "🇹🇭 ไทย",
    placeholder: "ถามเรื่องการท่องเที่ยวเพชรบุรี...",
    welcome: "สวัสดีค่ะ! 🌿 ฉันชื่อ น้องเพชร ไกด์ท่องเที่ยวเพชรบุรีของคุณ\n\nจะถามเรื่องที่เที่ยว 🏛️ อาหาร 🍽️ หรือการเดินทาง 🚗 ก็ได้เลยนะคะ!",
    subtitle: "ไกด์ท่องเที่ยวเพชรบุรี • AI-Powered",
    errorMsg: "❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server และลองใหม่นะคะ",
    quotaMsg: "⚠️ ขณะนี้ AI ให้บริการเกินโควต้าต่อวันแล้วค่ะ 😔\n\nกรุณาลองใหม่อีกครั้งในวันพรุ่งนี้ หรือติดต่อผู้ดูแลระบบเพื่อเพิ่ม API quota ค่ะ 🙏",
    plannerTab: "🗺️ จัดทริป", chatTab: "💬 แชท",
    plannerTitle: "วางแผนทริปเพชรบุรี",
    plannerSubtitle: "บอกความต้องการ แล้วปล่อยให้ AI จัดแผนให้!",
    days: "จำนวนวัน", interests: "ความสนใจ", travelWith: "เดินทางกับ",
    generateBtn: "✨ สร้างแผนทริป", generating: "⏳ กำลังวางแผน...",
    interestOptions: ["🏔️ ภูเขา/ป่า", "🏖️ ทะเล/ชายหาด", "🏛️ ประวัติศาสตร์", "🍽️ อาหาร/ของฝาก", "🌅 พระอาทิตย์ตก", "🦜 ดูนก/ธรรมชาติ"],
    travelOptions: ["คนเดียว", "คู่รัก", "ครอบครัว", "เพื่อนกลุ่ม"],
    suggestions: ["🏛️ ที่เที่ยวแนะนำในเพชรบุรี?", "🍮 ของกินขึ้นชื่อมีอะไรบ้าง?", "🚗 เดินทางจากกรุงเทพยังไง?", "📅 ช่วงไหนเที่ยวดีที่สุด?", "💰 งบประมาณเที่ยวเพชรบุรี?"],
    quickMenu: [
      { icon: "📸", label: "สถานที่ถ่ายรูป", msg: "แนะนำสถานที่ถ่ายรูปสวยๆ ในเพชรบุรี" },
      { icon: "🛍️", label: "ของฝากขึ้นชื่อ", msg: "ของฝากขึ้นชื่อเพชรบุรีมีอะไรบ้าง และราคาเท่าไหร่?" },
      { icon: "🏨", label: "ที่พักแนะนำ", msg: "แนะนำที่พักในเพชรบุรีตามงบประมาณ" },
      { icon: "🚨", label: "เบอร์ฉุกเฉิน", msg: "เบอร์โทรฉุกเฉินและโรงพยาบาลในเพชรบุรี" },
      { icon: "🎭", label: "กิจกรรมวัฒนธรรม", msg: "กิจกรรมเชิงวัฒนธรรมในเพชรบุรีมีอะไรบ้าง?" },
      { icon: "👔", label: "มารยาทวัด", msg: "การแต่งกายเข้าวัดและมารยาทสำคัญในเพชรบุรี" },
      { icon: "💰", label: "คำนวณงบ", msg: "ช่วยประมาณค่าใช้จ่ายเที่ยวเพชรบุรี 2 วัน 1 คืน" },
      { icon: "🎪", label: "เทศกาลงานประจำปี", msg: "เทศกาลและงานประจำปีในเพชรบุรีมีอะไรบ้าง?" },
    ],
  },
  en: {
    code: "en", label: "🇬🇧 EN",
    placeholder: "Ask about Phetchaburi tourism...",
    welcome: "Hello! 🌿 I'm Nong Phet, your Phetchaburi travel guide.\n\nAsk me about attractions 🏛️, food 🍽️, or how to get there 🚗!",
    subtitle: "Phetchaburi Travel Guide • AI-Powered",
    errorMsg: "❌ An error occurred. Please check the server and try again.",
    quotaMsg: "⚠️ AI service has reached its daily quota limit 😔\n\nPlease try again tomorrow, or contact the admin to increase the API quota 🙏",
    plannerTab: "🗺️ Plan Trip", chatTab: "💬 Chat",
    plannerTitle: "Plan Your Phetchaburi Trip",
    plannerSubtitle: "Tell us your preferences and let AI plan for you!",
    days: "Number of Days", interests: "Interests", travelWith: "Travelling With",
    generateBtn: "✨ Generate Itinerary", generating: "⏳ Planning...",
    interestOptions: ["🏔️ Mountain/Forest", "🏖️ Beach/Sea", "🏛️ History", "🍽️ Food/Souvenirs", "🌅 Sunset", "🦜 Birdwatching"],
    travelOptions: ["Solo", "Couple", "Family", "Friends"],
    suggestions: ["🏛️ Top attractions?", "🍮 Famous local food?", "🚗 Getting from Bangkok?", "📅 Best season?", "💰 Budget estimate?"],
    quickMenu: [
      { icon: "📸", label: "Photo Spots", msg: "Best photography spots in Phetchaburi" },
      { icon: "🛍️", label: "Souvenirs", msg: "Famous souvenirs from Phetchaburi and their prices" },
      { icon: "🏨", label: "Accommodation", msg: "Accommodation recommendations by budget in Phetchaburi" },
      { icon: "🚨", label: "Emergency", msg: "Emergency numbers and hospitals in Phetchaburi" },
      { icon: "🎭", label: "Cultural Activities", msg: "Cultural activities available in Phetchaburi" },
      { icon: "👔", label: "Temple Etiquette", msg: "Dress code and etiquette for visiting temples in Phetchaburi" },
      { icon: "💰", label: "Budget Calculator", msg: "Estimate travel expenses for 2 days in Phetchaburi for 1 person" },
      { icon: "🎪", label: "Festivals", msg: "Annual festivals and special events in Phetchaburi" },
    ],
  },
  zh: {
    code: "zh", label: "🇨🇳 中文",
    placeholder: "询问碧武里旅游...",
    welcome: "您好！🌿 我是小碧，您的碧武里旅游向导。\n\n可以问我景点 🏛️、美食 🍽️ 或交通 🚗！",
    subtitle: "碧武里旅游向导 • AI导览",
    errorMsg: "❌ 发生错误，请检查服务器后重试。",
    quotaMsg: "⚠️ AI服务已达到每日配额限制 😔\n\n请明天再试，或联系管理员增加API配额 🙏",
    plannerTab: "🗺️ 行程规划", chatTab: "💬 聊天",
    plannerTitle: "碧武里行程规划",
    plannerSubtitle: "告诉我们您的需求，让AI为您规划！",
    days: "天数", interests: "兴趣爱好", travelWith: "出行方式",
    generateBtn: "✨ 生成行程", generating: "⏳ 规划中...",
    interestOptions: ["🏔️ 山/森林", "🏖️ 海滩", "🏛️ 历史", "🍽️ 美食/纪念品", "🌅 日落", "🦜 观鸟"],
    travelOptions: ["独行", "情侣", "家庭", "朋友"],
    suggestions: ["🏛️ 推荐景点？", "🍮 著名美食？", "🚗 从曼谷怎么去？", "📅 最佳旅游季节？", "💰 旅游预算？"],
    quickMenu: [
      { icon: "📸", label: "拍照胜地", msg: "碧武里最佳拍照地点推荐" },
      { icon: "🛍️", label: "特产纪念品", msg: "碧武里著名特产和纪念品有哪些？价格如何？" },
      { icon: "🏨", label: "住宿推荐", msg: "按预算推荐碧武里住宿" },
      { icon: "🚨", label: "紧急联系", msg: "碧武里紧急电话和医院信息" },
      { icon: "🎭", label: "文化活动", msg: "碧武里有哪些文化体验活动？" },
      { icon: "👔", label: "寺庙礼仪", msg: "参观碧武里寺庙的着装要求和礼仪" },
      { icon: "💰", label: "预算计算", msg: "帮我估算1人在碧武里游玩2天的费用" },
      { icon: "🎪", label: "节庆活动", msg: "碧武里有哪些年度节庆和特别活动？" },
    ],
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
      <div className="avatar">🌿</div>
      <div className="bubble"><span className="dot"/><span className="dot"/><span className="dot"/></div>
    </div>
  );
}

function Message({ msg }) {
  return (
    <div className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
      {msg.role === "bot" && <div className="avatar">{msg.isQuota ? "⚠️" : "🌿"}</div>}
      <div
        className={`bubble ${msg.isQuota ? "quota-bubble" : ""}`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
      />
      {msg.role === "user" && <div className="avatar user-avatar">👤</div>}
    </div>
  );
}

// ============================================================
// ITINERARY PLANNER COMPONENT
// ============================================================
function ItineraryPlanner({ lang, darkMode }) {
  const L = LANGS[lang];
  const [days, setDays] = useState(1);
  const [interests, setInterests] = useState([]);
  const [travelWith, setTravelWith] = useState(L.travelOptions[0]);
  const [extraNote, setExtraNote] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const generate = async () => {
    if (interests.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, interests, travelWith, extraNote, lang }),
      });
      const data = await res.json();
      if (res.status === 429 || data.errorType === "quota") {
        setResult("QUOTA_ERROR");
        return;
      }
      setResult(data.itinerary || data.error);
    } catch {
      setResult("❌ เกิดข้อผิดพลาด กรุณาตรวจสอบ Server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <div className="planner-header">
        <h2>{L.plannerTitle}</h2>
        <p>{L.plannerSubtitle}</p>
      </div>

      <div className="planner-form">
        {/* Days selector */}
        <div className="form-group">
          <label>{L.days}</label>
          <div className="day-selector">
            {[1,2,3,4,5].map(d => (
              <button key={d} className={`day-btn ${days === d ? "active" : ""}`} onClick={() => setDays(d)}>
                {d} {lang === "th" ? "วัน" : lang === "zh" ? "天" : "day"}
              </button>
            ))}
          </div>
        </div>

        {/* Travel With */}
        <div className="form-group">
          <label>{L.travelWith}</label>
          <div className="travel-selector">
            {L.travelOptions.map(t => (
              <button key={t} className={`travel-btn ${travelWith === t ? "active" : ""}`} onClick={() => setTravelWith(t)}>
                {t === "คนเดียว" || t === "Solo" || t === "独行" ? "🧳 " : t === "คู่รัก" || t === "Couple" || t === "情侣" ? "💑 " : t === "ครอบครัว" || t === "Family" || t === "家庭" ? "👨‍👩‍👧 " : "👫 "}{t}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="form-group">
          <label>{L.interests}</label>
          <div className="interest-grid">
            {L.interestOptions.map(item => (
              <button key={item} className={`interest-chip ${interests.includes(item) ? "selected" : ""}`} onClick={() => toggleInterest(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Extra note */}
        <div className="form-group">
          <label>{lang === "th" ? "📝 เพิ่มเติม (ไม่บังคับ)" : lang === "zh" ? "📝 备注（可选）" : "📝 Extra notes (optional)"}</label>
          <input
            className="extra-input"
            placeholder={lang === "th" ? "เช่น มีเด็กเล็ก, ไม่ชอบรถทางไกล..." : lang === "zh" ? "如：有小孩，不喜欢长途驾车..." : "e.g. travelling with kids, no long drives..."}
            value={extraNote}
            onChange={e => setExtraNote(e.target.value)}
          />
        </div>

        <button
          className={`generate-btn ${loading ? "loading" : ""} ${interests.length === 0 ? "disabled" : ""}`}
          onClick={generate}
          disabled={loading || interests.length === 0}
        >
          {loading ? L.generating : L.generateBtn}
        </button>

        {interests.length === 0 && (
          <p className="hint-text">
            {lang === "th" ? "⬆️ เลือกความสนใจอย่างน้อย 1 อย่าง" : lang === "zh" ? "⬆️ 请至少选择一个兴趣" : "⬆️ Select at least one interest"}
          </p>
        )}
      </div>

      {/* Result */}
      {loading && (
        <div className="itinerary-loading">
          <div className="loading-dots"><span/><span/><span/></div>
          <p>{lang === "th" ? "AI กำลังวางแผนทริปให้คุณ..." : lang === "zh" ? "AI正在为您规划行程..." : "AI is planning your trip..."}</p>
        </div>
      )}

      {result && !loading && result === "QUOTA_ERROR" && (
        <div className="quota-notice">
          <div className="quota-icon">⚠️</div>
          <div className="quota-title">{lang === "th" ? "AI เกินโควต้าต่อวัน" : lang === "zh" ? "超出每日配额" : "Daily Quota Exceeded"}</div>
          <p>{lang === "th" ? "ขณะนี้ AI ให้บริการเกินโควต้าต่อวันแล้ว กรุณาลองใหม่พรุ่งนี้ หรือแจ้งผู้ดูแลระบบเพิ่ม API quota" : lang === "zh" ? "AI服务已达每日限额，请明天再试或联系管理员" : "AI service has hit its daily limit. Try again tomorrow or contact admin to add API quota."}</p>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="quota-link">
            🔑 {lang === "th" ? "สร้าง API Key ใหม่" : lang === "zh" ? "创建新API密钥" : "Create New API Key"}
          </a>
        </div>
      )}
      {result && !loading && result !== "QUOTA_ERROR" && (
        <div className="itinerary-result">
          <div className="result-header">
            <span>🗺️ {lang === "th" ? "แผนทริปของคุณ" : lang === "zh" ? "您的行程" : "Your Itinerary"}</span>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result)}>
              📋 {lang === "th" ? "คัดลอก" : lang === "zh" ? "复制" : "Copy"}
            </button>
          </div>
          <div className="result-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}/>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [lang, setLang] = useState("th");
  const [darkMode, setDarkMode] = useState(isNightTime());
  const [autoNight, setAutoNight] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" | "planner"
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

  useEffect(() => { document.body.classList.toggle("dark", darkMode); }, [darkMode]);
  useEffect(() => { setMessages([{ role: "bot", text: LANGS[lang].welcome }]); }, [lang]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId, lang]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const toggleDark = () => { setAutoNight(false); setDarkMode(d => !d); };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="bg-decoration">
        <div className="circle c1"/><div className="circle c2"/><div className="circle c3"/>
      </div>

      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <div className="bot-icon">🌿</div>
            <div>
              <h1>น้องเพชร</h1>
              <p>{L.subtitle}</p>
            </div>
          </div>
          <div className="header-controls">
            <div className="lang-selector">
              <button className="lang-btn" onClick={() => setShowLangMenu(s => !s)}>{LANGS[lang].label} ▾</button>
              {showLangMenu && (
                <div className="lang-menu">
                  {Object.values(LANGS).map(l => (
                    <button key={l.code} className={`lang-option ${lang === l.code ? "active" : ""}`}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}>{l.label}</button>
                  ))}
                </div>
              )}
            </div>
            <button className={`dark-toggle ${darkMode ? "is-dark" : ""}`} onClick={toggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Tab bar */}
        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
            {L.chatTab}
          </button>
          <button className={`tab-btn ${activeTab === "planner" ? "active" : ""}`} onClick={() => setActiveTab("planner")}>
            {L.plannerTab}
          </button>
        </div>

        {autoNight && darkMode && activeTab === "chat" && (
          <div className="night-notice">🌙 Dark Mode อัตโนมัติ — กลางคืนเมืองเพชร</div>
        )}

        {/* Chat tab */}
        {activeTab === "chat" && (
          <>
            <div className="messages-area">
              {messages.map((msg, i) => <Message key={i} msg={msg}/>)}
              {loading && <TypingIndicator/>}
              <div ref={bottomRef}/>
            </div>

            {/* Quick Menu — show when first message only */}
            {messages.length <= 1 && (
              <>
                <div className="suggestions">
                  {L.suggestions.map((q, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
                <div className="quick-menu-label">
                  {lang === "th" ? "🔖 เมนูด่วน" : lang === "zh" ? "🔖 快捷菜单" : "🔖 Quick Menu"}
                </div>
                <div className="quick-menu">
                  {L.quickMenu.map((item, i) => (
                    <button key={i} className="quick-menu-btn" onClick={() => sendMessage(item.msg)}>
                      <span className="qm-icon">{item.icon}</span>
                      <span className="qm-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="input-area">
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={L.placeholder} rows={1} disabled={loading}/>
              <button className={`send-btn ${loading ? "loading" : ""}`} onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? "⏳" : "➤"}
              </button>
            </div>
          </>
        )}

        {/* Planner tab */}
        {activeTab === "planner" && (
          <div className="planner-scroll">
            <ItineraryPlanner lang={lang} darkMode={darkMode}/>
          </div>
        )}
      </div>
    </div>
  );
}
