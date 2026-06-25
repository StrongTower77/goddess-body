import { useState } from "react";

/* ── Global CSS — fonts loaded via index.html ── */
const STYLE_TAG = `
  /* ── Reset & Base ── */
  html,body{margin:0!important;padding:0!important;background:#0a0312!important;width:100%;overflow-x:hidden;-webkit-tap-highlight-color:transparent;}
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:#0a0410;}
  ::-webkit-scrollbar-thumb{background:#5a2a70;border-radius:2px;}

  /* ── Mobile tap highlight removal ── */
  button,a,[role=button]{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

  /* ── Day cards ── */
  .day-card{transition:transform 0.15s,box-shadow 0.15s;cursor:pointer;}
  @media(hover:hover){.day-card:hover{transform:translateY(-2px);}}
  .week-hdr{transition:background 0.2s;cursor:pointer;}
  @media(hover:hover){.week-hdr:hover{background:#1e0828!important;}}
  .toggle-pill{transition:all 0.25s;}
  .flare-btn{transition:all 0.2s;}
  .flare-btn:hover{opacity:0.85!important;}

  /* ── Vision board photos ── */
  .ref-photo{transition:transform 0.35s cubic-bezier(.25,.8,.25,1),box-shadow 0.35s,filter 0.35s;cursor:pointer;filter:brightness(0.88) saturate(0.95);}
  @media(hover:hover){.ref-photo:hover{transform:scale(1.04);filter:brightness(1.06) saturate(1.1);box-shadow:0 8px 32px rgba(201,168,76,0.35);}}
  .ref-photo:active{transform:scale(0.97);filter:brightness(1.1);}

  /* ── Lightbox ── */
  @keyframes fadeInScale{from{opacity:0;transform:scale(0.82)}to{opacity:1;transform:scale(1)}}
  @keyframes lightboxBg{from{opacity:0}to{opacity:1}}
  .lightbox-overlay{animation:lightboxBg 0.3s ease forwards;}
  .lightbox-img{animation:fadeInScale 0.4s cubic-bezier(.25,.8,.25,1) forwards;}

  /* ── Desktop layout ── */
  @media(min-width:768px){
    .app-inner{max-width:720px;margin:0 auto;}
    .tab-bar{max-width:720px;margin:0 auto;}
    .day-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(139,47,168,0.25);}
  }
  @media(min-width:1024px){
    .app-inner{max-width:800px;}
    .tab-bar{max-width:800px;}
  }

  /* ── Mobile touch optimization ── */
  @media(max-width:480px){
    .week-hdr{padding:14px 16px!important;}
    .day-card{padding:12px!important;}
  }

  /* ── Input & button focus styles ── */
  input:focus{outline:none!important;}
  button:focus-visible{outline:2px solid #c9a84c;outline-offset:2px;}
`;

/* ── Type styles: Deep Plum · Sage Green · Pink · Gold ── */
const TS = {
  "Lower Body + Glutes":    {bg:"#1a0824",border:"#5a1a7a",badge:"#b06ac8",icon:"🍑"},
  "Lower Body Build":       {bg:"#1a0824",border:"#5a1a7a",badge:"#b06ac8",icon:"🍑"},
  "Lower Body Power":       {bg:"#1a0824",border:"#5a1a7a",badge:"#b06ac8",icon:"🍑"},
  "Lower Body Peak":        {bg:"#1a0824",border:"#5a1a7a",badge:"#c9a84c",icon:"👑"},
  "Lower Body Celebration": {bg:"#1a0824",border:"#5a1a7a",badge:"#c9a84c",icon:"🏆"},
  "Core + Upper Body":      {bg:"#240a18",border:"#7a2a4a",badge:"#e8849a",icon:"💪🏾"},
  "Core + Arms":            {bg:"#240a18",border:"#7a2a4a",badge:"#e8849a",icon:"💪🏾"},
  "Core + Arms Peak":       {bg:"#240a18",border:"#7a2a4a",badge:"#e8849a",icon:"💪🏾"},
  "Full Body Circuit":      {bg:"#1a140a",border:"#5a4a1a",badge:"#c9a84c",icon:"⚡"},
  "Full Body + Stairmaster":{bg:"#1a140a",border:"#5a4a1a",badge:"#c9a84c",icon:"⚡"},
  "Full Body Strength":     {bg:"#1a140a",border:"#5a4a1a",badge:"#c9a84c",icon:"⚡"},
  "Full Body Peak":         {bg:"#1a140a",border:"#5a4a1a",badge:"#c9a84c",icon:"⚡"},
  "PT + Yoga":              {bg:"#0a180c",border:"#2a5a30",badge:"#7a9b76",icon:"🧘🏾"},
  "REST":                   {bg:"#131313",border:"#2a2a2a",badge:"#666",   icon:"😴"},
  /* ── Phase 2 types ── */
  "Lower Body Supersets":   {bg:"#1a0428",border:"#7a1a5a",badge:"#D4649A",icon:"🍑"},
  "Core + Pull Circuit":    {bg:"#0a1a0e",border:"#1a6a3a",badge:"#7AC88A",icon:"💪🏾"},
  "Full Body Burn":         {bg:"#1a1408",border:"#5a4018",badge:"#D4A84C",icon:"⚡"},
  "Glute + Hamstring":      {bg:"#200418",border:"#8a1a68",badge:"#F04AA0",icon:"🍑"},
  "Arms + Core Advanced":   {bg:"#0a1a14",border:"#1a7a4a",badge:"#6ACE8A",icon:"💪🏾"},
  "Full Body Tabata":       {bg:"#1a1208",border:"#7a4a18",badge:"#E8A84C",icon:"⚡"},
  "Heavy Lower Body":       {bg:"#240420",border:"#9a1a78",badge:"#F060B8",icon:"🍑"},
  "Back + Core Circuit":    {bg:"#041a10",border:"#2a7a4a",badge:"#4ACA7A",icon:"💪🏾"},
  "Full Body AMRAP":        {bg:"#1a1608",border:"#6a5018",badge:"#EAC04C",icon:"⚡"},
  "Core + Arms Peak II":    {bg:"#081a10",border:"#1a8a5a",badge:"#4AD87A",icon:"💪🏾"},
  "Full Body Breakthrough":  {bg:"#18160a",border:"#7a6020",badge:"#D4B44C",icon:"⚡"},
  "Lower Body P2 Finale":   {bg:"#220618",border:"#9a1a78",badge:"#F050B8",icon:"🍑"},
  /* ── Phase 3 types ── */
  "Lower Body Mastery":      {bg:"#200420",border:"#8a1888",badge:"#D050C8",icon:"🍑"},
  "Core Mastery":            {bg:"#041c10",border:"#1a8a50",badge:"#40D880",icon:"💪🏾"},
  "Full Body Mastery":       {bg:"#1c1808",border:"#8a6820",badge:"#E0C04C",icon:"⚡"},
  "Lower Body Legacy":       {bg:"#04201c",border:"#1a8a6a",badge:"#40D8A8",icon:"🍑"},
  "Upper Body Legacy":       {bg:"#041818",border:"#1a7878",badge:"#40C8C8",icon:"💪🏾"},
  "Full Body Legacy":        {bg:"#1c1a08",border:"#8a7020",badge:"#E0CC4C",icon:"⚡"},
  "Lower Body Transformation":{bg:"#240420",border:"#9a1890",badge:"#E050D8",icon:"🍑"},
  "Core Transformation":     {bg:"#041e14",border:"#1a9058",badge:"#38D888",icon:"💪🏾"},
  "Full Body Transformation": {bg:"#1e1c08",border:"#9a7820",badge:"#E8D050",icon:"⚡"},
  "Lower Body Ascension":    {bg:"#200228",border:"#8808A8",badge:"#B840E8",icon:"🍑"},
  "Core + Arms Ascension":   {bg:"#041e18",border:"#0a9878",badge:"#20D8B8",icon:"💪🏾"},
  "Full Body Goddess":       {bg:"#201808",border:"#C9A84C",badge:"#F0D460",icon:"👑"},
};

const weekMeta = [
  /* Phase 1 */
  {num:1, theme:"Foundation",   dates:"Jun 26–Jul 2", phase:1},
  {num:2, theme:"Build",        dates:"Jul 3–9",    phase:1},
  {num:3, theme:"Strength",     dates:"Jul 10–16",  phase:1},
  {num:4, theme:"Peak",         dates:"Jul 17–23",  phase:1},
  /* Phase 2 */
  {num:5, theme:"Power Rising", dates:"Jul 24–30",  phase:2},
  {num:6, theme:"Building",     dates:"Jul 31–Aug 6",phase:2},
  {num:7, theme:"Surge",        dates:"Aug 7–13",   phase:2},
  {num:8, theme:"Breakthrough", dates:"Aug 14–20",  phase:2},
  /* Phase 3 */
  {num:9, theme:"Mastery",      dates:"Aug 21–27",  phase:3},
  {num:10,theme:"Legacy",       dates:"Aug 28–Sep 3",phase:3},
  {num:11,theme:"Transformation",dates:"Sep 4–10",  phase:3},
  {num:12,theme:"Ascension",    dates:"Sep 11–23",  phase:3},
];

/* ── Line type classifier ── */
const lineType = (e) => {
  if (e.startsWith("•")) return "bullet";
  if (e.startsWith("🧘🏾") || e.startsWith("🌸") || e.startsWith("💛")) return "note";
  const isEx = e.includes("×") && !e.includes("|") &&
    !/^(Add |MUST |End |🏆|Between|Full |Drink|Sleep|Meal |Complete|Hydrate|4 Rounds|Then |Light |Note:|After |Tell |Focus:|Post-|Before )/.test(e);
  return isEx ? "exercise" : "note";
};

/* ── Cardio Pools — fibromyalgia-aware, low-to-moderate intensity ── */
const CARDIO_POOLS = {
  lower:{
    gym:[
      {name:"Stairmaster",icon:"🪜",dur:"15–20 min",intensity:"Moderate",
       protocol:"Steady moderate pace — take your time, this is not a race. Full steps, squeeze glutes on each extension.",
       why:"Stairmaster extends glute time-under-tension from your leg session. Every step is more glute work without additional bar load."},
      {name:"Treadmill Incline Walk",icon:"🚶🏾‍♀️",dur:"15 min",intensity:"Light-Moderate",
       protocol:"Incline 5–8%, speed 2.8–3.5 mph — hands off rails, upright posture, feel your glutes activate on every step.",
       why:"Incline walking after leg day keeps glutes active in a low-impact way that doesn't overtax the body — great for fibromyalgia management."},
      {name:"Stationary Bike",icon:"🚴🏾‍♀️",dur:"15 min",intensity:"Light",
       protocol:"Easy resistance, comfortable pace — this is active recovery cardio. Flush the lactic acid from the legs without adding fatigue.",
       why:"Gentle cycling after lower body sessions promotes blood flow and reduces next-day soreness without joint stress."},
    ],
    home:[
      {name:"Brisk Walk",icon:"🚶🏾‍♀️",dur:"15–20 min",intensity:"Light-Moderate",
       protocol:"Brisk but comfortable pace — upright posture, breathe through the nose if possible. This is movement, not cardio punishment.",
       why:"Walking is the most accessible and fibromyalgia-friendly cardio available. It promotes blood flow and endorphins without triggering flares."},
      {name:"Stair Walking",icon:"🪜",dur:"12 min",intensity:"Moderate",
       protocol:"Walk up steadily / walk down carefully × 10 sets — take your time, no rushing. This is your home stairmaster.",
       why:"Stair walking activates the glutes on every step — the closest home equivalent to the gym stairmaster."},
    ],
  },
  core:{
    gym:[
      {name:"Treadmill Easy Walk",icon:"🚶🏾‍♀️",dur:"10 min",intensity:"Light",
       protocol:"Flat or slight incline, easy conversational pace — this is your cool-down cardio after core work. Keep moving.",
       why:"Light treadmill walking after core work maintains elevated heart rate without further loading the midsection."},
      {name:"Elliptical",icon:"🔄",dur:"10 min",intensity:"Light",
       protocol:"Easy resistance, smooth fluid motion — no holding the rails. Let your arms move naturally.",
       why:"The elliptical is low-impact and fibromyalgia-friendly — keeps the body moving after core work without shoulder or back strain."},
    ],
    home:[
      {name:"Easy Walk",icon:"🚶🏾‍♀️",dur:"10–12 min",intensity:"Light",
       protocol:"Gentle walk at your own pace — outdoors is ideal for fresh air and vitamin D (helps with fibromyalgia and she's on D supplements).",
       why:"Outdoor walking after core work gives the body vitamin D exposure (supporting her supplement routine) and gentle active recovery."},
    ],
  },
  fullbody:{
    gym:[
      {name:"Stairmaster",icon:"🪜",dur:"15–20 min",intensity:"Moderate",
       protocol:"Moderate steady pace — this is your signature cardio. Upright posture, glutes firing on every step.",
       why:"Stairmaster is a full-body posterior chain tool. After a full-body session it extends the training effect on glutes and back simultaneously."},
      {name:"Treadmill Incline Walk",icon:"🚶🏾‍♀️",dur:"15 min",intensity:"Light-Moderate",
       protocol:"Incline 6–8%, moderate pace — breathe steady, use the full stride. Don't rush.",
       why:"Incline walking after full-body training keeps the posterior chain active and burns additional calories without joint stress."},
    ],
    home:[
      {name:"Brisk Walk",icon:"🚶🏾‍♀️",dur:"15–20 min",intensity:"Light-Moderate",
       protocol:"Brisk pace for 15–20 min — arms swinging, breathing deeper. End with 5 min slow cool-down walk.",
       why:"Brisk walking is one of the best post-full-body activities for someone managing fibromyalgia — it reduces inflammation and improves mood."},
    ],
  },
  yoga:   {gym:[],home:[]},
  rest:   {gym:[],home:[]},
};

const getCardioGroup = (type) => {
  const lower = ["Lower Body + Glutes","Lower Body Build","Lower Body Power","Lower Body Peak","Lower Body Celebration",
    "Lower Body Supersets","Glute + Hamstring","Heavy Lower Body","Lower Body P2 Finale",
    "Lower Body Mastery","Lower Body Legacy","Lower Body Transformation","Lower Body Ascension"];
  const core  = ["Core + Upper Body","Core + Arms","Core + Arms Peak",
    "Core + Pull Circuit","Arms + Core Advanced","Back + Core Circuit","Core + Arms Peak II",
    "Core Mastery","Upper Body Legacy","Core Transformation","Core + Arms Ascension"];
  const full  = ["Full Body Circuit","Full Body + Stairmaster","Full Body Strength","Full Body Peak",
    "Full Body Burn","Full Body Tabata","Full Body AMRAP","Full Body Breakthrough",
    "Full Body Mastery","Full Body Legacy","Full Body Transformation","Full Body Goddess"];
  if(lower.includes(type)) return "lower";
  if(core.includes(type))  return "core";
  if(full.includes(type))  return "fullbody";
  if(type === "PT + Yoga") return "yoga";
  return "rest";
};

