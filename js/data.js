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
    topTeamsVisible: 3,
    adminPin: "2026",
    teams: ["Team Firewall", "Team Patch", "Team Bitlocker", "Team Captcha", "Team Sandbox", "Team Honeypot"]
  },

  /* ---------- Surveys (pre / post) ----------
     Parallel, equally hard questions. The solution (correct) is NEVER shown
     to participants – it is only used for evaluation in the export. */
  surveys: {
    profileQuestions: [
      { id: "area", text: "Which area do you work in?", options: ["Recruiting / HR consulting", "Payroll / Administration", "Sales / Key Account", "IT", "Other"] },
      { id: "experience", text: "Have you ever attended a cybersecurity training before?", options: ["No", "Yes, more than a year ago", "Yes, in the past year"] }
    ],
    pre: [
      { id: "pre1", topic: "Phishing",
        text: "You receive an email: “Your applicant-portal account expires today at 17:00. Sign in now.” What do you do?",
        options: ["Open the link in the email and check whether the page looks genuine", "Don't click; open the portal via your known bookmark and report the email", "Forward the email to a colleague and ask if they got it too", "Delete the email and do nothing else"],
        correct: 1 },
      { id: "pre2", topic: "Malicious application",
        text: "An applicant sends her CV as a password-protected ZIP file, with the password in the email. How do you proceed?",
        options: ["Open the ZIP file – applications have to be processed, after all", "Open the file on your private laptop so the work computer stays safe", "Ask the applicant to upload the documents via the applicant portal and report the email to IT", "Ignore the email"],
        correct: 2 },
      { id: "pre3", topic: "CEO fraud",
        text: "The CEO writes to you (correct name, but an unfamiliar address): “Confidential. I need all candidate profiles for Client X within 30 minutes.” What do you do?",
        options: ["Send the profiles – it's the CEO, after all", "Reply directly to the email and ask whether the request is genuine", "Contact the CEO through a known second channel (number from the directory) and report the case", "Send only some of the profiles"],
        correct: 2 },
      { id: "pre4", topic: "Fake candidate / deepfake",
        text: "In the video interview, picture and sound are slightly out of sync and the lips don't quite match the voice. The candidate refuses to briefly hold a hand in front of their face. What do you do?",
        options: ["Carry on as normal – the connection is just bad", "Verify the identity with an extra step (e.g. live ID or an in-person meeting) and document the anomaly", "End the call and warn about the candidate publicly on LinkedIn", "Refer the candidate to the client straight away"],
        correct: 1 },
      { id: "pre5", topic: "Ransomware",
        text: "A message appears on your screen: “Your files have been encrypted. Pay 2 Bitcoin.” What is the first correct step?",
        options: ["Restart the computer", "Disconnect from the network, do not switch the computer off, and inform IT immediately", "Restore the files from backup yourself", "Pay the ransom so operations can continue"],
        correct: 1 },
      { id: "pre6", topic: "Reporting",
        text: "An hour ago you clicked a link in a strange email and now you're unsure. What do you do?",
        options: ["Wait and see whether anything happens", "Change the password and tell no one", "Report it to IT immediately, even if it's uncomfortable", "Delete the email so no one else clicks it"],
        correct: 2 }
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
