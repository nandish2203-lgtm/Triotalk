import { useState, useEffect, useRef } from "react";

/* ─────────────────── MOCK DATA ─────────────────── */
const FRIENDS = [
  { id: "ai",  name: "AI Assistant", sub: "Powered by Claude · Ask anything", photo: null, ai: true,  online: true  },
  { id: "k",   name: "Karpita",      sub: "Hey! 😊",                          photo: null, ai: false, online: true  },
  { id: "g",   name: "Gadilinga",    sub: "See you tomorrow 👋",              photo: null, ai: false, online: false },
];

const MOCK_MSGS = {
  k: [
    { id:1, from:"k",   text:"Heyyy!! Did you see the new update? 👀",          time:"10:12 AM" },
    { id:2, from:"me",  text:"Yes!! So good 🔥 The AI bot is so useful",        time:"10:13 AM" },
    { id:3, from:"k",   text:"I know right!! Conference call tonight? 📞",      time:"10:14 AM" },
    { id:4, from:"me",  text:"100%! Ask Gadilinga too",                         time:"10:15 AM" },
    { id:5, from:"k",   text:"Already did 😄 See you at 9!",                   time:"10:15 AM" },
  ],
  g: [
    { id:1, from:"g",   text:"Bro the app is 🔥🔥",                             time:"9:00 AM"  },
    { id:2, from:"me",  text:"Right?? Claude built it for us 😂",               time:"9:01 AM"  },
    { id:3, from:"g",   text:"See you tomorrow 👋",                             time:"9:02 AM"  },
  ],
  ai: [
    { id:1, from:"ai",  text:`Hi Nandish! 👋 I'm your AI Assistant, powered by Claude.\n\nAsk me anything — coding, ideas, advice, or just chat!`, time:"Now", ai:true },
  ],
};

const COLORS = { me:"#00d4aa", k:"#f97316", g:"#a855f7", ai:"#7c3aed" };

