(function () {
  "use strict";

  /* ===================== sections (מדורים) catalog - same examples as the samples site ===================== */
  var SECTIONS = [
    { v: "דבר תורה", img: "section-01", d: "דבר תורה" },
    { v: "מה בפרשה", img: "section-02", d: "תמצית הפרשה השבועית" },
    { v: "חידות בתמונות", img: "sec-chidot-tmunot-0a82ad9d", d: "חידה בתמונות על הפרשה" },
    { v: "חידות לפרשה", img: "section-04", d: "חידות א' עד ת' על הפרשה" },
    { v: "מסביב לשולחן", img: "sec-misaviv-20260930-1", d: "סיפור ושאלות דיון למשפחה (מומלץ)" },
    { v: "זה קרה באמת", img: "section-07", d: "סיפור צדיקים קצר" },
    { v: "סיפור בהמשכים", img: "section-08", d: "סיפור הרפתקאות מאויר" },
    { v: "קומיקס", img: "section-12", d: "קומיקס עם מסר ערכי" },
    { v: "מצא את ההבדלים", img: "section-14", d: "מצא את ההבדלים" },
    { v: "נפלאות הבריאה", img: "section-16", d: "נפלאות הבריאה" },
    { v: "תפזורת", img: "sec-tifzoret-20260930-1", d: "תפזורת על פרשת השבוע" },
    { v: "בריא לדעת", img: "sec-bari-c9a475e5", d: "בריא לדעת" },
    { v: "יש לי מושג", img: "sec-yesh-li-musag-20260930-1", d: "שאלות ותשובות ביהדות" },
    { v: "מלתא דבדיחותא", img: "section-15", d: "בדיחה קצרה" },
    { v: "ככה זה בחיים", img: "section-20", d: "כישור חיים משמעותי, כל שבוע אחר" },
    { v: "מה לעשות", img: "sec-ma-laasot-20260930-1", d: "הצעה לפעילות משפחתית" }
  ];

  function buildSectionsGroup(container, name) {
    if (!container) return;
    SECTIONS.forEach(function (s, i) {
      var id = name + "_" + i;
      var imgSrc = "assets/images/sections/" + s.img + ".webp";
      var altText = "דוגמה למדור " + s.v + " - " + s.d;

      var card = document.createElement("div");
      card.className = "choice-img-card";
      card.setAttribute("data-id", "sec-" + s.img);
      card.setAttribute("data-full", imgSrc);

      var zoomBtn = document.createElement("button");
      zoomBtn.type = "button";
      zoomBtn.className = "ex-zoom";
      zoomBtn.setAttribute("aria-label", "הגדלת דוגמה: " + s.v);
      var img = document.createElement("img");
      img.src = imgSrc;
      img.alt = altText;
      img.loading = "lazy";
      zoomBtn.appendChild(img);

      var pickLabel = document.createElement("label");
      pickLabel.className = "pick-label";
      pickLabel.title = s.d;
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = name;
      input.id = id;
      input.value = s.v;
      var span = document.createElement("span");
      span.className = "label";
      span.textContent = s.v;
      pickLabel.appendChild(input);
      pickLabel.appendChild(span);

      card.appendChild(zoomBtn);
      card.appendChild(pickLabel);
      container.appendChild(card);
    });
  }
  buildSectionsGroup(document.querySelector('#sectionsUnifiedRow [data-sections-group]'), "sectionsUnified");
  buildSectionsGroup(document.querySelector('#sectionsYoungRow [data-sections-group]'), "sectionsYoung");
  buildSectionsGroup(document.querySelector('#sectionsOldRow [data-sections-group]'), "sectionsOld");

  /* soft cap: disable further checkboxes once max reached in a group */
  document.querySelectorAll("[data-sections-group]").forEach(function (group) {
    var max = parseInt(group.getAttribute("data-max"), 10) || 4;
    var counterEl = group.closest(".form-row").querySelector("[data-counter]");

    function refresh() {
      var boxes = group.querySelectorAll('input[type="checkbox"]');
      var checkedCount = group.querySelectorAll('input[type="checkbox"]:checked').length;
      if (counterEl) counterEl.textContent = String(checkedCount);
      boxes.forEach(function (box) {
        box.disabled = !box.checked && checkedCount >= max;
      });
    }

    group.addEventListener("change", refresh);
    refresh();
  });

  /* ===================== age-tier toggles which sections group shows ===================== */
  var ageTierInputs = document.querySelectorAll('input[name="ageTier"]');
  var unifiedRow = document.getElementById("sectionsUnifiedRow");
  var youngRow = document.getElementById("sectionsYoungRow");
  var oldRow = document.getElementById("sectionsOldRow");

  function syncAgeTierRows() {
    var checked = document.querySelector('input[name="ageTier"]:checked');
    var isTiered = checked && checked.value.indexOf("כן") === 0;
    unifiedRow.hidden = !!isTiered;
    youngRow.hidden = !isTiered;
    oldRow.hidden = !isTiered;
  }
  ageTierInputs.forEach(function (input) { input.addEventListener("change", syncAgeTierRows); });
  syncAgeTierRows();

  /* ===================== format choice reveals the matching gallery block ===================== */
  var formatInputs = document.querySelectorAll('input[name="format"]');
  var galleryHorizontalBlock = document.getElementById("galleryHorizontalBlock");
  var galleryVerticalBlock = document.getElementById("galleryVerticalBlock");

  function syncFormatGallery() {
    var checked = document.querySelector('input[name="format"]:checked');
    var val = checked ? checked.value : "";
    var showHorizontal = val.indexOf("אופקי") === 0 || val.indexOf("בטוח") >= 0;
    var showVertical = val.indexOf("אנכי") === 0 || val.indexOf("בטוח") >= 0;
    if (galleryHorizontalBlock) galleryHorizontalBlock.hidden = !showHorizontal;
    if (galleryVerticalBlock) galleryVerticalBlock.hidden = !showVertical;
  }
  formatInputs.forEach(function (input) { input.addEventListener("change", syncFormatGallery); });
  syncFormatGallery();

  /* ===================== radio/checkbox pill + image-card visual state ===================== */
  var PICK_SELECTOR = ".choice-pill, .choice-img-card, .format-pick-card";
  document.querySelectorAll(".choice-pill input, .choice-img-card input, .format-pick-card input").forEach(function (input) {
    input.addEventListener("change", function () {
      if (input.type === "radio") {
        document.querySelectorAll('input[name="' + input.name + '"]').forEach(function (sibling) {
          sibling.closest(PICK_SELECTOR).classList.toggle("is-checked", sibling.checked);
        });
      } else {
        input.closest(PICK_SELECTOR).classList.toggle("is-checked", input.checked);
      }
    });
  });

  /* ===================== gallery selection state (feeds "ז'אנר עיצובי") ===================== */
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
          var li = document.createElement("li");
          li.textContent = selections[k].label;
          list.appendChild(li);
        });
      } else {
        panel.hidden = true;
      }
    }
  }

  function buildDesignGenreSummary() {
    return Object.keys(selections).map(function (k) { return selections[k].label; }).join(", ");
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
  var lightboxActions = lightbox ? lightbox.querySelector(".lightbox-actions") : null;
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

    // only full newsletter examples (which have a PDF) are "likeable" as a design genre;
    // section/format preview images are zoom-only
    if (pdf) {
      lightboxPdf.href = pdf;
      lightboxPdf.hidden = false;
      lightboxLike.hidden = false;
      setLikeVisual(lightboxLike, isSelected(group, id));
    } else {
      lightboxPdf.hidden = true;
      lightboxLike.hidden = true;
    }
    if (lightboxActions) lightboxActions.hidden = !pdf;

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
      if (zoomBtn.classList.contains("zoom-icon-btn")) {
        e.preventDefault();
        e.stopPropagation();
      }
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
    designGenre: "entry.1335475370",
    contact: "entry.940452289",
    heardFrom: "entry.424039667",
    message: "entry.926088031",
    ageTier: "entry.1065344005",
    sectionsUnified: "entry.911981268",
    sectionsYoung: "entry.1405292591",
    sectionsOld: "entry.481439215",
    characterLevel: "entry.1488134807",
    characterGender: "entry.86235126"
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
    fd.append(ENTRY.designGenre, buildDesignGenreSummary());
    fd.append(ENTRY.contact, form.contact.value.trim());
    fd.append(ENTRY.heardFrom, form.heardFrom.value.trim());
    fd.append(ENTRY.message, form.message.value.trim());
    fd.append(ENTRY.characterLevel, (form.characterLevel.value || ""));
    fd.append(ENTRY.characterGender, (form.characterGender.value || ""));

    var ageTierChecked = document.querySelector('input[name="ageTier"]:checked');
    var isTiered = ageTierChecked && ageTierChecked.value.indexOf("כן") === 0;
    fd.append(ENTRY.ageTier, ageTierChecked ? ageTierChecked.value : "");

    if (isTiered) {
      document.querySelectorAll('input[name="sectionsYoung"]:checked').forEach(function (i) { fd.append(ENTRY.sectionsYoung, i.value); });
      document.querySelectorAll('input[name="sectionsOld"]:checked').forEach(function (i) { fd.append(ENTRY.sectionsOld, i.value); });
    } else {
      document.querySelectorAll('input[name="sectionsUnified"]:checked').forEach(function (i) { fd.append(ENTRY.sectionsUnified, i.value); });
    }

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
