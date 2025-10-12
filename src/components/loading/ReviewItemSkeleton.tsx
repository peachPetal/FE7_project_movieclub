import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";

export default function ReviewItemSkeleton({
  hasImage,
}: {
  hasImage: boolean;
}) {
  return (
    <>
      <div
        className={twMerge(
          "review-item w-80 bg-background-main card-shadow overflow-hidden h-[410px]",
          !hasImage && "h-[230px]"
        )}
      >
        {hasImage ? (
          <Skeleton height={185} className="reivew-thumbnail" />
        ) : null}
        <div className="review-data p-5 h-[227px] flex flex-col justify-between">
          <div className="review-post">
            <Skeleton width={280} height={27} className="review-title mb-3" />
            <Skeleton width={280} height={60} className="review-content mb-3" />
            <Skeleton
              width={280}
              height={16}
              className="review-created-info mb-4"
            />
          </div>
          <div className="review-social-buttons flex justify-around align-middle">
            <Skeleton width={39} height={26} className="like" />
            <Skeleton width={39} height={26} className="comment" />
            <Skeleton width={22} height={26} className="share" />
          </div>
        </div>
      </div>
    </>
  );
}
