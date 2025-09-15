const NOT_APPLICABLE = "n/a";
let rangeValue;

const rangeInput = document.getElementById("password-generator__range-input");
const rangeOutput = document.querySelector(
  ".password-generator__input-range-output"
);
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const passwordStrengthOutput = document.querySelector(
  ".password-generator__input-strength-output"
);
const passwordStrengthIndicator = document.querySelector(
  ".password-generator__input-strength-indicator"
);
const indicators = document.querySelectorAll(
  ".password-generator__input-strength-indicator > *"
);
const STRENGTH = [NOT_APPLICABLE, "easy", "regular", "medium", "strong"];

function getIndicators(num) {
  const indicatorsToUse = [];
  for (let i = 0; i < num; i++) {
    indicatorsToUse.push(indicators[i]);
  }
  return indicatorsToUse;
}

function resetIndicatorParent() {
  passwordStrengthIndicator.classList.forEach((cls) => {
    STRENGTH.includes(cls) && passwordStrengthIndicator.classList.remove(cls);
  });
}

function activateIndicators(num) {
  deactivateIndicators();
  const indicatorsToActivate = getIndicators(num);
  indicatorsToActivate.forEach((indicator) =>
    indicator.classList.add("active")
  );
}

function deactivateIndicators() {
  indicators.forEach((indicator) => indicator.classList.remove("active"));
}

function addStrengthClassToIndicatorParent(strength = "") {
  resetIndicatorParent();
  passwordStrengthIndicator.classList.add(strength);
}

function validateInputs() {
  const isChecked = Array.from(checkBoxes).some((checkBox) => checkBox.checked);

  return rangeValue !== 0 && isChecked;
}

function displayPasswordStrength() {
  const strength = calculatePasswordStrength();
  if (!STRENGTH.includes(strength)) return;

  if (strength === NOT_APPLICABLE) {
    passwordStrengthOutput.textContent = "";
  } else {
    passwordStrengthOutput.textContent = strength.toUpperCase();
  }
  addStrengthClassToIndicatorParent(strength);
  activateIndicators(STRENGTH.indexOf(strength));
}

function calculatePasswordStrength() {
  const map = {
    0: NOT_APPLICABLE,
    1: "easy",
    2: "regular",
    3: "medium",
    4: "strong",
  };

  //   if (!validateInputs()) {
  //     passwordStrengthOutput.textContent = "";
  //     resetIndicatorParent();
  //     return;
  //   }

  const checkedCount = Array.from(checkBoxes).reduce((count, current) => {
    return (current.checked ? 1 : 0) + count;
  }, 0);

  return map[checkedCount];
}

function handleCheckBoxClick(ev) {
  displayPasswordStrength();
}

checkBoxes.forEach((checkBox) =>
  checkBox.addEventListener("click", handleCheckBoxClick)
);

function initRangeInput() {
  rangeInput.value = 0;
  rangeValue = parseInt(rangeInput.value);
  const min = rangeInput.min;
  const max = rangeInput.max;
  const step = rangeInput.step;

  rangeInput.addEventListener("input", (e) => {
    if (parseInt(e.target.value) === 0) {
      e.target.classList.remove("active");
    } else {
      e.target.classList.add("active");
    }
    const lengthRatio = (e.target.value / ((max - min) / step)) * 100;
    e.target.style.backgroundSize = `${lengthRatio}% 100%`;
    rangeOutput.textContent = e.target.value;
    rangeValue = parseInt(e.target.value);
    handleCheckBoxClick();
  });
}

initRangeInput();
