// On page load
window.onload = function() {
  resetApp();
};

// Input Elements

var quantityInput = "quantityInput";
var strengthInput = "strengthInput";
var volumeInput = "volumeInput";
var priceInput = "priceInput";

// IDs
var howMuch = "how-much"
var beerSelectionGroup = "beer-selection";
var spiritsSelectionGroup = "spirits-selection";
var alcoholPercentageGroup = "alcohol-percentage";
var volumeGroup = "volume";
var priceGroup = "price";

var appSection = "app";
var aboutSection = "about";

var appBtn = "appBtn";
var aboutBtn = "aboutBtn";
var resetBtn = "resetBtn";
var calculateBtn = "calculateBtn";

/*
  Beer: Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate
  Spirits: Total volume (litres) of product × alcohol strength × current excise duty rate

  Rates below are from 5 February 2024
*/

var beerFormula = "Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate";
var spiritsFormula = "Total volume (litres) of product × alcohol strength × current excise duty rate";

var exciseDutyRateBeer11 = 51.63; //1.1 on the table
var exciseDutyRateBeer12 = 10.32; //1.2 on the table
var exciseDutyRateBeer15 = 60.12; //etc
var exciseDutyRateBeer16 = 32.33;
var exciseDutyRateBeer110 = 60.12;
var exciseDutyRateBeer111 = 42.37;
var exciseDutyRateBeer115 = 3.63;
var exciseDutyRateBeer116 = 4.18;

var exciseDutyRateBrandy31 = 95.12;
var exciseDutyRateSpirits32 = 101.85;

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
    document.getElementById(inputId).classList.add("is-invalid");
  } else if (formValueValid(inputValue)) {
    document.getElementById(inputId).classList.remove("is-invalid");
    document.getElementById(elementToEnable).disabled = false;
  } else {
    document.getElementById(inputId).classList.add("is-invalid");
  }
}

function performFormValidationAndDisplayNextInput(inputId, nextInputId) {
  var inputValue = document.getElementById(inputId).value;
  if (formValueValid(inputValue)) {
    document.getElementById(inputId).classList.remove("is-invalid");
    document.getElementById(nextInputId).style.display = 'block';
  } else {
    document.getElementById(inputId).classList.add("is-invalid");
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
    document.getElementById(quantityInput).classList.add("is-invalid");
  } 
  if (strength === "undefined" || strength.length == 0 ||!formValueValid(strength)) {
    readyToCalculate = false;
    document.getElementById(strengthInput).classList.add("is-invalid");
  } 
  if (volume === "undefined" || volume.length == 0 ||!formValueValid(volume)) {
    readyToCalculate = false;
    document.getElementById(volumeInput).classList.add("is-invalid");
  } 
  if (price === "undefined" || price.length == 0 ||!formValueValid(price)) {
    readyToCalculate = false;
    document.getElementById(priceInput).classList.add("is-invalid");
  }

  return readyToCalculate;
}


// 1. What did ya buy?

function onWhatDidYaBuyChange(alcohol) {
  resetOnWhatGroupChange();
  if (alcohol == "beer") {
    document.getElementById(beerSelectionGroup).style.display = 'block';
    document.getElementById(spiritsSelectionGroup).style.display = 'none';
  } else {
    document.getElementById(beerSelectionGroup).style.display = 'none';
    document.getElementById(spiritsSelectionGroup).style.display = 'block';
  }
  document.getElementById(howMuch).style.display = 'block';
}

// 2. How much ya snag?

function onQuantityChange() {
  if (!document.getElementById(quantityInput).value == "" && (document.querySelector('input[name=howMuchYaSnagGroup]:checked') != null)) {
    performFormValidationAndDisplayNextInput(quantityInput, alcoholPercentageGroup);
  }
}

function onHowMuchRadioChange() {
  resetOnHowMuchGroupChange();
}

// 3. How strong's the bastard?

function onStrengthChange() {
  if (!document.getElementById(strengthInput).value == "") {
    performFormValidationAndDisplayNextInput(strengthInput, volumeGroup);
  }
}

