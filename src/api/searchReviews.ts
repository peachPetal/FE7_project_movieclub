// src/api/searchReviews.ts

import { supabase } from '../utils/supabase'; // Supabase 클라이언트 경로
import type { ReviewSubset } from '../types/Review'; // ReviewSubset 타입 경로

/**
 * @param query - 검색할 영화 이름
 * @returns {Promise<ReviewSubset[]>} - 검색된 리뷰 목록
 */
export const searchReviews = async (query: string): Promise<ReviewSubset[]> => {
  if (!query) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        title,
        content,
        thumbnail,
        movie_id,
        movie_name, 
        created_at,
        users!inner(
          name
        ),
        comments:comments(count),
        likes:review_likes(count)
        `
      )
      // movie_name 컬럼에서 query를 포함하는 리뷰를 검색합니다.
      .ilike("movie_name", `%${query}%`) 
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];

  } catch (e) {
    console.error('[Supabase API Error] searchReviews:', e);
    return [];
  }
};