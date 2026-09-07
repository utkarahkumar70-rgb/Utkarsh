
let expression = "";

let lastAnswer = 0;

let degreeMode = true;

let inverseMode = false;


const expressionDisplay =
  document.getElementById("expression");

const resultDisplay =
  document.getElementById("result");

const historyList =
  document.getElementById("historyList");

const angleBtn =
  document.getElementById("angleBtn");

const inverseBtn =
  document.getElementById("inverseBtn");


// --------------------------------
// Display
// --------------------------------

function updateDisplay() {

  expressionDisplay.textContent =
    expression || "0";
}


// --------------------------------
// Add text
// --------------------------------

function scientific(value) {

  if (value === "EXP") {

    expression += "e";

  } else {

    expression += value;

  }

  updateDisplay();
}


// --------------------------------
// Backspace
// --------------------------------

function backspace() {

  expression =
    expression.slice(0, -1);

  updateDisplay();
}


// --------------------------------
// Clear
// --------------------------------

function clearCalculator() {

  expression = "";

  resultDisplay.textContent = "0";

  updateDisplay();
}


// --------------------------------
// DEG / RAD
// --------------------------------

function toggleAngle() {

  degreeMode = !degreeMode;

  angleBtn.textContent =
    degreeMode ? "DEG" : "RAD";
}


// --------------------------------
// INV mode
// --------------------------------

function toggleInverse() {

  inverseMode = !inverseMode;

  inverseBtn.textContent =
    inverseMode ? "INV ON" : "INV";
}


// --------------------------------
// Convert expression
// --------------------------------

function prepareExpression(exp) {

  // Multiplication symbols
  exp = exp.replaceAll("×", "*");

  exp = exp.replaceAll("÷", "/");

  // Constants
  exp = exp.replaceAll("π", "pi");

  // ANS
  exp = exp.replaceAll(
    "ans",
    `(${lastAnswer})`
  );

  // Percentage
  exp = exp.replace(
    /(\d+(?:\.\d+)?)%/g,
    "($1/100)"
  );

  return exp;
}


// --------------------------------
// Degree mode configuration
// --------------------------------

function createMathScope() {

  const scope = {};

  scope.pi = Math.PI;

  scope.e = Math.E;

  scope.ans = lastAnswer;


  // Normal trig
  scope.sin = function(x) {

    return degreeMode
      ? Math.sin(x * Math.PI / 180)
      : Math.sin(x);
  };


  scope.cos = function(x) {

    return degreeMode
      ? Math.cos(x * Math.PI / 180)
      : Math.cos(x);
  };


  scope.tan = function(x) {

    return degreeMode
      ? Math.tan(x * Math.PI / 180)
      : Math.tan(x);
  };


  // Inverse trig
  scope.asin = function(x) {

    const result = Math.asin(x);

    return degreeMode
      ? result * 180 / Math.PI
      : result;
  };


  scope.acos = function(x) {

    const result = Math.acos(x);

    return degreeMode
      ? result * 180 / Math.PI
      : result;
  };


  scope.atan = function(x) {

    const result = Math.atan(x);

    return degreeMode
      ? result * 180 / Math.PI
      : result;
  };


  return scope;
}


// --------------------------------
// Calculate
// --------------------------------

function calculate() {

  if (!expression) return;


  try {

    let exp =
      prepareExpression(expression);


    // Inverse mode
    if (inverseMode) {

      exp = exp
        .replaceAll("sin(", "asin(")
        .replaceAll("cos(", "acos(")
        .replaceAll("tan(", "atan(");

    }


    const scope =
      createMathScope();


    const result =
      math.evaluate(exp, scope);


    if (
      result === undefined ||
      result === null
    ) {

      throw new Error("Invalid");

    }


    let finalResult;


    // Complex number support
    if (
      typeof result === "object" &&
      result !== null &&
      "re" in result
    ) {

      finalResult =
        math.format(
          result,
          {
            precision: 14
          }
        );

    } else {

      finalResult =
        math.format(
          result,
          {
            precision: 14
          }
        );

    }


    resultDisplay.textContent =
      finalResult;


    lastAnswer = result;


    addHistory(
      expression,
      finalResult
    );

  }

  catch (error) {

    resultDisplay.textContent =
      "Error";

  }
}


// --------------------------------
// History
// --------------------------------

function addHistory(
  exp,
  result
) {

  const item =
    document.createElement("div");


  item.className =
    "history-item";


  item.textContent =
    `${exp} = ${result}`;


  historyList.prepend(item);


  // Keep last 30 calculations
  while (
    historyList.children.length > 30
  ) {

    historyList.removeChild(
      historyList.lastChild
    );

  }
}


// --------------------------------
// Clear history
// --------------------------------

function clearHistory() {

  historyList.innerHTML = "";

}


// --------------------------------
// Keyboard
// --------------------------------

document.addEventListener(
  "keydown",
  function(event) {

    const key = event.key;


    if (
      /^[0-9.]$/.test(key)
    ) {

      scientific(key);

      return;
    }


    if (key === "+") {

      scientific("+");

      return;
    }


    if (key === "-") {

      scientific("-");

      return;
    }


    if (key === "*") {

      scientific("×");

      return;
    }


    if (key === "/") {

      scientific("÷");

      return;
    }


    if (key === "(") {

      scientific("(");

      return;
    }


    if (key === ")") {

      scientific(")");

      return;
    }


    if (key === "Enter") {

      calculate();

      return;
    }


    if (key === "Backspace") {

      backspace();

      return;
    }


    if (key === "Escape") {

      clearCalculator();

      return;
    }

  }
);
