import { useState } from "react";

/* ── Global CSS — fonts loaded via index.html ── */
const STYLE_TAG = `
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:#0a0410;}
  ::-webkit-scrollbar-thumb{background:#5a2a70;border-radius:2px;}
  .day-card{transition:transform 0.15s,box-shadow 0.15s;cursor:pointer;}
  .day-card:hover{transform:translateY(-2px);}
  .week-hdr{transition:background 0.2s;cursor:pointer;}
  .week-hdr:hover{background:#1e0828!important;}
  .toggle-pill{transition:all 0.25s;}
  .flare-btn{transition:all 0.2s;}
  .flare-btn:hover{opacity:0.85!important;}
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
};

const weekMeta = [
  {num:1,theme:"Foundation",dates:"Jun 24–30"},
  {num:2,theme:"Build",     dates:"Jul 1–7"},
  {num:3,theme:"Strength",  dates:"Jul 8–14"},
  {num:4,theme:"Peak",      dates:"Jul 15–23"},
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
  if(["Lower Body + Glutes","Lower Body Build","Lower Body Power","Lower Body Peak","Lower Body Celebration"].includes(type)) return "lower";
  if(["Core + Upper Body","Core + Arms","Core + Arms Peak"].includes(type)) return "core";
  if(["Full Body Circuit","Full Body + Stairmaster","Full Body Strength","Full Body Peak"].includes(type)) return "fullbody";
  if(["PT + Yoga"].includes(type)) return "yoga";
  return "rest";
};

/* ── Module-level constants ── */
const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ════════ ALL 30 DAYS ════════ */
const allDays = [

/* ─── WEEK 1 · FOUNDATION ─── */
{date:"Jun 24",wd:"Wed",week:1,type:"PT + Yoga",workout:false,
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

{date:"Jun 25",wd:"Thu",week:1,type:"Lower Body + Glutes",workout:true,
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

{date:"Jun 26",wd:"Fri",week:1,type:"PT + Yoga",workout:false,
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

{date:"Jun 27",wd:"Sat",week:1,type:"Core + Upper Body",workout:true,
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

{date:"Jun 30",wd:"Tue",week:1,type:"Full Body Circuit",workout:true,
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

/* ─── WEEK 2 · BUILD ─── */
{date:"Jul 1",wd:"Wed",week:2,type:"PT + Yoga",workout:false,
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

{date:"Jul 2",wd:"Thu",week:2,type:"Lower Body Build",workout:true,
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

{date:"Jul 3",wd:"Fri",week:2,type:"PT + Yoga",workout:false,
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

{date:"Jul 4",wd:"Sat",week:2,type:"Core + Arms",workout:true,
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

{date:"Jul 7",wd:"Tue",week:2,type:"Full Body + Stairmaster",workout:true,
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

/* ─── WEEK 3 · STRENGTH ─── */
{date:"Jul 8",wd:"Wed",week:3,type:"PT + Yoga",workout:false,
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

{date:"Jul 9",wd:"Thu",week:3,type:"Lower Body Power",workout:true,
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

{date:"Jul 10",wd:"Fri",week:3,type:"PT + Yoga",workout:false,
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

{date:"Jul 11",wd:"Sat",week:3,type:"Core + Upper Body",workout:true,
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

{date:"Jul 14",wd:"Tue",week:3,type:"Full Body Strength",workout:true,
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

/* ─── WEEK 4 · PEAK ─── */
{date:"Jul 15",wd:"Wed",week:4,type:"PT + Yoga",workout:false,
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

{date:"Jul 16",wd:"Thu",week:4,type:"Lower Body Peak",workout:true,
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

{date:"Jul 17",wd:"Fri",week:4,type:"PT + Yoga",workout:false,
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

{date:"Jul 18",wd:"Sat",week:4,type:"Core + Arms Peak",workout:true,
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

{date:"Jul 21",wd:"Tue",week:4,type:"Full Body Peak",workout:true,
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

{date:"Jul 22",wd:"Wed",week:4,type:"PT + Yoga",workout:false,
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

{date:"Jul 23",wd:"Thu",week:4,type:"Lower Body Celebration",workout:true,
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
        "You completed 30 days. That is the victory."],
 flareTip:"Final day flare protocol. Whether you did the full session or this gentle version — you completed 30 days. The Goddess Body is built on consistency over perfection. You did it."},
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
"Jun 24":{cal:"2,150",p:"120g",c:"250g",f:"60g",
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

"Jun 25":{cal:"2,350",p:"125g",c:"270g",f:"65g",
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

"Jun 26":{cal:"2,150",p:"120g",c:"252g",f:"60g",
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

"Jun 27":{cal:"2,350",p:"125g",c:"268g",f:"65g",
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

"Jun 29":{cal:"2,150",p:"120g",c:"250g",f:"60g",
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

"Jun 30":{cal:"2,350",p:"125g",c:"270g",f:"65g",
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

"Jul 1":{cal:"2,150",p:"120g",c:"250g",f:"60g",
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

"Jul 2":{cal:"2,350",p:"126g",c:"272g",f:"65g",
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

"Jul 3":{cal:"2,150",p:"120g",c:"252g",f:"60g",
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

"Jul 4":{cal:"2,350",p:"125g",c:"268g",f:"65g",
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

"Jul 6":{cal:"2,200",p:"120g",c:"255g",f:"62g",
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

"Jul 7":{cal:"2,400",p:"128g",c:"275g",f:"66g",
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

"Jul 8":{cal:"2,150",p:"120g",c:"250g",f:"60g",
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

"Jul 9":{cal:"2,400",p:"128g",c:"276g",f:"66g",
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

"Jul 10":{cal:"2,150",p:"120g",c:"250g",f:"60g",
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

"Jul 11":{cal:"2,350",p:"125g",c:"268g",f:"65g",
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

"Jul 13":{cal:"2,200",p:"120g",c:"255g",f:"62g",
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

"Jul 14":{cal:"2,400",p:"128g",c:"276g",f:"66g",
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

"Jul 15":{cal:"2,200",p:"122g",c:"258g",f:"62g",
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

"Jul 16":{cal:"2,450",p:"130g",c:"280g",f:"68g",
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

"Jul 17":{cal:"2,150",p:"120g",c:"252g",f:"60g",
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

"Jul 18":{cal:"2,350",p:"126g",c:"268g",f:"65g",
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

"Jul 20":{cal:"2,250",p:"122g",c:"260g",f:"62g",
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

"Jul 21":{cal:"2,450",p:"130g",c:"280g",f:"68g",
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

"Jul 22":{cal:"2,200",p:"120g",c:"255g",f:"62g",
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

"Jul 23":{cal:"2,450",p:"130g",c:"280g",f:"68g",
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
};

const MEAL_COLORS = ["#c9a84c","#7a9b76","#e8849a","#b06ac8","#74b3ce"];

/* ════════════ COMPONENT ════════════ */
export default function GoddessBody() {
  const [tab,       setTab]       = useState("plan");
  const [gymMode,   setGymMode]   = useState(true);
  const [selDay,    setSelDay]    = useState(null);
  const [openWeek,  setOpenWeek]  = useState(1);
  const [nutDate,   setNutDate]   = useState(null);
  const [flareMode, setFlareMode] = useState({});

  const toggleFlare = (date, e) => {
    e.stopPropagation();
    setFlareMode(prev => ({...prev, [date]: !prev[date]}));
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
    const updated = { ...completions, [date]: status };
    setCompletions(updated);
    try { localStorage.setItem('gb-completions', JSON.stringify(updated)); } catch {}
  };

  const isLocked = (idx) => {
    if (!startDate || idx === 0) return false;
    const prev = allDays[idx - 1];
    return !completions[prev?.date];
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
    if (!startDate) return 'Jun 24 – Jul 23, 2026 · Starting Wednesday';
    const end = new Date(startDate); end.setDate(end.getDate() + 29);
    const fmt = d => `${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    return `${fmt(startDate)} – ${fmt(end)}`;
  };

  const _diff = startDate ? (() => { const n=new Date(); n.setHours(0,0,0,0); return Math.round((n-startDate)/86400000); })() : -999;
  const todayIdx = (_diff >= 0 && _diff <= 29) ? _diff : -1;
  const daysIn   = Math.max(0, Math.min(30, startDate ? _diff + 1 : 0));

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

  return (
    <div style={{background:"#0a0312",minHeight:"100vh",fontFamily:"'Jost',sans-serif",color:"#e2ddd3"}}>
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
                  Built for Jun 24 — tap to start fresh <em style={{color:GOLD}}>from today</em>. All 30 days update automatically.
                </p>
              </div>
              <button onClick={handleStart} style={{background:`linear-gradient(135deg,${GOLD},#a8883a)`,border:"none",borderRadius:10,padding:"11px 22px",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:13,color:"#0a0312",letterSpacing:0.5,flexShrink:0,boxShadow:"0 4px 14px rgba(201,168,76,0.3)",whiteSpace:"nowrap"}}>
                👑 Begin Goddess Body
              </button>
            </div>
          ) : (
            <div style={{background:"rgba(139,47,168,0.07)",border:"1px solid #3a1a4a",borderRadius:12,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>✅</span>
                <div>
                  <p style={{fontSize:12,fontWeight:600,color:SAGE,marginBottom:2}}>
                    Goddess Body Active · Day {Math.min(daysIn,30)} of 30
                    {todayIdx>=0&&<span style={{marginLeft:8,fontSize:10,color:GOLD,background:"rgba(201,168,76,0.12)",padding:"1px 8px",borderRadius:6}}>Today: Day {todayIdx+1}</span>}
                  </p>
                  <p style={{fontSize:11,color:"#7a5a8a"}}>
                    Started {startDate.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
                    {daysIn>0&&daysIn<=30&&` · ${daysIn} day${daysIn===1?'':'s'} in`}
                    {daysIn>30&&' · 30 days complete 👑'}
                  </p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:90,height:6,background:"rgba(255,255,255,0.08)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,(daysIn/30)*100)}%`,background:daysIn>=30?`linear-gradient(90deg,${GOLD},${PINK})`:`linear-gradient(90deg,${PLUM},${PINK})`,borderRadius:4}}/>
                </div>
                {daysIn>=30
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
            <button onClick={()=>{setGymMode(!gymMode);setSelDay(null);}}
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
                {icon:"👑",label:"Start Your Plan",desc:"Scroll to the top and tap Begin Goddess Body. This sets today as Day 1 and all 30 dates update automatically. Your progress bar tracks each day as it passes."},
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
                  <div key={i} style={{borderRadius:10,overflow:"hidden",border:"1px solid #3a1a4a",aspectRatio:"3/4",background:"#0a0312",position:"relative"}}>
                    <img src={src} alt={"Reference "+(i+1)}
                      style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                      onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
                    />
                    <div style={{display:"none",position:"absolute",inset:0,alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:22}}>📷</span>
                      <span style={{fontSize:9,color:"#3a1a4a",letterSpacing:1}}>REF {i+1}</span>
                    </div>
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

      </div>
    </div>
  );
}
