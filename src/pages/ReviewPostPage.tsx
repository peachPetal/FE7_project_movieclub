import { useState } from "react";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";
import { supabase } from "../utils/supabase";
import { useAuthStore } from "../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";

// !!!!!!!!!!!! 영화 검색 기능 변경 후 주석들 수정하기 !!!!!!!!!!!!!!!!!!

export default function ReviewPostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    id: movie_id,
    title: movie_title,
    backdrop: backdrop,
  } = location.state.state;
  const userId = useAuthStore((state) => state.user?.id);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  // const [selectMovie, setSelectMovie] = useState<MovieInReview | null>(null);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // comobobox 관련 state들
  // const [movies, setMovies] = useState<MovieInReview[]>([]);
  // const [query, setQuery] = useState("");
  // const [selected, setSelected] = useState<MovieInReview | null>(null);
  // const [isInputFocus, setIsInputFocus] = useState(true);

  // useEffect(() => {
  //   setIsLoading(true);

  //   const fetchData = async () => {
  //     try {
  //       const { data, error } = await supabase.from("movies").select("*");

  //       if (error) throw error;

  //       const moviesData: MovieInReview[] = [];

  //       data.map(({ movie_id, movie_name, backdrop_img }) =>
  //         moviesData.push({
  //           id: movie_id,
  //           title: movie_name,
  //           backdrop: backdrop_img,
  //         })
  //       );

  //       setMovies(moviesData);
  //     } catch (err) {
  //       console.error(
  //         `review post page, get movies from supabase error: ` + err
  //       );
  //     }
  //   };

  //   fetchData();

  //   setIsLoading(false);
  // }, []);

  // const filteredMovies =
  //   query === ""
  //     ? movies
  //     : movies.filter((movie) => {
  //         return movie.title.toLowerCase().includes(query.toLowerCase());
  //       });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbanil = () => {
    setThumbnail("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let finalThumbnail = thumbnail.trim();

    if (!finalThumbnail) {
      finalThumbnail =
        backdrop ||
        "https://mrwvwylqxypdithozmgm.supabase.co/storage/v1/object/public/img/movie_no_image.jpg";
    }

    // if (!title || !selectMovie || !content) {
    //   alert("값을 모두 입력해주세요.");
    //   return;
    // }

    try {
      // 영화 검색 기능 변경 후 수정
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          author_id: userId,
          title: title,
          content: content,
          thumbnail: finalThumbnail,
          movie_id: movie_id,
          movie_name: movie_title,
        })
        .select()
        .single();

      if (data) {
        alert("게시글이 등록되었습니다.");
        navigate("/reviews");
      }

      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return (
      <>
        {/* 나중에 스켈레톤 넣기 */}
        <p>로딩중...</p>
      </>
    );
  } else {
    return (
      <>
        <div className="review-post text-text-main">
          <h1 className="text-[40px] font-bold mb-7">리뷰 작성</h1>
          <form className="mr-40" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              id="review-title "
              className="text-[28px] pl-3 pb-3 w-full mb-5 outline-0 border-b-1 border-text-light placeholder:text-text-light focus:border-main"
              required
            />

            {/* 영화 검색 영역 */}
            {/* <Combobox<MovieInReview>
              value={selected!}
              onChange={(value) => {
                if (value !== null) {
                  setSelected(value);
                  setSelectMovie({
                    id: value.id,
                    title: value.title,
                    backdrop: value.backdrop,
                  });
                }
              }}
              onClose={() => setQuery("")}
            >
              <div
                className={clsx(
                  "w-[268px] h-[40px] border rounded-[30px] flex justify-start items-center",
                  isInputFocus ? "border-main" : "border-text-light"
                )}
              >
                <HashtagIcon
                  className={clsx(
                    "size-4 ml-3.5",
                    selected ? "fill-main" : "fill-text-sub"
                  )}
                />
                <ComboboxInput
                  placeholder="영화 제목을 입력하세요"
                  onFocus={(e) => {
                    e.target.placeholder = "";
                    setIsInputFocus(true);
                  }}
                  onBlur={(e) => {
                    e.target.placeholder = "영화 제목을 입력하세요";
                    setIsInputFocus(false);
                  }}
                  className={clsx(
                    "movie-name border-none bg-background-main py-1.5 pl-3 text-sm/6 outline-0 placeholder:text-text-placeholder",
                    selected ? "text-main" : " text-sub"
                  )}
                  displayValue={(movie: { id: number; title: string }) =>
                    movie?.title
                  }
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  required
                />
              </div>
              <ComboboxOptions
                anchor="bottom"
                transition
                className={clsx(
                  "w-(--input-width) rounded-[20px] border border-main bg-background-main p-1 mt-1 empty:invisible",
                  "transition duration-100 ease-in data-leave:data-closed:opacity-0"
                )}
              >
                {filteredMovies.map((movie) => (
                  <ComboboxOption
                    key={movie.id}
                    value={movie}
                    className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                  >
                    <div className="text-sm/6 text-text-sub hover:bg-main-10 w-full px-3 rounded-[inherit]">
                      {movie.title}
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox> */}
            <textarea
              id="content"
              rows={20}
              className="w-full px-3 py-2 mt-5 mb-5 border border-text-light outline-0 rounded-md focus:outline-none focus:border-main resize-none text-sm"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              required
            />
            <div className="review-post-thumbnail flex mb-5">
              <div className="review-thumbnail-btns mr-3 flex flex-col">
                {!thumbnail ? (
                  <div className="review-add-thumbnail">
                    {" "}
                    <label
                      htmlFor="thumbnail"
                      className="inline-flex items-center px-3 py-1 border rounded-[10px] border-text-light bg-background-main text-text-main hover:border-main hover:bg-main-10 transition-colors cursor-pointer"
                    >
                      이미지 첨부
                    </label>
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                    ></input>
                  </div>
                ) : (
                  <>
                    <div className="review-change-thumbnail mb-3">
                      {" "}
                      <label
                        htmlFor="thumbnail"
                        className="inline-flex items-center px-3 py-1 border rounded-[10px] border-text-light bg-background-main text-text-main hover:border-main hover:bg-main-10 transition-colors cursor-pointer"
                      >
                        이미지 변경
                      </label>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                      ></input>
                    </div>
                    <button
                      className="review-delete-thumbnail"
                      onClick={removeThumbanil}
                    >
                      {" "}
                      <span className="inline-flex items-center px-3 py-1 border rounded-[10px] border-text-light bg-background-main text-text-main hover:border-main hover:bg-main-10 transition-colors cursor-pointer">
                        이미지 삭제
                      </span>
                    </button>
                  </>
                )}
              </div>
              {thumbnail ? (
                <img
                  src={thumbnail}
                  className="max-w-[400px] max-h-[300px] object-cover"
                  alt="Thumbnail Preview"
                />
              ) : null}
            </div>
            <ReviewPostBtn type="submit" />
          </form>
        </div>
      </>
    );
  }
}
