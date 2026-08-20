document.addEventListener("DOMContentLoaded", e => {

  const formSection = document.querySelectorAll(".form-contents")
  const buttons = document.querySelectorAll(".buttons")
  const inputEls = document.querySelectorAll(".input")
  const planCards = document.querySelectorAll(".plan")
  const togglePlanBtn = document.querySelector(".toggle-plan")
  const addOnOptions = document.querySelectorAll(".add-on")
  const finshingUp = document.querySelectorAll("finishing-up:not(:first-child)")
  const PAGES = formSection.length - 1
  let CURR_SECTION = 0

  const state = {
    currStep: 0,
    billing: "monthly",
    personal: {
      name: "",
      email: "",
      phone: ""
    },
    plan: {
      type: "arcade",
      price: 9
    },
    addons: {
      online: false,
      storage: false,
      custom: false
    }
  }


  function render(curr) {
    formSection.forEach((section, i) => {
    if (i == curr) {
      section.style.display = "flex"
    } else {
      section.style.display = "none"
    }
    })

  }

  function validateData(step) {
    if (step == 0) {

      const nameEl = document.querySelector("#name")
      const emailEl = document.querySelector("#email")
      const phone = document.querySelector("#phone-no")

      let isValid = true
      inputEls.forEach(el => {
        const input = el.querySelector("input")
        const isEmpty = input.value.trim() == ""
        el.closest(".input").classList.toggle("has-error", isEmpty)
        if(isEmpty) isValid = false
      })

      if(!isValid) return false


      if (nameEl) state.personal.name = nameEl.value.trim()
      if (emailEl) state.personal.email = emailEl.value.trim()
      if (phone) state.personal.phone = phone.value.trim()


      return true
    }

    if (step == 1) {
      console.log("we are in step 1")

      const selectedPlan = document.querySelector(".plan.plan-selected")
      if (!selectedPlan) {
        alert("Please select a plan before continuing")
        return false
      }

      updateToggleUI()
    }

    if (step == 2) {
      console.log("we are in step 2")
      addOnOptions.forEach((addon, index) => {
        const checkBox = addon.querySelector("input[type='checkbox']")
        if (!checkBox) return;

        const key = ["online", "storage", "custom"][index]
        if (key) {
          state.addons[key] = checkBox.checked
          addon.classList.toggle("addon-selected", checkBox.checked);
        }
      })
      updateSummary()
    }

    if (step == 3) {
      console.log("we do reach ehre right rght?amiright??")
      updateSummary()
    }
    return true
  }

  function saveCurrentStepData() {
    const step = state.currStep

    if (step == 0) {
      const name = document.querySelector("#name")
      const email = document.querySelector("#email")
      const phone = document.querySelector("#phone-no")

      state.personal.name = name ? name.value.trim() : ""
      state.personal.email = email ? email.value.trim() : ""
      state.personal.phone = phone ? phone.value.trim() : ""
      console.log(state)
    }

    if (step == 1) {
      const selectedPlan = document.querySelector(".plan.plan-selected")
      if (selectedPlan) {
        const type = selectedPlan.dataset.planType
        const priceText = selectedPlan.querySelector("p").textContent
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

        state.plan.type = type;
        state.plan.price = price;

      }
    }

    if (step == 2) {
      addOnOptions.forEach((addon, index) => {
        const checkBox = addon.querySelector("input[type='checkbox']")
        if (!checkBox) return;

        const key = ["online", "storage", "custom"][index]
        if(key) state.addons[key] = checkBox.checked
      })
    }
  }

  function updateSummary() {
    console.log("ayaya")
      const planName = state.plan.type.charAt(0).toUpperCase() + state.plan.type.slice(1);
      const billingLabel = state.billing === "monthly" ? "Monthly" : "Yearly";
    const rateSuffix = state.billing === "monthly" ? "mo" : "yr";
    console.log(planName, billingLabel, rateSuffix)

      const firstRow = document.querySelector(".finishing-up:first-child");
      if (firstRow) {
        const h3 = firstRow.querySelector("h3");
        const rate = firstRow.querySelector(".finishing-up-rate");
        if (h3) h3.innerHTML = `${planName} (<span>${billingLabel}</span>)`;
        if (rate) rate.textContent = `$${state.plan.price}/${rateSuffix}`;
      }

    const addonRows = document.querySelectorAll(".finishing-up:not(:first-child)");
      const addonKeys = ["online", "storage", "custom"];
      const addonPrices = [1, 2, 2];
      let addonTotal = 0;

    addonRows.forEach((row, index) => {
        console.log(row)
        const key = addonKeys[index];
        const isActive = state.addons[key];
        const rate = row.querySelector(".finishing-up-rate");
        const ratePrice = state.billing == "monthly" ? addonPrices[index] : addonPrices[index] * 10
        if (rate) rate.textContent = `$${ratePrice}/${rateSuffix}`;
      
        row.style.display = isActive ? "flex" : "none";
        if (isActive) {
          addonTotal += addonPrices[index] * (state.billing === "yearly" ? 10 : 1);
        }
           });

           const totalDiv = document.querySelector(".total");
           if (totalDiv) {
             const totalRate = totalDiv.querySelector(".finishing-up-rate");
             const grandTotal = state.plan.price + addonTotal;
             if (totalRate) {
               totalRate.textContent = `$${grandTotal}/${rateSuffix}`;
             }
           }
         }

  function init() {
    render(CURR_SECTION)
    updateToggleUI()
  }

  function updateToggleUI() {
    const billing = state.billing

    if (!togglePlanBtn) return
    togglePlanBtn.classList.remove("toggle-plan-monthly", "toggle-plan-yearly")
    if (billing == "monthly") {
      togglePlanBtn.classList.add("toggle-plan-monthly")
    } else {
      togglePlanBtn.classList.add("toggle-plan-yearly")
    }


    const multiplier = billing == "yearly" ? 10 : 1
    const suffix = billing == "yearly" ? "/yr" : "/mo"

    planCards.forEach((plan, i) => {
      const prices = [9, 12, 15]
      const p = plan.querySelector("p")
      if (!p) return
      const newPrice = prices[i] * multiplier
      p.textContent = `$${newPrice}${suffix}`
    })

    addOnOptions.forEach((addon, i) => {
      const prices = [1, 1, 2]
      const p = addon.querySelector(".add-on-rate")
      if (!p) return
      const newPrice = prices[i] * multiplier
      p.textContent = `+$${newPrice}${suffix}`
    })

    finshingUp.forEach((fin, i) => {
      const prices = [1, 1, 2]
      const p = addon.querySelector("p")
      if (!p) return
      const newPrice = prices[i] * multiplier
      p.textContent = `+$${newPrice}${suffix}`
    })

  }

  planCards.forEach(c => {
    c.addEventListener("click", () => {
      const h3 = c.querySelector("h3")
      const p = c.querySelector("p")

      const type = h3.textContent.toLowerCase()
      const price = parseInt(p.textContent.replace(/[^0-9]/g, ''), 10);
      state.plan = { ...state.plan, type, price }

      planCards.forEach(c => { c.classList.remove("plan-selected") })
      c.classList.add("plan-selected")
    })
  })

  togglePlanBtn.addEventListener("click", () => {
    if (state.billing == "monthly") {
      state.billing = "yearly"
      togglePlanBtn.classList.remove("toggle-plan-monthly")
      togglePlanBtn.classList.add("toggle-plan-yearly")
    } else {
      state.billing = "monthly"
      togglePlanBtn.classList.remove("toggle-plan-yearly")
      togglePlanBtn.classList.add("toggle-plan-monthly")
    }
    updateToggleUI()
  })


  buttons.forEach(btn => {
    const goBack = btn.querySelector(".back")
    const nextPage = btn.querySelector(".next")


    goBack.addEventListener("click", () => {
      if (CURR_SECTION == 0) {

        state.currStep = 0
        saveCurrentStepData()
        render(0)
      } else {
        CURR_SECTION = CURR_SECTION - 1
        saveCurrentStepData()
        state.currStep = CURR_SECTION
        render(CURR_SECTION);
    }
    })

    nextPage.addEventListener("click", () => {
      if (CURR_SECTION == PAGES) {
        saveCurrentStepData()
        render(CURR_SECTION)
        state.currStep = CURR_SECTION
      } else {
        if (validateData(CURR_SECTION)) {
        saveCurrentStepData()
        CURR_SECTION = CURR_SECTION + 1
        state.currStep = CURR_SECTION
        render(CURR_SECTION)
        console.log(CURR_SECTION)
        }
      }
    })
  })

  init()

})
