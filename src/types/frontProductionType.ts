export type ICommonType = {
  page: {
    value?: number;
    set: (v: number) => void;
  };
  period: {
    value?: string | null;
    set: (v: string | null) => void;
  };
  startDate: {
    value?: Date | null;
    set: (v: Date | null) => void;
  };
  endDate: {
    value?: Date | null;
    set: (v: Date | null) => void;
  };
  location: {
    value?: string | null;
    set: (v: string | null) => void;
  };
  shiftId: {
    value?: string | null;
    set: (v: string | null) => void;
  };
  filterBadgeValue: {
    value?: string[] | null;
    set: (v: string[] | null) => void;
  };
  year: {
    value?: number | null;
    set: (v: number | null) => void;
  };
  month: {
    value?: number | null;
    set: (v: number | null) => void;
  };
  week: {
    value?: number | null;
    set: (v: number | null) => void;
  };
  quarter: {
    value?: number | null;
    set: (v: number | null) => void;
  };
};

export interface ISegmentConditional {
  pit: {
    materialId: {
      value?: string | null;
      set: (v: string | null) => void;
    };
  } & ICommonType;
  dome: ICommonType;
}

export type SegmentType = keyof ISegmentConditional;
