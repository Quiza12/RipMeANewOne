// Input Elements

var quantityInput = "quantityInput";
var strengthInput = "strengthInput";
var volumeInput = "volumeInput";
var priceInput = "priceInput";

/*
  Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate
*/

var exciseDutyRateBeer11 = 45.07;
var exciseDutyRateBeer12 = 9.01;
var exciseDutyRateBeer15 = 52.49;
var exciseDutyRateBeer16 = 28.23;
var exciseDutyRateBeer110 = 52.49;
var exciseDutyRateBeer111 = 36.98;
var exciseDutyRateBeer115 = 3.17;
var exciseDutyRateBeer116 = 3.65;

var exciseDutyRateBrandy = 83.04;
var exciseDutyRateSpirits= 88.91;

var incorrectOrEmptyValueBorderHighlight = "1px solid red";
var correctValueBorderHighlight = "1px solid black";

// Form Validations

function formValueValid(value) {
  if (!isNaN(value)) {
    return true;
  } 
}

function performFormValidationAndEnableElement(inputId, elementToEnable) {
  var inputValue = document.getElementById(inputId).value;
  if (inputValue === "undefined") {
    document.getElementById(inputId).style.border = incorrectOrEmptyValueBorderHighlight;
  } else if (formValueValid(inputValue)) {
    document.getElementById(inputId).style.border = correctValueBorderHighlight;
    document.getElementById(elementToEnable).disabled = false;
  } else {
    document.getElementById(inputId).style.border = incorrectOrEmptyValueBorderHighlight;
  }
}

function performFormValidationAndDisplayNextInput(inputId, nextInputId) {
  var inputValue = document.getElementById(inputId).value;
  if (formValueValid(inputValue)) {
    document.getElementById(inputId).style.border = correctValueBorderHighlight;
    document.getElementById(nextInputId).style.display = 'block';
  } else {
    document.getElementById(inputId).style.border = incorrectOrEmptyValueBorderHighlight;
  }
}

function finalValidationOnCalculation() {
  var quantity = document.getElementById(quantityInput).value;
  var strength = document.getElementById(strengthInput).value;
  var volume = document.getElementById(volumeInput).value;
  var price = document.getElementById(priceInput).value;

  var readyToCalculate = true;

  if (quantity === "undefined" || quantity.length == 0 || !formValueValid(quantity)) {
    readyToCalculate = false;
    document.getElementById(quantityInput).style.border = incorrectOrEmptyValueBorderHighlight;
  } 
  if (strength === "undefined" || strength.length == 0 ||!formValueValid(strength)) {
    readyToCalculate = false;
    document.getElementById(strengthInput).style.border = incorrectOrEmptyValueBorderHighlight;
  } 
  if (volume === "undefined" || volume.length == 0 ||!formValueValid(volume)) {
    readyToCalculate = false;
    document.getElementById(volumeInput).style.border = incorrectOrEmptyValueBorderHighlight;
  } 
  if (price === "undefined" || price.length == 0 ||!formValueValid(price)) {
    readyToCalculate = false;
    document.getElementById(priceInput).style.border = incorrectOrEmptyValueBorderHighlight;
  }

  return readyToCalculate;
}


// 1. What did ya buy?

function onWhatDidYaBuyChange(alcohol) {
  resetOnWhatGroupChange();
  if (alcohol == "beer") {
    document.getElementById("beer-selection").style.display = 'block';
    document.getElementById("spirits-selection").style.display = 'none';
  } else {
    document.getElementById("beer-selection").style.display = 'none';
    document.getElementById("spirits-selection").style.display = 'block';
  }
  document.getElementById("howMuch").style.display = 'block';
}

// 2. How much ya snag?

function onQuantityChange() {
  if (!document.getElementById(quantityInput).value == "") {
    performFormValidationAndDisplayNextInput(quantityInput, "alcoholPercentage");
  }
}

function onHowMuchRadioChange() {
  resetOnHowMuchGroupChange();
}

// 3. How strong's the bastard?

function onStrengthChange() {
  if (!document.getElementById(strengthInput).value == "") {
    performFormValidationAndDisplayNextInput(strengthInput, "volume");
  }
}

// 4. Volume in a single container?

