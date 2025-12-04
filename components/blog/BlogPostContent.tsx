'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost, blogPosts } from '@/lib/blogData';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPostContentProps {
    post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
    return (
        <AppShell>
            <div className="page-container relative z-10 pb-20 pt-32">
                <article className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-sm font-medium text-black/60 hover:text-[#007AFF] transition-colors mb-8 group"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Back to Blog
                            </Link>

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-black/60">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-medium">
                                    <Tag className="w-3 h-3 mr-2" />
                                    {post.category}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1.5" />
                                    {post.readTime}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {post.date}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-[#1d1d1f] tracking-tight leading-tight">
                                {post.title}
                            </h1>
                        </div>

                        <GlassCard className="mb-12 overflow-hidden p-0 bg-white/60 backdrop-blur-xl border-white/40">
                            {/* Hero Image Area */}
                            <div className={`w-full h-64 md:h-96 bg-gradient-to-br ${getGradient(post.category)} opacity-20 flex items-center justify-center`}>
                                <span className="text-4xl font-bold text-black/10 select-none">{post.category}</span>
                            </div>

                            <div className="p-8 md:p-12">
                                <div
                                    className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1d1d1f] prose-p:text-black/70 prose-a:text-[#007AFF] prose-strong:text-[#1d1d1f] prose-li:text-black/70"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </GlassCard>

                        <div className="border-t border-black/5 pt-12 mt-12">
                            <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f]">Read Next</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {blogPosts
                                    .filter(p => p.id !== post.id && p.category === post.category)
                                    .slice(0, 2)
                                    .map(relatedPost => (
                                        <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
                                            <GlassCard className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/60">
                                                <div className="flex items-center gap-2 mb-3 text-xs text-[#007AFF] font-medium">
                                                    <span>{relatedPost.category}</span>
                                                </div>
                                                <h4 className="text-lg font-bold mb-2 text-[#1d1d1f] group-hover:text-[#007AFF] transition-colors line-clamp-2">
                                                    {relatedPost.title}
                                                </h4>
                                                <p className="text-sm text-black/60 line-clamp-2">{relatedPost.excerpt}</p>
                                            </GlassCard>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                </article>
            </div>
        </AppShell>
    );
}

function getGradient(category: string) {
    switch (category) {
        case 'Tutorial': return 'from-blue-500 to-purple-500';
        case 'Comparison': return 'from-orange-500 to-red-500';
        case 'Monetization': return 'from-green-500 to-emerald-500';
        case 'Tech Explained': return 'from-indigo-500 to-cyan-500';
        case 'Tips': return 'from-pink-500 to-rose-500';
        default: return 'from-gray-500 to-slate-500';
    }
}