/* ─────────────────── UTILS ─────────────────── */
function Avatar({ name, photo, size = 40, online, ai }) {
  const letter = name?.[0]?.toUpperCase() ?? "?";
  const color  = ai ? "linear-gradient(135deg,#7c3aed,#a855f7)" : COLORS[name?.[0]?.toLowerCase()] ?? "#00d4aa";
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width: size, height: size, borderRadius:"50%",
        background: photo ? undefined : color,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: size * 0.42, fontWeight:700, color:"#fff",
        overflow:"hidden", flexShrink:0,
        boxShadow: ai ? "0 0 16px rgba(124,58,237,.4)" : undefined,
      }}>
        {photo ? <img src={photo} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : (ai ? "🤖" : letter)}
      </div>
      {online !== undefined && (
        <div style={{
          position:"absolute", bottom:1, right:1, width: size*0.24, height: size*0.24,
          background: online ? "#3fb950" : "#484f58", borderRadius:"50%",
          border:"2px solid #161b22",
        }}/>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:8, height:8, borderRadius:"50%", background:"#7c3aed",
          animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s`,
        }}/>
      ))}
    </div>
  );
}

/* ─────────────────── AUTH SCREEN ─────────────────── */
function AuthScreen({ onAuth }) {
  const [tab, setTab]       = useState("email");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  function handleLogin(e) {
    e.preventDefault(); setErr("");
    if (!email || !pass) { setErr("Please fill in all fields."); return; }
    if (!email.includes("@")) { setErr("Invalid email address."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ name:"Nandish", email }); }, 1200);
  }

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"#0d1117", position:"relative", overflow:"hidden",
    }}>
      {/* Background blobs */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,212,170,.07),transparent 70%)",
        top:-200, right:-150, animation:"float1 8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle,rgba(124,58,237,.06),transparent 70%)",
        bottom:-100, left:-100, animation:"float2 10s ease-in-out infinite" }}/>

      <div style={{
        background:"#161b22", border:"1px solid #30363d", borderRadius:24,
        padding:"40px 36px", width:400, maxWidth:"95vw",
        boxShadow:"0 24px 64px rgba(0,0,0,.6)",
        animation:"slideUp .4s ease",
        position:"relative", zIndex:1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{
            width:68, height:68, borderRadius:20, background:"#00d4aa",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:32, marginBottom:14, boxShadow:"0 0 40px rgba(0,212,170,.3)",
          }}>💬</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:"#e6edf3" }}>TrioTalk</div>
          <div style={{ fontSize:13, color:"#8b949e", marginTop:4 }}>A private space for three friends + AI</div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:"#21262d", borderRadius:12, padding:4, marginBottom:24 }}>
          {["email","phone"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:"9px 0", borderRadius:9, border:"none", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight: tab===t?600:500,
              background: tab===t?"#00d4aa":"transparent",
              color: tab===t?"#000":"#8b949e",
              transition:"all .2s",
            }}>{t==="email" ? "📧 Email" : "📱 Phone OTP"}</button>
          ))}
        </div>

        {/* Form */}
        {err && (
          <div style={{ background:"rgba(248,81,73,.1)", border:"1px solid rgba(248,81,73,.3)",
            color:"#f85149", padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:14 }}>
            {err}
          </div>
        )}
        <form onSubmit={handleLogin}>
          {tab === "email" ? (
            <>
              <Field label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" type="email"/>
              <Field label="Password" value={pass} onChange={setPass} placeholder="Min 6 characters" type="password"/>
              <Btn loading={loading} label="Sign In" />
              <button type="button" style={outlineBtn} onClick={handleLogin}>Create Account</button>
            </>
          ) : (
            <>
              <Field label="Phone (with country code)" value={email} onChange={setEmail} placeholder="+91 98765 43210" type="tel"/>
              <Btn loading={loading} label="Send OTP" />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:15 }}>
      <label style={{ display:"block", fontSize:13, color:"#8b949e", fontWeight:500, marginBottom:6 }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:"100%", padding:"12px 15px", background:"#21262d",
          border:`1px solid ${focused?"#00d4aa":"#30363d"}`,
          boxShadow: focused?"0 0 0 3px rgba(0,212,170,.12)":undefined,
          borderRadius:11, color:"#e6edf3", fontSize:15, outline:"none",
          fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", transition:"all .2s",
        }}/>
    </div>
  );
}
function Btn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      width:"100%", padding:13, background:"#00d4aa", color:"#003828",
      border:"none", borderRadius:11, fontSize:15, fontWeight:700,
      cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center",
      justifyContent:"center", gap:8, marginTop:4, transition:"all .2s",
      opacity:loading?.7:1, fontFamily:"'DM Sans',sans-serif",
    }}>
      {loading ? <div style={{ width:18,height:18,border:"2px solid rgba(0,0,0,.2)",
        borderTopColor:"#000",borderRadius:"50%",animation:"spin .6s linear infinite" }}/> : label}
    </button>
  );
}
const outlineBtn = {
  width:"100%", padding:11, background:"transparent", color:"#00d4aa",
  border:"1px solid #00d4aa", borderRadius:11, fontSize:14, fontWeight:500,
  cursor:"pointer", marginTop:8, fontFamily:"'DM Sans',sans-serif", transition:"all .2s",
};

/* ─────────────────── CHAT SCREEN ─────────────────── */
function ChatScreen({ user }) {
  const [active, setActive]       = useState(null);
  const [msgs, setMsgs]           = useState(MOCK_MSGS);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme]         = useState("dark");
  const [showProfile, setShowProfile] = useState(false);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const endRef = useRef();

  const friend = FRIENDS.find(f => f.id === active);
  const isDark  = theme === "dark";
  const bg      = isDark ? "#0d1117" : "#f6f8fa";
  const sideBg  = isDark ? "#161b22" : "#ffffff";
  const border  = isDark ? "#30363d" : "#d0d7de";
  const txt     = isDark ? "#e6edf3" : "#1c2128";
  const txt2    = isDark ? "#8b949e" : "#57606a";
  const card    = isDark ? "#21262d" : "#eaeef2";
  const hover   = isDark ? "#2d333b" : "#dde1e7";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, active]);

  function send() {
    if (!input.trim() || !active) return;
    const text = input.trim(); setInput("");
    setMsgs(m => ({ ...m, [active]: [...(m[active]||[]), { id:Date.now(), from:"me", text, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }] }));
    if (active === "ai") {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs(m => ({ ...m, ai: [...m.ai, { id:Date.now()+1, from:"ai", text:`Here's my response to: "${text.slice(0,40)}..."\n\nI'm a demo AI — in the real app, Claude will answer this! 🤖`, time:"Now", ai:true }] }));
      }, 1500);
    }
  }

  if (showSettings) return <Settings onBack={()=>setShowSettings(false)} theme={theme} setTheme={setTheme} user={user} isDark={isDark} bg={bg} sideBg={sideBg} border={border} txt={txt} txt2={txt2} card={card} hover={hover}/>;

  return (
    <div style={{ display:"flex", height:"100vh", background:bg, color:txt, fontFamily:"'DM Sans',sans-serif", overflow:"hidden", transition:"background .3s" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:300, minWidth:300, background:sideBg, borderRight:`1px solid ${border}`, display:"flex", flexDirection:"column", transition:"background .3s" }}>

        {/* Header */}
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div onClick={()=>setShowProfile(true)} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", minWidth:0 }}>
            <Avatar name="Nandish" size={40} online={true}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:15, color:txt }}>{user?.name||"Nandish"}</div>
              <div style={{ fontSize:12, color:"#3fb950" }}>● Active</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <IconBtn icon="🌙" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} hover={hover}/>
            <IconBtn icon="⚙️" onClick={()=>setShowSettings(true)} hover={hover}/>
          </div>
        </div>

        {/* Conf button */}
        <button style={{ margin:"10px 12px 4px", padding:"10px 14px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", border:"none", borderRadius:12, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:9 }}>
          <span style={{ fontSize:18 }}>👥</span> Group Conference Call
        </button>

        <div style={{ padding:"10px 16px 6px", fontSize:10.5, fontWeight:600, textTransform:"uppercase", letterSpacing:"1.2px", color:txt2 }}>AI &amp; Friends</div>

        {/* Friend list */}
        <div style={{ flex:1, overflowY:"auto", padding:"4px 8px 8px" }}>
          {FRIENDS.map(f => {
            const lastMsg = msgs[f.id]?.slice(-1)?.[0];
            const isActive = active === f.id;
            return (
              <div key={f.id} onClick={()=>setActive(f.id)} style={{
                display:"flex", alignItems:"center", gap:11, padding:"11px 10px",
                borderRadius:13, cursor:"pointer", transition:"all .18s",
                background: isActive ? (f.ai?"rgba(124,58,237,.12)":"rgba(0,212,170,.12)") : "transparent",
              }}
              onMouseEnter={e=>!isActive&&(e.currentTarget.style.background=hover)}
              onMouseLeave={e=>!isActive&&(e.currentTarget.style.background="transparent")}
              >
                <Avatar name={f.name} size={40} online={f.online} ai={f.ai}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:500, fontSize:14.5, color: isActive?(f.ai?"#a855f7":"#00d4aa"):txt, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</div>
                  <div style={{ fontSize:12.5, color:f.ai?"rgba(168,85,247,.8)":txt2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:2 }}>
                    {lastMsg?.text?.split("\n")[0]?.slice(0,32) || f.sub}
                  </div>
                </div>
                {f.ai && <div style={{ width:8,height:8,background:"#7c3aed",borderRadius:"50%",animation:"aipulse 2s infinite",flexShrink:0 }}/>}
                {!f.ai && f.online && <div style={{ width:8,height:8,background:"#3fb950",borderRadius:"50%",flexShrink:0 }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:bg, position:"relative", minWidth:0 }}>
        {!active ? (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, color:txt2 }}>
            <div style={{ fontSize:72, opacity:.15 }}>💬</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:txt }}>TrioTalk</div>
            <div style={{ fontSize:14 }}>Select a friend or chat with AI</div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", gap:12, background:sideBg, transition:"background .3s" }}>
              <div onClick={()=>setShowFriendProfile(true)} style={{ cursor:"pointer" }}>
                <Avatar name={friend?.name} size={48} online={friend?.online} ai={friend?.ai}/>
              </div>
              <div onClick={()=>setShowFriendProfile(true)} style={{ flex:1, cursor:"pointer" }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600, color:txt }}>{friend?.name}</div>
                <div style={{ fontSize:12, color: friend?.ai?"#a855f7": friend?.online?"#3fb950":txt2, marginTop:2 }}>
                  {friend?.ai ? "● Always Online · Claude AI" : friend?.online ? "● Online" : "Offline"}
                </div>
              </div>
              {!friend?.ai && (
                <div style={{ display:"flex", gap:8 }}>
                  {["📞","🎥","👥"].map((ic,i)=>( <CallBtn key={i} icon={ic}/> ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:4 }}>
              {(msgs[active]||[]).map(msg => {
                const sent = msg.from === "me";
                const isAi = msg.ai;
                return (
                  <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: sent?"flex-end":"flex-start", marginBottom:2 }}>
                    <div style={{
                      maxWidth:"68%", padding:"10px 14px", borderRadius: sent?"18px 18px 4px 18px":"18px 18px 18px 4px",
                      background: sent?"linear-gradient(135deg,#00d4aa,#00b896)": isAi?"rgba(124,58,237,.15)":card,
                      color: sent?"#003828":txt, fontSize:14.5, lineHeight:1.5, wordBreak:"break-word",
                      fontWeight: sent?500:undefined, whiteSpace:"pre-wrap",
                      border: isAi?"1px solid rgba(124,58,237,.25)":undefined,
                      animation:"msgIn .18s ease",
                    }}>
                      {msg.text}
                      <div style={{ fontSize:10.5, opacity:.5, marginTop:4, textAlign: sent?"right":"left" }}>{msg.time}</div>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
                  <div style={{ padding:"12px 16px", borderRadius:"18px 18px 18px 4px", background:"rgba(124,58,237,.15)", border:"1px solid rgba(124,58,237,.25)" }}>
                    <Spinner/>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {/* Input */}
            <div style={{ padding:"10px 14px 14px", borderTop:`1px solid ${border}`, background:sideBg, display:"flex", alignItems:"flex-end", gap:8, transition:"background .3s" }}>
              {!friend?.ai && (
                <div style={{ display:"flex", gap:6 }}>
                  {["😊","GIF","📎"].map((ic,i)=>(
                    <button key={i} style={{ width:40,height:40,background:card,border:"none",borderRadius:11,color:txt2,fontSize:i===1?12:19,fontWeight:i===1?700:undefined,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif" }}>{ic}</button>
                  ))}
                </div>
              )}
              <div style={{ flex:1, background:card, border:`1px solid ${friend?.ai?"#7c3aed":border}`, boxShadow: friend?.ai?"0 0 0 3px rgba(124,58,237,.12)":undefined, borderRadius:13, display:"flex", alignItems:"center", padding:"0 12px", transition:"all .2s" }}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
                  placeholder={friend?.ai?"Ask the AI anything...":"Type a message..."}
                  rows={1} style={{ flex:1,background:"transparent",border:"none",outline:"none",color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:15,padding:"10px 0",resize:"none",maxHeight:100,lineHeight:1.4 }}/>
              </div>
              <button onClick={send} style={{ width:44,height:44,background:friend?.ai?"linear-gradient(135deg,#7c3aed,#a855f7)":"#00d4aa",border:"none",borderRadius:13,color:friend?.ai?"#fff":"#003828",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>➤</button>
            </div>
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && <ProfileModal name={user?.name||"Nandish"} email={user?.email||"nandish2203@gmail.com"} onClose={()=>setShowProfile(false)} isDark={isDark} sideBg={sideBg} border={border} txt={txt} txt2={txt2}/>}
      {showFriendProfile && friend && <FriendModal friend={friend} onClose={()=>setShowFriendProfile(false)} isDark={isDark} sideBg={sideBg} border={border} txt={txt} txt2={txt2}/>}
    </div>
  );
}

function IconBtn({ icon, onClick, hover }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ width:34,height:34,borderRadius:9,background:h?"rgba(0,212,170,.12)":hover,border:"none",color:h?"#00d4aa":"#8b949e",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all .2s" }}>{icon}</button>;
}
function CallBtn({ icon }) {
  const [h, setH] = useState(false);
  return <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ width:38,height:38,background:h?"#00d4aa":"#21262d",border:"none",borderRadius:10,color:h?"#000":"#8b949e",fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>{icon}</button>;
}

/* ─────────────────── MODALS ─────────────────── */
function ProfileModal({ name, email, onClose, isDark, sideBg, border, txt, txt2 }) {
  return <ModalWrap onClose={onClose} isDark={isDark}>
    <div style={{ height:80, background:"linear-gradient(135deg,#00d4aa,#7c3aed)" }}/>
    <button onClick={onClose} style={{ position:"absolute",top:12,right:14,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
    <div style={{ padding:"0 22px 24px",textAlign:"center",marginTop:-44 }}>
      <div style={{ display:"inline-flex",position:"relative",marginBottom:12 }}>
        <div style={{ width:88,height:88,borderRadius:"50%",background:"#00d4aa",border:`4px solid ${sideBg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:700,color:"#000" }}>{name[0]}</div>
        <div style={{ position:"absolute",bottom:2,right:2,width:28,height:28,background:"#00d4aa",border:`2px solid ${sideBg}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer" }}>📷</div>
      </div>
      <div style={{ fontSize:20,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",color:txt }}>{name}</div>
      <div style={{ fontSize:13,color:txt2,margin:"4px 0 16px" }}>{email}</div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:13,marginBottom:18,color:"#3fb950" }}>
        <div style={{ width:9,height:9,borderRadius:"50%",background:"#3fb950" }}/> Online
      </div>
      <button style={{ width:"100%",padding:13,background:"#f85149",color:"#fff",border:"none",borderRadius:11,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>🚪 Sign Out</button>
    </div>
  </ModalWrap>;
}

function FriendModal({ friend, onClose, isDark, sideBg, border, txt, txt2 }) {
  const cover = friend.ai ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "linear-gradient(135deg,#00d4aa,#0aad8b)";
  return <ModalWrap onClose={onClose} isDark={isDark}>
    <div style={{ height:80, background:cover }}/>
    <button onClick={onClose} style={{ position:"absolute",top:12,right:14,background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
    <div style={{ padding:"0 22px 24px",textAlign:"center",marginTop:-44 }}>
      <div style={{ marginBottom:12 }}><Avatar name={friend.name} size={88} ai={friend.ai} online={friend.online}/></div>
      <div style={{ fontSize:20,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",color:txt }}>{friend.name}</div>
      <div style={{ fontSize:13,color:txt2,margin:"4px 0 16px" }}>{friend.ai?"Powered by Claude":"ckarpita06@gmail.com"}</div>
      {friend.ai ? (
        <div style={{ background:"rgba(124,58,237,.12)",border:"1px solid rgba(124,58,237,.2)",borderRadius:12,padding:12,textAlign:"left",fontSize:13,color:txt2,lineHeight:1.5,marginBottom:16 }}>
          <strong style={{ color:"#a855f7",display:"block",marginBottom:4 }}>🤖 AI Assistant</strong>
          Powered by Claude. Ask me anything — questions, ideas, advice, coding help, or just a chat!
        </div>
      ) : (
        <div style={{ display:"flex",gap:10,marginBottom:0 }}>
          <button style={{ flex:1,padding:13,background:"#00d4aa",color:"#003828",border:"none",borderRadius:11,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>📞 Call</button>
          <button style={{ flex:1,padding:13,background:"transparent",color:"#00d4aa",border:"1px solid #00d4aa",borderRadius:11,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>🎥 Video</button>
        </div>
      )}
    </div>
  </ModalWrap>;
}

function ModalWrap({ children, onClose, isDark }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)" }}>
      <div style={{ background:isDark?"#161b22":"#fff",border:`1px solid ${isDark?"#30363d":"#d0d7de"}`,borderRadius:20,width:340,maxWidth:"96vw",boxShadow:"0 24px 64px rgba(0,0,0,.5)",overflow:"hidden",position:"relative",animation:"slideUp .3s ease" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────── SETTINGS ─────────────────── */
function Settings({ onBack, theme, setTheme, user, isDark, bg, sideBg, border, txt, txt2, card, hover }) {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  const [lang, setLang]   = useState("en");

  const LANGS = ["🇬🇧 English","🇮🇳 हिन्दी","🇮🇳 ಕನ್ನಡ","🇮🇳 தமிழ்","🇮🇳 తెలుగు","🇪🇸 Español","🇫🇷 Français","🇩🇪 Deutsch","🇸🇦 العربية","🇨🇳 中文","🇯🇵 日本語"];

  return (
    <div style={{ minHeight:"100vh", background:bg, color:txt, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", animation:"slideInLeft .25s ease", transition:"background .3s" }}>

      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", background:sideBg, borderBottom:`1px solid ${border}`, position:"sticky", top:0, zIndex:1, transition:"background .3s" }}>
        <button onClick={onBack} style={{ width:36,height:36,background:card,border:"none",borderRadius:10,color:txt2,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>←</button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700,color:txt }}>Settings</div>
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:24 }}>

        {/* Profile card */}
        <div onClick={onBack} style={{ display:"flex",alignItems:"center",gap:14,padding:"20px",margin:"16px",background:sideBg,border:`1px solid ${border}`,borderRadius:18,cursor:"pointer",transition:"all .2s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#00d4aa";e.currentTarget.style.background="rgba(0,212,170,.06)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=border;e.currentTarget.style.background=sideBg;}}>
          <div style={{ width:62,height:62,borderRadius:"50%",background:"#00d4aa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:"#000",flexShrink:0,position:"relative" }}>
            {user?.name?.[0]||"N"}
            <div style={{ position:"absolute",bottom:0,right:0,width:20,height:20,background:"#00d4aa",border:`2px solid ${sideBg}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10 }}>📷</div>
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:17,fontWeight:600,color:txt }}>{user?.name||"Nandish"}</div>
            <div style={{ fontSize:13,color:txt2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{user?.email||"nandish2203@gmail.com"} · Tap to edit</div>
          </div>
          <div style={{ fontSize:18,color:txt2 }}>›</div>
        </div>

        <SLabel label="Account" color="#00d4aa"/>
        <SGroup isDark={isDark} sideBg={sideBg} border={border}>
          <SRow icon="🔑" bg="rgba(0,212,170,.12)" title="Account" sub="Security & change password" txt={txt} txt2={txt2} hover={hover}/>
          <SRow icon="🔒" bg="rgba(0,212,170,.12)" title="Privacy" sub="Last seen, read receipts" txt={txt} txt2={txt2} hover={hover}/>
          <SRow icon="🖼️" bg="rgba(168,85,247,.12)" title="Profile Photo" sub="Change your avatar & photo" txt={txt} txt2={txt2} hover={hover}/>
        </SGroup>

        <SLabel label="Chats & Appearance" color="#00d4aa"/>
        <SGroup isDark={isDark} sideBg={sideBg} border={border}>
          <SRow icon="🎨" bg="rgba(255,193,7,.12)" title="Theme" sub={isDark?"Dark mode":"Light mode"} txt={txt} txt2={txt2} hover={hover}
            right={<Toggle on={isDark} onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}/>}/>
          <SRow icon="🔔" bg="rgba(63,185,80,.12)" title="Notifications" sub={notif?"Alerts on":"Alerts off"} txt={txt} txt2={txt2} hover={hover}
            right={<Toggle on={notif} onClick={()=>setNotif(v=>!v)}/>}/>
          <SRow icon="🔊" bg="rgba(0,140,200,.12)" title="Message Sounds" sub={sound?"Sound on":"Sound off"} txt={txt} txt2={txt2} hover={hover}
            right={<Toggle on={sound} onClick={()=>setSound(v=>!v)}/>}/>
        </SGroup>

        <SLabel label="Language" color="#00d4aa"/>
        <SGroup isDark={isDark} sideBg={sideBg} border={border}>
          <SRow icon="🌐" bg="rgba(0,212,170,.12)" title="App Language" sub="Device language" txt={txt} txt2={txt2} hover={hover}
            right={
              <select value={lang} onChange={e=>setLang(e.target.value)} style={{ background:card,border:`1px solid ${border}`,borderRadius:8,color:txt,fontFamily:"'DM Sans',sans-serif",fontSize:13,padding:"5px 8px",outline:"none",cursor:"pointer" }}>
                {LANGS.map((l,i)=><option key={i} value={i}>{l}</option>)}
              </select>
            }/>
        </SGroup>

        <SLabel label="About" color="#00d4aa"/>
        <SGroup isDark={isDark} sideBg={sideBg} border={border}>
          <SRow icon="💬" bg="rgba(0,212,170,.12)" title="About TrioTalk" sub="Version 3.0 · Private chat for 3 friends" txt={txt} txt2={txt2} hover={hover}/>
          <SRow icon="❓" bg="rgba(0,140,200,.12)" title="Help & FAQ" sub="Get support & tips" txt={txt} txt2={txt2} hover={hover}/>
        </SGroup>

        <SLabel label="Account Actions" color="#f85149"/>
        <SGroup isDark={isDark} sideBg={sideBg} border={border}>
          <SRow icon="🚪" bg="rgba(248,81,73,.12)" title="Log Out" sub="Sign out of TrioTalk" txt="#f85149" txt2="rgba(248,81,73,.7)" hover="rgba(248,81,73,.06)" arrow="#f85149"/>
        </SGroup>

        <div style={{ textAlign:"center",padding:"24px",fontSize:12,color:txt2 }}>
          TrioTalk v3.0 · Made with ❤️<br/>
          <span style={{ color:"#00d4aa" }}>nandish2203@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

function SLabel({ label, color }) {
  return <div style={{ padding:"18px 20px 8px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"1.1px",color }}>{label}</div>;
}
function SGroup({ children, isDark, sideBg, border }) {
  return <div style={{ margin:"0 16px 4px",background:sideBg,border:`1px solid ${border}`,borderRadius:16,overflow:"hidden",transition:"background .3s" }}>{children}</div>;
}
function SRow({ icon, bg, title, sub, txt, txt2, hover, right, arrow }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer",transition:"background .15s",background:h?hover:"transparent",borderBottom:`1px solid rgba(0,0,0,.06)` }}>
      <div style={{ width:38,height:38,borderRadius:11,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:15,fontWeight:500,color:txt }}>{title}</div>
        <div style={{ fontSize:12.5,color:txt2,marginTop:2 }}>{sub}</div>
      </div>
      {right || <div style={{ fontSize:16,color:arrow||"#484f58" }}>›</div>}
    </div>
  );
}
function Toggle({ on, onClick }) {
  return (
    <button onClick={e=>{e.stopPropagation();onClick();}} style={{ width:44,height:24,background:on?"#00d4aa":"#484f58",borderRadius:100,position:"relative",cursor:"pointer",transition:"background .2s",border:"none",flexShrink:0 }}>
      <div style={{ position:"absolute",top:3,left:on?23:3,width:18,height:18,background:"#fff",borderRadius:"50%",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)" }}/>
    </button>
  );
}

/* ─────────────────── ROOT APP ─────────────────── */
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Space+Grotesk:wght@500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{margin:0;font-family:'DM Sans',sans-serif}
        *::-webkit-scrollbar{width:4px}
        *::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
        *::-webkit-scrollbar-track{background:transparent}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideInLeft{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
        @keyframes float2{0%,100%{transform:translate(0,0)}50%{transform:translate(-15px,15px)}}
        @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
        @keyframes aipulse{0%,100%{opacity:1}50%{opacity:.3}}
        textarea{line-height:1.4}
      `}</style>

      <div style={{ height:"100vh", width:"100%", overflow:"hidden" }}>
        {!user ? (
          <div key="auth" style={{ height:"100%", animation:"slideUp .4s ease" }}>
            <AuthScreen onAuth={setUser}/>
          </div>
        ) : (
          <div key="chat" style={{ height:"100%", animation:"slideUp .3s ease" }}>
            <ChatScreen user={user}/>
          </div>
        )}
      </div>
    </>
  );
}
