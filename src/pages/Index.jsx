import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StoryCard = ({ story }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {story.title}
        </a>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">Upvotes: {story.points}</p>
      <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        Read more
      </a>
    </CardContent>
  </Card>
);

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="mb-4">
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/5" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error, isLoading } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Hacker News Top Stories</h1>
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </header>

      <main>
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : (
          filteredStories.map(story => (
            <StoryCard key={story.objectID} story={story} />
          ))
        )}
      </main>
    </div>
  );
};

export default Index;