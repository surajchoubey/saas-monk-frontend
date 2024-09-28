export default interface Review {
    _id: string;
    movieId: string
    reviewerName: string;
    rating: number;
    reviewComments: string;
}