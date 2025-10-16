// src/api/searchReviews.ts

import { supabase } from '../utils/supabase';
import type { ReviewSubset } from '../types/Review';

/**
 * 🎬 Supabase 'reviews' 테이블에서 영화 이름(movie_name)으로 리뷰를 검색합니다.
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
        users!left( 
          name
        ),
        comments!review_id(count), 
        likes:review_likes!review_id(count)
        `
      )
      .ilike("movie_name", `%${query}%`) 
      .order("created_at", { ascending: false });

    if (error) {
      // Supabase 에러가 발생하면 콘솔에 기록하고 에러를 던집니다.
      console.error('[Supabase Error] searchReviews:', error);
      throw error;
    }

    // 데이터가 null일 경우를 대비해 빈 배열을 반환합니다.
    return data || [];

  } catch (e) {
    // 함수 실행 중 발생하는 모든 에러를 처리합니다.
    console.error('[API Function Error] searchReviews:', e);
    return [];
  }
};