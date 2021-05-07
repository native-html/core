module.exports = {
  serialize(val) {
    return val.snapshot({ withStyles: true, witNodeIndex: true });
  },
  test(val) {
    return !!val.type;
  }
};
