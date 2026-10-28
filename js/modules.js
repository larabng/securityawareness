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
   available: true = playable. Module 5 additionally needs 4 keys (requiresKeys).
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
            { t: "“Your account will be locked today at 17:00”", risk: 3, why: "Artificial time pressure is the classic warning sign – real portals don't lock you out with a minute countdown." },
            { t: "“New message from a candidate – please log in”", risk: 2, why: "Plausible and work-related – but without a deadline, people take their time and look more closely." },
            { t: "“Your monthly account summary is available”", risk: 1, why: "Routine – nothing makes you act quickly, so the bait rarely lands." } ] },
        { q: "Which detail makes the sender more credible – and is at the same time the giveaway?", hint: "Look closely at the address itself, not the display name.", options: [
            { t: "An address that differs from the real one by one letter", risk: 3, why: "Near-identical senders are the key thing to check: always read the address character by character." },
            { t: "The portal's display name, sent from a free mail account", risk: 2, why: "The display name looks right, but one look at the actual address gives it away." },
            { t: "A generic “noreply” sender on an unfamiliar domain", risk: 1, why: "An unknown domain is easy to recognise and report." } ] },
        { q: "What raises the success rate the most?", hint: "Where does the victim end up typing their password?", options: [
            { t: "A link to a copy of the usual login page", risk: 3, why: "That's why the rule is: never sign in via links in messages – open the portal yourself." },
            { t: "A phone number to call to “restore” access", risk: 2, why: "Can work, but a call gives the target time to think and ask questions." },
            { t: "A request to reply with the current password", risk: 1, why: "Feels wrong to almost everyone – it gets reported quickly." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "Opening the portal via your own bookmark instead of the link, checking the sender address character by character, and becoming suspicious under time pressure. MFA would also have devalued any stolen passwords.",
      stops: ["Time pressure → pause instead of clicking right away", "Almost-genuine sender → read the address carefully", "Link to the login page → open the portal yourself, not via the link"]
    }
  },

  {
    id: "m2", number: 2, title: "Malware in application documents", icon: "📎", available: true,
    difficulty: "medium",
    key:   { name: "HR workstation key", icon: "🔑" },
    badge: { name: "Attachment Guard", icon: "📎" },
    loot: "Remote access to the HR computer", lootLevel: 5,
    why: "Recruiters have to open attachments from strangers. Targeted campaigns against HR in 2025.",
    video: {
      expert: "IT Security", duration: "approx. 8 min", url: "media/modul2_malware.mp4",
      summary: "How booby-trapped files work and how to handle attachments safely.",
      points: [
        ["What does the attack want?", "To run hidden code on the HR computer and gain remote access to it."],
        ["Which weakness?", "Recruiters have to open documents from strangers – it's part of the job."],
        ["Why does the deception work?", "The application fits an open position, and the file comes in a format the scanner can't check."],
        ["Who is affected?", "The recruiter's computer, and through it candidate data and internal systems."],
        ["What stops the attack?", "Applications only via the applicant portal, no password-protected archives, never “enable content”."]
      ]
    },
    mission: {
      intro: "Put yourself in the attacker's shoes. Assess which choice makes a booby-trapped application most likely to be opened. Afterwards you'll see what would have exposed it.",
      target: "The HR workstation",
      steps: [
        { q: "Which application has the best chance of being opened?", hint: "Recruiters open what fits what they are working on right now.", options: [
            { t: "A CV for a job currently advertised on the careers page", risk: 3, why: "Relevance is the lever – a matching application is no proof that it's genuine. The channel and the file type are what count." },
            { t: "A speculative application with a strong, relevant profile", risk: 2, why: "Gets opened sometimes – but without a matching job it's less urgent and often read later." },
            { t: "An application for a role the company doesn't offer", risk: 1, why: "Doesn't fit – raises suspicion straight away." } ] },
        { q: "Which file gets past the protective checks most easily?", hint: "What can't the virus scanner look inside?", options: [
            { t: "A password-protected ZIP, with the password in the email", risk: 3, why: "The scanner can't look inside an encrypted archive – the password in the email is the giveaway. Applications belong in the applicant portal." },
            { t: "A link to the CV on an unknown file-sharing site", risk: 2, why: "Avoids the attachment scan too, but an unfamiliar download site makes many people hesitate. Same rule: documents via the portal." },
            { t: "A Word document attached directly to the email", risk: 1, why: "A plain attachment is scanned on arrival, so known malware is often caught before it reaches you." } ] },
        { q: "What gets the hidden content to run?", hint: "Look at what the document asks you to do before you can read it.", options: [
            { t: "A banner: “Enable content to view the full CV”", risk: 3, why: "A CV never needs macros or “enabled content” to be readable. That prompt is the moment to close the file and report it." },
            { t: "A file that looks like a PDF but is a program", risk: 2, why: "Works only if the file type goes unnoticed – a reason to check it, but harder to pull off than simply asking." },
            { t: "A request to print the CV and sign the last page", risk: 1, why: "Nothing has to run for that – harmless." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "Accepting applications only via the applicant portal, not opening password-protected archives sent by email, and never enabling content or macros in an application. Already opened it? Report it to IT straight away – the earlier, the less damage.",
      stops: ["Matching application → relevance is not proof; check the channel", "Password-protected archive → ask for an upload via the applicant portal and report it", "“Enable content” → never; close the file and report it"]
    }
  },

  {
    id: "m3", number: 3, title: "CEO fraud", icon: "👔", available: true,
    difficulty: "medium",
    key:   { name: "Executive-floor key", icon: "🔑" },
    badge: { name: "CEO-Fraud Shield", icon: "🛡️" },
    loot: "Candidate profiles, possibly payment", lootLevel: 4,
    why: "Rising sharply in Switzerland: 970 reports to the NCSC in 2025 (2023: 484).",
    video: {
      expert: "Finance", duration: "approx. 6 min", url: "media/modul3_ceo_fraud.mp4",
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
            { t: "The CEO, writing personally", risk: 3, why: "Authority is the lever – which is exactly why it counts as a warning sign, not a free pass." },
            { t: "The head of your own department", risk: 2, why: "Authority works here too – but your own manager is easy to reach and ask in person." },
            { t: "A colleague from another team", risk: 1, why: "Little pressure – easy to question." } ] },
        { q: "Which addition raises the pressure the most?", hint: "What discourages you from checking with anyone else?", options: [
            { t: "“Confidential – please handle within 20 minutes”", risk: 3, why: "Confidentiality is meant to prevent the normal check-back – a typical pattern." },
            { t: "“Urgent – the client is waiting for the profiles”", risk: 2, why: "Urgency raises the pressure, but without secrecy you would still check with colleagues." },
            { t: "“When you have a moment, please send the profiles”", risk: 1, why: "No pressure – plenty of time to check." } ] },
        { q: "What makes the request seem most genuine?", hint: "A second contact from the same person doesn't prove the first was real.", options: [
            { t: "A call shortly after that “confirms” the email", risk: 3, why: "Two channels from the same attacker are not a genuine confirmation – that's why the check-back must go through an independently known channel." },
            { t: "The CEO's real signature and logo in the email", risk: 2, why: "Looks official, but signatures and logos are easy to copy – they prove nothing." },
            { t: "A reply-to address that isn't the CEO's usual one", risk: 1, why: "A different reply address gives it away to anyone who looks." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "Checking back through an independently known channel (a direct line from the directory, or in person) and following the approval process. Urgency and confidentiality are warning signs, not reasons to skip the process.",
      stops: ["Authority → still verify the instruction via a second channel", "Time pressure + “confidential” → deliberately pause", "Confirmation call → only an independent channel counts"]
    }
  },

  {
    id: "m4", number: 4, title: "Fake candidates and deepfakes", icon: "🎭", available: true,
    difficulty: "medium",
    key:   { name: "Identity key", icon: "🔑" },
    badge: { name: "Deepfake Detector", icon: "🎭" },
    loot: "Access to client systems, salary", lootLevel: 4,
    why: "Growing fast. Staffing agencies place people with clients and share the liability.",
    video: {
      expert: "HR / Recruiting", duration: "approx. 7 min", url: "media/modul4_fake_candidates.mp4",
      summary: "How to spot forged profiles and deepfake interviews.",
      points: [
        ["What does the attack want?", "To get a fake person placed with a client – for system access, data or a salary."],
        ["Which weakness?", "Time pressure to fill positions and interviews that happen only remotely."],
        ["Why does the deception work?", "A perfect profile, a convincing video call and requests that seem small on their own."],
        ["Who is affected?", "The client (access to its systems) and the staffing agency, which shares the liability."],
        ["What stops the attack?", "An identity check before placement, references via known contacts and the standard process for pay and access."]
      ]
    },
    mission: {
      intro: "Put yourself in the attacker's shoes. Assess which choice makes a fake candidate most likely to get placed. Afterwards you'll see which checks would have stopped it.",
      target: "A placement with a client – and the salary",
      steps: [
        { q: "Which profile gets through the first screening most easily?", hint: "Perfect is not the same as plausible – look at the history behind the profile.", options: [
            { t: "A CV that matches the job ad almost word for word", risk: 3, why: "A perfect fit is attractive – which is exactly why it deserves a second look: history, references and how long the profile has existed." },
            { t: "A strong CV naming a well-known former employer", risk: 2, why: "Convincing too, but a well-known employer is easy to check via references." },
            { t: "A solid CV that fits only part of the requirements", risk: 1, why: "Plausible, but doesn't stand out – it rarely gets fast-tracked." } ] },
        { q: "Which interview setup hides the most?", hint: "What makes it hard to see who you are really talking to?", options: [
            { t: "Video only, with the camera “broken” on the day", risk: 3, why: "Avoiding a clear live view is a warning sign. Ask for a live ID check or a short in-person meeting." },
            { t: "A video call with a slight delay and poor lighting", risk: 2, why: "Can hide a deepfake, but a live view still invites checks – watch for unnatural lip movement and ask for a live ID check." },
            { t: "A short in-person interview at the local branch", risk: 1, why: "Identity is easy to check face to face." } ] },
        { q: "Which request brings the attacker closest to the goal?", hint: "Which wish pays off for the candidate before any work is done?", options: [
            { t: "Immediate system access and pay to an account abroad", risk: 3, why: "This combination is a classic pattern. Payment details and access go through the standard process – deviations are documented and escalated." },
            { t: "Remote only, with the laptop sent to a new address", risk: 2, why: "Also a known pattern – equipment to an unverified address – but on its own it brings neither access nor money." },
            { t: "A start date two months later than planned", risk: 1, why: "Common and harmless." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "An identity check before placement (live ID, references via known contacts, an in-person meeting), a second look at profiles that seem too perfect, and the standard process for payment details and system access. Anomalies are documented and passed on – the liability is shared with the client.",
      stops: ["Too-perfect profile → check history and references independently", "Face hidden on video → insist on a live ID check or a meeting", "Unusual payment or access wishes → standard process, document and escalate"]
    }
  },

  {
    id: "m5", number: 5, title: "Ransomware and data exfiltration", icon: "🔒", available: true,
    difficulty: "hard", requiresKeys: 4,
    key:   { name: "Data-centre key", icon: "🔑" },
    badge: { name: "Ransomware First Responder", icon: "🔒" },
    loot: "The entire data set, ransom", lootLevel: 5,
    why: "The greatest damage. ManpowerGroup franchise Lansing in 2025 with around 145,000 people affected.",
    video: {
      expert: "Data Protection", duration: "approx. 8 min", url: "media/modul5_ransomware.mp4",
      summary: "How ransomware gets in and what to do in an emergency.",
      points: [
        ["What does the attack want?", "To lock the entire data set and demand a ransom – often after copying the data out."],
        ["Which weakness?", "A single entry point is enough: a stolen login, an opened file, a placed fake candidate."],
        ["Why does the deception work?", "The attacker moves around with a valid login and looks like normal work for a long time."],
        ["Who is affected?", "Everyone: candidates, clients, staff – and day-to-day operations."],
        ["What stops the attack?", "MFA, reporting early, noticing unusual activity, and in an emergency: disconnect and inform IT."]
      ]
    },
    mission: {
      intro: "The final mission brings it all together. Put yourself in the attacker's shoes and assess which choice makes the attack chain most damaging. Afterwards you'll see where each link could have been broken.",
      target: "TalentBridge's entire data set",
      steps: [
        { q: "Which way in gives the attacker the best start?", hint: "Which entry looks like normal work from the very first minute?", options: [
            { t: "A login stolen with a phishing email", risk: 3, why: "A valid login looks like normal work. That's why MFA and reporting a click straight away matter so much – they break the chain at the very first link." },
            { t: "A booby-trapped application on an HR computer", risk: 2, why: "A common entry too – but a hidden program is more likely to be caught by protection software than a normal-looking login." },
            { t: "Guessing passwords on the login page", risk: 1, why: "Slow and noisy – usually blocked and noticed." } ] },
        { q: "What makes the attack most damaging before anything is locked?", hint: "Attackers want leverage even if backups exist.", options: [
            { t: "Quietly copying the candidate data out first", risk: 3, why: "Copied data means double pressure – even with good backups. Unusual activity (large downloads, logins at odd hours) is worth reporting." },
            { t: "Deleting the reachable backups first", risk: 2, why: "Very damaging – which is why backups are kept separate. But even good backups don't help against stolen data." },
            { t: "Locking a single team drive straight away", risk: 1, why: "Gets noticed early and limits the damage." } ] },
        { q: "What maximises the pressure to pay?", hint: "Which threat remains even if everything can be restored?", options: [
            { t: "Encrypting files and threatening to publish the data", risk: 3, why: "Double extortion. The right response is never to act alone: disconnect, inform IT immediately and follow the incident plan." },
            { t: "Encrypting files and setting a 48-hour deadline", risk: 2, why: "Creates pressure, but if the backups work the company can restore without paying." },
            { t: "Threatening to publish data that was never copied", risk: 1, why: "An empty threat – the logs show nothing was taken." } ] }
      ]
    },
    reveal: {
      question: "What would have stopped this attack?",
      answer: "The chain could have been broken at every link: MFA and reporting the phishing click (entry), noticing and reporting unusual activity (data theft), and in an emergency disconnecting from the network and informing IT immediately instead of acting alone. Regular, separate backups take the pressure out of the encryption.",
      stops: ["Stolen login → MFA, and report any click immediately", "Data copied out unnoticed → report unusual activity", "Files suddenly ending in “.locked” → disconnect, inform IT, never negotiate alone"]
    }
  }
];

/* ---------- Defense level (inbox) ----------
   Mixed messages: attacks + harmless, genuine messages.
   action: the best action; accept: other defensible actions (half points).
   attack: true/false.
   module: optional – the mail only appears once that module is available. */
window.DEFENSE_INBOX = [
  { id: "d1", from: "Applicant Portal Service", subject: "Account expires in 2 hours – sign in now", preview: "Sign in immediately via the following link, or your access will be deleted.", attack: true, type: "Phishing", action: "report", accept: ["reject"], why: "Time pressure and signing in via a link – open the portal yourself instead and report it." },
  { id: "d2", from: "Sandra Meier (colleague)", subject: "Lunch on Thursday?", preview: "Do you have time for a quick lunch on Thursday?", attack: false, type: "Harmless", action: "process", why: "A normal internal message with no risk." },
  { id: "d3", from: "M. Keller, CEO", subject: "CONFIDENTIAL – urgent candidate profiles", preview: "I need all profiles for Client X in 20 min. Please don't discuss with the team.", attack: true, type: "CEO fraud", action: "verify", accept: ["report"], why: "Authority + pressure + secrecy: verify through a known second channel." },
  { id: "d4", from: "Lukas B. (applicant)", subject: "CV_final.zip", preview: "My CV is attached as a ZIP, password: 1234. Please take a quick look.", attack: true, type: "Malicious application", action: "report", accept: ["reject"], why: "A password-protected ZIP from an unknown sender bypasses the virus scanner: have it submitted via the applicant portal." },
  { id: "d5", from: "Client Zattoo Ltd", subject: "Invoice as discussed", preview: "Please find attached the invoice we agreed on by phone yesterday.", attack: false, type: "Harmless", action: "process", why: "Expected context from the usual address – process as normal." },
  { id: "d6", from: "IT Support (external)", subject: "Please share your code", preview: "For maintenance we need your SMS login code. Please reply.", attack: true, type: "Phishing / vishing", action: "report", accept: ["reject"], why: "Genuine support never asks for your login code." },
  { id: "d7", module: "m4", from: "Alex Rivera (candidate)", subject: "Interview tomorrow + salary details", preview: "My camera still isn't working, so voice only again? Also, my salary needs to go to my account abroad – details to follow.", attack: true, type: "Fake candidate", action: "verify", accept: ["report"], why: "No live view plus an unusual payment wish: verify the identity (live ID, references) and follow the standard process." },
  { id: "d8", module: "m5", from: "Tom Weber (colleague)", subject: "Team drive acting weird?", preview: "All my files on the team drive suddenly end in “.locked”. Can you check whether yours still open?", attack: true, type: "Ransomware (incident)", action: "report", why: "Don't try opening anything: disconnect from the network and inform IT immediately." },
  { id: "d9", module: "m5", from: "IT Service Desk", subject: "Planned maintenance on Saturday 08:00–12:00", preview: "The applicant portal will be unavailable during maintenance. No action needed on your side.", attack: false, type: "Harmless", action: "process", why: "An announcement from the usual address – no link, no login, no request. Process as normal." }
];
