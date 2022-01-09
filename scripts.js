var exciseDutyRateBeer11 = 45.07;
var exciseDutyRateBeer12 = 9.01;
var exciseDutyRateBeer15 = 52.49;
var exciseDutyRateBeer16 = 28.23;
var exciseDutyRateBeer110 = 52.49;
var exciseDutyRateBeer111 = 36.98;
var exciseDutyRateBeer115 = 3.17;
var exciseDutyRateBeer116 = 3.65;
// var exciseDutyRateBeerExample = 50.70;

function onWhatDidYaBuyChange(alcohol) {
  alcohol = alcohol;
  if (alcohol == "beer") {
    document.getElementById("beer-selection").style.display = 'block';
    document.getElementById("spirits-other-selection").style.display = 'none';
  } else {
    document.getElementById("beer-selection").style.display = 'none';
    document.getElementById("spirits-other-selection").style.display = 'block';
  }
  document.getElementById("howMuch").style.display = 'block';
}

function onQuantityChange(quantity) {
  document.getElementById("alcoholPercentage").style.display = 'block';
}

function onAlcoholStrengthChange(strength) {
  document.getElementById("volume").style.display = 'block';
}

function onVolumeChange(volume) {
  document.getElementById("price").style.display = 'block';
}

function calculate() {
  console.log("Alcohol: " + document.querySelector('input[name=whatDidYaBuyGroup]:checked').value);
  console.log("Type: " + document.querySelector('input[name=howMuchYaSnagGroup]:checked').value);
  console.log("Quantity: " + document.getElementById("quantityInput").value);
  console.log("Strength: " + document.getElementById("strengthInput").value);
  console.log("Volume: " + document.getElementById("volumeInput").value);
  console.log("Price: " + document.getElementById("priceInput").value);

  var alcohol = document.querySelector('input[name=whatDidYaBuyGroup]:checked').value;
  var type = document.querySelector('input[name=howMuchYaSnagGroup]:checked').value;
  var quantity = document.getElementById("quantityInput").value;
  var strength = document.getElementById("strengthInput").value;
  var volume = document.getElementById("volumeInput").value;
  var price = document.getElementById("priceInput").value;

  if (alcohol == "beer") {
    beerCalculator(type, quantity, strength, volume, price);
  }

  document.getElementById("result").style.display = 'block';
}

function beerCalculator(type, quantityString, strengthString, volumeString, priceString) {
  var quantity = Number(quantityString);
  var strength = Number(strengthString); // %
  var volumePerUnit = Number(volumeString); //in millilitres
  var price = Number(priceString);
  var total;

  if (type == "case") {
    totalLitres = quantity * 24 * (volumePerUnit / 1000);
  } else if (type == "sixPack") {
    totalLitres = quantity * 6 * (volumePerUnit / 1000);
  } else if (type == "bottleTin") {
    totalLitres = quantity * (volumePerUnit / 1000);
  }

  /*
    Total volume (litres) of product × (alcohol strength – 1.15%) × current excise duty rate
  */

  //1.1 - From 2 Aug 2021 - $ per litre of alcohol - $45.07
  if (strength <= 3 && volumePerUnit < 8000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer11);
  }

  //1.2 - From 2 Aug 2021 - $ per litre of alcohol - $9.01
  if (strength <= 3 && volumePerUnit > 48000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer12);
  }

  //1.5 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if ((strength > 3 && strength <= 3.5) && volumePerUnit < 8000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer15);
  }

  //1.6 - From 2 Aug 2021 - $ per litre of alcohol - $28.23
  if ((strength > 3 && strength <= 3.5) && volumePerUnit > 48000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer16);
  }

  //1.10 - From 2 Aug 2021 - $ per litre of alcohol - $52.49
  if (strength > 3.5 && volumePerUnit < 8000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer110);
  }

  //1.11 - From 2 Aug 2021 - $ per litre of alcohol - $36.98
  if (strength > 3.5 && volumePerUnit > 48000) {
    total = calculatePrice(totalLitres, strength, exciseDutyRateBeer111);
  }

  var resultText = "Total tax is $" + total + " of purchase price $" + price;
  console.log(resultText);
  document.getElementById("result").style.display = 'block';
  document.getElementById("result-text").value = resultText;
}

function calculatePrice(litres, strength, exciseDutyRate) {
  console.log("Litres: " + litres + ", strength: " + strength + ", excise duty rate: $" + exciseDutyRate);
  var overallStrength = (strength - 1.15) / 100;
  console.log("Overall strength (strength - 1.15%): " + overallStrength);
  var lalsNotRounded = litres * overallStrength;
  console.log("LALs not rounded: " + lalsNotRounded);
  var lalsRoundedToFloor;
  if (lalsNotRounded > 1) {
    lalsRoundedToFloor = Math.floor(lalsNotRounded * 10) / 10;
  } else {
    lalsRoundedToFloor = lalsNotRounded; //TODO - must round somehow
  }
  console.log("Final LAL: " + lalsRoundedToFloor);
  return lalsRoundedToFloor * exciseDutyRate;
}
