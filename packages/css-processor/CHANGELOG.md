## [1.5.2](https://github.com/native-html/core/compare/@native-html/css-processor@1.5.1...@native-html/css-processor@1.5.2) (2020-11-23)


### Bug Fixes

* **css-processor:** border-*radius and border-*width should not be set in % ([6e1e24c](https://github.com/native-html/core/commit/6e1e24c6e21cef33d214892c0dc68a6bdcf6304f))

## [1.5.1](https://github.com/native-html/core/compare/@native-html/css-processor@1.5.0...@native-html/css-processor@1.5.1) (2020-11-21)


### Bug Fixes

* **css-processor:** floating point numbers such as .67 ([ef8a9a4](https://github.com/native-html/core/commit/ef8a9a447554b0b99c0fa54b6dc2da743e916b64))

# [1.5.0](https://github.com/native-html/core/compare/@native-html/css-processor@1.4.0...@native-html/css-processor@1.5.0) (2020-11-21)


### Bug Fixes

* **css-processor:** change types of MixedStyleDeclaration fields ([40a4d41](https://github.com/native-html/core/commit/40a4d41028b1b5d7cd24c6f2ada7df70dc70a3c7))


### Features

* **css-processor:** handle % fontSize as per CSS standard ([17694db](https://github.com/native-html/core/commit/17694db210ac7bcad0b1f8453aa3d1ecc3350bb3))

# [1.4.0](https://github.com/native-html/core/compare/@native-html/css-processor@1.3.0...@native-html/css-processor@1.4.0) (2020-11-20)


### Bug Fixes

* **css-processor:** add string to fontSize type (CSSFlattenProcessedTypes) ([b54ab4e](https://github.com/native-html/core/commit/b54ab4e531187e7d9cd687b80d4db5db01849fdb))


### Features

* **css-processor:** support 'larger' and 'smaller' fontSize units ([f2542f5](https://github.com/native-html/core/commit/f2542f558d120f9bf1ce392b91e979f86f68adfb))


### Performance Improvements

* **css-processor:** ignore 'empty' fonts from list ([5ff35c2](https://github.com/native-html/core/commit/5ff35c2a06a46f3d02989fa8c37e591a67b0541b))

# [1.3.0](https://github.com/native-html/core/compare/@native-html/css-processor@1.2.0...@native-html/css-processor@1.3.0) (2020-11-19)


### Features

* **css-processor:** allow top, right, bottom and left CSS properties ([fed4e3e](https://github.com/native-html/core/commit/fed4e3e388a09f6cd9828474fc63c2f5d2e175b7))
* **css-processor:** support em (legacy mode) and rem units ([f363b95](https://github.com/native-html/core/commit/f363b9595585b681d4dfaca1c5c4cb6ecdede1ec))

# [1.2.0](https://github.com/native-html/core/compare/@native-html/css-processor@1.1.0...@native-html/css-processor@1.2.0) (2020-11-17)


### Features

* **css-processor:** export CSSListStyleTypePropertyBase ([4104fef](https://github.com/native-html/core/commit/4104fef2e788f42c973fa702701eb591546be91d))

# [1.1.0](https://github.com/native-html/core/compare/@native-html/css-processor@1.0.1...@native-html/css-processor@1.1.0) (2020-11-17)


### Features

* **css-processor:** support list-style-type CSS property ([65dc56a](https://github.com/native-html/core/commit/65dc56a7adb00eedc2e59e0ef3c98d24bd8d2320))

## [1.0.1](https://github.com/native-html/core/compare/@native-html/css-processor@1.0.0...@native-html/css-processor@1.0.1) (2020-11-16)


### Bug Fixes

* **css-processor:** replace Object.assign with spread operator ([0835dc1](https://github.com/native-html/core/commit/0835dc1e6d009a34200bdc46be87f4b82bad90c0))

# 1.0.0 (2020-11-16)


### Features

* **css-processor:** add CSSProcessedPropsRegistry#merge method ([9b88c03](https://github.com/native-html/core/commit/9b88c032a8cf7a0961ad685edda79cd266193c1d))
* **css-processor:** add ignoredProperties option to CSSProcessorConfig ([d5d2023](https://github.com/native-html/core/commit/d5d20230b5aa6ef351cc83a72ae28594587a0ac4))
* **css-processor:** add refined types to CSSProcessedPropsRegistry ([d8e1f29](https://github.com/native-html/core/commit/d8e1f293948a9d66551a912cab166d95039164b6))
* **css-processor:** added inlinePropertiesWhitelist config option ([ab3c4a0](https://github.com/native-html/core/commit/ab3c4a0461d7bb0187446a54c13ca6c70cb32f8e))
* **css-processor:** allow partial config for ctor of CSSProcessor ([ab17920](https://github.com/native-html/core/commit/ab17920979aad219498d6ade2b4aec2f088aed90))
* **css-processor:** implement compileStyleDeclaration ([bd69ab0](https://github.com/native-html/core/commit/bd69ab033dd4426a27c71aa1e09272212b3eafbe))
* **css-processor:** predictable support for native styles ([40ab209](https://github.com/native-html/core/commit/40ab209acde4a9b7ec5b038e467d00420d87d44f))
* **css-processor:** strict validation of "display" property ([3c192a3](https://github.com/native-html/core/commit/3c192a3542978bbee0c369904fdb9e4e2725c011))
* **transient-render-tree:** support TNode style inheritance ([20a08b3](https://github.com/native-html/core/commit/20a08b3fbac51d292979d67068f5969e54881196))
* initial commit ([cb5489d](https://github.com/native-html/core/commit/cb5489de79b0265be09eb5545dae855e48038fcd))

