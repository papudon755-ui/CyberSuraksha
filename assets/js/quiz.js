/* CyberSuraksha — quiz logic (quiz.html) */
(function () {
  "use strict";

  var QUESTIONS = [
    {
      q: "You get an SMS: \u201cYour bank account will be BLOCKED in 2 hours. Click here to verify.\u201d What should you do?",
      options: [
        "Click the link quickly before the account is blocked",
        "Ignore the SMS and contact your bank through its official number or app",
        "Reply to the SMS with your account number to confirm",
        "Forward the SMS to all your contacts"
      ],
      answer: 1,
      explain: "Banks never warn you through random SMS links. Always verify through the official app or helpline."
    },
    {
      q: "A caller says they are from your bank and asks for the OTP you just received. What do you do?",
      options: [
        "Share the OTP \u2014 they sound genuine",
        "Share only the first 3 digits to be safe",
        "Never share it \u2014 no real bank employee ever asks for your OTP",
        "Ask them to call back later and then share it"
      ],
      answer: 2,
      explain: "An OTP is the key to your account. Anyone asking for it is trying to steal from you."
    },
    {
      q: "Someone buying your old phone online asks YOU to scan a QR code so they can \u201csend\u201d you the payment. Is this safe?",
      options: [
        "Yes, scanning a QR code only receives money",
        "No \u2014 scanning a QR code and entering your UPI PIN sends money from your account",
        "Yes, as long as the QR code looks professional",
        "No, but only because the buyer is a stranger"
      ],
      answer: 1,
      explain: "You never need a PIN or QR scan to RECEIVE money. A QR + PIN always means money leaves your account."
    },
    {
      q: "You need to check your bank balance using free public Wi-Fi at a caf\u00e9. What is the safest choice?",
      options: [
        "Go ahead \u2014 free Wi-Fi is safe for banking",
        "Avoid banking on public Wi-Fi; use your mobile data instead",
        "It is safe as long as nobody is watching your screen",
        "Log in quickly and log out \u2014 speed makes it safe"
      ],
      answer: 1,
      explain: "Public Wi-Fi can be snooped on. Use mobile data or wait until you are on a trusted network."
    },
    {
      q: "You use the same password for your email, shopping and social media accounts. Why is this risky?",
      options: [
        "It is not risky \u2014 one strong password everywhere is smart",
        "If one site leaks it, attackers can open all your other accounts",
        "Websites charge extra for reused passwords",
        "It only matters for banking passwords"
      ],
      answer: 1,
      explain: "One leaked password should never unlock your whole digital life. Use a unique password for each important account."
    },
    {
      q: "What is 1930?",
      options: [
        "A bank\u2019s customer-care extension",
        "India\u2019s national cybercrime helpline number",
        "A UPI transaction code",
        "The year the internet started in India"
      ],
      answer: 1,
      explain: "1930 is the national cyber helpline \u2014 toll-free and available 24x7 if you lose money to fraud."
    },
    {
      q: "Where can you file an online complaint about cyber fraud in India?",
      options: [
        "On any social media page about cybercrime",
        "cybercrime.gov.in \u2014 the National Cyber Crime Reporting Portal",
        "By emailing a random police email address",
        "Complaints can only be filed at a police station"
      ],
      answer: 1,
      explain: "cybercrime.gov.in is the official portal. You get an acknowledgement number to track your complaint."
    },
    {
      q: "A message contains a link to \u201csbiibank-login.com\u201d claiming to be your bank. What is wrong here?",
      options: [
        "Nothing \u2014 it mentions the bank\u2019s name",
        "The domain name is misspelled; it is a fake site made to steal your login",
        "Bank links always contain extra words, so this is fine",
        "It is wrong only if the page asks for money"
      ],
      answer: 1,
      explain: "Scammers register look-alike domains. Type your bank\u2019s address yourself or use the official app."
    },
    {
      q: "A \u201cwork from home job\u201d offer asks you to pay a registration or training fee first. What should you think?",
      options: [
        "Genuine jobs always ask for a small fee",
        "Pay quickly before the offer expires",
        "It is most likely a scam \u2014 real employers do not ask job seekers for fees",
        "It is safe if they sent an offer letter on letterhead"
      ],
      answer: 2,
      explain: "Upfront fees for jobs, gifts or prizes are a classic advance-fee scam. Walk away."
    },
    {
      q: "Why do phone and app updates matter for your safety?",
      options: [
        "They only add new emojis and themes",
        "They fix security problems that hackers could otherwise exploit",
        "Updates slow down the phone, so skipping them is safer",
        "They matter only for gaming apps"
      ],
      answer: 1,
      explain: "Updates patch security holes. An outdated phone is an easy target."
    }
  ];

  var shell = document.getElementById("quizShell");
  if (!shell) return;

  var current = 0;
  var score = 0;
  var answered = false;

  function tierMessage(s) {
    if (s >= 9) return "Outstanding! You really know how to stay safe online.";
    if (s >= 7) return "Great job! You know most of the basics \u2014 polish the rest on the Safety Tips page.";
    if (s >= 5) return "Good start. Review the Threats and Safety Tips pages, then try again.";
    return "Time to learn! Go through the Threats and Safety Tips pages first, then retake the quiz.";
  }

  function renderProgress() {
    var fill = document.getElementById("quizFill");
    var count = document.getElementById("quizCount");
    if (fill) fill.style.width = (current / QUESTIONS.length * 100) + "%";
    if (count) count.textContent = "Question " + Math.min(current + 1, QUESTIONS.length) + " of " + QUESTIONS.length;
  }

  function renderQuestion() {
    answered = false;
    renderProgress();
    var item = QUESTIONS[current];

    var html = '<div class="quiz-card" role="group" aria-labelledby="quizQ">';
    html += '<h2 id="quizQ">' + item.q + "</h2>";
    html += '<ul class="quiz-options">';
    item.options.forEach(function (opt, i) {
      html += '<li><button type="button" data-i="' + i + '">' + opt + "</button></li>";
    });
    html += "</ul>";
    html += '<div class="quiz-feedback" id="quizFeedback" aria-live="polite"></div>';
    html += '<div class="quiz-nav"><button type="button" class="btn btn-primary btn-sm" id="quizNext" disabled>Next</button></div>';
    html += "</div>";
    shell.innerHTML = html;

    var buttons = shell.querySelectorAll(".quiz-options button");
    var feedback = document.getElementById("quizFeedback");
    var nextBtn = document.getElementById("quizNext");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        var chosen = parseInt(btn.getAttribute("data-i"), 10);
        var right = chosen === item.answer;
        if (right) score += 1;
        buttons.forEach(function (b) {
          b.disabled = true;
          var bi = parseInt(b.getAttribute("data-i"), 10);
          if (bi === item.answer) b.classList.add("correct");
          else if (bi === chosen) b.classList.add("wrong");
        });
        feedback.className = "quiz-feedback show " + (right ? "good" : "bad");
        feedback.innerHTML = "<strong>" + (right ? "Correct!" : "Not quite.") + "</strong>" + item.explain;
        nextBtn.disabled = false;
        nextBtn.textContent = current === QUESTIONS.length - 1 ? "See my score" : "Next";
        nextBtn.focus();
      });
    });

    nextBtn.addEventListener("click", function () {
      current += 1;
      if (current < QUESTIONS.length) renderQuestion();
      else renderResult();
    });
  }

  function renderResult() {
    var fill = document.getElementById("quizFill");
    var count = document.getElementById("quizCount");
    if (fill) fill.style.width = "100%";
    if (count) count.textContent = "Quiz complete";
    shell.innerHTML =
      '<div class="quiz-card quiz-result">' +
      '<span class="kicker">Your result</span>' +
      '<div class="quiz-score">' + score + " / " + QUESTIONS.length + "</div>" +
      "<p>" + tierMessage(score) + "</p>" +
      '<div class="hero-ctas">' +
      '<button type="button" class="btn btn-primary" id="quizRetry">Try again</button>' +
      '<a class="btn btn-outline" href="safety-tips.html">Review safety tips</a>' +
      "</div></div>";
    document.getElementById("quizRetry").addEventListener("click", function () {
      current = 0; score = 0; renderQuestion();
    });
  }

  renderQuestion();
})();
