import { makepropertiesValidators } from '../make-validators';
import {
  LngNtrBlkFloProperties,
  LngNtrBlkRetProperties,
  LngNtrTxtFloProperties,
  LngNtrTxtRetProperties,
  LngNunBlkRetProperties,
  LngWebTxtFloProperties,
  ShtProperties
} from '../property-types';

type AssertEqual<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : never
  : never;

type PropertiesValidator = ReturnType<typeof makepropertiesValidators>;

// These type tests assert that the exported validators map
// all required rules

export const testLngNunBlkRetKeys: AssertEqual<
  Pick<PropertiesValidator, LngNunBlkRetProperties>,
  Record<LngNunBlkRetProperties, any>
> = true;

export const testShtKeys: AssertEqual<
  Pick<PropertiesValidator, ShtProperties>,
  Record<ShtProperties, any>
> = true;

export const testLngNtrBlkRetKeys: AssertEqual<
  Pick<PropertiesValidator, LngNtrBlkRetProperties>,
  Record<LngNtrBlkRetProperties, any>
> = true;

export const testLngNtrBlkFloKeys: AssertEqual<
  Pick<PropertiesValidator, LngNtrBlkFloProperties>,
  Record<LngNtrBlkFloProperties, any>
> = true;

export const testLngWebTxtFloKeys: AssertEqual<
  Pick<PropertiesValidator, LngWebTxtFloProperties>,
  Record<LngWebTxtFloProperties, any>
> = true;

export const testLngNtrTxtRetKeys: AssertEqual<
  Pick<PropertiesValidator, LngNtrTxtRetProperties>,
  Record<LngNtrTxtRetProperties, any>
> = true;

export const testLngNtrTxtFloKeys: AssertEqual<
  Pick<PropertiesValidator, LngNtrTxtFloProperties>,
  Record<LngNtrTxtFloProperties, any>
> = true;
