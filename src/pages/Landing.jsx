import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import logo from '../assets/logo.png';
import { ArrowRight, Check, Code2, Trophy, CalendarDays, FolderKanban, BookOpen, BarChart3, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const features = [
  [Trophy,'Live leaderboard','Turn participation into visible progress with points and rankings.'],
  [CalendarDays,'Events & workshops','Discover club sessions, hackathons and technical workshops in one place.'],
  [FolderKanban,'Project showcase','Publish what you build and create a portfolio your peers can explore.'],
  [BookOpen,'Curated resources','Keep useful docs, roadmaps and learning material organized for the community.'],
  [BarChart3,'Progress dashboard','Track activity, achievements and momentum without spreadsheets.'],
  [ShieldCheck,'Admin control','Approve members and manage the community from one focused workspace.'],
];

const proof = ['50+ active members','30+ projects shipped','Weekly events','Free to join'];

function ProductPreview(){
  return <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.2}} className="saas-window">
    <div className="saas-window-top"><div className="saas-dots"><i/><i/><i/></div><span>codexa.app/dashboard</span><div/></div>
    <div className="saas-product">
      <aside className="saas-mini-sidebar">
        <div className="saas-mini-brand"><img src={logo}/><b>CODEXA</b></div>
        {['Overview','Leaderboard','Projects','Resources'].map((x,i)=><div className={`saas-mini-nav ${i===0?'active':''}`} key={x}><span/><em>{x}</em></div>)}
      </aside>
      <div className="saas-product-main">
        <div className="saas-preview-head"><div><small>WELCOME BACK</small><h3>Build. Learn. Compete.</h3></div><button>+ New project</button></div>
        <div className="saas-metrics">
          {[['142','Total points'],['#3','Club rank'],['7','Events joined']].map(([n,l])=><div key={l}><small>{l}</small><strong>{n}</strong><span>↗ growing</span></div>)}
        </div>
        <div className="saas-preview-grid">
          <div className="saas-chart-card"><div className="saas-card-title"><b>Activity</b><span>Last 8 weeks</span></div><div className="saas-bars">{[42,58,35,72,55,88,66,94].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div>
          <div className="saas-rank-card"><div className="saas-card-title"><b>Top members</b><span>Live</span></div>{[['AK','Arjun K.','520'],['SM','Sneha M.','486'],['JD','Jane D.','442']].map((r,i)=><div className="saas-person" key={r[1]}><strong>{i+1}</strong><i>{r[0]}</i><span>{r[1]}</span><b>{r[2]}</b></div>)}</div>
        </div>
      </div>
    </div>
  </motion.div>
}

export default function Landing(){
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const f=()=>setScrolled(scrollY>24);addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 return <div className="saas-landing">
   <nav className={`saas-nav ${scrolled?'scrolled':''}`}>
    <Link to="/" className="saas-brand"><img src={logo}/><span>CODEXA</span></Link>
    <div className="saas-nav-links"><a href="#features">Features</a><a href="#how">How it works</a></div>
    <div className="saas-nav-actions"><Link to="/admin/login" className="saas-admin-btn">Admin Portal</Link><Link to="/login" className="saas-signin">Sign in</Link><Link to="/register" className="saas-primary">Apply to join <ArrowRight size={16}/></Link></div>
   </nav>

   <main>
    <section className="saas-hero">
      <div className="saas-orb orb-one"/><div className="saas-orb orb-two"/>
      <div className="saas-hero-copy">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="saas-eyebrow"><Sparkles size={14}/> The operating system for your coding club</motion.div>
        <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>Where students   <span>build momentum.</span></motion.h1>
        <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.16}}>CODEXA brings members, events, projects, resources and progress into one focused community platform.</motion.p>
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.24}} className="saas-hero-actions"><Link to="/register" className="saas-primary large">Start your journey <ArrowRight size={18}/></Link><Link to="/login" className="saas-secondary large">Member sign in</Link></motion.div>
        <div className="saas-proof">{proof.map(x=><span key={x}><Check size={15}/>{x}</span>)}</div>
      </div>
      <ProductPreview/>
    </section>

    <section className="saas-logo-strip"><span>One platform for</span>{['LEARNING','PROJECTS','EVENTS','COMMUNITY','GROWTH'].map(x=><b key={x}>{x}</b>)}</section>

    <section id="features" className="saas-section">
      <div className="saas-section-head"><div><span className="saas-kicker">EVERYTHING CONNECTED</span><h2>A  platform  for coding .</h2></div><p>Stop managing your club across forms, spreadsheets and chat threads. Give members one place to participate and grow.</p></div>
      <div className="saas-feature-grid">{features.map(([Icon,title,desc],i)=><motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} key={title} style={{position:'relative',overflow:'hidden'}}>
        <div className="saas-login-ribbon">LOGIN REQUIRED</div>
        <div className="saas-feature-icon"><Icon size={22}/></div><h3>{title}</h3><p>{desc}</p>
        <Link to="/login" className="saas-explore-link">Explore feature <ArrowRight size={14}/></Link>
      </motion.article>)}</div>
    </section>

    <section id="how" className="saas-dark-section">
      <div className="saas-dark-copy"><span className="saas-kicker">HOW CODEXA WORKS</span><h2>From learning to leading.</h2><p>A simple member journey that turns participation into measurable progress.</p><div className="saas-steps">{[['01','Apply','Submit your profile and interests.'],['02','Participate','Join workshops, events and projects.'],['03','Grow','Earn points, badges and visibility.']].map(s=><div key={s[0]}><b>{s[0]}</b><span><strong>{s[1]}</strong><em>{s[2]}</em></span></div>)}</div></div>
      <div className="saas-code-card"><div className="saas-code-top"><Code2 size={18}/><span>member_progress.json</span></div><pre>{`{\n  "member": "Jane Developer",\n  "rank": 3,\n  "points": 442,\n  "projects": 6,\n  "badges": [\n    "Code Sprinter",\n    "Workshop Graduate"\n  ],\n  "status": "building"\n}`}</pre><div className="saas-code-status"><span/><b>All systems operational</b></div></div>
    </section>

    <section className="saas-cta"><div className="saas-cta-icon"><Zap size={28}/></div><h2>Ready to build your developer story?</h2><p>Join CODEXA and turn every workshop, project and event into visible progress.</p><div><Link to="/register" className="saas-primary large">Apply to join <ArrowRight size={18}/></Link><Link to="/admin/login" className="saas-secondary large">Open Admin Portal</Link></div></section>
   </main>
   <footer className="saas-footer"><Link to="/" className="saas-brand"><img src={logo}/><span>CODEXA</span></Link><p>Built for student developers who want to ship more.</p><span>© {new Date().getFullYear()} CODEXA</span></footer>
 </div>
}
