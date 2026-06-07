export enum Tier {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
}

export enum Feature {
  ADVANCED_REPORTING = 'ADVANCED_REPORTING',
  BULK_ENROLLMENT = 'BULK_ENROLLMENT',
  APPROVALS_SYSTEM = 'APPROVALS_SYSTEM',
  ISSUES_HUB = 'ISSUES_HUB',
}

export const TierPolicy: Record<Feature, Tier[]> = {
  [Feature.ADVANCED_REPORTING]: [Tier.TIER_2],
  [Feature.BULK_ENROLLMENT]: [Tier.TIER_2],
  [Feature.APPROVALS_SYSTEM]: [Tier.TIER_2],
  [Feature.ISSUES_HUB]: [Tier.TIER_1, Tier.TIER_2],
};
