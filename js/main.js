(function () {
  "use strict";

  /* ===================== radio pill visual state ===================== */
  document.querySelectorAll(".choice-pill input[type=radio]").forEach(function (input) {
    input.addEventListener("change", function () {
      var groupName = input.name;
      document.querySelectorAll('input[name="' + groupName + '"]').forEach(function (sibling) {
        sibling.closest(".choice-pill").classList.toggle("is-checked", sibling.checked);
      });
    });
  });

  /* ===================== gallery selection state ===================== */
  var GROUP_LABELS = { format: "עיצוב שאהבתם" };
  var selections = {}; // key: group__id -> { group, id, label }

  function setLikeVisual(btn, selected) {
    btn.setAttribute("aria-pressed", selected ? "true" : "false");
    var heart = btn.querySelector(".heart");
    if (heart) heart.textContent = selected ? "❤️" : "🤍";
  }

  function cardLabel(card) {
    var h4 = card.querySelector("h4");
    if (h4) return h4.textContent.trim();
    var img = card.querySelector("img");
    return img ? img.alt : card.getAttribute("data-id");
  }

  function selectionKey(group, id) { return group + "__" + id; }

  function setSelected(group, id, label, selected) {
    var key = selectionKey(group, id);
    if (selected) {
      selections[key] = { group: group, id: id, label: label };
    } else {
      delete selections[key];
    }
    syncLikeButtons(group, id, selected);
    renderSelectionsUI();
  }

  function isSelected(group, id) {
    return !!selections[selectionKey(group, id)];
  }

  function syncLikeButtons(group, id, selected) {
    var container = document.querySelector('[data-group="' + group + '"]');
    if (container) {
      var fig = container.querySelector('[data-id="' + cssEscape(id) + '"]');
      if (fig) {
        var btn = fig.querySelector("[data-like]");
        if (btn) setLikeVisual(btn, selected);
      }
    }
    var lb = document.getElementById("lightbox");
    if (lb && lb.dataset.group === group && lb.dataset.id === id) {
      var lbLike = document.getElementById("lightboxLike");
      setLikeVisual(lbLike, selected);
    }
  }

  function cssEscape(str) {
    if (window.CSS && CSS.escape) return CSS.escape(str);
    return String(str).replace(/[^a-zA-Z0-9_֐-׿-]/g, "\\$&");
  }

  function renderSelectionsUI() {
    var keys = Object.keys(selections);
    var count = keys.length;

    var panel = document.getElementById("selectionsPanel");
    var list = document.getElementById("selectionsList");
    if (panel && list) {
      if (count > 0) {
        panel.hidden = false;
        list.innerHTML = "";
        keys.forEach(function (k) {
          var sel = selections[k];
          var li = document.createElement("li");
          li.textContent = (GROUP_LABELS[sel.group] || sel.group) + ": " + sel.label;
          list.appendChild(li);
        });
      } else {
        panel.hidden = true;
      }
    }

    syncDesignField();
  }

  var designFieldDirty = false;

  function buildDesignSummary() {
    var labels = Object.keys(selections).map(function (k) { return selections[k].label; });
    return labels.join(", ");
  }

  function syncDesignField() {
    if (designFieldDirty) return;
    var field = document.getElementById("f_design");
    if (!field) return;
    field.value = buildDesignSummary();
  }

  var designField = document.getElementById("f_design");
  if (designField) {
    designField.addEventListener("input", function () { designFieldDirty = true; });
  }

  /* ===================== like buttons (delegated) ===================== */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-like]");
    if (!btn) return;
    var card = btn.closest("[data-id]");
    if (!card) return;
    var groupContainer = btn.closest("[data-group]");
    var group = groupContainer ? groupContainer.getAttribute("data-group") : "other";
    var id = card.getAttribute("data-id");
    var label = cardLabel(card);
    var nowSelected = btn.getAttribute("aria-pressed") !== "true";
    setLikeVisual(btn, nowSelected);
    setSelected(group, id, label, nowSelected);
  });

  /* ===================== lightbox ===================== */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxLike = document.getElementById("lightboxLike");
  var lightboxPdf = document.getElementById("lightboxPdf");
  var lastFocused = null;

  function openLightbox(card) {
    var full = card.getAttribute("data-full");
    var pdf = card.getAttribute("data-pdf");
    var group = card.closest("[data-group]");
    group = group ? group.getAttribute("data-group") : "other";
    var id = card.getAttribute("data-id");
    var label = cardLabel(card);
    var img = card.querySelector("img");

    lightboxImg.src = full || (img ? img.src : "");
    lightboxImg.alt = img ? img.alt : label;
    lightbox.dataset.group = group;
    lightbox.dataset.id = id;
    setLikeVisual(lightboxLike, isSelected(group, id));

    if (pdf) {
      lightboxPdf.href = pdf;
      lightboxPdf.hidden = false;
    } else {
      lightboxPdf.hidden = true;
    }

    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  if (lightbox) {
    document.addEventListener("click", function (e) {
      var zoomBtn = e.target.closest(".ex-zoom");
      if (!zoomBtn) return;
      var card = zoomBtn.closest("[data-id]");
      if (card) openLightbox(card);
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
    lightboxLike.addEventListener("click", function () {
      var group = lightbox.dataset.group;
      var id = lightbox.dataset.id;
      var nowSelected = lightboxLike.getAttribute("aria-pressed") !== "true";
      setLikeVisual(lightboxLike, nowSelected);
      var card = document.querySelector('[data-group="' + group + '"] [data-id="' + cssEscape(id) + '"]');
      var label = card ? cardLabel(card) : id;
      setSelected(group, id, label, nowSelected);
    });
  }

  /* ===================== signup form submission ===================== */
  var FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSd6ypJL8gAQOGHLjyVXUtk3isX1eTtLIH7G2qgmk8x6BvdT2Q/formResponse";
  var ENTRY = {
    school: "entry.410658473",
    principalName: "entry.1069671649",
    principalPhone: "entry.1740239770",
    altContact: "entry.2073179539",
    studentGender: "entry.1086938305",
    format: "entry.343222456",
    designNote: "entry.1335475370",
    contact: "entry.940452289",
    heardFrom: "entry.424039667",
    message: "entry.926088031"
  };

  var form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var errorEl = document.getElementById("formError");
    var successEl = document.getElementById("formSuccess");
    errorEl.hidden = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var submitBtn = form.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "שולח...";

    var fd = new FormData();
    fd.append(ENTRY.school, form.school.value.trim());
    fd.append(ENTRY.principalName, form.principalName.value.trim());
    fd.append(ENTRY.principalPhone, form.principalPhone.value.trim());
    fd.append(ENTRY.altContact, form.altContact.value.trim());
    fd.append(ENTRY.studentGender, (form.studentGender.value || ""));
    fd.append(ENTRY.format, (form.format.value || ""));
    fd.append(ENTRY.designNote, form.designNote.value.trim());
    fd.append(ENTRY.contact, form.contact.value.trim());
    fd.append(ENTRY.heardFrom, form.heardFrom.value.trim());
    fd.append(ENTRY.message, form.message.value.trim());

    fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body: fd })
      .then(function () { onSubmitDone(true); })
      .catch(function () { onSubmitDone(false); });

    function onSubmitDone(ok) {
      submitBtn.disabled = false;
      submitBtn.textContent = "שליחה והצטרפות לחודש חינם";
      if (ok) {
        form.hidden = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        errorEl.hidden = false;
        errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
})();
