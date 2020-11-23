# @native-html/css-processor

[![npm](https://img.shields.io/npm/v/@native-html/css-processor)](https://www.npmjs.com/package/@native-html/css-processor)
[![CI](https://github.com/native-html/core/workflows/css-processor/badge.svg?branch=master)](https://github.com/native-html/core/actions?query=branch%3Amaster+workflow%3Acss-processor)
[![codecov](https://codecov.io/gh/native-html/core/branch/master/graph/badge.svg?flag=css-processor)](https://codecov.io/gh/native-html/core?flag=css-processor)

## Known Incompatibilities (Inline CSS Style → RN Styles)

| Property         | Comments                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `border-*radius` | Percent and forward-slash radius is not supported in React Native. Inline rules with percent or forward-slash radius will be discarded. |
