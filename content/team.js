/* =========================================================================
   Team mission – cooperative workshop round (jigsaw method)
   -------------------------------------------------------------------------
   2–6 people sit at one table. The laptop (team-mission.html) shows the
   shared view with parts blacked out; every person opens their clue cards
   on their own phone via a QR code. Each round has 6 cards, dealt round-
   robin to the people at the table. Every question needs two neighbouring
   cards (1+2, 3+4, 5+6) – with round-robin dealing those always sit with
   two different people, whatever the group size. So nobody can answer
   alone: the group has to talk.

   Cards state facts only, never the conclusion – the group interprets them.
   The reveal (why) appears on the table after the decision.

   Question options combine one fact from each of the two cards, so a single
   card leaves at least two options open. correct = index of the right option.
   Scoring per round: 1 point per correct question, decision best = 2,
   accept = 1. Max 5 per round, 15 in total.

   Fictional company, people, domains and numbers.
   ========================================================================= */
CONTENT.team = {
  minPlayers: 2,
  maxPlayers: 6,
  pointsPerScore: 10,   // points in the app per team-mission point (max 15 × 10)
  // Phones open their cards here when the table runs from a local file
  publicUrl: "https://larabng.github.io/securityawareness/team-mission.html",

  // the same four actions as in the defense level and the surveys
  actions: {
    process: "Process it as normal",
    verify:  "Verify it via a known, separate channel",
    report:  "Report it to IT / security",
    reject:  "Reject or delete it"
  },

  rounds: [
    /* ---------------- Round 1 · Phishing (module 1) ---------------- */
    { id: "r1", module: "m1", icon: "mail", kicker: "Phishing", title: "The account warning",
      scene: "Monday, 08:05. A recruiter at TalentBridge opens the inbox. This email is at the top.",
      ask: "What should the recruiter do with this email?",
      view: {
        rows: [
          { label: "From", text: "TalentBridge Portal", card: 1 },
          { label: "To", text: "recruiter@talentbridge.ch" },
          { label: "Received", card: 3 },
          { label: "Subject", text: "Action required: confirm your recruiter account" },
          { label: "Message", card: 4 },
          { label: "", card: 5 },
          { label: "Button", text: "[ Confirm account ]", card: 2 }
        ],
        outside: [{ label: "Check on the real portal", card: 6 }]
      },
      cards: [
        { title: "Sender address",
          body: "TalentBridge Portal &lt;<code>no-reply@talentbridge-login.ch</code>&gt;",
          why: "A look-alike domain: talentbridge-login.ch is not talentbridge.ch." },
        { title: "Where the button leads",
          body: "Hovering over “Confirm account” shows:<br><code>http://tb-portal.verify-now.ch/login</code>",
          why: "The button leads to a third site that has nothing to do with TalentBridge." },
        { title: "Time and reply address",
          body: "Received: <b>today, 03:12</b><br>Replies go to: <code>support@mail-secure-verify.ch</code>",
          why: "Sent in the middle of the night, and replies would go to yet another domain." },
        { title: "Start of the message",
          body: "“Dear user, we detected a problem with your recruiter account. Your access will be suspended <b>within 30 minutes</b> unless you confirm your details now.”",
          why: "A generic greeting and a 30-minute deadline: pressure, so nobody stops to check." },
        { title: "What the message asks for",
          body: "“Click the button below and <b>sign in with your TalentBridge password</b> to keep your account active.”",
          why: "Signing in through a link in a message is exactly what the attacker needs." },
        { title: "Check on the real portal",
          body: "You open <code>portal.talentbridge.ch</code> yourself: your account is <b>active</b>, nothing expires. This week's IT security bulletin announces <b>no</b> account checks.",
          why: "The independent check shows there is no real reason for the request." }
      ],
      questions: [
        { cards: [1, 2],
          text: "Compare the sender and the button's destination with the real company domain, talentbridge.ch.",
          options: ["Both use talentbridge.ch",
                    "The sender uses talentbridge.ch, but the button leads to another site",
                    "The sender is a look-alike domain, and the button leads to yet another site",
                    "The sender is a look-alike domain, but the button leads to talentbridge.ch"],
          correct: 2,
          why: "talentbridge-login.ch only looks like the real domain, and verify-now.ch is a different site altogether." },
        { cards: [3, 4],
          text: "It is 08:05 now. When was the email sent, and how much time does it give?",
          options: ["Sent at 03:12 at night, with a 30-minute deadline",
                    "Sent at 03:12 at night, with a week to respond",
                    "Sent yesterday afternoon, with a 30-minute deadline",
                    "Sent yesterday afternoon, with a week to respond"],
          correct: 0,
          why: "By the time anyone reads it, the “deadline” is long over. The pressure is fake and only meant to rush you." },
        { cards: [5, 6],
          text: "What does the email want – and is there a real reason for it?",
          options: ["A reply by email – and IT has announced this check",
                    "Your password on its sign-in page – and the account really is about to expire",
                    "A reply by email – while the account is active and nothing is announced",
                    "Your password on its sign-in page – while the account is active and no check is running"],
          correct: 3,
          why: "The real portal shows nothing wrong. The email invents a problem so that you hand over your password." }
      ],
      decision: { best: "report", accept: ["reject"] },
      lesson: "No single clue proves it – together they do. Never sign in through a link in a message: open the portal yourself, and report the email so IT can warn everyone else." },

    /* ---------------- Round 2 · CEO fraud (module 3) ---------------- */
    { id: "r2", module: "m3", icon: "briefcase", kicker: "CEO fraud", title: "The urgent payment",
      scene: "Monday, 09:40. The same attackers try a different way in. You are standing in for a colleague in finance today, and this email arrives.",
      ask: "What do you do with this request?",
      view: {
        rows: [
          { label: "From", text: "Markus Keller (CEO)", card: 1 },
          { label: "To", text: "finance@talentbridge.ch" },
          { label: "Subject", text: "Confidential – payment needed today" },
          { label: "Message", card: 3 },
          { label: "", card: 5 }
        ],
        outside: [
          { label: "Company directory", card: 2 },
          { label: "Finance process", card: 4 },
          { label: "Conference website", card: 6 }
        ]
      },
      cards: [
        { title: "Sender address",
          body: "Markus Keller (CEO) &lt;<code>markus.keller@talentbridge-ch.com</code>&gt;",
          why: "A look-alike domain again: talentbridge-ch.com, not talentbridge.ch." },
        { title: "Company directory",
          body: "Markus Keller, CEO<br><code>m.keller@talentbridge.ch</code><br>Mobile: <b>+41 79 555 01 23</b>",
          why: "The real address and a known number – the safe way to check." },
        { title: "The request",
          body: "“Please transfer <b>CHF 48,500 today</b> to our new partner agency. Their old account is closed – use this one: <code>IBAN LT60 0000 0000 0000 4821</code>.”",
          why: "A new account abroad, a large amount, today: a classic payment diversion." },
        { title: "Finance process",
          body: "New bank details are only entered after a <b>call-back on the number on file</b>. Every payment over CHF 10,000 needs a <b>second approval</b>.",
          why: "The request skips exactly the checks that stop this kind of fraud." },
        { title: "Tone of the message",
          body: "“Keep this between us until the deal is announced. I'm in sessions all day – <b>email only, please don't call</b>.”",
          why: "Secrecy and “don't call” block the one check that would expose the fraud." },
        { title: "Conference website",
          body: "HR Tech Summit Zurich, today: “Keynote and panel with <b>Markus Keller, CEO of TalentBridge</b>, 09:00–17:00.”",
          why: "The excuse fits because the attacker read the public agenda. Plausible is not the same as genuine." }
      ],
      questions: [
        { cards: [1, 2],
          text: "Compare the sender with the company directory.",
          options: ["Same address as in the directory – but no number on file",
                    "A different domain – and the directory lists his mobile number",
                    "Same address as in the directory – and his mobile number is listed",
                    "A different domain – and there is no number on file"],
          correct: 1,
          why: "talentbridge-ch.com is not the company domain – and the directory gives you a number you can trust." },
        { cards: [3, 4],
          text: "What does the request ask for – and what does the finance process require in that case?",
          options: ["Paying an account already on file – one approval is enough",
                    "Paying a new account abroad – one approval is enough",
                    "Paying a new account abroad – a call-back on the number on file and a second approval",
                    "Paying an account already on file – a call-back and a second approval"],
          correct: 2,
          why: "New bank details plus a large amount: exactly the case the process exists for." },
        { cards: [5, 6],
          text: "Why does “I'm in sessions all day, don't call” sound believable?",
          options: ["The email asks for secrecy and no calls – and the conference really lists him as a speaker today",
                    "The email invites you to call – and he is speaking at the conference today",
                    "The email asks for secrecy and no calls – but he is not at the conference",
                    "The email invites you to call – and he is not at the conference"],
          correct: 0,
          why: "The attacker uses the public agenda to make the excuse fit. A believable story is no proof of who sent it." }
      ],
      decision: { best: "verify", accept: ["report"] },
      lesson: "Authority, urgency and secrecy together are the pattern. Verify through a channel you choose – the number in the directory, not one from the message – and follow the payment process, even when the CEO seems to ask otherwise." },

    /* ---------------- Round 3 · Fake candidate (module 4) ---------------- */
    { id: "r3", module: "m4", icon: "scan-face", kicker: "Fake candidate", title: "The perfect candidate",
      scene: "Monday, 14:30. A recruiter is about to send an offer for a remote IT administrator role – with access to the applicant database.",
      ask: "What should the recruiter do before sending the offer?",
      view: {
        rows: [
          { label: "Candidate", text: "Daniel Novak" },
          { label: "Role", text: "IT administrator (remote), access to the applicant database" },
          { label: "CV", card: 1 },
          { label: "Interview today", card: 3 },
          { label: "Reply to the offer", card: 5 }
        ],
        outside: [
          { label: "Background check", card: 2 },
          { label: "Notes from interview round 1", card: 4 },
          { label: "Onboarding standard", card: 6 }
        ]
      },
      cards: [
        { title: "CV: last employer",
          body: "“2017–2025: Senior IT administrator at <b>Nordwind Systems GmbH</b>, Hamburg. References on request.”",
          why: "A strong CV is easy to write – and hard to check without effort." },
        { title: "Background check",
          body: "No company register entry for “Nordwind Systems GmbH”. Its website was registered <b>three weeks ago</b>.",
          why: "The employer does not exist: the background was built for this application." },
        { title: "Video interview today",
          body: "His lips move slightly after his voice. Asked to turn his head or hold his ID up to the camera, he says his <b>connection is too weak</b>.",
          why: "Lip-sync delay and refusing simple live checks point to a deepfake." },
        { title: "Interview round 1",
          body: "<b>Audio only</b> – his camera was “broken”. The colleague noted: “Very fluent answers, but a short pause before each one.”",
          why: "In two interviews nobody saw him in a way that could be checked." },
        { title: "His reply to the offer",
          body: "Accepts within an hour. Asks to send the laptop to a <b>parcel locker in another city</b> and to get <b>admin access before day one</b>, “to prepare”.",
          why: "Hardware to an anonymous address and early admin access: the real goal." },
        { title: "Onboarding standard",
          body: "Laptops are <b>handed over in person</b> on the first day at the Bern office. Admin rights are granted <b>after four weeks</b>.",
          why: "Both requests bypass the normal onboarding." }
      ],
      questions: [
        { cards: [1, 2],
          text: "Can the candidate's work history be confirmed?",
          options: ["Eight years at one employer – a long-established, registered company",
                    "Eight years at one employer – a company with no register entry and a brand-new website",
                    "Short jobs at several firms – all of them registered",
                    "Short jobs at several firms – one of them has no register entry"],
          correct: 1,
          why: "The employer was invented for this application, so the CV cannot be confirmed." },
        { cards: [3, 4],
          text: "What do the two interviews show together?",
          options: ["Today: clear video, ID shown. Round 1: a normal video call",
                    "Today: lagging video, live checks refused. Round 1: a normal video call",
                    "Today: clear video, ID shown. Round 1: audio only",
                    "Today: lagging video, live checks refused. Round 1: audio only"],
          correct: 3,
          why: "Nobody has ever seen him in a way that could be checked. Together with the lip-sync delay, that points to a deepfake." },
        { cards: [5, 6],
          text: "What does he ask for – and how does that compare with the normal onboarding?",
          options: ["Laptop to a parcel locker, admin rights before day one – normally handed over in person, admin rights after four weeks",
                    "Laptop to a parcel locker, admin rights before day one – normally shipped anywhere, admin rights from day one",
                    "Laptop picked up at the office on day one – normally handed over in person, admin rights after four weeks"],
          correct: 0,
          why: "Both requests skip the safeguards of onboarding. Hardware and access are what the attacker is really after." }
      ],
      decision: { best: "verify", accept: ["report"] },
      lesson: "A fake candidate is built from many small pieces that each look normal. Verify the identity in person or with a live check you control, confirm references independently, and stick to the onboarding process." }
  ]
};