// 4. Volume in a single container?

function onVolumeChange() {
  if (!document.getElementById(volumeInput).value == "") {
    performFormValidationAndDisplayNextInput(volumeInput, priceGroup);
  }
}

// 5. How much did it sting ya for?

function onPriceChange() {
  if (!document.getElementById(priceInput).value == "") {
    performFormValidationAndEnableElement(priceInput, calculateBtn);
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
  
    document.getElementById("results-group").style.display = 'block';
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
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer11);
  }

  //1.2 - From 2 Aug 2021 - $ per litre of alcohol - $9.01
  if (strength <= 3 && volumePerUnit > 48000) {
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer12);
  }

  //1.5 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if ((strength > 3 && strength <= 3.5) && volumePerUnit < 8000) {
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer15);
  }

  //1.6 - From 2 Aug 2021 - $ per litre of alcohol - $28.23
  if ((strength > 3 && strength <= 3.5) && volumePerUnit > 48000) {
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer16);
  }

  //1.10 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if (strength > 3.5 && volumePerUnit < 8000) {
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer110);
  }

  //1.11 - From 2 Aug 2021 - $ per litre of alcohol - $36.98
  if (strength > 3.5 && volumePerUnit > 48000) {
    tax = calculateBeerPrice(totalLitres, strength, exciseDutyRateBeer111);
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

  //3.1 - From 1 Aug 2023 - $ per litre of alcohol - $83.04
  if (type == "brandy") {
    tax = calculateSpiritsPrice(totalLitres, strength, exciseDutyRateBrandy31);
  } else {

    //2 - From 1 Aug 2023 - $ per litre of alcohol - $88.91
    if (strength <= 10) {
      tax = calculateSpiritsPrice(totalLitres, strength, exciseDutyRateSpirits32);
    }

    //3.2 - From 1 Aug 2023 - $ per litre of alcohol - $88.91
    if (strength > 10) {
      tax = calculateSpiritsPrice(totalLitres, strength, exciseDutyRateSpirits32);
    }
  }

  printResults(tax, purchasePrice);
}

function calculateBeerPrice(litres, strength, exciseDutyRate) {
  var formulaPrint = "Formula: " + beerFormula;
  console.log(formulaPrint);
  document.getElementById("formulaPrint").innerHTML = formulaPrint;

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
    lalsRoundedToFloor = lalsNotRounded;
  }


  var finalLal = Number(lalsRoundedToFloor).toFixed(2);
  var finalLalPrint = "Final LAL (truncated to one decimal place): " + finalLal;
  console.log(finalLalPrint);
  document.getElementById("finalLalPrint").innerHTML = finalLalPrint;

  var dutyPayablePrint = "Duty payable: $" + exciseDutyRate + " × " + finalLal + " LALs = $" + (exciseDutyRate * finalLal).toFixed(2);
  console.log(dutyPayablePrint);
  document.getElementById("dutyPayablePrint").innerHTML = dutyPayablePrint;

  //Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate

  var totalTax = lalsRoundedToFloor * exciseDutyRate;
  console.log("Total tax: " + totalTax);

  return totalTax;
}

