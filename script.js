let expression = "";
let degreeMode = true;

const expressionBox = document.getElementById("expression");
const resultBox = document.getElementById("result");
const modeBtn = document.getElementById("modeBtn");
const historyBox = document.getElementById("history");


// Display update
function updateDisplay() {
  expressionBox.value = expression;
}


// Add value to calculator
function add(value) {
  expression += value;
  updateDisplay();
}


// Clear everything
function clearAll() {
  expression = "";
  resultBox.value = "0";
  updateDisplay();
}


// Delete last character
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}


// DEG / RAD mode
function toggleMode() {
  degreeMode = !degreeMode;

  modeBtn.textContent = degreeMode ? "DEG" : "RAD";
}


// Convert degree to radians
function toRadians(x) {
  return x * Math.PI / 180;
}


// Sine
function sin(x) {
  return Math.sin(
    degreeMode ? toRadians(x) : x
  );
}


// Cosine
function cos(x) {
  return Math.cos(
    degreeMode ? toRadians(x) : x
  );
}


// Tangent
function tan(x) {
  return Math.tan(
    degreeMode ? toRadians(x) : x
  );
}


// Log base 10
function log(x) {
  return Math.log10(x);
}


// Natural log
function ln(x) {
  return Math.log(x);
}


// Square root
function sqrt(x) {
  return Math.sqrt(x);
}


// Prepare expression
function prepareExpression(exp) {

  // Pi
  exp = exp.replaceAll("π", "Math.PI");

  // Euler's number
  exp = exp.replace(/\be\b/g, "Math.E");

  // Multiplication and division
  exp = exp.replaceAll("×", "*");
  exp = exp.replaceAll("÷", "/");

  // Powers
  exp = exp.replaceAll("^2", "**2");
  exp = exp.replaceAll("^", "**");

  // Square root
  exp = exp.replaceAll("√", "sqrt");

  // Percentage
  exp = exp.replaceAll("%", "/100");

  return exp;
}


// Calculate result
function calculate() {

  if (!expression) {
    return;
  }

  try {

    const prepared = prepareExpression(expression);

    const answer = Function(
      "sin",
      "cos",
      "tan",
      "log",
      "ln",
      "sqrt",
      "return " + prepared
    )(
      sin,
      cos,
      tan,
      log,
      ln,
      sqrt
    );


    // Check invalid result
    if (!Number.isFinite(answer)) {
      throw new Error("Invalid result");
    }


    // Round long decimal answers
    const rounded =
      Math.abs(answer) < 1e-12
        ? 0
        : Number(answer.toPrecision(12));


    resultBox.value = rounded;

    addHistory(expression, rounded);

  } catch (error) {

    resultBox.value = "Error";

  }
}


// Add calculation to history
function addHistory(exp, answer) {

  const item = document.createElement("div");

  item.className = "history-item";

  item.textContent =
    exp + " = " + answer;

  historyBox.appendChild(item);

  historyBox.scrollTop =
    historyBox.scrollHeight;
}


// Clear history
function clearHistory() {

  historyBox.innerHTML =
    '<div class="history-title">History</div>';

}


// Keyboard support
document.addEventListener(
  "keydown",
  function(event) {

    const key = event.key;


    // Numbers and basic operators
    if (/[0-9.+\-*/()]/.test(key)) {

      if (key === "*") {

        add("×");

      } else if (key === "/") {

        add("÷");

      } else {

        add(key);

      }
    }


    // Enter = calculate
    if (key === "Enter") {

      calculate();

    }


    // Backspace
    if (key === "Backspace") {

      backspace();

    }


    // Escape = clear
    if (key === "Escape") {

      clearAll();

    }

  }
);
