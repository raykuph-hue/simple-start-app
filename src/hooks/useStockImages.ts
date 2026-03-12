import { useState, useCallback } from "react";

export interface StockImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: "unsplash" | "pexels";
  width: number;
  height: number;
}

interface UseStockImagesReturn {
  images: StockImage[];
  isLoading: boolean;
  error: string | null;
  searchImages: (query: string, page?: number, perPage?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  currentQuery: string;
}

// Curated default images for when no search is performed
const CURATED_CATEGORIES = [
  "business", "technology", "nature", "office", "abstract", 
  "minimal", "architecture", "people", "food", "travel"
];

export const useStockImages = (): UseStockImagesReturn => {
  const [images, setImages] = useState<StockImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");

  const searchImages = useCallback(async (query: string, page = 1, perPage = 20) => {
    setIsLoading(true);
    setError(null);
    
    const searchQuery = query || CURATED_CATEGORIES[Math.floor(Math.random() * CURATED_CATEGORIES.length)];
    
    try {
      // Search both Unsplash and Pexels in parallel
      const [unsplashResults, pexelsResults] = await Promise.allSettled([
        fetchUnsplashImages(searchQuery, page, Math.ceil(perPage / 2)),
        fetchPexelsImages(searchQuery, page, Math.ceil(perPage / 2)),
      ]);

      const allImages: StockImage[] = [];

      if (unsplashResults.status === "fulfilled") {
        allImages.push(...unsplashResults.value);
      }

      if (pexelsResults.status === "fulfilled") {
        allImages.push(...pexelsResults.value);
      }

      // Interleave results from both sources
      const interleaved = interleaveArrays(
        allImages.filter(img => img.source === "unsplash"),
        allImages.filter(img => img.source === "pexels")
      );

      if (page === 1) {
        setImages(interleaved);
      } else {
        setImages(prev => [...prev, ...interleaved]);
      }

      setCurrentQuery(searchQuery);
      setCurrentPage(page);
      setHasMore(interleaved.length >= perPage / 2);
    } catch (err) {
      setError("Failed to fetch images. Please try again.");
      console.error("Stock image fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await searchImages(currentQuery, currentPage + 1);
    }
  }, [isLoading, hasMore, currentQuery, currentPage, searchImages]);

  return {
    images,
    isLoading,
    error,
    searchImages,
    loadMore,
    hasMore,
    currentQuery,
  };
};

// Unsplash API (using demo endpoint - in production, use your own API key)
async function fetchUnsplashImages(query: string, page: number, perPage: number): Promise<StockImage[]> {
  // Using Unsplash Source for demo - replace with actual API in production
  const images: StockImage[] = [];
  
  // Generate placeholder Unsplash URLs based on query
  for (let i = 0; i < perPage; i++) {
    const seed = `${query}-${page}-${i}`;
    images.push({
      id: `unsplash-${seed}`,
      url: `https://source.unsplash.com/1200x800/?${encodeURIComponent(query)}&sig=${seed}`,
      thumbnailUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${seed}`,
      alt: `${query} image from Unsplash`,
      photographer: "Unsplash",
      photographerUrl: "https://unsplash.com",
      source: "unsplash",
      width: 1200,
      height: 800,
    });
  }
  
  return images;
}

// Pexels API simulation (using Lorem Picsum as fallback)
async function fetchPexelsImages(query: string, page: number, perPage: number): Promise<StockImage[]> {
  const images: StockImage[] = [];
  const baseId = (page - 1) * perPage;
  
  for (let i = 0; i < perPage; i++) {
    const imageId = baseId + i + 100; // Offset to get different images
    images.push({
      id: `pexels-${imageId}`,
      url: `https://picsum.photos/seed/${query}${imageId}/1200/800`,
      thumbnailUrl: `https://picsum.photos/seed/${query}${imageId}/400/300`,
      alt: `${query} image from Pexels`,
      photographer: "Pexels",
      photographerUrl: "https://pexels.com",
      source: "pexels",
      width: 1200,
      height: 800,
    });
  }
  
  return images;
}

// Utility to interleave two arrays
function interleaveArrays<T>(arr1: T[], arr2: T[]): T[] {
  const result: T[] = [];
  const maxLength = Math.max(arr1.length, arr2.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) result.push(arr1[i]);
    if (i < arr2.length) result.push(arr2[i]);
  }
  
  return result;
}
