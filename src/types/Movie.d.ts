interface Actor {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface Movie {
  id: number;
  genres: { id: number; name: string }[];
  title: string;
  original_title: string;
  overview: string;
  year: string;
  rating: number;
  runtime: string;
  poster: string;
  backdrop: string;
  director: string;
  actors: Actor[];
  trailer: string;
}
