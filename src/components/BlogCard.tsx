import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, excerpt, date, author, imageUrl }) => (
  <Link href={`/carbon-neutrality/${id}`}>
    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{excerpt}</p>
        <div className="text-xs text-gray-500">
          <span>{author}</span> · <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default BlogCard;