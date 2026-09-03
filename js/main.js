(function () {
  "use strict";

  /* ===== radio pill visual state (fallback for browsers without :has()) ===== */
  document.querySelectorAll(".choice-pill input[type=radio]").forEach(function (input) {
    input.addEventListener("change", function () {
      var groupName = input.name;
      document.querySelectorAll('input[name="' + groupName + '"]').forEach(function (sibling) {
        sibling.closest(".choice-pill").classList.toggle("is-checked", sibling.checked);
      });
    });
  });

  /* ===== signup form submission ===== */
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
