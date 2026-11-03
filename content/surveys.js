/* =========================================================================
   Surveys – measurement design (pre / post)
   -------------------------------------------------------------------------
   Goal: show whether the training made a difference. Everything we compare
   is asked the same way before AND after:
     - repeated:  identical items in both surveys (self-assessment,
                  attitude, warning signs) – referenced via { use: "<id>" }
     - scenarios: 8 everyday situations in two parallel forms A and B.
                  Each run gets A before / B after or the other way round
                  (random, exported as form_order), so a harder form
                  cannot fake a learning effect.
   Scenario answers use the same four actions as the defense level and are
   scored like it: best = 2, accept = 1, anything else = 0.
   The solution is NEVER shown to participants – it is only used in the export.

   Question types: text, textarea, single, multi, slider, number,
   matrix (one scale per row; optional keys = column names in the export),
   dual (two scales per row). conf: true = "How sure are you?" below the item.
   required: false = optional. onlyIf: "anchor" = only shown to the anchor group.
   ========================================================================= */
CONTENT.surveys = {
  actions: {
    process: "Process it as normal",
    verify:  "Verify it first via a known, separate channel",
    report:  "Report it to IT / security",
    reject:  "Reject or delete it"
  },
  confidenceLabels: ["Guessed", "Rather unsure", "So-so", "Fairly sure", "Very sure"],

  /* ---------- Parallel scenarios (one slot = same mechanism, A and B differ in surface) ----------
     Order is fixed and the same for both forms; harmless slots are mixed in. */
  scenarios: [
    { slot: "phishing", module: "m1", attack: true,
      A: { text: "An email from “Microsoft 365”: “Your mailbox is full. From today, new messages will be rejected – click here to add free storage.” Last week you did get a notice that your mailbox was almost full.",
           best: "report", accept: ["reject"] },
      B: { text: "A text message on your work phone: “Your parcel is on hold at customs. Pay the CHF 1.95 fee here to release it.” You are expecting a delivery this week.",
           best: "report", accept: ["reject"] } },
    { slot: "harmless1", attack: false,
      A: { text: "Your team lead tells you at your desk that she has just emailed you the client shortlist. A minute later the email arrives from her usual address, with a PDF attached.",
           best: "process" },
      B: { text: "A candidate you interviewed yesterday emails you from the address you have been using with him, attaching the reference letter you asked him for.",
           best: "process" } },
    { slot: "ceo", module: "m3", attack: true,
      A: { text: "A WhatsApp message from an unknown number with the CEO’s profile photo: “This is my new number. I’m in a meeting – please buy five CHF 200 gift cards for a client event and send me the codes.”",
           best: "verify", accept: ["report"] },
      B: { text: "An email from the CFO: “Please update supplier Y’s bank details in the system before today’s payment run – I’m boarding a plane and can’t be reached until tomorrow.”",
           best: "verify", accept: ["report"] } },
    { slot: "malware", module: "m2", attack: true,
      A: { text: "An application for an advertised job arrives with the CV attached as “CV_Anna_Meier.pdf.exe”.",
           best: "report", accept: ["reject"] },
      B: { text: "You open a PDF CV from an applicant. Windows suddenly asks: “Do you want to allow this app to make changes to your device?”",
           best: "report", accept: ["reject"] } },
    { slot: "fake", module: "m4", attack: true,
      A: { text: "In a video interview, the candidate’s lip movements lag slightly behind his voice. When you ask him to turn his head or hold his ID up to the camera, he says his connection is too weak.",
           best: "verify", accept: ["report"] },
      B: { text: "A remote candidate with a flawless CV accepts the offer within an hour. He asks for the laptop to be sent to an address other than the one on his CV and wants to communicate by chat only.",
           best: "verify", accept: ["report"] } },
    { slot: "harmless2", attack: false,
      A: { text: "In last week’s team meeting, IT announced new laptops. Today the usual IT service desk address emails you: “Your new laptop is ready – pick it up at reception on Thursday.” No link, no attachment.",
           best: "process" },
      B: { text: "Payroll sends its monthly email from the usual address: “Your October payslip is now available – open the HR portal as usual.” No link, no attachment.",
           best: "process" } },
    { slot: "mistake", module: "m1", attack: true,
      A: { text: "You clicked a link in an email and entered your password – only then did you notice that the page address was slightly wrong.",
           best: "report" },
      B: { text: "You opened an attachment from an unknown applicant. Nothing visible happened, but now you are unsure whether it was genuine.",
           best: "report" } },
    { slot: "ransomware", module: "m5", attack: true,
      A: { text: "Your screen suddenly shows: “Your files have been encrypted. Pay 2 Bitcoin within 48 hours.”",
           best: "report" },
      B: { text: "Your computer becomes very slow, the fan runs at full speed, and the file names in your Documents folder change one after another.",
           best: "report" } }
  ],

  /* ---------- Items asked identically before and after ---------- */
  repeated: {
    prep: { type: "matrix",
      text: "How well could you recognise each of these attacks in your everyday work today?",
      hint: "1 = not at all · 5 = very well",
      scale: ["1", "2", "3", "4", "5"],
      rows: ["Phishing", "Malware in application documents", "CEO fraud", "Fake candidates and deepfakes", "Ransomware"],
      keys: ["phishing", "malware", "ceo", "fake", "ransomware"] },
    target: { type: "slider", min: 1, max: 10,
      text: "How attractive a target do you think you are for cybercriminals in your role?",
      minLabel: "Not attractive at all", maxLabel: "Very attractive" },
    att: { type: "matrix",
      text: "How much do you agree with the following statements?",
      scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
      rows: ["I would question an urgent instruction from the CEO", "I know whom to report a security incident to", "I would report an incident even if I made the mistake myself", "Security rules slow down my work"],
      keys: ["question_ceo", "know_whom", "report_own_mistake", "rules_slow"] },
    k1: { type: "multi", conf: true,
      text: "Which of these are warning signs of a phishing or fraud attempt?",
      hint: "Select all that apply.",
      options: ["Time pressure (“today”, “within 20 minutes”)", "You are addressed by your name", "A sender address that differs slightly from the real one", "The company logo is shown", "A request to keep it confidential", "Signing in via a link in the message", "Flawless language", "A password-protected ZIP attachment"],
      correct: [0, 2, 4, 5, 7] }
  },

  /* ---------- Pre-survey (mandatory before the modules) ---------- */
  pre: [
    // About you – kept coarse on purpose so small groups stay anonymous
    { id: "d4", section: "About you", type: "single", text: "Age",
      options: ["Under 35", "35–49", "50 or older", "Prefer not to say"] },
    { id: "d5", section: "About you", type: "single", text: "Which area do you work in?",
      options: ["Recruiting / consulting", "Internal HR, payroll or finance", "Sales / key account", "Other (e.g. IT, management)", "Prefer not to say"] },

    // Experience and habits (baseline only)
    { id: "e1", section: "Your experience", type: "multi",
      text: "Through which channels have you received suspicious messages in the past 12 months?",
      hint: "Select all that apply.",
      options: ["Email", "Text message (SMS)", "Phone call", "Teams / internal chat", "LinkedIn", "WhatsApp", "QR code (e.g. on a letter or poster)", "None of these"] },
    { id: "e2", section: "Your experience", type: "single",
      text: "Have you ever experienced one of the following situations at work?",
      hint: "If several apply, choose the most serious one.",
      options: ["I clicked a suspicious link but didn't enter anything", "I opened a suspicious attachment", "I entered login details on a suspicious page", "None of the above ever happened to me", "I'm not sure if any of the above ever happened to me"] },
    { id: "b1", section: "Your habits", type: "matrix",
      text: "How often do you do the following?",
      scale: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      rows: ["I check the sender's email address carefully", "I check where a link leads before I click it", "I open attachments from unknown applicants directly", "I use the same password for several accounts", "I lock my screen when I leave my desk"],
      keys: ["check_sender", "check_link", "open_attachments", "same_password", "lock_screen"] },

    // Self-assessment (repeated after the training)
    { use: "target", section: "Your self-assessment" },
    { id: "rel", section: "Your self-assessment", type: "matrix",
      text: "How relevant is each of these threats to your work?",
      hint: "1 = not relevant · 5 = very relevant",
      scale: ["1", "2", "3", "4", "5"],
      rows: ["Phishing", "Malware in application documents", "CEO fraud", "Fake candidates and deepfakes", "Ransomware"],
      keys: ["phishing", "malware", "ceo", "fake", "ransomware"] },
    { use: "prep", section: "Your self-assessment" },
    { use: "att", section: "Your attitude" },

    // Anchoring: only the anchor group sees s3 (random per run, exported as anchor_group).
    // Reference for the evaluation: FBI IC3 2025 report – USD 20.8 billion reported losses (USA only).
    { id: "s3", section: "An estimate", type: "single", onlyIf: "anchor",
      text: "Do you think criminals make more or less than USD 80 million a year from data breaches and cyberattacks?",
      options: ["More than USD 80 million", "Less than USD 80 million"] },
    { id: "s4", section: "An estimate", type: "number",
      text: "How much do you think criminals make per year from data breaches and cyberattacks?",
      hint: "Your best guess – enter a number and choose the unit." },

    // Knowledge (repeated after the training)
    { scenarios: true, section: "Everyday situations" },
    { use: "k1", section: "Recognise the attack" },

    // Training and protection (baseline only)
    { id: "t1", section: "Training and protection", type: "single",
      text: "When did you last attend a cybersecurity training?",
      options: ["In the last 6 months", "6–12 months ago", "1–2 years ago", "More than 2 years ago", "Never", "I don't know"] },
    { id: "t2", section: "Training and protection", type: "multi",
      text: "Which of these protective measures do you use at work?",
      hint: "Select all that apply.",
      options: ["Multi-factor authentication (MFA)", "Password manager", "VPN when working remotely", "Report-phishing button", "Automatic updates", "Screen lock", "None of these"] },
    { id: "t3", section: "Training and protection", type: "multi",
      text: "Which learning formats do you prefer?",
      hint: "Select all that apply.",
      options: ["Short videos", "Gamified training (like this one)", "Phishing simulations", "E-learning modules", "Classroom sessions", "Newsletter / tips"] }
  ],

  /* ---------- Post-survey (after the defense level) ---------- */
  post: [
    { use: "target", section: "Your self-assessment" },
    { use: "prep", section: "Your self-assessment" },
    { use: "att", section: "Your attitude" },
    { scenarios: true, section: "Everyday situations" },
    { use: "k1", section: "Recognise the attack" },
    { id: "fb", section: "Feedback on the training", type: "matrix",
      text: "How much do you agree?",
      hint: "1 = not at all · 5 = very much",
      scale: ["1", "2", "3", "4", "5"],
      rows: ["I enjoyed the training", "The content was clear", "What I learned is relevant to my everyday work", "Seeing the attacker's perspective helped me understand attacks"],
      keys: ["fun", "clear", "relevant", "perspective"] },
    { id: "fb_change", section: "Feedback on the training", type: "textarea", required: false,
      text: "What will you do differently from tomorrow?" },
    { id: "fb_missing", section: "Feedback on the training", type: "textarea", required: false,
      text: "What was missing or unclear?" }
  ]
};
