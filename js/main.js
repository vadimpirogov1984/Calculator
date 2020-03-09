const CREDIT_MIN = 0;
const CREDIT_MAX = 15000000;

const INITIAL_MIN = 0;
const INITIAL_MAX = 10000000;

const time_MIN = 1;
const time_MAX = 30;

const priceText = document.getElementById("priceText");
const priceRange = document.getElementById("price");

const timeText = document.getElementById("timeText");
const timeRange = document.getElementById("ttr");

const initialText = document.getElementById("initialText");
const initialRange = document.getElementById("initial");

const percentText = document.getElementById("percentText");

const formatterNumber = new Intl.NumberFormat("ru");
const formatterCurrency = new Intl.NumberFormat("ru", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0
});

function formatterYear(year) {
  year = parseInt(year);
  let count = year % 10;
  let txt = "лет";

  if (year >= 5 && year <= 20) {
    txt = "лет";
  } else {
    if (count == 1) {
      txt = "год";
    } else {
      if (count >= 2 && count <= 4) {
        txt = "года";
      }
    }
  }

  return year + " " + txt;
}

setDubbleDepences(
  priceText,
  priceRange,
  formatterNumber,
  formatterCurrency,
  CREDIT_MIN,
  CREDIT_MAX
);
setDubbleDepences(
  initialText,
  initialRange,
  formatterNumber,
  formatterCurrency,
  INITIAL_MIN,
  INITIAL_MAX
);
setDubbleDepences(
  timeText,
  timeRange,
  formatterNumber,
  formatterCurrency,
  time_MIN,
  time_MAX
);
setReaction(
  priceText,
  priceRange,
  initialText,
  initialRange,
  timeText,
  timeRange,
  function() {
    const priceRen = parseInt(priceRange.value);
    const initialRan = parseInt(initialRange.value);
    const period = parseInt(timeRange.value) * 12;
    const rate = 10 / 100;
    summa = parseInt(priceRen - initialRan);

    document.querySelector("#percentText").value = rate * 100 + " %";

    let ann = 0;
    let monthRate = rate / 12;
    let topPart = +(summa * monthRate).toFixed(8);
    let bottomPart = +(1 - 1 / Math.pow(monthRate + 1, period)).toFixed(8);

    ann = +(topPart / bottomPart).toFixed(2);
    let totalSum = ann * period;
    let totalSub = totalSum - summa;

    document.querySelector("#payment").textContent = formatterNumber.format(
      ann
    );
    document.querySelector("#common").textContent = formatterNumber.format(
      totalSum
    );
    document.querySelector("#subpayment").textContent = formatterNumber.format(
      totalSub
    );
    console.log({ summa, initialRan, period });
  }
);

function setDubbleDepences(
  textElement,
  rangeElement,
  formatterNumber,
  formatterCurrency,
  min,
  max
) {
  const middle = (min + max) / 2;

  rangeElement.setAttribute("min", min);
  rangeElement.setAttribute("max", max);
  rangeElement.value = middle;
  textElement.value = formatterNumber.format(middle);

  textElement.addEventListener("focus", function() {
    let number = "";

    for (const letter of this.value) {
      if ("1234567890".includes(letter)) {
        number += letter;
      }
    }

    number = parseInt(number);

    this.value = formatterNumber.format(number);
  });

  textElement.addEventListener("input", function inputHandler(event) {
    let number = "";

    for (const letter of this.value) {
      if ("1234567890".includes(letter)) {
        number += letter;
      }
    }

    number = parseInt(number);

    if (number < min) {
      number = min;
    }

    if (number > max) {
      number = max;
    }

    rangeElement.value = number;

    number = formatterNumber.format(number);
    this.value = number;
  });

  textElement.addEventListener("blur", function(event) {
    let number = "";

    for (const letter of this.value) {
      if ("1234567890".includes(letter)) {
        number += letter;
      }
    }

    number = parseInt(number);

    this.value = formatterCurrency.format(number);
  });

  rangeElement.addEventListener("input", function(event) {
    textElement.value = formatterCurrency.format(parseInt(this.value));
  });
}

// Функция отслеживания измнений и замены элементов
function setReaction(...args) {
  const handler = args.splice(-1)[0];

  for (const element of args) {
    element.addEventListener("input", function(event) {
      handler.call(this, event, args.slice());
    });
  }
}