/* ── Module-level constants ── */
const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ════════ ALL 30 DAYS ════════ */
const allDays = [
{date:"Jun 26",wd:"Fri",week:1,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — hip openers + grounding flow before PT",
       "Physical therapy session — mention plan start to your PT today",
       "Tell your PT: 'I'm starting a 3-day strength program. Lower body, core, and light upper body.'",
       "After PT: 10 min gentle cool-down stretch — hips, spine, shoulders",
       "Focus: hip mobility, shoulder gentle range of motion, spinal alignment",
   ],
   cardio:"Light walk to/from PT if possible",
   tip:"You showed up. Day 1 sets the tone for all 30. PT and yoga today plant the seed. Come Thursday — we water it."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min) — sun salutation flow or gentle hip opener sequence",
       "Physical therapy session (travel to PT on M/W/F)",
       "Post-PT: 10 min restorative stretch — child's pose, supine twist, pigeon",
       "Focus: establish your routine for the next 30 days",
   ],
   cardio:"Easy 10 min walk after PT",
   tip:"First day. The fact that you're here, reading this, moving your body — that's the version of you that finishes this. Carry that energy into Thursday."
 }},
{date:"Jun 27",wd:"Sat",week:1,type:"Lower Body + Glutes",workout:true,
 gym:{
   ex:["Leg Press — 3×15 · feet high and wide on platform, glute squeeze at top",
       "Sumo Squat (bodyweight or very light DB) — 3×15 · toes out, sit deep",
       "Glute Bridge (floor) — 3×20 · drive through heels, 1s hold at top",
       "Seated Leg Curl — 3×15 · light weight, control the lowering",
       "Abductor Machine — 3×20 · slow and controlled, feel outer glute",
       "Cable Glute Kickback — 3×12 ea. · full hip extension, squeeze hard",
   ],
   cardio:"15 min treadmill incline walk (incline 5–6%, easy pace)",
   tip:"Session 1 of 13 is in the books. You just laid the foundation your glutes and thighs will be built on. Saturday you come back for upper body — arrive ready."
 },
 home:{
   ex:["Sumo Squat (10lb kettlebell) — 3×15 · hold at chest, feet wide, sit deep",
       "Glute Bridge — 3×20 · drive through heels, full squeeze, 1s hold",
       "Donkey Kicks (band optional) — 3×15 ea. · hips level, flex foot at top",
       "Fire Hydrants — 3×15 ea. · rotate from hip, not lower back",
       "Clamshells (band above knees) — 3×20 ea. · keep hips stacked",
       "Standing Glute Kickback (band around ankle) — 3×12 ea.",
   ],
   cardio:"15 min brisk walk",
   tip:"First session done. You didn't just work out — you sent your body a message. 12 sessions remain. The Goddess showed up for Session 1."
 },
 flare:["Lying glute squeeze — 3×20 (lying flat on back, just squeeze glutes together)",
        "Supine figure-4 stretch — 60s each side (cross ankle over opposite knee)",
        "Gentle hip circles (lying on back, knees to chest) — 2×10 each direction",
        "Supported chair squat — sit and stand slowly from chair × 10",
        "Child's pose with gentle sway — 2 min",
        "Breathe and rest — gentle movement counts today"],
 flareTip:"Your body chose rest today and that is not failure. These gentle movements keep circulation moving and joints lubricated without triggering inflammation. This IS training when fibromyalgia is active."},
{date:"Jun 28",wd:"Sun",week:1,type:"REST",workout:false,
 gym:{
   ex:["Complete rest — no training",
       "Anti-inflammatory self-care: warm Epsom salt bath or warm compress on any sore areas",
       "Tart cherry juice (4 oz) — natural fibromyalgia pain reducer",
       "Light stretching if desired — 10 min maximum",
       "Magnesium lotion or supplement if available — supports muscle recovery and sleep",
   ],
   cardio:"None",
   tip:"Two sessions. Two wins. Your body is rebuilding from the inside out right now. Eat well, sleep deep, hydrate. Tuesday you close out Week 1 — show up fresh."
 },
 home:{
   ex:["Complete rest — no training",
       "Anti-inflammatory self-care: warm bath, gentle massage, heating pad if needed",
       "Tart cherry juice (4 oz) — reduces inflammation naturally",
       "Vitamin D exposure: 15–20 min of sunlight supports your supplement routine",
   ],
   cardio:"None",
   tip:"Rest is where muscle is built. You've done the work — let your body do its part today. Week 2 starts Monday. Come back charged."
 }},
{date:"Jun 29",wd:"Mon",week:1,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — gentle flow focusing on lower body recovery",
       "Physical therapy session",
       "Yoga recovery poses after PT: pigeon pose 60s ea, hamstring stretch 60s ea, hip flexor lunge 60s ea",
       "Focus: recover from Thursday's leg session — let PT know what's sore",
   ],
   cardio:"Easy walk",
   tip:"Your legs worked hard yesterday. Let PT help you recover fully. Sunday is rest. Monday builds again — go into the weekend knowing you earned every bit of it."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min) — lower body recovery flow",
       "Physical therapy session",
       "Post-PT recovery: pigeon pose, butterfly stretch, gentle spinal twist",
   ],
   cardio:"Easy 10 min walk",
   tip:"Every PT session is an investment in what comes next. The deeper you recover today, the harder you push Monday. You're already building toward Week 2."
 }},
{date:"Jun 30",wd:"Tue",week:1,type:"Core + Upper Body",workout:true,
 gym:{
   ex:["Lat Pulldown (light) — 3×12 · lean back slightly, pull to upper chest, squeeze lats",
       "Seated Cable Row (light) — 3×15 · elbows close, squeeze between shoulder blades",
       "Band Pull-Apart — 3×20 · arms straight, shoulder height — shoulder-safe strengthener",
       "Bicep Curl (5–8 lb DB) — 3×12 · no swinging, full range",
       "Tricep Pushdown (cable or band) — 3×12 · elbows tucked, extend fully",
       "Forearm Plank — 3×30s · core braced, breathe steadily",
       "Bicycle Crunches — 3×20 · slow, full rotation each rep",
       "Leg Raises — 3×12 · lower back stays flat on mat throughout",
   ],
   cardio:"10 min elliptical, easy pace",
   tip:"Back. Core. Arms. Two sessions in and the foundation is forming. Sunday is yours — rest fully. Monday starts Week 2 and the work gets real."
 },
 home:{
   ex:["Band Row (door anchor at waist height) — 3×15 · pull elbows back, squeeze blades",
       "Band Pull-Apart — 3×20 · arms straight, pull to chest height",
       "Bicep Curl (band) — 3×12 · stand on band, curl both arms",
       "Tricep Kickback (band) — 3×12 · hinge forward, extend arm back fully",
       "Forearm Plank — 3×30s",
       "Bicycle Crunches — 3×20 · slow and deliberate",
       "Leg Raises — 3×12",
       "Flutter Kicks — 3×15 · small controlled kicks, lower back flat",
   ],
   cardio:"10 min easy walk",
   tip:"Workout 2 done. Your core and back are going to surprise you in the coming weeks. Rest Sunday. Come back Monday knowing Session 3 closes out Week 1 strong."
 },
 flare:["Seated shoulder rolls — 10 forward, 10 backward",
        "Gentle neck stretch — 30s each side",
        "Seated band pull-apart (very light) — 2×12",
        "Seated knee lifts (core activation) — 3×10",
        "Supine leg raises (very gentle) — 2×8",
        "Breathe deeply — 5 min guided breathing"],
 flareTip:"Upper body flare protocol today. Seated movements only — no lying face-down if that triggers pain. Shoulder rolls and gentle breathing activate the nervous system without loading the joints."},
{date:"Jul 1",wd:"Wed",week:1,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — grounding flow to start the week",
       "Physical therapy session",
       "Focus this week on your shoulder range of motion in PT — tell your PT the shoulder took no load this weekend",
       "Post-PT: 10 min upper body gentle stretch — shoulder cross-body, chest doorway stretch",
   ],
   cardio:"Easy walk",
   tip:"Tuesday is Full Body — your first time hitting everything in one session. PT today sets up your joints and your mind. Come tomorrow ready to use all of it."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min)",
       "Physical therapy session",
       "Upper body recovery yoga: thread the needle pose, puppy pose, gentle shoulder circles",
   ],
   cardio:"Easy walk 10 min",
   tip:"One more day before you close out Week 1. PT and yoga today are your sharpening stone. Full body circuit tomorrow — show up sharp."
 }},
{date:"Jul 2",wd:"Thu",week:1,type:"Full Body Circuit",workout:true,
 gym:{
   ex:["Leg Press — 3×12 · same weight as Thursday or very slightly more",
       "Lat Pulldown — 3×12 · light weight, focus on form",
       "Sumo Squat (light DB) — 3×15",
       "Seated Cable Row — 3×12",
       "Glute Bridge (floor) — 3×20",
       "Bicycle Crunches — 3×20",
       "Forearm Plank — 3×30s",
   ],
   cardio:"15 min stairmaster, easy steady pace",
   tip:"Week 1 complete. All 3 sessions — lower body, upper body, full body. You ran the full table. Rest tomorrow. Come back Thursday knowing Week 2 brings progressive load and heavier hip thrusts."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 3×15",
       "Band Row — 3×12",
       "Glute Bridge — 3×20",
       "Band Bicep Curl — 3×12",
       "Bicycle Crunches — 3×20",
       "Forearm Plank — 3×30s",
   ],
   cardio:"15 min brisk walk (hills or stairs preferred)",
   tip:"Three sessions. One full week. Done. Rest tomorrow — not because you're tired, but because Week 2 deserves a fully charged version of you."
 },
 flare:["Seated sumo squat (hold chair for support) — 2×10",
        "Seated band row — 2×12",
        "Lying glute bridge — 2×15",
        "Seated knee raises — 2×10",
        "Child's pose — 2 min",
        "Rest and gentle breathing"],
 flareTip:"Completing Week 1 on a flare day is still completing Week 1. These seated and lying movements count."},
{date:"Jul 3",wd:"Fri",week:2,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — energizing flow to start Week 2",
       "Physical therapy session",
       "Tell your PT: Week 1 is complete — assess recovery and progress",
       "Ask PT about any hip flexor tightness from leg press work",
       "Post-PT stretch: 10 min",
   ],
   cardio:"Easy walk",
   tip:"Week 2 is here. Your body already knows how to do this. Thursday brings the hip thrusts — the exercise that builds exactly what you're chasing. Come in ready."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min)",
       "Physical therapy session",
       "Post-PT: hip flexor and glute recovery stretch",
   ],
   cardio:"Easy walk 10 min",
   tip:"Week 2. The version of you who shows up this week is already stronger than June 24. Thursday we go heavier. Prepare for it."
 }},
{date:"Jul 4",wd:"Sat",week:2,type:"Lower Body Build",workout:true,
 gym:{
   ex:["Leg Press — 3×15 · add 10–20 lbs from Week 1",
       "Romanian Deadlift (2×10 lb DB) — 3×12 · hinge hips back, feel hamstring stretch",
       "Hip Thrust (back on bench, bodyweight) — 3×15 · drive through heels, full hip extension",
       "Seated Leg Curl — 3×15 · control the lowering phase",
       "Abductor Machine — 3×20",
       "Step-Ups (box or bench, bodyweight) — 3×10 ea. · drive through heel of elevated leg",
   ],
   cardio:"15 min treadmill incline walk",
   tip:"Hip thrusts are officially in your arsenal. Every rep is sculpting exactly what those reference photos show. Saturday we come for core and arms — rest tomorrow and let these glutes grow."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 3×15 · heavier intention this week",
       "Romanian Deadlift (kettlebell) — 3×12 · hinge at hips, feel the hamstring stretch",
       "Hip Thrust (shoulders on couch) — 3×15 · 1s hold at top",
       "Clamshells (band) — 3×20 ea.",
       "Step-Ups (sturdy chair) — 3×10 ea. · heel drives through elevated surface",
       "Donkey Kicks (band) — 3×15 ea.",
   ],
   cardio:"15 min brisk walk",
   tip:"Couch hip thrusts just became your most powerful tool. You felt the glutes fire — that's the signal. Saturday we build on it."
 },
 flare:["Lying glute bridge — 2×12 (very gentle)",
        "Supine leg slide — 2×10 each leg",
        "Gentle hamstring stretch — 60s each side",
        "Supported step-up on low surface (4 inch) — 2×6 ea.",
        "Child's pose — 2 min",
        "Warm compress on hips if tender"],
 flareTip:"Lower body flare day. Bridges and gentle leg slides keep the glutes activated without loading the joints. Warm compress after movement reduces fibromyalgia inflammation."},
{date:"Jul 5",wd:"Sun",week:2,type:"REST",workout:false,
 gym:{
   ex:["Complete rest",
       "Tart cherry juice (4 oz) — proven to reduce fibromyalgia pain markers",
       "Epsom salt bath if available",
       "Journal: How did Week 2 feel compared to Week 1? Note progress.",
   ],
   cardio:"None",
   tip:"5 sessions. 5 wins. Today your body is in active muscle-building mode. Feed it, rest it, trust it. Monday we set up the strongest week yet."
 },
 home:{
   ex:["Complete rest",
       "Anti-inflammatory self-care: warm bath, gentle self-massage",
       "Sunlight exposure: 15–20 min for vitamin D",
       "Hydrate well — 2.5–3L water",
   ],
   cardio:"None",
   tip:"5 sessions. 5 wins. Eat your carbs, drink your water, sleep long. Monday sets up a stronger week — and you've earned every bit of it."
 }},
{date:"Jul 6",wd:"Mon",week:2,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — lower body recovery flow",
       "Physical therapy session",
       "Tell PT about hip thrust introduction and any hip flexor tension",
       "Post-PT: glute stretch, hamstring release, pigeon pose",
   ],
   cardio:"Easy walk",
   tip:"Your glutes worked harder yesterday than they ever have. PT is doing repair work right now. Saturday's core session needs all of you — arrive recovered and ready."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min) — pigeon pose, lizard pose, happy baby",
       "Physical therapy session",
       "Recovery stretch: butterfly, supine figure-4, gentle spinal twist",
   ],
   cardio:"Easy walk",
   tip:"Two intentional days in a row. That's what discipline in motion looks like. Core session tomorrow — come ready."
 }},
{date:"Jul 7",wd:"Tue",week:2,type:"Core + Arms",workout:true,
 gym:{
   ex:["Lat Pulldown — 3×12 · slightly more weight than Week 1",
       "Bicep Curl (8–10 lb DB) — 3×12",
       "Tricep Pushdown (cable) — 3×12 · heavier than Week 1",
       "Seated Cable Row — 3×12",
       "Leg Raises — 3×15 · 3 more reps than Week 1",
       "Bicycle Crunches — 3×25 · slow and controlled",
       "Dead Bug — 3×10 ea. · exhale fully, press lower back flat",
       "Side Plank (forearm) — 2×20s ea.",
   ],
   cardio:"10 min stairmaster easy",
   tip:"5 sessions in. Arms, back, core — all getting stronger. The waist you're chasing is being built from the inside out right now. Rest Sunday. Week 3 is a different level."
 },
 home:{
   ex:["Band Row — 3×15 · max current tension",
       "Bicep Curl (band, heavier band) — 3×12",
       "Tricep Kickback (band) — 3×12",
       "Band Pull-Apart — 3×25",
       "Leg Raises — 3×15",
       "Bicycle Crunches — 3×25",
       "Dead Bug — 3×10 ea.",
       "Side Plank — 2×20s ea.",
   ],
   cardio:"10 min easy walk",
   tip:"Session 5 done. Your core is developing something it didn't have 2 weeks ago — and you can feel it. Rest well. Week 3 comes Monday and it brings new weight."
 },
 flare:["Seated shoulder rolls — 10 forward/back",
        "Seated band pull-apart (light) — 2×10",
        "Lying leg raises — 2×8",
        "Seated knee raises — 2×10",
        "Gentle cat-cow — 2×10",
        "Breathing meditation — 5 min"],
 flareTip:"Seated core and shoulder work today. Sitting upright activates the deep core passively while you do upper body movements. This counts."},
{date:"Jul 8",wd:"Wed",week:2,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga — shoulder-opening flow (eagle arms, cow face arms gently)",
       "Physical therapy session",
       "Ask PT to work on shoulder mobility today — Tuesday is full body",
       "Post-PT: spinal decompression, shoulder cross-body stretch",
   ],
   cardio:"Easy walk",
   tip:"Tuesday is Full Body + Stairmaster — your signature session. Every step on that machine is glute work and cardio combined. PT today is your preparation. Come tomorrow locked in."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min) — gentle shoulder and spine focus",
       "Physical therapy session",
       "Post-PT: 10 min recovery stretch",
   ],
   cardio:"Easy walk 10 min",
   tip:"Tomorrow is full body. Everything you've built in 6 sessions comes together Tuesday. Let PT and yoga sharpen you today — arrive tomorrow ready."
 }},
{date:"Jul 9",wd:"Thu",week:2,type:"Full Body + Stairmaster",workout:true,
 gym:{
   ex:["Leg Press — 4×12 · 4 sets now, moderate weight",
       "Lat Pulldown — 3×12 · progressive load",
       "Hip Thrust (bench) — 3×15 · heavier than Thursday",
       "Romanian Deadlift — 3×12 · light-moderate DBs",
       "Bicycle Crunches — 3×25",
       "Forearm Plank — 3×40s · 10s longer than Week 1",
   ],
   cardio:"20 min stairmaster, moderate steady pace",
   tip:"6 sessions complete. Two full weeks of work. The stairmaster after weights is your edge — own it. Rest tomorrow. Week 3 is Strength Week and it's a different level entirely."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 3×15",
       "Hip Thrust (couch, heavier) — 3×15",
       "Romanian DL (kettlebell) — 3×12",
       "Band Row — 3×12",
       "Bicycle Crunches — 3×25",
       "Forearm Plank — 3×40s",
   ],
   cardio:"20 min brisk walk (incline or hills)",
   tip:"6 down. 7 to go. You are past the halfway mark on sessions and you haven't missed a beat. Rest tomorrow. Strength Week starts Wednesday — come back ready."
 },
 flare:["Seated leg press simulation (push against wall from seated position) — 2×12",
        "Lying glute bridge — 2×12",
        "Band row (seated, very light) — 2×10",
        "Gentle bicycle (slow motion) — 2×10",
        "Forearm plank — 1×20s",
        "Rest between movements — as much as needed"],
 flareTip:"Full body flare protocol. Each of these movements targets a different area gently. Complete what you can and rest when needed. Partial sessions still build the body."},
{date:"Jul 10",wd:"Fri",week:3,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga — energizing flow (sun salutations ×5)",
       "Physical therapy session",
       "Tell PT: entering Strength week — heavier loads, ask about any needed modifications",
       "Focus in PT: hip stability and shoulder range of motion",
   ],
   cardio:"Easy walk",
   tip:"Strength Week. The weights go up starting tomorrow. Your body is ready — 2 weeks of training built it for exactly this. PT today primes the joints. Show up Thursday hungry."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min) — sun salutations + warrior poses",
       "Physical therapy session",
       "Post-PT recovery stretch",
   ],
   cardio:"Easy walk",
   tip:"Week 3 is Strength Week. Thursday you add load to everything. PT and yoga today are your physical and spiritual preparation. Arrive tomorrow ready to feel the difference."
 }},
{date:"Jul 11",wd:"Sat",week:3,type:"Lower Body Power",workout:true,
 gym:{
   ex:["Leg Press — 4×12 · heavier than Week 2",
       "Hip Thrust (barbell or plate, light-moderate) — 4×12 · 4 sets now",
       "Sumo Squat (DBs or goblet) — 3×12",
       "Seated Leg Curl — 3×15",
       "Abductor Machine — 3×20",
       "Step-Ups (bodyweight, controlled tempo) — 3×12 ea.",
   ],
   cardio:"20 min stairmaster moderate",
   tip:"The heaviest lower body session yet. You felt the difference in every set. That burn in the glutes is the Teyana Taylor physique being built, rep by rep. Saturday we hit core — rest and let these legs grow."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 4×12 · more reps per set",
       "Hip Thrust (couch, max load available) — 4×12",
       "Romanian DL (kettlebell) — 3×12",
       "Donkey Kicks (heavy band) — 3×15 ea.",
       "Step-Ups (sturdy chair) — 3×12 ea.",
       "Lateral Band Walk — 3×20 ea. · stay low, wide steps",
   ],
   cardio:"20 min brisk walk",
   tip:"Maximum home resistance. The kettlebell and the couch did serious work today. Your glutes are responding. Saturday's core session will show you how much stronger you've become."
 },
 flare:["Lying glute bridge (very slow) — 2×10",
        "Supine figure-4 — 60s each side",
        "Seated leg extension (no weight) — 2×10",
        "Wall squat hold — 2×15s (back against wall, gentle sit)",
        "Child's pose — 2 min",
        "Heat on glutes/hips if comfortable"],
 flareTip:"Strength week flare protocol. Wall squats activate the legs and glutes in a supported position that doesn't require balance or load. This is enough."},
{date:"Jul 12",wd:"Sun",week:3,type:"REST",workout:false,
 gym:{
   ex:["Complete rest",
       "Take progress photos today — back, front, and side view",
       "Compare to Day 1 photos — notice the difference",
       "Tart cherry juice (4 oz)",
       "Celebrate: you are more than halfway through Goddess Body",
   ],
   cardio:"None",
   tip:"Take those progress photos today. Look at what 9 sessions built. You are not the same body that started on June 24 — and you have 4 sessions left to push even further."
 },
 home:{
   ex:["Complete rest",
       "Progress photos — front, side, and back",
       "Anti-inflammatory self-care: warm bath, magnesium lotion, rest",
       "Journal your progress and how you feel physically and mentally",
   ],
   cardio:"None",
   tip:"9 sessions in. Take the photos and compare. Then rest — because Week 4 is Peak Week and it needs the best version of you showing up for it."
 }},
{date:"Jul 13",wd:"Mon",week:3,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga — recovery flow (yin style if possible, hold poses 2–3 min each)",
       "Physical therapy session",
       "Tell PT about yesterday's heavy leg session — abductor soreness is normal",
       "Deep stretching after PT: pigeon 90s ea, seated hamstring stretch, hip flexor lunge",
   ],
   cardio:"Easy walk",
   tip:"After the heaviest leg session of the plan so far, today's PT is doing real repair work. Honor the recovery. Saturday's core session needs everything you've got — arrive ready."
 },
 home:{
   ex:["🧘🏾 Morning yin yoga (20 min) — pigeon, lizard, supine twist, happy baby",
       "Physical therapy session",
       "Post-PT: deep hip release stretch sequence",
   ],
   cardio:"Easy walk",
   tip:"Two intentional days in a row — training and recovery. That's the full picture of what a Goddess Body looks like in real life. Core session tomorrow — come ready."
 }},
{date:"Jul 14",wd:"Tue",week:3,type:"Core + Upper Body",workout:true,
 gym:{
   ex:["Lat Pulldown — 4×10 · 4 sets, slightly heavier",
       "Seated Cable Row — 3×12 · more weight than Week 2",
       "Band Pull-Apart — 3×25",
       "Bicep Curl (10 lb DB) — 3×12",
       "Tricep Pushdown — 3×12",
       "Leg Raises — 3×15",
       "Bicycle Crunches — 3×30 · more reps",
       "Forearm Plank — 3×45s",
   ],
   cardio:"10 min stairmaster",
   tip:"8 sessions done. Your back is pulling heavier, your core is tightening, your arms are showing up. The work is visible now. Progress photos Sunday — rest up and see what 8 sessions built."
 },
 home:{
   ex:["Band Row (max tension) — 4×12",
       "Band Pull-Apart — 3×25",
       "Bicep Curl (max band) — 3×12",
       "Tricep Kickback (max band) — 3×12",
       "Leg Raises — 3×15",
       "Bicycle Crunches — 3×30",
       "Forearm Plank — 3×45s",
   ],
   cardio:"10 min easy walk",
   tip:"8 of 13. You are building something real. 120 controlled bicycle reps today — that's the work that creates the abs in those reference photos. Rest Sunday. Take those progress photos."
 },
 flare:["Seated spinal rotation — 10 each direction",
        "Gentle bicep curl (very light band) — 2×8",
        "Supine knee to chest — 30s each side",
        "Legs up the wall (restorative) — 5 min",
        "Belly breathing with core engagement — 3×10 breaths",
        "Rest fully between each movement"],
 flareTip:"Legs up the wall is one of the most effective fibromyalgia recovery poses available. It reduces lower body inflammation and calms the nervous system. 5 minutes here is medicine."},
{date:"Jul 15",wd:"Wed",week:3,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (15–20 min) — invigorating flow",
       "Physical therapy session",
       "Share progress photo results with PT if comfortable — celebrate with them",
       "Week 3 assessment: note which muscles feel strongest",
   ],
   cardio:"Easy walk",
   tip:"4 sessions remain. 4. Your PT knows what 3 weeks of training has built — let them see it. Tomorrow is Full Body Strength, the session that kicks off Peak Week. Come ready."
 },
 home:{
   ex:["🧘🏾 Morning yoga (15–20 min)",
       "Physical therapy session",
       "Recovery stretch — 10 min",
   ],
   cardio:"Easy walk 10 min",
   tip:"4 sessions left. Everything you have goes into these final 4. PT and yoga today set you up to finish strong. Come tomorrow with everything."
 }},
{date:"Jul 16",wd:"Thu",week:3,type:"Full Body Strength",workout:true,
 gym:{
   ex:["Leg Press — 4×10 · heaviest weight so far",
       "Hip Thrust (barbell or plate) — 4×12",
       "Lat Pulldown — 3×10",
       "Romanian Deadlift — 3×12",
       "Bicycle Crunches — 3×30",
       "Forearm Plank — 3×45s",
       "Leg Raises — 3×15",
   ],
   cardio:"20 min stairmaster moderate to slightly faster than usual",
   tip:"9 of 13. You are operating at a level that didn't exist on June 24. Stronger body, sharper mind. Peak Week starts Wednesday. Finish this week the way a Goddess finishes — completely."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 4×12",
       "Hip Thrust (couch, max resistance) — 4×12",
       "Band Row — 3×12",
       "Romanian DL (kettlebell) — 3×12",
       "Bicycle Crunches — 3×30",
       "Forearm Plank — 3×45s",
   ],
   cardio:"20 min brisk walk",
   tip:"Session 9 done. Three weeks of work behind you. One week ahead. Everything you've built comes forward into Peak Week. Rest tomorrow. Then finish what you started."
 },
 flare:["Seated sumo squat (chair assist) — 2×10",
        "Lying hip thrust (floor only, no elevation) — 2×10",
        "Band row (seated, light) — 2×10",
        "Gentle lying bicycle (slow) — 2×10",
        "Rest as needed between every movement",
        "Breathe — you showed up. That's enough."],
 flareTip:"Week 3 final session on a flare day. Showing up matters more than the weight. Your body is listening even when fibromyalgia is loud."},
{date:"Jul 17",wd:"Fri",week:4,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (20 min) — peak week energizing flow",
       "Physical therapy session",
       "Tell PT: this is peak week — 4 sessions left. Ask for full support.",
       "Focus: hip stability, shoulder mobility, spinal alignment for peak performance",
   ],
   cardio:"Easy walk",
   tip:"Peak Week. 4 sessions. This is what the last 3 weeks were for. PT today keeps you healthy enough to finish at full power. Thursday we go to peak lower body — come in ready."
 },
 home:{
   ex:["🧘🏾 Morning yoga (20 min) — warrior sequence, power poses",
       "Physical therapy session",
       "Post-PT: full body recovery stretch",
   ],
   cardio:"Easy walk",
   tip:"You made it to Peak Week. Not everyone gets here — the ones who do are built different. Rest tonight. Thursday is the heaviest lower body session of the entire plan."
 }},
{date:"Jul 18",wd:"Sat",week:4,type:"Lower Body Peak",workout:true,
 gym:{
   ex:["Leg Press — 4×10 · peak load of entire program",
       "Hip Thrust (barbell) — 4×12 · heaviest of program",
       "Romanian Deadlift — 4×10 · progressive max",
       "Inner Thigh Press / Adductor Machine — 3×20",
       "Abductor Machine — 3×20",
       "Cable Glute Kickback — 3×15 ea. · full squeeze, peak contraction",
   ],
   cardio:"20 min stairmaster · push slightly harder than usual",
   tip:"Heaviest lower body of the entire plan. You just moved weight that would have felt impossible on June 24. One rest day, then Saturday is peak core and arms. You are closing in on something real."
 },
 home:{
   ex:["Kettlebell Sumo Squat — 4×10 · maximum focus",
       "Hip Thrust (couch, maximum possible load) — 4×12",
       "Romanian DL (kettlebell) — 4×10",
       "Clamshells (heaviest band) — 3×20 ea.",
       "Lateral Band Walk — 3×25 ea.",
       "Donkey Kicks (heavy band) — 3×15 ea.",
   ],
   cardio:"20 min brisk walk · fastest pace of the program",
   tip:"Peak lower body done. Maximum resistance, maximum output — your body answered the call. Saturday is the final core and arms session. Rest tomorrow. Come Saturday ready to finish strong."
 },
 flare:["Lying glute bridge — 2×10 gentle",
        "Supine abductor stretch — 60s each side",
        "Gentle butterfly seated — 60s",
        "Chair squat hold — 2×10s",
        "Warm compress on hips and lower back",
        "Tart cherry juice before and after"],
 flareTip:"Peak week flare day. The plan accounts for this. Gentle movement and tart cherry juice today keeps inflammation low so the next session can be stronger."},
{date:"Jul 19",wd:"Sun",week:4,type:"REST",workout:false,
 gym:{
   ex:["Complete rest — 2 sessions left",
       "Take progress photos and compare to Day 1 and Day 21",
       "Tart cherry juice (4 oz)",
       "Reflect: what changed in 26 days?",
       "Prepare mentally for the final 2 sessions",
   ],
   cardio:"None",
   tip:"Two sessions left. This rest is not optional — it's strategy. Sleep, eat, hydrate, visualize your final sessions. You finish Tuesday. Come back fully charged."
 },
 home:{
   ex:["Complete rest",
       "Progress photos — all angles",
       "Anti-inflammatory self-care: warm bath + Epsom salts",
       "Plan your final 2 session nutrition (high carbs the day before each)",
   ],
   cardio:"None",
   tip:"The last rest day. Two sessions remain. Rest like a champion today so you can finish like one. You are so close, Coco."
 }},
{date:"Jul 20",wd:"Mon",week:4,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (20 min) — deep recovery flow after peak lower body",
       "Physical therapy session",
       "Priority today: hip flexor release, glute recovery, shoulder check",
       "Deep stretch: pigeon 90s ea, supine figure-4, hamstring release",
   ],
   cardio:"Easy walk",
   tip:"One leg day, one core day, one full body day left. PT today is protecting your ability to finish all three at full capacity. Show up Saturday like the Goddess you're becoming."
 },
 home:{
   ex:["🧘🏾 Morning yoga (20 min) — yin style, hold each pose 2–3 min",
       "Physical therapy session",
       "Yin poses: pigeon, lizard, saddle pose, sleeping swan",
   ],
   cardio:"Easy walk",
   tip:"Two sessions remain after Saturday. This PT and yoga session keeps those last two at full capacity. Don't skip a single stretch. Saturday needs all of you."
 }},
{date:"Jul 21",wd:"Tue",week:4,type:"Core + Arms Peak",workout:true,
 gym:{
   ex:["Lat Pulldown — 4×10 · peak weight of program",
       "Seated Cable Row — 4×10 · peak weight",
       "Bicep Curl (12 lb DB) — 3×12",
       "Tricep Pushdown — 3×12 (heaviest)",
       "Leg Raises — 4×15 · 4 sets now",
       "Bicycle Crunches — 4×30",
       "Forearm Plank — 3×1 min · personal best",
       "Dead Bug — 3×12 ea.",
   ],
   cardio:"10 min stairmaster",
   tip:"11 of 13. 120 bicycles. 4-set planks. Your core and back are at their strongest right now. Two sessions left. Rest Sunday. Come back Monday for the finale — you are almost there."
 },
 home:{
   ex:["Band Row (max band) — 4×12",
       "Bicep Curl (max band) — 3×12",
       "Tricep Kickback (max band) — 3×12",
       "Band Pull-Apart — 3×25",
       "Leg Raises — 4×15",
       "Bicycle Crunches — 4×30",
       "Forearm Plank — 3×1 min",
       "Dead Bug — 3×12 ea.",
   ],
   cardio:"10 min easy walk",
   tip:"11 sessions. 120 bicycles. Peak plank holds. You just completed the hardest core session of your life — and you did it. Two left. Rest Sunday. Make Monday count."
 },
 flare:["Seated torso rotation — 10 each direction",
        "Supine knee to chest — 30s each side",
        "Legs up the wall — 5 min",
        "Gentle bicep curl (very light) — 2×6",
        "Breathing with core bracing — 5×5 breaths",
        "Restorative savasana — 5 min"],
 flareTip:"Peak week flare day. Legs up the wall and restorative breathing is peak recovery — do not underestimate it. Your nervous system needs this as much as your muscles."},
{date:"Jul 22",wd:"Wed",week:4,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Morning yoga (20 min) — powerful closing flow",
       "Physical therapy session — second to last week",
       "Tell PT this is the final week — full assessment of what changed",
       "Focus: prepare shoulders and hips for final two sessions",
   ],
   cardio:"Easy walk",
   tip:"Last PT + yoga day of the entire plan. Tell your therapist what 4 weeks of training has built. Come tomorrow with intention — Session 12 of 13."
 },
 home:{
   ex:["🧘🏾 Morning yoga (20 min) — intention-setting flow for final sessions",
       "Physical therapy session",
       "Full body recovery stretch — 15 min",
   ],
   cardio:"Easy walk",
   tip:"Final PT and yoga session. Let this practice ground you for what's ahead. Tomorrow is Session 12. Then one more. Finish with everything you have."
 }},
{date:"Jul 23",wd:"Thu",week:4,type:"Full Body Peak",workout:true,
 gym:{
   ex:["4 Rounds — minimal rest between exercises, 90s between full rounds:",
       "Leg Press × 10 | Hip Thrust × 12 | Lat Pulldown × 10",
       "Romanian DL × 10 | Bicycle Crunches × 25 | Forearm Plank × 45s",
       "Note: Use peak loads from individual sessions — this is your strongest circuit",
   ],
   cardio:"20 min stairmaster · your best effort of the program",
   tip:"12 of 13. One session remains. Wednesday is PT and yoga. Thursday is your finale — lower body celebration, the thing this whole plan was built around. Rest tomorrow. Thursday is yours."
 },
 home:{
   ex:["4 Rounds — minimal rest between exercises:",
       "Kettlebell Sumo Squat × 12 | Hip Thrust × 15 | Band Row × 12",
       "Romanian DL × 10 | Bicycle Crunches × 25 | Forearm Plank × 45s",
       "Maximum resistance on every movement — this is the peak",
   ],
   cardio:"20 min brisk walk · best pace of the program",
   tip:"12 done. 1 remaining. The final session is Thursday and it's all lower body — the foundation of everything. Rest Wednesday. Come back Thursday to close it out."
 },
 flare:["Seated sumo squat (chair) — 2×8",
        "Lying glute bridge — 2×10",
        "Band row (light, seated) — 2×8",
        "Slow bicycle — 2×8",
        "Plank — 1×15s",
        "Rest. You showed up."],
 flareTip:"Session 12 on a flare day. 5 gentle movements and rest. This still counts. You are still in the plan."},
{date:"Jul 24",wd:"Fri",week:5,type:"PT + Yoga",workout:false,
 gym:{
   ex:["🧘🏾 Final yoga session of the 30-day plan (20–30 min) — gratitude flow",
       "Physical therapy session — final M/W/F session of the program",
       "Share your 30-day experience with your PT team",
       "Post-PT: full body closing stretch — honor every muscle you've worked",
   ],
   cardio:"Easy walk",
   tip:"Last PT and yoga session of this journey. Tomorrow is your final workout — Session 13. Lower body celebration. Everything the plan was built to achieve. Show up tomorrow and close it out, Coco."
 },
 home:{
   ex:["🧘🏾 Final yoga session of 30 days — 20–30 min, full gratitude practice",
       "Physical therapy session",
       "Post-PT: full body closing stretch — hold each pose with intention",
   ],
   cardio:"Easy walk",
   tip:"This is the last PT and yoga session of Goddess Body. Tomorrow is it — Session 13. Lower body. The finale. Rest tonight and come tomorrow ready to leave everything in the room."
 }},
{date:"Jul 25",wd:"Sat",week:5,type:"Lower Body Celebration",workout:true,
 gym:{
   ex:["🏆 Celebration Circuit — 3 rounds of your all-time best moves:",
       "Leg Press (peak load) × 10",
       "Hip Thrust (peak load) × 12",
       "Sumo Squat × 15",
       "Abductor Machine × 20",
       "Cable Glute Kickback × 15 ea.",
       "End with: Bicycle Crunches × 25 and Forearm Plank × 1 min",
   ],
   cardio:"20 min stairmaster — victory lap. You earned every single step.",
   tip:"🏆 This is it. 13 sessions. 30 days. You showed up when it was hard, when fibromyalgia pushed back, when rest was tempting over training. Take your final progress photos. Compare June 24 to today. The Goddess Body was always inside you — you just built the outside to match."
 },
 home:{
   ex:["🏆 Celebration Circuit — 3 rounds:",
       "Kettlebell Sumo Squat × 15",
       "Hip Thrust (couch, max load) × 15",
       "Romanian DL × 12",
       "Donkey Kicks × 15 ea.",
       "Bicycle Crunches × 25",
       "Forearm Plank × 1 min",
   ],
   cardio:"20 min brisk walk — victory lap. Head up, shoulders back. Goddess energy.",
   tip:"🏆 30 days. 13 sessions. Done. You finished it — at home, with a kettlebell and a couch and the kind of discipline most people only talk about. Take those final photos. Month 2 is where it becomes undeniable. Keep going, Coco."
 },
 flare:["Gentle glute squeeze — 3×15",
        "Supine figure-4 — 60s each side",
        "Supported chair squat × 8",
        "Lying hip hinge — 2×10",
        "Savasana — 10 min",
        "You completed Phase 1. That is the foundation."],
 flareTip:"Phase 1 finale flare protocol. Whether you did the full session or this gentle version — 30 days complete. The Goddess Body is built on consistency over perfection. You did it. Phase 2 begins tomorrow."},
{date:"Jul 26",wd:"Sun",week:5,type:"REST",workout:false,
 gym:{ex:["Rest completely — your glutes just got hit with supersets for the first time","Anti-inflammatory priority: turmeric, tart cherry, water","Optional: 15 min gentle walk, nothing more"],cardio:"None",tip:"Your body is processing a new training stimulus. Feed it. Rest it. Come Monday ready."},
 home:{ex:["Rest completely — your glutes just got hit with supersets for the first time","Anti-inflammatory priority: turmeric, tart cherry, water","Optional: 15 min gentle walk, nothing more"],cardio:"None",tip:"Your body is processing a new training stimulus. Feed it. Rest it. Come Monday ready."},
 note:"Rest Day. Phase 2, Week 5. Rebuild between sessions."},
{date:"Jul 27",wd:"Mon",week:5,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — hip circles, pigeon, warrior flow","PT session — update your therapist: Phase 2 starts today. Supersets incoming.","Tell your PT: glutes, hamstrings, and back are your focus zones","Focus: hip flexor release, hamstring lengthening, shoulder mobility work"],cardio:"Easy walk to/from PT",tip:"Phase 2 starts today. The foundation you built in 30 days is the floor — now we build the walls. Come Saturday locked in."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — hip circles, pigeon, warrior flow","Tell your PT: you're entering Phase 2 today — supersets begin Saturday","Focus: hip mobility, glute activation, shoulder range of motion"],cardio:"Easy walk",tip:"Phase 2 starts today. 30 days of discipline built the base. Saturday we start stacking."}},
{date:"Jul 28",wd:"Tue",week:5,type:"Lower Body Supersets",workout:true,
 gym:{yoga:"Sun salutation × 5 + pigeon pose 2 min each side — hips primed",ex:["SUPERSET A — 4 rounds · 90s rest between rounds:",
  "• Leg Press 4×15 — add 10–20 lbs from Phase 1 peak",
  "• Barbell Hip Thrust 4×15 — 1s pause + squeeze at top",
  "SUPERSET B — 3 rounds · 60s rest:",
  "• Romanian Deadlift 3×12 — 3-count eccentric · feel hamstrings load",
  "• Bulgarian Split Squat 3×10 each — back foot on bench",
  "Cable Pull-Through 3×15 — hinge · glute squeeze at lockout",
  "Seated Leg Curl 3×12 — control the negative"],
  cardio:"Stairmaster 22 min — 2 min moderate, 1 min push × 7",
  tip:"Supersets start now. You're doing twice the work in the same time. Saturday you'll feel muscles working differently — that's the signal. Tuesday we hit back and arms."},
 home:{yoga:"Sun salutation × 5 + pigeon pose 2 min each side",ex:["SUPERSET A — 4 rounds · 90s rest:",
  "• Kettlebell Sumo Squat 4×15 — heaviest bell",
  "• Couch Hip Thrust 4×15 — add backpack weight on hips",
  "SUPERSET B — 3 rounds · 60s rest:",
  "• Single-Leg RDL 3×10 each — hinge, slight bend in knee",
  "• Reverse Lunge 3×12 each — controlled descent",
  "Resistance Band Glute Bridge 3×20 — band above knees",
  "Donkey Kickback (band) 3×15 each — full extension"],
  cardio:"Jump rope or high knees — 40s on, 20s off × 15 rounds",
  tip:"Supersets start now. The kettlebell and couch become power tools. Tuesday we hit back and arms."},
 flare:["🧘🏾 Yin yoga — pigeon, butterfly, dragon pose (2 min each)","🌸 Legs up the wall 10 min — reduces inflammation","💛 Gentle hip circles lying down — 10 each direction","• Easy 15 min walk at flat pace"],
 flareTip:"Supersets can wait — your body is telling you something. Gentle movement today keeps the momentum without the cost. Saturday energy carries into next session.",
 note:"Day 32 · Phase 2 Session 1. Supersets begin. Same muscles, double the stimulus."},
{date:"Jul 29",wd:"Wed",week:5,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — emphasis on hamstring and glute recovery","PT session — your glutes are sore from Saturday. Tell your therapist.","Focus: IT band release, hip flexor stretch, lumbar decompression","Ask about glute activation techniques that complement superset training"],cardio:"Easy walk",tip:"PT today is doing active recovery work. Tuesday is back and pull — arrive with loose hips and open shoulders."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — hamstring and glute recovery flow","PT session — mention Saturday's superset training","Focus: hip flexor release, gentle spinal decompression"],cardio:"Easy walk",tip:"PT today primes Tuesday's pull session. Arrive with loose hips."}},
{date:"Jul 30",wd:"Thu",week:5,type:"Core + Pull Circuit",workout:true,
 gym:{yoga:"Flow: downward dog → upward dog × 8, cat-cow × 10, thread the needle each side",ex:["Lat Pulldown (wide grip) — 4×12 · add load from Phase 1",
  "Seated Cable Row — 4×12 · elbows back, chest proud",
  "Cable Face Pull — 3×15 · external rotation · shoulder health",
  "EZ Bar Curl — 3×15 · controlled · full range",
  "Hammer Curl — 3×12 · neutral grip targets brachialis",
  "Dead Bug — 4×10 · exhale ALL air before each rep",
  "Ab Wheel Rollout (from knees) — 3×8 · slow and deliberate",
  "Cable Crunch — 3×15 · round through the spine",
  "Plank — 3×75s"],
  cardio:"10 min incline walk pre-workout + 10 min elliptical cool-down",
  tip:"Back and biceps are getting heavier. The ab wheel starts here — it's the most honest core exercise you'll ever do. Thursday is full body. Rest your pulling muscles tonight."},
 home:{yoga:"Flow: downward dog → upward dog × 8, cat-cow × 10",ex:["Band Pull-Apart — 4×20",
  "Resistance Band Row (both arms) — 4×15",
  "Band Face Pull — 3×15",
  "Resistance Band Curl — 3×15",
  "Dead Bug — 4×10",
  "Hollow Body Hold — 3×25s · press lower back to floor",
  "Mountain Climbers — 3×20 each · controlled speed",
  "Plank with Shoulder Tap — 3×12 each side",
  "Side Plank — 3×45s each"],
  cardio:"Brisk walk 20 min OR dance cardio",
  tip:"Bands are doing serious work this phase. Thursday is full body — rest your pulling muscles tonight."},
 flare:["🧘🏾 Upper body yin — thread the needle, puppy pose, chest opener","🌸 Gentle shoulder rolls and neck release 10 min","💛 Seated band pull-aparts 2×20 if energy allows","• Rest and hydrate"],
 flareTip:"Upper body flare protocol. Joint mobility without loading. Your nervous system recovers — that counts.",
 note:"Day 35 · Phase 2 Session 2. Back, biceps, and core — heavier and harder than Phase 1."},
{date:"Jul 31",wd:"Fri",week:6,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — upper body recovery, lats and biceps","PT session — back muscles worked hard Tuesday. Let them know.","Focus: thoracic mobility, lat stretch, bicep tendon care"],cardio:"Easy walk",tip:"Thursday is Full Body Burn — your first circuit of Phase 2. PT today sets you up. Come tomorrow ready to push all 4 rounds."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — lat and bicep recovery","PT session — mention Tuesday's pulling work","Focus: thoracic mobility, lat stretch"],cardio:"Easy walk",tip:"Thursday is Full Body Burn. PT today sets you up for it."}},
{date:"Aug 1",wd:"Sat",week:6,type:"Full Body Burn",workout:true,
 gym:{yoga:"Sun salutation × 6 + hip openers — everything needs to be warm",ex:["4 Rounds — 45s work / 15s rest / no break between exercises in a round:",
  "• Leg Press",
  "• Lat Pulldown",
  "• Barbell Hip Thrust",
  "• Seated Cable Row",
  "• Bicycle Crunch × 30",
  "• Stairmaster 3 min moderate",
  "| 2 min rest between rounds"],
  cardio:"Built into circuit",
  tip:"Full Body Burn. Every major muscle group in one session. 4 rounds means 24 minutes of near-continuous work. This is what Phase 2 feels like. Week 5 done — rest Sunday, come back Monday."},
 home:{yoga:"Sun salutation × 6 + hip openers",ex:["4 Rounds — 45s work / 15s rest:",
  "• Sumo Squat (kettlebell)",
  "• Band Pull-Apart",
  "• Couch Hip Thrust",
  "• Band Row (alternating)",
  "• Bicycle Crunch × 30",
  "• High Knees 3 min",
  "| 2 min rest between rounds"],
  cardio:"Built into circuit",
  tip:"Full Body Burn. 4 rounds, everything. This is the feel of Phase 2. Week 5 complete."},
 flare:["🧘🏾 Restorative yoga — full body · child's pose, legs up wall, supine spinal twist","🌸 Gentle full-body stretch 20 min","💛 Breathing exercises: 4-7-8 breath for nervous system reset","• No strength work today"],
 flareTip:"Full body flare protocol. Today the nervous system needs restoration, not stimulus.",
 note:"Day 37 · Phase 2 Session 3. Week 5 complete. Full body circuit introduces Phase 2 intensity."},
{date:"Aug 2",wd:"Sun",week:6,type:"REST",workout:false,
 gym:{ex:["Full rest","Glutes worked harder than ever Saturday — let them rebuild","High protein today · anti-inflammatory foods","Optional: 20 min easy walk"],cardio:"None",tip:"Your body is building something. Rest today means more tomorrow. Tuesday is arms and core."},
 home:{ex:["Full rest","Anti-inflammatory reset — turmeric, tart cherry juice, water","High protein · good carbs · sleep long"],cardio:"None",tip:"Rest and rebuild. Tuesday is arms and core — come back charged."},
 note:"Rest Day. Week 6. Saturday was big — today the growth happens."},
{date:"Aug 3",wd:"Mon",week:6,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — Week 5 recovery flow","PT session — share how the superset sessions felt","Focus: hip flexor release · glute activation work · shoulder mobility","Note: Saturday is Glute + Hamstring focus — tell your PT"],cardio:"Easy walk",tip:"Week 6 starts Saturday with a glute-specific session. PT today builds your capacity for it. Come Saturday ready to go heavier on hip thrusts than ever before."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery","PT session — update on Week 5 response","Focus: hip mobility, glute activation"],cardio:"Easy walk",tip:"Saturday is Glute + Hamstring focus — heavier than Week 5. PT today prepares you."}},
{date:"Aug 4",wd:"Tue",week:6,type:"Glute + Hamstring",workout:true,
 gym:{yoga:"Deep pigeon pose 3 min each side + hip flexor lunge stretch",ex:["Hip Thrust — 5×12 · heaviest load yet · 2s pause at top · SQUEEZE",
  "Romanian Deadlift — 4×10 · 3-count eccentric · feel every millimeter",
  "Leg Press (feet high on plate) — 4×15 · high placement = more glute",
  "Lying Leg Curl — 3×12 · control the negative",
  "Cable Glute Kickback — 3×15 each · full hip extension",
  "Hip Abduction Machine — 3×20 · medial glute and outer hip"],
  cardio:"Stairmaster 25 min — every step is glute and cardio simultaneously",
  tip:"5 sets of hip thrusts at the heaviest weight you've ever moved. This is the exercise that builds the body in those reference photos. Teyana Taylor and Kehlani didn't build their glutes doing 3 light sets. Tuesday we go after arms."},
 home:{yoga:"Deep pigeon pose 3 min each side + hip flexor lunge",ex:["Couch Hip Thrust — 5×12 · max resistance · 2s pause",
  "Single-Leg RDL — 4×10 each · slow descent",
  "Sumo Squat — 4×15 · widest stance · feel inner thighs and glutes",
  "Glute Bridge Hold (band) — 3×45s · band above knees",
  "Donkey Kickback (band) — 3×15 each · full extension",
  "Side-Lying Clamshell (band) — 3×20 each · outer hip burn"],
  cardio:"Jump rope intervals 20 min OR brisk uphill walk if available",
  tip:"5 sets at maximum home resistance. This is the glute-building session of the plan. Come Tuesday ready for arms."},
 flare:["🧘🏾 Gentle lower body yin — pigeon, butterfly, supine figure-4","🌸 Legs up the wall 15 min — recovery and circulation","💛 Gentle glute squeeze lying down — 3×20 · no load · just activation","• Walk flat 10 min"],
 flareTip:"Lower body flare protocol. Your body is protecting itself — honor that. Gentle work today means you're ready sooner.",
 note:"Day 39 · Phase 2 Session 4. 5 sets of hip thrusts. This is where the Goddess Body is built."},
{date:"Aug 5",wd:"Wed",week:6,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — glute and hamstring recovery","PT session — Saturday's session was intense. Share the details.","Focus: piriformis release, IT band work, hamstring lengthening"],cardio:"Easy walk",tip:"Tuesday is Arms + Core Advanced — the most upper body volume you've done in this plan. PT today gives your lower body the release it needs before another push day."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — lower body recovery","PT session — share Saturday's hip thrust session","Focus: glute release, piriformis, hamstring"],cardio:"Easy walk",tip:"Tuesday is arms and core. PT today gives your lower body a break before Thursday's full body session."}},
{date:"Aug 6",wd:"Thu",week:6,type:"Arms + Core Advanced",workout:true,
 gym:{yoga:"Cat-cow × 12, downward dog flow, thread the needle each side",ex:["Lat Pulldown (close grip) — 4×12 · variation from Week 5",
  "One-Arm Dumbbell Row — 4×12 each · full range · elbow drives back",
  "EZ Bar Curl — 4×12 · slightly heavier than Week 5",
  "Incline Dumbbell Curl — 3×10 · long head bicep stretch at bottom",
  "Dead Bug — 4×10 · slow · intentional",
  "Hanging Knee Raise — 3×12 · or captain's chair",
  "Cable Crunch — 4×15 · round fully at bottom",
  "Plank — 2×90s"],
  cardio:"15 min incline treadmill walk (active recovery between sets is fine)",
  tip:"Arms are getting heavier and the core work is getting harder. You're building the defined arms in those reference photos with every row and every curl. Thursday is full body."},
 home:{yoga:"Cat-cow × 12, downward dog flow, thread the needle",ex:["Band Pull-Apart — 4×20",
  "Single-Arm Band Row — 4×12 each side · anchor at waist height",
  "Resistance Band Curl — 4×12",
  "Concentration Curl (weight) — 3×12 each · slow",
  "Dead Bug — 4×10",
  "Leg Raise (lying) — 3×15 · keep lower back pressed to floor",
  "Bicycle Crunch — 3×25 · controlled rotation",
  "Plank — 2×90s"],
  cardio:"Brisk walk 20 min",
  tip:"Core and arms building. Thursday is full body tabata — something completely new."},
 flare:["🧘🏾 Upper body yin — puppy pose, chest opener, shoulder stretch","🌸 Seated band pull-aparts 2×15 · very light","💛 Gentle neck and shoulder release 10 min","• Rest otherwise"],
 flareTip:"Upper body flare day — gentle shoulder mobility only. Your arms will be ready when your body is.",
 note:"Day 42 · Phase 2 Session 5. Arms + core at a new level."},
{date:"Aug 7",wd:"Fri",week:7,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — bicep and lat recovery","PT session — mention the arm volume from Tuesday","Focus: bicep tendon stretch, lat release, thoracic rotation"],cardio:"Easy walk",tip:"Thursday is Full Body Tabata — 20 seconds of work, 10 seconds of rest, repeated 8 times per station. PT today gets your body ready for this intensity spike."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — upper body recovery","PT session — arm recovery focus","Focus: lat stretch, bicep tendon stretch"],cardio:"Easy walk",tip:"Thursday is Tabata — a completely new training style. PT today prepares you."}},
{date:"Aug 8",wd:"Sat",week:7,type:"Full Body Tabata",workout:true,
 gym:{yoga:"Full body activation — 5 sun salutations + hip openers + arm circles",ex:["TABATA FORMAT — 20s max effort / 10s rest × 8 rounds per station / 1 min rest between stations:",
  "Station 1 — Leg Press (or goblet squat)",
  "Station 2 — Barbell Hip Thrust",
  "Station 3 — Lat Pulldown",
  "Station 4 — Bicycle Crunch",
  "Station 5 — Stairmaster sprint intervals",
  "| Total: ~28 min of work",
  "Note: 20 seconds full effort — you should be working hard"],
  cardio:"Built into tabata (Station 5)",
  tip:"Tabata is the most efficient training style you'll do. 20 seconds of real effort burns more than 45 minutes of casual cardio. Week 6 done. Saturday brings the heaviest lower body session yet."},
 home:{yoga:"5 sun salutations + hip openers",ex:["TABATA FORMAT — 20s / 10s × 8 rounds per station / 1 min rest:",
  "Station 1 — Sumo Squat (with kettlebell)",
  "Station 2 — Couch Hip Thrust",
  "Station 3 — Band Row",
  "Station 4 — Bicycle Crunch",
  "Station 5 — High Knees OR Jump Rope",
  "| Total: ~28 min",
  "Note: 20 seconds FULL effort — no pacing"],
  cardio:"Built into tabata (Station 5)",
  tip:"Tabata introduced. 20 seconds of everything you have. Week 6 is done — Saturday is the heaviest lower body of the plan so far."},
 flare:["🧘🏾 Restorative yoga — long holds, legs up the wall, supported bridge","🌸 Full body progressive muscle relaxation 20 min","💛 Tart cherry juice + anti-inflammatory foods all day","• Rest completely from training"],
 flareTip:"Tabata can wait — your body is doing important work managing inflammation. Rest IS the workout today.",
 note:"Day 44 · Phase 2 Session 6. Tabata protocol introduced. Highest intensity format of Phase 2."},
{date:"Aug 9",wd:"Sun",week:7,type:"REST",workout:false,
 gym:{ex:["Complete rest","After the heaviest lower body session yet, rest is non-negotiable","Anti-inflammatory protocol: turmeric, omega-3, tart cherry, water","Foam roll gently if accessible — 5 min glutes and hamstrings"],cardio:"None",tip:"The work is done. Now let your body build from it. Tuesday is back and core — come back fresh."},
 home:{ex:["Complete rest","Anti-inflammatory foods and hydration priority","Gentle foam rolling if available","Sleep 8+ hours tonight"],cardio:"None",tip:"Rest today. Tuesday is back and core — your upper body gets the attention."},
 note:"Rest Day. Week 7. Surge Week continues to build."},
{date:"Aug 10",wd:"Mon",week:7,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery from Tabata","PT session — share how Week 6 felt overall","Focus: full body recovery · particular attention to hip flexors and lats"],cardio:"Easy walk",tip:"Week 7 is Surge week. Saturday brings the heaviest lower body of Phase 2. PT today is your preparation. Let the therapist work on your glutes and hamstrings — they'll need it."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery","PT session — Week 6 debrief","Focus: hip flexors, lats, lower back"],cardio:"Easy walk",tip:"Surge Week starts Saturday. PT today prepares you for the heaviest lower body session."}},
{date:"Aug 11",wd:"Tue",week:7,type:"Heavy Lower Body",workout:true,
 gym:{yoga:"Extended pigeon pose (3 min each side) + hip flexor lunge + dynamic leg swings",ex:["Leg Press — 5×10 · heaviest load of Phase 2 · full range of motion",
  "Barbell Hip Thrust — 5×10 · focused loading · pause at top",
  "Romanian Deadlift — 4×8 · slow 3-count eccentric · feel every fiber",
  "Walking Dumbbell Lunge — 3×12 each · dumbbells add upper body demand",
  "Glute Kickback Machine — 3×15 each",
  "Hip Abduction Machine — 3×20 · outer glute"],
  cardio:"Stairmaster 25 min — surge pace: 3 min hard, 2 min moderate",
  tip:"Heaviest lower body of Phase 2. The leg press and hip thrusts should feel different today — heavier, harder, and exactly where the body change happens. Tuesday we hit back hard."},
 home:{yoga:"Extended pigeon (3 min each side) + hip flexor lunge",ex:["Sumo Squat — 5×10 · heaviest kettlebell · pause at bottom",
  "Couch Hip Thrust — 5×10 · maximum weight on hips",
  "Single-Leg RDL — 4×8 each · slow and controlled",
  "Reverse Lunge — 3×12 each · add weight if available",
  "Fire Hydrant (band) — 3×20 each · squeeze outer glute",
  "Calf Raise — 3×25 · slow eccentric"],
  cardio:"Jump rope 20 min: 1 min fast, 1 min slow intervals",
  tip:"Heaviest home lower body of Phase 2. Everything is heavier than Phase 1. Tuesday is back and core — rest your legs tonight."},
 flare:["🧘🏾 Gentle lower body yoga — supine figure-4, legs up wall, butterfly","🌸 Ice pack or heating pad on glutes if needed","💛 Tart cherry juice × 2 today — proven for fibromyalgia muscle recovery","• Flat 15 min walk — no hills"],
 flareTip:"Your lower body needs a gentle day. Flare protocol activates the muscles without stressing the joints.",
 note:"Day 46 · Phase 2 Session 7. Heaviest lower body of Phase 2 so far."},
{date:"Aug 12",wd:"Wed",week:7,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — lower body recovery emphasis","PT session — Saturday was heavy. Tell your therapist exactly which muscles worked.","Focus: glute release, piriformis, IT band, hamstring lengthening","Ask about recovery strategies between heavy superset sessions"],cardio:"Easy walk",tip:"Tuesday is Back + Core Circuit — new format, new movements. PT today recovers your lower body so your upper body can carry Thursday's full body session."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — lower body recovery","PT session — Saturday debrief","Focus: glute release, hamstring stretch"],cardio:"Easy walk",tip:"Tuesday is Back + Core Circuit. PT today sets up the rest of Surge Week."}},
{date:"Aug 13",wd:"Thu",week:7,type:"Back + Core Circuit",workout:true,
 gym:{yoga:"Downward dog flow × 8, cat-cow × 12, thread the needle",ex:["Lat Pulldown (neutral grip) — 4×10 · heavy · variety from previous weeks",
  "Cable Row (high pulley to face) — 4×12 · targets upper back and rear delts",
  "Straight Arm Pulldown — 3×15 · lat isolation · keep arms straight",
  "Dumbbell Pullover — 3×12 · stretch the lats at the bottom",
  "EZ Bar Curl — 3×12",
  "Dead Bug — 3×12 · slow · deliberate",
  "Plank to Downdog — 3×10 · flow between positions",
  "Bicycle Crunch — 3×30 · controlled rotation",
  "Side Plank — 3×60s each"],
  cardio:"10 min elliptical between strength blocks",
  tip:"Upper back and core today. The pullover is new — it stretches your lats in a way pulldowns can't. Thursday is Full Body AMRAP — a completely different challenge. Rest your back tonight."},
 home:{yoga:"Downward dog flow × 8, cat-cow × 12",ex:["Band Pull-Apart — 4×25",
  "Band Row (wide grip) — 4×15",
  "Straight Arm Band Pulldown — 3×15",
  "Band Bicep Curl — 3×15",
  "Dead Bug — 3×12",
  "Bird Dog — 3×10 each · extend opposite arm and leg",
  "Bicycle Crunch — 3×30",
  "Side Plank — 3×60s each"],
  cardio:"Walk 20 min with purpose",
  tip:"Back and core. Thursday is AMRAP — you'll find out how much endurance you've built."},
 flare:["🧘🏾 Upper body yin — thread the needle, puppy pose, supported fish","🌸 Gentle lat stretch: hang from doorframe or reach overhead","💛 Upper body self-massage with tennis ball on rhomboids","• Light activity only"],
 flareTip:"Upper body flare day — mobility and gentle stretching only. Your back will be stronger when you return.",
 note:"Day 49 · Phase 2 Session 8. Back + Core Circuit — new movements, same commitment."},
{date:"Aug 14",wd:"Fri",week:8,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — upper back and lat recovery","PT session — back and core session Tuesday · share the movements","Focus: thoracic spine mobility · lat stretching · core stability work","Ask PT about improving posture under lat pulldown load"],cardio:"Easy walk",tip:"Thursday is Full Body AMRAP — as many rounds as possible in 30 minutes. It's the biggest endurance test of Phase 2. PT today sharpens the body for it."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — upper back recovery","PT session — share Tuesday's work","Focus: thoracic mobility, lat stretch"],cardio:"Easy walk",tip:"Thursday is AMRAP — your endurance test for Phase 2. PT today prepares you."}},
{date:"Aug 15",wd:"Sat",week:8,type:"Full Body AMRAP",workout:true,
 gym:{yoga:"Full body warmup — 6 sun salutations + full joint mobility sequence",ex:["AMRAP — As Many Rounds As Possible in 30 minutes:",
  "• 10 Leg Press reps",
  "• 10 Lat Pulldown reps",
  "• 10 Hip Thrust reps",
  "• 10 Cable Row reps",
  "• 15 Bicycle Crunches",
  "• 2 min Stairmaster (moderate)",
  "| No rest except what you need. Count your rounds.",
  "Target: 4+ rounds. Elite: 5+ rounds"],
  cardio:"Built into AMRAP (Stairmaster interval each round)",
  tip:"How many rounds did you get? Write it down. This number will go up in Phase 3. AMRAP tests your true fitness level — strength, cardio, and mental toughness in one format. Week 7 done."},
 home:{yoga:"6 sun salutations + full joint mobility",ex:["AMRAP — 30 minutes:",
  "• 10 Sumo Squats (kettlebell)",
  "• 10 Band Rows each side",
  "• 10 Couch Hip Thrusts",
  "• 10 Band Pull-Aparts",
  "• 15 Bicycle Crunches",
  "• 2 min High Knees or Jump Rope",
  "| Target: 4+ rounds. Elite: 5+",
  "| Note your rounds — this number matters in Phase 3"],
  cardio:"Built into AMRAP",
  tip:"Write down your round count. Phase 3 will test this number again. Week 7 complete."},
 flare:["🧘🏾 Full body restorative yoga — child's pose, supported bridge, savasana","🌸 Guided relaxation or body scan 20 min","💛 Anti-inflammatory dinner · omega-3 priority","• Rest — AMRAP can wait for a better day"],
 flareTip:"AMRAP is maximum output — that's not where a flare day goes. Rest and reset. Your body is still building even on rest days.",
 note:"Day 51 · Phase 2 Session 9. AMRAP benchmark set. Log your rounds — Phase 3 will beat them."},
{date:"Aug 16",wd:"Sun",week:8,type:"REST",workout:false,
 gym:{ex:["Full rest — 5-round superset session needs a full recovery day","Anti-inflammatory meal priority today","Protein intake must stay high — your muscles are rebuilding","Foam roll gently if accessible"],cardio:"None",tip:"5-round supersets are done. Your body is building. Rest is the final rep. Tuesday is core and arms."},
 home:{ex:["Full rest","High protein + anti-inflammatory foods","Gentle foam roll if accessible","Sleep well tonight — growth hormone does its best work in deep sleep"],cardio:"None",tip:"Rest. Tuesday is core and arms — come back ready."},
 note:"Rest Day. Week 8. Breakthrough Week's biggest session is behind you."},
{date:"Aug 17",wd:"Mon",week:8,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery post-AMRAP","PT session — Week 7 debrief · how is the body responding?","Focus: full recovery · hip flexors, lats, glutes, core"],cardio:"Easy walk",tip:"Breakthrough Week. 4 workout days this week instead of 3. PT today is your cornerstone for getting through them all. Tell your therapist what you need."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery","PT session — Week 7 debrief","Focus: full recovery priority"],cardio:"Easy walk",tip:"Breakthrough Week has 4 workout days. PT today sets the foundation."}},
{date:"Aug 18",wd:"Tue",week:8,type:"Lower Body Supersets",workout:true,
 gym:{yoga:"Extended hip flexor and pigeon sequence — 3 min each side",ex:["SUPERSET A — 5 rounds (heaviest of Phase 2) · 90s rest:",
  "• Leg Press 5×12 — maximum loaded",
  "• Barbell Hip Thrust 5×12 — 2s pause · squeeze + hold",
  "SUPERSET B — 4 rounds · 60s rest:",
  "• Romanian Deadlift 4×10 · 3-count eccentric",
  "• Bulgarian Split Squat 4×10 each · add dumbbells",
  "Cable Pull-Through 3×15",
  "Leg Curl 3×12 · slow negative"],
  cardio:"Stairmaster 25 min — peak pace: 3 min hard / 1 min easy",
  tip:"5 rounds of supersets. Breakthrough Week means you break through what you thought was your limit. Monday is PT, Tuesday is core and arms, Thursday is full body, Saturday is Phase 2 finale."},
 home:{yoga:"Extended hip flexor and pigeon — 3 min each side",ex:["SUPERSET A — 5 rounds · 90s rest:",
  "• Sumo Squat 5×12 · heaviest bell",
  "• Couch Hip Thrust 5×12 · 2s pause",
  "SUPERSET B — 4 rounds · 60s rest:",
  "• Single-Leg RDL 4×10 each",
  "• Reverse Lunge 4×10 each · add weight if possible",
  "Glute Bridge Hold 3×45s · band above knees",
  "Donkey Kickback (band) 3×15 each"],
  cardio:"Jump rope 22 min — intervals",
  tip:"5 rounds. Breakthrough Week. 4 workout sessions this week — Saturday's Phase 2 finale is 3 days away."},
 flare:["🧘🏾 Yin lower body — pigeon, butterfly, supine twist","🌸 Legs up the wall 15 min","💛 Tart cherry × 2 servings today","• Flat gentle walk 15 min"],
 flareTip:"Breakthrough Week started — your body needs a protected day. Gentle movement keeps you in the game.",
 note:"Day 53 · Phase 2 Session 10. Breakthrough Week. 5 rounds of supersets — biggest lower body volume of Phase 2."},
{date:"Aug 19",wd:"Wed",week:8,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — glute and hamstring focus","PT session — Saturday was the heaviest superset session of Phase 2. Mention it.","Focus: active recovery · glute release · piriformis · IT band"],cardio:"Easy walk",tip:"Tuesday is Core + Arms Peak II — the strongest upper body session of Phase 2. PT today helps your lower body recover so your upper body can carry the load."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — recovery focus","PT session — Saturday debrief","Focus: glute release, piriformis"],cardio:"Easy walk",tip:"Tuesday is Core + Arms Peak II. PT today sets you up."}},
{date:"Aug 20",wd:"Thu",week:8,type:"Core + Arms Peak II",workout:true,
 gym:{yoga:"Downward dog flow × 10, cat-cow × 12, thread the needle",ex:["Lat Pulldown (close grip) — 5×10 · heaviest of Phase 2",
  "Cable Row — 5×10 · heaviest of Phase 2",
  "Straight Arm Pulldown — 3×15",
  "EZ Bar Curl — 4×10 · heavy",
  "Incline Dumbbell Curl — 3×10",
  "Dead Bug — 4×12 · slow",
  "Ab Wheel Rollout — 4×8 · controlled",
  "Cable Crunch — 4×15",
  "Plank — 3×90s"],
  cardio:"15 min incline walk",
  tip:"Peak II means this is the strongest your back and arms have been in Phase 2. Thursday is Full Body Breakthrough — one last huge session before Saturday's Phase 2 finale."},
 home:{yoga:"Downward dog flow × 10, cat-cow × 12",ex:["Band Pull-Apart — 5×20",
  "Band Row — 5×15 each",
  "Band Bicep Curl — 4×15",
  "Concentration Curl — 4×12 each",
  "Dead Bug — 4×12",
  "Ab Wheel or Sliding Plank — 4×8",
  "Bicycle Crunch — 4×30",
  "Plank — 3×90s"],
  cardio:"Walk 25 min fast pace",
  tip:"Peak arms and core at home. Thursday is breakthrough — then Saturday closes Phase 2."},
 flare:["🧘🏾 Upper body yin — thread the needle, puppy pose, supported fish","🌸 Gentle shoulder mobility: arm circles, pendulum swings","💛 Rest upper body completely if load feels wrong","• Light walk is enough today"],
 flareTip:"Flare during peak week. Rest fully — peak numbers wait. Phase 3 will be there.",
 note:"Day 56 · Phase 2 Session 11. Core + Arms Peak II. Strongest upper body session of Phase 2."},
{date:"Aug 21",wd:"Fri",week:9,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — lat, bicep, and core recovery","PT session — share Tuesday's peak session","Focus: thoracic mobility · lat stretch · core release","Two more sessions left in Phase 2"],cardio:"Easy walk",tip:"Thursday is Full Body Breakthrough. Saturday is Phase 2 finale. PT today puts the final edge on your body before these two closing sessions. Come Thursday ready."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — upper body recovery","PT session — Tuesday debrief","Focus: lat and bicep stretch"],cardio:"Easy walk",tip:"Two sessions left in Phase 2. PT today prepares you for both."}},
{date:"Aug 22",wd:"Sat",week:9,type:"Full Body Breakthrough",workout:true,
 gym:{yoga:"Full body warmup — 7 sun salutations + hip flexor and shoulder opener",ex:["5 Rounds — structured circuit:",
  "Round A: Leg Press 10 reps + Lat Pulldown 10 reps + Hip Thrust 10 reps (no rest within round)",
  "| 90s rest",
  "Round B: Cable Row 10 reps + Dead Bug 10 reps + Bicycle Crunch 20 reps (no rest within round)",
  "| 90s rest",
  "Stairmaster 5 min between each full circuit pass",
  "| Complete 3 circuit passes total",
  "Note: This session is 45-50 min total — your longest of Phase 2"],
  cardio:"Stairmaster integrated (5 min × 3 = 15 min total)",
  tip:"Full Body Breakthrough — the biggest Phase 2 session. You've trained 11 sessions across 4 weeks. One more after this: Saturday's Phase 2 finale. Finish strong."},
 home:{yoga:"7 sun salutations + hip and shoulder openers",ex:["5 Rounds — structured circuit:",
  "Round A: Sumo Squat 10 + Band Row 10 + Hip Thrust 10 (no rest within round)",
  "| 90s rest",
  "Round B: Band Pull-Apart 15 + Dead Bug 10 + Bicycle Crunch 20 (no rest within round)",
  "| 90s rest",
  "High Knees or Jump Rope 5 min between passes",
  "| 3 complete circuit passes"],
  cardio:"Integrated (5 min × 3)",
  tip:"Biggest home session of Phase 2. One more after this — Saturday's Phase 2 finale."},
 flare:["🧘🏾 Full body restorative yoga — supported poses · long holds","🌸 Legs up the wall 15 min + ice on any inflamed joints","💛 Complete nervous system reset today — breathing, meditation, rest","• No training load at all"],
 flareTip:"Full Body Breakthrough can wait. Your nervous system is the priority right now. Phase 3 will still be there.",
 note:"Day 58 · Phase 2 Session 12. Full Body Breakthrough — longest session of Phase 2."},
{date:"Aug 23",wd:"Sun",week:9,type:"REST",workout:false,
 gym:{ex:["Phase 2 is complete. Today you rest before Phase 3 begins.","This rest day is strategic — Phase 3 starts Monday with PT, then Tuesday with the heaviest lower body session of the entire 90 days","Anti-inflammatory foods: omega-3, turmeric, tart cherry, leafy greens","Take progress photos if you haven't · compare June 24, July 23, August 22"],cardio:"None",tip:"60 days complete. Take your photos. Rest today. Phase 3 begins tomorrow — Mastery, Legacy, Transformation, Ascension. You are building something that lasts."},
 home:{ex:["Phase 2 complete · rest before Phase 3","Progress photos — compare all 3 checkpoints","Anti-inflammatory foods and hydration","Rest fully today"],cardio:"None",tip:"60 days done. Rest today. Phase 3 opens tomorrow."},
 note:"Rest Day · Phase 3 begins. 60 days complete. 30 remain."},
{date:"Aug 24",wd:"Mon",week:9,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — full recovery from Thursday's breakthrough","PT session — tell your therapist tomorrow is Phase 2's final workout","Focus: hip flexors, lats, glutes, core — everything worked Thursday","Ask your PT: how has your body changed since June 24?"],cardio:"Easy walk",tip:"One session left in Phase 2. PT today sets up the finale. Come tomorrow with everything — Saturday closes out 60 days of transformation."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — full body recovery","PT session — Phase 2 finale is tomorrow","Focus: full body recovery · debrief with your therapist"],cardio:"Easy walk",tip:"Tomorrow is Phase 2 finale. PT today is the final preparation. Come Saturday with everything you have."}},
{date:"Aug 25",wd:"Tue",week:9,type:"Lower Body P2 Finale",workout:true,
 gym:{yoga:"Extended pigeon 3 min each side + standing hip circles + leg swings — everything open",ex:["Hip Thrust — 5×12 · heaviest load you've done in 60 days · 2s pause each rep",
  "Leg Press — 5×12 · maximum Phase 2 load",
  "Romanian Deadlift — 4×10 · 3-count eccentric",
  "Bulgarian Split Squat — 4×10 each · controlled",
  "Cable Glute Kickback — 3×15 each",
  "Hip Abduction — 3×20",
  "Seated Leg Curl — 3×12"],
  cardio:"Stairmaster 28 min — Phase 2 farewell. Intervals: 3 min hard / 2 min moderate",
  tip:"🏆 Phase 2 complete. 13 sessions over 30 days. You came in with a foundation — you're leaving with the structure. Progress photos today. Compare June 24, July 23, and now. Phase 3 begins Sunday: Mastery, Legacy, Transformation, Ascension. You earned it."},
 home:{yoga:"Extended pigeon 3 min each side + hip circles",ex:["Couch Hip Thrust — 5×12 · maximum resistance · 2s pause",
  "Sumo Squat — 5×12 · heaviest load",
  "Single-Leg RDL — 4×10 each · tempo",
  "Reverse Lunge — 4×10 each · with weight",
  "Donkey Kickback (band) — 3×15 each",
  "Clamshell (band) — 3×20 each",
  "Glute Bridge Hold — 3×45s"],
  cardio:"Jump rope 25 min — intervals",
  tip:"🏆 Phase 2 complete. Take progress photos today. Compare across all 3 checkpoints. Phase 3 opens Sunday — Mastery week. You've earned every bit of what comes next."},
 flare:["🧘🏾 Celebration yoga — gentle flow honoring what your body did this phase","🌸 Legs up the wall 15 min + cold compress if needed","💛 Full rest from strength work · anti-inflammatory celebration meal","• Easy walk to honor the journey"],
 flareTip:"Phase 2 finale on a flare day. Your body worked 29 of 30 days this phase regardless. Rest is honoring the work. Phase 3 awaits.",
 note:"Day 60 · Phase 2 FINALE. 60 days complete. Phase 3: Mastery begins Sunday."},
{date:"Aug 26",wd:"Wed",week:9,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — full body prep for Phase 3","PT session — share your Phase 2 progress. Let them see the change.","Focus: deep hip mobility · shoulder range of motion · core stability","Tell your PT: Phase 3 introduces paused reps and tempo training"],cardio:"Easy walk",tip:"Phase 3 opens with Mastery. Tuesday is Lower Body Mastery — paused hip thrusts and tempo squats. PT today sets the body for the most demanding lower body session you've done."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — Phase 3 preparation","PT session — Phase 2 debrief and Phase 3 introduction","Focus: hip mobility, thoracic extension, core activation"],cardio:"Easy walk",tip:"Phase 3 starts Tuesday. PT today sets you up for Lower Body Mastery."}},
{date:"Aug 27",wd:"Thu",week:9,type:"Lower Body Mastery",workout:true,
 gym:{yoga:"Extended pigeon 3 min each side + dynamic leg swings + hip circles",ex:["Hip Thrust — 5×10 · PAUSED · 3s hold at top each rep · maximum load",
  "Leg Press — 5×10 · 2-count eccentric · full control",
  "Romanian Deadlift — 4×8 · tempo: 4-count down, 1-count up",
  "Bulgarian Split Squat — 4×10 each · pause 1s at bottom",
  "Cable Pull-Through — 3×15 · feel the glute stretch at the hinge",
  "Lying Leg Curl — 3×12 · 3-count eccentric",
  "Hip Abduction — 3×25 · slow and controlled"],
  cardio:"Stairmaster 28 min — Phase 3 pace: 4 min hard / 1 min easy",
  tip:"Paused reps are the difference between going through the motion and owning the motion. 3 seconds at the top of every hip thrust. You will feel this tomorrow. Thursday is Core Mastery."},
 home:{yoga:"Extended pigeon + dynamic leg swings + hip circles",ex:["Couch Hip Thrust — 5×10 · PAUSED · 3s hold each rep · max weight",
  "Sumo Squat — 5×10 · 2-count eccentric",
  "Single-Leg RDL — 4×8 each · tempo: 4-count down",
  "Reverse Lunge — 4×10 each · pause 1s at bottom",
  "Glute Bridge (band) — 3×20 · pause 2s at top",
  "Fire Hydrant — 3×20 each · slow",
  "Calf Raise — 3×25 · eccentric focus"],
  cardio:"Jump rope 25 min — Phase 3 intervals",
  tip:"3-second paused hip thrusts. This is what Mastery Week means. Thursday is Core Mastery."},
 flare:["🧘🏾 Lower body yin — pigeon, butterfly, supine twist, legs up wall","🌸 Gentle hip circles and ankle rotations lying down","💛 Anti-inflammatory priority — turmeric ginger tea + tart cherry","• Flat 15 min walk"],
 flareTip:"Lower Body Mastery on a flare day — the mastery is knowing when to rest. Your body is smarter than any workout plan.",
 note:"Day 63 · Phase 3 Session 1. Lower Body Mastery. Paused reps introduced. The standard rises."},
{date:"Aug 28",wd:"Fri",week:10,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — glute and hamstring recovery","PT session — Tuesday's paused hip thrusts created deep glute work. Share it.","Focus: piriformis release · IT band · hamstring lengthening","Ask your PT about hip thrust depth — they can help with form cues"],cardio:"Easy walk",tip:"Thursday is Core Mastery — the deepest core work of the plan. PT today recovers your lower body so your core and upper body carry Thursday."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — lower body recovery","PT session — Tuesday debrief","Focus: glute and hamstring release"],cardio:"Easy walk",tip:"Thursday is Core Mastery. PT today recovers your lower body."}},
{date:"Aug 29",wd:"Sat",week:10,type:"Core Mastery",workout:true,
 gym:{yoga:"Full core activation flow: cat-cow, bird dog, dead bug × 5 each",ex:["Dead Bug — 5×12 · 3-count extension on each rep",
  "Ab Wheel Rollout — 4×10 · this is the Mastery version · full rollout",
  "Cable Crunch — 4×20 · controlled · round the spine fully",
  "Leg Raise (hanging or captain's chair) — 4×12 · no swing",
  "Plank — 4×90s · RKC plank: squeeze glutes + fists",
  "Bicycle Crunch — 4×30 · 2-count rotation each side",
  "Russian Twist (bodyweight) — 3×20 each"],
  cardio:"15 min incline treadmill walk between sets",
  tip:"Core Mastery means the core is working AS HARD as the legs this phase. 5 sets of dead bug. Full ab wheel rollouts. 90-second RKC planks. You're building the ab definition in those reference photos right now. Saturday is Full Body Mastery."},
 home:{yoga:"Cat-cow, bird dog, dead bug warm-up",ex:["Dead Bug — 5×12 · 3-count extension",
  "Ab Wheel or Sliding Plank — 4×10",
  "Leg Raise — 4×12",
  "Hollow Body Hold — 4×30s",
  "Plank — 4×90s · squeeze everything",
  "Bicycle Crunch — 4×30",
  "Side Plank with Hip Dip — 3×15 each"],
  cardio:"Walk 25 min focused",
  tip:"Deepest core work of the plan. Saturday is Full Body Mastery."},
 flare:["🧘🏾 Core yin — supported bridge, child's pose, lying twist","🌸 Diaphragmatic breathing 10 min — core reset from inside","💛 Gentle cat-cow 5 min · gentle dead bug 2×5 if energy allows","• Light movement only"],
 flareTip:"Core Mastery on a flare day — your core is healing and resetting. That's its own kind of mastery.",
 note:"Day 65 · Phase 3 Session 2. Core Mastery. Deepest core volume of the 90-day plan."},
{date:"Aug 30",wd:"Sun",week:10,type:"REST",workout:false,
 gym:{ex:["Week 9 is complete. Full rest before Legacy Week.","Legacy Week is about building something that outlasts the 90 days","High protein today · anti-inflammatory foods · hydration","Optional: meditation or journaling on what this journey has meant"],cardio:"None",tip:"Week 9 done. Legacy Week starts tomorrow. Rest today — Tuesday's Lower Body Legacy will be the most demanding lower body session of the entire 90 days."},
 home:{ex:["Full rest · Legacy Week begins tomorrow","Reflect on what 67 days of showing up has built","Anti-inflammatory foods and hydration","Rest completely"],cardio:"None",tip:"Rest. Legacy Week starts tomorrow."},
 note:"Rest Day. Week 10 — Legacy begins."},
{date:"Aug 31",wd:"Mon",week:10,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — core recovery emphasis","PT session — Thursday's core session was intense. Communicate.","Focus: thoracic release · psoas stretch · diaphragm opening"],cardio:"Easy walk",tip:"Saturday is Full Body Mastery — a 50-minute session combining everything Phase 3 has built. PT today prepares your full system."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — core recovery","PT session — Thursday debrief","Focus: psoas stretch, thoracic mobility"],cardio:"Easy walk",tip:"Saturday is Full Body Mastery. PT today prepares you."}},
{date:"Sep 1",wd:"Tue",week:10,type:"Full Body Mastery",workout:true,
 gym:{yoga:"7 sun salutations + full body joint mobility — nothing cold today",ex:["MASTERY CIRCUIT — 5 rounds with 2 min rest between rounds:",
  "• Leg Press 10 reps · 2-count eccentric",
  "• Barbell Hip Thrust 10 reps · PAUSED at top",
  "• Lat Pulldown 10 reps",
  "• Cable Row 10 reps",
  "• Dead Bug 10 reps",
  "• Bicycle Crunch 20 reps",
  "| After all 5 rounds:",
  "Stairmaster 25 min — Mastery pace: 4 min hard / 1 min easy"],
  cardio:"Stairmaster 25 min (post-circuit)",
  tip:"Full Body Mastery. 5 rounds of 6 exercises. Paused hip thrusts built into a circuit. Week 9 complete — Legacy Week starts Monday. You're 9 weeks in. 3 remain."},
 home:{yoga:"7 sun salutations + full body mobility",ex:["MASTERY CIRCUIT — 5 rounds · 2 min rest:",
  "• Sumo Squat 10 · 2-count eccentric",
  "• Couch Hip Thrust 10 · PAUSED",
  "• Band Row 10",
  "• Band Pull-Apart 15",
  "• Dead Bug 10",
  "• Bicycle Crunch 20",
  "| After all 5 rounds: Jump Rope 20 min"],
  cardio:"Jump rope 20 min post-circuit",
  tip:"Full Body Mastery circuit complete. Week 9 done — 3 weeks remain. Legacy Week begins Monday."},
 flare:["🧘🏾 Full body restorative yoga — long supported holds","🌸 Progressive muscle relaxation · full body scan","💛 Anti-inflammatory focus: omega-3, turmeric, leafy greens","• Light walk 15 min at most"],
 flareTip:"Mastery includes knowing when your body needs rest over stimulus. Today the mastery is rest.",
 note:"Day 67 · Phase 3 Session 3. Full Body Mastery circuit. Week 9 complete."},
{date:"Sep 2",wd:"Wed",week:10,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — full body Legacy Week prep","PT session — Mastery Week complete. Let your therapist assess your progress.","Focus: hip flexors, hamstrings, shoulder mobility, core stability","Tell your PT: Tuesday is the heaviest lower body session of the 90-day plan"],cardio:"Easy walk",tip:"Legacy Week. Tuesday is Lower Body Legacy — the heaviest, most volume-rich lower body session of all 90 days. PT today prepares you. Come Tuesday with intention."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — Legacy Week preparation","PT session — Mastery Week debrief","Focus: full body assessment and prep"],cardio:"Easy walk",tip:"Tuesday is the heaviest lower body session of the entire plan. PT today builds your capacity for it."}},
{date:"Sep 3",wd:"Thu",week:10,type:"Lower Body Legacy",workout:true,
 gym:{yoga:"Deep pigeon 4 min each side · hip flexor lunge 2 min · dynamic swings",ex:["Hip Thrust — 6×10 · PAUSED · heaviest load of the entire 90 days · 3s at top",
  "Leg Press — 5×8 · maximum loaded · 3-count eccentric · drive hard",
  "Romanian Deadlift — 4×8 · TEMPO: 5-count down · 1-count up",
  "Bulgarian Split Squat — 4×10 each · dumbbells · pause 1s at bottom",
  "Cable Pull-Through — 4×15 · maximum glute stretch and squeeze",
  "Lying Leg Curl (single leg) — 3×10 each · unilateral focus",
  "Hip Abduction — 3×25"],
  cardio:"Stairmaster 30 min — LEGACY PACE: 5 min hard / 1 min moderate",
  tip:"This is the session. 6 sets of paused hip thrusts. The heaviest lower body work of your life. 30 minutes of Stairmaster after. This is Lower Body Legacy — the workout that defines the change. Thursday is Upper Body Legacy."},
 home:{yoga:"Deep pigeon 4 min each + hip flexor lunge",ex:["Couch Hip Thrust — 6×10 · PAUSED · maximum weight · 3s hold",
  "Sumo Squat — 5×8 · deepest range · 3-count eccentric",
  "Single-Leg RDL — 4×8 each · TEMPO: 5-count down",
  "Single-Leg Glute Bridge — 4×12 each · full extension",
  "Donkey Kickback (band) — 3×20 each · full extension + hold",
  "Side-Lying Clamshell (band) — 3×25 each"],
  cardio:"Jump rope 28 min intervals",
  tip:"6 sets of paused hip thrusts. The most demanding lower body session of the plan. Thursday is Upper Body Legacy."},
 flare:["🧘🏾 Lower body yin — extended pigeon, butterfly, lying spinal twist","🌸 Legs up the wall 20 min · inflammation management","💛 Full anti-inflammatory protocol today","• Easy walk 10 min · no hills"],
 flareTip:"Lower Body Legacy can't be rushed when your body is flaring. Rest today — the legacy is built in 90 days, not one session.",
 note:"Day 70 · Phase 3 Session 4. Lower Body Legacy. Heaviest lower body session of the 90-day plan."},
{date:"Sep 4",wd:"Fri",week:11,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — deep glute and hamstring recovery","PT session — Tuesday was the heaviest lower body of the plan. Share everything.","Focus: piriformis release · glute deep tissue · IT band · lumbar decompression"],cardio:"Easy walk",tip:"Thursday is Upper Body Legacy — pulling heavier than Phase 2, with new movements. PT today helps your lower body recover while your upper body prepares."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — deep lower body recovery","PT session — Lower Body Legacy debrief","Focus: piriformis, glute, hamstring release"],cardio:"Easy walk",tip:"Thursday is Upper Body Legacy. PT today recovers your lower body."}},
{date:"Sep 5",wd:"Sat",week:11,type:"Upper Body Legacy",workout:true,
 gym:{yoga:"Downward dog flow × 10 · thread the needle · thoracic rotations",ex:["Lat Pulldown (wide grip) — 5×10 · heaviest of the plan",
  "Seated Cable Row — 5×10 · heaviest of the plan · elbows drive back",
  "One-Arm Dumbbell Row — 4×10 each · full stretch at bottom",
  "Straight Arm Pulldown — 3×15 · lat isolation",
  "Cable Face Pull — 3×20 · shoulder health + rear delt",
  "EZ Bar Curl — 4×10 · controlled",
  "Incline Dumbbell Curl — 4×8 · long head emphasis",
  "Hammer Curl — 3×12",
  "Plank — 3×90s"],
  cardio:"20 min incline treadmill walk",
  tip:"Upper Body Legacy. Your back has been pulling heavier each week since June 24 — this is where it shows. Saturday is Full Body Legacy — one of the biggest sessions of Phase 3."},
 home:{yoga:"Downward dog flow × 10, thread the needle, thoracic rotations",ex:["Band Pull-Apart — 5×25",
  "Band Row — 5×15 · anchored strong",
  "Single-Arm Row — 4×12 each",
  "Straight Arm Band Pulldown — 3×15",
  "Band Bicep Curl — 4×12",
  "Incline Curl (on floor, lying back) — 4×10",
  "Hammer Curl — 3×12",
  "Plank — 3×90s"],
  cardio:"Walk 25 min at fast pace",
  tip:"Heaviest upper body of the plan. Saturday is Full Body Legacy."},
 flare:["🧘🏾 Upper body yin — thread the needle, puppy pose, chest opener long holds","🌸 Gentle shoulder and chest stretch 15 min","💛 Bicep stretch and lat stretch gentle holds","• Rest all strength work"],
 flareTip:"Upper body rest today. The legacy is 90 days long — one flare day doesn't erase the progress.",
 note:"Day 72 · Phase 3 Session 5. Upper Body Legacy. Heaviest pulling session of the plan."},
{date:"Sep 6",wd:"Sun",week:11,type:"REST",workout:false,
 gym:{ex:["Week 10 done. Rest before Transformation Week.","Transformation Week is the week you see the change you've been building","Anti-inflammatory foods: aim for maximum omega-3 and greens today","Optional: take progress photos to compare at the end of next week"],cardio:"None",tip:"10 weeks complete. Rest today. Transformation Week starts tomorrow — your body is about to show you what 70 days of discipline built."},
 home:{ex:["Full rest · Transformation Week begins tomorrow","Anti-inflammatory priority","Optional: progress photos","Rest completely"],cardio:"None",tip:"Rest. Transformation Week starts tomorrow."},
 note:"Rest Day. Week 11 — Transformation begins."},
{date:"Sep 7",wd:"Mon",week:11,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — upper body and lat recovery","PT session — Upper Body Legacy was significant. Share the session.","Focus: lat release · bicep tendon stretch · thoracic mobility"],cardio:"Easy walk",tip:"Saturday is Full Body Legacy — the most comprehensive single session of the plan. PT today sets you up for it. Rest your pulling muscles tonight."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — lat and upper body recovery","PT session — Thursday debrief","Focus: lat stretch, thoracic mobility"],cardio:"Easy walk",tip:"Saturday is Full Body Legacy. PT today prepares you for it."}},
{date:"Sep 8",wd:"Tue",week:11,type:"Full Body Legacy",workout:true,
 gym:{yoga:"8 sun salutations + full body joint circuit — nothing tight",ex:["LEGACY CIRCUIT — 6 rounds · 90s rest between rounds:",
  "• Leg Press 10 reps · 2-count eccentric",
  "• Barbell Hip Thrust 10 reps · PAUSED",
  "• Lat Pulldown 10 reps",
  "• Cable Row 10 reps",
  "• Dead Bug 10 reps",
  "• Bicycle Crunch 25 reps",
  "| After all 6 rounds:",
  "Stairmaster 28 min · Legacy Pace: 5 min hard / 1 min easy",
  "| Note: 6 rounds. Phase 3 Mastery was 5. Legacy adds one more."],
  cardio:"Stairmaster 28 min post-circuit",
  tip:"6 rounds. One more than Mastery Week. This is Legacy — it outlasts what you thought was possible. Week 10 complete. Week 11 is Transformation — the look changes."},
 home:{yoga:"8 sun salutations + full body mobility",ex:["LEGACY CIRCUIT — 6 rounds · 90s rest:",
  "• Sumo Squat 10 · 2-count eccentric",
  "• Couch Hip Thrust 10 · PAUSED",
  "• Band Row 10",
  "• Band Pull-Apart 15",
  "• Dead Bug 10",
  "• Bicycle Crunch 25",
  "| After circuit: Jump Rope 25 min"],
  cardio:"Jump rope 25 min post-circuit",
  tip:"6 rounds. Legacy adds one more than Mastery. Week 10 done. Transformation Week starts Monday."},
 flare:["🧘🏾 Full body restorative yoga — complete restoration protocol","🌸 Cold/warm contrast on inflamed areas + legs up wall 20 min","💛 High anti-inflammatory meal plan today","• Gentle 15 min walk if energy allows"],
 flareTip:"Full Body Legacy on a flare day. Your legacy isn't one session — it's 70+ days of showing up. Rest is part of that.",
 note:"Day 74 · Phase 3 Session 6. Full Body Legacy. 6 rounds. Week 10 complete."},
{date:"Sep 9",wd:"Wed",week:11,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — Legacy Week recovery + Transformation prep","PT session — share your 10-week progress. They should see measurable change.","Focus: full body assessment · note any improvements in range of motion","Transformation Week introduces drop sets on the final set of major lifts"],cardio:"Easy walk",tip:"Tuesday is Lower Body Transformation — paused reps, tempo, and for the first time: drop sets on your final hip thrust and leg press set. PT today prepares you."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — Transformation prep","PT session — 10-week assessment","Focus: range of motion, mobility improvement"],cardio:"Easy walk",tip:"Tuesday introduces drop sets. PT today sets you up for the most technically demanding lower body session of the plan."}},
{date:"Sep 10",wd:"Thu",week:11,type:"Lower Body Transformation",workout:true,
 gym:{yoga:"Extended pigeon 3 min each + dynamic hip mobility",ex:["Hip Thrust — 5×10 · PAUSED · DROP SET on final set: reduce weight 20%, do 10 more reps",
  "Leg Press — 5×8 · DROP SET on final set: reduce weight 20%, do 12 more reps",
  "Romanian Deadlift — 4×8 · TEMPO: 4-count eccentric · feel every fiber",
  "Bulgarian Split Squat — 4×10 each · dumbbells",
  "Cable Pull-Through — 3×15 · max glute stretch",
  "Hip Abduction — 4×25 · slow and intentional"],
  cardio:"Stairmaster 30 min · Transformation pace: 5 min hard / 1 min moderate",
  tip:"Drop sets mean you do your max weight, then immediately drop 20% and keep going. You just extended a 10-rep set into 20 reps without rest. This is what Transformation Week feels like in your glutes. Thursday is Core Transformation."},
 home:{yoga:"Extended pigeon + dynamic hip mobility",ex:["Couch Hip Thrust — 5×10 · PAUSED · DROP: remove weight for 10 more reps",
  "Sumo Squat — 5×8 · final set: drop to lighter weight for 12 more reps",
  "Single-Leg RDL — 4×8 each · 4-count eccentric",
  "Reverse Lunge — 4×10 each",
  "Glute Bridge (band) — DROP: max resistance × 15, remove band × 15",
  "Fire Hydrant — 3×20 each"],
  cardio:"Jump rope 28 min intervals",
  tip:"Drop sets introduced. You do max resistance, then immediately continue with lighter load. Transformation is earned rep by rep. Thursday is Core Transformation."},
 flare:["🧘🏾 Lower body yin long holds — pigeon 3 min each, butterfly, legs up wall","🌸 Anti-inflammatory protocol: tart cherry, turmeric, magnesium","💛 Complete lower body rest from loading","• Easy flat walk 10 min"],
 flareTip:"Transformation Day flare protocol. The transformation includes how well you manage your fibromyalgia. Rest is part of the journey.",
 note:"Day 77 · Phase 3 Session 7. Lower Body Transformation. Drop sets introduced — new stimulus, new change."},
{date:"Sep 11",wd:"Fri",week:12,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (20 min) — drop set recovery emphasis","PT session — Tuesday's drop sets created new muscle damage. Communicate.","Focus: deep glute release · piriformis · hip flexor"],cardio:"Easy walk",tip:"Thursday is Core Transformation — drop sets on the final core set. PT today recovers your legs so your core carries tomorrow."},
 home:{ex:["🧘🏾 Morning yoga (20 min) — lower body recovery","PT session — drop set debrief","Focus: glute, piriformis, hip flexor release"],cardio:"Easy walk",tip:"Thursday is Core Transformation. PT today recovers your legs."}},
{date:"Sep 12",wd:"Sat",week:12,type:"Core Transformation",workout:true,
 gym:{yoga:"Core activation: cat-cow, bird dog, dead bug flow",ex:["Dead Bug — 5×12 · each rep 3-count extension",
  "Ab Wheel Rollout — 5×10 · full extension · no collapse",
  "Leg Raise — 4×12 · controlled · no momentum",
  "Cable Crunch — 4×20 · slow · full contraction",
  "Bicycle Crunch — 5×30 · slow rotation · 2-count each side",
  "Plank — 4×90s · RKC: squeeze everything",
  "DROP: Side Plank 60s each → hold 30s each after · no break"],
  cardio:"20 min incline treadmill walk",
  tip:"5 sets of dead bug. 5 sets of ab wheel. Drop set side planks. Your core is being transformed from the inside out right now. Saturday is Full Body Transformation — the biggest single session of Phase 3."},
 home:{yoga:"Cat-cow, bird dog, dead bug activation",ex:["Dead Bug — 5×12 · 3-count extensions",
  "Ab Wheel — 5×10",
  "Leg Raise — 4×12",
  "Bicycle Crunch — 5×30 · 2-count rotation",
  "Hollow Body Hold — 4×35s",
  "Plank — 4×90s",
  "DROP: Side Plank 60s each → 30s each immediately after"],
  cardio:"Walk 25 min",
  tip:"Drop set planks. Core Transformation. Saturday is the biggest full body session of Phase 3."},
 flare:["🧘🏾 Core yin — supported bridge, child's pose, lying twist, breathwork","🌸 Diaphragmatic breathing 15 min — core activation without load","💛 Gentle cat-cow only · no ab work if pain present","• Rest"],
 flareTip:"Core Transformation flare day. The deepest core work is learning to breathe through difficulty — that's what you're doing today.",
 note:"Day 79 · Phase 3 Session 8. Core Transformation. Drop sets reach the core."},
{date:"Sep 13",wd:"Sun",week:12,type:"REST",workout:false,
 gym:{ex:["Week 11 done. Full rest before Ascension Week — the final week.","3 workout sessions remain. This is the last rest day of the 90-day plan.","Reflect: who were you on June 24? Who are you today?","Anti-inflammatory foods. Protein. Water. Sleep."],cardio:"None",tip:"Last rest day of the plan. 3 sessions left. Rest like a champion today — you will finish like one."},
 home:{ex:["Full rest · final rest day of the 90-day journey","Reflect on the transformation","Anti-inflammatory foods and hydration","Sleep as long as your body needs"],cardio:"None",tip:"Last rest day. 3 sessions remain. Rest."},
 note:"Last Rest Day. Week 12 — Ascension begins. 9 sessions into Phase 3."},
{date:"Sep 14",wd:"Mon",week:12,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — core and full body recovery","PT session — Thursday's core session was the most demanding of the plan","Focus: psoas release · thoracic opening · diaphragm reset"],cardio:"Easy walk",tip:"Saturday is Full Body Transformation — 7 rounds of a circuit incorporating drop sets. The biggest single session of all 90 days. PT today is your final prep. Come Saturday with everything."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — core recovery","PT session — Thursday debrief","Focus: psoas stretch, thoracic mobility"],cardio:"Easy walk",tip:"Saturday is Full Body Transformation. PT today is your final prep."}},
{date:"Sep 15",wd:"Tue",week:12,type:"Full Body Transformation",workout:true,
 gym:{yoga:"9 sun salutations + complete joint mobility — everything must be warm",ex:["TRANSFORMATION CIRCUIT — 7 rounds · 90s rest between rounds:",
  "• Leg Press 10 reps · 2-count eccentric",
  "• Barbell Hip Thrust 10 reps · PAUSED",
  "• Lat Pulldown 10 reps",
  "• Cable Row 10 reps",
  "• Dead Bug 10 reps",
  "• Bicycle Crunch 30 reps",
  "| After all 7 rounds — DROP SET FINISHER:",
  "• Hip Thrust: max load × 8, drop 20% × 12, drop 20% more × 15",
  "| Then: Stairmaster 30 min",
  "| Total session: ~65 minutes — longest of the plan"],
  cardio:"Stairmaster 30 min post-circuit",
  tip:"7 rounds. Drop set finisher. 30 minutes of Stairmaster. This is the longest, hardest session of all 90 days. You are being transformed in real time. Week 11 complete. One week left — Ascension Week. 3 sessions remain."},
 home:{yoga:"9 sun salutations + full joint mobility",ex:["TRANSFORMATION CIRCUIT — 7 rounds · 90s rest:",
  "• Sumo Squat 10 · 2-count eccentric",
  "• Couch Hip Thrust 10 · PAUSED",
  "• Band Row 10",
  "• Band Pull-Apart 15",
  "• Dead Bug 10",
  "• Bicycle Crunch 30",
  "| DROP SET FINISHER: Hip Thrust max × 8, remove weight × 12, bodyweight × 15",
  "| Then: Jump Rope 28 min"],
  cardio:"Jump rope 28 min post-circuit",
  tip:"7 rounds plus drop set finisher. Longest session of the plan. 3 sessions remain — Ascension Week is next."},
 flare:["🧘🏾 Complete restorative yoga protocol — all supported poses, 40 min","🌸 Full anti-inflammatory day — every meal, every drink","💛 Legs up wall 20 min · ice packs where needed · rest completely","• Stay horizontal as much as possible today"],
 flareTip:"Full Body Transformation on a flare day — the transformation that matters most is how you treat your body on the hardest days. Rest fully.",
 note:"Day 81 · Phase 3 Session 9. Full Body Transformation. 7 rounds + drop set finisher. Longest session of the 90-day plan."},
{date:"Sep 16",wd:"Wed",week:12,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (30 min) — Ascension Week preparation · the fullest practice of the plan","PT session — 3 sessions left. This is the final Phase 3 PT session before the Ascension workouts.","Focus: full body preparation · hip flexors, lats, glutes, core · everything","Tell your PT: this is the final week. You want to peak."],cardio:"Easy walk",tip:"Ascension Week. 3 workout sessions remain. PT today is your final physical preparation. Tuesday is Lower Body Ascension — paused reps, tempo, drop sets, and the heaviest load you've ever moved."},
 home:{ex:["🧘🏾 Morning yoga (30 min) — fullest practice of the plan","PT session — final week preparation","Focus: full body assessment and prep for peak sessions"],cardio:"Easy walk",tip:"3 sessions left. PT today is your final preparation before Ascension workouts begin."}},
{date:"Sep 17",wd:"Thu",week:12,type:"Lower Body Ascension",workout:true,
 gym:{yoga:"Extended pigeon 4 min each + hip flexor lunge + full leg swing series",ex:["Hip Thrust — 6×10 · PAUSED 3s · DROP on final set: -20% × 10, -20% × 12",
  "Leg Press — 5×8 · maximum load · DROP on final set: -20% × 10, -20% × 15",
  "Romanian Deadlift — 5×8 · TEMPO: 5-count eccentric · the slowest reps of the plan",
  "Bulgarian Split Squat — 4×10 each · dumbbells · 2s pause at bottom",
  "Cable Pull-Through — 4×15 · maximum stretch and squeeze",
  "Single-Leg Glute Bridge — 4×12 each · paused at top",
  "Hip Abduction — 3×30"],
  cardio:"Stairmaster 30 min — ASCENSION PACE: 6 min hard / 2 min moderate",
  tip:"Paused reps + tempo + drop sets in one session. Lower Body Ascension is the most technically demanding lower body workout of the 90 days. This is where you find out how much you've built. Thursday is Core + Arms Ascension. Then Saturday — you finish."},
 home:{yoga:"Extended pigeon 4 min each + hip flexor lunge + leg swings",ex:["Couch Hip Thrust — 6×10 · PAUSED 3s · DROP: remove weight × 10, bodyweight × 12",
  "Sumo Squat — 5×8 · DROP on final set: bodyweight × 15 immediately",
  "Single-Leg RDL — 5×8 each · 5-count eccentric",
  "Reverse Lunge — 4×10 each · 2s pause at bottom",
  "Single-Leg Glute Bridge — 4×12 each · pause at top",
  "Fire Hydrant — 3×25 each",
  "Donkey Kickback (band) — 3×20 each"],
  cardio:"Jump rope 30 min — Ascension pace",
  tip:"Paused + tempo + drop sets. Thursday is Core + Arms Ascension. Then Saturday — the finale."},
 flare:["🧘🏾 Lower body yin — extended holds · pigeon 4 min each · butterfly · wall hang","🌸 Elevation + cold compress on glutes and hamstrings","💛 Maximum anti-inflammatory protocol · this is the final week","• Gentle walk 15 min only"],
 flareTip:"Ascension Week flare day. You've ascended 84 days of work. Today you protect that. The finale is still yours.",
 note:"Day 84 · Phase 3 Session 10. Lower Body Ascension. Heaviest + most technical lower body of the plan."},
{date:"Sep 18",wd:"Fri",week:13,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (25 min) — final recovery before the last two sessions","PT session — tell your therapist this is the second-to-last PT session of the plan","Focus: deep glute and hamstring release after Tuesday · hip flexor opening","Ask your PT what measurable progress they've seen since June 24"],cardio:"Easy walk",tip:"Thursday is Core + Arms Ascension. Saturday is the finale. Two more. PT today recovers you completely so you can finish with everything."},
 home:{ex:["🧘🏾 Morning yoga (25 min) — penultimate recovery session","PT session — second-to-last session of the plan","Focus: full body recovery for the final two sessions"],cardio:"Easy walk",tip:"Two sessions remain. PT today recovers your body for both of them."}},
{date:"Sep 19",wd:"Sat",week:13,type:"Core + Arms Ascension",workout:true,
 gym:{yoga:"Thoracic rotation flow + downward dog × 10 + thread the needle each side",ex:["Lat Pulldown — 5×10 · heaviest of the plan · DROP on final set: -20% × 12",
  "Cable Row — 5×10 · DROP on final: -20% × 12",
  "One-Arm Row — 4×10 each · full stretch",
  "EZ Bar Curl — 4×10 · DROP on final: -20% × 12",
  "Incline Curl — 3×10",
  "Dead Bug — 5×12 · 3-count",
  "Ab Wheel — 5×10 · this is it",
  "Cable Crunch — 4×20",
  "Bicycle Crunch — 5×30",
  "Plank — 4×90s · everything squeezed · this may be your last plank"],
  cardio:"20 min incline walk",
  tip:"Drop sets on every major lift. This is Core + Arms Ascension — the penultimate session of 90 days. One remains: Saturday's Full Body Goddess. Rest your body tonight. Tomorrow is your final PT session."},
 home:{yoga:"Thoracic rotation + downward dog × 10 + thread the needle",ex:["Band Pull-Apart — 5×25",
  "Band Row — 5×15 · DROP: lighter band × 10 immediately after last set",
  "Band Curl — 4×12 · DROP: final set lighter × 12",
  "Incline Curl — 3×10",
  "Dead Bug — 5×12 · 3-count",
  "Ab Wheel — 5×10",
  "Bicycle Crunch — 5×30",
  "Plank — 4×90s"],
  cardio:"Walk 25 min fast",
  tip:"Second to last session. One remains: Full Body Goddess. Saturday closes 90 days."},
 flare:["🧘🏾 Upper body yin — thread the needle, puppy pose, chest opener full practice","🌸 Gentle lat and bicep stretch 15 min","💛 Complete upper body rest","• Walk gently"],
 flareTip:"Core + Arms Ascension flare day. Your arms and core have been ascending for 86 days — rest is the final ascension technique.",
 note:"Day 86 · Phase 3 Session 11. Core + Arms Ascension. Second-to-last session. Drop sets on everything."},
{date:"Sep 20",wd:"Sun",week:13,type:"REST",workout:false,
 gym:{ex:["You finished the final workout yesterday","Final rest day of the 90-day Goddess Body journey","Take your final progress photos if you haven't","Anti-inflammatory celebration meal tonight — honor what you built"],cardio:"None",tip:"The last workout is done. Tomorrow is your final PT + yoga session — a celebration of what 90 days built. Rest today and feel what you've created."},
 home:{ex:["Final workout complete","Last rest day — tomorrow closes the 90-day journey with PT and yoga","Take final photos · compare all 4 checkpoints","Rest · celebrate · reflect"],cardio:"None",tip:"The work is done. Tomorrow closes the journey. Rest."},
 note:"Final Rest Day. 89 days complete. Tomorrow closes 90 days."},
{date:"Sep 21",wd:"Mon",week:13,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Morning yoga (30 min) — the final yoga + PT session of Goddess Body","PT session — this is it. The last PT session of the 90-day plan.","Tell your therapist: you're finishing tomorrow. Let them prepare you.","Focus: full body preparation · everything open and ready for the finale","Take a moment with your PT to acknowledge what these 12 weeks have built"],cardio:"Easy walk",tip:"Tomorrow is the finale. Full Body Goddess — the last session of 90 days. PT today is the final physical preparation. Come tomorrow with intention, gratitude, and everything you have left."},
 home:{ex:["🧘🏾 Morning yoga (30 min) — final PT + yoga session of the plan","PT session — final session of the 90-day journey","Focus: full body preparation for tomorrow's finale","Take a moment to honor what this combination of PT + yoga + training has done"],cardio:"Easy walk",tip:"Tomorrow is Day 90. Full Body Goddess. Tonight: rest, eat well, reflect on 89 days of showing up."}},
{date:"Sep 22",wd:"Tue",week:13,type:"Full Body Goddess",workout:true,
 gym:{yoga:"10 sun salutations — one for each month of the year you spent on this. Full body. Full breath. Full presence.",ex:["FULL BODY GODDESS — The Finale:",
  "AMRAP 30 minutes — Log your rounds (compare to Aug 13 AMRAP):",
  "• Leg Press 10 reps",
  "• Barbell Hip Thrust 10 reps · PAUSED",
  "• Lat Pulldown 10 reps",
  "• Cable Row 10 reps",
  "• Dead Bug 10 reps",
  "• Bicycle Crunch 30 reps",
  "| Then — GODDESS FINISHER:",
  "• Hip Thrust drop set: max × 10, -20% × 10, -20% × 10 (30 total reps no rest)",
  "• Plank 2 min — hold it all the way",
  "| Then:",
  "Stairmaster 30 min — Goddess pace · whatever you have left"],
  cardio:"Stairmaster 30 min (finale)",
  tip:"🏆 90 days. 26 sessions. You started June 24 with a foundation. You are finishing September 19 with a Goddess Body. Take your final progress photos — compare June 24, July 23, August 22, and today. The Teyana Taylor and Kehlani physique you came in with as a reference isn't just a reference anymore. It's a direction. And you are ON THE PATH. Monday is your final PT + yoga day. Come back and honor the work."},
 home:{yoga:"10 sun salutations — one for each decade of your strength",ex:["FULL BODY GODDESS — Finale:",
  "AMRAP 30 minutes:",
  "• Sumo Squat 10",
  "• Couch Hip Thrust 10 · PAUSED",
  "• Band Row 10",
  "• Band Pull-Apart 15",
  "• Dead Bug 10",
  "• Bicycle Crunch 30",
  "| GODDESS FINISHER:",
  "• Hip Thrust drop: max weight × 10, lighter × 10, bodyweight × 10 (no rest)",
  "• Plank 2 min",
  "| Jump Rope 28 min — final Stairmaster equivalent"],
  cardio:"Jump rope 28 min finale",
  tip:"🏆 90 days. 26 sessions. The kettlebell and the couch built a Goddess Body. Take your final photos. Compare June 24 to September 19. You showed up every time it mattered — and on flare days, you showed up differently but you still showed up. Monday is your final PT + yoga day."},
 flare:["🧘🏾 Finale yoga — full practice honoring the journey · 40 min minimum","🌸 Everything you need to feel taken care of today","💛 Celebration meal — anti-inflammatory AND delicious","• A gentle walk to honor 90 days of showing up"],
 flareTip:"🏆 Day 88 on a flare day. The Goddess Body wasn't built despite your fibromyalgia — it was built AROUND it. The finale yoga today is your session. You finished.",
 note:"Day 88 · Phase 3 Session 12. FULL BODY GODDESS. The finale. 90 days complete at the end of Monday."},
{date:"Sep 23",wd:"Wed",week:13,type:"PT + Yoga",workout:false,
 gym:{ex:["🧘🏾 Final morning yoga of the Goddess Body journey — 30 min minimum","PT session — the final session of the plan","Tell your therapist: you just completed 90 days. Show them your progress photos.","Focus: celebration movement · full body appreciation · breathing and gratitude","Note what your PT observes has changed in your body since June 24"],cardio:"Easy walk to mark the final day",tip:"🏆 90 days. Goddess Body complete. The plan was built for your body, your condition, your life, your goals. You built a Teyana Taylor + Kehlani physique — not as a destination, but as a direction you are actively moving toward. Month 4 starts when you're ready. The Goddess keeps going."},
 home:{ex:["🧘🏾 Final morning yoga — 30 minutes of gratitude and movement","PT session — final celebration session","Tell your therapist what this journey built in you · not just physically","Focus: honoring every part of the body that showed up for 90 days"],cardio:"A walk that means something",tip:"🏆 Day 90 complete. Goddess Body is done. The kettlebell, the couch, the bands, the yoga mat, the PT table — they built something real in 90 days. Now you carry it forward."},
 note:"Day 90 · FINAL DAY · Goddess Body 90-Day Plan Complete. The Goddess built herself."}
];

