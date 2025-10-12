import Comment from "../comments/Comment";
import Skeleton from "react-loading-skeleton";

export default function ReviewsDetailSkeleton() {
  return (
    <>
      <div className="w-[1116px] mr-15">
        <Skeleton width={370} height={40} className="mb-2.5" />
        <Skeleton width={250} height={24} className="mb-10" />
        <div className="flex mb-10">
          <Skeleton width={550} height={325} className="mr-8" />
          <Skeleton width={500} height={400} className="mr-12" />
        </div>
        <div className="flex justify-center">
          <Skeleton width={110} height={62} />
        </div>
        <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>
        <div>
          {/* comment 스켈레톤 만들어서 적용하기 */}
          <Comment comment={1} />
        </div>
      </div>
    </>
  );
}
