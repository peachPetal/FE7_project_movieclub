import { useState } from "react";
import ReviewSearch from "../components/reviews/ReviewSearch";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";

export default function ReviewPostPage() {
  const [title, setTitle] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !movieTitle || !content) {
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
              setContent(e.target.value)
            }
            className="text-[28px] pl-3 pb-3 w-full mb-5 outline-0 text-text-sub border-b-1 border-text-light placeholder:text-text-light focus:border-main"
            required
          />
          <ReviewSearch />
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
