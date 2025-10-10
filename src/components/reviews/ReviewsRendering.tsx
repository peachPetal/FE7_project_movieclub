import ReviewItem from "./ReviewItem";

export default function ReviewsRendering({
  data,
  hasImage,
}: {
  data: Review[];
  hasImage: boolean;
}) {
  return (
    <>
      {data.map((d) => (
        <ReviewItem data={d} hasImage={hasImage} />
      ))}
    </>
  );
}
