interface Movie {
  id: string | number;
  title: string;
  year?: string | number;
  rating?: number;
  posterUrl?: string;
  description?: string;
  genre?: string[];
  director?: string;
  actors?: string[];
  runtime?: string | number;
}
