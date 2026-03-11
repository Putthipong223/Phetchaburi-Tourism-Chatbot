// ══════════════════════════════════════════════
// MANUAL CONTENT COMPONENTS (3 languages)
// ══════════════════════════════════════════════
function ManualSection({icon, title, children}) {
  return (
    <div className="ms-section">
      <h3 className="ms-heading"><span className="ms-icon">{icon}</span>{title}</h3>
      <div className="ms-body">{children}</div>
    </div>
  );
}
function ManualTable({rows}) {
  return (
    <table className="ms-table">
      <tbody>{rows.map((r,i)=>(
        <tr key={i}><td className="ms-td-label">{r[0]}</td><td className="ms-td-val">{r[1]}</td></tr>
      ))}</tbody>
    </table>
  );
}

function ManualContentTH() {
  return (
    <div className="ms-wrap">
      <div className="ms-cover">
        <div className="ms-cover-badge">เวอร์ชัน 1.0 | มีนาคม 2568</div>
        <p className="ms-cover-desc">เอกสารฉบับนี้อธิบายการใช้งานระบบน้องเพชร ซึ่งเป็นระบบแชทบอท AI สำหรับการท่องเที่ยวจังหวัดเพชรบุรีและอำเภอหัวหิน พัฒนาด้วยเทคโนโลยี Gemini API</div>
      </div>

      <ManualSection icon="🎯" title="วัตถุประสงค์">
        <p>น้องเพชรถูกพัฒนาขึ้นเพื่ออำนวยความสะดวกด้านสารสนเทศการท่องเที่ยวด้วย AI ครอบคลุมพื้นที่ <strong>จังหวัดเพชรบุรี</strong> และ <strong>อำเภอหัวหิน</strong> โดยรองรับนักท่องเที่ยวชาวไทยและต่างชาติ</p>
        <ManualTable rows={[
          ["กลุ่มเป้าหมายหลัก","นักท่องเที่ยวชาวจีน (CNY), ไทย (THB), และต่างชาติ (USD)"],
          ["ช่องทางการเข้าถึง","เว็บเบราว์เซอร์ทั้ง Mobile และ Desktop"],
          ["เทคโนโลยีหลัก","Google Gemini API + React + Node.js"],
        ]}/>
      </ManualSection>

      <ManualSection icon="🗺️" title="ขอบเขตการให้บริการ">
        <div className="ms-grid-2">
          <div className="ms-card"><div className="ms-card-title">📍 เพชรบุรี</div><p>เขาวัง, ถ้ำเขาหลวง, แก่งกระจาน, วัดมหาธาตุ, ตลาดน้ำ, ขนมหม้อแกง และสถานที่สำคัญ 20+ แห่ง</p></div>
          <div className="ms-card"><div className="ms-card-title">🏖️ หัวหิน</div><p>ซิเคด้ามาร์เก็ต, วานานาวา, วัดห้วยมงคล, Monsoon Valley, อุทยานราชภักดิ์ และโรงแรม 5 ดาว</p></div>
        </div>
      </ManualSection>

      <ManualSection icon="⚙️" title="ฟังก์ชันหลัก">
        <div className="ms-feature-list">
          {[
            {n:"1", t:"ระบบแชทหลายภาษา", d:"ตอบคำถามท่องเที่ยวเป็นภาษาไทย, จีน และอังกฤษ ด้วย AI Gemini"},
            {n:"2", t:"Quick Menu", d:"ปุ่มทางลัด 10 หัวข้อยอดนิยม เช่น ร้านอาหาร, ที่พัก, เส้นทาง"},
            {n:"3", t:"คำนวณงบประมาณ", d:"รองรับ 3 สกุลเงิน (THB/CNY/USD) พร้อมแผนภูมิและเกณฑ์งบ"},
            {n:"4", t:"จัดทริป AI", d:"ออกแบบโปรแกรมการเดินทาง 1–5 วัน ตามความสนใจ"},
            {n:"5", t:"เบอร์ฉุกเฉิน", d:"1155 ตำรวจท่องเที่ยว, 191 ตำรวจ, 1669 พยาบาล/กู้ภัย"},
            {n:"6", t:"ข้อมูล GPS", d:"แนะนำสถานที่พร้อมลิงก์ Google Maps โดยอัตโนมัติ"},
          ].map(f=>(
            <div key={f.n} className="ms-feature-item">
              <div className="ms-feature-num">{f.n}</div>
              <div><strong>{f.t}</strong><br/><span className="ms-muted">{f.d}</span></div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="📖" title="ขั้นตอนการใช้งาน">
        <div className="ms-steps">
          {[
            {s:"1",t:"เลือกภาษา",d:"กดปุ่มเลือกภาษา (ไทย/EN/中文) ที่มุมซ้ายของหน้าจอ"},
            {s:"2",t:"พิมพ์คำถาม",d:"พิมพ์คำถามเกี่ยวกับเพชรบุรีหรือหัวหินในช่องแชท เช่น 'แนะนำร้านอาหารหัวหิน'"},
            {s:"3",t:"ใช้ Quick Menu",d:"กดปุ่มทางลัดเพื่อถามคำถามยอดนิยมได้เลย"},
            {s:"4",t:"จัดทริป",d:"ไปที่แท็บ 📚 จัดทริป เลือกจำนวนวันและความสนใจ กด 'สร้างแผน'"},
            {s:"5",t:"คำนวณงบ",d:"ไปที่แท็บ 💰 คำนวณงบ ใส่ข้อมูล เลือกสกุลเงิน ดูผลลัพธ์"},
          ].map(st=>(
            <div key={st.s} className="ms-step">
              <div className="ms-step-num">{st.s}</div>
              <div><strong>{st.t}</strong> — {st.d}</div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="💡" title="Best Practices & ข้อแนะนำ">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 ความปลอดภัย</div><p>บันทึกเบอร์ฉุกเฉิน 1155, 191, 1669 ไว้ก่อนเดินทาง พกพาสำเนาหนังสือเดินทาง</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 มารยาทวัฒนธรรม</div><p>แต่งกายสุภาพเข้าวัด (คลุมไหล่-เข่า) ถอดรองเท้าก่อนเข้าอุโบสถ ไม่ชี้เท้าหาพระพุทธรูป</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 ห้องน้ำ</div><p>แนะนำใช้ห้องน้ำ ปตท. หรือในห้างสรรพสินค้า เพื่อความสะอาดและปลอดภัย</p></div>
        </div>
      </ManualSection>

      <div className="ms-footer">
        <p>© 2568 น้องเพชร — ระบบ AI ท่องเที่ยวเพชรบุรี–หัวหิน | พัฒนาโดย Nong Phet Team</p>
        <p className="ms-muted">ข้อมูลราคาและเวลาอาจเปลี่ยนแปลงตามฤดูกาล กรุณาตรวจสอบอีกครั้งก่อนเดินทาง</p>
      </div>
    </div>
  );
}

function ManualContentEN() {
  return (
    <div className="ms-wrap">
      <div className="ms-cover">
        <div className="ms-cover-badge">Version 1.0 | March 2025</div>
        <p className="ms-cover-desc">This document describes how to use Nong Phet, an AI-powered tourism chatbot for Phetchaburi Province and Hua Hin District, powered by Google Gemini API.</p>
      </div>

      <ManualSection icon="🎯" title="Purpose">
        <p>Nong Phet was developed to provide intelligent tourism information assistance covering <strong>Phetchaburi Province</strong> and <strong>Hua Hin District</strong>, supporting Thai and international visitors.</p>
        <ManualTable rows={[
          ["Target Users","Chinese (CNY), Thai (THB), and International (USD) tourists"],
          ["Access","Web browser on Mobile & Desktop"],
          ["Core Technology","Google Gemini API + React + Node.js"],
        ]}/>
      </ManualSection>

      <ManualSection icon="🗺️" title="Coverage Area">
        <div className="ms-grid-2">
          <div className="ms-card"><div className="ms-card-title">📍 Phetchaburi</div><p>Khao Wang, Khao Luang Cave, Kaeng Krachan, Wat Mahathat, floating market, Khanom Mo Kaeng and 20+ attractions</p></div>
          <div className="ms-card"><div className="ms-card-title">🏖️ Hua Hin</div><p>Cicada Market, Vana Nava, Wat Huay Mongkol, Monsoon Valley, Rajabhakti Park and 5-star hotels</p></div>
        </div>
      </ManualSection>

      <ManualSection icon="⚙️" title="Core Functions">
        <div className="ms-feature-list">
          {[
            {n:"1",t:"Multilingual AI Chat",d:"Answer tourism questions in Thai, Chinese, and English via Gemini AI"},
            {n:"2",t:"Quick Menu",d:"10 popular shortcut topics: restaurants, hotels, routes, etc."},
            {n:"3",t:"Budget Calculator",d:"Supports THB/CNY/USD with charts and budget level indicators"},
            {n:"4",t:"AI Trip Planner",d:"Design 1–5 day itineraries based on your interests"},
            {n:"5",t:"Emergency Numbers",d:"1155 Tourist Police, 191 Police, 1669 Ambulance/Rescue"},
            {n:"6",t:"GPS Place Cards",d:"Automatic Google Maps links for recommended locations"},
          ].map(f=>(
            <div key={f.n} className="ms-feature-item">
              <div className="ms-feature-num">{f.n}</div>
              <div><strong>{f.t}</strong><br/><span className="ms-muted">{f.d}</span></div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="📖" title="How to Use">
        <div className="ms-steps">
          {[
            {s:"1",t:"Select Language",d:"Tap the language button (ไทย/EN/中文) on the left sidebar"},
            {s:"2",t:"Ask a Question",d:"Type your Phetchaburi or Hua Hin question, e.g. 'Best seafood restaurants Hua Hin'"},
            {s:"3",t:"Use Quick Menu",d:"Tap shortcut buttons for popular question topics"},
            {s:"4",t:"Plan a Trip",d:"Go to 📚 tab, select days and interests, tap 'Generate Plan'"},
            {s:"5",t:"Calculate Budget",d:"Go to 💰 tab, enter your details, choose currency, view result"},
          ].map(st=>(
            <div key={st.s} className="ms-step">
              <div className="ms-step-num">{st.s}</div>
              <div><strong>{st.t}</strong> — {st.d}</div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="💡" title="Best Practices">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 Safety</div><p>Save emergency numbers 1155, 191, 1669 before your trip. Carry a passport copy.</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 Temple Etiquette</div><p>Cover shoulders and knees at temples. Remove shoes before entering. No pointing feet toward Buddha images.</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 Restrooms</div><p>PTT gas stations and shopping malls have the cleanest restrooms. Paid restrooms (5 THB) are available at major beaches.</p></div>
        </div>
      </ManualSection>

      <div className="ms-footer">
        <p>© 2025 Nong Phet — Phetchaburi–Hua Hin AI Tourism System | Nong Phet Team</p>
        <p className="ms-muted">Prices and hours may vary by season. Please verify before travel.</p>
      </div>
    </div>
  );
}

function ManualContentZH() {
  return (
    <div className="ms-wrap">
      <div className="ms-cover">
        <div className="ms-cover-badge">版本 1.0 | 2025年3月</div>
        <p className="ms-cover-desc">本文档介绍小碧（น้องเพชร）AI旅游聊天机器人的使用方法，覆盖碧武里府和华欣区，由Google Gemini API驱动。</p>
      </div>

      <ManualSection icon="🎯" title="使用目的">
        <p>小碧专为赴泰旅游者提供智能旅游资讯服务，覆盖<strong>碧武里府</strong>和<strong>华欣区</strong>，支持中文、泰语和英语三种语言。</p>
        <ManualTable rows={[
          ["主要用户群","中国游客（人民币）、泰国游客（泰铢）、国际游客（美元）"],
          ["访问方式","手机/电脑网页浏览器"],
          ["核心技术","Google Gemini API + React + Node.js"],
        ]}/>
      </ManualSection>

      <ManualSection icon="🗺️" title="服务范围">
        <div className="ms-grid-2">
          <div className="ms-card"><div className="ms-card-title">📍 碧武里府</div><p>考旺宫、考銮洞、凯恩格拉占国家公园、玛哈泰寺、水上市场、椰奶蛋挞等20余处</p></div>
          <div className="ms-card"><div className="ms-card-title">🏖️ 华欣</div><p>蝉鸣集市、瓦纳纳瓦水上乐园、汇蒙刚寺、季风谷葡萄园、皇家忠诚公园及五星级酒店</p></div>
        </div>
      </ManualSection>

      <ManualSection icon="⚙️" title="核心功能">
        <div className="ms-feature-list">
          {[
            {n:"1",t:"多语言AI聊天",d:"通过Gemini AI用泰语、中文、英语回答旅游问题"},
            {n:"2",t:"快速菜单",d:"10个热门话题快捷键：餐厅、住宿、路线等"},
            {n:"3",t:"预算计算器",d:"支持泰铢/人民币/美元，含图表和预算等级"},
            {n:"4",t:"AI行程规划",d:"根据兴趣设计1–5天个性化旅行方案"},
            {n:"5",t:"紧急求助",d:"1155旅游警察（有中文翻译）、191警察、1669救护车"},
            {n:"6",t:"GPS地点卡",d:"推荐地点自动附上Google地图链接"},
          ].map(f=>(
            <div key={f.n} className="ms-feature-item">
              <div className="ms-feature-num">{f.n}</div>
              <div><strong>{f.t}</strong><br/><span className="ms-muted">{f.d}</span></div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="📖" title="使用步骤">
        <div className="ms-steps">
          {[
            {s:"1",t:"选择语言",d:"点击左侧语言按钮（ไทย/EN/中文）"},
            {s:"2",t:"提问",d:"在聊天框中输入问题，例如'华欣最好吃的海鲜在哪里'"},
            {s:"3",t:"使用快速菜单",d:"点击快捷按钮获取热门话题解答"},
            {s:"4",t:"规划行程",d:"进入📚标签，选择天数和兴趣，点击'生成方案'"},
            {s:"5",t:"计算预算",d:"进入💰标签，填写信息，选择货币，查看结果"},
          ].map(st=>(
            <div key={st.s} className="ms-step">
              <div className="ms-step-num">{st.s}</div>
              <div><strong>{st.t}</strong> — {st.d}</div>
            </div>
          ))}
        </div>
      </ManualSection>

      <ManualSection icon="💡" title="使用建议">
        <div className="ms-tips">
          <div className="ms-tip-card safety"><div className="ms-tip-title">🔒 安全提示</div><p>出发前保存紧急号码1155（有中文翻译）、191、1669。携带护照复印件，贵重物品存放保险箱。</p></div>
          <div className="ms-tip-card culture"><div className="ms-tip-title">🙏 寺庙礼仪</div><p>进入寺庙需穿着得体（遮肩盖膝），脱鞋后方可入内，禁止用脚指向佛像，保持安静。</p></div>
          <div className="ms-tip-card facility"><div className="ms-tip-title">🚻 卫生间</div><p>建议使用PTT加油站或购物中心的卫生间，大型海滩有收费卫生间（5泰铢），干净安全。</p></div>
        </div>
      </ManualSection>

      <div className="ms-footer">
        <p>© 2025 小碧（น้องเพชร）— 碧武里–华欣AI旅游系统 | Nong Phet Team</p>
        <p className="ms-muted">价格和营业时间可能随季节变化，出发前请再次确认。</p>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang]               = useState("th");
  const [darkMode, setDarkMode]       = useState(isNightTime());
  const [autoNight, setAutoNight]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState("chat");
  const [showQuickMenu, setShowQuickMenu] = useState(()=>localStorage.getItem('qmHidden')!=='1');
  const [showAdmin, setShowAdmin]         = useState(false);
  const [deleteModal, setDeleteModal]     = useState(null);  // {id, title} or "all"
  const [showEmergency, setShowEmergency]   = useState(false);
  const [toast, setToast]                 = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(()=>!localStorage.getItem('phet_onboarded'));
  const [showManual, setShowManual]         = useState(false);
  const [manualLang, setManualLang]         = useState(lang);
  const [sessions, setSessions]           = useState(()=>loadSessions());
  const L = LANGS[lang];

  const [messages, setMessages] = useState([{role:"bot",text:LANGS["th"].welcome}]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(()=>`session_${Date.now()}`);
  const bottomRef = useRef(null);
  const dashboardRef = useRef(null); // direct DOM ref for keyboard resize
  const messagesRef = useRef(null);
  const [topbarShrink, setTopbarShrink] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(()=>{
    const el = messagesRef.current;
    if (!el) return;
    const onScroll = ()=>{
      const y = el.scrollTop;
      setTopbarShrink(y > 60 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return ()=>el.removeEventListener('scroll', onScroll);
  }, []);

  // ── Keyboard Viewport Fix — iOS Safari + Android Chrome ──
  // KEY INSIGHT: CSS custom properties on html/body DON'T work reliably on iOS Safari
  // because Safari evaluates CSS vars before JS can update them after keyboard opens.
  // SOLUTION: Set height DIRECTLY on the dashboard DOM node via ref — bypasses CSS pipeline.
  useEffect(()=>{
    const el = dashboardRef.current;
    const html = document.documentElement;
    if (!el) return;

    const update = ()=>{
      const vv = window.visualViewport;
      const h  = vv ? vv.height : window.innerHeight;
      const y  = vv ? vv.offsetTop : 0;

      // Set height & position directly on the div — most reliable cross-browser method
      el.style.height  = h + 'px';
      el.style.top     = y + 'px';

      // Keyboard state for CSS (hide quick menu, etc.)
      html.toggleAttribute('data-kb', h < window.screen.height * 0.75);
    };

    update();
    const vv = window.visualViewport;
    vv?.addEventListener('resize',  update, { passive: true });
    vv?.addEventListener('scroll',  update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(update, 50);
      setTimeout(update, 300);
    });
    return () => {
      vv?.removeEventListener('resize',  update);
      vv?.removeEventListener('scroll',  update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(()=>{ if(!autoNight)return; const i=setInterval(()=>setDarkMode(isNightTime()),60000); return ()=>clearInterval(i); },[autoNight]);
  useEffect(()=>{ document.documentElement.classList.toggle("dark",darkMode); },[darkMode]);
  useEffect(()=>{ setMessages([{role:"bot",text:LANGS[lang].welcome}]); setManualLang(lang); },[lang]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const newChat = () => { setMessages([{role:"bot",text:LANGS[lang].welcome}]); setInput(""); };

  const sendMessage = useCallback(async (text) => {
    const userText = text||input.trim();
    if (!userText||loading) return;
    setInput("");
    const newMessages = [...messages,{role:"user",text:userText}];
    setMessages(newMessages);
    setLoading(true);
    logQuery(userText);
    if (activeTab!=="chat") setActiveTab("chat");
    try {
      const res  = await fetch(`${API}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:userText,sessionId,lang})});
      const data = await res.json();
      if (res.status===429||data.errorType==="quota") { setMessages(p=>[...p,{role:"bot",text:LANGS[lang].quotaMsg,isQuota:true}]); return; }
      if (data.error) throw new Error(data.error);
      const finalMessages = [...newMessages,{role:"bot",text:data.reply}];
      setMessages(finalMessages);
      saveSession(sessionId,finalMessages);
      setSessions(loadSessions());
    } catch { setMessages(p=>[...p,{role:"bot",text:LANGS[lang].errorMsg}]); }
    finally { setLoading(false); }
  },[input,loading,sessionId,lang,activeTab,messages]);

  const handleKeyDown = e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();} };
  const isWelcome = messages.length<=1;

  const tabTitles = { chat:"💬 "+L.chatTab, planner:"📚 "+L.plannerTab, festival:"🎪 "+(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"), accom:"🏨 "+(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays"), budget:"💰 "+(lang==="th"?"คำนวณงบ":lang==="zh"?"预算计算":"Budget") };
  // Nav icons (sidebar only — NOT reused in topbar to avoid duplication)
  const NAV_ICONS = { chat:"💬", planner:"📚", festival:"🎪", accom:"🏨", budget:"💰" };

  return (
    <div ref={dashboardRef} className={`dashboard ${darkMode?"dark":""} ${sidebarOpen?"sidebar-open":"sidebar-closed"}`}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img src={PHETBOT_LOGO} alt="น้องเพชร" className="brand-logo-img"/>
            {sidebarOpen&&<span className="brand-name">น้องเพชร</span>}
          </div>
          <button className="sidebar-toggle" onClick={()=>setSidebarOpen(s=>!s)}>{sidebarOpen?"◀":"▶"}</button>
        </div>

        {sidebarOpen&&(<>
          <button className="new-chat-btn" onClick={newChat}>✏️ {L.newChat}</button>

          {/* Main nav */}
          <nav className="sidebar-nav">
            {[
              {id:"chat",    icon:"💬", th:"แชท",     en:"Chat",      zh:"聊天"},
              {id:"planner", icon:"📚", th:"จัดทริป",  en:"Plan Trip", zh:"行程规划"},
              {id:"festival",icon:"🎪", th:"เทศกาล",   en:"Festivals", zh:"节庆"},
              {id:"accom",   icon:"🏨", th:"ที่พัก",   en:"Stays",     zh:"住宿"},
              {id:"budget",  icon:"💰", th:"คำนวณงบ", en:"Budget",    zh:"预算"},
            ].map(t=>(
              <button key={t.id} className={`nav-item ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
                <span>{t.icon}</span><span className="nav-label">{L$(lang,t.th,t.en,t.zh)}</span>
              </button>
            ))}
          </nav>


          {/* Session history (Feature 6) */}
          {sessions.length>0&&(<>
            <div className="sidebar-section-label">
              {L$(lang,"ประวัติแชท","History","历史")}
            </div>
            <nav className="sidebar-nav history-nav">
              {sessions.slice(0,8).map(sess=>(
                <div key={sess.id} className="history-item">
                  <button className="history-load" onClick={()=>setMessages(sess.messages)}>
                    💬 {sess.title}
                  </button>
                  <button className={`history-star ${sess.starred?"starred":""}`}
                    onClick={()=>{toggleStar(sess.id);setSessions(loadSessions());}}>
                    {sess.starred?"⭐":"☆"}
                  </button>
                  <button className="history-del" title="ลบ"
                    onClick={()=>setDeleteModal({id:sess.id,title:sess.title})}>
                    ✕
                  </button>
                </div>
              ))}
            </nav>
          </>)}

          {/* Emergency Button */}
          <button className="sidebar-manual-btn" onClick={()=>setShowManual(true)}>
            📄 {L$(lang,"คู่มือการใช้งาน","User Manual","使用手册")}
          </button>
          <button className="sidebar-emg-btn" onClick={()=>setShowEmergency(true)}>
            🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency","紧急求助")}
          </button>

          {/* Settings */}
          <div className="sidebar-bottom">
            <div className="sidebar-section-label">{L$(lang,"การตั้งค่า","Settings","设置")}</div>
            <div className="lang-selector-side">
              <div className="lang-select-wrap">
                <span className="lang-select-icon">{LANGS[lang].label.split(" ")[0]}</span>
                <select className="lang-select-native" value={lang} onChange={e=>setLang(e.target.value)}>
                  {Object.values(LANGS).map(l=>(
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="nav-item" onClick={()=>{setAutoNight(false);setDarkMode(d=>!d);}}>
              <span>{darkMode?"☀️":"🌙"}</span><span className="nav-label">{darkMode?"Light Mode":"Dark Mode"}</span>
            </button>
            <button className="nav-item" onClick={()=>setShowAdmin(true)}>
              <span>📊</span><span className="nav-label">Admin</span>
            </button>
          </div>
        </>)}

      {/* Floating expand tab when sidebar is closed */}
      {!sidebarOpen&&(
        <div className="sidebar-float-tab">
          <button className="sft-expand" onClick={()=>setSidebarOpen(true)} title="เปิดเมนู">▶</button>
          <button className="sft-lang" onClick={()=>{
            const codes=Object.keys(LANGS);
            setLang(codes[(codes.indexOf(lang)+1)%codes.length]);
          }} title="เปลี่ยนภาษา">🌐</button>
        </div>
      )}
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">
        <header className={`topbar${topbarShrink?" topbar-shrink":""}`}>
          {/* PC left */}
          <div className="topbar-left">
            <span className="topbar-title">{NAV_ICONS[activeTab]||"💬"} {activeTab==="chat"?L.chatTab:activeTab==="planner"?L.plannerTab:activeTab==="festival"?(lang==="th"?"เทศกาล":lang==="zh"?"节庆":"Festivals"):(lang==="th"?"ที่พัก":lang==="zh"?"住宿":"Stays")}</span>
            {activeTab==="chat"&&autoNight&&darkMode&&<span className="night-pill">🌙 Auto Dark</span>}
          </div>
          {/* Mobile: hamburger left + title center + new-chat right */}
          <button className="mob-hamburger" onClick={()=>setMobileMenuOpen(true)} aria-label="Menu">
            <span/><span/><span/>
          </button>
          <span className="mob-title"><img src={PHETBOT_LOGO} alt="" className="mob-logo-img"/>น้องเพชร</span>
          <div className="topbar-right">
            {activeTab==="chat"&&(
              <button className="qm-toggle-btn" onClick={()=>setShowQuickMenu(s=>{ localStorage.setItem('qmHidden', s?'1':'0'); return !s; })}>
                {showQuickMenu?L.hideMenu:L.showMenu}
              </button>
            )}
            <button className="new-chat-btn-top" onClick={newChat}>✏️ <span className="btn-label-pc">{L.newChat}</span></button>
          </div>
        </header>

        {activeTab==="chat" ? (
          <div className="chat-layout">
            <div className="messages-area" ref={messagesRef}>
              {isWelcome&&(
                <div className="welcome-screen">
                  <div className="welcome-avatar"><img src={PHETBOT_LOGO} alt="น้องเพชร" className="welcome-logo-img"/></div>
                  <h1>{L$(lang,"สวัสดีค่ะ! ฉันคือน้องเพชร","Hello! I'm Nong Phet","您好！我是小碧")}</h1>
                  <p>{L$(lang,"ไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน","AI Tourism Guide for Phetchaburi","碧武里AI旅游向导")}</p>
                  <div className="welcome-chips">
                    {L.suggestions.map((q,i)=><button key={i} className="welcome-chip" onClick={()=>sendMessage(q)}>{q}</button>)}
                  </div>
                  <div className="welcome-nav-row">
                    {[
                      {id:"planner",icon:"📚",th:"จัดทริป",en:"Plan Trip",zh:"规划行程"},
                      {id:"festival",icon:"🎪",th:"เทศกาล",en:"Festivals",zh:"节庆"},
                      {id:"accom",icon:"🏨",th:"ที่พัก",en:"Stays",zh:"住宿"},
                    ].map(t=>(
                      <button key={t.id} className="welcome-nav-btn" onClick={()=>setActiveTab(t.id)}>
                        <span>{t.icon}</span>
                        <span>{L$(lang,t.th,t.en,t.zh)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!isWelcome&&messages.map((msg,i)=><Message key={i} msg={msg} lang={lang}/>)}
              {loading&&<TypingIndicator/>}
              <div ref={bottomRef}/>
            </div>
            <div className="input-section">
              {showQuickMenu&&(
                <div className="quick-menu-bar">
                  {L.quickMenu.map((item,i)=>(
                    <button key={i} className="qm-chip" onClick={()=>sendMessage(item.msg)}>{item.icon} {item.label}</button>
                  ))}
                  <button className="qm-close-btn" onClick={()=>{setShowQuickMenu(false);localStorage.setItem('qmHidden','1');}} title="ซ่อน">✕</button>
                </div>
              )}
              <div className="input-box">
                <button className="gps-btn" title={L$(lang,"แชร์ตำแหน่งของฉัน","Share my location","分享位置")}
                  onClick={()=>{
                    if (!navigator.geolocation) { alert(L$(lang,"Browser ไม่รองรับ GPS","GPS not supported","GPS不支持")); return; }
                    navigator.geolocation.getCurrentPosition(
                      pos => {
                        const {latitude:lat, longitude:lng} = pos.coords;
                        const msg = lang==="th"
                          ? `ฉันอยู่ที่พิกัด ${lat.toFixed(5)}, ${lng.toFixed(5)} แนะนำที่เที่ยวในเพชรบุรีที่อยู่ใกล้ฉันหน่อยได้ไหม?`
                          : lang==="zh"
                          ? `我在坐标 ${lat.toFixed(5)}, ${lng.toFixed(5)}，请推荐碧武里附近的景点`
                          : `I'm at ${lat.toFixed(5)}, ${lng.toFixed(5)} — what Phetchaburi attractions are near me?`;
                        sendMessage(msg);
                      },
                      (err) => {
                        const hint = lang==="th"
                          ? "ไม่สามารถเข้าถึง GPS ได้ค่ะ กรุณากด Allow ที่ browser แล้วลองใหม่"
                          : "Cannot access GPS. Please allow location access in your browser.";
                        alert(hint);
                      },
                      { timeout:10000, enableHighAccuracy:true }
                    );
                  }}>
                  📍
                </button>
                <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={L.placeholder} rows={1} disabled={loading}/>
                <button className={`send-btn ${loading?"loading":""}`} onClick={()=>sendMessage()} disabled={loading||!input.trim()}>
                  {loading?"⏳":"➤"}
                </button>
              </div>
              <p className="input-hint">{L$(lang,"Enter ส่ง • Shift+Enter ขึ้นบรรทัดใหม่","Enter to send • Shift+Enter new line","Enter发送 • Shift+Enter换行")}</p>
            </div>
          </div>
        ) : activeTab==="planner" ? (
          <div className="planner-area"><ItineraryPlanner lang={lang}/></div>
        ) : activeTab==="festival" ? (
          <div className="planner-area"><FestivalCalendar lang={lang}/></div>
        ) : activeTab==="accom" ? (
          <div className="planner-area"><AccomFilter lang={lang}/></div>
        ) : activeTab==="budget" ? (
          <div className="planner-area" style={{overflow:"hidden"}}><BudgetCalculator lang={lang}/></div>
        ) : null}
      </main>

      {showAdmin&&<AdminDashboard onClose={()=>setShowAdmin(false)}/>}

      {/* ── MOBILE DRAWER (Claude-style slide-in) ── */}
      {mobileMenuOpen&&(
        <div className="mob-overlay" onClick={()=>setMobileMenuOpen(false)}>
          <aside className="mob-drawer" onClick={e=>e.stopPropagation()}>
            {/* Drawer header */}
            <div className="mob-drawer-header">
              <span className="mob-drawer-brand">น้องเพชร</span>
              <button className="mob-drawer-close" onClick={()=>setMobileMenuOpen(false)}>✕</button>
            </div>

            {/* New chat */}
            <button className="mob-new-chat" onClick={()=>{newChat();setMobileMenuOpen(false);}}>
              ✏️ {L.newChat}
            </button>

            {/* Nav items */}
            <div className="mob-drawer-section">{L$(lang,"เมนูหลัก","Navigation","导航")}</div>
            {[
              {id:"chat",    icon:"💬", th:"แชท",     en:"Chat",      zh:"聊天"},
              {id:"planner", icon:"📚", th:"จัดทริป",  en:"Plan Trip", zh:"行程规划"},
              {id:"festival",icon:"🎪", th:"เทศกาล",   en:"Festivals", zh:"节庆"},
              {id:"accom",   icon:"🏨", th:"ที่พัก",   en:"Stays",     zh:"住宿"},
              {id:"budget",  icon:"💰", th:"คำนวณงบ", en:"Budget",    zh:"预算"},
            ].map(t=>(
              <button key={t.id} className={`mob-drawer-item ${activeTab===t.id?"active":""}`}
                onClick={()=>{setActiveTab(t.id);setMobileMenuOpen(false);}}>
                <span className="mob-drawer-icon">{t.icon}</span>
                <span>{L$(lang,t.th,t.en,t.zh)}</span>
              </button>
            ))}


            {/* History */}
            {sessions.length>0&&(<>
              <div className="mob-drawer-section">{L$(lang,"ประวัติแชท","History","历史")}</div>
              {sessions.slice(0,5).map(sess=>(
                <div key={sess.id} className="mob-drawer-history">
                  <button className="mob-drawer-item mob-hist-load"
                    onClick={()=>{setMessages(sess.messages);setActiveTab("chat");setMobileMenuOpen(false);}}>
                    <span className="mob-drawer-icon">💬</span>
                    <span className="mob-hist-title">{sess.title}</span>
                  </button>
                  <button className="mob-hist-del"
                    onClick={()=>setDeleteModal({id:sess.id,title:sess.title})}>✕</button>
                </div>
              ))}
            </>)}

            {/* Emergency */}
            <button className="mob-emg-btn" onClick={()=>{setShowEmergency(true);setMobileMenuOpen(false);}}>
              🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency Numbers","紧急求助")}
            </button>

            {/* Settings */}
            <div className="mob-drawer-section">{L$(lang,"ตั้งค่า","Settings","设置")}</div>
            <div className="mob-drawer-settings">
              <button className="mob-setting-btn" onClick={()=>setDarkMode(d=>!d)}>
                {darkMode?"☀️":"🌙"} {darkMode?L$(lang,"โหมดสว่าง","Light","浅色"):L$(lang,"โหมดมืด","Dark","深色")}
              </button>
              <div className="mob-lang-select-wrap">
                <span className="mob-lang-icon">{LANGS[lang].label.split(" ")[0]}</span>
                <select className="mob-lang-select" value={lang} onChange={e=>setLang(e.target.value)}>
                  {Object.values(LANGS).map(l=>(
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal&&(
        <div className="del-modal-overlay" onClick={()=>setDeleteModal(null)}>
          <div className="del-modal" onClick={e=>e.stopPropagation()}>
            <div className="del-modal-icon">🗑️</div>
            <h3 className="del-modal-title">{L$(lang,"ยืนยันการลบแชท","Delete Chat?","确认删除对话")}</h3>
            <p className="del-modal-desc">
              {L$(lang,
                `ลบ "${deleteModal.title||"แชทนี้"}" ใช่หรือไม่?
การกระทำนี้ไม่สามารถย้อนกลับได้`,
                `Delete "${deleteModal.title||"this chat"}"?
This action cannot be undone.`,
                `确认删除「${deleteModal.title||"此对话"}」？
此操作无法撤ษ。`
              )}
            </p>
            <div className="del-modal-btns">
              <button className="del-btn-cancel" onClick={()=>setDeleteModal(null)}>
                {L$(lang,"ยกเลิก","Cancel","取消")}
              </button>
              <button className="del-btn-confirm" onClick={()=>{
                deleteSession(deleteModal.id);
                setSessions(loadSessions());
                setDeleteModal(null);
                showToast(L$(lang,"ลบแชทเรียบร้อยแล้ว ✓","Chat deleted ✓","对话已删除 ✓"));
              }}>
                {L$(lang,"🗑️ ลบแชท","🗑️ Delete","🗑️ 删除")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {/* ── Emergency Modal ── */}
      {showEmergency&&(
        <div className="del-modal-overlay" onClick={()=>setShowEmergency(false)}>
          <div className="emg-modal" onClick={e=>e.stopPropagation()}>
            <div className="emg-modal-header">
              <span>🚨 {L$(lang,"เบอร์ฉุกเฉิน","Emergency Numbers","紧急求助")}</span>
              <button className="emg-close" onClick={()=>setShowEmergency(false)}>✕</button>
            </div>
            <div className="emg-modal-sub">{L$(lang,"กดโทรออกได้เลย","Tap to call directly","点击直接拨打")}</div>
            <div className="emg-list">
              <a href="tel:1155" className="emg-item">
                <div className="emg-icon-wrap">👮</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"ตำรวจท่องเที่ยว","Tourist Police","旅游警察")}</span>
                  <span className="emg-number">1155</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
              <a href="tel:191" className="emg-item">
                <div className="emg-icon-wrap">🚓</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"ตำรวจ","Police","警察")}</span>
                  <span className="emg-number">191</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
              <a href="tel:1669" className="emg-item">
                <div className="emg-icon-wrap">🚑</div>
                <div className="emg-info">
                  <span className="emg-name">{L$(lang,"พยาบาล / กู้ภัย","Ambulance / Rescue","救护车")}</span>
                  <span className="emg-number">1669</span>
                </div>
                <div className="emg-call-btn">📞 {L$(lang,"โทร","Call","拨打")}</div>
              </a>
            </div>
            <div className="emg-footer">{L$(lang,"บริการฟรีตลอด 24 ชั่วโมง","Free service 24/7","24小时免费服务")}</div>
          </div>
        </div>
      )}

      {/* ── Onboarding Welcome Modal ── */}
      {showOnboarding&&(
        <div className="ob-overlay" onClick={()=>{setShowOnboarding(false);localStorage.setItem('phet_onboarded','1');}}>
          <div className="ob-modal" onClick={e=>e.stopPropagation()}>
            <div className="ob-logo-wrap">
              <img src={PHETBOT_LOGO} alt="น้องเพชร" className="ob-logo"/>
            </div>
            <h2 className="ob-title">
              {L$(lang,"ยินดีต้อนรับสู่ น้องเพชร 💜✨","Welcome to Nong Phet 💜✨","欢迎使用 小碧 💜✨")}
            </h2>
            <p className="ob-sub">
              {L$(lang,"ผู้ช่วย AI ท่องเที่ยวเพชรบุรี–หัวหินส่วนตัวของคุณ","Your personal AI travel guide for Phetchaburi–Hua Hin","你的碧武里–华欣专属AI旅行助手")}
            </p>
            <div className="ob-features">
              {[
                {icon:"🌐", th:"รองรับ 3 ภาษา ไทย / จีน / อังกฤษ",      en:"3 Languages: Thai / Chinese / English", zh:"支持3种语言：泰语 / 中文 / 英语"},
                {icon:"⚡", th:"Quick Menu ปุ่มทางลัดถาม-ตอบรวดเร็ว",    en:"Quick Menu: Shortcut buttons for fast Q&A", zh:"快速菜单：一键提问，快速解答"},
                {icon:"💰", th:"คำนวณงบ 3 สกุลเงิน THB / CNY / USD",     en:"Budget Calculator: THB / CNY / USD",    zh:"预算计算器：泰铢 / 人民币 / 美元"},
                {icon:"🗺️", th:"จัดทริปอัจฉริยะ 1–5 วัน ด้วย AI",      en:"AI Trip Planner: 1–5 day itineraries",  zh:"AI行程规划：1–5天个性化旅程"},
                {icon:"🚨", th:"ระบบ Popup เบอร์ฉุกเฉินสำคัญ 24 ชม.",   en:"Emergency numbers popup available 24/7", zh:"紧急求助弹窗，24小时随时可用"},
              ].map((f,i)=>(
                <div key={i} className="ob-feature-row">
                  <span className="ob-feature-icon">{f.icon}</span>
                  <span className="ob-feature-text">{L$(lang,f.th,f.en,f.zh)}</span>
                </div>
              ))}
            </div>
            <button className="ob-start-btn" onClick={()=>{setShowOnboarding(false);localStorage.setItem('phet_onboarded','1');}}>
              {L$(lang,"เริ่มใช้งานเลย! →","Let's Go! →","开始使用！→")}
            </button>
            <p className="ob-hint">{L$(lang,"กดที่ใดก็ได้เพื่อปิด","Tap anywhere to close","点击任意处关闭")}</p>
          </div>
        </div>
      )}

      {/* ── User Manual Modal ── */}
      {showManual&&(
        <div className="manual-overlay" onClick={()=>setShowManual(false)}>
          <div className="manual-modal" onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div className="manual-header">
              <div className="manual-header-left">
                <img src={PHETBOT_LOGO} alt="" className="manual-logo"/>
                <div>
                  <div className="manual-title">{manualLang==="zh"?"น้องเพชร 使用手册":manualLang==="en"?"Nong Phet User Manual":"คู่มือการใช้งานน้องเพชร"}</div>
                  <div className="manual-subtitle">{manualLang==="zh"?"碧武里–华欣AI旅游导览系统":manualLang==="en"?"Phetchaburi–Hua Hin AI Tourism Assistant":"ระบบไกด์ท่องเที่ยว AI เพชรบุรี–หัวหิน"}</div>
                </div>
              </div>
              <div className="manual-header-actions">
                {/* Language toggle */}
                <div className="manual-lang-pills">
                  {["th","en","zh"].map(l=>(
                    <button key={l} className={`manual-lang-pill ${manualLang===l?"active":""}`} onClick={()=>setManualLang(l)}>
                      {l==="th"?"🇹🇭 ไทย":l==="en"?"🇬🇧 EN":"🇨🇳 中文"}
                    </button>
                  ))}
                </div>
                <button className="manual-print-btn" onClick={()=>window.print()}>🖨️ {manualLang==="zh"?"打印/PDF":manualLang==="en"?"Print/PDF":"พิมพ์/PDF"}</button>
                <button className="manual-close" onClick={()=>setShowManual(false)}>✕</button>
              </div>
            </div>

            {/* Body */}
            <div className="manual-body" id="manual-print-area">
              {manualLang==="th"&&<ManualContentTH/>}
              {manualLang==="en"&&<ManualContentEN/>}
              {manualLang==="zh"&&<ManualContentZH/>}
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="toast-notif">{toast}</div>}
    </div>
  );
}
