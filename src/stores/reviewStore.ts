import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ReviewState {
  isLoading: boolean;
  reviewsData: Review[];
  setReviews: (data: Review) => void;
}

export const useReviewStore = create<ReviewState>()(
  devtools(
    immer((set) => ({
      isLoading: true,
      reviewsData: [
        {
          id: 1,
          title: "마음 울리는 여정",
          movie: "기생충",
          content:
            "사회적 메시지와 연출력이 뛰어난 영화였습니다. 캐릭터들의 감정선이 섬세하게 표현되어 몰입감이 최고였습니다.",
          createdAt: "2025-10-01T12:00:00Z",
          author: "kimjisu",
          like: 52,
          comment: 14,
          thumbnail:
            "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        },
        {
          id: 2,
          title: "눈을 뗄 수 없는 스릴",
          movie: "인셉션",
          content:
            "꿈과 현실을 넘나드는 스토리가 흥미진진합니다. 매 장면마다 긴장감이 살아 있어 집중하게 되네요.",
          createdAt: "2025-09-30T16:45:00Z",
          author: "parkminho",
          like: 47,
          comment: 10,
          thumbnail: "",
        },
        {
          id: 3,
          title: "감동적인 성장 이야기",
          movie: "라라랜드",
          content:
            "음악과 영상미가 완벽하게 어우러진 작품입니다. 주인공들의 꿈과 사랑 이야기에 감정이입이 되네요.",
          createdAt: "2025-09-28T09:30:00Z",
          author: "leejiwon",
          like: 38,
          comment: 7,
          thumbnail: "",
        },
        {
          id: 4,
          title: "웃음과 감동을 동시에",
          movie: "조커",
          content:
            "주인공의 심리 변화와 현실 사회에 대한 메시지가 강렬합니다. 어둡지만 인상 깊은 영화였습니다.",
          createdAt: "2025-10-02T20:15:00Z",
          author: "choihyun",
          like: 41,
          comment: 9,
          thumbnail:
            "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        },
        {
          id: 5,
          title: "화려한 액션과 재미",
          movie: "어벤져스: 엔드게임",
          content:
            "다양한 캐릭터들이 조화를 이루며 액션과 감동을 동시에 선사합니다. 마블 팬이라면 반드시 봐야 하는 영화!",
          createdAt: "2025-09-29T14:20:00Z",
          author: "kanghee",
          like: 60,
          comment: 15,
          thumbnail: "",
        },
      ],
      setReviews: (data: Review) =>
        set((state) => {
          state.reviewsData.push(data);
        }),
    }))
  )
);
