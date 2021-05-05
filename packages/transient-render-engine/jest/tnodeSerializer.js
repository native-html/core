import serializeTNode from '../src/tnodeToString';

module.exports = {
  serialize(val) {
    return serializeTNode(val);
  },
  test(val) {
    return !!val.type;
  }
};
