import { MethodId } from '@/data/methods';
import { MethodGenerator } from './types';
import { make10Generator } from './make10';
import { compensationGenerator } from './compensation';
import { breakApartGenerator } from './breakApart';
import { leftToRightGenerator } from './leftToRight';
import { nearRoundGenerator } from './nearRound';
import { doubleHalfGenerator } from './doubleHalf';
import { distributiveGenerator } from './distributive';
import { specialMultGenerator } from './specialMult';
import { estimationGenerator } from './estimation';
import { divisionFactorsGenerator } from './divisionFactors';

export const generatorRegistry: Record<MethodId, MethodGenerator> = {
  make10: make10Generator,
  compensation: compensationGenerator,
  'break-apart': breakApartGenerator,
  'left-to-right': leftToRightGenerator,
  'near-round': nearRoundGenerator,
  'double-half': doubleHalfGenerator,
  distributive: distributiveGenerator,
  'special-mult': specialMultGenerator,
  estimation: estimationGenerator,
  'division-factors': divisionFactorsGenerator,
};

export function getGenerator(methodId: string): MethodGenerator {
  const gen = generatorRegistry[methodId as MethodId];
  if (!gen) {
    throw new Error(`No generator registered for method: "${methodId}"`);
  }
  return gen;
}
