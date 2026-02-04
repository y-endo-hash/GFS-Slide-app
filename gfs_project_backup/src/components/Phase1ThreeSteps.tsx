"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ChevronLeft, FileText, Target, TrendingUp, Zap, Flag } from "lucide-react";
import Image from "next/image";

interface Phase1ThreeStepsProps {
    onNext: () => void;
    onBack: () => void;
    onGoToAgenda: () => void;
}

export default function Phase1ThreeSteps({ onNext, onBack, onGoToAgenda }: Phase1ThreeStepsProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const steps = [
        {
            number: "1",
            title: "ゴールを決める",
            subtitle: "（計画を立てよう）",
            icon: Target,
            color: "bg-blue-900",
            textColor: "text-blue-900",
        },
        {
            number: "2",
            title: "適切な投資手段の決定",
            subtitle: "（年利を考えてみる）",
            icon: TrendingUp,
            color: "bg-blue-900",
            textColor: "text-blue-900",
        },
        {
            number: "3",
            title: "投資の実行",
            subtitle: "（手段を決定してスタート）",
            icon: Zap,
            color: "bg-blue-900",
            textColor: "text-blue-900",
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
            {/* 装飾的な背景 */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 opacity-50 -skew-x-12 translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center">

                {/* ヘッダー */}
                <div className={`w-full flex justify-between items-center mb-12 transition-all duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}>
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900">
                        <ChevronLeft className="w-4 h-4 mr-1" /> 戻る
                    </Button>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 backdrop-blur rounded-full ring-1 ring-slate-900/10">
                        <span className="text-blue-600 font-bold">Section 02</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-900">資産形成の3ステップ</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onGoToAgenda} className="text-slate-600 hover:text-slate-900">
                        <FileText className="w-4 h-4 mr-1" /> 目次
                    </Button>
                </div>

                {/* メインタイトル */}
                <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <h1 className="text-4xl md:text-6xl font-black text-blue-900 mb-4 tracking-tighter flex items-center justify-center gap-4">
                        資産形成の3ステップ
                    </h1>
                    <div className="w-40 h-1.5 bg-blue-900 mx-auto rounded-full"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

                    {/* ステップカードリスト */}
                    <div className="space-y-6">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className={`group relative bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 transform ${showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                                style={{ transitionDelay: `${400 + idx * 150}ms` }}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className="bg-blue-900 text-white text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                                            ステップ {step.number}
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-900 group-hover:scale-110 transition-transform">
                                            <step.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl md:text-2xl font-black text-blue-900 mb-1 leading-tight break-keep">{step.title}</h3>
                                        <p className="text-slate-500 font-bold text-base md:text-lg">{step.subtitle}</p>
                                    </div>
                                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-8 h-8 text-blue-200" />
                                    </div>
                                </div>
                                {idx < 2 && (
                                    <div className="absolute -bottom-6 left-16 w-0.5 h-6 bg-slate-200"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* イラストレーションセクション (Mountain) */}
                    <div className={`relative aspect-square max-w-lg mx-auto w-full transition-all duration-1000 delay-800 ${showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                        <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-3xl"></div>

                        {/* 山の図解 (SVG) */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                            <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 100">
                                {/* 山 */}
                                <path d="M 50 10 L 90 90 L 10 90 Z" fill="#E2E8F0" />
                                <path d="M 50 10 L 50 90 L 10 90 Z" fill="#CBD5E1" />

                                {/* 道 */}
                                <path
                                    d="M 50 85 Q 60 75, 45 65 Q 35 55, 55 45 Q 65 35, 50 20"
                                    fill="none"
                                    stroke="#1E3A8A"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    className="animate-draw-path"
                                />

                                {/* 旗 */}
                                <g transform="translate(48, 8)">
                                    <rect width="1" height="12" fill="#64748B" />
                                    <path d="M 1 0 L 10 3 L 1 6 Z" fill="#FACC15" className="animate-pulse" />
                                </g>
                            </svg>

                            {/* マスコット配置 */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-float-slow">
                                <Image src="/mascot/mascot_search.png" alt="mascot" width={100} height={100} className="drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-4 right-4 animate-float-delayed">
                                <Image src="/mascot/mascot_cheer_blue.png" alt="mascot" width={120} height={120} className="drop-shadow-lg" />
                            </div>

                            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-8 py-3 rounded-2xl shadow-xl border border-blue-100 flex items-center gap-4 whitespace-nowrap min-w-max">
                                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
                                    <Flag className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Initial Goal</p>
                                    <p className="font-black text-blue-900 text-base md:text-lg leading-none">まずは「ゴール」を目指しましょう</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ネクストアクション */}
                <div className={`mt-20 transition-all duration-700 delay-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="bg-blue-900 hover:bg-slate-800 text-white font-black h-20 px-12 rounded-full text-xl md:text-2xl shadow-2xl group transform transition-all hover:scale-105"
                    >
                        ゴール設定のためにあなたのことを教えてください
                        <ArrowRight className="ml-4 w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-3 transition-transform" />
                    </Button>
                </div>

                {/* フッター branding */}
                <div className={`mt-12 transition-opacity duration-1000 delay-1200 ${showContent ? "opacity-40" : "opacity-0"}`}>
                    <p className="text-blue-950 font-black text-xl tracking-[0.4em] italic">Global Financial School</p>
                </div>
            </div>

            <style jsx>{`
                .animate-draw-path {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw 2s ease-out forwards 1.5s;
                }
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
}
