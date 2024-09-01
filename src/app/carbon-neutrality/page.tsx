"use client";

import React from 'react';
import BlogCard from '@/components/BlogCard';

const blogPosts = [
  {
    id: '1',
    title: 'The Path to Carbon Neutrality in Coal Mining',
    excerpt: 'Exploring strategies for achieving carbon neutrality in the coal mining industry.',
    date: 'May 15, 2023',
    author: 'John Doe',
    imageUrl: 'https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '2',
    title: 'Innovative Technologies for Reducing Coal Mining Emissions',
    excerpt: 'Discover cutting-edge technologies that are revolutionizing emission reduction in coal mining.',
    date: 'June 2, 2023',
    author: 'Jane Smith',
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '3',
    title: 'The Role of Renewable Energy in Coal Mining Operations',
    excerpt: 'Exploring how renewable energy sources are being integrated into coal mining to reduce carbon footprint.',
    date: 'June 20, 2023',
    author: 'Michael Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '4',
    title: 'Carbon Capture and Storage in Coal Mining',
    excerpt: 'An in-depth look at carbon capture and storage technologies being implemented in coal mines.',
    date: 'July 5, 2023',
    author: 'Emily Brown',
    imageUrl: 'https://images.unsplash.com/photo-1623091411395-09e79fdbfcf3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '5',
    title: 'Sustainable Practices in Coal Transportation',
    excerpt: 'Examining eco-friendly methods for transporting coal to reduce overall emissions.',
    date: 'July 22, 2023',
    author: 'David Wilson',
    imageUrl: 'https://images.unsplash.com/photo-1635273051937-a0ddef9573b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '6',
    title: 'The Impact of Methane Capture in Coal Mining',
    excerpt: 'Understanding the significance of methane capture and its role in reducing greenhouse gas emissions.',
    date: 'August 10, 2023',
    author: 'Sarah Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1466&q=80',
  },
  {
    id: '7',
    title: 'Policy Changes Driving Carbon Neutrality in Mining',
    excerpt: 'Analyzing recent policy changes and their impact on carbon neutrality efforts in the mining sector.',
    date: 'August 28, 2023',
    author: 'Robert Lee',
    imageUrl: 'https://images.unsplash.com/photo-1541726260-e6b6a6a08b27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
  },
  {
    id: '8',
    title: 'The Future of Carbon-Neutral Coal Mining',
    excerpt: 'Exploring predictions and possibilities for a carbon-neutral future in the coal mining industry.',
    date: 'September 15, 2023',
    author: 'Lisa Chen',
    imageUrl: 'https://images.unsplash.com/photo-1545127398-af68e58e8fc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const CarbonNeutralityPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Carbon Neutrality in Coal Mining</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default CarbonNeutralityPage;
