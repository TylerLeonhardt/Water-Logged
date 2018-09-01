export default class utils {
  static convertToUnit(value, units) {
    if (units === 'ml') {
      return value;
    }
    // convert to fl oz
    return Math.round(value * 0.033814);
  }
}