function onVolumeChange() {
  if (!document.getElementById(volumeInput).value == "") {
    performFormValidationAndDisplayNextInput(volumeInput, "price");
    document.getElementById("calculateBtn").disabled = true;
  }
}

// 5. How much did it sting ya for?

function onPriceChange() {
  if (!document.getElementById(priceInput).value == "") {
    performFormValidationAndEnableElement(priceInput, "calculateBtn");
  }
}

// Calculation

function logCaluclationToConsole() {
  console.log("Alcohol: " + document.querySelector('input[name=whatDidYaBuyGroup]:checked').value);
  console.log("Type: " + document.querySelector('input[name=howMuchYaSnagGroup]:checked').value);
  console.log("Quantity: " + document.getElementById(quantityInput).value);
  console.log("Strength: " + document.getElementById(strengthInput).value);
  console.log("Volume: " + document.getElementById(volumeInput).value);
  console.log("Price: " + document.getElementById(priceInput).value);
}

function calculate() {
  if (finalValidationOnCalculation()) {
    logCaluclationToConsole();

    var alcohol = document.querySelector('input[name=whatDidYaBuyGroup]:checked').value;
    var type = document.querySelector('input[name=howMuchYaSnagGroup]:checked').value;
    var quantity = document.getElementById(quantityInput).value;
    var strength = document.getElementById(strengthInput).value;
    var volume = document.getElementById(volumeInput).value;
    var price = document.getElementById(priceInput).value;
  
    if (alcohol == "beer") {
      beerCalculator(type, quantity, strength, volume, price);
    } else if (alcohol == "spirits") {
      spiritsCalculator(type, quantity, strength, volume, price);
    }
  
    document.getElementById("results").style.display = 'block';
  }
  
}

function beerCalculator(type, quantityString, strengthString, volumeString, priceString) {
  var quantity = Number(quantityString);
  var strength = Number(strengthString); // %
  var volumePerUnit = Number(volumeString); //in millilitres
  var price = Number(priceString);
  var tax;

  var totalLitres;

  if (type == "case") {
    totalLitres = quantity * 24 * (volumePerUnit / 1000);
  } else if (type == "sixPack") {
    totalLitres = quantity * 6 * (volumePerUnit / 1000);
  } else if (type == "bottleTin") {
    totalLitres = quantity * (volumePerUnit / 1000);
  }

  //1.1 - From 2 Aug 2021 - $ per litre of alcohol - $45.07
  if (strength <= 3 && volumePerUnit < 8000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer11);
  }

  //1.2 - From 2 Aug 2021 - $ per litre of alcohol - $9.01
  if (strength <= 3 && volumePerUnit > 48000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer12);
  }

  //1.5 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if ((strength > 3 && strength <= 3.5) && volumePerUnit < 8000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer15);
  }

  //1.6 - From 2 Aug 2021 - $ per litre of alcohol - $28.23
  if ((strength > 3 && strength <= 3.5) && volumePerUnit > 48000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer16);
  }

  //1.10 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if (strength > 3.5 && volumePerUnit < 8000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer110);
  }

  //1.11 - From 2 Aug 2021 - $ per litre of alcohol - $36.98
  if (strength > 3.5 && volumePerUnit > 48000) {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBeer111);
  }

  printResults(tax, price);
}

function spiritsCalculator(type, quantityString, strengthString, volumeString, priceString) {
  var quantity = Number(quantityString);
  var strength = Number(strengthString); // %
  var volumePerUnit = Number(volumeString); //in millilitres
  var purchasePrice = Number(priceString);
  var tax;

  var totalLitres = quantity * (volumePerUnit / 1000);

  //3.1 - From 2 Aug 2021 - $ per litre of alcohol - $83.04
  if (type == "brandy") {
    tax = calculatePrice(totalLitres, strength, exciseDutyRateBrandy);
  } else {

    //2 - From 2 Aug 2021 - $ per litre of alcohol - $88.91
    if (strength <= 10) {
      tax = calculatePrice(totalLitres, strength, exciseDutyRateSpirits);
    }

    //3.2 - From 2 Aug 2021 - $ per litre of alcohol - $88.91
    if (strength > 10) {
      tax = calculatePrice(totalLitres, strength, exciseDutyRateSpirits);
    }
  }

  printResults(tax, purchasePrice);
}

