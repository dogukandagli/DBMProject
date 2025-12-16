export const ConditionEnum = {
  New: 1,
  LikeNew: 2,
  Good: 3,
  Fair: 4,
  Poor: 5,
} as const;
export type ConditionType = (typeof ConditionEnum)[keyof typeof ConditionEnum];
export const HandoverMethodEnum = {
  ComeAndGetIt: 1,
  IWillBringIt: 2,
  MeetUp: 3,
} as const;
export type HandoverMethodType =
  (typeof HandoverMethodEnum)[keyof typeof HandoverMethodEnum];

export const OfferStatusEnum = {
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
  Cancelled: 4,
} as const;

// Tip Türetme: (1 | 2 | 3 | 4)
export type OfferStatusType =
  (typeof OfferStatusEnum)[keyof typeof OfferStatusEnum];

export const BorrowRequestStatusEnum = {
  Open: 1,
  Accepted: 2,
  Completed: 3,
  Cancelled: 4,
  Expired: 5,
} as const;

// Tip Türetme: (1 | 2 | 3 | 4 | 5)
export type BorrowRequestStatusType =
  (typeof BorrowRequestStatusEnum)[keyof typeof BorrowRequestStatusEnum];

export const ConditionLabels: Record<ConditionType, string> = {
  [ConditionEnum.New]: "Yeni",
  [ConditionEnum.LikeNew]: "Yeni Gibi",
  [ConditionEnum.Good]: "İyi",
  [ConditionEnum.Fair]: "Orta",
  [ConditionEnum.Poor]: "Kötü",
};

export const HandoverMethodLabels = {
  [HandoverMethodEnum.ComeAndGetIt]: "Gel Al",
  [HandoverMethodEnum.IWillBringIt]: "Ben Getiririm",
  [HandoverMethodEnum.MeetUp]: "Buluşalım",
} satisfies Record<HandoverMethodType, string>;

export const OfferStatusLabels: Record<
  OfferStatusType,
  { label: string; sx: any }
> = {
  [OfferStatusEnum.Pending]: {
    label: "Beklemede",
    sx: {
      backgroundColor: null,
      color: null,
      fontWeight: 600,
    },
  },
  [OfferStatusEnum.Accepted]: {
    label: "Kabul Edildi",
    sx: {
      backgroundColor: "rgba(0, 200, 83, 0.15)",
      color: "#2e7d32",
      fontWeight: 600,
    },
  },
  [OfferStatusEnum.Rejected]: {
    label: "Reddedildi",
    sx: {
      backgroundColor: "rgba(211, 47, 47, 0.15)",
      color: "#c62828",
      fontWeight: 600,
    },
  },
  [OfferStatusEnum.Cancelled]: {
    label: "İptal Edildi",
    sx: {
      backgroundColor: "rgba(158, 158, 158, 0.2)",
      color: "#424242",
      fontWeight: 600,
    },
  },
};
export const isOfferStatusType = (status: number): status is OfferStatusType =>
  Object.values(OfferStatusEnum).includes(status as OfferStatusType);

export const isBorrowRequestStatusType = (
  status: number
): status is BorrowRequestStatusType =>
  Object.values(BorrowRequestStatusEnum).includes(
    status as BorrowRequestStatusType
  );

export const isHandoverMethodType = (
  status: number
): status is HandoverMethodType =>
  Object.values(HandoverMethodEnum).includes(status as HandoverMethodType);

export const BorrowRequestStatusLabels: Record<
  BorrowRequestStatusType,
  string
> = {
  [BorrowRequestStatusEnum.Open]: "Açık",
  [BorrowRequestStatusEnum.Accepted]: "Kabul Edildi",
  [BorrowRequestStatusEnum.Completed]: "Tamamlandı",
  [BorrowRequestStatusEnum.Cancelled]: "İptal Edildi",
  [BorrowRequestStatusEnum.Expired]: "Süresi Doldu",
};

export const enumToOptions = <
  T extends Record<string, number>,
  V extends T[keyof T]
>(
  enumObj: T,
  labels: Record<V, string>
) =>
  Object.values(enumObj).map((value) => ({
    value: value as V,
    label: labels[value as V],
  }));

export const conditionOptions = enumToOptions(ConditionEnum, ConditionLabels);

export const handoverOptions = enumToOptions(
  HandoverMethodEnum,
  HandoverMethodLabels
);

export const borrowRequestStatusOptions = enumToOptions(
  BorrowRequestStatusEnum,
  BorrowRequestStatusLabels
);
