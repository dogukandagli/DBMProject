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

export const HandoverMethodLabels: Record<HandoverMethodType, string> = {
  [HandoverMethodEnum.ComeAndGetIt]: "Gel Al",
  [HandoverMethodEnum.IWillBringIt]: "Ben Getiririm",
  [HandoverMethodEnum.MeetUp]: "Buluşalım",
};

export const OfferStatusLabels: Record<OfferStatusType, string> = {
  [OfferStatusEnum.Pending]: "Beklemede",
  [OfferStatusEnum.Accepted]: "Kabul Edildi",
  [OfferStatusEnum.Rejected]: "Reddedildi",
  [OfferStatusEnum.Cancelled]: "İptal Edildi",
};

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

export const offerStatusOptions = enumToOptions(
  OfferStatusEnum,
  OfferStatusLabels
);

export const borrowRequestStatusOptions = enumToOptions(
  BorrowRequestStatusEnum,
  BorrowRequestStatusLabels
);