/* ════════ MODULE-LEVEL CONSTANTS ════════ */
const _DATE_INDEX = {};
allDays.forEach((d,i) => { _DATE_INDEX[d.date] = i; });
const _ALL_DATES = allDays.map(d => d.date);

/* ════════ NUTRITION — 30 DAYS ════════ */
/* Muscle-building · Anti-inflammatory · High carb · Low dairy
   No: pork · tilapia · raw fish · pineapple · eggs · bananas · peanut butter
   Yes: rice · chicken · cooked seafood · fruits · veggies · carbs         */
const DN = {
"Jun 26":{cal:"2,150",p:"120g",c:"250g",f:"60g",
 note:"Day 1 — PT + Yoga day. Moderate caloric surplus to begin building. Anti-inflammatory priority to protect against fibromyalgia triggers.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["1 cup oatmeal with mixed berries and honey","½ cup almond milk poured over","Green tea with lemon"]},
  {name:"Morning Snack",time:"10 AM",items:["Apple slices","1 tbsp almond butter","Small handful walnuts"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken breast (5 oz) over jasmine rice (1 cup)","Stir-fry vegetables (bell peppers, zucchini, snap peas) in olive oil","Turmeric + garlic seasoning — anti-inflammatory"]},
  {name:"Afternoon Snack",time:"3 PM",items:["Mango smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked salmon (5 oz) with lemon + dill","Roasted sweet potato","Steamed broccoli with olive oil"]},
 ],smoothie:{name:"Day 1 Mango Glow",i:["1 cup frozen mango","1 cup spinach","1 cup almond milk","1 tsp turmeric","½ tsp ginger","1 tsp honey"]},
 tea:"🍵 AM: Green tea (antioxidant, gentle energy)  ·  PM: Turmeric ginger tea (fibromyalgia anti-inflammatory)",
 soup:null},
"Jun 27":{cal:"2,350",p:"125g",c:"270g",f:"65g",
 note:"Workout 1 — Lower body session. High carbs for fuel and muscle building. Extra protein post-workout for glute development.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal (½ cup dry) with berries, honey, 1 tbsp almond butter","1 cup almond milk","Pre-yoga fuel — eat 30 min before yoga"]},
  {name:"Post-Yoga/Pre-Workout",time:"Workout start",items:["Rice cake (1) with almond butter","Small mango or ½ cup grapes"]},
  {name:"Lunch",time:"12–1 PM",items:["Brown rice (1 cup) with grilled chicken (5 oz)","Roasted bell peppers and zucchini","Olive oil + lemon dressing"]},
  {name:"Post-Workout",time:"Within 30 min after",items:["Protein shake in almond milk (1 scoop)","4 oz tart cherry juice — reduces muscle soreness (fibromyalgia + workout recovery)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked cod (5 oz) with lemon, dill, and garlic","Jasmine rice (¾ cup)","Sautéed spinach with garlic and olive oil"]},
 ],smoothie:{name:"Berry Muscle Builder",i:["1 cup frozen mixed berries","1 cup spinach","1 cup almond milk","1 scoop vanilla protein","1 tsp honey","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (clean energy for workout day)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — muscle recovery)",
 soup:null},
"Jun 28":{cal:"2,050",p:"115g",c:"238g",f:"58g",
 note:"Sunday REST. Lower calories — no training stimulus. Focus on anti-inflammatory foods and deep nourishment.",
 meals:[
  {name:"Breakfast",time:"8–9 AM",items:["Smoothie below OR whole grain French toast (no eggs — use flaxseed egg: 1 tbsp flax + 3 tbsp water, rest 5 min)","Top with berries and maple syrup","Green tea"]},
  {name:"Morning Snack",time:"10:30 AM",items:["Fresh fruit bowl: berries, mango, grapes, melon","Handful almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken noodle soup (whole grain pasta, chicken broth, chicken, carrots, celery, herbs)","1 slice whole grain bread"]},
  {name:"Afternoon",time:"3–4 PM",items:["4 oz tart cherry juice","Rice cake + almond butter"]},
  {name:"Dinner",time:"6–7 PM",items:["Turkey meatballs (ground turkey, herbs, garlic) over whole grain pasta","Marinara sauce (low sodium)","Side salad with olive oil dressing"]},
 ],smoothie:{name:"Sunday Reset Smoothie",i:["1 cup frozen mango","½ cup frozen berries","1 cup almond milk","1 tbsp chia seeds","½ tsp turmeric","1 tsp honey"]},
 tea:"🍵 AM: Green tea  ·  PM: Chamomile lavender (Sunday deep rest support)",
 soup:"Chicken noodle soup: chicken breast, whole grain pasta, carrots, celery, onion, garlic, chicken broth, thyme — simmer 25 min"},
"Jun 29":{cal:"2,150",p:"120g",c:"252g",f:"60g",
 note:"PT + Yoga recovery day. Anti-inflammatory focus. Replenish glycogen from yesterday's leg session.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) with avocado and sea salt","Sliced strawberries on side","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["½ cup grapes","1 oz almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken and rice bowl: 5 oz grilled chicken, 1 cup jasmine rice, cucumber, tomato","Drizzle of olive oil + lemon + fresh herbs"]},
  {name:"Afternoon",time:"3 PM",items:["4 oz tart cherry juice (soreness from Thursday's leg session)","Rice cake + almond butter"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp stir-fry (5 oz cooked shrimp) with bok choy, bell peppers, ginger","Over brown rice (¾ cup)","Tamari sauce (low sodium)"]},
 ],smoothie:{name:"Recovery Mango Spinach",i:["1 cup frozen mango","1 cup spinach","1 cup coconut water","½ tsp ginger","Pinch turmeric"]},
 tea:"🍵 AM: Ginger lemon tea (digestion + anti-inflammatory)  ·  PM: Chamomile (sleep + fibromyalgia nervous system support)",
 soup:null},
"Jun 30":{cal:"2,350",p:"125g",c:"268g",f:"65g",
 note:"Workout 2 — Core + Upper Body. Maintain high carbs for energy. Omega-3 rich protein (salmon) for shoulder joint support.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal with mixed berries and walnuts","Almond milk + honey","Matcha tea or green tea"]},
  {name:"Pre-Workout Snack",time:"45 min before",items:["1 rice cake","½ cup mango chunks","Small glass coconut water"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon rice bowl: 5 oz grilled salmon, 1 cup brown rice, cucumber, avocado","Tamari + sesame seeds + lime juice"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Protein shake in almond milk","4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Grilled chicken thighs (no skin, 5 oz) with herbs","Sweet potato (medium) roasted","Steamed green beans + olive oil"]},
 ],smoothie:{name:"Core Day Berry Blast",i:["1 cup frozen berries","1 cup spinach","1 cup almond milk","1 scoop protein","1 tbsp almond butter","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus for workout)  ·  PM: Turmeric golden milk (shoulder joint support — anti-inflammatory)",
 soup:null},
"Jul 1":{cal:"2,150",p:"120g",c:"250g",f:"60g",
 note:"PT + Yoga. Active recovery with anti-inflammatory nutrition. Prepare the body for Tuesday's full body session.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal + berries + honey + chia seeds","Almond milk","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Orange or clementine (2)","1 oz walnuts (highest plant omega-3 source — anti-inflammatory)"]},
  {name:"Lunch",time:"12–1 PM",items:["Brown rice (1 cup) + baked salmon (5 oz)","Roasted asparagus + olive oil + lemon","Side of sliced cucumber"]},
  {name:"Afternoon",time:"3 PM",items:["Mango smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey stir-fry with bok choy, snap peas, bell peppers","Over jasmine rice (¾ cup)","Ginger-tamari sauce"]},
 ],smoothie:{name:"Mango Ginger Anti-Inflammatory",i:["1 cup frozen mango","1 cup spinach","1 cup almond milk","½ tsp fresh ginger","½ tsp turmeric","Pinch black pepper","1 tsp honey"]},
 tea:"🍵 AM: Ginger lemon tea  ·  PM: Tart cherry tea (prepare body for Tuesday's workout)",
 soup:null},
