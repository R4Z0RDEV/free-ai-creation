'use client';

import React from 'react';
import Link from 'next/link';
import { blogPosts } from '@/lib/blogData';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogPage() {
    return (
        <AppShell>
            <div className="page-container relative z-10 pb-20 pt-32">
                {/* Hero Section */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6 inline-flex items-center rounded-full border border-black/5 bg-white/50 px-4 py-1.5 backdrop-blur-md">
                            <Sparkles className="mr-2 h-4 w-4 text-[#007AFF]" />
                            <span className="text-sm font-medium text-black/70">
                                AI Insights & Tutorials
                            </span>
                        </div>
                        <h1 className="mb-8 text-5xl font-bold tracking-tight text-[#1d1d1f] sm:text-7xl">
                            Latest from the <br />
                            <span className="bg-gradient-to-r from-[#007AFF] to-[#5856D6] bg-clip-text text-transparent">
                                AI Frontier
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-black/60">
                            Discover the latest trends, tutorials, and guides in the world of Artificial Intelligence.
                            Stay ahead of the curve.
                        </p>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="block h-full group">
                                <GlassCard className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
                                    {/* Image Placeholder / Gradient */}
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 border-b border-black/5">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(post.category)} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-black/5 select-none">{post.category}</span>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-black/70 border border-black/5 shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 text-xs text-black/40 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{post.date}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 text-[#1d1d1f] group-hover:text-[#007AFF] transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-black/60 text-sm mb-6 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-black/5 flex items-center text-sm font-medium text-[#007AFF] opacity-80 group-hover:opacity-100 transition-opacity">
                                            Read Article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
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
