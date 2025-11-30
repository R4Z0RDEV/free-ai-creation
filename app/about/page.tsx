'use client';

import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Unlock, Heart, ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <AppShell>
            <div className="page-container pb-20 pt-32">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/50 text-[#007AFF] ring-1 ring-black/5 shadow-sm backdrop-blur-md">
                        <Heart className="h-8 w-8 fill-current" />
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-6xl">
                        Creativity Should Be <span className="text-[#007AFF]">Free</span>.
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-black/60 leading-relaxed">
                        We believe that the power of AI should be accessible to everyone, not just those who can afford expensive subscriptions.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3 mb-16">
                    {/* The Problem */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <GlassCard className="p-8 md:p-12 overflow-hidden relative">
                            <div className="relative z-10 max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-sm font-medium mb-6 border border-red-500/20">
                                    <Zap className="w-4 h-4" />
                                    The Problem
                                </div>
                                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">
                                    The "Token" Barrier
                                </h2>
                                <p className="text-lg text-black/60 leading-relaxed">
                                    Most AI creation platforms operate on a credit system. You buy tokens, and every image, video, or song you generate costs you money. This stifles experimentation and puts a price tag on your imagination. You hesitate to hit "Generate" because you're worried about wasting credits.
                                </p>
                            </div>
                            <div className="absolute -right-20 -bottom-40 opacity-5">
                                <Zap className="w-96 h-96" />
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Our Solution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-3"
                    >
                        <GlassCard className="p-8 md:p-12 overflow-hidden relative bg-gradient-to-br from-white/40 to-[#007AFF]/5">
                            <div className="relative z-10 max-w-3xl ml-auto text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-sm font-medium mb-6 border border-[#007AFF]/20">
                                    <Unlock className="w-4 h-4" />
                                    Our Solution
                                </div>
                                <h2 className="text-3xl font-bold text-[#1d1d1f] mb-4">
                                    No Tokens. No Limits.
                                </h2>
                                <p className="text-lg text-black/60 leading-relaxed">
                                    We've removed the paywall. On Free AI Creation, you don't need to count tokens or worry about running out of credits. We provide access to powerful open-source models completely for free. Experiment, iterate, and create as much as you want.
                                </p>
                            </div>
                            <div className="absolute -left-20 -bottom-40 opacity-5 text-[#007AFF]">
                                <InfinityIcon className="w-96 h-96" />
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-20">
                    {[
                        {
                            icon: InfinityIcon,
                            title: "Unlimited Generation",
                            description: "Create as many assets as you need without hitting a paywall."
                        },
                        {
                            icon: Sparkles,
                            title: "Top-Tier Models",
                            description: "Access state-of-the-art models like Flux, AudioLDM, and RVC."
                        },
                        {
                            icon: Unlock,
                            title: "100% Free",
                            description: "No hidden fees, no credit card required. Just pure creativity."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                        >
                            <GlassCard className="p-6 h-full">
                                <div className="h-12 w-12 rounded-xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-4">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-black/60">
                                    {feature.description}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-[#1d1d1f] mb-8">
                        Ready to unleash your creativity?
                    </h2>
                    <Link href="/">
                        <Button
                            size="lg"
                            className="h-14 px-8 rounded-full bg-[#007AFF] text-white hover:bg-[#0066CC] shadow-lg hover:shadow-xl transition-all text-lg"
                        >
                            Start Creating Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </AppShell>
    );
}
