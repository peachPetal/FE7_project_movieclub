type FilterType =
  | "Movies"
  | "Reviews"
  | "Comments"
  | "Users"
  | "MyPosts"
  | "Likes";

interface FilterOption {
  value: string;
}
/*
Movies : 전체보기, 장르 ... 
Reviews : 최신순, 인기순
Comments : 최신순, 인기순
Users : 모든 유저, 친구
프로필 -> 내 게시물(MyPosts) : 리뷰, 댓글
         좋아요(Likes) : 영화, 리뷰
*/
