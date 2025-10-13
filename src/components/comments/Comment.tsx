import FilterDropdown from "../common/buttons/FilterDropdown";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

export default function Comment({ comment }: { comment: number }) {
  return (
    <>
      <div className="comment-area text-text-main mr-40">
        <div className="comment-title flex mb-5">
          <h1 className="text-3xl font-bold mr-3.5">
            Comments <span className="text-main">{comment}</span>
          </h1>
          <FilterDropdown type="Comments" />
        </div>
        <CommentInput />
        <div className="commenet-list">
          <CommentItem />
        </div>
      </div>
    </>
  );
}
