import serializeTNode from './serializeTNode';

module.exports = {
  serialize(val) {
    return serializeTNode(val);
  },
  test(val) {
    return !!val.type;
  }
};
