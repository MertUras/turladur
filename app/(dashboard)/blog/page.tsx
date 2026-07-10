import PostList from "@/app/components/PostList";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <PostList />
      </div>
    </div>
  );
} 