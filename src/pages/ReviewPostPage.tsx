import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useAuthStore } from "../stores/authStore";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { keyForSearch } from "../api/tmdb/tmdb";
import Swal from "sweetalert2";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function ReviewPostPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);

  const location = useLocation();

  const [title, setTitle] = useState("");
  const [selectMovie, setSelectMovie] = useState<MovieInReview | null>(null);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // comobobox 관련 state들
  const [movies, setMovies] = useState<MovieInReview[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MovieInReview | null>(null);
  const [isInputFocus, setIsInputFocus] = useState(true);

  useEffect(() => {
    if (location.state) {
      setSelected(location.state);
      setSelectMovie(location.state);

      console.log(location.state.backdrop);

      if (
        location.state.backdrop !== null &&
        location.state.backdrop !== undefined &&
        location.state.backdrop.trim() !== ""
      ) {
        console.log(location.state.backdrop);
        setThumbnail(location.state.backdrop);
      }

      if (location.state.review_id) {
        const getPrevData = async () => {
          const { data: prevData, error: prevDataError } = await supabase
            .from("reviews")
            .select("*")
            .eq("id", location.state.review_id)
            .maybeSingle();

          if (prevDataError) throw prevDataError;

          setTitle(prevData.title);
          setContent(prevData.content);
          setThumbnail(prevData.thumbnail);
        };

        getPrevData();
      }
    }
    if (!query) {
      setMovies([]);
      return;
    }

    const fetchMoviesFromTMDB = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&api_key=${keyForSearch}&language=ko-KR`
        );
        const data: { results: Movie[] } = await response.json();

        const moviesData: MovieInReview[] = data.results.map(
          ({ id, title, backdrop_path }) => ({
            id,
            title,
            backdrop_path: `${IMAGE_BASE_URL}${backdrop_path}`,
          })
        );

        setMovies(moviesData);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchMoviesFromTMDB();
  }, [query]);

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

    const finalThumbnail =
      thumbnail.trim() ||
      thumbnail === undefined ||
      thumbnail === null ||
      selectMovie?.backdrop_path ||
      "https://mrwvwylqxypdithozmgm.supabase.co/storage/v1/object/public/img/movie_no_image.jpg";

    if (!title || !selectMovie || !content) {
      Swal.fire({
        title: "모든 내용을 입력해주세요",
        text: "리뷰 할 영화를 선택하고, 제목과 내용을 모두 작성해주세요",
        icon: "warning",
        iconColor: "#9858F3",
        showCancelButton: false,
        confirmButtonText: "확인",
        customClass: {
          popup: "rounded-xl shadow-lg !bg-background-main",
          title: "!font-semibold !text-text-main",
          htmlContainer: "!text-s !text-text-sub",
          confirmButton:
            "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50",
        },
        buttonsStyling: false,
      });
      return;
    }

    try {
      if (location.state) {
        if (location.state.review_id) {
          const { error } = await supabase
            .from("reviews")
            .update({
              author_id: userId,
              title,
              content,
              thumbnail: finalThumbnail,
              movie_id: selectMovie.id,
              movie_name: selectMovie.title,
            })
            .eq("id", location.state.review_id);

          if (error) throw error;

          Swal.fire({
            title: "리뷰가 수정되었습니다.",
            icon: "success",
            iconColor: "#9858F3",
            showCancelButton: false,
            confirmButtonText: "확인",
            customClass: {
              popup: "rounded-xl shadow-lg !bg-background-main",
              title: "!font-semibold !text-text-main",
              htmlContainer: "!text-s !text-text-sub",
              confirmButton:
                "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
            },
            buttonsStyling: false,
          });

          navigate(`/reviews/${location.state.review_id}`);
        } else {
          const { data, error } = await supabase
            .from("reviews")
            .insert({
              author_id: userId,
              title,
              content,
              thumbnail: finalThumbnail,
              movie_id: selectMovie.id,
              movie_name: selectMovie.title,
            })
            .select()
            .single();

          if (data) {
            Swal.fire({
              title: "리뷰가 등록되었습니다.",
              icon: "success",
              iconColor: "#9858F3",
              showCancelButton: false,
              confirmButtonText: "확인",
              customClass: {
                popup: "rounded-xl shadow-lg !bg-background-main",
                title: "!font-semibold !text-text-main",
                htmlContainer: "!text-s !text-text-sub",
                confirmButton:
                  "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
              },
              buttonsStyling: false,
            });
            navigate(`/reviews`);
          }
          if (error) throw error;
        }
      } else {
        const { data, error } = await supabase
          .from("reviews")
          .insert({
            author_id: userId,
            title,
            content,
            thumbnail: finalThumbnail,
            movie_id: selectMovie.id,
            movie_name: selectMovie.title,
          })
          .select()
          .single();

        if (data) {
          Swal.fire({
            title: "리뷰가 등록되었습니다.",
            icon: "success",
            iconColor: "#9858F3",
            showCancelButton: false,
            confirmButtonText: "확인",
            customClass: {
              popup: "rounded-xl shadow-lg !bg-background-main",
              title: "!font-semibold !text-text-main",
              htmlContainer: "!text-s !text-text-sub",
              confirmButton:
                "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
            },
            buttonsStyling: false,
          });
          navigate(`/reviews`);
        }
        if (error) throw error;
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    }
  };
  return (
    <>
      <div className="review-post text-text-main">
        <h1 className="text-[40px] font-bold mb-7">리뷰 작성</h1>
        <form className="mr-40" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            autoComplete="off"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            id="review-title "
            className="text-[28px] pl-3 pb-3 w-full mb-5 outline-0 border-b-1 border-text-light placeholder:text-text-light focus:border-main"
          />

          {/* 영화 검색 영역 */}
          <div className="relative w-[268px]">
            {/* 영화 선택 Combobox */}
            <Combobox<MovieInReview>
              value={selected!}
              onChange={(value) => {
                if (!value) return;
                setSelected(value);
                setSelectMovie({
                  id: value.id,
                  title: value.title,
                  backdrop_path: value.backdrop_path,
                });
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
                  autoComplete="off"
                  placeholder="영화 제목을 입력하세요"
                  onFocus={() => setIsInputFocus(true)}
                  onBlur={() => setIsInputFocus(false)}
                  className={clsx(
                    "movie-name border-none bg-background-main py-1.5 pl-3 text-sm/6 outline-0 placeholder:text-text-placeholder",
                    selected ? "text-main" : " text-sub"
                  )}
                  displayValue={(movie: MovieInReview) => movie?.title ?? ""}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Combobox Options */}
              {movies.length > 0 && (
                <ComboboxOptions
                  className="absolute z-50 w-[268px] rounded-[20px] border border-main bg-background-main p-1 mt-1 transition duration-100 ease-in
               max-h-60 overflow-y-auto"
                >
                  {movies.map((movie) => (
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
              )}
            </Combobox>
          </div>

          {/* 내용 입력 */}
          <textarea
            id="content"
            rows={20}
            className="w-full px-3 py-2 mt-5 mb-5 border border-text-light outline-0 rounded-md focus:outline-none focus:border-main resize-none text-sm"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
          />
          {/* 썸네일 업로드 */}
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
            {thumbnail && (
              <img
                src={thumbnail}
                className="max-w-[400px] max-h-[300px] object-cover"
                alt="Thumbnail Preview"
              />
            )}
          </div>
          {/* {thumbnail ? (
                <img
                  src={thumbnail}
                  className="max-w-[400px] max-h-[300px] object-cover"
                  alt="Thumbnail Preview"
                />
              ) : null}
            </div> */}

          {/* 제출 버튼 */}
          <ReviewPostBtn type="submit" />
        </form>
      </div>
    </>
  );
}
// }
