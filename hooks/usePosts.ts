import { useState, useEffect } from 'react';

interface Author {
  name: string | null;
  image: string | null;
}

interface Category {
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  slug: string;
  image?: string | null;
  coverImage?: string | null;
  createdAt: string;
  author: Author;
  categories: Category[];
  _count: {
    comments: number;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Posts getirilemedi');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, isLoading, error };
}
