/* ==========================================================================
   [BUSINESS NAME] — site scripts
   1. Form endpoint (EDIT THIS)
   2. Timeline reveal
   3. Mobile nav
   4. Quote form validation + submit
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. FORM ENDPOINT — replace with your real Formspree endpoint.
      Sign up at https://formspree.io, create a form, and paste its URL here
      AND in the <form action="..."> attribute in index.html.
      Using Netlify Forms instead? See README.md.
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

/* Marks that JS is running — the reveal animation only arms itself when this
   class is present, so the timeline is never invisible without JS. */
document.documentElement.classList.add("js");

/* --------------------------------------------------------------------------
   2. Timeline reveal — plays once, when the changeover window scrolls into
      view. Skipped entirely when the visitor prefers reduced motion.
   -------------------------------------------------------------------------- */
(function () {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    timeline.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add("is-visible");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(timeline);
})();

/* --------------------------------------------------------------------------
   3. Mobile nav toggle
   -------------------------------------------------------------------------- */
(function () {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // close the menu after choosing a section
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* --------------------------------------------------------------------------
   4. Quote form — client-side validation with specific messages, honeypot,
      and a fetch submit to the endpoint above.
   -------------------------------------------------------------------------- */
(function () {
  const form = document.getElementById("quote-form");
  const success = document.getElementById("quote-success");
  const formError = document.getElementById("form-error");
  if (!form) return;

  // field id -> message shown when it's missing or wrong
  const messages = {
    "q-name": "Add your name so we know who to ask for.",
    "q-email": "Add an email address, like name@example.com, so we can send your quote.",
    "q-phone": "Add a phone number so we can call you back.",
    "q-address": "Tell us the property's address or area so we can price the travel.",
    "q-bedrooms": "Choose the number of bedrooms — it sets the changeover price.",
    "q-bathrooms": "Choose the number of bathrooms.",
    "q-changeovers": "Pick a rough number of changeovers — “not sure yet” is fine.",
    "q-linen": "Tell us if you need linen supplied — “not sure” is fine.",
    "q-garden": "Tell us if there's a garden or outside space.",
  };

  function showError(field, message) {
    const wrapper = field.closest(".field");
    const errorEl = document.getElementById(field.id + "-error");
    if (wrapper) wrapper.classList.add("has-error");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    const wrapper = field.closest(".field");
    const errorEl = document.getElementById(field.id + "-error");
    if (wrapper) wrapper.classList.remove("has-error");
    if (errorEl) errorEl.textContent = "";
  }

  function validateField(field) {
    const value = field.value.trim();

    if (field.required && value === "") {
      showError(field, messages[field.id] || "This one's needed to price the job.");
      return false;
    }

    if (field.type === "email" && value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(field, "That email doesn't look complete — check it reads like name@example.com.");
      return false;
    }

    if (field.type === "tel" && value !== "" && value.replace(/\D/g, "").length < 10) {
      showError(field, "That phone number looks short — check the digits.");
      return false;
    }

    clearError(field);
    return true;
  }

  // validate as the visitor leaves each field, clear as they fix it
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    if (field.closest(".hp-field")) return;
    field.addEventListener("blur", () => {
      if (field.required || field.value.trim() !== "") validateField(field);
    });
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("has-error")) validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.hidden = true;

    // honeypot: a filled "company" field means a bot — quietly do nothing
    if (form.elements.company && form.elements.company.value !== "") return;

    let firstInvalid = null;
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.closest(".hp-field")) return;
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form endpoint returned " + response.status);

      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      formError.textContent =
        "The form didn't send. Please try again in a minute, or call the number above and we'll take the details over the phone.";
      formError.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = "Get your quote";
    }
  });
})();
