document.addEventListener("DOMContentLoaded", e => {

  const formSection = document.querySelectorAll(".form-contents")
  const buttons = document.querySelectorAll(".buttons")
  const inputEls = document.querySelectorAll(".input")
  const planCards = document.querySelectorAll(".plan")
  const togglePlanBtn = document.querySelector(".toggle-plan")
  const addOnOptions = document.querySelectorAll(".add-on")
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
    
 
      if (nameEl) nameEl.value = state.personal.name;
      if (emailEl) emailEl.value = state.personal.email
      if (phone) phone.value = state.personal.phone

      return true
    }

    if (step == 1) {
      document.querySelectorAll(".plan").forEach(p => {
        const type = p.dataset.planType
        p.classList.toggle("plan-selected", type === state.plan.type)
      })
    }

    if (step == 3) {
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
      })

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
    console.log("this is the summary stuff")
  }

  function init() {
    render(CURR_SECTION)
  }

  buttons.forEach(btn => {
    const goBack = btn.querySelector(".back")
    const nextPage = btn.querySelector(".next")


    goBack.addEventListener("click", () => {
      if (CURR_SECTION == 0) {
        
        render(0)
        state.currStep = 0
        saveCurrentStepData()
      } else {
        render(CURR_SECTION);
        CURR_SECTION = CURR_SECTION - 1
        state.currStep = CURR_SECTION
        saveCurrentStepData()
    }
    })

    nextPage.addEventListener("click", () => {
      if (CURR_SECTION == PAGES) {
        render(CURR_SECTION)
        state.currStep = CURR_SECTION
        saveCurrentStepData()
      } else {
        if (validateData(CURR_SECTION)) {
        CURR_SECTION = CURR_SECTION + 1
        state.currStep = CURR_SECTION
        render(CURR_SECTION)
        }
        saveCurrentStepData()
      }
    })
  })

  init()

})
