import ReviewItem from "./ReviewItem";

export default function ReviewsRendering({ data }: { data: Review[] }) {
  return (
    <>
      {data.map((d) => (
        <ReviewItem data={d} />
      ))}
    </>
  );
}
