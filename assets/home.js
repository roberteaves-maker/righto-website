// Righto homepage: scroll-in animations, Righto hops, waitlist form.

// WAITLIST: paste the form's sign-up address here once the email service is set up.
// Kit:        https://app.kit.com/forms/FORM_ID/subscriptions        (field: email_address)
// MailerLite: https://assets.mailerlite.com/jsonp/ACCOUNT/forms/FORM_ID/subscribe (field: fields[email])
// While it's empty the form just shows the thank-you message and sends nothing.
var WAITLIST_URL = 'https://app.kit.com/forms/10200646/subscriptions';
var WAITLIST_FIELD = 'email_address';

(function () {
  // Pop sections in as they scroll into view (Duolingo style).
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Tap the animated Righto and he does his wave again; the drawn ones hop.
  document.querySelectorAll('.righto-live').forEach(function (svg) {
    svg.addEventListener('click', function (e) {
      e.stopPropagation();
      svg.classList.remove('wave-now'); void svg.getBoundingClientRect(); svg.classList.add('wave-now');
    });
  });
  document.querySelectorAll('img.righto').forEach(function (r) {
    r.addEventListener('click', function () {
      r.classList.remove('hop'); void r.offsetWidth; r.classList.add('hop');
    });
    r.addEventListener('animationend', function (e) { if (e.animationName === 'hop') r.classList.remove('hop'); });
  });

  // Waitlist forms.
  var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll('form.waitlist').forEach(function (form) {
    var box = form.parentNode;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = form.email.value.trim();
      if (form.website.value) return;          // bot filled the hidden box
      if (!okEmail.test(email)) { box.classList.add('bad'); form.email.focus(); return; }
      box.classList.remove('bad');
      var btn = form.querySelector('button'); btn.disabled = true;
      var done = function () { box.classList.add('ok'); btn.disabled = false; };
      if (!WAITLIST_URL) { done(); return; }
      var body = new FormData(); body.append(WAITLIST_FIELD, email);
      fetch(WAITLIST_URL, { method: 'POST', body: body, mode: 'no-cors' })
        .then(done)
        .catch(function () {
          btn.disabled = false;
          box.querySelector('.err').textContent = "Couldn't reach the list just now. Try again in a moment?";
          box.classList.add('bad');
        });
    });
    form.email.addEventListener('input', function () { box.classList.remove('bad'); });
  });
})();
