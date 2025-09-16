const NOT_APPLICABLE = "n/a";
const STRENGTH = [NOT_APPLICABLE, "easy", "regular", "medium", "strong"];
let rangeValue;
const options = {
  uppercase: false,
  lowercase: false,
  number: false,
  symbol: false,
};
const LOWER_ALPHABET = Array.from(
  { length: "z".codePointAt(0) - "a".codePointAt(0) + 1 },
  (_, index) => String.fromCodePoint("a".codePointAt(0) + index)
).join("");
const UPPER_ALPHABET = LOWER_ALPHABET.toUpperCase();
const NUMBER = "0123456789";
const SYMBOL = "@#$%^&*!~+_-[]¥/:";

const rangeInput = document.getElementById("password-generator__range-input");
const rangeOutput = document.querySelector(
  ".password-generator__input-range-output"
);
const clipImgButton = document.querySelector(
  ".password-generator__output-img-wrapper"
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
const generateButton = document.querySelector(
  ".password-generator__input-strength-button"
);
const passwordOutput = document.querySelector(
  ".password-generator__output-content"
);
const bubble = document.querySelector(".bubble");

async function writeClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showUpBubble();
  } catch (error) {
    console.log(error.message);
  }
}

clipImgButton.addEventListener("click", (ev) => {
  writeClipboardText(passwordOutput.textContent);
});

function showUpBubble() {
  bubble.removeAttribute("hidden");
  bubble.classList.add("active");
  setTimeout(() => {
    bubble.setAttribute("hidden", "");
    bubble.classList.remove("active");
  }, 3000);
}

function syncOptionFlagWithStringToUse(option) {
  let characterToUse = "";
  switch (option) {
    case "uppercase":
      characterToUse = UPPER_ALPHABET;
      break;
    case "lowercase":
      characterToUse = LOWER_ALPHABET;
      break;
    case "number":
      characterToUse = NUMBER;
      break;
    case "symbol":
      characterToUse = SYMBOL;
      break;
  }
  return characterToUse;
}

generateButton.addEventListener("click", (ev) => {
  if (!validateInputs()) return;
  const rangeValue = parseInt(rangeInput.value);
  let characterToGeneratePassword = "";
  let generatedPassword = "";
  for (const option in options) {
    if (!options[option]) continue;
    characterToGeneratePassword += syncOptionFlagWithStringToUse(option);
  }

  for (let i = 0; i < rangeValue; i++) {
    const num = Math.floor(Math.random() * characterToGeneratePassword.length);
    generatedPassword += characterToGeneratePassword[num];
  }
  passwordOutput.textContent = generatedPassword;
});

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
  let strength = calculatePasswordStrength();
  if (rangeValue === 0) strength = NOT_APPLICABLE;
  if (!STRENGTH.includes(strength)) return;

  if (strength === NOT_APPLICABLE) {
    passwordStrengthOutput.textContent = "";
    passwordOutput.classList.remove("active");
    generateButton.setAttribute("disabled", "");
  } else {
    passwordStrengthOutput.textContent = strength.toUpperCase();
    passwordOutput.classList.add("active");
    generateButton.removeAttribute("disabled");
  }
  addStrengthClassToIndicatorParent(strength);
  activateIndicators(STRENGTH.indexOf(strength));
}

function syncOptionFlagWithCheckStatus(value, checked) {
  options[value] = checked;
}

function calculatePasswordStrength() {
  const map = {
    0: NOT_APPLICABLE,
    1: "easy",
    2: "regular",
    3: "medium",
    4: "strong",
  };

  const checkedCount = Array.from(checkBoxes).reduce((count, current) => {
    syncOptionFlagWithCheckStatus(current.value, current.checked);
    console.log(options);

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
    displayPasswordStrength();
  });
}

initRangeInput();