"Jul 2":{cal:"2,350",p:"125g",c:"270g",f:"65g",
 note:"Workout 3 — Full Body Circuit. Maximum fuel day. High carbs before the session, protein after.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal with berries, almond butter, honey, chia","Cup of almond milk","Matcha or green tea"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake + small cup mango chunks","Coconut water for electrolytes"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken rice bowl: 5 oz chicken, 1 cup jasmine rice, avocado, cherry tomatoes","Lime juice + olive oil dressing"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Protein shake + 4 oz tart cherry juice","This combo is Coco's recovery signature"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked salmon (5 oz) with herb crust","Roasted sweet potato","Steamed broccoli + garlic + olive oil"]},
 ],smoothie:{name:"Full Body Fuel",i:["1 cup frozen mango","½ cup frozen berries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds"]},
 tea:"🍵 AM: Matcha (energy for full body day)  ·  PM: Turmeric golden milk (reduce inflammation from first week of training)",
 soup:null},
"Jul 3":{cal:"2,150",p:"120g",c:"250g",f:"60g",
 note:"Week 2 starts. PT + Yoga. Recovery and rebuild. Anti-inflammatory nutrition continues.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) with avocado, sea salt, everything bagel seasoning","Sliced strawberries","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Mixed berries (1 cup)","Small handful almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp (5 oz cooked) over brown rice (1 cup)","Cucumber, tomato, red onion salad","Lemon-olive oil dressing"]},
  {name:"Afternoon",time:"3 PM",items:["Recovery smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken thighs (5 oz, no skin) with turmeric-cumin spice blend","Jasmine rice (¾ cup)","Roasted zucchini and bell peppers"]},
 ],smoothie:{name:"Week 2 Recovery Berry",i:["1 cup frozen tart cherries or mixed berries","1 cup almond milk","½ cup spinach","1 scoop protein","½ tsp turmeric"]},
 tea:"🍵 AM: Green tea  ·  PM: Chamomile + tart cherry (Week 2 recovery protocol)",
 soup:null},
