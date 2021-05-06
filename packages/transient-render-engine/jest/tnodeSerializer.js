module.exports = {
  serialize(val) {
    return val.snapshot(true);
  },
  test(val) {
    return !!val.type;
  }
};
