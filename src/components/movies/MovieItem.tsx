type MovieItemProps = {
  data: Movie;
};

export default function MovieItem({ data }: MovieItemProps) {
  const { id, title, posterUrl, year, rating } = data;

  return (
    <div
      key={id}
      className="rounded-lg border border-gray-200 card-shadow hover:shadow-md transition p-3"
    >
      <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center text-gray-400">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          "No Poster"
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-sm truncate">{title}</h3>
        <p className="text-xs text-gray-500">{year}</p>
        {rating && (
          <span className="inline-block mt-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
            ★ {rating}
          </span>
        )}
      </div>
    </div>
  );
}