"Jul 4":{cal:"2,350",p:"126g",c:"272g",f:"65g",
 note:"Workout 4 — Lower Body Build. Hip thrusts introduced. More carbs = more energy = more muscle.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Overnight oats: ½ cup oats, almond milk, chia seeds, mixed berries, honey","Prep the night before — ready for morning","Matcha or green tea"]},
  {name:"Pre-Workout Snack",time:"45 min before",items:["Rice cake + almond butter","Coconut water or water with electrolytes"]},
  {name:"Lunch",time:"12–1 PM",items:["Brown rice bowl (1 cup) + grilled salmon (5 oz)","Edamame (¼ cup) for extra protein","Avocado slices + tamari dressing"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey lettuce wraps: ground turkey, black beans, salsa, avocado","Romaine lettuce cups","Side of jasmine rice (½ cup)"]},
 ],smoothie:{name:"Hip Thrust Day Mango Power",i:["1 cup frozen mango","1 cup spinach","1 cup coconut water","1 scoop vanilla protein","1 tsp honey","½ tsp ginger"]},
 tea:"🍵 AM: Matcha  ·  PM: Tart cherry (hip thrust recovery — reduces DOMS)",
 soup:null},
"Jul 5":{cal:"2,050",p:"115g",c:"238g",f:"58g",
 note:"Sunday REST. Reset nutrition, anti-inflammatory focus, hydration.",
 meals:[
  {name:"Breakfast",time:"8–9 AM",items:["Smoothie below or","Whole grain waffles (no egg needed with store flax option) + berries + maple syrup","Green tea"]},
  {name:"Morning Snack",time:"10:30 AM",items:["Mango chunks (½ cup)","Small handful mixed nuts"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey and vegetable soup (see soup)","Whole grain crackers","Side salad"]},
  {name:"Afternoon",time:"3–4 PM",items:["4 oz tart cherry juice","Apple slices + almond butter"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked salmon (5 oz) with miso-tamari glaze","Brown rice (¾ cup)","Steamed bok choy"]},
 ],smoothie:{name:"Sunday Glow Reset",i:["½ cup frozen mango","½ cup frozen berries","1 cup spinach","1 cup almond milk","1 tbsp chia seeds","1 tsp honey"]},
 tea:"🍵 AM: Moringa tea (most nutrient-dense tea — great for fibromyalgia)  ·  PM: Chamomile lavender",
 soup:"Turkey vegetable soup: ground turkey, carrots, celery, kale, garlic, chicken broth, turmeric — simmer 25 min"},
"Jul 6":{cal:"2,150",p:"120g",c:"252g",f:"60g",
 note:"PT + Yoga recovery. Replenish from hip thrust day. Anti-inflammatory focus.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with fresh mixed berries, walnuts, cinnamon","Almond milk + honey","Ginger lemon tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Watermelon slices (2 cups) — hydrating, anti-inflammatory","1 oz pumpkin seeds"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken (5 oz) over brown rice (1 cup)","Steamed asparagus + olive oil","Side salad: spinach, cucumber, olive oil + lemon"]},
  {name:"Afternoon",time:"3 PM",items:["Smoothie below"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked cod (5 oz) with lemon-herb crust","Sweet potato mash with olive oil (no butter)","Sautéed kale with garlic"]},
 ],smoothie:{name:"Watermelon Mint Recovery",i:["1.5 cups frozen watermelon chunks","Few fresh mint leaves","1 cup coconut water","½ tsp ginger","Squeeze of lime"]},
 tea:"🍵 AM: Ginger turmeric tea (fibromyalgia + hip recovery)  ·  PM: Chamomile (deep recovery sleep)",
 soup:null},
"Jul 7":{cal:"2,350",p:"125g",c:"268g",f:"65g",
 note:"Workout 5 — Core + Arms. Independence Day — energy is high. Feed the workout with quality carbs.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal with berries, almond butter, honey","Matcha latte with almond milk"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake + small cup berries","Coconut water"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon (5 oz) + jasmine rice (1 cup) + cucumber salad","Tamari + sesame oil dressing","Cherry tomatoes on side"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Grilled chicken kebabs (5 oz) with bell peppers, red onion, zucchini","Over quinoa (¾ cup)","Fresh herb yogurt sauce (low dairy — 2 tbsp Greek yogurt)"]},
 ],smoothie:{name:"Core Day Berry Protein",i:["1 cup frozen mixed berries","1 cup almond milk","1 scoop protein","1 tbsp almond butter","½ tsp cinnamon","1 tbsp flaxseed"]},
 tea:"🍵 AM: Green tea  ·  PM: Peppermint tea (digestion + bloat relief after holiday eating)",
 soup:null},
"Jul 8":{cal:"2,200",p:"120g",c:"255g",f:"62g",
 note:"PT + Yoga Week 2. Midpoint nutrition — maintain surplus and anti-inflammatory protocol.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal + berries + honey + chia + cinnamon","Almond milk","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Orange (1) + small handful walnuts"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled shrimp (5 oz) rice bowl over jasmine rice (1 cup)","Avocado, cucumber, cherry tomatoes","Lime-olive oil dressing"]},
  {name:"Afternoon",time:"3 PM",items:["Berry smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken breast (5 oz) with Italian herbs","Whole grain pasta (¾ cup) with marinara (low sodium)","Steamed green beans"]},
 ],smoothie:{name:"Midpoint Berry Power",i:["1 cup frozen mixed berries","½ cup spinach","1 cup almond milk","1 scoop vanilla protein","1 tsp honey"]},
 tea:"🍵 AM: Hibiscus tea (antioxidant powerhouse)  ·  PM: Turmeric golden milk",
 soup:null},
"Jul 9":{cal:"2,400",p:"128g",c:"275g",f:"66g",
 note:"Workout 6 — Full Body + Stairmaster. Most demanding session yet. Highest carbs of Week 2.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Overnight oats (½ cup oats, almond milk, berries, almond butter, honey)","Matcha for energy — biggest workout day of the week"]},
  {name:"Pre-Workout",time:"45 min before",items:["1 rice cake + almond butter","4 oz coconut water","This is your most important pre-workout fuel of the week"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken and rice (5 oz chicken, 1.25 cups jasmine rice)","Stir-fry vegetables with ginger and garlic","Tamari sauce"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice","Have this IMMEDIATELY — 30 min window for maximum muscle protein synthesis"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked salmon (5 oz) with lemon dill","Roasted sweet potato (large)","Sautéed spinach with garlic and olive oil"]},
 ],smoothie:{name:"Full Body Peak Fuel",i:["1 cup frozen mango","1 cup spinach","1 cup almond milk","1 scoop chocolate protein","1 tbsp almond butter","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha latte (biggest workout day of Week 2 — needs sustained energy)  ·  PM: Tart cherry tea",
 soup:null},
"Jul 10":{cal:"2,150",p:"120g",c:"250g",f:"60g",
 note:"Week 3 PT + Yoga. Strength week begins. Prepare the body for heavier loads.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast + avocado + sea salt","Mixed fruit bowl: berries, mango, grapes","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Apple + 1 tbsp almond butter","Small handful pumpkin seeds"]},
  {name:"Lunch",time:"12–1 PM",items:["Tuna (canned albacore, cooked/no raw) + brown rice bowl (1 cup)","Cucumber, avocado, cherry tomatoes","Tamari + sesame seeds"]},
  {name:"Afternoon",time:"3 PM",items:["Smoothie below"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken (5 oz) with rosemary and garlic","Roasted sweet potato wedges","Steamed asparagus"]},
 ],smoothie:{name:"Strength Week Prep",i:["1 cup frozen mango","½ cup frozen tart cherries","1 cup almond milk","1 scoop vanilla protein","½ tsp turmeric","½ tsp ginger"]},
 tea:"🍵 AM: Green tea  ·  PM: Turmeric golden milk (prepare joints for strength week loads)",
 soup:null},
"Jul 11":{cal:"2,400",p:"128g",c:"276g",f:"66g",
 note:"Workout 7 — Lower Body Power. 4 sets of hip thrusts. Heaviest session so far. Maximum carb fuel.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal (½ cup dry) + almond butter + berries + honey","Almond milk + matcha — Strength Week needs power fuel"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake (1) + almond butter","4 oz coconut water","This is your most important workout of Week 3"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken (5 oz) + jasmine rice (1.25 cups) + stir-fry veggies","Ginger-tamari sauce — anti-inflammatory AND delicious"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice (MANDATORY after 4-set hip thrust day)"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon (5 oz) baked with herbs","Brown rice (¾ cup)","Roasted broccoli with garlic — NOT at dinner if she experiences bloating"]},
 ],smoothie:{name:"Power Lower Body",i:["1 cup frozen mango","1 cup spinach","1 cup coconut water","1 scoop protein","1 tsp honey","Pinch sea salt (electrolytes)"]},
 tea:"🍵 AM: Matcha (heaviest training day of the plan so far)  ·  PM: Tart cherry tea (4 sets of hip thrusts = maximum recovery need)",
 soup:null},
"Jul 12":{cal:"2,050",p:"115g",c:"238g",f:"58g",
 note:"Sunday REST. Progress photo day. Anti-inflammatory reset. Celebrate the halfway mark.",
 meals:[
  {name:"Breakfast",time:"8–9 AM",items:["Smoothie below — celebration day fuel","Or: whole grain toast + almond butter + berries"]},
  {name:"Morning Snack",time:"10:30 AM",items:["Fresh fruit platter: mango, berries, grapes, melon","Small handful mixed nuts"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon wrap (whole grain tortilla, 4 oz salmon, spinach, avocado, cucumber)","Side salad"]},
  {name:"Afternoon",time:"3–4 PM",items:["4 oz tart cherry juice","Handful almonds or walnuts"]},
  {name:"Dinner",time:"6–7 PM",items:["Celebration dinner: grilled shrimp (5 oz) over jasmine rice (1 cup)","Mango salsa (mango, red onion, cilantro, lime — NO pineapple)","Sautéed spinach"]},
 ],smoothie:{name:"Halfway Celebration Smoothie",i:["1 cup frozen mango","½ cup frozen berries","1 cup almond milk","1 scoop protein","1 tsp honey","Few mint leaves"]},
 tea:"🍵 AM: Hibiscus tea (bright, celebratory, antioxidant-rich)  ·  PM: Chamomile lavender",
 soup:null},
"Jul 13":{cal:"2,150",p:"120g",c:"250g",f:"60g",
 note:"PT + Yoga recovery. Hip flexors and glutes need maximum recovery support today.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: oats, almond milk, berries, chia, honey","Ginger lemon tea — recovery starts with breakfast"]},
  {name:"Morning Snack",time:"10 AM",items:["Watermelon (2 cups) — anti-inflammatory + hydrating","1 oz almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp (5 oz cooked) over brown rice (1 cup)","Avocado, cucumber, tomato","Lime dressing"]},
  {name:"Afternoon",time:"3 PM",items:["4 oz tart cherry juice (MANDATORY — hip thrust recovery)","Berry smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey tacos in lettuce wraps (turkey, black beans, salsa, avocado)","Side: jasmine rice (½ cup)"]},
 ],smoothie:{name:"Tart Cherry Recovery",i:["½ cup tart cherry juice or frozen tart cherries","½ cup frozen berries","1 cup almond milk","1 scoop protein","½ tsp ginger"]},
 tea:"🍵 AM: Ginger turmeric tea  ·  PM: Chamomile (maximum recovery sleep — hip thrusts from yesterday need deep rest)",
 soup:null},
"Jul 14":{cal:"2,350",p:"125g",c:"268g",f:"65g",
 note:"Workout 8 — Core + Upper Body. 4 sets pulling. More bicycles. 45s plank. High carbs.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal + berries + walnuts + honey","Matcha or green tea"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake + mango chunks","Coconut water"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon (5 oz) rice bowl (1 cup brown rice)","Edamame, cucumber, avocado","Tamari + lime"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken (5 oz) with Italian seasoning","Whole grain pasta (¾ cup) + olive oil + garlic","Steamed zucchini"]},
 ],smoothie:{name:"Core Day Spinach Mango",i:["1 cup spinach","1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","½ tsp cinnamon","1 tsp honey"]},
 tea:"🍵 AM: Green tea  ·  PM: Turmeric golden milk (shoulder joint support — big pull day)",
 soup:null},
"Jul 15":{cal:"2,200",p:"120g",c:"255g",f:"62g",
 note:"PT + Yoga. Prepare for strongest week. Anti-inflammatory and caloric surplus.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal + berries + almond butter + honey","Ginger lemon tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Orange (2) + almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken (5 oz) + brown rice (1 cup) + roasted vegetables","Olive oil + turmeric seasoning"]},
  {name:"Afternoon",time:"3 PM",items:["Recovery smoothie (below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked cod (5 oz) with lemon herb crust","Sweet potato (medium)","Kale salad with lemon-tahini dressing"]},
 ],smoothie:{name:"Pre-Peak Week Prep",i:["1 cup frozen mango","½ cup frozen tart cherries","1 cup coconut water","1 scoop protein","½ tsp turmeric","½ tsp ginger"]},
 tea:"🍵 AM: Matcha  ·  PM: Tart cherry tea (prepare for Week 3 final and Peak Week)",
 soup:null},
"Jul 16":{cal:"2,400",p:"128g",c:"276g",f:"66g",
 note:"Workout 9 — Full Body Strength. Heaviest full body session. Maximum fuel required.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Overnight oats with almond butter, berries, honey, chia","Matcha latte — biggest full body day of the plan"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake + almond butter","Coconut water","This is the heaviest full body session — fuel it properly"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken and rice (5 oz chicken, 1.25 cups rice)","Avocado, cherry tomatoes, cucumber","Lime olive oil dressing"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice (mandatory)"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon (5 oz) baked with herbs","Brown rice (¾ cup)","Roasted asparagus + lemon"]},
 ],smoothie:{name:"Full Body Strength Fuel",i:["1 cup frozen mango","1 cup spinach","1 cup almond milk","1 scoop chocolate protein","1 tbsp almond butter","Pinch sea salt"]},
 tea:"🍵 AM: Matcha (strongest full body session — needs clean sustained energy)  ·  PM: Turmeric golden milk",
 soup:null},
"Jul 17":{cal:"2,200",p:"122g",c:"258g",f:"62g",
 note:"Week 4 Peak Week begins. PT + Yoga. Maximum anti-inflammatory support for the final push.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2) + avocado + tomato","Fresh berries","Green tea"]},
  {name:"Morning Snack",time:"10 AM",items:["Mixed fruit (mango, berries, grapes)","Walnuts (1 oz) — omega-3 for peak week joints"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp (5 oz) stir-fry with bok choy, snap peas, bell peppers","Over jasmine rice (1 cup)","Ginger tamari sauce"]},
  {name:"Afternoon",time:"3 PM",items:["Peak week smoothie (below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken (5 oz) with cumin-coriander spice blend","Brown rice (¾ cup)","Steamed sweet potato"]},
 ],smoothie:{name:"Peak Week Ignition",i:["1 cup frozen mango","½ cup frozen berries","1 cup almond milk","1 scoop protein","1 tsp turmeric","½ tsp ginger","1 tsp honey"]},
 tea:"🍵 AM: Matcha (Peak Week energy)  ·  PM: Turmeric golden milk (maximum anti-inflammatory for peak week)",
 soup:null},
"Jul 18":{cal:"2,450",p:"130g",c:"280g",f:"68g",
 note:"Workout 10 — Lower Body PEAK. Heaviest session of the program. Highest carbs of the plan.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal (½ cup dry) + almond butter + berries + honey + walnuts","Matcha — this is your most important workout day"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake (2) + almond butter","Coconut water","MANDATORY — peak lower body day. Don't skip this."]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken (6 oz) + jasmine rice (1.5 cups)","Avocado, cucumber, cherry tomatoes","Lime dressing — highest calorie lunch of the program"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake (heavier scoop) + 4 oz tart cherry juice","IMMEDIATELY after peak lower body — muscle is hungriest now"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon (6 oz) baked — omega-3 for peak recovery","Brown rice (¾ cup)","Sautéed kale with garlic"]},
 ],smoothie:{name:"Lower Body Peak Power",i:["1 cup frozen mango","1 cup spinach","1 cup coconut water","1.5 scoops protein","1 tbsp almond butter","Pinch sea salt","1 tsp honey"]},
 tea:"🍵 AM: Matcha latte (peak training day — maximum sustainable energy)  ·  PM: Tart cherry tea (most important recovery night of the program)",
 soup:null},