function calculatePrice(litres, strength, exciseDutyRate) {
  var litresStrengthExciseDutyRatePrint = "Litres: " + litres.toFixed(2) + ", strength: " + strength + "%, excise duty rate: $" + exciseDutyRate;
  console.log(litresStrengthExciseDutyRatePrint);
  document.getElementById("litresStrengthExciseDutyRatePrint").innerHTML = litresStrengthExciseDutyRatePrint;

  var overallStrength = (strength - 1.15);
  var overallStrengthPrint = "Overall strength (" + strength + "% - 1.15%): " + overallStrength.toFixed(2) + "%";
  console.log(overallStrengthPrint);
  document.getElementById("overallStrengthPrint").innerHTML = overallStrengthPrint;

  var overallStrengthPercent = overallStrength / 100;
  console.log("Overall strength percent: " + overallStrengthPrint + "%");

  var lalsNotRounded = (litres * overallStrengthPercent).toFixed(2);
  var lalsNotRoundedPrint = "LALs not rounded: " + lalsNotRounded;
  console.log(lalsNotRoundedPrint);
  document.getElementById("lalsNotRoundedPrint").innerHTML = lalsNotRoundedPrint;

  var lalsRoundedToFloor;
  if (lalsNotRounded > 1) {
    lalsRoundedToFloor = Math.floor(lalsNotRounded * 10) / 10;
  } else {
    lalsRoundedToFloor = lalsNotRounded; //TODO - must round somehow
  }

  var finalLalPrint = "Final LAL: " + Number(lalsRoundedToFloor).toFixed(2);
  console.log(finalLalPrint);
  document.getElementById("finalLalPrint").innerHTML = finalLalPrint;

  //Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate

  var totalTax = lalsRoundedToFloor * exciseDutyRate;
  console.log("Total tax: " + totalTax);

  return totalTax;
}

function printResults(tax, purchasePrice) {
  var resultPrint = "Total tax is $" + tax.toFixed(2) + ", which is " + ((tax / purchasePrice) * 100).toFixed(1)  + "% of purchase price $" + purchasePrice + ".";
  console.log(resultPrint);
  document.getElementById("resultPrint").innerHTML = resultPrint;
  document.getElementById("results").style.display = 'inline-block';
}

// Reset
function resetAll() {
  resetWhatGroup();
  resetHowMuchGroup();
  resetStrengthGroup();
  resetVolumeGroup();
  resetPriceGroup();
  resetResultsGroup();
}

function resetOnWhatGroupChange() {
  resetHowMuchGroup();
  resetStrengthGroup();
  resetVolumeGroup();
  resetPriceGroup();
  resetResultsGroup();
}

function resetOnHowMuchGroupChange() {
  document.getElementById(quantityInput).value = '';
  resetStrengthGroup();
  resetVolumeGroup();
  resetPriceGroup();
  resetResultsGroup();
}

function resetWhatGroup() {
  document.getElementById("beerType").checked = false;
  document.getElementById("spiritsType").checked = false;
}

function resetHowMuchGroup() {
  document.getElementById("howMuch").style.display = 'none';
  document.getElementById("beer-selection").style.display = 'none';
  document.getElementById("spirits-selection").style.display = 'none';
  document.getElementById("case").checked = false;
  document.getElementById("sixPack").checked = false;
  document.getElementById("bottleTin").checked = false;
  document.getElementById("brandy").checked = false;
  document.getElementById("spirits").checked = false;
  document.getElementById("volume").style.display = 'none';
  document.getElementById(quantityInput).value = '';
  document.getElementById(quantityInput).style.border = correctValueBorderHighlight;
}

function resetStrengthGroup() {
  document.getElementById("alcoholPercentage").style.display = 'none';
  document.getElementById(strengthInput).value = '';
  document.getElementById(strengthInput).style.border = correctValueBorderHighlight;
}

function resetVolumeGroup() {
  document.getElementById("volume").style.display = 'none';
  document.getElementById(volumeInput).value = '';
  document.getElementById(volumeInput).style.border = correctValueBorderHighlight;
}

function resetPriceGroup() {
  document.getElementById("price").style.display = 'none';
  document.getElementById(priceInput).value = '';
  document.getElementById(priceInput).style.border = correctValueBorderHighlight;
}

function resetResultsGroup() {
  document.getElementById("results").style.display = 'none';
}