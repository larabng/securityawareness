/* =========================================================================
   Inside the Mind of a Hacker – Content
   -------------------------------------------------------------------------
   Learning format per the concept: attacker's perspective, but recognition-
   and defense-oriented. The missions do NOT ask how to build a real attack;
   instead they let participants see through the mechanism and choose the
   right protective action. Fictional company, no real tooling.
   To change content, edit only this file.
   ========================================================================= */

window.APP_DATA = {

  config: {
    title: "Inside the Mind of a Hacker",
    subtitle: "Cybersecurity awareness from the attacker's perspective",
    company: "TalentBridge Ltd (fictional staffing agency)",
    season: "HS26 · Round 1",
    topTeamsVisible: 3,
    adminPin: "2026",
    teams: ["Team Firewall", "Team Patch", "Team Bitlocker", "Team Captcha", "Team Sandbox", "Team Honeypot"]
  },

  /* ---------- Surveys (pre / post) ----------
     Pre = cybersecurity survey; post = scenario questions. The solution (correct) is NEVER shown
     to participants – it is only used for evaluation in the export. */
  surveys: {
    /* ---------- Pre-survey: cybersecurity survey (20 questions, anonymous) ----------
       Question types: text, textarea, single, multi, slider, number,
       matrix (one scale per row), dual (two scales per row).
       "correct" is NEVER shown to participants – only used in the export.
       required: false = optional question (default: required). */
    pre: [
      // A – About you
      { id: "d3", section: "About you", type: "single", text: "Gender",
        options: ["Female", "Male", "Non-binary / diverse", "Prefer not to say"] },
      { id: "d4", section: "About you", type: "single", text: "Age",
        options: ["Under 25", "25–34", "35–44", "45–54", "55 or older"] },
      { id: "d5", section: "About you", type: "single", text: "Which area do you work in?",
        options: ["Recruiting / HR consulting", "Internal HR", "Finance / Payroll", "Sales / Key Account", "IT", "Management", "Other"] },
      { id: "d6", section: "About you", type: "single", text: "How do you mainly work?",
        options: ["Office only", "Mostly in the office", "Hybrid (about 50:50)", "Mostly remote", "Remote only"] },

      // B – Self-assessment and perception
      { id: "s1", section: "Your self-assessment", type: "slider", min: 1, max: 10,
        text: "How confident are you that you would recognise a phishing attack?",
        minLabel: "Not confident at all", maxLabel: "Completely confident" },
      { id: "s2", section: "Your self-assessment", type: "slider", min: 1, max: 10,
        text: "How attractive a target do you think you are for cybercriminals in your role?",
        minLabel: "Not attractive at all", maxLabel: "Very attractive" },
      // Anchoring question: s3 sets the anchor (USD 80 million), s4 collects the free estimate.
      // Reference for the evaluation: FBI IC3 2025 report – USD 20.8 billion reported losses (USA only).
      { id: "s3", section: "Your self-assessment", type: "single",
        text: "Do you think criminals make more or less than USD 80 million a year from data breaches and cyberattacks?",
        options: ["More than USD 80 million", "Less than USD 80 million"] },
      { id: "s4", section: "Your self-assessment", type: "number",
        text: "And what do you think the actual amount is per year?",
        hint: "Your best guess – enter a number and choose the unit." },

      // C – Experience
      { id: "e1", section: "Your experience", type: "multi",
        text: "Through which channels have you received suspicious messages in the past 12 months?",
        hint: "Select all that apply.",
        options: ["Email", "Text message (SMS)", "Phone call", "Teams / internal chat", "LinkedIn", "WhatsApp", "QR code (e.g. on a letter or poster)", "None of these"] },
      { id: "e2", section: "Your experience", type: "single",
        text: "Have you ever experienced one of the following situations at work?",
        hint: "If several apply, choose the most serious one.",
        options: ["I clicked a suspicious link but didn't enter anything", "I opened a suspicious attachment", "I entered login details on a suspicious page", "None of the above ever happened to me", "I'm not sure if any of the above ever happened to me"] },

      // D – Behaviour
      { id: "b1", section: "Your behaviour", type: "matrix",
        text: "How often do you do the following?",
        scale: ["Never", "Rarely", "Sometimes", "Often", "Always"],
        rows: ["I check the sender's email address carefully", "I check where a link leads before I click it", "I open attachments from unknown applicants directly", "I use the same password for several accounts", "I lock my screen when I leave my desk"] },
      { id: "b2", section: "Your behaviour", type: "matrix",
        text: "How much do you agree with the following statements?",
        scale: ["Strongly disagree", "Disagree", "Somewhat disagree", "Neutral", "Somewhat agree", "Agree", "Strongly agree"],
        rows: ["I would question an urgent instruction from the CEO", "Security rules slow down my work", "I know whom to report a security incident to", "I would report an incident even if I made the mistake myself"] },

      // E – Recognising attacks (knowledge, scored in the export)
      { id: "k1", section: "Recognise the attack", type: "multi",
        text: "Which of these are warning signs of a phishing or fraud attempt?",
        hint: "Select all that apply.",
        options: ["Time pressure (“today”, “within 20 minutes”)", "A sender address that differs slightly from the real one", "A request to keep it confidential", "Signing in via a link in the message", "A password-protected ZIP attachment", "You are addressed by your name", "The company logo is shown", "Flawless language"],
        correct: [0, 1, 2, 3, 4] },
      { id: "k2", section: "Recognise the attack", type: "single",
        text: "The CEO emails you: “Confidential. I need all candidate profiles for Client X within 20 minutes.” What do you do?",
        options: ["Send the profiles immediately", "Reply to the email and ask whether it's genuine", "Call the number given in the email", "Check back with the CEO via a known channel (e.g. number from the directory)", "Ignore the email", "Forward it to a colleague"],
        correct: 3 },
      { id: "k3", section: "Recognise the attack", type: "single",
        text: "An applicant sends her CV as a password-protected ZIP file. What do you do?",
        options: ["Open it – applications have to be processed", "Scan it with antivirus first, then open it", "Ask a colleague what to do", "Ask the applicant to upload the documents via the applicant portal and report the email", "Delete the email without a word"],
        correct: 3 },
      { id: "k4", section: "Recognise the attack", type: "single",
        text: "You have just clicked a link in a phishing email. What do you do first?",
        options: ["Nothing – probably nothing happened", "Change my password and tell no one", "Report it to IT immediately", "Restart my computer", "Wait and see whether anything happens"],
        correct: 2 },

      // F – Risk vs. preparedness (gap = relevance − preparedness)
      { id: "g1", section: "Risk vs. preparedness", type: "dual",
        text: "For each threat, rate how relevant it is to your work and how well prepared you feel.",
        hint: "1 = very low · 5 = very high",
        cols: [ { label: "Relevance to my work", scale: ["1", "2", "3", "4", "5"] },
                { label: "How prepared I feel",  scale: ["1", "2", "3", "4", "5"] } ],
        rows: ["Phishing", "Malware in application documents", "CEO fraud", "Fake candidates and deepfakes", "Ransomware"] },

      // G – Training and protection
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
    post: [
      { id: "post1", topic: "Phishing",
        text: "A text message: “LinkedIn: your recruiter account has been suspended. Confirm your identity.” With a link. What do you do?",
        options: ["Open the link and enter your details so the account works again", "Reply to the text and ask whether it's genuine", "Don't click; open LinkedIn directly in the app and report the message", "Ignore the message and keep working"],
        correct: 2 },
      { id: "post2", topic: "Malicious application",
        text: "A candidate sends a LinkedIn link to “CV_final.zip” on an unknown file host. How do you proceed?",
        options: ["Download and open it – the candidate sounds promising", "Ask the candidate to submit the documents via the applicant portal and report the message", "Put the file on a USB stick and take it to another computer", "Forward the link to the recruiting team"],
        correct: 1 },
      { id: "post3", topic: "CEO fraud",
        text: "A caller introduces himself as the CFO; the voice sounds genuine. He demands that you have CHF 48,000 transferred to a new supplier today. What do you do?",
        options: ["Make the payment immediately – the voice was unmistakable", "Ask for written confirmation by email and then pay", "Hang up, call the CFO back on the known number and follow the approval process", "Transfer half and the rest tomorrow"],
        correct: 2 },
      { id: "post4", topic: "Fake candidate / deepfake",
        text: "A candidate has a perfect CV, but the LinkedIn profile is two weeks old. He wants to work remotely only and have his salary sent to an account abroad. What do you do?",
        options: ["Refer him – the qualifications fit", "Verify the identity additionally (references, live ID, a meeting) and document the anomalies", "Reject him immediately, without giving a reason", "Ask him to create a new LinkedIn profile"],
        correct: 1 },
      { id: "post5", topic: "Ransomware",
        text: "A colleague says that on the team drive many files suddenly end in “.locked”. What is the first correct step?",
        options: ["Try to rename the files", "Disconnect your own computer from the network and inform IT immediately", "Wait and see – maybe it's an update", "Copy the files to your own desktop"],
        correct: 1 },
      { id: "post6", topic: "Judgement",
        text: "A known client sends, from the usual address, the invoice you discussed by phone last week. What do you do?",
        options: ["Process the invoice as normal", "Report the email to IT just to be safe", "Call the client back on a second channel", "Reject the invoice"],
        correct: 0 }
    ],
    feedback: [
      { id: "fb_fun", text: "How much did you enjoy the training?" },
      { id: "fb_clear", text: "How clear was the content?" },
      { id: "fb_relevant", text: "How relevant is what you learned to your everyday work?" },
      { id: "fb_perspective", text: "Did the change of perspective help you understand attacks?" }
    ],
    confidenceLabels: ["Guessed", "Rather unsure", "So-so", "Fairly sure", "Very sure"]
  }
};