"Jul 19":{cal:"2,050",p:"115g",c:"238g",f:"58g",
 note:"Sunday REST. Final rest day. Two sessions left. Reflect, recover, prepare to finish strong.",
 meals:[
  {name:"Breakfast",time:"8–9 AM",items:["Smoothie below OR","Whole grain French toast (flax egg) + berries + maple syrup"]},
  {name:"Morning Snack",time:"10:30 AM",items:["Mixed fruit: mango, berries, grapes","Walnuts (1 oz)"]},
  {name:"Lunch",time:"12–1 PM",items:["Lentil soup (see soup)","Whole grain bread (1 slice)","Side salad"]},
  {name:"Afternoon",time:"3–4 PM",items:["4 oz tart cherry juice","Apple + almond butter"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked salmon (5 oz) — omega-3 for final push","Brown rice (¾ cup)","Sautéed spinach with garlic"]},
 ],smoothie:{name:"Final Rest Reset",i:["½ cup frozen mango","½ cup frozen berries","1 cup spinach","1 cup almond milk","1 tbsp chia","1 tsp honey","½ tsp turmeric"]},
 tea:"🍵 AM: Moringa tea (maximum nutrients before final 2 sessions)  ·  PM: Chamomile lavender (deepest rest — 2 sessions left)",
 soup:"Red lentil soup: red lentils, vegetable broth, turmeric, cumin, garlic, ginger, spinach stirred in at end — anti-inflammatory powerhouse"},
"Jul 20":{cal:"2,150",p:"120g",c:"252g",f:"60g",
 note:"PT + Yoga after peak lower body. Maximum recovery day. Anti-inflammatory at highest level.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats with extra berries, honey, chia, walnuts","Ginger turmeric tea — start recovery immediately"]},
  {name:"Morning Snack",time:"10 AM",items:["4 oz tart cherry juice (non-negotiable after peak lower body)","Small apple + almonds"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon (5 oz) + brown rice (1 cup)","Avocado, spinach salad","Lemon-olive oil dressing + turmeric sprinkle"]},
  {name:"Afternoon",time:"3 PM",items:["Recovery smoothie (below)","4 oz more tart cherry juice if sore"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey (5 oz) with herbs over quinoa","Roasted zucchini and bell pepper","Light tomato sauce"]},
 ],smoothie:{name:"Peak Recovery Tart Cherry",i:["½ cup tart cherry juice","½ cup frozen berries","1 cup almond milk","1 scoop protein","½ tsp ginger","½ tsp turmeric"]},
 tea:"🍵 AM: Ginger turmeric tea  ·  PM: Chamomile (deepest recovery sleep of the program tonight)",
 soup:null},
"Jul 21":{cal:"2,350",p:"126g",c:"268g",f:"65g",
 note:"Workout 11 — Core + Arms PEAK. 4 sets everything. 1-minute planks. 120 total bicycle crunches.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Oatmeal + berries + almond butter + honey","Matcha latte"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake + mango","Coconut water"]},
  {name:"Lunch",time:"12–1 PM",items:["Tuna (canned albacore, 1 can) rice bowl","Brown rice (1 cup), avocado, cucumber, cherry tomatoes","Tamari + sesame oil + lime"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked chicken (5 oz) with herbs","Jasmine rice (¾ cup)","Steamed bok choy with ginger"]},
 ],smoothie:{name:"Core Peak Day Spinach Berry",i:["1 cup frozen berries","1 cup spinach","1 cup almond milk","1 scoop protein","1 tbsp flaxseed","1 tsp honey"]},
 tea:"🍵 AM: Green tea  ·  PM: Turmeric golden milk (shoulder and joint support after peak pulling session)",
 soup:null},
"Jul 22":{cal:"2,250",p:"122g",c:"260g",f:"62g",
 note:"Final PT + Yoga day of the program. Prepare for Session 12 tomorrow. Honor the plan.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal + almond butter + berries + honey + chia","Matcha — final stretch"]},
  {name:"Morning Snack",time:"10 AM",items:["Mango chunks (½ cup)","Mixed nuts (1 oz)"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken (5 oz) + jasmine rice (1 cup)","Cucumber, tomato, avocado","Olive oil + lemon"]},
  {name:"Afternoon",time:"3 PM",items:["Berry smoothie (see below)"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp (5 oz) with garlic butter (dairy-free: use olive oil) over whole grain pasta (¾ cup)","Steamed asparagus","Cherry tomatoes"]},
 ],smoothie:{name:"Penultimate Power",i:["1 cup frozen mango","½ cup frozen tart cherries","1 cup almond milk","1 scoop protein","½ tsp ginger","1 tsp honey"]},
 tea:"🍵 AM: Matcha  ·  PM: Tart cherry tea (prepare for Session 12 full body peak)",
 soup:null},
"Jul 23":{cal:"2,450",p:"130g",c:"280g",f:"68g",
 note:"Workout 12 — Full Body PEAK. 4 rounds of 6 exercises. Highest nutrition day. This is it.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Overnight oats (pre-made the night before) with almond butter, berries, walnuts, honey","Matcha latte — Session 12 requires peak energy"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cake (2) + almond butter","Coconut water","Session 12 of 13 — fuel this completely"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken (6 oz) + jasmine rice (1.5 cups)","Avocado, cucumber, cherry tomatoes","Peak calorie lunch of the program"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice (MANDATORY — 4 rounds of 6 exercises)"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon (6 oz) baked — peak recovery protein","Brown rice (¾ cup)","Roasted sweet potato","Steamed spinach"]},
 ],smoothie:{name:"Full Body Peak Celebration",i:["1 cup frozen mango","1 cup spinach","1 cup almond milk","1.5 scoops protein","1 tbsp almond butter","1 tsp honey","Pinch sea salt"]},
 tea:"🍵 AM: Matcha latte (most demanding session of the program)  ·  PM: Turmeric golden milk (honor everything you've built)",
 soup:null},
"Jul 24":{cal:"2,200",p:"120g",c:"255g",f:"62g",
 note:"Final PT + Yoga of the program. Tomorrow is the celebration. Recover and prepare.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal + berries + honey + chia","Ginger lemon tea — recovery starts now for tomorrow's finale"]},
  {name:"Morning Snack",time:"10 AM",items:["4 oz tart cherry juice","Mixed fruit: berries, mango, grapes"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon (5 oz) + brown rice (1 cup)","Avocado, spinach, cucumber","Lemon olive oil dressing"]},
  {name:"Afternoon",time:"3 PM",items:["Final prep smoothie (below) — load carbs for tomorrow"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken (5 oz) with turmeric + herbs","Jasmine rice (1 cup) — slightly more rice than usual to carb load for tomorrow","Steamed bok choy"]},
 ],smoothie:{name:"Day Before Finale Prep",i:["1 cup frozen mango","½ cup frozen berries","1 cup coconut water","1 scoop protein","½ tsp turmeric","½ tsp ginger","1 tsp honey"]},
 tea:"🍵 AM: Matcha  ·  PM: Chamomile (the best sleep you can get tonight — tomorrow is Day 30)",
 soup:null},
"Jul 25":{cal:"2,450",p:"130g",c:"280g",f:"68g",
 note:"Day 30 — Goddess Body COMPLETE. Celebration session. Eat like the Goddess you are. You earned every calorie.",
 meals:[
  {name:"Breakfast",time:"7 AM",items:["Celebration breakfast: Oatmeal with berries, honey, almond butter, walnuts, cinnamon","Matcha latte with almond milk","Take your progress photos before this meal"]},
  {name:"Pre-Workout",time:"45 min before",items:["Rice cakes (2) + almond butter","Coconut water","You are about to complete Session 13 of 13"]},
  {name:"Lunch",time:"12–1 PM",items:["Goddess Victory Bowl: grilled salmon (6 oz) over jasmine rice (1.5 cups)","Avocado, cucumber, mango salsa (NO pineapple)","Tamari + sesame + lime — your best meal of the 30 days"]},
  {name:"Post-Workout",time:"30 min after",items:["Protein shake + 4 oz tart cherry juice","Your final post-workout recovery drink of Goddess Body"]},
  {name:"Dinner",time:"6–7 PM",items:["Celebration dinner: Grilled shrimp (6 oz) with garlic and herbs","Jasmine rice (1 cup)","Roasted asparagus + lemon","Fresh fruit dessert: berries, mango, honey drizzle"]},
 ],smoothie:{name:"30-Day Goddess Victory Smoothie",i:["1 cup frozen mango","½ cup frozen berries","1 cup spinach","1 cup almond milk","1.5 scoops vanilla protein","1 tsp honey","½ tsp turmeric","Few mint leaves"]},
 tea:"🍵 AM: Matcha latte (final session — your most powerful)  ·  PM: Hibiscus tea (celebrate with the most vibrant tea of the program — you are a Goddess)",
 soup:null},
"Jul 26":{cal:"2,570",p:"140g",c:"295g",f:"72g",
 note:"Day 31 — Rising phase continues. Leg day with heavier hip thrusts. Progressive overload is the name of the game now.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken thigh + sweet potato: baked chicken thigh (6 oz) + roasted sweet potato + sautéed broccolini + lemon herb sauce","Sparkling water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Rice cakes (2) + avocado mash + sea salt + red pepper flakes"]},
  {name:"Dinner",time:"6–7 PM",items:["Mahi-mahi (5 oz) with mango-avocado salsa + coconut rice + grilled zucchini","Chamomile tea"]}
 ],smoothie:{name:"Peach Power",i:["1 cup frozen peaches","1 cup almond milk","1 scoop vanilla protein","½ cup plain oats","1 tbsp honey","pinch of cardamom"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Jul 27":{cal:"2,590",p:"140g",c:"295g",f:"72g",
 note:"Day 32 — Phase 2 begins. Rising phase. Higher volume, heavier loads. Your body is ready — Phase 1 built the foundation Phase 2 builds on.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey taco bowl: seasoned turkey + cilantro rice + black beans + pico de gallo + guacamole (corn tortillas on side)","Hibiscus iced tea"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Apple slices + sunflower seed butter (2 tbsp) + cinnamon"]},
  {name:"Dinner",time:"6–7 PM",items:["Teriyaki chicken thighs (6 oz) + jasmine rice (1 cup) + steamed bok choy + sesame seeds","Ginger tea"]}
 ],smoothie:{name:"Berry Rebuild",i:["1 cup frozen mixed berries","1 cup almond milk","1 scoop chocolate protein","½ cup oats","1 tbsp honey","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Jul 28":{cal:"2,380",p:"125g",c:"270g",f:"68g",
 note:"Day 33 — PT and yoga. Check in with how the supersets landed. Monday setup before Tuesday's leg power session.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken breast (5 oz) + wild rice (1 cup) + roasted vegetables (zucchini, squash, peppers) + olive oil","Anti-inflammatory golden milk: turmeric + almond milk + ginger + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp pasta: jumbo shrimp + whole wheat linguine + roasted tomatoes + fresh basil + garlic + olive oil (light parmesan)","Sparkling water"]}
 ],smoothie:{name:"Tropical Strength",i:["½ cup frozen mango","½ cup frozen papaya","1 cup spinach","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Jul 29":{cal:"2,270",p:"118g",c:"245g",f:"64g",
 note:"Day 34 — Second-to-last Phase 2 rest day. One week of Phase 2 remaining. You're almost at 60 days.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey chili (no bean version): ground turkey + diced tomatoes + bell pepper + corn + cumin + chili powder + served over rice","Hibiscus tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey stuffed peppers: bell peppers filled with seasoned turkey + wild rice + diced tomatoes + herbs","Decaf green tea"]}
 ],smoothie:{name:"Cherry Recovery",i:["1 cup frozen cherries","1 cup almond milk","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp almond butter (NO — use sunflower butter)","½ tsp cinnamon"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Jul 30":{cal:"2,320",p:"125g",c:"270g",f:"68g",
 note:"Day 35 — New week PT+yoga. Tell your therapist you're in Phase 2 now — loads are heavier, recovery needs to match.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp tacos (2): grilled shrimp + corn tortillas + slaw + avocado + lime crema (dairy-light) + cilantro","Agua fresca: watermelon + lime + mint"]},
  {name:"Dinner",time:"6–7 PM",items:["Cod with herb crust (5 oz) + sweet potato mash + green beans almondine","Peppermint tea"]}
 ],smoothie:{name:"Green Goddess Power",i:["2 cups spinach","½ cup frozen mango","1 green apple (cored)","1 cup coconut water","1 scoop vanilla protein","1 tbsp flaxseed"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Jul 31":{cal:"2,590",p:"140g",c:"295g",f:"72g",
 note:"Day 36 — Lower body power surge. Bulgarian split squats make their debut. Fuel and recover hard.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Cod po boy: baked cod (5 oz) + whole wheat hoagie roll + shredded cabbage + remoulade + pickles + sweet potato fries","Lemonade"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Chocolate protein shake + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken stir fry: chicken breast strips + broccoli + snap peas + carrots + jasmine rice + oyster sauce + ginger","Cucumber water"]}
 ],smoothie:{name:"Watermelon Recovery",i:["1.5 cups fresh watermelon","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp honey","fresh mint leaves"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 1":{cal:"2,380",p:"125g",c:"270g",f:"68g",
 note:"Day 37 — Post-heavy leg PT. Your glutes and hamstrings worked hard yesterday. Let today do its repair work.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Baked cod + potato: herb-crusted cod (5 oz) + roasted baby potatoes + haricot verts + lemon","Lemon ginger water"]},
  {name:"Dinner",time:"6–7 PM",items:["Scallop and asparagus: pan-seared scallops (5 oz) + roasted asparagus + wild rice + lemon butter (light dairy)","Sparkling water with lemon"]}
 ],smoothie:{name:"Pomegranate Power",i:["½ cup pomegranate juice","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 2":{cal:"2,480",p:"140g",c:"295g",f:"72g",
 note:"Day 38 — Lower body peak Phase 2. Personal records are happening today. High carb day for maximum performance.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon rice bowl: grilled salmon (6 oz) + jasmine rice (1.25 cups) + edamame + avocado + sesame-ginger dressing","Sparkling water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Protein shake in almond milk (1 scoop) + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon rice bowl: teriyaki glazed salmon (5 oz) + brown rice + edamame + shredded carrots + sesame-ginger sauce","Green tea (decaf)"]}
 ],smoothie:{name:"Mango Muscle Builder",i:["1 cup frozen mango","1 cup kale","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 3":{cal:"2,570",p:"140g",c:"295g",f:"72g",
 note:"Day 39 — Back and core supersets. Phase 2 upper body is more volume than Phase 1. Eat well tonight.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Scallop rice: pan-seared scallops (5 oz) + jasmine rice + roasted asparagus + lemon butter (dairy-light)","Cucumber mint water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Vanilla protein shake + almond milk + handful of berries blended in"]},
  {name:"Dinner",time:"6–7 PM",items:["Turkey meatballs: turkey meatballs in tomato sauce + whole wheat spaghetti + side salad (mixed greens + vinaigrette)","Chamomile tea"]}
 ],smoothie:{name:"Kiwi Strength",i:["2 kiwis (peeled)","1 cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tsp honey","½ tsp ginger"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 4":{cal:"2,440",p:"125g",c:"270g",f:"68g",
 note:"Day 40 — Post-full-body-strength PT. Recovery at this intensity level is as important as the workout itself.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Mahi-mahi tacos (2): grilled mahi + corn tortillas + mango-cucumber salsa + lime + shredded purple cabbage","Hibiscus iced tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Crab cakes (2 small): lump crab + breadcrumbs + old bay seasoning + baked, served with remoulade + corn + slaw","Hibiscus tea"]}
 ],smoothie:{name:"Mango Turmeric Heal",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","½ tsp ginger","1 tsp honey","black pepper pinch"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 5":{cal:"2,260",p:"118g",c:"245g",f:"64g",
 note:"Day 41 — Phase 2 Week 3 rest. Your body is actively building from the heavier loads. Feed it well today.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon salad bowl: flaked baked salmon + mixed greens + cherry tomatoes + cucumber + avocado + lemon vinaigrette + farro","Anti-inflammatory golden milk"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken tikka (dairy-light): chicken breast in spiced tomato-coconut milk sauce + basmati rice + naan bread (1 piece)","Cardamom tea"]}
 ],smoothie:{name:"Berry Rebuild",i:["1 cup frozen mixed berries","1 cup almond milk","1 scoop chocolate protein","½ cup oats","1 tbsp honey","½ tsp cinnamon"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 6":{cal:"2,380",p:"125g",c:"270g",f:"68g",
 note:"Day 42 — Pre-finale PT. Tomorrow is your Phase 2 lower body showcase. Come Wednesday primed.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey lettuce wraps: ground turkey + butter lettuce + shredded carrots + cucumbers + hoisin sauce + rice on side","Green tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp fried rice: shrimp + fried rice (flax egg) + peas + carrots + scallions + sesame oil + soy sauce","Sparkling water"]}
 ],smoothie:{name:"Tropical Strength",i:["½ cup frozen mango","½ cup frozen papaya","1 cup spinach","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 7":{cal:"2,570",p:"140g",c:"295g",f:"72g",
 note:"Day 43 — Lower body Phase 2 finale. Progress photos. Compare to Day 30. The difference is real.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken thigh + sweet potato: baked chicken thigh (6 oz) + roasted sweet potato + sautéed broccolini + lemon herb sauce","Sparkling water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Rice cakes (2) + avocado mash + sea salt + red pepper flakes"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground beef (lean 90/10) tacos (2): seasoned beef + corn tortillas + shredded lettuce + tomato + avocado + salsa","Agua fresca"]}
 ],smoothie:{name:"Peach Power",i:["1 cup frozen peaches","1 cup almond milk","1 scoop vanilla protein","½ cup plain oats","1 tbsp honey","pinch of cardamom"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 8":{cal:"2,440",p:"125g",c:"270g",f:"68g",
 note:"Day 44 — PT and yoga recovery after Phase 2 Day 1. Let your therapist assess how your body responded to the step up in intensity.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken soup: homemade chicken broth + chunks of chicken breast + rice noodles + ginger + bok choy + green onions","Chamomile tea with honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked mahi-mahi (5 oz) + garlic butter broccolini + jasmine rice + cherry tomato salad","Chamomile tea"]}
 ],smoothie:{name:"Cherry Recovery",i:["1 cup frozen cherries","1 cup almond milk","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp almond butter (NO — use sunflower butter)","½ tsp cinnamon"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 9":{cal:"2,540",p:"140g",c:"295g",f:"72g",
 note:"Day 45 — Full body with intensity. Stairmaster extended to 25 min. Caloric surplus supports this increased workload.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken breast stir fry: sliced chicken (6 oz) + lo mein noodles + mixed veggies + teriyaki sauce","Water with mint"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Hummus (¼ cup) + cucumber slices + baby carrots + pita triangles (1)"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp pasta: jumbo shrimp + whole wheat linguine + roasted tomatoes + fresh basil + garlic + olive oil (light parmesan)","Sparkling water"]}
 ],smoothie:{name:"Pomegranate Power",i:["½ cup pomegranate juice","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 10":{cal:"2,480",p:"140g",c:"295g",f:"72g",
 note:"Day 46 — Phase 2 first strength session. Supersets are introduced — twice the work, twice the growth signal. Fuel to match the effort.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey meatball pasta: whole wheat spaghetti (1.5 cups) + lean turkey meatballs + marinara + parmesan (light)","Water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Mixed nuts (almonds, cashews, walnuts) + dark chocolate (1 oz, 70%+)"]},
  {name:"Dinner",time:"6–7 PM",items:["Lemon herb salmon (6 oz) + roasted garlic potatoes + sautéed spinach with garlic and olive oil","Decaf chamomile tea"]}
 ],smoothie:{name:"Green Goddess Power",i:["2 cups spinach","½ cup frozen mango","1 green apple (cored)","1 cup coconut water","1 scoop vanilla protein","1 tbsp flaxseed"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 11":{cal:"2,430",p:"125g",c:"270g",f:"68g",
 note:"Day 47 — Mid-week recovery. Wednesday PT sets up Thursday full body. Hydrate, eat, restore.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey bowl: seasoned turkey + brown rice + roasted sweet potato + black beans + avocado + salsa","Peppermint tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Teriyaki chicken thighs (6 oz) + jasmine rice (1 cup) + steamed bok choy + sesame seeds","Ginger tea"]}
 ],smoothie:{name:"Watermelon Recovery",i:["1.5 cups fresh watermelon","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp honey","fresh mint leaves"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 12":{cal:"2,240",p:"118g",c:"245g",f:"64g",
 note:"Day 48 — Mid-Phase 2 rest. You've done 10 of 39 total sessions. Progress photos recommended.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken and rice (comforting): slow-cooked chicken breast (5 oz) + white rice (1 cup) + green peas + butter (light) + parsley","Chamomile tea + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Mahi-mahi (5 oz) with mango-avocado salsa + coconut rice + grilled zucchini","Chamomile tea"]}
 ],smoothie:{name:"Kiwi Strength",i:["2 kiwis (peeled)","1 cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tsp honey","½ tsp ginger"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 13":{cal:"2,440",p:"125g",c:"270g",f:"68g",
 note:"Day 49 — Wednesday recovery. Between two heavy leg sessions — your PT is the bridge that keeps you injury-free.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon + quinoa: baked salmon (5 oz) + quinoa (1 cup) + steamed broccoli + lemon-dill dressing","Ginger tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey stuffed peppers: bell peppers filled with seasoned turkey + wild rice + diced tomatoes + herbs","Decaf green tea"]}
 ],smoothie:{name:"Mango Turmeric Heal",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","½ tsp ginger","1 tsp honey","black pepper pinch"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 14":{cal:"2,480",p:"140g",c:"295g",f:"72g",
 note:"Day 50 — Second lower body session of the week. Different angles, different muscle fiber recruitment.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon rice bowl: grilled salmon (6 oz) + jasmine rice (1.25 cups) + edamame + avocado + sesame-ginger dressing","Sparkling water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Protein shake in almond milk (1 scoop) + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Cod with herb crust (5 oz) + sweet potato mash + green beans almondine","Peppermint tea"]}
 ],smoothie:{name:"Mango Muscle Builder",i:["1 cup frozen mango","1 cup kale","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 15":{cal:"2,430",p:"125g",c:"270g",f:"68g",
 note:"Day 51 — Phase 2 Week 3 begins. PT today sets up the heaviest week of Phase 2. Arrive ready.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp tacos (2): grilled shrimp + corn tortillas + slaw + avocado + lime crema (dairy-light) + cilantro","Agua fresca: watermelon + lime + mint"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken stir fry: chicken breast strips + broccoli + snap peas + carrots + jasmine rice + oyster sauce + ginger","Cucumber water"]}
 ],smoothie:{name:"Berry Rebuild",i:["1 cup frozen mixed berries","1 cup almond milk","1 scoop chocolate protein","½ cup oats","1 tbsp honey","½ tsp cinnamon"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 16":{cal:"2,600",p:"140g",c:"295g",f:"72g",
 note:"Day 52 — Core and arms peak Phase 2. 4 sets, 30 bicycles, 1-min planks. Abs are responding to the training.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Mahi-mahi bowl: pan-seared mahi-mahi (5 oz) + coconut rice + mango salsa (no pineapple) + black beans","Green tea iced"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Protein shake + berry smoothie (mixed berries + coconut water + ice)"]},
  {name:"Dinner",time:"6–7 PM",items:["Crab cakes (2 small): lump crab + breadcrumbs + old bay seasoning + baked, served with remoulade + corn + slaw","Hibiscus tea"]}
 ],smoothie:{name:"Cherry Recovery",i:["1 cup frozen cherries","1 cup almond milk","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp almond butter (NO — use sunflower butter)","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 17":{cal:"2,540",p:"140g",c:"295g",f:"72g",
 note:"Day 53 — Full body strength. Heaviest loads yet. 4 sets on everything. This is the heart of Phase 2.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp stir fry: jumbo shrimp (6 oz) + brown rice (1 cup) + snap peas + bell peppers + garlic-tamari sauce","Cucumber water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Greek yogurt (dairy-light: coconut yogurt) + honey + walnuts + berries"]},
  {name:"Dinner",time:"6–7 PM",items:["Scallop and asparagus: pan-seared scallops (5 oz) + roasted asparagus + wild rice + lemon butter (light dairy)","Sparkling water with lemon"]}
 ],smoothie:{name:"Tropical Strength",i:["½ cup frozen mango","½ cup frozen papaya","1 cup spinach","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 18":{cal:"2,410",p:"125g",c:"270g",f:"68g",
 note:"Day 54 — Pre-peak PT. One more heavy lower body session this week — PT today is your sharpening stone.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Baked cod + potato: herb-crusted cod (5 oz) + roasted baby potatoes + haricot verts + lemon","Lemon ginger water"]},
  {name:"Dinner",time:"6–7 PM",items:["Turkey meatballs: turkey meatballs in tomato sauce + whole wheat spaghetti + side salad (mixed greens + vinaigrette)","Chamomile tea"]}
 ],smoothie:{name:"Peach Power",i:["1 cup frozen peaches","1 cup almond milk","1 scoop vanilla protein","½ cup plain oats","1 tbsp honey","pinch of cardamom"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 19":{cal:"2,150",p:"118g",c:"245g",f:"64g",
 note:"Day 55 — Phase 2 first rest day. New intensity means recovery matters more. Sleep, eat, hydrate.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp + grits: sautéed shrimp + creamy grits (dairy-light: coconut milk based) + roasted tomatoes + scallions","Sparkling water with lime"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon rice bowl: teriyaki glazed salmon (5 oz) + brown rice + edamame + shredded carrots + sesame-ginger sauce","Green tea (decaf)"]}
 ],smoothie:{name:"Green Goddess Power",i:["2 cups spinach","½ cup frozen mango","1 green apple (cored)","1 cup coconut water","1 scoop vanilla protein","1 tbsp flaxseed"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 20":{cal:"2,430",p:"125g",c:"270g",f:"68g",
 note:"Day 56 — Phase 2 complete. Final PT+yoga of this phase. Tell your PT what 60 days has built. Phase 3 unlocks tomorrow.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken breast (5 oz) + wild rice (1 cup) + roasted vegetables (zucchini, squash, peppers) + olive oil","Anti-inflammatory golden milk: turmeric + almond milk + ginger + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken tikka (dairy-light): chicken breast in spiced tomato-coconut milk sauce + basmati rice + naan bread (1 piece)","Cardamom tea"]}
 ],smoothie:{name:"Watermelon Recovery",i:["1.5 cups fresh watermelon","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp honey","fresh mint leaves"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 21":{cal:"2,540",p:"140g",c:"295g",f:"72g",
 note:"Day 57 — Phase 2 begins. Rising phase. Higher volume, heavier loads. Your body is ready — Phase 1 built the foundation Phase 2 builds on.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken breast stir fry: sliced chicken (6 oz) + lo mein noodles + mixed veggies + teriyaki sauce","Water with mint"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Hummus (¼ cup) + cucumber slices + baby carrots + pita triangles (1)"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp fried rice: shrimp + fried rice (flax egg) + peas + carrots + scallions + sesame oil + soy sauce","Sparkling water"]}
 ],smoothie:{name:"Pomegranate Power",i:["½ cup pomegranate juice","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 22":{cal:"2,410",p:"125g",c:"270g",f:"68g",
 note:"Day 58 — PT and yoga. Check in with how the supersets landed. Monday setup before Tuesday's leg power session.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey lettuce wraps: ground turkey + butter lettuce + shredded carrots + cucumbers + hoisin sauce + rice on side","Green tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground beef (lean 90/10) tacos (2): seasoned beef + corn tortillas + shredded lettuce + tomato + avocado + salsa","Agua fresca"]}
 ],smoothie:{name:"Kiwi Strength",i:["2 kiwis (peeled)","1 cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tsp honey","½ tsp ginger"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 23":{cal:"2,710",p:"150g",c:"315g",f:"75g",
 note:"Day 59 — Phase 3 begins. Goddess Peak. Tempo training, drop sets, peak volume. Every rep intentional.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey taco bowl: seasoned turkey + cilantro rice + black beans + pico de gallo + guacamole (corn tortillas on side)","Hibiscus iced tea"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Apple slices + sunflower seed butter (2 tbsp) + cinnamon"]},
  {name:"Dinner",time:"6–7 PM",items:["Teriyaki chicken thighs (6 oz) + jasmine rice (1 cup) + steamed bok choy + sesame seeds","Ginger tea"]}
 ],smoothie:{name:"Cherry Bomb Recovery",i:["1 cup frozen dark cherries","4 oz tart cherry juice","1 cup coconut water","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 24":{cal:"2,600",p:"140g",c:"295g",f:"72g",
 note:"Day 60 — Rising phase continues. Leg day with heavier hip thrusts. Progressive overload is the name of the game now.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Crab fried rice: lump crab meat (4 oz) + fried rice (no egg — flax egg substitute) + peas + carrots + sesame oil + soy sauce","Hibiscus tea"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Edamame (1 cup, salted) + sparkling water with lime"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked mahi-mahi (5 oz) + garlic butter broccolini + jasmine rice + cherry tomato salad","Chamomile tea"]}
 ],smoothie:{name:"Mango Turmeric Heal",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","½ tsp ginger","1 tsp honey","black pepper pinch"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 25":{cal:"2,320",p:"125g",c:"270g",f:"68g",
 note:"Day 61 — Post full-body recovery. PT today is essential for fibromyalgia management at elevated training volume.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken soup: homemade chicken broth + chunks of chicken breast + rice noodles + ginger + bok choy + green onions","Chamomile tea with honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Lemon herb salmon (6 oz) + roasted garlic potatoes + sautéed spinach with garlic and olive oil","Decaf chamomile tea"]}
 ],smoothie:{name:"Mango Muscle Builder",i:["1 cup frozen mango","1 cup kale","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp turmeric"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 26":{cal:"2,310",p:"125g",c:"260g",f:"66g",
 note:"Day 62 — Rest and reflect. Two-thirds of the 90-day journey complete. Compare your photos. The Goddess Body is emerging.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey chili (no bean version): ground turkey + diced tomatoes + bell pepper + corn + cumin + chili powder + served over rice","Hibiscus tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp pasta: jumbo shrimp + whole wheat linguine + roasted tomatoes + fresh basil + garlic + olive oil (light parmesan)","Sparkling water"]}
 ],smoothie:{name:"Papaya Strength",i:["1 cup frozen papaya","½ cup frozen mango","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger","1 tsp turmeric","1 tbsp honey"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 27":{cal:"2,510",p:"132g",c:"285g",f:"70g",
 note:"Day 63 — Pre-tempo full body PT. Tomorrow is the most controlled full body session yet. Arrive primed.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Mahi-mahi tacos (2): grilled mahi + corn tortillas + mango-cucumber salsa + lime + shredded purple cabbage","Hibiscus iced tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Mahi-mahi (5 oz) with mango-avocado salsa + coconut rice + grilled zucchini","Chamomile tea"]}
 ],smoothie:{name:"Dragon Fruit Power",i:["1 packet frozen dragon fruit","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia","½ lime juiced"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 28":{cal:"2,720",p:"150g",c:"315g",f:"75g",
 note:"Day 64 — Full body tempo. Every movement controlled. This is elite training.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Mahi-mahi bowl: pan-seared mahi-mahi (5 oz) + coconut rice + mango salsa (no pineapple) + black beans","Green tea iced"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Protein shake + berry smoothie (mixed berries + coconut water + ice)"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey stuffed peppers: bell peppers filled with seasoned turkey + wild rice + diced tomatoes + herbs","Decaf green tea"]}
 ],smoothie:{name:"Golden Goddess",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","1 tsp ginger","1 tbsp honey","coconut flakes (garnish)"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 29":{cal:"2,420",p:"132g",c:"285g",f:"70g",
 note:"Day 65 — Post-leg drop set PT. Drop sets create maximum fatigue — your PT helps you recover fast enough for Thursday.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon + quinoa: baked salmon (5 oz) + quinoa (1 cup) + steamed broccoli + lemon-dill dressing","Ginger tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Cod with herb crust (5 oz) + sweet potato mash + green beans almondine","Peppermint tea"]}
 ],smoothie:{name:"Plum Power",i:["2 fresh plums (pitted)","1 cup frozen blueberries","1 cup almond milk","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Aug 30":{cal:"2,690",p:"150g",c:"315g",f:"75g",
 note:"Day 66 — Full body peak. Maximum volume across all muscle groups. The biggest training day of 90 days.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Scallop rice: pan-seared scallops (5 oz) + jasmine rice + roasted asparagus + lemon butter (dairy-light)","Cucumber mint water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Vanilla protein shake + almond milk + handful of berries blended in"]},
  {name:"Dinner",time:"6–7 PM",items:["Turkey meatballs: turkey meatballs in tomato sauce + whole wheat spaghetti + side salad (mixed greens + vinaigrette)","Chamomile tea"]}
 ],smoothie:{name:"Pear Strength",i:["1 ripe pear (cored)","1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp ginger","1 tsp honey","½ tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Aug 31":{cal:"2,710",p:"150g",c:"315g",f:"75g",
 note:"Day 67 — Glute isolation. Cable pull-throughs, single-leg hip thrusts. Pure glute work.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Cod po boy: baked cod (5 oz) + whole wheat hoagie roll + shredded cabbage + remoulade + pickles + sweet potato fries","Lemonade"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Chocolate protein shake + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken stir fry: chicken breast strips + broccoli + snap peas + carrots + jasmine rice + oyster sauce + ginger","Cucumber water"]}
 ],smoothie:{name:"Melon Recovery",i:["1.5 cups honeydew melon","½ cup cucumber","1 cup coconut water","1 scoop vanilla protein","fresh mint","1 tsp honey","lime juice"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 1":{cal:"2,480",p:"132g",c:"285g",f:"70g",
 note:"Day 68 — Phase 3 final stretch begins. Your PT has watched you transform over 12 weeks. Let them see it today.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp tacos (2): grilled shrimp + corn tortillas + slaw + avocado + lime crema (dairy-light) + cilantro","Agua fresca: watermelon + lime + mint"]},
  {name:"Dinner",time:"6–7 PM",items:["Scallop and asparagus: pan-seared scallops (5 oz) + roasted asparagus + wild rice + lemon butter (light dairy)","Sparkling water with lemon"]}
 ],smoothie:{name:"Triple Berry Peak",i:["⅓ cup frozen strawberries","⅓ cup frozen blueberries","⅓ cup frozen raspberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia","1 tsp honey"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 2":{cal:"2,370",p:"125g",c:"260g",f:"66g",
 note:"Day 69 — Third-to-last rest day. 7 sessions remain. The finish line is real. Rest like it matters — it does.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon salad bowl: flaked baked salmon + mixed greens + cherry tomatoes + cucumber + avocado + lemon vinaigrette + farro","Anti-inflammatory golden milk"]},
  {name:"Dinner",time:"6–7 PM",items:["Crab cakes (2 small): lump crab + breadcrumbs + old bay seasoning + baked, served with remoulade + corn + slaw","Hibiscus tea"]}
 ],smoothie:{name:"Pomegranate Ascended",i:["½ cup pomegranate arils","½ cup frozen cherries","1 cup coconut water","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp flaxseed"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 3":{cal:"2,420",p:"132g",c:"285g",f:"70g",
 note:"Day 70 — 84 days in. Final month PT. You are not the same person who started June 24.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey bowl: seasoned turkey + brown rice + roasted sweet potato + black beans + avocado + salsa","Peppermint tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon rice bowl: teriyaki glazed salmon (5 oz) + brown rice + edamame + shredded carrots + sesame-ginger sauce","Green tea (decaf)"]}
 ],smoothie:{name:"Goddess Ascension",i:["1 cup frozen acai","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp honey","fresh mint"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 4":{cal:"2,710",p:"150g",c:"315g",f:"75g",
 note:"Day 71 — Full body tempo final. You've been here 85 days. This session is you at your strongest.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey taco bowl: seasoned turkey + cilantro rice + black beans + pico de gallo + guacamole (corn tortillas on side)","Hibiscus iced tea"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Apple slices + sunflower seed butter (2 tbsp) + cinnamon"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken tikka (dairy-light): chicken breast in spiced tomato-coconut milk sauce + basmati rice + naan bread (1 piece)","Cardamom tea"]}
 ],smoothie:{name:"Cherry Bomb Recovery",i:["1 cup frozen dark cherries","4 oz tart cherry juice","1 cup coconut water","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 5":{cal:"2,480",p:"132g",c:"285g",f:"70g",
 note:"Day 72 — Pre-Goddess Ascended PT. The finale is tomorrow. One last PT session to prepare your body to finish at full power.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken breast (5 oz) + wild rice (1 cup) + roasted vegetables (zucchini, squash, peppers) + olive oil","Anti-inflammatory golden milk: turmeric + almond milk + ginger + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp fried rice: shrimp + fried rice (flax egg) + peas + carrots + scallions + sesame oil + soy sauce","Sparkling water"]}
 ],smoothie:{name:"Papaya Strength",i:["1 cup frozen papaya","½ cup frozen mango","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger","1 tsp turmeric","1 tbsp honey"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 6":{cal:"2,600",p:"150g",c:"315g",f:"75g",
 note:"Day 73 — Phase 3 first full leg day. Tempo squats 3-1-3 count. Slow = more muscle activation.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey meatball pasta: whole wheat spaghetti (1.5 cups) + lean turkey meatballs + marinara + parmesan (light)","Water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Mixed nuts (almonds, cashews, walnuts) + dark chocolate (1 oz, 70%+)"]},
  {name:"Dinner",time:"6–7 PM",items:["Lemon herb salmon (6 oz) + roasted garlic potatoes + sautéed spinach with garlic and olive oil","Decaf chamomile tea"]}
 ],smoothie:{name:"Plum Power",i:["2 fresh plums (pitted)","1 cup frozen blueberries","1 cup almond milk","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 7":{cal:"2,690",p:"150g",c:"315g",f:"75g",
 note:"Day 74 — Day 89. Goddess Ascended workout. Everything you've built comes forward for one final session.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken thigh + sweet potato: baked chicken thigh (6 oz) + roasted sweet potato + sautéed broccolini + lemon herb sauce","Sparkling water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Rice cakes (2) + avocado mash + sea salt + red pepper flakes"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground beef (lean 90/10) tacos (2): seasoned beef + corn tortillas + shredded lettuce + tomato + avocado + salsa","Agua fresca"]}
 ],smoothie:{name:"Dragon Fruit Power",i:["1 packet frozen dragon fruit","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia","½ lime juiced"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 8":{cal:"2,540",p:"132g",c:"285g",f:"70g",
 note:"Day 75 — Post-tempo leg PT. Eccentric training creates more soreness — PT today is essential.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey lettuce wraps: ground turkey + butter lettuce + shredded carrots + cucumbers + hoisin sauce + rice on side","Green tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked mahi-mahi (5 oz) + garlic butter broccolini + jasmine rice + cherry tomato salad","Chamomile tea"]}
 ],smoothie:{name:"Golden Goddess",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","1 tsp ginger","1 tbsp honey","coconut flakes (garnish)"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 9":{cal:"2,360",p:"125g",c:"260g",f:"66g",
 note:"Day 76 — Phase 3 first rest day. Tempo training creates deep muscle fatigue. Today the real growth happens.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken and rice (comforting): slow-cooked chicken breast (5 oz) + white rice (1 cup) + green peas + butter (light) + parsley","Chamomile tea + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Teriyaki chicken thighs (6 oz) + jasmine rice (1 cup) + steamed bok choy + sesame seeds","Ginger tea"]}
 ],smoothie:{name:"Melon Recovery",i:["1.5 cups honeydew melon","½ cup cucumber","1 cup coconut water","1 scoop vanilla protein","fresh mint","1 tsp honey","lime juice"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 10":{cal:"2,480",p:"132g",c:"285g",f:"70g",
 note:"Day 77 — Post-leg drop set PT. Drop sets create maximum fatigue — your PT helps you recover fast enough for Thursday.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Baked cod + potato: herb-crusted cod (5 oz) + roasted baby potatoes + haricot verts + lemon","Lemon ginger water"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp pasta: jumbo shrimp + whole wheat linguine + roasted tomatoes + fresh basil + garlic + olive oil (light parmesan)","Sparkling water"]}
 ],smoothie:{name:"Triple Berry Peak",i:["⅓ cup frozen strawberries","⅓ cup frozen blueberries","⅓ cup frozen raspberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia","1 tsp honey"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 11":{cal:"2,690",p:"150g",c:"315g",f:"75g",
 note:"Day 78 — Lower body drop sets debut. Your muscles get shocked — then grow. High calorie day.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Scallop rice: pan-seared scallops (5 oz) + jasmine rice + roasted asparagus + lemon butter (dairy-light)","Cucumber mint water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Vanilla protein shake + almond milk + handful of berries blended in"]},
  {name:"Dinner",time:"6–7 PM",items:["Mahi-mahi (5 oz) with mango-avocado salsa + coconut rice + grilled zucchini","Chamomile tea"]}
 ],smoothie:{name:"Pear Strength",i:["1 ripe pear (cored)","1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp ginger","1 tsp honey","½ tsp turmeric"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 12":{cal:"2,540",p:"132g",c:"285g",f:"70g",
 note:"Day 79 — Phase 3 final stretch begins. Your PT has watched you transform over 12 weeks. Let them see it today.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Mahi-mahi tacos (2): grilled mahi + corn tortillas + mango-cucumber salsa + lime + shredded purple cabbage","Hibiscus iced tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground turkey stuffed peppers: bell peppers filled with seasoned turkey + wild rice + diced tomatoes + herbs","Decaf green tea"]}
 ],smoothie:{name:"Pomegranate Ascended",i:["½ cup pomegranate arils","½ cup frozen cherries","1 cup coconut water","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp flaxseed"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 13":{cal:"2,660",p:"150g",c:"315g",f:"75g",
 note:"Day 80 — Lower body peak Phase 3. Heaviest loads of the entire journey. Personal records today.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Quinoa porridge: cooked quinoa + almond milk + cinnamon + walnuts + blueberries + agave","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp stir fry: jumbo shrimp (6 oz) + brown rice (1 cup) + snap peas + bell peppers + garlic-tamari sauce","Cucumber water"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Greek yogurt (dairy-light: coconut yogurt) + honey + walnuts + berries"]},
  {name:"Dinner",time:"6–7 PM",items:["Scallop and asparagus: pan-seared scallops (5 oz) + roasted asparagus + wild rice + lemon butter (light dairy)","Sparkling water with lemon"]}
 ],smoothie:{name:"Papaya Strength",i:["1 cup frozen papaya","½ cup frozen mango","1 cup coconut milk","1 scoop vanilla protein","1 tsp ginger","1 tsp turmeric","1 tbsp honey"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 14":{cal:"2,600",p:"150g",c:"315g",f:"75g",
 note:"Day 81 — Core and arms giant set. 4 exercises, no rest between them. Advanced protocol.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon rice bowl: grilled salmon (6 oz) + jasmine rice (1.25 cups) + edamame + avocado + sesame-ginger dressing","Sparkling water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["Post-Workout: Protein shake in almond milk (1 scoop) + 4 oz tart cherry juice"]},
  {name:"Dinner",time:"6–7 PM",items:["Cod with herb crust (5 oz) + sweet potato mash + green beans almondine","Peppermint tea"]}
 ],smoothie:{name:"Goddess Ascension",i:["1 cup frozen acai","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp honey","fresh mint"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 15":{cal:"2,530",p:"132g",c:"285g",f:"70g",
 note:"Day 82 — Post-lower-body-peak PT. You just moved the heaviest weights of your life. Honor the recovery.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole grain toast (2 slices) + smashed avocado + cherry tomatoes + everything bagel seasoning","Smoothie: spinach + mango + almond milk + protein powder"]},
  {name:"Lunch",time:"12–1 PM",items:["Salmon + quinoa: baked salmon (5 oz) + quinoa (1 cup) + steamed broccoli + lemon-dill dressing","Ginger tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken stir fry: chicken breast strips + broccoli + snap peas + carrots + jasmine rice + oyster sauce + ginger","Cucumber water"]}
 ],smoothie:{name:"Cherry Bomb Recovery",i:["1 cup frozen dark cherries","4 oz tart cherry juice","1 cup coconut water","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 16":{cal:"2,340",p:"125g",c:"260g",f:"66g",
 note:"Day 83 — 76 days. Phase 3 week 3 rest. You are 2 weeks from finishing something most people never start.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Sweet potato hash: diced sweet potato + bell peppers + black beans + cumin, sautéed in olive oil","Fruit cup: watermelon + grapes + orange slices"]},
  {name:"Lunch",time:"12–1 PM",items:["Shrimp + grits: sautéed shrimp + creamy grits (dairy-light: coconut milk based) + roasted tomatoes + scallions","Sparkling water with lime"]},
  {name:"Dinner",time:"6–7 PM",items:["Turkey meatballs: turkey meatballs in tomato sauce + whole wheat spaghetti + side salad (mixed greens + vinaigrette)","Chamomile tea"]}
 ],smoothie:{name:"Dragon Fruit Power",i:["1 packet frozen dragon fruit","½ cup frozen strawberries","1 cup coconut water","1 scoop vanilla protein","1 tbsp chia","½ lime juiced"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 17":{cal:"2,540",p:"132g",c:"285g",f:"70g",
 note:"Day 84 — Pre-Goddess Ascended PT. The finale is tomorrow. One last PT session to prepare your body to finish at full power.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Açaí bowl: açaí base + granola + mixed berries + mango chunks + coconut flakes + honey","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken soup: homemade chicken broth + chunks of chicken breast + rice noodles + ginger + bok choy + green onions","Chamomile tea with honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Crab cakes (2 small): lump crab + breadcrumbs + old bay seasoning + baked, served with remoulade + corn + slaw","Hibiscus tea"]}
 ],smoothie:{name:"Golden Goddess",i:["1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp turmeric","1 tsp ginger","1 tbsp honey","coconut flakes (garnish)"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 18":{cal:"2,600",p:"150g",c:"315g",f:"75g",
 note:"Day 85 — Lower body Phase 3 celebration. Final leg day. Hit your numbers.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Whole wheat pancakes (2) with mixed berry compote + maple syrup","Orange juice (fresh squeezed)"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey meatball pasta: whole wheat spaghetti (1.5 cups) + lean turkey meatballs + marinara + parmesan (light)","Water with lemon"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Mixed nuts (almonds, cashews, walnuts) + dark chocolate (1 oz, 70%+)"]},
  {name:"Dinner",time:"6–7 PM",items:["Salmon rice bowl: teriyaki glazed salmon (5 oz) + brown rice + edamame + shredded carrots + sesame-ginger sauce","Green tea (decaf)"]}
 ],smoothie:{name:"Plum Power",i:["2 fresh plums (pitted)","1 cup frozen blueberries","1 cup almond milk","1 scoop chocolate protein","1 tbsp flaxseed","½ tsp cinnamon"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 19":{cal:"2,530",p:"132g",c:"285g",f:"70g",
 note:"Day 86 — Post-tempo leg PT. Eccentric training creates more soreness — PT today is essential.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Oatmeal with sliced peaches + almonds + cinnamon + brown sugar + almond milk","Matcha latte"]},
  {name:"Lunch",time:"12–1 PM",items:["Ground turkey bowl: seasoned turkey + brown rice + roasted sweet potato + black beans + avocado + salsa","Peppermint tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Chicken tikka (dairy-light): chicken breast in spiced tomato-coconut milk sauce + basmati rice + naan bread (1 piece)","Cardamom tea"]}
 ],smoothie:{name:"Melon Recovery",i:["1.5 cups honeydew melon","½ cup cucumber","1 cup coconut water","1 scoop vanilla protein","fresh mint","1 tsp honey","lime juice"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 20":{cal:"2,720",p:"150g",c:"315g",f:"75g",
 note:"Day 87 — Core sculpt day. Ab wheel rollouts, hollow holds, L-sits. The deepest core work of the 90 days.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Corn tortilla (2) + black bean spread + sautéed peppers + salsa + avocado slices","Mango smoothie: mango + almond milk + turmeric"]},
  {name:"Lunch",time:"12–1 PM",items:["Crab fried rice: lump crab meat (4 oz) + fried rice (no egg — flax egg substitute) + peas + carrots + sesame oil + soy sauce","Hibiscus tea"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Edamame (1 cup, salted) + sparkling water with lime"]},
  {name:"Dinner",time:"6–7 PM",items:["Baked mahi-mahi (5 oz) + garlic butter broccolini + jasmine rice + cherry tomato salad","Chamomile tea"]}
 ],smoothie:{name:"Pomegranate Ascended",i:["½ cup pomegranate arils","½ cup frozen cherries","1 cup coconut water","1 scoop chocolate protein","4 oz tart cherry juice","1 tbsp flaxseed"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 21":{cal:"2,660",p:"150g",c:"315g",f:"75g",
 note:"Day 88 — Phase 3 begins. Goddess Peak. Tempo training, drop sets, peak volume. Every rep intentional.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Rice cake (2) + almond butter alternative (sunflower butter) + honey + sliced strawberries","Protein shake: vanilla protein + almond milk + ice"]},
  {name:"Lunch",time:"12–1 PM",items:["Chicken breast stir fry: sliced chicken (6 oz) + lo mein noodles + mixed veggies + teriyaki sauce","Water with mint"]},
  {name:"Post-Workout",time:"Within 30 min",items:["PM Snack: Hummus (¼ cup) + cucumber slices + baby carrots + pita triangles (1)"]},
  {name:"Dinner",time:"6–7 PM",items:["Shrimp fried rice: shrimp + fried rice (flax egg) + peas + carrots + scallions + sesame oil + soy sauce","Sparkling water"]}
 ],smoothie:{name:"Triple Berry Peak",i:["⅓ cup frozen strawberries","⅓ cup frozen blueberries","⅓ cup frozen raspberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia","1 tsp honey"]},
 tea:"🍵 AM: Matcha (focus + sustained energy for training)  ·  PM: Tart cherry tea (4 oz tart cherry juice + warm water — accelerates muscle recovery)",
 soup:null},
