export interface IReview {
    UserID: string;
    Rating: number;
    ReviewDesc: string;
    ReviewType: IReviewType;
}

export interface IReviewType {
    ReviewType: string;
}