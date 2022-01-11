## [11.2.3](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.2.2...@native-html/transient-render-engine@11.2.3) (2022-01-11)

## [11.2.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.2.1...@native-html/transient-render-engine@11.2.2) (2021-11-25)


### Bug Fixes

* **tre:** add bold style for "b" tag ([5b1e1cc](https://github.com/native-html/core/commit/5b1e1cc64ae17c720683d36f4d703525f306eec8))

## [11.2.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.2.0...@native-html/transient-render-engine@11.2.1) (2021-10-21)

# [11.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.1.2...@native-html/transient-render-engine@11.2.0) (2021-10-20)


### Features

* **tre:** enhanced typings and documentation ([e467185](https://github.com/native-html/core/commit/e46718561c7d6d41db37ebd7d08059e3298c47fc))

## [11.1.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.1.1...@native-html/transient-render-engine@11.1.2) (2021-10-20)


### Bug Fixes

* **tre:** accurate `nodeIndex` field description matching current impl ([b10dce3](https://github.com/native-html/core/commit/b10dce3d9090eaab37da6cd4e70e1c642cc87490))
* **tre:** do not set `accessibilityLabel` for images with presentation role ([91f0937](https://github.com/native-html/core/commit/91f0937b4ee29e002144eab45db0334f0356c606))
* **tre:** typo in documentation ([2db3ef8](https://github.com/native-html/core/commit/2db3ef8bbe7671917f151e07203a966c64b92e60))

## [11.1.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.1.0...@native-html/transient-render-engine@11.1.1) (2021-10-19)


### Bug Fixes

* **tre:** map HTML `role` attribute instead of notional `aria-role` ([50031a4](https://github.com/native-html/core/commit/50031a484b9f3dd4c83122892b0cce1110a0d81c))
* **tre:** prefer `aria-label` over `alt` in `img` element model ([54e05a1](https://github.com/native-html/core/commit/54e05a11958806d9bc30ce2860c099326e8924c0))

# [11.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@11.0.0...@native-html/transient-render-engine@11.1.0) (2021-10-16)


### Features

* **tre:** allow `HTMLElementModel.extend` to take a merge function ([ab7019f](https://github.com/native-html/core/commit/ab7019f904a1ef6372bc4cfd95fff259fa74376e))

# [11.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.4.0...@native-html/transient-render-engine@11.0.0) (2021-10-15)


### Code Refactoring

* rename `getDynamicReactNativeProps` to `getReactNativeProps` for consistency ([3401890](https://github.com/native-html/core/commit/340189047b9f9d775b6ea73bf892ae79c6f85a6e))
* rename `getuadynamicmixedstyles` to `getmixeduastyles` for consistency ([a1ce296](https://github.com/native-html/core/commit/a1ce296092a216437ab75abae7a30e6c46f4b5db))


### Features

* add new typescript util, `ExtractTNodeFromType` ([9b1b008](https://github.com/native-html/core/commit/9b1b0081a8cca688e05ec3435a2169e6652839a6))


### BREAKING CHANGES

* rename `getDynamicReactNativeProps` to
`getReactNativeProps` for consistency
* rename `getuadynamicmixedstyles` to `getmixeduastyles`
for consistency

# [10.4.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.3.0...@native-html/transient-render-engine@10.4.0) (2021-10-14)


### Features

* **tre:** add `onPress` support in native props ([8185e0d](https://github.com/native-html/core/commit/8185e0d5bf3d22635ae620141bba65cf6987e151))

# [10.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.2.1...@native-html/transient-render-engine@10.3.0) (2021-10-13)


### Features

* **tre:** enhanced context for `getDynamicReactNativeProps` and `getUADynamicMixedStyles` ([b7dd796](https://github.com/native-html/core/commit/b7dd7968556599b9f0b0b3131a61defdaba7e3bb))

## [10.2.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.2.0...@native-html/transient-render-engine@10.2.1) (2021-09-11)


### Bug Fixes

* set accessibilityLabel for headings to bypass RN limitation ([52d5be7](https://github.com/native-html/core/commit/52d5be7f9e862a9a014a8205bab19fa5726b3a79))

# [10.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.1.0...@native-html/transient-render-engine@10.2.0) (2021-09-11)


### Features

* support aria-role="search" and aria-role="presentation" ([4372c4b](https://github.com/native-html/core/commit/4372c4b6aa48aeb8318d4921fa5e72658d04815b))

# [10.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.0.2...@native-html/transient-render-engine@10.1.0) (2021-09-05)


### Features

* enhance accessibility of `img` elements ([cb0410c](https://github.com/native-html/core/commit/cb0410ced64fcd82cbe1c083c7cfcad3d5371030))
* pass `aria-label` and `aria-role` to as native props ([39101de](https://github.com/native-html/core/commit/39101dea9feed42cb5e84ab6e1df98ac75bee3d3))
* provide sensible accessibility values for interactive elements and svg ([486e649](https://github.com/native-html/core/commit/486e6499b032dc8abc47ebea63916314e1f05791))
* **tre:** add support for `user-select` CSS property ([42da28f](https://github.com/native-html/core/commit/42da28f1ed865b5b1aac29d977efcec61a18a9bd))


### Performance Improvements

* memoize return values in `getNativeStyles` and `getWebStyles` ([32090fb](https://github.com/native-html/core/commit/32090fbb115fa955e3461a1c44f1c74db8445e84))

## [10.0.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.0.1...@native-html/transient-render-engine@10.0.2) (2021-09-04)


### Bug Fixes

* apply "blue" color to anchors when href is an empty string ([f727cd2](https://github.com/native-html/core/commit/f727cd27e69d2650a5ff2ecceacb03550384a0e6))

## [10.0.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@10.0.0...@native-html/transient-render-engine@10.0.1) (2021-09-04)


### Bug Fixes

* **tre:** provide accessibility props when `<a>` has a non-empty `href` attribute ([aa82791](https://github.com/native-html/core/commit/aa82791b04b2196a1b80037ba31c09f860867dd7))

# [10.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.3.0...@native-html/transient-render-engine@10.0.0) (2021-09-04)


### Code Refactoring

* rename `ReactNativePropsDefinitions.all` to `native` for consistency ([292e75e](https://github.com/native-html/core/commit/292e75e57e0818894637887b875dea9e2cb00984))


### BREAKING CHANGES

* rename `ReactNativePropsDefinitions.all` to `native`
for consistency with RNRH.

# [9.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.2.4...@native-html/transient-render-engine@9.3.0) (2021-09-04)


### Features

* add accessibility role to headings (h1...h6) ([6cfa7d5](https://github.com/native-html/core/commit/6cfa7d5fff88050f96f091539e011d38f74a7df8))
* new `HTMLElement.reactNativeProps` and `getDynamicReactNativeProps` ([a02d972](https://github.com/native-html/core/commit/a02d97296126b007e52755cc9063013090fbf151))
* **tre:** new `getUADynamicMixedStyles` to replace `getUADerivedStyleFromAttributes` ([4199b5a](https://github.com/native-html/core/commit/4199b5a0150b84a567e5968d6f72e32a7b9d7c4f))

## [9.2.4](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.2.3...@native-html/transient-render-engine@9.2.4) (2021-08-29)

## [9.2.3](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.2.2...@native-html/transient-render-engine@9.2.3) (2021-08-29)

## [9.2.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.2.1...@native-html/transient-render-engine@9.2.2) (2021-07-19)

## [9.2.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.2.0...@native-html/transient-render-engine@9.2.1) (2021-07-07)

# [9.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.1.0...@native-html/transient-render-engine@9.2.0) (2021-07-01)


### Features

* **tre:** reexport css-processor types ([59e81e9](https://github.com/native-html/core/commit/59e81e9a6032bf0faab5212b1a9d63781969f448))

# [9.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.0.3...@native-html/transient-render-engine@9.1.0) (2021-06-24)


### Features

* new TNode.hasClass method ([3cd1330](https://github.com/native-html/core/commit/3cd13304171e286c00a6038cbe0ed31decd5d453))

## [9.0.3](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.0.2...@native-html/transient-render-engine@9.0.3) (2021-05-29)

## [9.0.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.0.1...@native-html/transient-render-engine@9.0.2) (2021-05-28)

## [9.0.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@9.0.0...@native-html/transient-render-engine@9.0.1) (2021-05-26)

# [9.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.4.1...@native-html/transient-render-engine@9.0.0) (2021-05-26)


### Code Refactoring

* **tre:** avoid renaming reexports ([965094d](https://github.com/native-html/core/commit/965094da304813a8a26d7acca8cb42af159695de))


### Features

* **tre:** export TNodePrintOptions ([46b40a2](https://github.com/native-html/core/commit/46b40a23579c3d3949bc9124b3272b3625246ce8))


### BREAKING CHANGES

* **tre:** reexported classes from domhandler have been renamed to
their original name, so DOMNode is now Node.
* **tre:** isDOMText has been renamed to isText and isDOMNode to
isNode.

## [8.4.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.4.0...@native-html/transient-render-engine@8.4.1) (2021-05-18)


### Bug Fixes

* **tre:** don't append an extraneous line return in snapshot() ([091d5dd](https://github.com/native-html/core/commit/091d5dda3eaaa59fd027f198ca9d87ede7d90031))

# [8.4.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.3.0...@native-html/transient-render-engine@8.4.0) (2021-05-18)


### Features

* **tre:** export Native and Web styles types ([342e6f4](https://github.com/native-html/core/commit/342e6f4d8c25619a4eda89797c3929baa914202e))

# [8.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.2.0...@native-html/transient-render-engine@8.3.0) (2021-05-18)


### Features

* **tre:** expose webBlockRet styles to support "objectFit" mixed style ([4f3f6f2](https://github.com/native-html/core/commit/4f3f6f2408cb74ac0173c7d57444e2a3c85870b1))

# [8.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.1.2...@native-html/transient-render-engine@8.2.0) (2021-05-15)


### Features

* **tre:** add parent as second argument of `ignoreNode` ([53afd74](https://github.com/native-html/core/commit/53afd74a558199c45c979ad0b530e71c1c6cbfd1))

## [8.1.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.1.1...@native-html/transient-render-engine@8.1.2) (2021-05-15)


### Bug Fixes

* **tre:** don't append text nested in ignored tags ([f1f2e04](https://github.com/native-html/core/commit/f1f2e0424ca5662e67088e1d9610f7e5126ba01a))

## [8.1.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.1.0...@native-html/transient-render-engine@8.1.1) (2021-05-14)


### Bug Fixes

* **tre:** in DomHandler, don't increment ignore counter on ignored text nodes ([4ca069b](https://github.com/native-html/core/commit/4ca069b444347ef770da1834d0bea551f035f416))

# [8.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@8.0.0...@native-html/transient-render-engine@8.1.0) (2021-05-12)


### Features

* rehabilitate `styles` in TNode ([f6240f5](https://github.com/native-html/core/commit/f6240f5ff2e2d32a4202633a381e9339942af18e))

# [8.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@7.3.0...@native-html/transient-render-engine@8.0.0) (2021-05-12)


### Features

* new getNativeStyles and getWebStyles utilities in TNodes ([d1e9603](https://github.com/native-html/core/commit/d1e96031b0a4ae9d2074e9b330cb8d3e2523a23a))


### BREAKING CHANGES

* the `styles` field is not exposed anymore. Use
`tnode.getNativeStyles` and `tnode.getWebStyles` instead.

# [7.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@7.2.0...@native-html/transient-render-engine@7.3.0) (2021-05-10)


### Features

* export HTMLElementsModels in TRenderEngine ([fe0f261](https://github.com/native-html/core/commit/fe0f261324ce28a0ba810f1c07e88779ada6b621))

# [7.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@7.1.0...@native-html/transient-render-engine@7.2.0) (2021-05-10)


### Features

* implement markers and `setMarkersForTNode` param ([7cf5e61](https://github.com/native-html/core/commit/7cf5e61e0b44bc33f67a5d4b5f4cd65d975b9c4f))

# [7.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@7.0.0...@native-html/transient-render-engine@7.1.0) (2021-05-08)


### Bug Fixes

* **tre:** 3 spaces indentation on TNode.snapshot print instead of 2 ([c14c3bc](https://github.com/native-html/core/commit/c14c3bc69037899b2b22988c0da0adb629642c85))


### Features

* **tre:** support `selectDomRoot` param ([fd58a45](https://github.com/native-html/core/commit/fd58a453c200f4f007bf3be89dcd3e38460cc877))

# [7.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.3.0...@native-html/transient-render-engine@7.0.0) (2021-05-08)


### Code Refactoring

* **tre:** drop alterDOMParams ([ed6a751](https://github.com/native-html/core/commit/ed6a7515e515cd18a1f11ec95db2d68e228b62b9))


### Features

* **tre:** new `ignoredDomTags`, `ignoreDomNode` and `domVisitors` opts. These options will add very little overhead as they don't require a tree traversal; they are used during parsing instead!


### BREAKING CHANGES

* **tre:** `alterDOMParams` has been drop. Instead, use either
`ignoreDomNode`, `ignoredDomTags` or `domVisitors`.

# [6.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.2.1...@native-html/transient-render-engine@6.3.0) (2021-05-07)


### Features

* **tre:** new tamperDOM optional argument to parseDocument ([7f49fee](https://github.com/native-html/core/commit/7f49fee60ee9ed6da6303dafb204d5e771892cf4))

## [6.2.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.2.0...@native-html/transient-render-engine@6.2.1) (2021-05-07)


### Bug Fixes

* **tre:** actually apply withNodeIndex parameter ([c7030fd](https://github.com/native-html/core/commit/c7030fd3d4e282fba90715613a7bec56d6808ce4))

# [6.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.1.1...@native-html/transient-render-engine@6.2.0) (2021-05-07)


### Features

* support metro bundler `react-native` package.json field ([ef33150](https://github.com/native-html/core/commit/ef331507c594390cca3490719956eac2ab9547f9))
* **tre:** allow customize snapshot with optional styles and nodeIndex prints ([78437cc](https://github.com/native-html/core/commit/78437cce4630d026f67688f5a27c5d16e8a9c4c4))

## [6.1.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.1.0...@native-html/transient-render-engine@6.1.1) (2021-05-07)


### Bug Fixes

* **tre:** add missing withStyles param in recursive calls serializeTnode ([da60350](https://github.com/native-html/core/commit/da60350b021caec7b96b528eae62614e0ee5d26e))

# [6.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@6.0.0...@native-html/transient-render-engine@6.1.0) (2021-05-06)


### Features

* **tre:** add printStyles param to TNode.snapshot ([b8d6f83](https://github.com/native-html/core/commit/b8d6f837eff727b0dfd5778a5894d7041f08b718))

# [6.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@5.1.1...@native-html/transient-render-engine@6.0.0) (2021-05-06)


### Bug Fixes

* collapse whitespaces after <br> and <wbr> tags ([cb84d62](https://github.com/native-html/core/commit/cb84d62cdc9aa24b4cdb337be49cc6d7baa3df2f))
* **tre:** preserve style inheritance in anonymous TPhrasing nodes ([734f105](https://github.com/native-html/core/commit/734f1058de38778613df2762d53a5bf88aa125c9))


### Code Refactoring

* **tre:** expose TNode.snapshot instead of TNode.toString ([f28c81b](https://github.com/native-html/core/commit/f28c81b508713d2ef98fd25080567d1ab9e42737))
* remove tnodeToString from exports ([4c7e31b](https://github.com/native-html/core/commit/4c7e31b27dba7bcd2a9871ed7f8ef83b2d9974bc))


### Features

* **tre:** add nodeIndex in serialized snapshot ([307b145](https://github.com/native-html/core/commit/307b14558d0518304bc1cf666674d9e99dc64488))
* **tre:** expose TNode.isUnregistered field ([b5b5efd](https://github.com/native-html/core/commit/b5b5efde9ce209a04c3ce55e4743d46358d6c7b1))
* **tre:** print "unregistered" and "src" attribute in TNode.toString ([7ff6d74](https://github.com/native-html/core/commit/7ff6d749f7b3dee39796a243372d89f7e462e835))


### BREAKING CHANGES

* **tre:** replace TNode.toString with TNode.snapshot
* tnodeToString is no longer exported. Use
TNode.snapshot() instead.

## [5.1.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@5.1.0...@native-html/transient-render-engine@5.1.1) (2021-05-06)


### Bug Fixes

* **tre:** expose "matchContentModel" method from TNode ([c67b70f](https://github.com/native-html/core/commit/c67b70f7785081281231ec888b1a7865286088ff))

# [5.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@5.0.0...@native-html/transient-render-engine@5.1.0) (2021-05-06)


### Bug Fixes

* **tre:** typings confusion between exported TNode types and impl ([9878327](https://github.com/native-html/core/commit/9878327aef03759261a79bfdc2a80697d81e933e))


### Features

* **tre:** expose parseDocument and buildTTreeFromDoc methods ([d2f4bb9](https://github.com/native-html/core/commit/d2f4bb9a8eed187cf385e8c6b59baedfc156dfff))

# [5.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.4.1...@native-html/transient-render-engine@5.0.0) (2021-05-05)


### Bug Fixes

* **tre:** optionalize dangerous options ([8ec75b0](https://github.com/native-html/core/commit/8ec75b03314f5a905577967d5aafa39be22f3329))


### Code Refactoring

* **tre:** hide TNode internals via interfaces ([304fd3a](https://github.com/native-html/core/commit/304fd3a838f106629b258040c19f17f0525888fc))


### Performance Improvements

* optimize whitespace collapsing ([77bf33d](https://github.com/native-html/core/commit/77bf33d98e64678a5073682f90d7f711708f20ea))
* **tre:** multiply translate speed by 30% with prototypal inheritance ([c5a596c](https://github.com/native-html/core/commit/c5a596c6b07159b9e97b60335d4ebeec575f10ff))
* **tre:** remove intermediary serialization step ([e559bcf](https://github.com/native-html/core/commit/e559bcfb90e3e738f20b9e495fa6c839115bc845))


### BREAKING CHANGES

* **tre:** TNode constructors are not exported anymore. Only the
types. Therefore, you must use tnode.type for type checking instead of
instanceof.
* **tre:** serialize-related exports have been removed. Also, the
type of TNode.domNode has changed to the one exported by htmlparser2

## [4.4.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.4.0...@native-html/transient-render-engine@4.4.1) (2021-02-16)


### Bug Fixes

* **TRE:** re-index children `nodeIndex` after whitespace collapsing ([3130a1b](https://github.com/native-html/core/commit/3130a1bfb2ae322fc459f325a6f005e116f9c987))

# [4.4.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.3.0...@native-html/transient-render-engine@4.4.0) (2021-02-14)


### Features

* **TRE:** supp. `dir` attribute in document context parsing ([4e16916](https://github.com/native-html/core/commit/4e16916213fc33894fa68bf129b312cd5ec136e3))

# [4.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.2.0...@native-html/transient-render-engine@4.3.0) (2021-02-13)


### Bug Fixes

* import of const enum not working ([c41ca5d](https://github.com/native-html/core/commit/c41ca5d79e058d4f96a6cc5237cd12f2a8bc7600))


### Features

* **transient-render-engine:** parent field in `TNode` ([da2d3de](https://github.com/native-html/core/commit/da2d3de9c2d7b9f9da19ed2ad5d608306c364e80))
* **transient-render-engine:** support nodeIndex ([3f7e33f](https://github.com/native-html/core/commit/3f7e33fa8153df15b63588a2f3a7029274280823))

# [4.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.1.0...@native-html/transient-render-engine@4.2.0) (2021-02-07)


### Bug Fixes

* **transient-render-engine:** provide csstype dependency for css-processor ([ca6104e](https://github.com/native-html/core/commit/ca6104ef311f2ad9d69d44b7993c85f66152a7df))


### Features

* **transient-render-engine:** support picture node as basic block ([a3a384b](https://github.com/native-html/core/commit/a3a384b29934fc16e8019ed2a1c1390059215ac9))


### Performance Improvements

* **transient-render-engine:** don't translate children of opaque nodes ([f68efae](https://github.com/native-html/core/commit/f68efae6c674595bf128390cefcf65c5c7d01583))

# [4.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@4.0.0...@native-html/transient-render-engine@4.1.0) (2021-02-01)


### Features

* **transient-render-engine:** provide default styles for tabular elements ([e26811b](https://github.com/native-html/core/commit/e26811bd95b007e1d1a7758c6c5ca8718b7a03e1))

# [4.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.9.1...@native-html/transient-render-engine@4.0.0) (2021-02-01)


### Code Refactoring

* **transient-render-engine:** distinguish between rendered and other embedded ([8d003c0](https://github.com/native-html/core/commit/8d003c0f3e0bcf9f124250656ade0b0374604fb0))


### BREAKING CHANGES

* **transient-render-engine:** the content model for embedded other than `img` and
`picture` is now "none".

## [3.9.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.9.0...@native-html/transient-render-engine@3.9.1) (2021-01-31)


### Bug Fixes

* **transient-render-engine:** missing domNode initial value ([ba9328c](https://github.com/native-html/core/commit/ba9328cf2b59d3c5616beb68423d629b56e250c8))

# [3.9.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.8.1...@native-html/transient-render-engine@3.9.0) (2021-01-31)


### Features

* **transient-render-engine:** export toSerializableNode ([73aa4d4](https://github.com/native-html/core/commit/73aa4d41cb33ff2849acc1709d25d135b22cd169))

## [3.8.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.8.0...@native-html/transient-render-engine@3.8.1) (2021-01-19)


### Bug Fixes

* **transient-render-engine:** ignoreDOMNode ignored when no other hooks ([d54e37b](https://github.com/native-html/core/commit/d54e37b6cb8f7c5a71affcdb70795b1ed79d5edb))

# [3.8.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.7.0...@native-html/transient-render-engine@3.8.0) (2021-01-19)


### Bug Fixes

* **transient-render-engine:** reset `alterDOMChildren` signature ([32f0699](https://github.com/native-html/core/commit/32f069989bcc555b6d451c786a5bf33a11682f21))


### Features

* support `ignoreDOMNode` hook in AlterDOMParams ([fa498af](https://github.com/native-html/core/commit/fa498af5d524399135c3a4dd3a5c977b1df10186))

# [3.7.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.6.2...@native-html/transient-render-engine@3.7.0) (2021-01-18)


### Features

* new alterDOMParams option ([53b00bc](https://github.com/native-html/core/commit/53b00bcb6d82c6102ee7834edade6a5a3416132d))

## [3.6.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.6.1...@native-html/transient-render-engine@3.6.2) (2021-01-14)


### Bug Fixes

* **transient-render-engine:** remove UA listStyleType style ([7738142](https://github.com/native-html/core/commit/773814276d8f6c279e5f5768b61977a332e86dc0))

## [3.6.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.6.0...@native-html/transient-render-engine@3.6.1) (2020-12-03)


### Bug Fixes

* **transient-render-engine:** use unicode escape sequences inside regex literal ([6fad215](https://github.com/native-html/core/commit/6fad2154a56c231225e9f9152b36660ce034c59c))

# [3.6.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.8...@native-html/transient-render-engine@3.6.0) (2020-11-30)


### Features

* **transient-render-engine:** new removeLineBreaksAroundEastAsianDiscardSet option ([3264d96](https://github.com/native-html/core/commit/3264d96fa30a2e19457782a0578a0906d5fab483))


### Performance Improvements

* **transient-render-engine:** precompiled regexes ([2cf3167](https://github.com/native-html/core/commit/2cf3167a8fe24b83f11c18b801174987a096a300))

## [3.5.8](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.7...@native-html/transient-render-engine@3.5.8) (2020-11-30)


### Bug Fixes

* **transient-render-engine:** don't assign a default fontSize ([9aba734](https://github.com/native-html/core/commit/9aba73429755f508aed9120c9528091fec2c09f9))

## [3.5.7](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.6...@native-html/transient-render-engine@3.5.7) (2020-11-30)


### Bug Fixes

* **transient-render-engine:** don't assign a default fontSize ([ceb5950](https://github.com/native-html/core/commit/ceb5950a497abf805bf5e3cc8528bccf9b5cf8cc))

## [3.5.6](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.5...@native-html/transient-render-engine@3.5.6) (2020-11-29)


### Bug Fixes

* **transient-render-engine:** collapse form-feed characters (\f) ([faff027](https://github.com/native-html/core/commit/faff0272057fec2fd7e90c1959cb045356097b37))

## [3.5.5](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.4...@native-html/transient-render-engine@3.5.5) (2020-11-29)


### Bug Fixes

* **transient-render-engine:** collapse the penultimate child (TPhrasing) ([543ddf8](https://github.com/native-html/core/commit/543ddf8eccebd28722e83cfb8ba3186113838269))

## [3.5.4](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.3...@native-html/transient-render-engine@3.5.4) (2020-11-27)


### Bug Fixes

* **transient-render-engine:** type for HTMLElementModel.extend (ts) ([aa3165d](https://github.com/native-html/core/commit/aa3165d27081efc8fb39b2c3f88027011ede588f))

## [3.5.3](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.1...@native-html/transient-render-engine@3.5.3) (2020-11-26)


### Bug Fixes

* **transient-render-engine:** remove isVoid from HTMLElementModel ([68510ab](https://github.com/native-html/core/commit/68510aba6589a34f531d6a9e0f1409ec123a72d5))

## [3.5.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.5.0...@native-html/transient-render-engine@3.5.1) (2020-11-25)

# [3.5.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.4.3...@native-html/transient-render-engine@3.5.0) (2020-11-25)


### Bug Fixes

* **transient-render-engine:** duplicate body when root element is body ([9db7c24](https://github.com/native-html/core/commit/9db7c2432774e129271b65e29d96e0ff72aaee53))
* **transient-render-engine:** only assert anonymous TText as empty ([3ee9507](https://github.com/native-html/core/commit/3ee95074e3fbdd9498c1e27e56135b2501241ac0))


### Features

* **transient-render-engine:** apply baseStyle own styles to html node ([f3b4b70](https://github.com/native-html/core/commit/f3b4b70ccdb66394148f21b6fa699e69845459ea))

## [3.4.3](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.4.2...@native-html/transient-render-engine@3.4.3) (2020-11-25)

## [3.4.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.4.1...@native-html/transient-render-engine@3.4.2) (2020-11-25)


### Bug Fixes

* **transient-render-tree:** render void TText nodes ([50046bc](https://github.com/native-html/core/commit/50046bc789c236eea5d7ca1d2770f7f5bcc77b38))

## [3.4.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.4.0...@native-html/transient-render-engine@3.4.1) (2020-11-25)

# [3.4.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.3.0...@native-html/transient-render-engine@3.4.0) (2020-11-24)


### Features

* **transient-render-engine:** content model type inference ([2f3db1a](https://github.com/native-html/core/commit/2f3db1af1e5de7ba5fdb282e3a3140eaa02c77c5))

# [3.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.2.0...@native-html/transient-render-engine@3.3.0) (2020-11-24)


### Features

* **transient-render-engine:** export defaultHTMLModelRecord ([71822ca](https://github.com/native-html/core/commit/71822ca93331a4e67d0ba1d3866a959c011457c9))

# [3.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.1.0...@native-html/transient-render-engine@3.2.0) (2020-11-24)


### Features

* **transient-render-engine:** new TNode.matchContentMode method ([cebf709](https://github.com/native-html/core/commit/cebf7094bc5ec7c322d06ffa6ede25b57d1c6246))

# [3.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@3.0.0...@native-html/transient-render-engine@3.1.0) (2020-11-24)


### Features

* **transient-render-engine:** add new option, customizeHTMLModels ([4fc7880](https://github.com/native-html/core/commit/4fc788031335e5696b57a373a4ae2a4d534df44c))
* **transient-render-engine:** allow registering of custom tag models ([32ea9ad](https://github.com/native-html/core/commit/32ea9ad88185e6b703878a8a83898cce03162c66))
* **transient-render-engine:** new HTMLContentModel enum ([7960d98](https://github.com/native-html/core/commit/7960d981894f53ea3ddb6f72c36ffce9796df7f6))

# [3.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-engine@2.0.2...@native-html/transient-render-engine@3.0.0) (2020-11-23)


### Features

* **transient-render-engine:** align specs with RFC002 v2.0.0 ([1b1ac68](https://github.com/native-html/core/commit/1b1ac68b2b057a17b0c1383987c3fe90d9027123))


### BREAKING CHANGES

* **transient-render-engine:** Hoisting doesn't pass anchor marker to children anymore.

## [2.0.2](https://github.com/native-html/core/compare/@native-html/transient-render-engine@2.0.1...@native-html/transient-render-engine@2.0.2) (2020-11-23)

## [2.0.1](https://github.com/native-html/core/compare/@native-html/transient-render-engine@2.0.0...@native-html/transient-render-engine@2.0.1) (2020-11-21)

# [2.0.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.5.0...@native-html/transient-render-engine@2.0.0) (2020-11-21)

### Features

* **transient-render-engine:** export TStyles class ([04d1345](https://github.com/native-html/core/commit/04d1345a631eb98a0120b314d036751ca849fa63))

### BREAKING CHANGES

* **transient-render-engine:** rename TTreeBuilder to TRenderEngine for clarity ([07b9852](https://github.com/native-html/core/commit/07b9852d3f8abd14e64b7c043856e4245e45e7f6))

# [1.5.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.4.1...@native-html/transient-render-tree@1.5.0) (2020-11-20)


### Bug Fixes

* **transient-render-engine:** design flaw with UA styles ([340ab7f](https://github.com/native-html/core/commit/340ab7f834a7cd74c92c0ce90555683b99e3f39f))


### Features

* **transient-render-engine:** proper handling of rootFontSize ([a680c61](https://github.com/native-html/core/commit/a680c6121e89a48e043346e6d5c4e2b54330cd29))

## [1.4.1](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.4.0...@native-html/transient-render-tree@1.4.1) (2020-11-19)


### Bug Fixes

* **transient-render-engine:** shrink UA spacing from 40 to 30px ([fbadede](https://github.com/native-html/core/commit/fbadede370bb4760560721939eba26168aeeec3e))

# [1.4.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.3.1...@native-html/transient-render-tree@1.4.0) (2020-11-19)


### Features

* **css-processor:** allow top, right, bottom and left CSS properties ([fed4e3e](https://github.com/native-html/core/commit/fed4e3e388a09f6cd9828474fc63c2f5d2e175b7))
* **transient-render-engine:** add TNode.displayName for string print ([7368816](https://github.com/native-html/core/commit/7368816fd3edb001f9d53530c2d46ce1e0dc8cfd))
* **transient-render-engine:** use baseStyle.fontSize for em & rem units ([300522c](https://github.com/native-html/core/commit/300522c282dbd30cc4f22eb3b35516433bc426e3))

## [1.3.1](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.3.0...@native-html/transient-render-tree@1.3.1) (2020-11-19)


### Bug Fixes

* **transient-render-engine:** align hr UA styles with legacy ([af1ba78](https://github.com/native-html/core/commit/af1ba7874c77348a1aab78cbea0b8db4396614d9))

# [1.3.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.2.0...@native-html/transient-render-tree@1.3.0) (2020-11-19)


### Features

* **transient-render-engine:** stringify data to avoid line returns (tnodeToString) ([0f5a9ec](https://github.com/native-html/core/commit/0f5a9ec3d85de331880386fc0f1572aac05fce08))

# [1.2.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.1.4...@native-html/transient-render-tree@1.2.0) (2020-11-19)


### Bug Fixes

* **transient-render-engine:** anchor child losing its children during hoisting ([d8c4a9f](https://github.com/native-html/core/commit/d8c4a9f17a512e30a0237663221b0ee18b3d9291))


### Features

* **transient-render-engine:** implement tnodeToString to print a tree ([00acc0c](https://github.com/native-html/core/commit/00acc0cf18f6a83ff6cef977e10c65e66ce8c379))

## [1.1.4](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.1.3...@native-html/transient-render-tree@1.1.4) (2020-11-18)


### Bug Fixes

* **transient-render-engine:** only push wrapper nodes when not-empty (hoist) ([c331cb8](https://github.com/native-html/core/commit/c331cb88afcfade43d54f143edf00034f9bc31fb))
* **transient-renderer-tree:** preserve styles in hoisted nodes ([992c693](https://github.com/native-html/core/commit/992c6930fe6a52da1c7fa4307bb87443e88774eb))

## [1.1.3](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.1.2...@native-html/transient-render-tree@1.1.3) (2020-11-18)


### Bug Fixes

* **transient-render-engine:** preserve the anchors color from legacy ([0ec10e6](https://github.com/native-html/core/commit/0ec10e669e67fe55bae07707dfacf4f2c5594545))

## [1.1.2](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.1.1...@native-html/transient-render-tree@1.1.2) (2020-11-18)


### Bug Fixes

* **transient-render-engine:** merge retained text styles (textDecoration*) ([4c16105](https://github.com/native-html/core/commit/4c161059c34d2d1926877a5c5280048418193fa1))

## [1.1.1](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.1.0...@native-html/transient-render-tree@1.1.1) (2020-11-17)


### Bug Fixes

* **transient-render-engine:** ol user agent styles overriden by ul styles ([548880c](https://github.com/native-html/core/commit/548880cd93fcee7dfba2d2cbc0fd89b363f75b4d))

# [1.1.0](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.0.4...@native-html/transient-render-tree@1.1.0) (2020-11-17)


### Features

* **transient-render-engine:** add default listStyleType in ul and ol models ([16d93ad](https://github.com/native-html/core/commit/16d93ad2b28dc504e8fcfdc4d630910aff695f75))

## [1.0.4](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.0.3...@native-html/transient-render-tree@1.0.4) (2020-11-17)

## [1.0.3](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.0.2...@native-html/transient-render-tree@1.0.3) (2020-11-17)

## [1.0.2](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.0.1...@native-html/transient-render-tree@1.0.2) (2020-11-16)

## [1.0.1](https://github.com/native-html/core/compare/@native-html/transient-render-tree@1.0.0...@native-html/transient-render-tree@1.0.1) (2020-11-16)


### Bug Fixes

* **transient-render-engine:** avoid using Object.create for styles ([676855a](https://github.com/native-html/core/commit/676855a19ea5f4154336d4dda2102fc18989bcbc))

# 1.0.0 (2020-11-16)


### Features

* **transient-render-engine:** add index.ts export ([7642b1e](https://github.com/native-html/core/commit/7642b1e38c7fa5895c9210927163a58671adac83))
* **transient-render-engine:** allow partial CSSProcessorConfig option ([7aab97e](https://github.com/native-html/core/commit/7aab97e6f96bb741b2b083420ba858785a7f20f3))
* **transient-render-engine:** implement user styles with specificity ([f942aad](https://github.com/native-html/core/commit/f942aad48f411d69615d592c8e29d63722f96b92))
* **transient-render-engine:** new baseStyles parameter for stylesConfig ([53d5574](https://github.com/native-html/core/commit/53d5574b568f43d4da6f2451662429ba2493277b))
* **transient-render-engine:** support for whiteSpace: "normal" and "pre" ([30a9aa2](https://github.com/native-html/core/commit/30a9aa2d6e17f5a01f7d29edaa50da946519c5b1))
* **transient-render-engine:** support TNode style inheritance ([20a08b3](https://github.com/native-html/core/commit/20a08b3fbac51d292979d67068f5969e54881196))
* **transient-render-engine:** user agent styles for tags in HTML models ([696a389](https://github.com/native-html/core/commit/696a38975976713d27795310f7eef295f7c03bd1))
* initial commit ([cb5489d](https://github.com/native-html/core/commit/cb5489de79b0265be09eb5545dae855e48038fcd))

