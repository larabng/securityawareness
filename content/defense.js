/* =========================================================================
   Defense level (inbox)
   -------------------------------------------------------------------------
   Mixed messages: attacks + harmless, genuine messages.
   action: the best action; accept: other defensible actions (half points).
   attack: true/false.
   module: optional – the mail only appears once that module is available.
   ========================================================================= */
CONTENT.inbox = [
  { id: "d1", from: "Applicant Portal Service", subject: "Account expires in 2 hours – sign in now", preview: "Sign in immediately via the following link, or your access will be deleted.", attack: true, type: "Phishing", action: "report", accept: ["reject"], why: "Time pressure and signing in via a link – open the portal yourself instead and report it." },
  { id: "d2", from: "Sandra Meier (colleague)", subject: "Lunch on Thursday?", preview: "Do you have time for a quick lunch on Thursday?", attack: false, type: "Harmless", action: "process", why: "A normal internal message with no risk." },
  { id: "d3", from: "M. Keller, CEO", subject: "CONFIDENTIAL – urgent candidate profiles", preview: "I need all profiles for Client X in 20 min. Please don't discuss with the team.", attack: true, type: "CEO fraud", action: "verify", accept: ["report"], why: "Authority + pressure + secrecy: verify through a known second channel." },
  { id: "d4", from: "Lukas B. (applicant)", subject: "CV_final.zip", preview: "My CV is attached as a ZIP, password: 1234. Please take a quick look.", attack: true, type: "Malicious application", action: "report", accept: ["reject"], why: "A password-protected ZIP from an unknown sender bypasses the virus scanner: have it submitted via the applicant portal." },
  { id: "d5", from: "Alpstein Logistics (client)", subject: "Invoice as discussed", preview: "Please find attached the invoice we agreed on by phone yesterday.", attack: false, type: "Harmless", action: "process", why: "Expected context from the usual address – process as normal." },
  { id: "d6", from: "IT Support (external)", subject: "Please share your code", preview: "For maintenance we need your SMS login code. Please reply.", attack: true, type: "Phishing / vishing", action: "report", accept: ["reject"], why: "Genuine support never asks for your login code." },
  { id: "d7", module: "m4", from: "Alex Rivera (candidate)", subject: "Interview tomorrow + salary details", preview: "My camera still isn't working, so voice only again? Also, my salary needs to go to my account abroad – details to follow.", attack: true, type: "Fake candidate", action: "verify", accept: ["report"], why: "No live view plus an unusual payment wish: verify the identity (live ID, references) and follow the standard process." },
  { id: "d8", module: "m5", from: "Tom Weber (colleague)", subject: "Team drive acting weird?", preview: "All my files on the team drive suddenly end in “.locked”. Can you check whether yours still open?", attack: true, type: "Ransomware (incident)", action: "report", why: "Don't try opening anything: disconnect from the network and inform IT immediately." },
  { id: "d9", module: "m5", from: "IT Service Desk", subject: "Planned maintenance on Saturday 08:00–12:00", preview: "The applicant portal will be unavailable during maintenance. No action needed on your side.", attack: false, type: "Harmless", action: "process", why: "An announcement from the usual address – no link, no login, no request. Process as normal." }
];
