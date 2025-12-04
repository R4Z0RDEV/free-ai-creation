import React from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blogData';
import { BlogPostContent } from '@/components/blog/BlogPostContent';

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return <BlogPostContent post={post} />;
}