function calculateSpiritsPrice(litres, strength, exciseDutyRate) {
  var formulaPrint = "Formula: " + spiritsFormula;
  console.log(formulaPrint);
  document.getElementById("formulaPrint").innerHTML = formulaPrint;

  var litresStrengthExciseDutyRatePrint = "Litres: " + litres.toFixed(2) + ", strength: " + strength + "%, excise duty rate: $" + exciseDutyRate;
  console.log(litresStrengthExciseDutyRatePrint);
  document.getElementById("litresStrengthExciseDutyRatePrint").innerHTML = litresStrengthExciseDutyRatePrint;

  var lalsNotRounded = (litres * (strength / 100)).toFixed(2);
  var lalsNotRoundedPrint = "LALs not rounded: " + lalsNotRounded;
  console.log(lalsNotRoundedPrint);
  document.getElementById("lalsNotRoundedPrint").innerHTML = lalsNotRoundedPrint;

  var lalsRoundedToFloor;
  if (lalsNotRounded > 1) {
    lalsRoundedToFloor = Math.floor(lalsNotRounded * 10) / 10;
  } else {
    lalsRoundedToFloor = lalsNotRounded;
  }

  var finalLal = Number(lalsRoundedToFloor).toFixed(2);
  var finalLalPrint = "Final LAL (truncated to one decimal place): " + finalLal;
  console.log(finalLalPrint);
  document.getElementById("finalLalPrint").innerHTML = finalLalPrint;

  var dutyPayablePrint = "Duty payable: $" + exciseDutyRate + " × " + finalLal + " LALs = $" + (exciseDutyRate * finalLal).toFixed(2);
  console.log(dutyPayablePrint);
  document.getElementById("dutyPayablePrint").innerHTML = dutyPayablePrint;

  //Total volume (litres) of product × alcohol strength × current excise duty rate

  var totalTax = lalsRoundedToFloor * exciseDutyRate;
  console.log("Total tax: " + totalTax);

  return totalTax;
}

function printResults(tax, purchasePrice) {
  var resultPrint = "Total tax is $" + tax.toFixed(2) + ", which is " + ((tax / purchasePrice) * 100).toFixed(1)  + "% of the $" + purchasePrice + " purchase price.";
  console.log(resultPrint);
  document.getElementById("resultPrint").innerHTML = resultPrint;
  document.getElementById("results-group").style.display = 'inline-block';
}

// Display
function displayAbout() {
  document.getElementById(appSection).style.display = 'none';
  document.getElementById(aboutSection).style.display = 'block';

  document.getElementById(aboutBtn).style.display = 'none';
  document.getElementById(appBtn).style.display = 'inline-block';
  document.getElementById(resetBtn).style.display = 'none';
}

function displayApp() {
  document.getElementById(appSection).style.display = 'block';
  document.getElementById(aboutSection).style.display = 'none';

  document.getElementById(aboutBtn).style.display = 'inline-block';
  document.getElementById(appBtn).style.display = 'none';
  document.getElementById(resetBtn).style.display = 'inline-block';
}

// Reset
function resetApp() {
  hideAboutGroup();
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

function hideAboutGroup() {
  document.getElementById(aboutSection).style.display = 'none';
  document.getElementById(appBtn).style.display = 'none';
  document.getElementById(appSection).style.display = 'block';
  document.getElementById(aboutBtn).style.display = 'inline-block';
}

function hideAppGroup() {
  document.getElementById(aboutSection).style.display = 'block';
  document.getElementById(appBtn).style.display = 'inline-block';
  document.getElementById(appSection).style.display = 'none';
  document.getElementById(aboutBtn).style.display = 'none';
}

function resetWhatGroup() {
  document.getElementById("beerType").checked = false;
  document.getElementById("spiritsType").checked = false;
}

function resetHowMuchGroup() {
  document.getElementById(howMuch).style.display = 'none';
  document.getElementById(beerSelectionGroup).style.display = 'none';
  document.getElementById(spiritsSelectionGroup).style.display = 'none';
  document.getElementById("case").checked = false;
  document.getElementById("sixPack").checked = false;
  document.getElementById("bottleTin").checked = false;
  document.getElementById("brandy").checked = false;
  document.getElementById("spirits").checked = false;
  document.getElementById(quantityInput).value = '';
  document.getElementById(volumeGroup).style.display = 'none';
}

function resetStrengthGroup() {
  document.getElementById(alcoholPercentageGroup).style.display = 'none';
  document.getElementById(strengthInput).value = '';
}

function resetVolumeGroup() {
  document.getElementById(volumeGroup).style.display = 'none';
  document.getElementById(volumeInput).value = '';
}

function resetPriceGroup() {
  document.getElementById(priceGroup).style.display = 'none';
  document.getElementById(priceInput).value = '';
}

function resetResultsGroup() {
  document.getElementById("results-group").style.display = 'none';
}