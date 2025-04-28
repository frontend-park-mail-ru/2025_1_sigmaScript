type ReviewUserDataJSON = {
  login: string;
  avatar: string;
};

type CSATReviewDataJSON = {
  id: number;
  score: number;
  csatText: string;
  createdAt: string;
  user: ReviewUserDataJSON;
};

type AverageCSATStatisticData = {
  averageRating: number;
  reviewsCount: number;
};

export type CSATStatisticDataJSON = {
  statistic: AverageCSATStatisticData;
  reviews: CSATReviewDataJSON[];
};
