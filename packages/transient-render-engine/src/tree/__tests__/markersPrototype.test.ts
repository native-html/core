import markersProtype from '../markersProtype';

describe('markersPrototype', () => {
  describe('toString', () => {
    it('should provide a string representation of own and inherited properties', () => {
      const markers = markersProtype.extend();
      markers.anchor = true;
      expect(markers.toString()).toMatchSnapshot();
    });
  });
});
