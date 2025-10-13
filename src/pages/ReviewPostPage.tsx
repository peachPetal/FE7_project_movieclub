import { useEffect, useState } from "react";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { HashtagIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function ReviewPostPage() {
  const [title, setTitle] = useState("");
  const [movieId, setMovieId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  // comobobox 관련 state들
  // db 설계 후에 { id: number; title: string } 모두 Movie 타입으로 바꿀 것
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);

  const getMovies = async () => {
    const data = await fetch("/movies-dummy.json").then((res) => res.json());
    setMovies(data);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const filteredMovies =
    query === ""
      ? movies
      : movies.filter((movie) => {
          return movie.title.toLowerCase().includes(query.toLowerCase());
        });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(title, movieId, content);

    if (!title || !movieId || !content) {
      alert("값을 모두 입력해주세요.");
      return;
    }

    // thumbnail 첨부 안 했을 경우 해당 movie poster setThumbnail
  };

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
          <Combobox<{ id: number; title: string }>
            value={selected!}
            onChange={(value) => {
              if (value !== null) {
                setSelected(value);
                setMovieId(value.id);
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
          </Combobox>
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
            <div className="review-post-btn mr-3">
              {" "}
              <label
                htmlFor="thumbnail"
                className="inline-flex items-center px-3 py-1 border rounded-[10px] border-text-light bg-background-main text-text-main hover:border-main transition-colors cursor-pointer"
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
            {thumbnail ? (
              <img
                src={thumbnail}
                className="max-w-[400px] max-h-[300px] object-cover"
              />
            ) : null}
          </div>
          <ReviewPostBtn type="submit" />
        </form>
      </div>
    </>
  );
}
