module.exports = {
  serialize(val) {
    return val.snapshot({ withStyles: true, withNodeIndex: true });
  },
  test(val) {
    return !!val.type;
  }
};
