import markersPrototype from '../markersPrototype';

describe('markersPrototype', () => {
  describe('toString', () => {
    it('should provide a string representation of own and inherited properties', () => {
      const markers = markersPrototype.extend();
      markers.anchor = true;
      expect(markers.toString()).toMatchSnapshot();
    });
  });
});
