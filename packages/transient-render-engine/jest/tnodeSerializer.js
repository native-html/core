import tnodeToString from '../src/tnodeToString';

module.exports = {
  serialize(val) {
    return tnodeToString(val);
  },
  test(val) {
    return !!val.type;
  }
};