"Sep 22":{cal:"2,510",p:"132g",c:"285g",f:"70g",
 note:"Day 89 — Phase 3 Week 2 PT. 20 sessions in this phase completed. The consistency is your superpower.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Smoothie bowl: frozen mixed berries + spinach + protein powder + almond milk, topped with granola + kiwi + coconut","Green tea"]},
  {name:"Lunch",time:"12–1 PM",items:["Grilled chicken breast (5 oz) + wild rice (1 cup) + roasted vegetables (zucchini, squash, peppers) + olive oil","Anti-inflammatory golden milk: turmeric + almond milk + ginger + honey"]},
  {name:"Dinner",time:"6–7 PM",items:["Ground beef (lean 90/10) tacos (2): seasoned beef + corn tortillas + shredded lettuce + tomato + avocado + salsa","Agua fresca"]}
 ],smoothie:{name:"Pear Strength",i:["1 ripe pear (cored)","1 cup frozen mango","1 cup almond milk","1 scoop vanilla protein","1 tsp ginger","1 tsp honey","½ tsp turmeric"]},
 tea:"🍵 AM: Ginger lemon tea (anti-inflammatory + digestion)  ·  PM: Chamomile with honey (parasympathetic recovery, sleep prep)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"},
"Sep 23":{cal:"2,250",p:"125g",c:"260g",f:"66g",
 note:"Day 90 — 90 DAYS. DONE. Take your final progress photos. Compare Day 1 to Day 90. The Goddess showed up, every single day.",
 meals:[
  {name:"Breakfast",time:"7–8 AM",items:["Overnight oats: rolled oats + almond milk + mixed berries + honey + chia seeds","Green tea or matcha latte (oat milk)"]},
  {name:"Lunch",time:"12–1 PM",items:["Turkey chili (no bean version): ground turkey + diced tomatoes + bell pepper + corn + cumin + chili powder + served over rice","Hibiscus tea"]},
  {name:"Dinner",time:"6–7 PM",items:["Lemon herb salmon (6 oz) + roasted garlic potatoes + sautéed spinach with garlic and olive oil","Decaf chamomile tea"]}
 ],smoothie:{name:"Goddess Ascension",i:["1 cup frozen acai","½ cup frozen blueberries","1 cup almond milk","1 scoop vanilla protein","1 tbsp chia seeds","1 tsp honey","fresh mint"]},
 tea:"🍵 AM: Turmeric golden milk (inflammation control)  ·  PM: Lavender chamomile (deep rest, muscle repair + fibromyalgia support)",
 soup:"Turmeric ginger bone broth (1 cup) — anti-inflammatory powerhouse for fibromyalgia management"}
};
;

const MEAL_COLORS = ["#c9a84c","#7a9b76","#e8849a","#b06ac8","#74b3ce"];

/* ════════════ COMPONENT ════════════ */
/* ── Access Code (change this to update the client password) ── */
const AUTH_CODE = "gLoVe060626";
const AUTH_KEY  = "gb-auth-v1";

