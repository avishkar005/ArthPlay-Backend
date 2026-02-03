import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Shield, Heart, Brain, PlayCircle, Trophy, ArrowRight, TrendingUp, Coins, Zap, Target, Award, User, LogOut, Send, X, ChevronRight, Check, Loader } from 'lucide-react';

/* ============================================================
   API HELPER  –  change BASE_URL to your Spring Boot address
   ============================================================ */
const BASE_URL = 'http://localhost:8080/api';

const api = {
  register: (body) => fetch(`${BASE_URL}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json()),
  login:    (body) => fetch(`${BASE_URL}/auth/login`,    { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(r=>r.json()),
  getProfile:    (token) => fetch(`${BASE_URL}/profile`,              { headers:{'Authorization':`Bearer ${token}`} }).then(r=>r.json()),
  saveProfile:   (token,body) => fetch(`${BASE_URL}/profile`,         { method:'PUT', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify(body) }).then(r=>r.json()),
  submitAssessment: (token,body) => fetch(`${BASE_URL}/assessment/submit`, { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify(body) }).then(r=>r.json()),
  getAssessmentHistory: (token) => fetch(`${BASE_URL}/assessment/history`, { headers:{'Authorization':`Bearer ${token}`} }).then(r=>r.json()),
  getGameState:  (token) => fetch(`${BASE_URL}/game/state`,           { headers:{'Authorization':`Bearer ${token}`} }).then(r=>r.json()),
  saveGameState: (token,body) => fetch(`${BASE_URL}/game/state`,      { method:'PUT', headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body: JSON.stringify(body) }).then(r=>r.json()),
};

/* ============================================================
   CHATBOT KNOWLEDGE BASE – keyword → response list (random pick)
   ============================================================ */
const KB = [
  { tags:['start','begin','how to','help','first','what do i','where'],
    replies:['Tap **Start Your Journey** on the dashboard to pick an avatar and dive in! 🎮','First time? Hit the **Financial Behaviour Check** – 10 quick questions and you\'ll get your money-health score instantly. 🎯','Welcome! You can either begin the simulation or take the assessment quiz first. Your call! 🚀'] },
  { tags:['assessment','quiz','question','behaviour check','behavioral'],
    replies:['The assessment is 10 scenario-based questions – no textbook stuff. Answer honestly and watch your Security & Happiness scores shift in real time! 📊','Each question is a real-life situation. Pick the choice that feels right – there are no "wrong" answers, only consequences. 🎲','Your assessment results get saved. You can retake anytime and compare how your financial thinking evolves! 📈'] },
  { tags:['avatar','character','farmer','student','woman','professional','choose','pick'],
    replies:['Four paths: 🧑‍🌾 Farmer, 👩‍💼 Woman Entrepreneur, 🎓 Student, 👨‍💼 Young Pro. Each comes with its own financial challenges!','Pick the avatar that matches your life – or the one you\'re curious about. You can switch anytime from the game screen!','The Farmer track has crop-season income cycles. The Student track is all about pocket-money juggling. Try both! 🌾🎓'] },
  { tags:['save','saving','money','budget','spend','how much'],
    replies:['The golden rule: save at least 20–30 % of every rupee that comes in. Automate it so you never "forget". 💰','Think of savings as paying yourself first. Before rent, before fun – your future self is your first bill. 🏦','Try the 50-30-20 split: 50 % needs, 30 % wants, 20 % savings. Small tweaks here create huge results over a year. 📝'] },
  { tags:['security','score','security score','what is security'],
    replies:[`Your Security score shows how protected you are financially. Emergency fund? Insurance? No debt? Score goes up! 🛡️`,'A high Security score means you can handle surprises without panic. Keep saving and insuring to push it higher!','Security = your financial safety net strength. Every smart decision you make in the game pushes it up. 💪'] },
  { tags:['happiness','happiness score','stress','feel'],
    replies:['Happiness tracks how balanced your life feels. Overspending drains it; hitting goals fills it back up! 😊','It\'s not just about money – spending a little on yourself AND saving wisely keeps Happiness healthy. ⚖️','Watch your Happiness bar in the assessment – it tells you if your choices are sustainable long-term. 🌟'] },
  { tags:['achievement','badge','unlock','trophy','reward'],
    replies:['Achievements unlock as you hit milestones – finish the quiz, pick an avatar, hit score thresholds. Check the trophy icon! 🏆','Some badges are sneaky – you have to hit both Happiness AND Security above 70 % at the same time. Challenge accepted? 😎','Badges are your proof of growth. Each one means you\'ve built a real financial skill in the simulation! 🎖️'] },
  { tags:['credit','debt','loan','emi','borrow','credit card'],
    replies:['Credit cards are tools, not free money. Pay the full bill every month or the interest will eat your wallet alive! 💳','Rule of thumb: never borrow for wants – only for needs that genuinely improve your life. And always compare interest rates first.','EMIs feel painless monthly but add up fast. Always calculate the total cost before you say yes to any loan. 🧮'] },
  { tags:['insurance','health insurance','cover','protect','risk'],
    replies:['Insurance is the one thing that turns a disaster into a manageable bump. Get health cover early – premiums are way cheaper when you\'re young! 🏥','Life insurance, health insurance, crop insurance – pick what fits your life stage. ArthPlay\'s simulation will show you what happens when you skip it.','Think of insurance as renting a safety net. You hope you never need it, but when you do, it\'s the best money you ever spent. 🪂'] },
  { tags:['invest','investment','mutual fund','stocks','grow','compound'],
    replies:['Investing is just saving on steroids. Even ₹500 a month in a mutual fund can become lakhs in 10 years – compound interest is magic! 📈','Start small, start early. Time in the market beats timing the market. Index funds are a great beginner move. 🌱','The game has an investment scenario. Try it and see firsthand how patience + consistency beats get-rich-quick schemes every time. 💎'] },
  { tags:['emergency','emergency fund','unexpected','shock','crisis'],
    replies:['Build 3–6 months of expenses in an emergency fund before anything else. It\'s your financial airbag. 🆘','Without an emergency fund, one bad month can turn into years of debt. The simulation will show you exactly how. 💥','Start with one month\'s expenses saved. Even that small cushion changes how you handle surprises. 🏗️'] },
  { tags:['scam','fraud','fake','trap','phishing','cyber'],
    replies:['If it sounds too good to be true, it IS too good to be true. 30 % returns in 3 months? Run away. 🚨','Never share OTPs, bank details, or passwords – not with anyone claiming to be from your bank. Real banks never ask for those. 🔐','The assessment has a scam question built in. See how your instincts score – and sharpen them through the simulation! 🎯'] },
  { tags:['profile','update','name','age','income','goal'],
    replies:['Tap the 👤 icon in the top-right to open your profile. Fill in your details – the game uses them to personalise scenarios!','Your profile info helps ArthPlay tailor challenges to your real life situation. Update it whenever things change. ✏️','Don\'t skip the Financial Goal field – writing it down is the first step to actually achieving it! 🎯'] },
  { tags:['logout','log out','exit','sign out'],
    replies:['Hit the logout button in the top-right corner. Don\'t worry – all your progress is saved to the cloud! ☁️','Your data persists even after logout. Next time you log in, you\'ll pick up right where you left off. 💾'] },
  { tags:['game','simulation','play','scenario','life sim'],
    replies:['The game is a life simulation – real decisions, real consequences. Make smart moves and watch your wealth grow! 🎮','Each scenario is a month of your simulated life. Money, happiness, security – all shift based on YOUR choices. 🌀','Choose your avatar first, then the game throws realistic financial curveballs at you. Fun AND educational! 🎯'] },
];

function chatbotReply(input) {
  const lower = input.toLowerCase();
  let bestMatch = null, bestScore = 0;
  KB.forEach(entry => {
    let score = 0;
    entry.tags.forEach(tag => { if (lower.includes(tag)) score += tag.length; });
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  });
  if (bestMatch) return bestMatch.replies[Math.floor(Math.random() * bestMatch.replies.length)];
  return "Hmm, I'm not sure about that one yet! Try asking me about **saving**, **investments**, **insurance**, **credit**, **achievements**, or how to **start** the game. 💡";
}

/* ============================================================
   10 BEHAVIOURAL QUESTIONS
   ============================================================ */
const QUESTIONS = [
  { id:1, icon:"🍽️", text:"Your friend invites you to an expensive dinner. You've already hit your weekly budget. What do you do?",
    options:[
      { text:"Go anyway – YOLO, it's just once!", security:-10, happiness:5 },
      { text:"Politely decline and suggest a cheaper spot", security:10, happiness:5 },
      { text:"Swipe the credit card – I'll sort it later", security:-15, happiness:8 }
    ]},
  { id:2, icon:"💰", text:"₹5,000 lands in your account out of nowhere. First move?",
    options:[
      { text:"Stash it all in emergency savings", security:15, happiness:5 },
      { text:"Treat myself – I deserve it!", security:-5, happiness:15 },
      { text:"70 % save, 30 % enjoy – balanced life", security:10, happiness:10 }
    ]},
  { id:3, icon:"📱", text:"Sleek new phone just dropped. Yours works fine but looks dated. Do you…",
    options:[
      { text:"Buy it on EMI today!", security:-20, happiness:10 },
      { text:"Wait until mine actually dies", security:15, happiness:-5 },
      { text:"Save ₹2,000/month until I can pay cash", security:10, happiness:5 }
    ]},
  { id:4, icon:"💳", text:"You missed your credit card payment deadline. Next step?",
    options:[
      { text:"Panic – pay immediately, don't think", security:-5, happiness:-5 },
      { text:"Ignore it… it'll sort itself", security:-25, happiness:-15 },
      { text:"Pay now AND set up auto-pay forever", security:20, happiness:10 }
    ]},
  { id:5, icon:"❄️", text:"Summer heat, AC breaks, repair bill ₹8,000. How do you handle it?",
    options:[
      { text:"Emergency fund to the rescue ✅", security:5, happiness:15 },
      { text:"Awkwardly borrow from a family member", security:-15, happiness:-10 },
      { text:"Credit card it – future me will deal", security:-20, happiness:5 }
    ]},
  { id:6, icon:"📈", text:"A WhatsApp group promises 30 % returns in 3 months. Tempted?",
    options:[
      { text:"Wire the money NOW – easy money!", security:-30, happiness:-20 },
      { text:"Research it properly first – smells fishy", security:20, happiness:5 },
      { text:"Delete the group – classic scam", security:15, happiness:0 }
    ]},
  { id:7, icon:"🏥", text:"An agent offers health insurance at ₹500/month. You're 24 and healthy…",
    options:[
      { text:"Skip – I'm invincible at 24", security:-25, happiness:5 },
      { text:"Sign up immediately – safety first", security:25, happiness:-5 },
      { text:"Compare 3 plans, then decide wisely", security:20, happiness:10 }
    ]},
  { id:8, icon:"💸", text:"Salary day! What's the FIRST thing you do with that money?",
    options:[
      { text:"Auto-transfer 20 % to savings – done", security:25, happiness:10 },
      { text:"Pay bills first, enjoy the rest", security:10, happiness:5 },
      { text:"Leave it in the account – spend freely", security:-15, happiness:0 }
    ]},
  { id:9, icon:"🏠", text:"A landlord wants rent 15 % higher next month. Your lease is up. What now?",
    options:[
      { text:"Pay it – no time to search elsewhere", security:-15, happiness:-10 },
      { text:"Negotiate – counter-offer with data", security:15, happiness:10 },
      { text:"Start flat-hunting now, don't rush", security:10, happiness:5 }
    ]},
  { id:10, icon:"🎁", text:"Festive season! Everyone's shopping. Your budget says stop. Your cart says go.",
    options:[
      { text:"Add everything – it's festive vibes!", security:-20, happiness:15 },
      { text:"Stick to the budget – gifts can be thoughtful, not expensive", security:15, happiness:5 },
      { text:"Buy only for family, skip self-gifts", security:10, happiness:8 }
    ]},
];

const AVATARS = [
  { id:'farmer',     name:'Farmer Mode',          emoji:'🧑‍🌾', subtitle:'Seasonal cycles & risk',     color:'#22c55e', bg:'from-green-500 to-emerald-700',   desc:'Kharif & Rabi cycles, crop shocks, smart credit choices.' },
  { id:'woman',      name:'Woman Entrepreneur',   emoji:'👩‍💼', subtitle:'Business + household',       color:'#ec4899', bg:'from-pink-500 to-rose-700',     desc:'Balance a micro-business with household finances.' },
  { id:'student',    name:'Student Mode',         emoji:'🎓',  subtitle:'Pocket money & learning',   color:'#3b82f6', bg:'from-blue-500 to-cyan-700',     desc:'Manage stipends, avoid traps, build habits early.' },
  { id:'youngadult', name:'Young Professional',   emoji:'👨‍💼', subtitle:'Career & wealth building', color:'#a855f7', bg:'from-purple-500 to-indigo-700', desc:'Salary, EMIs, investments & long-term planning.' },
];

/* ============================================================
   PARTICLE CANVAS – subtle floating dots background
   ============================================================ */
function ParticleBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = Array.from({length:60}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*2+0.5, dx: (Math.random()-0.5)*0.4, dy: (Math.random()-0.5)*0.4,
      a: Math.random()*0.4+0.1
    }));
    let frame;
    function draw() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(167,139,250,${p.a})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x<0) p.x=w; if (p.x>w) p.x=0;
        if (p.y<0) p.y=h; if (p.y>h) p.y=0;
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function ArthPlay() {
  const [page, setPage]             = useState('login');   // login | register | dashboard | avatars | assessment | resultScreen | game
  const [token, setToken]           = useState(null);
  const [userData, setUserData]     = useState(null);
  const [gameState, setGameState]   = useState({ money:10000, happiness:75, security:60, streak:0 });
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // assessment
  const [qIndex, setQIndex]         = useState(0);
  const [answers, setAnswers]       = useState([]);
  const [pickedIdx, setPickedIdx]   = useState(null);  // currently animating choice

  // modals
  const [showProfile, setShowProfile]           = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChatbot, setShowChatbot]           = useState(false);

  // profile form
  const [profile, setProfile] = useState({ fullName:'', age:'', occupation:'', monthlyIncome:'', financialGoal:'' });

  // chatbot
  const [chatMsgs, setChatMsgs] = useState([{ role:'bot', text:"Hey there! 👋 I'm your ArthPlay money guide. Ask me anything – savings, investing, insurance, or how to play!" }]);
  const chatEnd = useRef(null);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:'smooth' }); }, [chatMsgs]);

  // achievements derived
  const achievements = [
    { name:'First Steps',       icon:'🎯', desc:'Took the assessment',           ok: answers.length > 0 || page === 'resultScreen' },
    { name:'Security Guru',     icon:'🛡️', desc:'Security score ≥ 70 %',        ok: gameState.security >= 70 },
    { name:'Happy Spender',     icon:'😊', desc:'Happiness score ≥ 75 %',       ok: gameState.happiness >= 75 },
    { name:'Quiz Master',       icon:'💰', desc:'Completed all 10 questions',    ok: answers.length >= 10 },
    { name:'Journey Begun',     icon:'🚀', desc:'Selected an avatar',           ok: !!selectedAvatar },
    { name:'Balanced Life',     icon:'⚖️', desc:'Both scores ≥ 70 %',          ok: gameState.security >= 70 && gameState.happiness >= 70 },
    { name:'Wealth Builder',    icon:'📈', desc:'Money ≥ ₹15 000',             ok: gameState.money >= 15000 },
    { name:'Scam Detector',     icon:'🔍', desc:'Chose correctly on fraud Q',   ok: answers.find(a => a.questionId===6 && a.selectedOption===1 || a.selectedOption===2) !== undefined },
  ];

  /* ── answer a question, animate, advance ── */
  const handleAnswer = (optIdx) => {
    if (pickedIdx !== null) return;          // debounce
    setPickedIdx(optIdx);
    const q = QUESTIONS[qIndex];
    const o = q.options[optIdx];
    const newAnswers = [...answers, {
      questionId: q.id, questionText: q.text,
      selectedOption: optIdx, selectedText: o.text,
      securityImpact: o.security, happinessImpact: o.happiness
    }];
    setAnswers(newAnswers);
    const newSec  = Math.max(0, Math.min(100, gameState.security  + o.security));
    const newHap  = Math.max(0, Math.min(100, gameState.happiness + o.happiness));
    setGameState(prev => ({ ...prev, security: newSec, happiness: newHap }));

    setTimeout(() => {
      setPickedIdx(null);
      if (qIndex < QUESTIONS.length - 1) {
        setQIndex(prev => prev + 1);
      } else {
        // finished – go to result
        setPage('resultScreen');
        // persist to backend
        if (token) {
          api.submitAssessment(token, { answers: newAnswers, finalSecurity: newSec, finalHappiness: newHap });
          api.saveGameState(token, { ...gameState, security: newSec, happiness: newHap });
        }
      }
    }, 700);
  };

  /* ── sync game-state on avatar pick ── */
  const pickAvatar = (av) => {
    setSelectedAvatar(av);
    if (token) api.saveGameState(token, { ...gameState, selectedAvatar: av.id });
    setPage('game');
  };

  /* ─────────────── PAGE RENDERS ─────────────── */

  /* LOGIN */
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass]   = useState('');
    const [err, setErr]     = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
      e.preventDefault(); setErr(''); setLoading(true);
      try {
        const res = await api.login({ email, password: pass });
        if (res.error) { setErr(res.error); setLoading(false); return; }
        setToken(res.token);
        setUserData({ email: res.email, displayName: res.displayName, id: res.userId });
        setPage('dashboard');
      } catch { setErr('Network error – check backend is running.'); setLoading(false); }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6 relative">
        <ParticleBg />
        <div className="relative z-10 w-full max-w-sm">
          {/* logo */}
          <div className="text-center mb-10">
            <div className="inline-flex w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl items-center justify-center shadow-xl shadow-amber-500/20 mb-4" style={{animation:'bounce 2s infinite'}}>
              <Sparkles size={36} color="#fff"/>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">ArthPlay</h1>
            <p className="text-purple-300 mt-1">Play. Learn. Prosper.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-white text-2xl font-bold mb-1 text-center">Welcome Back</h2>
            <p className="text-white/50 text-sm text-center mb-6">Sign in to continue your journey</p>

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">✉️</span>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required
                  className="w-full pl-10 pr-4 py-3.5 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔑</span>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" required
                  className="w-full pl-10 pr-4 py-3.5 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              {err && <p className="text-red-400 text-sm text-center animate-pulse">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-60">
                {loading ? <><Loader size={18} className="animate-spin"/> Signing in…</> : <>Sign In <ArrowRight size={18}/></>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/40 text-sm">Don't have an account?{' '}
                <button onClick={()=>setPage('register')} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Create one →</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* REGISTER */
  const RegisterPage = () => {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass]   = useState('');
    const [confirm, setConfirm] = useState('');
    const [err, setErr]     = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
      e.preventDefault(); setErr('');
      if (pass !== confirm) { setErr('Passwords don\'t match'); return; }
      if (pass.length < 6)  { setErr('Password must be at least 6 characters'); return; }
      setLoading(true);
      try {
        const res = await api.register({ email, password: pass, displayName: name });
        if (res.error) { setErr(res.error); setLoading(false); return; }
        setToken(res.token);
        setUserData({ email: res.email, displayName: res.displayName, id: res.userId });
        setPage('dashboard');
      } catch { setErr('Network error – check backend is running.'); setLoading(false); }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6 relative">
        <ParticleBg />
        {/* decorative ring */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-indigo-500/20 blur-sm pointer-events-none" style={{animation:'spin 20s linear infinite'}}/>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-pink-500/15 blur-sm pointer-events-none" style={{animation:'spin 30s linear infinite reverse'}}/>

        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex w-18 h-18 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl items-center justify-center shadow-xl shadow-indigo-500/20 mb-4" style={{width:64,height:64}}>
              <Sparkles size={30} color="#fff"/>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter">Join ArthPlay</h1>
            <p className="text-indigo-300 mt-1 text-sm">Start your financial adventure today</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={submit} className="space-y-3.5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">👤</span>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Display Name" required
                  className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">✉️</span>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com" required
                  className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔐</span>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Create Password" required
                  className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔒</span>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm Password" required
                  className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
              </div>
              {err && <p className="text-red-400 text-sm text-center">{err}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-60 mt-2">
                {loading ? <><Loader size={18} className="animate-spin"/> Creating…</> : <>Create Account <Sparkles size={16}/></>}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-white/40 text-sm">Already have an account?{' '}
                <button onClick={()=>setPage('login')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in →</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* SHARED HEADER */
  const Header = () => (
    <header className="relative z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <button onClick={()=>setPage('dashboard')} className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"><Sparkles size={18} color="#fff"/></div>
          <span className="text-white font-bold text-lg">ArthPlay</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowAchievements(true)} className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white"><Trophy size={20}/></button>
          <button onClick={()=>setShowProfile(true)}      className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white"><User size={20}/></button>
          <button onClick={()=>{ setToken(null); setUserData(null); setPage('login'); setAnswers([]); setQIndex(0); }}
            className="ml-1 px-3 py-1.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/25 text-sm flex items-center gap-1 transition-all">
            <LogOut size={14}/> Logout
          </button>
        </div>
      </div>
    </header>
  );

  /* DASHBOARD */
  const DashboardPage = () => {
    const stats = [
      { icon: Coins,      label:'Money',     value:`₹${gameState.money}`,          color:'#22c55e', bg:'from-green-500 to-emerald-700' },
      { icon: Heart,      label:'Happiness', value:`${gameState.happiness}%`,      color:'#ec4899', bg:'from-pink-500 to-rose-700' },
      { icon: Shield,     label:'Security',  value:`${gameState.security}%`,       color:'#3b82f6', bg:'from-blue-500 to-cyan-700' },
      { icon: Zap,        label:'Streak',    value:`${gameState.streak}d`,         color:'#f59e0b', bg:'from-amber-500 to-orange-600' },
    ];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative">
        <ParticleBg /><Header />
        <div className="relative z-10 max-w-6xl mx-auto px-5 py-10">
          {/* welcome */}
          <div className="mb-10" style={{animation:'fadeUp 0.6s ease'}}>
            <h1 className="text-4xl font-black text-white">Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text" style={{WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{userData?.displayName || 'Player'}</span></h1>
            <p className="text-white/40 mt-1">Ready to level up your money game?</p>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" style={{animation:'fadeUp 0.7s ease'}}>
            {stats.map((s,i) => (
              <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl p-5 shadow-lg`} style={{animation:`fadeUp ${0.5+i*0.1}s ease`}}>
                <div className="flex items-center justify-between mb-3">
                  <s.icon size={22} color="#fff" opacity={0.8}/>
                  <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="text-white text-3xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{animation:'fadeUp 0.8s ease'}}>
            <button onClick={()=>setPage('avatars')}
              className="group bg-white/6 hover:bg-white/10 backdrop-blur border border-white/12 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <PlayCircle size={28} color="#fff"/>
                </div>
                <ArrowRight size={20} className="text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all"/>
              </div>
              <h3 className="text-white text-xl font-bold">Start Simulation</h3>
              <p className="text-white/40 text-sm mt-1">Choose your avatar and live a financial life</p>
            </button>

            <button onClick={()=>{ setPage('assessment'); setQIndex(0); setAnswers([]); setPickedIdx(null); setGameState({money:10000, happiness:75, security:60, streak:0}); }}
              className="group bg-white/6 hover:bg-white/10 backdrop-blur border border-white/12 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Brain size={28} color="#fff"/>
                </div>
                <ArrowRight size={20} className="text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"/>
              </div>
              <h3 className="text-white text-xl font-bold">Behaviour Check</h3>
              <p className="text-white/40 text-sm mt-1">10 questions · ~4 min · real-time scores</p>
            </button>
          </div>

          {/* feature pills */}
          <div className="flex flex-wrap gap-3 mt-10" style={{animation:'fadeUp 0.9s ease'}}>
            {[{icon:TrendingUp,label:'Simulations'},{icon:Target,label:'Goals'},{icon:Award,label:'Badges'},{icon:Shield,label:'Risk'}].map((f,i)=>(
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/6 border border-white/10 rounded-full">
                <f.icon size={16} className="text-purple-400"/><span className="text-white/60 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chatbot FAB */}
        <button onClick={()=>setShowChatbot(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-110 transition-all">
          <Brain size={26} color="#fff"/>
        </button>
      </div>
    );
  };

  /* AVATARS */
  const AvatarsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative">
      <ParticleBg /><Header />
      <div className="relative z-10 max-w-5xl mx-auto px-5 py-10">
        <button onClick={()=>setPage('dashboard')} className="text-white/50 hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors">← Back</button>
        <h1 className="text-4xl font-black text-white text-center mb-2">Choose Your Path</h1>
        <p className="text-white/40 text-center mb-10">Each avatar unlocks a unique life simulation</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {AVATARS.map((av,i) => (
            <button key={av.id} onClick={()=>pickAvatar(av)}
              className="group relative bg-white/6 hover:bg-white/10 backdrop-blur border border-white/12 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
              style={{animation:`fadeUp ${0.4+i*0.15}s ease`}}>
              {/* gradient accent top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${av.bg} opacity-80`}/>
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-16 h-16 bg-gradient-to-br ${av.bg} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {av.emoji}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{av.name}</h3>
                  <p className="text-white/40 text-xs">{av.subtitle}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-white/25 group-hover:text-white/60 group-hover:translate-x-1 transition-all"/>
              </div>
              <p className="text-white/50 text-sm">{av.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ASSESSMENT */
  const AssessmentPage = () => {
    const q = QUESTIONS[qIndex];
    const progress = ((qIndex) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative">
        <ParticleBg /><Header />
        <div className="relative z-10 max-w-2xl mx-auto px-5 py-8">
          {/* progress track */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-white/50 text-sm font-semibold">{qIndex+1} / {QUESTIONS.length}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}}/>
            </div>
            <span className="text-white/50 text-sm">{Math.round(progress)}%</span>
          </div>

          {/* question card – key forces remount on change → entrance animation */}
          <div key={qIndex} className="bg-white/6 backdrop-blur border border-white/12 rounded-2xl p-6 md:p-8" style={{animation:'fadeUp 0.4s ease'}}>
            <div className="text-center mb-4">
              <span className="text-5xl" style={{animation:'pop 0.3s ease'}}>{q.icon}</span>
            </div>
            <h2 className="text-white text-xl md:text-2xl font-bold text-center leading-snug mb-8">{q.text}</h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const chosen = pickedIdx === idx;
                return (
                  <button key={idx} onClick={()=>handleAnswer(idx)} disabled={pickedIdx !== null}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                      ${chosen
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 scale-[1.02] shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 hover:scale-[1.015]'}
                      disabled:cursor-not-allowed`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all
                      ${chosen ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-white/10 text-white/60'}`}>
                      {chosen ? <Check size={18}/> : String.fromCharCode(65+idx)}
                    </div>
                    <span className={`text-base transition-colors ${chosen ? 'text-white font-semibold' : 'text-white/70'}`}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* live score bars */}
          <div className="grid grid-cols-2 gap-4 mt-6" style={{animation:'fadeUp 0.6s ease'}}>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Shield size={16} className="text-blue-400"/><span className="text-white/50 text-xs font-semibold">SECURITY</span></div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700" style={{width:`${gameState.security}%`}}/></div>
              <p className="text-blue-400 font-bold text-sm mt-1">{gameState.security}%</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Heart size={16} className="text-pink-400"/><span className="text-white/50 text-xs font-semibold">HAPPINESS</span></div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700" style={{width:`${gameState.happiness}%`}}/></div>
              <p className="text-pink-400 font-bold text-sm mt-1">{gameState.happiness}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* RESULT SCREEN (after assessment) */
  const ResultScreen = () => {
    const avg = Math.round((gameState.security + gameState.happiness) / 2);
    const category = avg >= 75 ? 'Excellent' : avg >= 55 ? 'Good' : avg >= 35 ? 'Average' : 'Needs Work';
    const catColor = avg >= 75 ? 'from-emerald-400 to-green-600' : avg >= 55 ? 'from-blue-400 to-cyan-600' : avg >= 35 ? 'from-amber-400 to-orange-600' : 'from-red-400 to-rose-600';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative flex items-center justify-center">
        <ParticleBg />
        <div className="relative z-10 max-w-md w-full mx-auto px-5 text-center" style={{animation:'fadeUp 0.5s ease'}}>
          <div className="text-7xl mb-4" style={{animation:'pop 0.4s ease'}}>🎉</div>
          <h1 className="text-4xl font-black text-white mb-2">Assessment Complete!</h1>
          <p className="text-white/40 mb-8">Here's how your financial instincts scored</p>

          {/* big score ring */}
          <div className={`inline-flex w-40 h-40 bg-gradient-to-br ${catColor} rounded-full items-center justify-center shadow-2xl mb-6`} style={{animation:'pop 0.5s ease 0.2s both'}}>
            <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center">
              <span className="text-white text-4xl font-black">{avg}</span>
              <span className="text-white/50 text-xs">/100</span>
            </div>
          </div>

          <p className={`text-xl font-bold mb-6 bg-gradient-to-r ${catColor} bg-clip-text`} style={{WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{category}</p>

          {/* breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/6 border border-white/10 rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Security</p>
              <p className="text-blue-400 text-2xl font-black">{gameState.security}<span className="text-white/30 text-sm font-normal">%</span></p>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-4">
              <p className="text-white/40 text-xs mb-1">Happiness</p>
              <p className="text-pink-400 text-2xl font-black">{gameState.happiness}<span className="text-white/30 text-sm font-normal">%</span></p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={()=>setPage('dashboard')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95">Back to Dashboard</button>
            <button onClick={()=>setShowAchievements(true)} className="px-6 py-3 bg-white/8 border border-white/15 rounded-xl text-white/70 hover:text-white transition-all"><Trophy size={18} className="inline mr-1"/>Achievements</button>
          </div>
        </div>
      </div>
    );
  };

  /* GAME (life simulation) */
  const GamePage = () => {
    const [scenario, setScenario] = useState(0);
    const [chosen, setChosen]     = useState(null);
    const scenarios = [
      { title:"Month 1 — Fresh Start", desc:`You just received your first paycheck of ₹${gameState.money}. How do you kick things off?`,
        choices:[
          { text:"💰 Save 30 % right away",           effect:{money:-3000, security:20, happiness:5},  result:"Smart! Emergency fund is growing." },
          { text:"🛍️ Stock up on essentials only",     effect:{money:-5000, security:5,  happiness:10}, result:"Practical – needs come first." },
          { text:"🎉 Celebrate with friends!",         effect:{money:-7000, security:-10,happiness:20}, result:"Fun times, but budget's thinner now." },
        ]},
      { title:"Month 2 — Surprise Bill", desc:"Bike breaks. Repair: ₹4,000. What next?",
        choices:[
          { text:"🏦 Pull from emergency fund",        effect:{money:-4000, security:5,  happiness:10}, result:"That's exactly what it's for!" },
          { text:"🤝 Borrow from a friend",            effect:{money:0,     security:-15,happiness:-10},result:"Debt adds stress. Learn from it." },
          { text:"💳 Credit card to the rescue",       effect:{money:0,     security:-20,happiness:0},  result:"Interest will sneak up on you…" },
        ]},
      { title:"Month 3 — Investment Ad", desc:"A Telegram channel promises ₹1 lakh in a week. Tempted?",
        choices:[
          { text:"📲 Send money immediately",          effect:{money:-5000, security:-30,happiness:-25},result:"💀 Scam. Money is gone. Painful lesson." },
          { text:"🔍 Google it first",                 effect:{money:0,     security:15, happiness:5},  result:"Good instinct – saved yourself big time." },
          { text:"🚫 Block & ignore",                  effect:{money:0,     security:10, happiness:0},  result:"Clean and safe. Well done." },
        ]},
    ];
    const s = scenarios[scenario];

    const pick = (idx) => {
      setChosen(idx);
      const c = s.choices[idx];
      setGameState(prev => ({
        ...prev,
        money:    prev.money + c.effect.money,
        security: Math.max(0, Math.min(100, prev.security  + c.effect.security)),
        happiness:Math.max(0, Math.min(100, prev.happiness + c.effect.happiness)),
      }));
      setTimeout(() => {
        if (scenario < scenarios.length - 1) { setScenario(sc => sc+1); setChosen(null); }
        else setPage('dashboard');
      }, 2800);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative">
        <ParticleBg /><Header />
        <div className="relative z-10 max-w-2xl mx-auto px-5 py-8">
          <button onClick={()=>setPage('dashboard')} className="text-white/50 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">← Exit Game</button>

          {/* avatar badge */}
          {selectedAvatar && (
            <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-white/6 border border-white/10 rounded-xl" style={{animation:'fadeUp 0.4s ease'}}>
              <div className={`w-12 h-12 bg-gradient-to-br ${selectedAvatar.bg} rounded-xl flex items-center justify-center text-2xl`}>{selectedAvatar.emoji}</div>
              <div><p className="text-white font-bold">{selectedAvatar.name}</p><p className="text-white/40 text-xs">{selectedAvatar.subtitle}</p></div>
            </div>
          )}

          {/* mini stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{icon:Coins,v:`₹${gameState.money}`,l:'Money',c:'text-green-400'},{icon:Shield,v:`${gameState.security}%`,l:'Security',c:'text-blue-400'},{icon:Heart,v:`${gameState.happiness}%`,l:'Happiness',c:'text-pink-400'}].map((s,i)=>(
              <div key={i} className="bg-white/6 border border-white/10 rounded-xl p-3 text-center">
                <s.icon size={18} className={`${s.c} mx-auto mb-1`}/>
                <p className={`${s.c} font-black`}>{s.v}</p>
                <p className="text-white/35 text-xs">{s.l}</p>
              </div>
            ))}
          </div>

          {/* scenario card */}
          <div key={scenario} className="bg-white/6 backdrop-blur border border-white/12 rounded-2xl p-6" style={{animation:'fadeUp 0.45s ease'}}>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Scenario {scenario+1} / {scenarios.length}</span>
            <h2 className="text-white text-xl font-bold mt-1 mb-2">{s.title}</h2>
            <p className="text-white/50 mb-6">{s.desc}</p>

            {chosen === null ? (
              <div className="space-y-3">
                {s.choices.map((c,idx)=>(
                  <button key={idx} onClick={()=>pick(idx)}
                    className="w-full text-left flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/25 hover:scale-[1.015] transition-all">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-sm font-bold">{String.fromCharCode(65+idx)}</div>
                    <span className="text-white/70">{c.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4" style={{animation:'fadeUp 0.3s ease'}}>
                <div className="text-5xl mb-3">✨</div>
                <p className="text-white font-bold text-lg mb-1">Result</p>
                <p className="text-white/60">{s.choices[chosen].result}</p>
                <div className="flex justify-center gap-4 mt-3 text-sm">
                  {s.choices[chosen].effect.money !== 0 && <span className={s.choices[chosen].effect.money>0?'text-green-400':'text-red-400'}>Money {s.choices[chosen].effect.money>0?'+':''}{s.choices[chosen].effect.money}</span>}
                  <span className={s.choices[chosen].effect.security>0?'text-blue-400':'text-orange-400'}>Security {s.choices[chosen].effect.security>0?'+':''}{s.choices[chosen].effect.security}%</span>
                  <span className={s.choices[chosen].effect.happiness>0?'text-pink-400':'text-purple-400'}>Happiness {s.choices[chosen].effect.happiness>0?'+':''}{s.choices[chosen].effect.happiness}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ─── MODALS ─── */
  const Modal = ({show, onClose, children}) => show ? (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()} style={{animation:'fadeUp 0.25s ease'}}>{children}</div>
    </div>
  ) : null;

  /* Profile modal */
  const ProfileModal = () => (
    <Modal show={showProfile} onClose={()=>setShowProfile(false)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Your Profile</h2>
          <button onClick={()=>setShowProfile(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
        </div>
        {[
          {label:'Full Name',placeholder:'Avishkar',key:'fullName'},
          {label:'Age',placeholder:'22',key:'age'},
          {label:'Occupation',placeholder:'Student / Professional',key:'occupation'},
          {label:'Monthly Income',placeholder:'₹25,000',key:'monthlyIncome'},
          {label:'Financial Goal',placeholder:'Emergency fund / Home / Invest',key:'financialGoal'},
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">{f.label}</label>
            <input value={profile[f.key]} onChange={e=>setProfile({...profile,[f.key]:e.target.value})} placeholder={f.placeholder}
              className="w-full px-4 py-3 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"/>
          </div>
        ))}
        <button onClick={async ()=>{
          if (token) { await api.saveProfile(token, profile); }
          setShowProfile(false);
        }} className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all active:scale-95">
          Save Profile
        </button>
      </div>
    </Modal>
  );

  /* Achievements modal */
  const AchievementsModal = () => (
    <Modal show={showAchievements} onClose={()=>setShowAchievements(false)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">🏆 Achievements</h2>
          <button onClick={()=>setShowAchievements(false)} className="text-white/40 hover:text-white"><X size={20}/></button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((a,i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${a.ok ? 'bg-white/8 border-purple-500/40' : 'bg-white/3 border-white/8 opacity-50'}`}>
              <span className="text-2xl">{a.icon}</span>
              <div className="flex-1">
                <p className={`font-bold text-sm ${a.ok ? 'text-white' : 'text-white/50'}`}>{a.name}</p>
                <p className="text-white/35 text-xs">{a.desc}</p>
              </div>
              {a.ok && <span className="text-xs px-2.5 py-0.5 bg-green-500/20 text-green-400 rounded-full font-semibold">✓ Unlocked</span>}
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/40 text-sm">Progress</span>
          <span className="text-white font-bold text-sm">{achievements.filter(a=>a.ok).length} / {achievements.length}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{width:`${(achievements.filter(a=>a.ok).length/achievements.length)*100}%`}}/>
        </div>
      </div>
    </Modal>
  );

  /* Chatbot modal */
  const ChatbotModal = () => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    useEffect(() => { if (showChatbot) setTimeout(()=>inputRef.current?.focus(), 200); }, [showChatbot]);

    const send = () => {
      if (!input.trim()) return;
      const userMsg = input.trim();
      setInput('');
      setChatMsgs(prev => [...prev, {role:'user', text:userMsg}]);
      setTimeout(() => {
        setChatMsgs(prev => [...prev, {role:'bot', text: chatbotReply(userMsg)}]);
      }, 600);
    };

    return (
      <Modal show={showChatbot} onClose={()=>setShowChatbot(false)}>
        <div className="flex flex-col h-[520px]">
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center"><Brain size={18} color="#fff"/></div>
              <div><p className="text-white font-bold text-sm">ArthBot</p><p className="text-white/35 text-xs">Your money guide</p></div>
            </div>
            <button onClick={()=>setShowChatbot(false)} className="text-white/40 hover:text-white"><X size={18}/></button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {chatMsgs.map((m,i) => (
              <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`} style={{animation:'fadeUp 0.2s ease'}}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed
                  ${m.role==='user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm' : 'bg-white/8 border border-white/10 text-white/80 rounded-bl-sm'}`}
                  dangerouslySetInnerHTML={{__html: m.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}/>
              </div>
            ))}
            <div ref={chatEnd}/>
          </div>

          {/* input */}
          <div className="px-5 py-4 border-t border-white/10 flex gap-2">
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send();}}
              placeholder="Ask me anything…"
              className="flex-1 px-4 py-2.5 bg-white/6 border border-white/12 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-all"/>
            <button onClick={send} className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:shadow-lg transition-all active:scale-95">
              <Send size={18} color="#fff"/>
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  /* ─── PAGE ROUTER ─── */
  const renderPage = () => {
    switch(page) {
      case 'login':       return <LoginPage />;
      case 'register':    return <RegisterPage />;
      case 'dashboard':   return <DashboardPage />;
      case 'avatars':     return <AvatarsPage />;
      case 'assessment':  return <AssessmentPage />;
      case 'resultScreen':return <ResultScreen />;
      case 'game':        return <GamePage />;
      default:            return <LoginPage />;
    }
  };

  return (
    <div style={{fontFamily:"'Segoe UI', system-ui, sans-serif"}}>
      {/* global keyframes */}
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop      { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes spin     { to { transform:rotate(360deg); } }
      `}</style>

      {renderPage()}

      {/* always-rendered modals (only visible when flags are true) */}
      <ProfileModal />
      <AchievementsModal />
      <ChatbotModal />
    </div>
  );
}
