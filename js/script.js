/* Leroy du Débarras — navigation, données entreprise, formulaire
 * Optimisé INP : travail critique immédiat, reste en idle / yield. */
(function () {
  "use strict";

  var site = window.LeroySite || {};
  var helpers = window.LeroySiteHelpers || {};

  function filled(value) {
    if (helpers.filled) return helpers.filled(value);
    return !!(value && String(value).trim());
  }

  function text(value, fallback) {
    return filled(value) ? String(value).trim() : fallback;
  }

  function idle(fn, timeout) {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(fn, { timeout: timeout || 2000 });
    } else {
      window.setTimeout(fn, 1);
    }
  }

  function yieldToMain() {
    if (window.scheduler && typeof window.scheduler.yield === "function") {
      return window.scheduler.yield();
    }
    return new Promise(function (resolve) {
      window.setTimeout(resolve, 0);
    });
  }

  /** Active les CSS différés (fonts) sans handler inline onload. */
  function activateDeferredCss() {
    var links = document.querySelectorAll('link[data-defer-css][media="print"]');
    for (var i = 0; i < links.length; i++) {
      links[i].media = "all";
      links[i].removeAttribute("data-defer-css");
    }
  }

  /** Liens téléphone / CTA sticky — prioritaire pour le premier appui. */
  function hydratePhoneLinks() {
    var nodes = document.querySelectorAll("[data-phone-link]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (filled(site.PHONE)) {
        var digits = String(site.PHONE).replace(/[^\d+]/g, "");
        el.setAttribute("href", "tel:" + digits);
        el.removeAttribute("hidden");
        el.removeAttribute("aria-hidden");
        el.removeAttribute("tabindex");
        var label = text(site.PHONE_DISPLAY || site.PHONE, "Appeler");
        if (el.getAttribute("data-phone-link") === "label") {
          el.textContent = "Appeler " + label;
        }
      } else {
        el.setAttribute("hidden", "");
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("tabindex", "-1");
      }
    }
  }

  /** Menu mobile : un seul listener (délégation) + Escape seulement si ouvert. */
  function hydrateNav() {
    var toggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }

    function onDocKeydown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        document.removeEventListener("keydown", onDocKeydown);
      }
    }

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      setOpen(open);
      if (open) {
        document.addEventListener("keydown", onDocKeydown);
      } else {
        document.removeEventListener("keydown", onDocKeydown);
      }
    });

    nav.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("a")) setOpen(false);
    });
  }

  function hydrateDataSite() {
    var nodes = document.querySelectorAll("[data-site]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-site");
      var fallback = el.getAttribute("data-empty") || "À renseigner";
      el.textContent = text(site[key], fallback);
    }
  }

  function hydrateRequire() {
    var nodes = document.querySelectorAll("[data-require]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-require");
      if (!filled(site[key])) el.hidden = true;
    }
  }

  function hydrateEmailLinks() {
    var nodes = document.querySelectorAll("[data-email-link]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (filled(site.EMAIL)) {
        el.setAttribute("href", "mailto:" + String(site.EMAIL).trim());
        el.removeAttribute("hidden");
        if (el.getAttribute("data-email-link") === "label") {
          el.textContent = String(site.EMAIL).trim();
        }
      } else {
        el.setAttribute("hidden", "");
      }
    }
  }

  function hydrateYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function hydrateForm() {
    var started = document.querySelector("#devis-form [name='startedAt']");
    if (started) started.value = String(Date.now());

    var form = document.getElementById("devis-form");
    var status = document.getElementById("form-status");
    if (!form || !status) return;

    function setStatus(state, message) {
      status.hidden = false;
      status.dataset.state = state;
      status.textContent = message;
    }

    function showError(id, message) {
      var el = document.getElementById(id);
      if (el) el.textContent = message || "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ["err-name", "err-phone", "err-email", "err-commune", "err-desc"].forEach(function (id) {
        showError(id, "");
      });

      var hp = form.querySelector("[name='website']");
      if (hp && String(hp.value || "").trim()) {
        setStatus("success", "Votre demande a bien été enregistrée.");
        form.reset();
        return;
      }

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var email = String(data.get("email") || "").trim();
      var commune = String(data.get("commune") || "").trim();
      var desc = String(data.get("description") || "").trim();
      var ok = true;

      if (name.length < 2) {
        showError("err-name", "Indiquez votre nom.");
        ok = false;
      }
      if (phone.replace(/\D/g, "").length < 8) {
        showError("err-phone", "Indiquez un numéro de téléphone valide.");
        ok = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("err-email", "Indiquez une adresse e-mail valide.");
        ok = false;
      }
      if (commune.length < 2) {
        showError("err-commune", "Indiquez la commune d’intervention.");
        ok = false;
      }
      if (desc.length < 10) {
        showError("err-desc", "Décrivez brièvement le besoin (au moins 10 caractères).");
        ok = false;
      }

      if (!ok) {
        setStatus("error", "Merci de corriger les champs indiqués.");
        var firstErr = form.querySelector(".field-error:not(:empty)");
        var field = firstErr && firstErr.previousElementSibling;
        if (field && typeof field.focus === "function") field.focus();
        return;
      }

      setStatus("sending", "Envoi en cours…");

      var payload = {
        name: name,
        phone: phone,
        email: email,
        commune: commune,
        service: String(data.get("service") || ""),
        housing: String(data.get("housing") || ""),
        volume: String(data.get("volume") || ""),
        access: String(data.get("access") || ""),
        description: desc,
        startedAt: String(data.get("startedAt") || ""),
        source: "leroy-debarras-site"
      };

      var endpoint = filled(site.FORM_ENDPOINT) ? String(site.FORM_ENDPOINT).trim() : "";

      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            if (!res.ok) throw new Error("http");
            setStatus(
              "success",
              "Merci. Votre demande de devis a bien été envoyée. Nous vous recontactons rapidement."
            );
            form.reset();
          })
          .catch(function () {
            setStatus(
              "error",
              "L’envoi n’a pas abouti. Réessayez dans un instant ou utilisez le téléphone lorsque le numéro sera indiqué."
            );
          });
        return;
      }

      if (filled(site.EMAIL)) {
        var body = [
          "Nom : " + payload.name,
          "Téléphone : " + payload.phone,
          "E-mail : " + payload.email,
          "Commune : " + payload.commune,
          "Prestation : " + payload.service,
          "Logement : " + payload.housing,
          "Volume : " + payload.volume,
          "Accès : " + payload.access,
          "",
          payload.description
        ].join("\n");
        window.location.href =
          "mailto:" +
          encodeURIComponent(String(site.EMAIL).trim()) +
          "?subject=" +
          encodeURIComponent("Demande de devis — Leroy du Débarras") +
          "&body=" +
          encodeURIComponent(body);
        setStatus(
          "success",
          "Votre logiciel de messagerie devrait s’ouvrir avec le message préparé. S’il ne s’ouvre pas, copiez votre texte et envoyez-le à l’adresse indiquée."
        );
        return;
      }

      setStatus(
        "error",
        "Le formulaire est prêt mais pas encore relié à une messagerie. Les coordonnées de contact seront affichées dès qu’elles seront communiquées."
      );
    });
  }

  // —— Bootstrap INP-friendly ——
  activateDeferredCss();
  hydratePhoneLinks();
  hydrateNav();

  idle(function () {
    Promise.resolve()
      .then(function () {
        hydrateDataSite();
        hydrateRequire();
        return yieldToMain();
      })
      .then(function () {
        hydrateEmailLinks();
        hydrateYear();
        return yieldToMain();
      })
      .then(function () {
        hydrateForm();
      });
  }, 1200);
})();
