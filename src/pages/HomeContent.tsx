import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/comment.svg";
import shareIcon from "../assets/share.svg";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  likeCount: number;
  commentCount: number;
}
interface Review {
  id: number;
  reviewTitle: string;
  movieTitle: string;
  content: string;
  authorNickname: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}
const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) { return interval + " years ago"; }
  if (interval === 1) { return "1 year ago"; }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) { return interval + " months ago"; }
  if (interval === 1) { return "1 month ago"; }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) { return interval + " days ago"; }
  if (interval === 1) { return "1 day ago"; }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) { return interval + " hours ago"; }
  if (interval === 1) { return "1 hour ago"; }
  interval = Math.floor(seconds / 60);
  if (interval > 1) { return interval + " minutes ago"; }
  if (interval === 1) { return "1 minute ago"; }
  return "just now";
};
interface ActionButtonsProps {
  itemId: number;
  itemType: "movie" | "review";
  likeCount: number;
  commentCount: number;
}
const ActionButtons = ({ itemId, itemType, likeCount, commentCount }: ActionButtonsProps) => {
  const handleLikeClick = () => console.log(`Liked ${itemType} #${itemId}`);
  const handleCommentClick = () => console.log(`Commented on ${itemType} #${itemId}`);
  const handleShareClick = () => console.log(`Shared ${itemType} #${itemId}`);
  return (
    <div className="grid grid-cols-3 items-center w-full text-sm text-gray-600">
      <button onClick={handleLikeClick} className="flex items-center gap-1 justify-start transition-opacity hover:opacity-70" aria-label="Like this item">
        <img src={heartIcon} alt="Likes" className="w-5 h-5" />
        <span>{likeCount}</span>
      </button>
      <button onClick={handleCommentClick} className="flex items-center gap-1 justify-center transition-opacity hover:opacity-70" aria-label="Comment on this item">
        <img src={commentIcon} alt="Comments" className="w-5 h-5" />
        <span>{commentCount}</span>
      </button>
      <button onClick={handleShareClick} className="flex justify-end transition-opacity hover:opacity-70" aria-label="Share this item">
        <img src={shareIcon} alt="Share" className="w-6 h-6" />
      </button>
    </div>
  );
};


