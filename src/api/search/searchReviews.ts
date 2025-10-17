// src/api/searchReviews.ts

import { supabase } from '../../utils/supabase';
import type { ReviewSubset } from '../../types/review';

/**
 * Supabase 'reviews' 테이블에서 영화 이름(movie_name)으로 리뷰를 검색합니다.
 * ReviewList 컴포넌트의 데이터 조회 스타일과 통일성을 맞춘 버전입니다.
 * @param query - 검색할 영화 이름
 * @returns {Promise<ReviewSubset[]>} - 검색된 리뷰 목록
 */
export const searchReviews = async (query: string): Promise<ReviewSubset[]> => {
  // 검색어가 없으면 API 요청 없이 빈 배열을 반환합니다.
  if (!query) {
    return [];
  }

  try {
    // ReviewList의 fetchPosts와 동일한 구조로 API를 호출합니다.
    const { data: reviews, error } = await supabase
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
        comments:review_comments(count),
        likes:review_likes(count)
      `
      )
      .ilike("movie_name", `%${query}%`) // 검색 기능 추가
      .order("created_at", { ascending: false });

    // 에러가 발생하면 에러를 던집니다.
    if (error) {
      throw error;
    }

    // Supabase가 null을 반환할 경우를 대비해 빈 배열을 반환합니다.
    return reviews || [];

  } catch (e) {
    // try 블록에서 던져진 에러를 여기서 처리합니다.
    console.error('[API Function Error] searchReviews:', e);
    // UI 중단을 막기 위해 빈 배열을 반환합니다.
    return [];
  }
};
