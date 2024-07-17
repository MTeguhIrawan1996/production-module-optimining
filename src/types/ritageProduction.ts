export interface IRitageConditional {
  Ore: {
    entity: string;
    locationLabel: string;
  };
  OB: {
    entity: string;
    locationLabel: string;
  };
  Quarry: {
    entity: string;
    locationLabel: string;
  };
}

export type RitageType = keyof IRitageConditional;