export default function GoddessBody() {
  const [tab,       setTab]       = useState("plan");

  /* ── Auth state ── */
  const [isAuth,    setIsAuth]    = useState(() => {
    try { return localStorage.getItem(AUTH_KEY) === "true"; } catch { return false; }
  });
  const [authInput, setAuthInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authShake, setAuthShake] = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [lightbox,  setLightbox]  = useState(null);

  const handleAuth = () => {
    if (authInput.trim().toLowerCase() === AUTH_CODE.toLowerCase()) {
      try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
      setIsAuth(true);
    } else {
      setAuthError(true);
      setAuthShake(true);
      setTimeout(() => setAuthShake(false), 600);
      setTimeout(() => setAuthError(false), 2500);
      setAuthInput("");
    }
  };
  const [gymMode,   setGymMode]   = useState(() => { try { const s = localStorage.getItem('gb-gym-mode'); return s === null ? true : s === 'true'; } catch { return true; } });
  const [selDay,    setSelDay]    = useState(null);
  const [openWeek,  setOpenWeek]  = useState(1);
  const [nutDate,   setNutDate]   = useState(null);
  const [flareMode, setFlareMode] = useState(() => { try { const s = localStorage.getItem('gb-flare-mode'); return s ? JSON.parse(s) : {}; } catch { return {}; } });

  const toggleFlare = (date, e) => {
    e.stopPropagation();
    setFlareMode(prev => {
      const updated = {...prev, [date]: !prev[date]};
      try { localStorage.setItem('gb-flare-mode', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  /* ── Start date (localStorage) ── */
  const [startDate, setStartDate] = useState(() => {
    try {
      const s = localStorage.getItem('gb-start-date');
      if (s) { const d = new Date(s); if (!isNaN(d.getTime())) return d; }
    } catch {}
    return null;
  });

  const handleStart = () => {
    const t = new Date(); t.setHours(0,0,0,0);
    try { localStorage.setItem('gb-start-date', t.toISOString()); } catch {}
    setStartDate(t); setSelDay(null); setNutDate(null);
  };
  const handleReset = () => {
    if (!window.confirm('Reset your start date? This cannot be undone.')) return;
    try { localStorage.removeItem('gb-start-date'); } catch {}
    setStartDate(null); setSelDay(null); setNutDate(null);
  };

  /* ── Day completion tracking ── */
  const [completions, setCompletions] = useState(() => {
    try { const s = localStorage.getItem('gb-completions'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [lockFlash, setLockFlash] = useState(null);

  const markDay = (date, status, e) => {
    e.stopPropagation();
    const updated = { ...completions };
    if (status === undefined) { delete updated[date]; }
    else { updated[date] = status; }
    setCompletions(updated);
    try { localStorage.setItem('gb-completions', JSON.stringify(updated)); } catch {}
  };

  const isLocked = (idx) => {
    if (!startDate) return idx > 0;
    if (idx === 0) return false;
    // Phase gates: Phase 2 (idx>=30) unlocks after 30 days in, Phase 3 (idx>=60) after 60
    if (idx >= 60 && daysIn < 60) return true;
    if (idx >= 30 && idx < 60 && daysIn < 30) return true;
    const prev = allDays[idx - 1];
    return !completions[prev?.date];
  };

  const phaseOf = (idx) => idx < 30 ? 1 : idx < 60 ? 2 : 3;
  const phaseUnlocked = (ph) => {
    if (ph === 1) return !!startDate;
    if (ph === 2) return startDate && daysIn >= 30;
    if (ph === 3) return startDate && daysIn >= 60;
    return false;
  };

  const handleLockedClick = (prevDate) => {
    setLockFlash(prevDate);
    setTimeout(() => setLockFlash(null), 2500);
  };

  const confirmText = (d) => {
    if (d.type === 'REST') return "Did you take your full rest day? 😌";
    if (d.type === 'PT + Yoga') return "Did you complete your PT + Yoga session? 🧘🏾";
    return "Was this workout smashed!? 💪🏾";
  };

  const calDate = (key) => {
    const idx = _DATE_INDEX[key];
    if (idx === undefined || !startDate) return key ?? '';
    const d = new Date(startDate); d.setDate(d.getDate() + idx);
    return `${MO[d.getMonth()]} ${d.getDate()}`;
  };
  const calWD = (key) => {
    const idx = _DATE_INDEX[key];
    if (idx === undefined || !startDate) return allDays[idx ?? 0]?.wd ?? '';
    const d = new Date(startDate); d.setDate(d.getDate() + idx);
    return WD[d.getDay()];
  };
  const calRange = (s, e) => {
    const sd = allDays[s]?.date, ed = allDays[e]?.date;
    return (sd && ed) ? `${calDate(sd)} – ${calDate(ed)}` : '';
  };
  const heroRange = () => {
    if (!startDate) return 'Jun 26 – Sep 23, 2026 · Starting Friday';
    const end = new Date(startDate); end.setDate(end.getDate() + 89);
    const fmt = d => `${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    return `${fmt(startDate)} – ${fmt(end)}`;
  };

  const _diff = startDate ? (() => { const n=new Date(); n.setHours(0,0,0,0); return Math.round((n-startDate)/86400000); })() : -999;
  const todayIdx = (_diff >= 0 && _diff <= 89) ? _diff : -1;
  const daysIn   = Math.max(0, Math.min(90, startDate ? _diff + 1 : 0));

  /* ── Nutrition computed ── */
  const _activeDate = nutDate ?? selDay?.date ?? null;
  const _nd         = _activeDate ? (DN[_activeDate] || null) : null;
  const _nutIdx     = _activeDate ? _ALL_DATES.indexOf(_activeDate) : -1;
  const _nutPlanDay = _nutIdx >= 0 ? allDays[_nutIdx] : null;
  const _nutDayNum  = _nutIdx + 1;
  const _prevDate   = _nutIdx > 0 ? _ALL_DATES[_nutIdx - 1] : null;
  const _nextDate   = _nutIdx < _ALL_DATES.length - 1 ? _ALL_DATES[_nutIdx + 1] : null;
  const _isSynced   = !nutDate && !!selDay;

  const mode = gymMode ? "gym" : "home";

  /* ── Colors ── */
  const PLUM   = "#8B2FA8";
  const SAGE   = "#7A9B76";
  const PINK   = "#E8849A";
  const GOLD   = "#C9A84C";

  if (!isAuth) return (
    <div style={{minHeight:"100vh",width:"100vw",maxWidth:"100%",background:"#0a0312",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"'Jost',sans-serif",overflowX:"hidden",boxSizing:"border-box"}}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",alignItems:"center",boxSizing:"border-box"}}>
        <img src="/logo.png" alt="Goddess Body" style={{width:90,height:90,borderRadius:18,objectFit:"cover",marginBottom:24,boxShadow:"0 8px 32px rgba(139,47,168,0.4)"}}/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:1.5,color:GOLD,textTransform:"uppercase",marginBottom:8,textAlign:"center",width:"100%",whiteSpace:"nowrap"}}>Made for Coco Love · M.J. Colbert</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,color:"#f0ebe0",marginBottom:4,textAlign:"center",lineHeight:1.1,width:"100%"}}>Goddess Body</h1>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:"italic",color:PINK,marginBottom:36}}>Fitness Plan</p>
        <div style={{width:"100%",animation:authShake?"shake 0.5s ease":"none"}}>
          <div style={{position:"relative",width:"100%",marginBottom:8}}>
            <input type={showPass?"text":"password"} placeholder="Enter your access code" value={authInput}
              onChange={e=>setAuthInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleAuth()}
              style={{width:"100%",padding:"14px 48px 14px 18px",background:"rgba(255,255,255,0.05)",
                border:authError?"1px solid #E8849A":"1px solid #3a1a4a",
                borderRadius:12,color:"#f0ebe0",fontSize:15,
                fontFamily:"'Jost',sans-serif",letterSpacing:2,outline:"none",
                boxSizing:"border-box",textAlign:"center"}}/>
            <button onClick={()=>setShowPass(p=>!p)}
              style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",padding:4,
                color:showPass?"#C9A84C":"#5a3a6a",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {showPass
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {authError&&<p style={{color:PINK,fontSize:12,textAlign:"center",marginBottom:8}}>Incorrect access code. Try again.</p>}
        </div>
        <button onClick={handleAuth} style={{width:"100%",padding:"14px 0",marginTop:4,
          background:`linear-gradient(135deg,${GOLD},#a8883a)`,border:"none",borderRadius:12,
          color:"#0a0312",fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:15,
          letterSpacing:0.5,cursor:"pointer",boxShadow:"0 4px 20px rgba(201,168,76,0.35)"}}>
          👑 Welcome Goddess
        </button>
        <p style={{fontSize:10,color:"#3a1a4a",marginTop:24,letterSpacing:1,textTransform:"uppercase",textAlign:"center",width:"100%",lineHeight:1.5}}>
          Private · Custom Plan · Coco Love The Goddess
        </p>
        <p style={{fontSize:9,color:"#2a0a3a",marginTop:12,letterSpacing:1,textTransform:"uppercase",textAlign:"center",width:"100%"}}>
          Created by Martyy B Media
        </p>
      </div>
    </div>
  );

  return (
    <div style={{background:"#0a0312",minHeight:"100vh",width:"100%",fontFamily:"'Jost',sans-serif",color:"#e2ddd3",overflowX:"hidden"}}>
      <style>{STYLE_TAG}</style>

      {/* ── HERO ── */}
      <div style={{background:"linear-gradient(135deg,#1a0824 0%,#120618 50%,#0a0312 100%)",borderBottom:"1px solid #3a1a4a",padding:"26px 20px 0"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>

          {/* Logo + Title */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <img src="/logo.png" alt="Goddess Body" style={{width:52,height:52,borderRadius:10,flexShrink:0,objectFit:"cover",boxShadow:"0 4px 16px rgba(139,47,168,0.3)"}} />
            <div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:10,letterSpacing:6,color:GOLD,textTransform:"uppercase",marginBottom:4}}>Coco Love The Goddess · M.J. Colbert</p>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,5vw,40px)",fontWeight:600,lineHeight:1.1,color:"#f0ebe0"}}>
                Goddess Body<br/><em style={{fontWeight:400,color:PINK}}>Fitness Plan</em>
              </h1>
            </div>
          </div>

          <p style={{color:"#9a7aaa",fontSize:11,letterSpacing:1,marginBottom:12}}>{heroRange()}</p>

          {/* Goal callout */}
          <div style={{background:"rgba(232,132,154,0.07)",border:"1px solid rgba(232,132,154,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8}}>
            <span style={{flexShrink:0}}>🎯</span>
            <p style={{fontSize:11,color:"#d4a0b0",lineHeight:1.7}}>
              <strong style={{color:PINK}}>Goal:</strong> Weight gain + toning — 133 → 150 lbs of lean muscle. Abs, glutes, thighs. Teyana Taylor + Kehlani physique.
              Built around PT (M/W/F) + Yoga + 3 strength sessions/week. Fibromyalgia-safe. Shoulder-protected. Whole foods.
            </p>
          </div>

          {/* Stats */}
          <div style={{marginBottom:0}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {[["Height","5'3½\""],["Weight","133 lbs"],["Goal","150 lbs"],["Sessions","3×/week"]].map(([k,v])=>(
                <div key={k} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #3a1a4a",borderRadius:8,padding:"7px 12px"}}>
                  <div style={{fontSize:9,color:"#7a5a8a",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#e8e0d0"}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Primary Cardio */}
            <div style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${gymMode?"#3a1a4a":"#1a3040"}`,borderRadius:10,padding:"10px 14px",marginBottom:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:9,color:"#7a5a8a",letterSpacing:2,textTransform:"uppercase"}}>Primary Cardio</span>
                <span style={{fontSize:10,color:gymMode?SAGE:PINK,fontWeight:600}}>{gymMode?"🏋🏾 Gym":"🏠 Home"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {(gymMode ? [
                  {icon:"🪜",name:"Stairmaster",    tag:"Glutes + Cardio",    note:"Her signature machine — activates glutes on every step while burning fat."},
                  {icon:"🚶🏾‍♀️",name:"Incline Walk",  tag:"Low Impact + Glutes",note:"Fibromyalgia-friendly cardio that keeps posterior chain active without joint stress."},
                  {icon:"🚴🏾‍♀️",name:"Stationary Bike",tag:"Recovery Cardio",  note:"Gentlest gym cardio option — perfect for fibromyalgia days and post-heavy sessions."},
                ] : [
                  {icon:"🚶🏾‍♀️",name:"Brisk Walk",     tag:"Daily Movement",    note:"Most accessible, fibromyalgia-friendly cardio. Fresh air + vitamin D support her supplement routine."},
                  {icon:"🪜",name:"Stair Walking", tag:"Home Stairmaster",  note:"Uses any available stairs — same glute activation as the gym stairmaster."},
                  {icon:"🌿",name:"Yoga Walk",     tag:"Mindful Cardio",    note:"Slow intentional walking with breath work — bridges yoga practice and cardiovascular movement."},
                ]).map(c=>(
                  <div key={c.name} style={{background:gymMode?"rgba(139,47,168,0.05)":"rgba(232,132,154,0.05)",border:`1px solid ${gymMode?"#3a1a4a":"#3a1a2a"}`,borderRadius:8,padding:"9px 10px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                      <span style={{fontSize:16}}>{c.icon}</span>
                      <div>
                        <p style={{fontSize:11,fontWeight:600,color:"#e0d8cc",lineHeight:1.2}}>{c.name}</p>
                        <p style={{fontSize:9,color:gymMode?SAGE:PINK,letterSpacing:0.5,marginTop:1}}>{c.tag}</p>
                      </div>
                    </div>
                    <p style={{fontSize:10,color:"#7a8a7e",lineHeight:1.6}}>{c.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start / Status Panel */}
        <div style={{maxWidth:760,margin:"0 auto",padding:"14px 0 20px"}}>
          {!startDate ? (
            <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04))",border:"1px solid rgba(201,168,76,0.35)",borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:"#f0ebe0",marginBottom:3}}>Ready to begin your Goddess Body journey?</p>
                <p style={{fontSize:11,color:"#9a8a7a",lineHeight:1.6}}>
                  Built for Jun 26 — tap to start fresh <em style={{color:GOLD}}>from today</em>. All 30 days update automatically.
                </p>
              </div>
              <button onClick={handleStart} style={{background:`linear-gradient(135deg,${GOLD},#a8883a)`,border:"none",borderRadius:10,padding:"11px 22px",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:13,color:"#0a0312",letterSpacing:0.5,flexShrink:0,boxShadow:"0 4px 14px rgba(201,168,76,0.3)",whiteSpace:"nowrap"}}>
                👑 Begin Building Goddess Body
              </button>
            </div>
          ) : (
            <div style={{background:"rgba(139,47,168,0.07)",border:"1px solid #3a1a4a",borderRadius:12,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>✅</span>
                <div>
                  <p style={{fontSize:12,fontWeight:600,color:SAGE,marginBottom:2}}>
                    Goddess Body Active · Day {Math.min(daysIn,90)} of 90
                    {todayIdx>=0&&<span style={{marginLeft:8,fontSize:10,color:GOLD,background:"rgba(201,168,76,0.12)",padding:"1px 8px",borderRadius:6}}>Today: Day {todayIdx+1}</span>}
                  </p>
                  <p style={{fontSize:11,color:"#7a5a8a"}}>
                    Started {startDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                    {daysIn>0&&daysIn<=30&&` · ${daysIn} day${daysIn===1?'':'s'} in`}
                    {daysIn>=90&&' · 90 days complete 👑'}
                  </p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:90,height:6,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,(daysIn/90)*100)}%`,background:daysIn>=90?`linear-gradient(90deg,${GOLD},${PINK})`:`linear-gradient(90deg,${PLUM},${PINK})`,borderRadius:4}}/>
                </div>
                {daysIn>=90
                  ? <span style={{fontSize:11,color:GOLD,fontWeight:600}}>👑 Complete!</span>
                  : <button onClick={handleReset} style={{background:"none",border:"1px solid #3a1a4a",borderRadius:8,color:"#5a3a6a",fontSize:11,padding:"5px 12px",cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>Reset</button>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── STICKY NAV ── */}
      <div style={{borderBottom:"1px solid #2a0a3a",background:"#080210",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:760,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",paddingRight:16}}>
          <div style={{display:"flex"}}>
            {[["plan","📅 Plan"],["nutrition","🥗 Nutrition"],["tips","💡 Goddess Guide"]].map(([id,label])=>(
              <button key={id} onClick={()=>{ setTab(id); if(id==="nutrition"&&selDay) setNutDate(null); }}
                style={{background:"none",border:"none",borderBottom:tab===id?`2px solid ${GOLD}`:"2px solid transparent",
                  color:tab===id?GOLD:"#7a5a8a",padding:"13px 14px",fontSize:11,fontWeight:500,
                  cursor:"pointer",fontFamily:"'Jost',sans-serif",opacity:tab===id?1:0.7,letterSpacing:0.5}}>
                {label}
              </button>
            ))}
          </div>
          {/* Gym / Home Toggle */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"#5a3a6a",letterSpacing:1,textTransform:"uppercase"}}>Mode</span>
            <button onClick={()=>{ const next=!gymMode; try{localStorage.setItem('gb-gym-mode',String(next));}catch{} setGymMode(next);setSelDay(null);}}
              style={{display:"flex",alignItems:"center",background:"#120618",border:"1px solid #3a1a4a",
                borderRadius:20,padding:"3px",cursor:"pointer",position:"relative",width:88,height:30}}>
              <div className="toggle-pill" style={{position:"absolute",top:3,left:gymMode?3:45,width:40,height:22,borderRadius:16,
                background:gymMode?"#2a0a3a":"#1a0824",border:`1px solid ${gymMode?PLUM:PINK}`,transition:"left 0.25s"}}/>
              <span style={{position:"relative",zIndex:1,fontSize:13,width:44,textAlign:"center",opacity:gymMode?1:0.4}}>🏋🏾</span>
              <span style={{position:"relative",zIndex:1,fontSize:13,width:44,textAlign:"center",opacity:gymMode?0.4:1}}>🏠</span>
            </button>
            <span style={{fontSize:11,fontWeight:600,color:gymMode?SAGE:PINK,letterSpacing:0.5,minWidth:34}}>{gymMode?"GYM":"HOME"}</span>
          </div>
        </div>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px 60px"}}>

        {/* ── PLAN TAB ── */}
        {tab==="plan" && (
          <div>
            {/* Mode banner */}
            <div style={{background:gymMode?"rgba(139,47,168,0.06)":"rgba(232,132,154,0.06)",border:`1px solid ${gymMode?"#3a1a4a":"#4a1a2a"}`,borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>{gymMode?"🏋🏾":"🏠"}</span>
              <div>
                <p style={{fontSize:12,fontWeight:600,color:gymMode?SAGE:PINK,marginBottom:2}}>{gymMode?"GYM Mode — Equipment-Based":"HOME Mode — Kettlebell + Bands"}</p>
                <p style={{fontSize:11,color:"#5a3a6a"}}>{gymMode?"Standard gym · Machines · Stairmaster · Treadmill":"10 lb kettlebell · Resistance bands · Chair/Couch"}</p>
              </div>
            </div>

            {/* Lock flash notification */}
            {lockFlash&&(
              <div style={{background:"rgba(90,58,106,0.3)",border:"1px solid #5a3a6a",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🔒</span>
                <p style={{fontSize:12,color:"#c4a0d4",lineHeight:1.5}}>
                  <strong style={{color:GOLD}}>{calDate(lockFlash)}</strong> hasn't been confirmed yet — mark that day complete or skipped first to unlock this day.
                </p>
              </div>
            )}

            {/* Legend */}
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
              {[["🍑","Lower Body"],["💪🏾","Core/Arms"],["⚡","Full Body"],["🧘🏾","PT + Yoga"],["😴","Rest"],["🌸","Flare Mode"]].map(([ic,lb])=>(
                <span key={lb} style={{fontSize:10,color:"#5a3a6a"}}>{ic} {lb}</span>
              ))}
            </div>

            {[{wm:weekMeta[0],r:[0,6]},{wm:weekMeta[1],r:[7,13]},{wm:weekMeta[2],r:[14,20]},{wm:weekMeta[3],r:[21,29]}].map(({wm,r})=>{
              const days = allDays.filter(d=>d.week===wm.num);
              return(
                <div key={wm.num} style={{marginBottom:14}}>
                  <div className="week-hdr" onClick={()=>setOpenWeek(openWeek===wm.num?null:wm.num)}
                    style={{background:openWeek===wm.num?"#1e0828":"#140618",border:"1px solid #3a1a4a",
                      borderRadius:openWeek===wm.num?"12px 12px 0 0":"12px",padding:"14px 18px",
                      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:"#f0ebe0"}}>Week {wm.num}</span>
                      <span style={{marginLeft:9,fontSize:11,color:GOLD,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>{wm.theme}</span>
                      <span style={{marginLeft:9,fontSize:11,color:"#5a3a6a"}}>{calRange(r[0],r[1])}</span>
                    </div>
                    <span style={{color:"#5a3a6a"}}>{openWeek===wm.num?"▾":"▸"}</span>
                  </div>

                  {openWeek===wm.num&&(
                    <div style={{border:"1px solid #3a1a4a",borderTop:"none",borderRadius:"0 0 12px 12px",overflow:"hidden"}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:1,background:"#3a1a4a"}}>
                        {days.map(d=>{
                          const ts   = TS[d.type]||TS["REST"];
                          const isSel= selDay?.date===d.date;
                          const dn   = allDays.findIndex(d2=>d2.date===d.date)+1;
                          const w    = d[mode] || d.gym;
                          const roll = (() => {
                            const grp  = getCardioGroup(d.type);
                            const pool = CARDIO_POOLS[grp]?.[mode] || [];
                            if (!pool.length) return null;
                            const seed = dn * (mode==="gym"?7:13);
                            return pool[seed % pool.length];
                          })();
                          const isToday   = todayIdx===dn-1;
                          const isFlareDy = !!flareMode[d.date];

                          return(
                            <div key={d.date} className="day-card"
                              onClick={()=>{ if(isSel){setSelDay(null);}else if(isLocked(dn-1)){handleLockedClick(allDays[dn-2]?.date);}else{setSelDay(d);setOpenWeek(d.week);} }}
                              style={{
                                gridColumn: isSel?"1 / -1":"auto",
                                background: isSel ? (isFlareDy?"#240a18":ts.bg) : isToday?"#1a0826":"#100418",
                                border: isSel?`1px solid ${isFlareDy?"#7a2a4a":ts.border}`:isToday?"1px solid #5a2a7a":"none",
                                borderLeft: isToday&&!isSel?`3px solid ${PLUM}`:`3px solid ${ts.badge}`,
                                padding: isSel?"18px 20px 22px":"12px",
                                cursor:"pointer",margin:isSel?"1px":0,
                                borderRadius:isSel?8:0,transition:"padding 0.15s",
                              }}>

                              {/* Card header */}
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:isSel?16:4}}>
                                <div>
                                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:isSel?4:0}}>
                                    <span style={{fontSize:10,color:"#5a3a6a"}}>{calWD(d.date)}</span>
                                    <span style={{fontSize:13,fontWeight:600,color:isToday&&!isSel?PLUM:"#e8e0d0"}}>{calDate(d.date)}</span>
                                    {isToday&&!isSel&&<span style={{fontSize:9,color:PLUM,background:"rgba(139,47,168,0.15)",padding:"1px 7px",borderRadius:6,fontWeight:600}}>TODAY</span>}
                                    {!isSel&&completions[d.date]==="yes"&&<span style={{fontSize:9,color:"#4caf6a",background:"rgba(76,175,106,0.15)",padding:"1px 7px",borderRadius:6,fontWeight:600}}>✅ Done</span>}
                                    {!isSel&&completions[d.date]==="no"&&<span style={{fontSize:9,color:"#888",background:"rgba(255,255,255,0.06)",padding:"1px 7px",borderRadius:6,fontWeight:600}}>⏭ Skipped</span>}
                                    {!isSel&&isLocked(dn-1)&&!completions[d.date]&&<span style={{fontSize:9,color:"#5a3a6a",background:"rgba(255,255,255,0.04)",padding:"1px 7px",borderRadius:6}}>🔒</span>}
                                    {isSel&&<>
                                      <span style={{fontSize:10,color:ts.badge,letterSpacing:2,textTransform:"uppercase"}}>· Day {dn} of 30</span>
                                      <span style={{fontSize:10,background:gymMode?"rgba(122,155,118,0.15)":"rgba(232,132,154,0.15)",color:gymMode?SAGE:PINK,padding:"1px 8px",borderRadius:8,fontWeight:600}}>
                                        {gymMode?"🏋🏾 GYM":"🏠 HOME"}
                                      </span>
                                      {isFlareDy&&<span style={{fontSize:10,background:"rgba(232,132,154,0.2)",color:PINK,padding:"1px 8px",borderRadius:8,fontWeight:600}}>🌸 FLARE MODE</span>}
                                    </>}
                                  </div>
                                  <div style={{fontSize:10,color:isFlareDy&&isSel?PINK:ts.badge,fontWeight:600,letterSpacing:0.3,textTransform:"uppercase",lineHeight:1.4}}>
                                    {isFlareDy&&isSel?"Gentle Flare Protocol":d.type}
                                  </div>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                                  <span style={{fontSize:isSel?22:14}}>{isFlareDy&&isSel?"🌸":ts.icon}</span>
                                  {isSel&&<button onClick={e=>{e.stopPropagation();setSelDay(null);}}
                                    style={{background:"rgba(255,255,255,0.07)",border:"none",color:"#aaa",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
                                </div>
                              </div>

                              {/* Expanded content */}
                              {isSel&&(
                                <div onClick={e=>e.stopPropagation()}>

                                  {/* 🌸 Flare toggle — workout days only */}
                                  {d.workout&&(
                                    <button className="flare-btn" onClick={e=>toggleFlare(d.date,e)}
                                      style={{
                                        width:"100%",marginBottom:14,padding:"9px 16px",cursor:"pointer",
                                        background:isFlareDy?"rgba(232,132,154,0.15)":"rgba(255,255,255,0.04)",
                                        border:`1px solid ${isFlareDy?PINK:"#3a1a4a"}`,
                                        borderRadius:9,color:isFlareDy?PINK:"#7a5a8a",
                                        fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:500,
                                        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                                        letterSpacing:0.5,
                                      }}>
                                      {isFlareDy
                                        ?"🌸 Flare Mode Active — Tap to return to full workout"
                                        :"🌸 Flare Day? Tap to switch to gentle protocol"}
                                    </button>
                                  )}

                                  {/* 🧘🏾 Yoga Warm-Up — workout days only, not flare */}
                                  {d.workout&&!isFlareDy&&(()=>{
                                    const yogaFlows={
                                      1:"Sun salutations × 3 · Cat-cow × 10 · Child's pose 60s · Gentle hip circles · Pigeon pose 30s ea. · Downward dog hold 30s",
                                      2:"Sun salutations × 5 · Warrior I + II ea. side · Lizard pose 45s ea. · Pigeon pose 45s ea. · Downward dog into plank × 3",
                                      3:"Sun salutations × 5 · Full warrior sequence · Crescent lunge 45s ea. · Deep pigeon 60s ea. · Plank hold 30s · Twisted crescent ea. side",
                                      4:"Sun salutations × 7 · Goddess pose flow · Warrior III ea. side · Deep yin pigeon 90s ea. · Chair pose 45s · Breathe and set intention",
                                    };
                                    return(
                                      <div style={{marginBottom:14,background:"rgba(122,155,118,0.09)",borderRadius:10,padding:"12px 14px",border:`1px solid ${SAGE}44`}}>
                                        <p style={{fontSize:10,color:SAGE,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>🧘🏾 Yoga Warm-Up — Complete This First</p>
                                        <p style={{fontSize:11,color:"#bfcfbb",lineHeight:1.7,marginBottom:4}}>{yogaFlows[d.week]||yogaFlows[1]}</p>
                                        <p style={{fontSize:10,color:"#5a7a56",fontStyle:"italic"}}>15–20 min · Finish the full flow before moving into your strength session.</p>
                                      </div>
                                    );
                                  })()}

                                  {/* Exercise list */}
                                  <div style={{marginBottom:16}}>
                                    <p style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>
                                      {isFlareDy&&d.workout?"Gentle Flare Protocol":"Workout — Sets & Reps"}
                                    </p>
                                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                      {(isFlareDy&&d.workout ? d.flare : w.ex).map((e,i)=>{
                                        const lt=lineType(e);
                                        const bdg=isFlareDy&&d.workout?PINK:ts.badge;
                                        return(
                                          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",
                                            padding:"7px 10px",borderRadius:7,
                                            background:lt==="exercise"?"rgba(255,255,255,0.04)":"transparent",
                                            borderLeft:lt==="exercise"?`2px solid ${bdg}`:lt==="bullet"?`2px solid ${bdg}66`:"2px solid transparent"}}>
                                            {lt==="exercise"&&<span style={{color:bdg,fontSize:13,flexShrink:0,fontWeight:700,marginTop:1}}>→</span>}
                                            {lt==="bullet"&&<span style={{color:bdg,fontSize:13,flexShrink:0,opacity:0.75,marginTop:1}}>•</span>}
                                            {lt==="note"&&<span style={{fontSize:13,flexShrink:0,color:"transparent",marginTop:1}}>→</span>}
                                            <span style={{fontSize:12,color:lt==="exercise"?"#eae4da":lt==="bullet"?"#d4cfc5":"#6a5a7a",lineHeight:1.65}}>
                                              {lt==="bullet"?e.replace(/^•\s*/,""):e}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Cardio + Coach's Note */}
                                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                                    {/* Cardio card */}
                                    {roll ? (
                                      <div style={{background:"rgba(0,0,0,0.28)",borderRadius:10,border:`1px solid ${ts.badge}44`,overflow:"hidden"}}>
                                        <div style={{background:`${ts.badge}18`,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                                            <span style={{fontSize:16}}>{roll.icon}</span>
                                            <div>
                                              <span style={{fontSize:13,fontWeight:600,color:"#eae4da"}}>{roll.name}</span>
                                              <span style={{fontSize:10,color:ts.badge,marginLeft:8,letterSpacing:0.5}}>{roll.dur}</span>
                                              <span style={{fontSize:10,color:"#5a3a6a",marginLeft:6,background:"rgba(255,255,255,0.06)",borderRadius:4,padding:"1px 6px"}}>{roll.intensity}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div style={{padding:"10px 12px"}}>
                                          <p style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Protocol</p>
                                          <p style={{fontSize:12,color:"#d4cfc5",lineHeight:1.65,marginBottom:10}}>{roll.protocol}</p>
                                          <p style={{fontSize:10,color:ts.badge,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Why This Fits Today</p>
                                          <p style={{fontSize:11,color:"#b8b3a8",lineHeight:1.65,fontStyle:"italic"}}>{roll.why}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:8}}>
                                        <span style={{fontSize:16}}>🧘🏾</span>
                                        <p style={{fontSize:12,color:"#5a3a6a"}}>{d.type==="PT + Yoga"?"PT + Yoga is your session today — cardio is embedded.":"Rest day — no cardio. Recovery is the training."}</p>
                                      </div>
                                    )}

                                    {/* Coach's Note */}
                                    <div style={{background:"rgba(0,0,0,0.22)",borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${isFlareDy&&d.workout?PINK:ts.badge}`}}>
                                      <p style={{fontSize:10,color:isFlareDy&&d.workout?PINK:ts.badge,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
                                        {isFlareDy&&d.workout?"Flare Day Note":"Coach's Note"}
                                      </p>
                                      <p style={{fontSize:11,color:"#c8c3b8",lineHeight:1.7,fontStyle:"italic"}}>
                                        {isFlareDy&&d.workout ? d.flareTip : w.tip}
                                      </p>
                                    </div>
                                  </div>

                                  {/* ── Day Confirmation ── */}
                                  <div style={{marginTop:16,borderTop:"1px solid #2a0a3a",paddingTop:14}} onClick={e=>e.stopPropagation()}>
                                    {completions[d.date] ? (
                                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                                          <span style={{fontSize:18}}>{completions[d.date]==="yes"?"✅":"⏭️"}</span>
                                          <p style={{fontSize:12,color:completions[d.date]==="yes"?"#4caf6a":"#888"}}>
                                            {completions[d.date]==="yes"?"Day confirmed — Bet, now keep that same energy! 👑":"Logged as skipped — no guilt, just keep going."}
                                          </p>
                                        </div>
                                        <button onClick={e=>markDay(d.date,undefined,e)}
                                          style={{background:"none",border:"1px solid #3a1a4a",borderRadius:7,color:"#5a3a6a",fontSize:10,padding:"4px 10px",cursor:"pointer",fontFamily:"'Jost',sans-serif",flexShrink:0}}>
                                          Undo
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        <p style={{fontSize:11,color:"#9a7aaa",marginBottom:10,fontWeight:500}}>{confirmText(d)}</p>
                                        <div style={{display:"flex",gap:8}}>
                                          <button onClick={e=>markDay(d.date,"yes",e)}
                                            style={{flex:1,padding:"10px 0",background:"rgba(76,175,106,0.12)",border:"1px solid rgba(76,175,106,0.4)",borderRadius:9,color:"#4caf6a",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",letterSpacing:0.3}}>
                                            ✅  YES!
                                          </button>
                                          <button onClick={e=>markDay(d.date,"no",e)}
                                            style={{flex:1,padding:"10px 0",background:"rgba(255,255,255,0.04)",border:"1px solid #3a1a4a",borderRadius:9,color:"#7a5a8a",fontFamily:"'Jost',sans-serif",fontWeight:500,fontSize:13,cursor:"pointer",letterSpacing:0.3}}>
                                            ❌  Not Today
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── NUTRITION TAB ── */}
        {tab==="nutrition" && (
          <div>
            {!_nd ? (
              <div style={{textAlign:"center",padding:"48px 20px"}}>
                <div style={{fontSize:40,marginBottom:16}}>🥗</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#f0ebe0",marginBottom:10}}>Select a Day to See Its Nutrition</h2>
                <p style={{fontSize:13,color:"#5a3a6a",lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>
                  Go to the <strong style={{color:GOLD}}>📅 Plan</strong> tab, tap any day — then return here to see that day's full nutrition plan synced automatically.
                </p>
              </div>
            ) : (
              <div>
                {/* Day navigator */}
                <div style={{background:"#140618",border:"1px solid #3a1a4a",borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>_prevDate&&setNutDate(_prevDate)}
                    style={{background:_prevDate?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.02)",border:"1px solid #3a1a4a",color:_prevDate?GOLD:"#2a0a3a",borderRadius:8,width:32,height:32,cursor:_prevDate?"pointer":"default",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>‹</button>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#f0ebe0"}}>{calDate(_activeDate)}</span>
                      <span style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase"}}>Day {_nutDayNum} of 30</span>
                      {_isSynced&&<span style={{fontSize:10,background:`rgba(201,168,76,0.12)`,color:GOLD,padding:"2px 8px",borderRadius:8,fontWeight:600}}>📅 Synced with Plan</span>}
                    </div>
                    <div style={{fontSize:11,color:"#7a5a8a",marginTop:2}}>{_nutPlanDay?.type}</div>
                  </div>
                  <button onClick={()=>_nextDate&&setNutDate(_nextDate)}
                    style={{background:_nextDate?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.02)",border:"1px solid #3a1a4a",color:_nextDate?GOLD:"#2a0a3a",borderRadius:8,width:32,height:32,cursor:_nextDate?"pointer":"default",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>›</button>
                </div>

                {/* Macros */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
                  {[["Calories",_nd.cal,GOLD],["Protein",_nd.p,SAGE],["Carbs",_nd.c,"#74b3ce"],["Fat",_nd.f,PINK],["Water","2.5–3L","#52b3aa"]].map(([k,v,c])=>(
                    <div key={k} style={{background:"#140618",border:"1px solid #3a1a4a",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:700,color:c,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.2}}>{v}</div>
                      <div style={{fontSize:9,color:"#5a3a6a",textTransform:"uppercase",letterSpacing:1,marginTop:3}}>{k}</div>
                    </div>
                  ))}
                </div>

                {/* Day note */}
                <div style={{background:`rgba(201,168,76,0.06)`,border:"1px solid rgba(201,168,76,0.18)",borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8}}>
                  <span style={{fontSize:15,flexShrink:0}}>🥗</span>
                  <p style={{fontSize:12,color:"#d4c89a",lineHeight:1.65,fontStyle:"italic"}}>{_nd.note}</p>
                </div>

                {/* Meals */}
                <p style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Meals — Whole Foods · Muscle Building</p>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
                  {_nd.meals.map((m,i)=>(
                    <div key={i} style={{background:"#140618",border:"1px solid #3a1a4a",borderRadius:12,overflow:"hidden",display:"flex"}}>
                      <div style={{width:4,background:MEAL_COLORS[i],flexShrink:0}}/>
                      <div style={{padding:"11px 14px",flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <span style={{fontSize:13,fontWeight:600,color:"#e8e0d0"}}>{m.name}</span>
                          <span style={{fontSize:10,color:MEAL_COLORS[i],letterSpacing:0.5}}>{m.time}</span>
                        </div>
                        {m.items.map((item,j)=>(
                          <div key={j} style={{display:"flex",gap:7,marginBottom:4,alignItems:"flex-start"}}>
                            <span style={{color:MEAL_COLORS[i],fontSize:11,flexShrink:0,marginTop:1}}>·</span>
                            <span style={{fontSize:12,color:"#c8c3b8",lineHeight:1.55}}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Smoothie + Tea */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div style={{background:"#0c180e",border:"1px solid #1a4a2a",borderRadius:12,padding:"13px"}}>
                    <p style={{fontSize:10,color:SAGE,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>🥤 Today's Smoothie</p>
                    <p style={{fontSize:13,fontWeight:600,color:"#e0dbd0",marginBottom:8}}>{_nd.smoothie.name}</p>
                    {_nd.smoothie.i.map((ing,j)=>(
                      <div key={j} style={{display:"flex",gap:6,marginBottom:3}}>
                        <span style={{color:SAGE,fontSize:10,flexShrink:0,marginTop:2}}>·</span>
                        <span style={{fontSize:11,color:"#a0c8b0",lineHeight:1.5}}>{ing}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"#180e0a",border:"1px solid #4a2a1a",borderRadius:12,padding:"13px"}}>
                    <p style={{fontSize:10,color:GOLD,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>🍵 Today's Teas</p>
                    {_nd.tea.split("·").map((t,j)=>(
                      <p key={j} style={{fontSize:11,color:"#d4c89a",lineHeight:1.65,marginBottom:6}}>{t.trim()}</p>
                    ))}
                  </div>
                </div>

                {/* Soup */}
                {_nd.soup&&(
                  <div style={{background:"#0a1a18",border:"1px solid #1a4a40",borderRadius:12,padding:"13px",marginBottom:10}}>
                    <p style={{fontSize:10,color:"#52b3aa",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>🍲 Today's Soup</p>
                    <p style={{fontSize:12,color:"#a0c8c4",lineHeight:1.6}}>{_nd.soup}</p>
                  </div>
                )}

                {/* Rules */}
                <div style={{background:"#110a18",border:"1px solid #2a1a3a",borderRadius:10,padding:"11px 13px"}}>
                  <p style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>Dietary Rules</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {["✅ Whole foods only","✅ High carb — muscle fuel","✅ Anti-inflammatory","✅ Low dairy","✅ Cooked seafood only","✅ 2.5–3L water daily","🚫 No pork","🚫 No tilapia","🚫 No pineapple","🚫 No raw fish","🚫 No eggs","🚫 No bananas","🚫 No peanut butter"].map(g=>(
                      <span key={g} style={{fontSize:10,color:g.startsWith("✅")?SAGE:"#c4908a",background:g.startsWith("✅")?"rgba(122,155,118,0.08)":"rgba(230,57,70,0.08)",borderRadius:6,padding:"3px 9px"}}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TIPS / GODDESS GUIDE TAB ── */}
        {tab==="tips" && (
          <div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#f0ebe0",marginBottom:5}}>Goddess Guide</h2>
            <p style={{fontSize:12,color:"#5a3a6a",marginBottom:18}}>Everything you need to understand about this plan and how it works for your body</p>

            {/* ── HOW TO USE YOUR PLAN ── */}
            <div style={{background:"linear-gradient(135deg,#1a0824,#0f0418)",border:"1px solid "+GOLD,borderRadius:14,padding:20,marginBottom:16}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:GOLD,marginBottom:14,letterSpacing:0.5}}>✨ How to Use Your Plan</h3>
              {[
                {icon:"👑",label:"Start Your Plan",desc:"Scroll to the top and tap Begin Building Goddess Body. This sets today as Day 1 and all 30 dates update automatically. Your progress bar tracks each day as it passes."},
                {icon:"🌸",label:"Flare Day Button",desc:"On every workout day (Tue/Thu/Sat), open the day card and look for the pink 🌸 FLARE DAY button. If you're in a fibromyalgia flare, tap it — the workout instantly swaps to a gentle, low-impact protocol. Tap again to go back to the full workout."},
                {icon:"🏋🏾",label:"Gym / Home Toggle",desc:"See the MODE switch at the top right of the Plan tab. Toggle between GYM and HOME to switch all exercise instructions to match where you're training that day."},
                {icon:"📅",label:"Day Cards",desc:"Tap any day in the calendar to expand it. Workout days show your exercises, yoga warm-up, cardio, and coach tip. PT + Yoga days show your session flow. REST days show your recovery protocol."},
                {icon:"🥗",label:"Nutrition Tab",desc:"Tap Nutrition at the top to view your daily meal plan. Use the ‹ › arrows to navigate between days, or tap any day card first and the nutrition tab will open to that day automatically."},
                {icon:"💡",label:"Goddess Guide Tab",desc:"You're here now. Come back to this tab any time you need a reminder of your protocols, the science behind the plan, or a motivational reset."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:i===5?0:14,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{item.icon}</div>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:GOLD,marginBottom:3}}>{item.label}</p>
                    <p style={{fontSize:11,color:"#c4bfb5",lineHeight:1.7}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── VISION BOARD ── */}
            <div style={{background:"#140618",border:"1px solid #3a1a4a",borderRadius:14,padding:18,marginBottom:12}}>
              <h3 style={{fontSize:14,fontWeight:600,color:PINK,marginBottom:4}}>📸 Vision Board — Your Physique Goal</h3>
              <p style={{fontSize:11,color:"#5a3a6a",marginBottom:14,lineHeight:1.6}}>Teyana Taylor + Kehlani physique — abs, glutes, thighs, lean arms. This is what 30 days of intentional training + nutrition is building toward.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {["/ref1.png","/ref2.png","/ref3.png","/ref4.png","/ref5.png","/ref6.png"].map((src,i)=>(
                  <div key={i} className="ref-photo"
                    onClick={()=>setLightbox(src)}
                    style={{borderRadius:10,overflow:"hidden",border:"1px solid #3a1a4a",aspectRatio:"3/4",background:"#0a0312",position:"relative"}}>
                    <img src={src} alt={"Reference "+(i+1)}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}}
                      onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
                    />
                    <div style={{display:"none",position:"absolute",inset:0,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:22}}>📷</span>
                      <span style={{fontSize:9,color:"#3a1a4a",letterSpacing:1}}>REF {i+1}</span>
                    </div>
                    {/* Hover shine overlay */}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(201,168,76,0.08),transparent 60%)",pointerEvents:"none",borderRadius:10}}/>
                  </div>
                ))}
              </div>
              <p style={{fontSize:10,color:"#3a1a4a",marginTop:10,textAlign:"center",letterSpacing:1}}>EVERY REP IS BUILDING THIS · TRUST THE PROCESS</p>
            </div>

            {[
              {title:"🌸 Fibromyalgia Protocol",color:PINK,items:[
                "Every workout day has a 🌸 FLARE DAY button. When you're in a flare, tap it — the workout swaps immediately to a gentle protocol that keeps the body moving without triggering inflammation.",
                "Tart cherry juice (4 oz) is in your nutrition plan for a reason: studies show it reduces inflammatory markers and muscle pain in fibromyalgia. Have it post-workout and on rest days.",
                "Magnesium-rich foods (spinach, almonds, pumpkin seeds) and supplements (Epsom salt baths, magnesium lotion) directly support fibromyalgia sleep and pain management.",
                "Your yoga practice is not separate from this plan — it IS the plan. The nervous system regulation from yoga is what allows the strength training to happen safely.",
                "Listen to your body's signals before they become flares. If you sense one coming, preemptively switch to flare mode — it's not failure, it's intelligent management.",
              ]},
              {title:"⚠️ Shoulder Safety Protocol",color:GOLD,items:[
                "NO overhead pressing of any kind throughout this program. This means no shoulder press, no overhead tricep extensions, no upright rows above shoulder height.",
                "All upper body work is pulling (lat pulldown, rows) or arms-down pushing (tricep pushdown). These build upper body definition without loading the shoulder joint overhead.",
                "If anything causes sharp shoulder pain — stop immediately. Dull muscle fatigue is normal. Sharp joint pain is not.",
                "Tell your PT specifically which upper body exercises you're doing. They may have additional modifications based on your specific injury pattern.",
                "The reference photos you shared are achievable without overhead pressing. Teyana Taylor and Kehlani's arms come from rows, curls, and core work — not overhead pressing.",
              ]},
              {title:"🍑 Why 133 → 150 lbs Works",color:PLUM,items:[
                "You are building MUSCLE, not just losing fat. This is a caloric SURPLUS plan — you should be eating more than before, not less. Under-eating on a muscle-building plan produces no results.",
                "Muscle weighs more than fat but takes up less space. At 150 lbs with the right muscle composition, you will look leaner and more defined than at 133 lbs without muscle.",
                "The 'carby barbie' preference actually works PERFECTLY for muscle building. Complex carbs are the primary fuel for glute and lower body training. Rice, oats, sweet potato — these build the body you want.",
                "High protein (125–130g/day) is non-negotiable for this goal. Without sufficient protein, the training stimulus creates no new muscle tissue.",
              ]},
              {title:"🧘🏾 Yoga as Part of the Plan",color:SAGE,items:[
                "Yoga before workouts serves as a dynamic warm-up that PT alone doesn't provide — it primes the nervous system, opens the hip flexors, and mentally shifts you into training mode.",
                "The spiritual benefit you feel from yoga is also physiologically real: yoga activates the parasympathetic nervous system, which reduces cortisol. Lower cortisol = less fat storage, better recovery.",
                "On PT + Yoga days, suggested yoga flows are built into the plan based on what muscles were trained recently. Follow them or substitute your own intuitive practice.",
                "Your yoga practice is a COMPETITIVE ADVANTAGE over most gym-goers. It gives you body awareness, breath control, and recovery tools that most people have to pay for separately.",
              ]},
              {title:"📅 3-Day Plan Structure",color:"#74b3ce",items:[
                "Mon/Wed/Fri: PT + Yoga — these are NOT off days. These are active recovery days that make the training days possible.",
                "Tue/Thu/Sat: Yoga (warm-up) → 45-min strength session. The yoga before the workout is mandatory — it's your warm-up.",
                "Sunday: Full rest. Sleep, recover, nourish. Your body is rebuilding every Sunday.",
                "13 total strength sessions across 30 days. Quality over quantity — each session matters significantly.",
                "Missing a session is okay. Missing a flare day session using the flare protocol is NOT missing — it counts. This plan is built for real life.",
              ]},
            ].map(sec=>(
              <div key={sec.title} style={{background:"#140618",border:"1px solid #3a1a4a",borderRadius:14,padding:18,marginBottom:12}}>
                <h3 style={{fontSize:14,fontWeight:600,color:sec.color,marginBottom:12}}>{sec.title}</h3>
                {sec.items.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:9,marginBottom:9,alignItems:"flex-start"}}>
                    <span style={{color:sec.color,marginTop:2,fontSize:11,flexShrink:0}}>→</span>
                    <p style={{fontSize:12,color:"#c4bfb5",lineHeight:1.7}}>{item}</p>
                  </div>
                ))}
              </div>
            ))}

            <div style={{background:"linear-gradient(135deg,#1a0824,#120618)",border:"1px solid #3a1a4a",borderRadius:14,padding:22,textAlign:"center",marginTop:16}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:GOLD,fontStyle:"italic",marginBottom:6}}>
                "A Goddess doesn't chase the body — she builds it, session by session, with intention."
              </p>
              <p style={{fontSize:10,color:"#5a3a6a",letterSpacing:2,textTransform:"uppercase"}}>30 Days · {heroRange()}</p>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{textAlign:"center",padding:"24px 20px 32px",borderTop:"1px solid #1a0824",marginTop:16}}>
          <p style={{fontSize:9,color:"#2a0a3a",letterSpacing:2,textTransform:"uppercase",fontFamily:"'Jost',sans-serif"}}>
            Created by Martyy B Media
          </p>
        </div>

      </div>

      {/* ── LIGHTBOX MODAL ── */}
    {lightbox&&(
      <div className="lightbox-overlay"
        onClick={()=>setLightbox(null)}
        style={{position:"fixed",inset:0,zIndex:9999,
          background:"rgba(4,1,10,0.92)",
          display:"flex",alignItems:"center",justifyContent:"center",
          padding:"20px",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
        <div onClick={e=>e.stopPropagation()}
          style={{position:"relative",maxWidth:"92vw",maxHeight:"90vh",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <img src={lightbox} alt="Reference" className="lightbox-img"
            style={{maxWidth:"100%",maxHeight:"82vh",objectFit:"contain",
              borderRadius:16,boxShadow:"0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.12)"}}
          />
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <p style={{fontSize:10,color:"rgba(201,168,76,0.6)",letterSpacing:2,textTransform:"uppercase",fontFamily:"'Jost',sans-serif"}}>
              Physique Goal · Teyana Taylor + Kehlani
            </p>
          </div>
          <button onClick={()=>setLightbox(null)}
            style={{position:"absolute",top:-14,right:-14,width:36,height:36,
              borderRadius:"50%",background:"rgba(201,168,76,0.15)",
              border:"1px solid rgba(201,168,76,0.3)",color:GOLD,
              fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Jost',sans-serif",lineHeight:1}}>
            ×
          </button>
        </div>
      </div>
    )}
    </div>
  );
}