import { getStylesForProperty } from 'css-to-react-native';

export default function expandCSSToRN(propertyName: string, value: string) {
  try {
    return getStylesForProperty(propertyName, value);
  } catch (e) {
    // Ignore this rule if parsing failed
  }
  return null;
}
