export function updateWaterLevel() {
  let rectHeight = Math.round((1 - (summary/goal))*250);
  rect.height = rectHeight < 0 ? 0 : rectHeight;
}

export function convertToUnit(value, units) {
  if (units === "ml") {
    return value
  } else {
    // convert to fl oz
    return Math.round(value*0.033814);
  }
}