export default function HomeContent() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies([
        { id: 1, title: "얼굴", posterUrl: "https://i.namu.wiki/i/KMUqfF9AtnJv69CFHKYjteoM3soZ4R3LMeIg1NdH5t-WtdqkfkEAGlU8iLstbrLG16oBcOR5Bdyg8yi3E55EDQ.webp", likeCount: 1352, commentCount: 214 },
        { id: 2, title: "극장판 귀멸의 칼날: 무한성 편", posterUrl: "https://i.namu.wiki/i/gwqbq98J0nv5hKDlCnnlu7KJ_zFDzvN9Cj8y5ss64uohGgY_3A5HzFKnxlCNWbxRfIepjW1aAr5q7Zf-QA5lYg.webp", likeCount: 1120, commentCount: 188 },
        { id: 3, title: "살인자 리포트", posterUrl: "https://i.namu.wiki/i/jTX-_f2sko_ixODrk94ndy0No4kKvC2jZQMoe1CPHpFQED2YdEGcbseKVmKExzGwO9OfEooygPXTn6aq_lTenA.webp", likeCount: 980, commentCount: 152 },
        { id: 4, title: "F1 더 무비", posterUrl: "https://upload.wikimedia.org/wikipedia/ko/thumb/9/93/F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/250px-F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg", likeCount: 850, commentCount: 121 },
        { id: 5, title: "홈캠", posterUrl: "https://i.namu.wiki/i/C4fiPlpmUh5pg8eZ6zyUmutFXMniQt2AZC9xfx5BiASuyokH4ybkowY_tZIqWehBfhENGe6XwY9vp1YQ_Nu2UA.webp", likeCount: 760, commentCount: 99 },
      ]);
      setReviews([
        { id: 1, reviewTitle: "웃음 끝에 찾아오는 소름, 봉준호식 블랙코미디의 정수", movieTitle: "기생충", content: "초반의 유쾌함이 후반의 서늘한 현실과 만나며 강렬한 인상을 남깁니다. 계급 사회의 모순을 날카롭게 파고드는 연출이 돋보이는 작품입니다.", authorNickname: "MovieCritique", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), likeCount: 251, commentCount: 42 },
        { id: 2, reviewTitle: "스크린을 압도하는 스펙터클, 경이로운 시청각적 경험", movieTitle: "듄: 파트2", content: "영상과 사운드만으로도 볼 가치가 충분합니다. 전편보다 확장된 세계관과 깊어진 서사가 인상적이었어요. 아이맥스 관람을 추천합니다.", authorNickname: "SciFi_Fan", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), likeCount: 198, commentCount: 25 },
        { id: 3, reviewTitle: "스트레스 해소에 제격인 타격감과 유머", movieTitle: "범죄도시4", content: "마동석의 시원한 액션은 여전하네요. 스토리는 예측 가능하지만, 특유의 유머와 타격감만으로도 즐겁게 볼 수 있는 팝콘 무비입니다.", authorNickname: "ActionManiac", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), likeCount: 172, commentCount: 18 },
        { id: 4, reviewTitle: "분노와 슬픔이 교차하는 묵직한 역사 드라마", movieTitle: "서울의 봄", content: "영화를 보는 내내 가슴이 답답했습니다. 배우들의 소름 돋는 연기 덕분에 몰입감이 엄청났고, 그날의 역사를 다시 생각하게 되었습니다.", authorNickname: "HistoryLover", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), likeCount: 302, commentCount: 88 },
      ]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8">
          이번 주 인기 <span className="text-[#9858f3]">#영화</span>
        </h2>
        <div className="flex gap-[30px] overflow-x-auto pb-4">
          {movies
            ? movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-white flex-shrink-0
                             transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="w-full h-[358px] overflow-hidden">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                  <div className="w-full h-[92px] p-4 flex flex-col justify-between">
                    <h3 className="font-bold text-lg truncate text-center">{movie.title}</h3>
                    <ActionButtons
                      itemId={movie.id}
                      itemType="movie"
                      likeCount={movie.likeCount}
                      commentCount={movie.commentCount}
                    />
                  </div>
                </div>
              ))
            : Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="w-[250px] h-[450px] flex-shrink-0">
                  <Skeleton height={358} className="rounded-t-lg" />
                  <div className="p-4 bg-white rounded-b-lg">
                    <Skeleton width="75%" height={20} className="mx-auto" />
                    <div className="grid grid-cols-3 items-center mt-3">
                      <Skeleton width={40} height={20} /><Skeleton width={40} height={20} className="mx-auto" /><Skeleton circle width={24} height={24} className="ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold mb-8">
          이번 주 인기 <span className="text-[#9858f3]">#리뷰</span>
        </h2>
        <div className="flex gap-[30px] flex-wrap">
          {reviews
            ? reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="relative w-[320px] h-[250px] bg-white rounded-[10px] shadow-md
                             transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
                >
                  <h3 className="absolute w-[277px] left-[22px] top-[21.34px] font-bold text-lg leading-tight">
                    {review.reviewTitle}
                    <span className="font-medium text-[#9858f3] ml-2">#{review.movieTitle}</span>
                  </h3>
                  <p className="absolute w-[277px] h-[74.19px] left-[22px] top-[80.28px] text-gray-700 overflow-hidden">{review.content}</p>
                  <p className="absolute w-[200px] h-[17.28px] left-[22px] top-[172.76px] text-sm text-gray-500 truncate">
                    {`${formatTimeAgo(review.createdAt)} by ${review.authorNickname}`}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
                    <ActionButtons
                      itemId={review.id}
                      itemType="review"
                      likeCount={review.likeCount}
                      commentCount={review.commentCount}
                    />
                  </div>
                </div>
              ))
            : Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="relative w-[320px] h-[250px] bg-white rounded-[10px] shadow-md">
                   <div className="absolute left-[22px] top-[21.34px] w-[277px]"><Skeleton count={2} /></div>
                   <Skeleton className="absolute left-[22px] top-[80.28px]" width={277} count={3} />
                   <Skeleton className="absolute left-[22px] top-[172.76px]" width={180} height={16} />
                   <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
                     <div className="grid grid-cols-3 items-center w-full">
                       <Skeleton width={40} height={20} /><Skeleton width={40} height={20} className="mx-auto" /><Skeleton circle width={24} height={24} className="ml-auto" />
                     </div>
                   </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}