/* =========================================================================
   Modules – expert video, hacker mission (recognition-oriented), reveal
   -------------------------------------------------------------------------
   Each mission is a comprehension game: participants put themselves in the
   attacker's shoes by ASSESSING which building block makes an attack
   effective – and then immediately see the protective action.
   No real tools, templates or step-by-step instructions are taught.
   Fictional company: TalentBridge Ltd.

   Gamification fields:
   - difficulty: "easy" | "medium" | "hard"  → weights the points earned
   - key:   collectible reward per module; all keys open the "company gate"
   - badge: themed achievement shown on completion
   - mission.steps[].hint: optional nudge (costs points), never the answer
   - requiresKeys: module stays locked until that many keys are collected

   video.url: leave empty until the expert video is available.
   available: true = playable in the test phase (per concept, modules 1 and 3).
   ========================================================================= */

window.MODULES = [
  {
    id: "m1", number: 1, title: "Phishing and account takeover", icon: "✉️", available: true,
    difficulty: "easy",
    key:   { name: "Mailbox key", icon: "🔑" },
    badge: { name: "Phishing Spotter", icon: "🎯" },
    loot: "Mailbox login credentials", lootLevel: 5,
    why: "The most common entry point. Humans are involved in around 60% of data breaches.",
    video: {
      expert: "IT Security", duration: "approx. 10 min", url: "media/modul1_phishing.mp4",
      summary: "An animated film that follows recruiter Maya and a security coach through how a phishing attack really works – and the simple habit that stops it.",
      points: [
        ["Why a work account is a target", "Your mailbox is a door to everything connected to it – candidates, clients, colleagues and documents."],
        ["What the attacker is looking for", "Login access that looks legitimate, and the data and reach that come with it."],
        ["Why phishing works on careful people", "A message feels familiar or urgent, not obviously fake – that is what lowers your guard."],
        ["The warning signs to check", "Is it expected? Does the request fit? Any unusual step, link, QR code or attachment? Judge by context, not by how polished it looks."],
        ["The habit that stops it", "Pause, check the context, and verify through a known, independent channel – never the details in the message. Already clicked? Report it promptly."]
      ]
    },
    mission: {
      intro: "Put yourself in the attacker's shoes. At each step, assess which choice makes a phishing attempt most dangerous. Afterwards you'll see exactly how it could have been recognised.",
      target: "A recruiter's mailbox",
      steps: [
        { q: "Which bait creates the most pressure?", hint: "Think about which message forces a quick reaction.", options: [
            { t: "“Your account expires today at 17:00”", risk: 3, why: "Artificial time pressure is the classic warning sign – real portals don't lock you out with a minute countdown." },
            { t: "“Monthly newsletter”", risk: 1, why: "Without pressure to act, the bait barely lands." },
            { t: "“Request for feedback on the website”", risk: 1, why: "No pressure, little click impact." } ] },
        { q: "Which detail makes the sender more credible – and is at the same time the giveaway?", hint: "Look closely at the address itself, not the display name.", options: [
            { t: "An address that resembles the portal's but isn't exactly right", risk: 3, why: "Near-identical senders are the key thing to check: always read the address character by character." },
            { t: "An obvious throwaway address", risk: 1, why: "Too crude – recognised and reported straight away." },
            { t: "No sender name at all", risk: 1, why: "Looks dubious and gets ignored." } ] },
        { q: "What raises the success rate the most?", hint: "Where does the victim end up typing their password?", options: [
            { t: "A link to a cloned login page", risk: 3, why: "That's why the rule is: never sign in via links in messages – open the portal yourself." },
            { t: "A request to call back", risk: 2, why: "A second channel gives the target time to think." },
            { t: "An attachment to print out", risk: 1, why: "Cumbersome, low impact." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "Opening the portal via your own bookmark instead of the link, checking the sender address character by character, and becoming suspicious under time pressure. MFA would also have devalued any stolen passwords.",
      stops: ["Time pressure → pause instead of clicking right away", "Almost-genuine sender → read the address carefully", "Link to the login page → open the portal yourself, not via the link"]
    }
  },

  {
    id: "m2", number: 2, title: "Malware in application documents", icon: "📎", available: false,
    difficulty: "medium",
    key:   { name: "HR workstation key", icon: "🔑" },
    badge: { name: "Attachment Guard", icon: "📎" },
    loot: "Remote access to the HR computer", lootLevel: 5,
    why: "Recruiters have to open attachments from strangers. Targeted campaigns against HR in 2025.",
    video: { expert: "IT Security", duration: "3–5 min", url: "", summary: "How booby-trapped files work and how to handle attachments safely.", points: [] },
    mission: { intro: "Not yet unlocked in the test phase.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  },

  {
    id: "m3", number: 3, title: "CEO fraud", icon: "👔", available: true,
    difficulty: "medium",
    key:   { name: "Executive-floor key", icon: "🔑" },
    badge: { name: "CEO-Fraud Shield", icon: "🛡️" },
    loot: "Candidate profiles, possibly payment", lootLevel: 4,
    why: "Rising sharply in Switzerland: 970 reports to the NCSC in 2025 (2023: 484).",
    video: {
      expert: "Finance", duration: "3–5 min", url: "",
      summary: "Why an instruction “from the top” is so hard to question – and how the approval process protects you.",
      points: [
        ["What does the attack want?", "To trigger an urgent release of data or a payment before anyone asks questions."],
        ["Which weakness?", "Hierarchy and helpfulness: we're reluctant to contradict an instruction from the boss."],
        ["Why does the deception work?", "A genuine name, confidentiality, time pressure and often a call that “confirms” the email."],
        ["Who is affected?", "Candidates (data loss) and the company (direct financial damage)."],
        ["What stops the attack?", "Checking back through a known second channel and the four-eyes approval process."]
      ]
    },
    mission: {
      intro: "Put yourself in the attacker's shoes. Assess which choice makes a forged boss instruction most convincing. Afterwards you'll see what would have exposed it.",
      target: "Candidate profiles for “Client X”",
      steps: [
        { q: "Which role gives the request the most weight?", hint: "Who is hardest to say no to?", options: [
            { t: "CEO / executive management", risk: 3, why: "Authority is the lever – which is exactly why it counts as a warning sign, not a free pass." },
            { t: "A colleague from the neighbouring team", risk: 1, why: "Little pressure, easy to question." },
            { t: "An external applicant", risk: 1, why: "Has no authority to give instructions." } ] },
        { q: "Which addition raises the pressure the most?", hint: "What discourages you from checking with anyone else?", options: [
            { t: "“Confidential” plus a tight deadline", risk: 3, why: "Confidentiality is meant to prevent the normal check-back – a typical pattern." },
            { t: "A friendly greeting", risk: 1, why: "Does not raise the pressure." },
            { t: "A mention of the coffee break", risk: 1, why: "Irrelevant." } ] },
        { q: "What makes the request seem most genuine?", hint: "A second contact from the same person doesn't prove the first was real.", options: [
            { t: "A call that “confirms” the email", risk: 3, why: "Two channels from the same attacker are not a genuine confirmation – that's why the check-back must go through an independently known channel." },
            { t: "A long block of boilerplate text", risk: 1, why: "More likely to raise suspicion." },
            { t: "Several spelling mistakes", risk: 1, why: "Lower the credibility." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "Checking back through an independently known channel (a direct line from the directory, or in person) and following the approval process. Urgency and confidentiality are warning signs, not reasons to skip the process.",
      stops: ["Authority → still verify the instruction via a second channel", "Time pressure + “confidential” → deliberately pause", "Confirmation call → only an independent channel counts"]
    }
  },

  {
    id: "m4", number: 4, title: "Fake candidates and deepfakes", icon: "🎭", available: false,
    difficulty: "medium",
    key:   { name: "Identity key", icon: "🔑" },
    badge: { name: "Deepfake Detector", icon: "🎭" },
    loot: "Access to client systems, salary", lootLevel: 4,
    why: "Growing fast. Staffing agencies place people with clients and share the liability.",
    video: { expert: "HR / Recruiting", duration: "3–5 min", url: "", summary: "How to spot forged profiles and deepfake interviews.", points: [] },
    mission: { intro: "Not yet unlocked in the test phase.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  },

  {
    id: "m5", number: 5, title: "Ransomware and data exfiltration", icon: "🔒", available: false,
    difficulty: "hard", requiresKeys: 4,
    key:   { name: "Data-centre key", icon: "🔑" },
    badge: { name: "Ransomware First Responder", icon: "🔒" },
    loot: "The entire data set, ransom", lootLevel: 5,
    why: "The greatest damage. ManpowerGroup franchise Lansing in 2025 with around 145,000 people affected.",
    video: { expert: "Data Protection", duration: "3–5 min", url: "", summary: "How ransomware gets in and what to do in an emergency.", points: [] },
    mission: { intro: "Not yet unlocked in the test phase. Builds on the other modules and shows the whole attack chain.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  }
];

/* ---------- Defense level (inbox) ----------
   Mixed messages: attacks + harmless, genuine messages.
   action: the correct action. attack: true/false. */
window.DEFENSE_INBOX = [
  { id: "d1", from: "Applicant Portal Service", subject: "Account expires in 2 hours – sign in now", preview: "Sign in immediately via the following link, or your access will be deleted.", attack: true, type: "Phishing", action: "report", why: "Time pressure and signing in via a link – open the portal yourself instead and report it." },
  { id: "d2", from: "Sandra Meier (colleague)", subject: "Lunch on Thursday?", preview: "Do you have time for a quick lunch on Thursday?", attack: false, type: "Harmless", action: "process", why: "A normal internal message with no risk." },
  { id: "d3", from: "M. Keller, CEO", subject: "CONFIDENTIAL – urgent candidate profiles", preview: "I need all profiles for Client X in 20 min. Please don't discuss with the team.", attack: true, type: "CEO fraud", action: "verify", why: "Authority + pressure + secrecy: verify through a known second channel." },
  { id: "d4", from: "Lukas B. (applicant)", subject: "CV_final.zip", preview: "My CV is attached as a ZIP, password: 1234. Please take a quick look.", attack: true, type: "Malicious application", action: "report", why: "A password-protected ZIP from an unknown sender bypasses the virus scanner: have it submitted via the applicant portal." },
  { id: "d5", from: "Client Zattoo Ltd", subject: "Invoice as discussed", preview: "Please find attached the invoice we agreed on by phone yesterday.", attack: false, type: "Harmless", action: "process", why: "Expected context from the usual address – process as normal." },
  { id: "d6", from: "IT Support (external)", subject: "Please share your code", preview: "For maintenance we need your SMS login code. Please reply.", attack: true, type: "Phishing / vishing", action: "report", why: "Genuine support never asks for your login code." }
];
