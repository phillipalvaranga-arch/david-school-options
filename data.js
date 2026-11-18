/* David School Options — verified data. Every item links to its official source.
   Facts checked on VERIFIED date. Amounts, dates and rules change: always confirm with the program. */
(function (root) {
  "use strict";
  var VERIFIED = "2026-11-18";
  var V = VERIFIED;

  var PROFILE_DEFAULT = {
    name: "David",
    age: 12,
    city: "Frisco, TX 75034 (Collin County)",
    school: "Pioneer Heritage Middle School, Frisco ISD",
    plan: "IEP with special education",
    history: "Previously Montgomery County Public Schools (Maryland) with speech therapy and ESY",
    summary: "Age 12 with mild autism. Academically capable (grade-level or advanced work). Needs support with behavior and attention, and sometimes with social interaction. His intelligence is not affected.",
    academic: "capable",
    needs: ["behavior", "attention", "social"]
  };

  /* Support tags used by the wizard and the filters */
  var TAGS = {
    small: "Small classes or 1-to-1",
    behavior: "Behavior support",
    attention: "Attention and focus support",
    social: "Social-skills support",
    exec: "Executive-function coaching",
    autism: "Experienced with autism",
    advanced: "Rigorous or advanced academics",
    twoE: "Twice-exceptional (2e) focus",
    iep: "Must follow his IEP (public school)",
    flex: "Flexible schedule or home days",
    faith: "Christian",
    sda: "Seventh-day Adventist"
  };

  var MODELS = {
    homeschool: "Homeschool",
    hybrid: "Hybrid (part home, part school)",
    virtual: "Virtual public school",
    private: "Private school",
    public: "Stay public with better supports"
  };

  /* miles = straight-line distance from the center of ZIP 75034 to the center of the school's ZIP (approximate, not driving distance) */
  var OPTIONS = [
    /* ---------- Stay public ---------- */
    {
      id: "fisd-stay", model: "public", name: "Stay at Pioneer Heritage MS with stronger IEP supports",
      org: "Frisco ISD Special Education", city: "Frisco", miles: 0, grades: "Current campus",
      cost: "Free (public school)", costMax: 0,
      tags: ["iep", "behavior", "attention", "social", "advanced"],
      summary: "David keeps his IEP rights. You can ask for an ARD meeting at any time to add or change supports, for example a behavior plan (BIP), attention and focus accommodations, counseling or social-skills goals.",
      points: [
        "Frisco ISD says a student in special education who shows gifted traits can be referred to its Gifted and Talented (GT) program. Students who qualify for both are called twice exceptional (2E).",
        "Advanced grade-level courses are part of general education, so his IEP services apply in them.",
        "Frisco ISD says it doesn't provide ABA therapy, but ABA-style strategies may be built into his plan by the ARD committee. It will work with private therapists if you give consent.",
        "Start with his teacher or case manager. The Special Education Department line is 469-633-6900."
      ],
      eligibility: "He is already enrolled.",
      phone: "469-633-6900", url: "https://www.friscoisd.org/o/fisd/page/special-education",
      sources: [
        { label: "Frisco ISD Special Education FAQ", url: "https://www.friscoisd.org/o/fisd/page/faq-specialed" },
        { label: "Frisco ISD Special Education contacts", url: "https://www.friscoisd.org/o/fisd/page/contact-us-specialed" }
      ]
    },

    /* ---------- Homeschool ---------- */
    {
      id: "homeschool-tx", model: "homeschool", name: "Homeschool in Texas (parent-led)",
      org: "Texas law: Leeper v. Arlington ISD", city: "At home", miles: 0, grades: "Any",
      cost: "No tuition. Curriculum costs vary, and free options exist (see Planner).", costMax: 0,
      tags: ["flex", "attention", "behavior", "advanced", "small"],
      summary: "Legal in Texas since the Leeper decision. You need a written curriculum that covers reading, spelling, grammar, math and good citizenship. Texas doesn't register, test or approve homeschools.",
      points: [
        "You set the pace: short lessons, movement breaks and advanced work when he's ready.",
        "Withdraw him from Frisco ISD formally first. The district may ask for a letter of assurance (there's a template in Planner).",
        "His IEP rights end. Frisco ISD says homeschooled students who live in the district can get certain services through its Proportionate Share Plan, which is a services plan, not an IEP.",
        "Social time comes from co-ops, clubs and groups (see the Social tab).",
        "TEFA paid up to $2,000 a year for homeschool families in 2026-27, if a family was accepted. Applications are closed for now."
      ],
      eligibility: "Any Texas family can choose it.",
      phone: "", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling",
      sources: [
        { label: "TEA: Home Schooling", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling" },
        { label: "TEA: Alternative Schooling (Leeper, curriculum)", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/alternative-schooling" },
        { label: "Texas Home School Coalition (THSC)", url: "https://thsc.org/requirements-to-homeschool-in-texas/" }
      ]
    },
    {
      id: "ntech", model: "homeschool", name: "N-Tech Homeschool Co-op",
      org: "Christian homeschool co-op", city: "Plano / Allen / Frisco / McKinney area", miles: null, grades: "Newborn through high school",
      cost: "Check site", costMax: null,
      tags: ["social", "faith", "flex"],
      summary: "A Christ-centered co-op serving homeschool families in Allen, Plano, Frisco and McKinney since 1999. It offers classes for elementary, middle and high school ages.",
      points: ["Families join by applying.", "Good for weekly classes with peers alongside homeschooling."],
      eligibility: "Application required. Check site.",
      phone: "", url: "https://n-tech.org/", sources: [{ label: "N-Tech website", url: "https://n-tech.org/" }]
    },
    {
      id: "eagle", model: "homeschool", name: "E.A.G.L.E. homeschool electives",
      org: "Homeschool group (meets at Shawnee Trail Church of Christ, Frisco)", city: "Frisco", miles: 3, grades: "Classes by age, several for ages 12+",
      cost: "Fall 2026: $25 registration for the first child or $50 per family, plus a $20 facility fee per child. Each class has its own fee (many are $100).", costMax: 500,
      tags: ["social", "faith", "flex"],
      summary: "Ten-week elective classes on Mondays in Frisco, with fun, hands-on learning in a small-group homeschool setting.",
      points: ["Fall 2026 ran August 24 to November 9. Registration for that term is closed, so check for the next session.", "Classes cap small, for example 2 to 10 students in some."],
      eligibility: "Homeschool families. Check site.",
      phone: "", url: "https://eaglehomeschoolgroup.com/electives/", sources: [{ label: "E.A.G.L.E. electives", url: "https://eaglehomeschoolgroup.com/electives/" }]
    },
    {
      id: "friscohis", model: "homeschool", name: "Frisco Home Is School (Frisco HIS)",
      org: "Christian homeschool moms' community", city: "Frisco", miles: 0, grades: "Families of all ages",
      cost: "Annual dues (amount on site)", costMax: null,
      tags: ["social", "faith"],
      summary: "Not a school, co-op or drop-off program. It's a moms' support group whose volunteers run kids' activities: a weekly park day, plus a monthly Lego Club, Chess Club, Nature Club and field trips. Drama Club is for ages 13+.",
      points: ["It's helpful for friendships and low-pressure social practice.", "Membership is for homeschooling moms and female guardians, who sign a statement of faith and a code of conduct. A behavior contract is required for middle and high schoolers.", "Its FAQ lists coffees for moms of kids with special needs."],
      eligibility: "Homeschooling mother or female guardian. Check site.",
      phone: "", url: "https://www.friscohis.org/", sources: [{ label: "Frisco HIS FAQ", url: "https://www.friscohis.org/faq/" }]
    },

    /* ---------- Hybrid ---------- */
    {
      id: "coramdeo", model: "hybrid", name: "Coram Deo Academy, Collin County campus",
      org: "Classical Christian, university-model", city: "Plano (9645 Independence Pkwy, 75025)", miles: 6.1, grades: "PreK through 12th",
      cost: "2027-28 tuition plus the $500 annual fee: grades 5-6 $9,215; grades 7-8 $10,010; grades 9-12 $12,900.", costMax: 10010,
      tags: ["flex", "faith", "advanced"],
      summary: "Most students are on campus 2 to 3 days a week and study at home the other days, with the parent as co-teacher.",
      points: [
        "Accepts TEFA funding.",
        "Need-based financial aid goes through Clarity ($65 application fee). For 2027-28, the priority deadline is January 15, 2027 for new families and December 7, 2026 for re-enrolling families.",
        "The Enrollment Covenant becomes binding after January 15, whether or not a TEFA award comes through.",
        "Its site doesn't describe autism or behavior supports, so ask about class size and how it accommodates students."
      ],
      eligibility: "Admissions application and testing. Check site.",
      phone: "972-691-5648", url: "https://www.coramdeoacademy.org/admissions/tuition",
      sources: [
        { label: "Coram Deo collaborative model", url: "https://www.coramdeoacademy.org/news/university-model-collaboration" },
        { label: "Coram Deo tuition, aid and TEFA FAQ", url: "https://www.coramdeoacademy.org/admissions/tuition" }
      ]
    },
    {
      id: "dia", model: "hybrid", name: "Duc in Altum Classical Academy",
      org: "Catholic classical, collaborative", city: "McKinney", miles: 12, grades: "PreK3 through 12th",
      cost: "Check site", costMax: null,
      tags: ["flex", "faith", "advanced"],
      summary: "Exactly 2 days at school and 3 at home. Classes meet on campus Tuesdays and Thursdays, and students do guided lessons at home on Mondays, Wednesdays and Fridays.",
      points: [
        "2027-28 applications are open for all grades.",
        "For 2026-27, grades 7 to 12 are considered case by case.",
        "Its site doesn't describe autism or behavior supports, so ask."
      ],
      eligibility: "Application. Check site.",
      phone: "", url: "https://www.diaclassical.org/", sources: [{ label: "Duc in Altum website", url: "https://www.diaclassical.org/" }]
    },
    {
      id: "flex-hybrid", model: "hybrid", name: "Frisco Flex hybrid (Frisco ISD)", later: "High school only (grades 9-12)",
      org: "Frisco ISD virtual campus", city: "Frisco (5515 Ohio Dr.)", miles: 3.6, grades: "9th-12th only",
      cost: "Free", costMax: 0,
      tags: ["iep", "flex", "advanced"],
      summary: "For current Frisco ISD high schoolers and incoming 9th graders: 4 to 7 courses online and the rest at their home campus.",
      points: ["Not available until high school. Keep it in mind for later.", "Enrollment requires an application plus passing grades, grade-level test results, regular attendance and a clean discipline record."],
      eligibility: "Grades 9-12 and Frisco ISD eligibility rules.",
      phone: "469-633-6070", url: "https://www.friscoisd.org/o/flex/page/hybrid-students",
      sources: [
        { label: "Frisco Flex hybrid", url: "https://www.friscoisd.org/o/flex/page/hybrid-students" },
        { label: "Frisco Flex enrollment and eligibility", url: "https://www.friscoisd.org/o/flex/page/enrollment-overview" }
      ]
    },
    {
      id: "flex-alacarte", model: "homeschool", name: "Frisco Flex à la carte courses (homeschool add-on)", later: "High school only (grades 9-12)",
      org: "Frisco ISD virtual campus", city: "Online", miles: 3.6, grades: "9th-12th only",
      cost: "$350 per semester course for homeschool students", costMax: 700,
      tags: ["flex", "advanced"],
      summary: "Online classes taught by certified Frisco ISD teachers that eligible Texas homeschool students can take alongside homeschooling.",
      points: ["Only for high school grades. Keep it in mind for later.", "Classes follow the district calendar, with regular teacher contact."],
      eligibility: "Eligible Texas residents in a homeschool program, grades 9-12.",
      phone: "469-633-6070", url: "https://www.friscoisd.org/o/flex/page/a-la-carte-students",
      sources: [{ label: "Frisco Flex à la carte", url: "https://www.friscoisd.org/o/flex/page/a-la-carte-students" }]
    },

    /* ---------- Virtual public ---------- */
    {
      id: "iup", model: "virtual", name: "iUniversity Prep (Grapevine-Colleyville ISD)",
      org: "Tuition-free virtual magnet school", city: "Online (office in Grapevine)", miles: 20, grades: "5th-12th",
      cost: "Free (public school)", costMax: 0,
      tags: ["iep", "advanced", "flex"],
      summary: "A rigorous, college-prep online public school for Texas students in grades 5 to 12. It has admissions criteria and enrollment caps.",
      points: [
        "2027-28 applications aren't open yet. Fill out the interest form to hear when they open.",
        "For 2027-28, most new students must have attended a Texas public school for at least 6 weeks in 2026-27. David is enrolled in Frisco ISD now.",
        "It usually doesn't take new students once the school year has started.",
        "As a public school, it must provide special education services under his IEP. Ask how it handles behavior and attention supports online."
      ],
      eligibility: "Texas students in grades 5-12 who meet the admissions criteria.",
      phone: "817-305-4895", url: "https://www.iuniversityprep.org/page/apply",
      sources: [{ label: "iUP: Apply", url: "https://www.iuniversityprep.org/page/apply" }, { label: "iUP: About", url: "https://www.iuniversityprep.org/page/about-us/" }]
    },
    {
      id: "tca", model: "virtual", name: "Texas Connections Academy",
      org: "Tuition-free online public school", city: "Online", miles: null, grades: "3rd-12th",
      cost: "Free (public school). Families pay only typical supply costs.", costMax: 0,
      tags: ["iep", "flex"],
      summary: "A state-funded online public school for grades 3 to 12. Second-semester enrollment is open.",
      points: ["Public school, so it must follow his IEP.", "Student council for grades 6 to 12."],
      eligibility: "Texas public-school eligibility, plus the TXVSN rules for full-time online schools.",
      phone: "", url: "https://www.connectionsacademy.com/texas-virtual-school/",
      sources: [{ label: "Texas Connections Academy", url: "https://www.connectionsacademy.com/texas-virtual-school/" }]
    },
    {
      id: "tvah", model: "virtual", name: "Texas Virtual Academy at Hallsville (TVAH)",
      org: "Accredited online public school", city: "Online", miles: null, grades: "3rd-12th",
      cost: "Free (public school). Families supply household items like printer ink.", costMax: 0,
      tags: ["iep", "flex", "advanced"],
      summary: "An online public school for grades 3 to 12, with AP, dual enrollment and evening classes. Transfers are still open for fall or spring.",
      points: ["Public school, so it must follow his IEP."],
      eligibility: "Texas public-school eligibility, plus the TXVSN rules for full-time online schools.",
      phone: "", url: "https://tvah.k12.com/", sources: [{ label: "TVAH", url: "https://tvah.k12.com/" }]
    },
    {
      id: "txvsn", model: "virtual", name: "TXVSN Online Schools (state list of full-time online schools)",
      org: "Texas Virtual School Network (TEA)", city: "Online", miles: null, grades: "3rd-12th",
      cost: "Free (public schools)", costMax: 0,
      tags: ["iep", "flex"],
      summary: "TEA's network of approved, free, full-time online public schools. Courses must meet the TEKS, and teachers must be Texas-certified.",
      points: ["To qualify, a student generally must have been enrolled in a Texas public school the year before. David meets this through Frisco ISD.", "Some online schools add their own requirements."],
      eligibility: "Grades 3-12 and the state eligibility rules.",
      phone: "", url: "https://txvsn.org/online-schools-eligibility/",
      sources: [
        { label: "TXVSN eligibility", url: "https://txvsn.org/online-schools-eligibility/" },
        { label: "TEA: TXVSN Online Schools program", url: "https://tea.texas.gov/curriculum-and-instruction/learning-support-and-programs/texas-virtual-school-network/texas-virtual-school-network-online-schools-program" }
      ]
    },
    {
      id: "flex-online", model: "virtual", name: "Frisco Flex fully online (Frisco ISD)", later: "High school only (grades 9-12)",
      org: "Frisco ISD virtual campus", city: "Online", miles: 3.6, grades: "9th-12th only",
      cost: "Free for eligible Texas residents. A paid option is also offered.", costMax: 0,
      tags: ["iep", "flex", "advanced"],
      summary: "A full path to graduation, 100% online and taught by certified Frisco ISD teachers.",
      points: ["High school only. Keep it in mind for later."],
      eligibility: "Grades 9-12 and Frisco ISD eligibility rules.",
      phone: "469-633-6070", url: "https://www.friscoisd.org/o/flex/page/fully-online-students",
      sources: [{ label: "Frisco Flex fully online", url: "https://www.friscoisd.org/o/flex/page/fully-online-students" }]
    },

    /* ---------- Private ---------- */
    {
      id: "greatlakes", model: "private", name: "Great Lakes Academy",
      org: "Accredited non-profit, college-prep", city: "Plano (6000 Custer Road, 75023)", miles: 7.5, grades: "4th-12th",
      cost: "2026-27: $19,500 (grades 4-8), $21,620 (grades 9-12), plus a one-time $400 Brigance test for new students in grades 4-9.", costMax: 19900,
      tags: ["small", "autism", "attention", "advanced", "exec"],
      summary: "For students of average to above-average intelligence who have learning differences, anxiety, ADHD or ASD Level 1. Classes are no larger than 10 students in grades 4 to 8.",
      points: ["Close to Frisco.", "Builds an individual \"Gap Plan\" from the entry test.", "Strict no-refund policy once enrolled."],
      eligibility: "Application. Check site.",
      phone: "972-517-7498", url: "https://www.greatlakesacademy.com/",
      sources: [{ label: "Great Lakes Academy", url: "https://www.greatlakesacademy.com/" }, { label: "Great Lakes tuition", url: "https://www.greatlakesacademy.com/tuition" }]
    },
    {
      id: "fusion", model: "private", name: "Fusion Academy Plano",
      org: "Accredited 1-to-1 private school (Cognia)", city: "Plano (2400 Dallas Pkwy, 75093)", miles: 6.8, grades: "4th-12th (the school's site)",
      cost: "2026-27 middle school: $4,620 per 1-to-1 class per term. Full-time students take 12 to 15 classes a year. Fees: $1,800 full-time registration and $250 for new full-time students.", costMax: 55440,
      tags: ["small", "attention", "social", "advanced", "flex"],
      summary: "One student and one teacher per class, with custom schedules and daily feedback. It serves students with learning, social or emotional differences.",
      points: ["Accepts TEFA.", "Homework Café and clubs give students social time.", "Courses are offered at Essential, College Prep and Honors levels."],
      eligibility: "Open enrollment. Check site.",
      phone: "972-403-9018", url: "https://www.fusionacademy.com/campuses/plano/",
      sources: [{ label: "Fusion Plano", url: "https://www.fusionacademy.com/campuses/plano/" }, { label: "Fusion Plano tuition", url: "https://www.fusionacademy.com/campuses/plano/tuition/" }]
    },
    {
      id: "shelton", model: "private", name: "Shelton School",
      org: "Non-profit school for intelligent students with learning differences", city: "Dallas (17301 Preston Road, 75252)", miles: 9.8, grades: "Early Childhood-12th",
      cost: "Check site", costMax: null,
      tags: ["small", "attention", "exec", "social", "advanced"],
      summary: "The largest independent school for intelligent students with learning differences, including ADHD and executive-function challenges. It runs a social-skills program in every grade.",
      points: ["1:6 teacher-to-student ratio and an average class of 10 (2025-26 fact sheet).", "Participates in TEFA.", "Its Evaluation Center evaluates for autism spectrum disorder, among other conditions."],
      eligibility: "Admission process. Check site.",
      phone: "972-774-1772", url: "https://www.shelton.org/admission/admission-faqs",
      sources: [{ label: "Shelton admission FAQs", url: "https://www.shelton.org/admission/admission-faqs" }, { label: "Shelton TEFA information", url: "https://www.shelton.org/admission/tefa-information" }]
    },
    {
      id: "sage", model: "private", name: "The Sage School of Dallas",
      org: "College-prep school for twice-exceptional (2e) students", city: "Dallas (75240)", miles: 14.1, grades: "5th-12th",
      cost: "2026-27: $35,000 tuition. The $2,500 enrollment fee counts toward tuition. New students also pay a $1,500 matriculation fee.", costMax: 36500,
      tags: ["twoE", "advanced", "autism", "attention", "social", "small"],
      summary: "Built for bright students who also face challenges with social-emotional skills, executive functioning or sensory processing. Teachers are trained to support 2e, ADHD and autistic learners.",
      points: ["Challenges students academically while supporting them emotionally."],
      eligibility: "Admission process. Check site.",
      phone: "214-584-6102", url: "https://sageschooldallas.org/",
      sources: [{ label: "Sage: Our Story", url: "https://sageschooldallas.org/our_story/" }, { label: "Sage tuition", url: "https://sageschooldallas.org/tuition/" }]
    },
    {
      id: "fairhill", model: "private", name: "Fairhill School",
      org: "College-prep school for bright students with learning differences", city: "North Dallas", miles: 12, grades: "1st-12th",
      cost: "Check site", costMax: null,
      tags: ["small", "attention", "exec", "twoE", "advanced", "behavior"],
      summary: "Rigorous academics with specialized support, for students of average to above-average intelligence. Its specialties include ADHD, executive function and twice-exceptional learners.",
      points: ["7:1 student-teacher ratio.", "Small classes and predictable routines, with attention to both the academic and behavioral sides of ADHD.", "A formal diagnosis is required. Autism isn't on its list of specialties, so ask whether it fits David."],
      eligibility: "Diagnosis plus records. Check site.",
      phone: "", url: "https://fairhillschool.org/",
      sources: [{ label: "Fairhill School", url: "https://fairhillschool.org/" }, { label: "Fairhill admission FAQs", url: "https://fairhillschool.org/admission-faqs/" }]
    },
    {
      id: "dallasacademy", model: "private", name: "Dallas Academy",
      org: "School for students with diagnosed learning differences", city: "Dallas (950 Tiffany Way, 75218)", miles: 21.5, grades: "1st-12th",
      cost: "Check site", costMax: null,
      tags: ["small", "autism", "attention", "advanced"],
      summary: "It serves students who are mostly of average to above-average ability, with diagnoses such as ADHD, ASD (Level 1) and nonverbal learning disability.",
      points: ["Its site says it may not suit students whose main need is an emotional or behavioral disorder, so discuss David's behavior needs openly."],
      eligibility: "Diagnosis plus readiness review. Check site.",
      phone: "214-324-1481", url: "https://www.dallas-academy.com/apps/pages/index.jsp?type=d&uREC_ID=364976",
      sources: [{ label: "Dallas Academy admissions", url: "https://www.dallas-academy.com/apps/pages/index.jsp?type=d&uREC_ID=364976" }]
    },
    {
      id: "winston", model: "private", name: "The Winston School",
      org: "College-prep school for bright students who learn differently", city: "Dallas (5707 Royal Lane, 75229)", miles: 16.9, grades: "K-12th",
      cost: "2026-27, grades 6-8: $35,192 tuition plus $3,100 student life fees = $38,292. New students pay a one-time $1,000 fee.", costMax: 39292,
      tags: ["small", "attention", "advanced"],
      summary: "A small college-prep school with individualized learning strategies.",
      points: ["Its board approved joining TEFA starting in 2027-28.", "Tuition assistance is offered."],
      eligibility: "Rolling admission. Check site.",
      phone: "214-691-6950", url: "https://www.winston-school.org/admission/tuition-assistance/tuition",
      sources: [{ label: "Winston tuition", url: "https://www.winston-school.org/admission/tuition-assistance/tuition" }]
    },
    {
      id: "oakhill", model: "private", name: "Oak Hill Academy",
      org: "School for students with autism and learning differences", city: "Dallas (9407 Midway Road, 75220)", miles: 18.5, grades: "PreK-12th",
      cost: "2026-27 middle school: $29,800 tuition plus $950 fees = $33,250 total. Financial aid goes through FACTS ($45 fee).", costMax: 33250,
      tags: ["autism", "social", "small", "behavior"],
      summary: "Social skills are the cornerstone of the curriculum, with weekly sessions. It also teaches emotion regulation and executive functioning, with on-site speech therapy, OT and counseling.",
      points: ["Average student-teacher ratio of 6:1.", "Nearly 30% of students get some tuition aid.", "It serves a wide range of needs. Ask how it keeps the work challenging for an academically capable student. Its high school has a Foundation track with Algebra I and Geometry."],
      eligibility: "Application. Check site.",
      phone: "214-353-8804", url: "https://oakhillacademy.org/",
      sources: [{ label: "Oak Hill: Mission and Services", url: "https://oakhillacademy.org/mission/" }, { label: "Oak Hill tuition", url: "https://oakhillacademy.org/tuition/" }]
    },
    {
      id: "ndaa", model: "private", name: "North Dallas Adventist Academy",
      org: "Seventh-day Adventist school", city: "Richardson (2800 Custer Parkway, 75080)", miles: 12.5, grades: "PreK-12th",
      cost: "Check site", costMax: null,
      tags: ["sda", "faith"],
      summary: "A Seventh-day Adventist school focused on academics, character and spiritual growth.",
      points: ["The Texas Conference's \"Educate for Eternity\" program gives financial help to new students in Adventist schools. Ask NDAA if it applies.", "Its site doesn't describe autism or behavior supports, so ask about class sizes and accommodations."],
      eligibility: "Admissions. Check site.",
      phone: "972-234-6322", url: "https://www.ndaacademy.org/our-school",
      sources: [{ label: "NDAA: Our School", url: "https://www.ndaacademy.org/our-school" }, { label: "Texas Conference Education (Educate for Eternity)", url: "https://www.texasadventist.org/departments/education/" }]
    },
    {
      id: "cambridge", model: "private", name: "The Cambridge School of Dallas",
      org: "Classical Christian school", city: "Dallas (3202 Royal Ln, 75229)", miles: 16.9, grades: "5th-12th",
      cost: "2026-27: grades 5-6 $26,400; grades 7-8 $27,150; grades 9-12 $31,150", costMax: 27150,
      tags: ["faith", "advanced"],
      summary: "A rigorous, mainstream classical Christian school.",
      points: ["It doesn't specialize in learning differences, so ask what supports it offers."],
      eligibility: "Admissions. Check site.",
      phone: "214-357-2995", url: "https://www.cambridgedallas.org/tuition-fees-aid",
      sources: [{ label: "Cambridge tuition and aid", url: "https://www.cambridgedallas.org/tuition-fees-aid" }]
    },
    {
      id: "highlands", model: "private", name: "The Highlands School",
      org: "Catholic college-prep school", city: "Irving (75062)", miles: 21.3, grades: "PreK3-12th",
      cost: "Check site", costMax: null,
      tags: ["faith", "advanced"],
      summary: "Liberal-arts college prep with a personalized approach.",
      points: ["It doesn't specialize in learning differences, so ask what supports it offers."],
      eligibility: "Admissions. Check site.",
      phone: "972-554-1980", url: "https://www.thehighlandsschool.org/about",
      sources: [{ label: "The Highlands School", url: "https://www.thehighlandsschool.org/about" }]
    },
    {
      id: "lakehill", model: "private", name: "Lakehill Preparatory School",
      org: "Independent college-prep school", city: "Dallas (2720 Hillside Dr, 75214)", miles: 22, grades: "K-12th",
      cost: "Check site", costMax: null,
      tags: ["advanced"],
      summary: "A mainstream K-12 college-prep school in East Dallas.",
      points: ["It doesn't specialize in learning differences, so ask what supports it offers."],
      eligibility: "Admissions. Check site.",
      phone: "214-826-2931", url: "https://www.lakehillprep.org/about/",
      sources: [{ label: "Lakehill: About", url: "https://www.lakehillprep.org/about/" }]
    }
  ];

  var NOT_INCLUDED = [
    { name: "Notre Dame School of Dallas", why: "It's designed for students with intellectual and developmental disabilities. David's intellect isn't affected, so it isn't a match.", url: "https://notredameschool.org/" },
    { name: "Starpoint School (TCU, Fort Worth)", why: "It serves ages 6 to 11 (its curriculum page says 6 to 12), so David has aged out. It's also far from Frisco.", url: "https://coe.tcu.edu/lab-schools/starpoint-school/about/index.php" },
    { name: "Autism Treatment Center educational program (Dallas)", why: "Students are placed in its TEA-approved school program, and their home district pays for it. ATC also offers outpatient speech, OT and ABA, which you could use alongside any school.", url: "https://www.atcoftexas.org/education.html" }
  ];

  /* ---------- Funding & financial help ---------- */
  var FUNDING = [
    {
      id: "tefa", level: "State", name: "Texas Education Freedom Accounts (TEFA), the state ESA from SB 2 (2025)",
      amount: "2026-27 amounts: $10,474 for a participating private school; up to $30,000 for a student with an IEP on file with TEA at a participating private school; $2,000 for homeschool and other settings.",
      status: "2026-27 applications are closed (they ran February 4 to March 17, 2026). Dates for 2027-28 haven't been announced. You can join the interest list now.",
      eligibility: "A Texas child eligible for public school. If there's more demand than money, students with a disability in households at or below 500% of the federal poverty level get top priority. The extra IEP funding depends on the home district and the IEP instructional code.",
      fit: ["private", "homeschool", "hybrid"], deadline: "2027-28: not announced",
      notes: "SB 106, a bill to repeal the ESA program, was filed for the 2027 session on November 9, 2026, and nothing has happened on it yet. The program remains law today. Funds that aren't used roll over while a student stays in the program. Fusion Plano, Shelton and Coram Deo accept TEFA, and Winston starts in 2027-28.",
      phone: "", url: "https://educationfreedom.texas.gov/families/",
      sources: [
        { label: "TEFA Families page", url: "https://educationfreedom.texas.gov/families/" },
        { label: "TEFA special education funding", url: "https://educationfreedom.texas.gov/newsupdates/special-education-funding/" },
        { label: "TEFA Parent Application Guide (PDF)", url: "https://educationfreedom.texas.gov/wp-content/uploads/2026/02/TEFA-Parent-Application-Guide.pdf" },
        { label: "SB 106 (90R) bill history", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=90R&Bill=SB106" }
      ]
    },
    {
      id: "pdses", level: "State", name: "Parent-Directed Special Education Services (PDSES), formerly SSES",
      amount: "One-time $1,500 grant for educational items and services (tutoring, therapy, technology, curriculum).",
      status: "The 2025-26 window closed April 30, 2026. The 2026-27 window is planned for spring 2027 (exact date not yet posted).",
      eligibility: "Must be enrolled in a Texas public school (Pre-K to 12th), getting special education services through an IEP, and never have received SSES or PDSES before. David qualifies only while he's enrolled in public school.",
      fit: ["public", "virtual"], deadline: "Spring 2027 (date TBA)",
      notes: "If you plan to leave public school, it may make sense to apply before withdrawing, but he has to stay eligible throughout. Sign up for email updates.",
      phone: "1-855-773-3839", url: "https://spedtex.tea.texas.gov/resources/pdses/application-process",
      sources: [
        { label: "PDSES application process", url: "https://spedtex.tea.texas.gov/resources/pdses/application-process" },
        { label: "PDSES FAQ", url: "https://spedtex.tea.texas.gov/resources/pdses/frequently-asked-questions" },
        { label: "TEA letter: SSES renamed PDSES", url: "https://tea.texas.gov/taa-letters/parent-directed-special-education-services-pdses-formerly-supplemental-special" }
      ]
    },
    {
      id: "idea", level: "Federal", name: "IDEA special education through Frisco ISD",
      amount: "Free. While he's enrolled, his IEP services (FAPE) come at no cost.",
      status: "Active now through his IEP.",
      eligibility: "Public school, including virtual public schools: full IEP rights. Homeschooled Frisco ISD residents: certain services through the district's Proportionate Share Plan, with a services plan instead of an IEP and no individual right to all services.",
      fit: ["public", "virtual", "homeschool", "private", "hybrid"], deadline: "Ongoing",
      notes: "Under TEA guidance, a homeschool counts as a private school for this purpose when it has a curriculum with scope and sequence and documents progress.",
      phone: "469-633-6900", url: "https://www.friscoisd.org/o/fisd/page/faq-specialed",
      sources: [
        { label: "Frisco ISD Special Education FAQ", url: "https://www.friscoisd.org/o/fisd/page/faq-specialed" },
        { label: "TEA guide: parentally placed private school children (PDF)", url: "https://spedsupport.tea.texas.gov/sites/default/files/2025-04/parentally-placed-private-school-children-quick-guide-and-faq.pdf" }
      ]
    },
    {
      id: "529", level: "Federal", name: "529 plan for K-12 costs (IRS)",
      amount: "Up to $20,000 per year per student for K-12 costs (it was $10,000 through December 31, 2025).",
      status: "Available now.",
      eligibility: "K-12 costs that qualify: tuition; curriculum and materials; books; tutoring or classes outside the home; standardized and AP test fees; dual enrollment; and educational therapies for students with disabilities from a licensed or accredited provider (OT, behavioral, PT, speech).",
      fit: ["private", "homeschool", "hybrid", "public", "virtual"], deadline: "Ongoing",
      notes: "Contributions aren't federally deductible, but earnings grow tax-free when used for qualified costs. Check with a tax professional.",
      phone: "", url: "https://www.irs.gov/taxtopics/tc313",
      sources: [{ label: "IRS Topic 313: Qualified tuition programs", url: "https://www.irs.gov/taxtopics/tc313" }]
    },
    {
      id: "coverdell", level: "Federal", name: "Coverdell Education Savings Account",
      amount: "Total contributions are limited to $2,000 per year per student, and income limits apply.",
      status: "Available now.",
      eligibility: "Can pay qualified K-12 costs. See IRS Publication 970, chapter on Coverdell ESAs, for the current limits.",
      fit: ["private", "homeschool", "hybrid", "public", "virtual"], deadline: "Ongoing",
      notes: "Ask a tax professional how it compares with a 529.",
      phone: "", url: "https://www.irs.gov/publications/p970",
      sources: [{ label: "IRS Publication 970", url: "https://www.irs.gov/publications/p970" }]
    },
    {
      id: "cap", level: "State", name: "HHS Children's Autism Program (focused ABA)",
      amount: "Focused ABA therapy through local contracted providers, up to 720 hours over a lifetime.",
      status: "Open. Contact a provider on the list.",
      eligibility: "An autism diagnosis from a qualified professional, younger than 21 (services end at the 22nd birthday), and Texas residency. Parent training is required, and attendance must stay at 85% or higher.",
      fit: ["public", "virtual", "homeschool", "private", "hybrid"], deadline: "Ongoing",
      notes: "Focused ABA targets specific behaviors or social skills, which fits David's needs.",
      phone: "512-438-5356", url: "https://www.hhs.texas.gov/services/disability/childrens-autism-program",
      sources: [{ label: "HHS Children's Autism Program", url: "https://www.hhs.texas.gov/services/disability/childrens-autism-program" }]
    },
    {
      id: "medicaid-aba", level: "State / Federal", name: "Texas Medicaid: ABA for children with autism",
      amount: "Covers medically necessary ABA and other autism services for Medicaid members.",
      status: "Applies only if David has Texas Medicaid.",
      eligibility: "Medicaid-enrolled children with autism under 21.",
      fit: ["public", "virtual", "homeschool", "private", "hybrid"], deadline: "Ongoing",
      notes: "There's a flyer linked on the Children's Autism Program page.",
      phone: "", url: "https://www.hhs.texas.gov/services/disability/childrens-autism-program",
      sources: [{ label: "HHS Children's Autism Program (Medicaid ABA flyer)", url: "https://www.hhs.texas.gov/services/disability/childrens-autism-program" }]
    },
    {
      id: "waivers", level: "State / County", name: "Medicaid waiver interest lists (HCS, TxHmL, CLASS, MDCP)",
      amount: "Long-term services and supports. What's covered depends on the program.",
      status: "Interest lists, served first-come, first-served. You must confirm you're still interested every 2 years.",
      eligibility: "Each program has its own rules. HCS and TxHmL are mostly for intellectual disabilities or related conditions, and MDCP is for children who are medically dependent. Because David's intellect isn't affected, ask whether he qualifies before counting on these.",
      fit: ["public", "virtual", "homeschool", "private", "hybrid"], deadline: "Ongoing",
      notes: "Collin County: LifePath Systems IDD at 972-727-9133 (HCS and TxHmL lists). CLASS, MDCP and other waivers: 1-877-438-5658.",
      phone: "972-727-9133", url: "https://www.hhs.texas.gov/about/records-statistics/interest-list-reduction",
      sources: [
        { label: "HHS: Interest List Reduction", url: "https://www.hhs.texas.gov/about/records-statistics/interest-list-reduction" },
        { label: "LifePath Systems IDD (Collin County)", url: "https://www.lifepathsystems.org/services/intellectual-developmental-disabilities/" }
      ]
    },
    {
      id: "ace", level: "Private", name: "ACE Scholarships Texas (Children's Scholarship Fund partner for Dallas-Fort Worth)",
      amount: "Partial private-school scholarships. Amounts vary, so check the site.",
      status: "Check the site for the current cycle.",
      eligibility: "Income-based, and he must attend an ACE partner school. Check the site.",
      fit: ["private"], deadline: "Check site",
      notes: "Applications go through the ACE portal.",
      phone: "", url: "https://www.acescholarships.org/apply-for-a-scholarship/texas/",
      sources: [{ label: "ACE Texas", url: "https://www.acescholarships.org/apply-for-a-scholarship/texas/" }, { label: "Children's Scholarship Fund: Apply", url: "https://scholarshipfund.org/apply/" }]
    },
    {
      id: "school-aid", level: "Private", name: "Financial aid from the schools themselves",
      amount: "Varies by school.",
      status: "Coram Deo 2027-28 priority aid deadline for new families: January 15, 2027.",
      eligibility: "Coram Deo uses Clarity ($65). Oak Hill uses FACTS ($45), and nearly 30% of its students get aid. Winston offers tuition assistance. Adventist schools in the Texas Conference have Educate for Eternity for new students.",
      fit: ["private", "hybrid"], deadline: "Jan 15, 2027 (Coram Deo, new families)",
      notes: "Apply early, because aid money runs out.",
      phone: "", url: "https://www.coramdeoacademy.org/admissions/tuition",
      sources: [
        { label: "Coram Deo financial aid", url: "https://www.coramdeoacademy.org/admissions/tuition" },
        { label: "Oak Hill financial aid", url: "https://oakhillacademy.org/tuition/" },
        { label: "Winston tuition assistance", url: "https://www.winston-school.org/admission/tuition-assistance/tuition" },
        { label: "Texas Conference: Educate for Eternity", url: "https://www.texasadventist.org/departments/education/" }
      ]
    },
    {
      id: "twc-vr", level: "State", name: "TWC Vocational Rehabilitation: Pre-Employment Transition Services", later: "Starts at age 14",
      amount: "Free job exploration, work-based learning, college counseling, workplace readiness and self-advocacy training.",
      status: "For later: David can start at 14.",
      eligibility: "Ages 14 to 22, enrolled in school (homeschool and private school count), and getting special education or qualifying under Section 504.",
      fit: ["public", "virtual", "homeschool", "private", "hybrid"], deadline: "When he turns 14",
      notes: "To start: call 512-936-6400 or email vr.office.locator@twc.texas.gov. Don't email an SSN or birthdate.",
      phone: "512-936-6400", url: "https://www.twc.texas.gov/programs/vocational-rehabilitation/youth-students",
      sources: [
        { label: "TWC VR: Youth & Students", url: "https://www.twc.texas.gov/programs/vocational-rehabilitation/youth-students" },
        { label: "TEA: Pre-ETS", url: "https://spedsupport.tea.texas.gov/resource-library/pre-employment-transition-services" }
      ]
    }
  ];

  var COULD_NOT_VERIFY = [
    "Collin County education grants for families: I couldn't find any official county program.",
    "A Dallas-area autism school scholarship: I couldn't find a verified program, so none is listed.",
    "ECI (Early Childhood Intervention) is for ages 0 to 3, so it's not listed.",
    "TEFA dates for 2027-28 and whether the 2027 Legislature changes the program aren't known yet.",
    "Published tuition for Shelton, Fairhill, Dallas Academy, NDAA, Duc in Altum, Highlands and Lakehill: check each site."
  ];

  /* ---------- Deadlines (verified dates only) ---------- */
  var DEADLINES = [
    { id: "d-cda-re", date: "2026-12-07", title: "Coram Deo 2027-28 financial aid priority deadline (re-enrolling families)", url: "https://www.coramdeoacademy.org/admissions/tuition", kind: "aid" },
    { id: "d-cda-new", date: "2027-01-15", title: "Coram Deo 2027-28 financial aid priority deadline (new families); Enrollment Covenant becomes binding after this date", url: "https://www.coramdeoacademy.org/admissions/tuition", kind: "aid" },
    { id: "d-tefa-past", date: "2026-03-17", title: "TEFA 2026-27 applications closed (they opened February 4, 2026)", url: "https://educationfreedom.texas.gov/families/", kind: "past" },
    { id: "d-pdses-past", date: "2026-04-30", title: "PDSES 2025-26 application window closed", url: "https://spedtex.tea.texas.gov/resources/pdses/application-process", kind: "past" }
  ];
  var TBA = [
    { title: "PDSES 2026-27 application window: spring 2027 (date TBA)", url: "https://spedtex.tea.texas.gov/resources/pdses/frequently-asked-questions" },
    { title: "TEFA 2027-28 application period: not announced (join the interest list)", url: "https://educationfreedom.texas.gov/families/" },
    { title: "iUniversity Prep 2027-28 applications: not open yet (fill out the interest form)", url: "https://www.iuniversityprep.org/page/apply" }
  ];

  /* ---------- Documents to gather (never type numbers into this app) ---------- */
  var DOCS = [
    { id: "iep", name: "Current IEP (Frisco ISD), including the instructional arrangement code page", why: "Every school and TEFA ask for it" },
    { id: "fiie", name: "Latest evaluation (FIIE) and any outside evaluations", why: "Admissions and support planning" },
    { id: "bip", name: "Behavior plan (BIP) or FBA, if he has one", why: "Shows what works for his behavior" },
    { id: "progress", name: "IEP progress reports", why: "Shows growth toward goals" },
    { id: "report", name: "Report cards and STAAR results", why: "Shows grade-level or advanced work" },
    { id: "mcps", name: "Maryland (MCPS) records: past IEPs, speech therapy and ESY", why: "Full history for a new school" },
    { id: "dx", name: "Autism diagnosis letter from a qualified professional", why: "Children's Autism Program and some schools" },
    { id: "birth", name: "Birth certificate", why: "Enrollment (Frisco Flex lists it)" },
    { id: "residency", name: "Proof of residency (utility bill or lease from the last 60 days)", why: "Public, virtual and Frisco Flex enrollment" },
    { id: "parentid", name: "Parent photo ID", why: "Enrollment" },
    { id: "immun", name: "Immunization records", why: "School enrollment" },
    { id: "income", name: "Income documents (tax return or pay stubs)", why: "TEFA priority groups and school financial aid" },
    { id: "withdraw", name: "Copy of the withdrawal letter or confirmation", why: "Needed if you homeschool" },
    { id: "hslog", name: "Homeschool curriculum list and progress records", why: "Proves a bona fide homeschool; helps if he returns to public school" }
  ];

  /* ---------- IEP & parent-rights resources ---------- */
  var SUPPORTS = [
    { name: "SPEDTex (TEA special education information center)", phone: "1-855-773-3839", url: "https://spedtex.tea.texas.gov/", what: "Free help understanding special education in Texas." },
    { name: "Notice of Procedural Safeguards (TEA, 2025)", phone: "", url: "https://spedtex.tea.texas.gov/resources/notice-procedural-safeguards", what: "Your legal rights as a parent of a student in special education." },
    { name: "Parent's Guide to the ARD Process (TEA, 2025)", phone: "", url: "https://spedtex.tea.texas.gov/sites/spedtex.tea.texas.gov/files/2026-05/ARD%20Guide%202025%20-%20English%20-%20ACC.pdf", what: "How ARD (IEP) meetings work in Texas." },
    { name: "PACT Project, Partners Resource Network (Region 10, which includes Frisco)", phone: "469-388-8662", url: "https://prntexas.org/texas-ptis/pact-project/", what: "Free parent training and one-on-one help, funded federally. Spanish line: 972-358-7014." },
    { name: "Disability Rights Texas (legal help intake)", phone: "1-800-252-9108", url: "https://disabilityrightstx.org/en/getting-help/how-to-apply-for-services/", what: "The state's protection and advocacy agency. Intake runs Monday to Thursday, 10 to noon and 1 to 3 Central." },
    { name: "Frisco ISD Special Education Department", phone: "469-633-6900", url: "https://www.friscoisd.org/o/fisd/page/contact-us-specialed", what: "Start with his case manager. The department has leads for diagnostics, speech, psychology and transition." },
    { name: "Frisco ISD Proportionate Share services (if homeschooled or in a non-profit private school in FISD)", phone: "469-633-6900", url: "https://www.friscoisd.org/o/fisd/page/faq-specialed", what: "Some services for Frisco ISD residents who leave public school." },
    { name: "Texas Home School Coalition (THSC)", phone: "", url: "https://thsc.org/requirements-to-homeschool-in-texas/", what: "Texas homeschool requirements, plus UIL help." },
    { name: "TEA: Home Schooling", phone: "512-463-9734", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling", what: "The state's homeschool page, including how returning to public school works." },
    { name: "UIL homeschool participation (SB 401)", phone: "", url: "https://www.uiltexas.org/policy/homeschool-faq", what: "Frisco ISD is on UIL's 2026-27 opt-out list, so a homeschooled student can join UIL activities at the closest school that allows it." }
  ];

  var IEP_CHANGES = [
    { move: "Stay in Frisco ISD", effect: "His IEP stays in place. Ask for an ARD meeting to add behavior, attention or social supports, or to request a GT (2E) referral." },
    { move: "Move to another Texas public or virtual public school", effect: "He keeps his IEP rights. Under federal rules, the new school must provide services comparable to his current IEP until it adopts that IEP or writes a new one.", url: "https://www.ecfr.gov/current/title-34/section-300.323" },
    { move: "Homeschool", effect: "His IEP ends. As a Frisco ISD resident, he may get some services under a services plan, with no individual right to all of them. Frisco ISD also does Child Find for homeschoolers.", url: "https://spedsupport.tea.texas.gov/sites/default/files/2025-04/parentally-placed-private-school-children-quick-guide-and-faq.pdf" },
    { move: "Private school", effect: "His IEP doesn't carry over. The school's own supports apply, and the district where the school sits may offer a services plan. With TEFA, his IEP on file with TEA can raise the award to as much as $30,000 at a participating school.", url: "https://educationfreedom.texas.gov/newsupdates/special-education-funding/" },
    { move: "Return to public school later", effect: "You can re-enroll him at any time. The district may assess his work for grade placement and will hold an ARD meeting about special education. Keep homeschool records.", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling" }
  ];

  /* ---------- Social: groups, co-ops and activities near Frisco ---------- */
  var SOCIAL = [
    { name: "PEERS® for Adolescents (Positive Path)", where: "400 Stonebrook Pkwy, Suite 601, Frisco 75036", phone: "469-209-9870", url: "https://positivepath.us/peers-social-skills-group/", what: "An evidence-based social-skills program developed at UCLA, for middle and high schoolers: 14 weekly 90-minute sessions. Parents attend their own sessions at the same time, and that's required." },
    { name: "Autism Response Team: Frisco Teen & Adolescent Center", where: "9560 Legacy Dr, Suite 270, Frisco 75033", phone: "877-772-7889", url: "https://autismresponseteam.com/teens-adolescents/frisco/", what: "ABA for ages 9 to 18, with twice-weekly small-group social sessions (6 teens, 2 therapists)." },
    { name: "Frisco ISD Teen Squad", where: "Frisco ISD", phone: "469-633-6900", url: "https://www.friscoisd.org/departments/special-education-family-support/programs-events/teen-squad", what: "For later (high school, 14+): a low-cost monthly social group for current Frisco ISD students with autism or social challenges, joined by recommendation." },
    { name: "Frisco Home Is School: clubs and park days", where: "Frisco", phone: "", url: "https://www.friscohis.org/faq/", what: "Weekly park day, plus a monthly Lego Club, Chess Club, Nature Club and field trips. Drama Club is for ages 13+." },
    { name: "N-Tech Homeschool Co-op", where: "Plano / Allen / Frisco / McKinney", phone: "", url: "https://n-tech.org/", what: "Weekly co-op classes with peers." },
    { name: "E.A.G.L.E. electives", where: "Frisco (Mondays)", phone: "", url: "https://eaglehomeschoolgroup.com/electives/", what: "Ten-week, small, hands-on elective classes." },
    { name: "Frisco Public Library: teen events and free tutoring", where: "8000 Dallas Pkwy, Frisco 75034", phone: "972-292-5669", url: "https://friscolibrary.com/teens/", what: "Teen clubs (for example, a Teen Anime Club) and Brainfuse online tutoring for grades K-12." },
    { name: "UIL activities as a homeschooler", where: "Closest district that allows it", phone: "", url: "https://thsc.org/advocacy/uilassistance/", what: "Frisco ISD opted out for 2026-27, so a homeschooled student can join at the closest school that allows homeschoolers." }
  ];

  /* ---------- Planner basics ---------- */
  var CURRICULUM = [
    { name: "Khan Academy", url: "https://www.khanacademy.org/", what: "Free math, grammar, science and history. It's self-paced, so he can move ahead when he's ready." },
    { name: "Texas Essential Knowledge and Skills (TEKS)", url: "https://tea.texas.gov/academics/curriculum-standards/teks-review/texas-essential-knowledge-and-skills", what: "The state's grade-level standards, to use as a checklist." },
    { name: "Frisco Public Library (Brainfuse, online courses)", url: "https://friscolibrary.com/teens/", what: "Free one-on-one online tutoring with a library card." },
    { name: "Texas Home School Coalition: getting started", url: "https://thsc.org/requirements-to-homeschool-in-texas/", what: "What Texas requires: reading, spelling, grammar, math and good citizenship." }
  ];
  var ATTENTION_TIPS = [
    "Use short work blocks with a visible timer (for example, 15 to 25 minutes), then a short movement break.",
    "Post a visual schedule for the day, and tell him ahead of time about changes.",
    "Break big assignments into small steps, and check off each step.",
    "Try \"first-then\": first one lesson, then a favorite activity.",
    "Use hands-on learning: building, measuring, experiments, field trips.",
    "Start at the same time each day, and keep a quiet, uncluttered work spot.",
    "Give choices (which subject first, pencil or keyboard) to build buy-in.",
    "Praise effort and specific good choices right away.",
    "Do harder subjects when he's most alert. Many kids focus best in the morning.",
    "Plan regular time with peers: co-op days, clubs, a social-skills group."
  ];
  var WEEK_TEMPLATES = {
    home5: { label: "Full homeschool (5 days)", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], school: [] },
    hybrid23: { label: "Hybrid: 2 days school, 3 days home (Tue/Thu on campus)", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], school: ["Tue", "Thu"] }
  };
  var SUBJECTS = ["Reading", "Spelling & grammar", "Math", "Good citizenship / history", "Science", "Movement / PE", "Social time"];

  root.DSO_DATA = {
    VERIFIED: VERIFIED, PROFILE_DEFAULT: PROFILE_DEFAULT, TAGS: TAGS, MODELS: MODELS, OPTIONS: OPTIONS, NOT_INCLUDED: NOT_INCLUDED,
    FUNDING: FUNDING, COULD_NOT_VERIFY: COULD_NOT_VERIFY, DEADLINES: DEADLINES, TBA: TBA, DOCS: DOCS, SUPPORTS: SUPPORTS,
    IEP_CHANGES: IEP_CHANGES, SOCIAL: SOCIAL, CURRICULUM: CURRICULUM, ATTENTION_TIPS: ATTENTION_TIPS, WEEK_TEMPLATES: WEEK_TEMPLATES, SUBJECTS: SUBJECTS
  };
})(typeof window !== "undefined" ? window : globalThis);
