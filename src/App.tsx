import MoviesRendering from "./components/MoviesRendering";

export default function App() {
  return (
    <>
      <div className="bg-background-sub p-4">
        <p className="text-main">메인 텍스트</p>
      </div>
      <MoviesRendering variant="home" limit={2} />
    </>
  );
}
