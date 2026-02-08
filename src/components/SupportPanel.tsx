"use client";

import { useEffect, useState, useRef } from "react";
import { Book, HelpCircle, ChevronRight, MessageSquare, Info, Sparkles, X, Activity, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { GLOSSARY, SUPPORT_QA } from "@/constants/supportData";
import { UserInput, Phase } from "@/types";
import { cn } from "@/lib/utils";

interface SupportPanelProps {
    userData: UserInput;
    isOpen: boolean;
    onToggle: () => void;
    isStandalone?: boolean;
}

export default function SupportPanel({ userData, isOpen, onToggle, isStandalone = false }: SupportPanelProps) {
    const [activeTab, setActiveTab] = useState<"glossary" | "qa" | "roadmap">("roadmap");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [currentPhase, setCurrentPhase] = useState<Phase>("agenda");
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // フェーズ情報の受取
    useEffect(() => {
        const channel = new BroadcastChannel("gfs-sync");
        channel.onmessage = (event) => {
            if (event.data?.type === "PHASE_CHANGE") {
                setCurrentPhase(event.data.phase);
            }
        };
        return () => channel.close();
    }, []);

    const phases: { id: Phase; title: string; desc: string }[] = [
        { id: "agenda", title: "アジェンダ", desc: "本日の流れ" },
        { id: "company", title: "GFSの紹介", desc: "信頼と実績" },
        { id: "threeSteps", title: "3ステップ", desc: "資産形成の基本" },
        { id: "hearing", title: "ヒアリング", desc: "目標の明確化" },
        { id: "simulation", title: "分析結果", desc: "投資ロードマップ" },
        { id: "solution", title: "解決策提示", desc: "GFSの活用法" },
        { id: "closing", title: "クロージング", desc: "次へのステップ" },
    ];

    const currentIdx = phases.findIndex(p => p.id === currentPhase);
    const nextPhase = phases[currentIdx + 1];

    // オートスクロール制御
    useEffect(() => {
        if (activeTab === "roadmap" && scrollContainerRef.current) {
            const activeElement = scrollContainerRef.current.querySelector(`[data-phase="${currentPhase}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentPhase, activeTab]);

    const formatContent = (text: string) => {
        if (!text) return "";
        return text.replace(/@@/g, userData?.name || "お客様");
    };

    return (
        <div
            className={isStandalone
                ? "w-full h-screen bg-slate-50 relative overflow-hidden flex flex-col"
                : `fixed top-1/2 -translate-y-1/2 left-0 z-50 transition-all duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-[calc(-100%+40px)]"}`
            }
        >
            <div className={`flex items-stretch ${isStandalone ? "h-full" : "shadow-2xl h-[80vh]"}`}>
                {/* 内容 */}
                <div className={`${isStandalone ? "w-full" : "w-[450px] rounded-r-3xl"} bg-white/95 backdrop-blur-xl border-r border-slate-200 h-full overflow-hidden flex flex-col`}>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Investment Support</h2>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-[0.2em]">Concierge Service</p>
                                        <a
                                            href="https://gfs.tokyo/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 rounded-lg transition-all group/link"
                                        >
                                            <span className="text-[9px] font-black text-blue-600">GFSのコンテンツ</span>
                                            <ChevronRight className="w-2.5 h-2.5 text-blue-600 group-hover/link:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {!isStandalone && (
                                <button
                                    onClick={onToggle}
                                    className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100/50 rounded-2xl relative">
                            <button
                                onClick={() => { setActiveTab("glossary"); setSelectedCategory(null); setSelectedItemIndex(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all relative z-10 ${activeTab === "glossary" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Book className="w-3.5 h-3.5" />
                                専門用語集
                            </button>
                            <button
                                onClick={() => { setActiveTab("qa"); setSelectedCategory(null); setSelectedItemIndex(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all relative z-10 ${activeTab === "qa" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                よくある質問
                            </button>
                            <button
                                onClick={() => setActiveTab("roadmap")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all relative z-10 ${activeTab === "roadmap" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Activity className="w-3.5 h-3.5" />
                                現在の進捗
                            </button>
                            <div
                                className={`absolute inset-y-1 transition-all duration-300 bg-white shadow-md rounded-xl ${activeTab === "glossary" ? "left-1 w-[calc(33.3%-4px)]" :
                                        activeTab === "qa" ? "left-[calc(33.3%+2px)] w-[calc(33.3%-4px)]" :
                                            "left-[calc(66.6%+2px)] w-[calc(33.3%-4px)]"
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={scrollContainerRef}>
                        {activeTab === "roadmap" ? (
                            <div className="space-y-6 py-4 px-2">
                                {/* Current Phase Highlight */}
                                <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-blue-200 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <Activity className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-white/60 mb-1 uppercase tracking-[0.2em]">Now Presenting</p>
                                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
                                            {phases[currentIdx]?.title}
                                        </h3>
                                        <div className="flex items-center gap-2 py-2 px-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 inline-flex">
                                            <Clock className="w-3 h-3 text-blue-200" />
                                            <span className="text-[10px] font-bold text-blue-50">Next: {nextPhase ? nextPhase.title : "終了"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Roadmap List */}
                                <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 before:content-['']">
                                    {phases.map((p, i) => {
                                        const isPast = i < currentIdx;
                                        const isCurrent = i === currentIdx;
                                        const isFuture = i > currentIdx;

                                        return (
                                            <div
                                                key={p.id}
                                                data-phase={p.id}
                                                className={cn(
                                                    "relative transition-all duration-700",
                                                    isCurrent ? "scale-105 opacity-100" : "scale-100 opacity-40 grayscale-[0.5]"
                                                )}
                                            >
                                                {/* Timeline Node */}
                                                <div className={cn(
                                                    "absolute -left-8 top-1 w-6 h-6 rounded-full border-4 transition-all duration-500 z-10 flex items-center justify-center",
                                                    isPast ? "bg-blue-600 border-blue-100 scale-90" :
                                                        isCurrent ? "bg-white border-blue-600 scale-110 shadow-lg shadow-blue-200 animate-pulse" :
                                                            "bg-white border-slate-200"
                                                )}>
                                                    {isPast && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>

                                                <div className={cn(
                                                    "p-5 rounded-3xl border transition-all duration-500",
                                                    isCurrent ? "bg-white border-blue-100 shadow-xl shadow-blue-50/50" : "bg-transparent border-transparent"
                                                )}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={cn(
                                                            "text-lg font-black tracking-tight",
                                                            isCurrent ? "text-slate-900" : "text-slate-400"
                                                        )}>
                                                            {p.title}
                                                        </h4>
                                                        {isCurrent && (
                                                            <span className="px-2 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded-full uppercase tracking-widest animate-bounce">Live</span>
                                                        )}
                                                    </div>
                                                    <p className={cn(
                                                        "text-xs font-bold leading-relaxed",
                                                        isCurrent ? "text-slate-500" : "text-slate-300"
                                                    )}>
                                                        {p.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : activeTab === "glossary" ? (
                            <div className="space-y-4">
                                {Object.keys(GLOSSARY).map((category) => (
                                    <div key={category} className="space-y-2">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3 mt-4">
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {GLOSSARY[category].map((item, idx) => (
                                                <button
                                                    key={item.term}
                                                    onClick={() => {
                                                        if (selectedCategory === category && selectedItemIndex === idx) {
                                                            setSelectedCategory(null);
                                                            setSelectedItemIndex(null);
                                                        } else {
                                                            setSelectedCategory(category);
                                                            setSelectedItemIndex(idx);
                                                        }
                                                    }}
                                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group hover:shadow-lg ${selectedCategory === category && selectedItemIndex === idx
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200"
                                                        : "bg-white border-slate-100 text-slate-700 hover:border-blue-200"}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-base tracking-tight">{item.term}</span>
                                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${selectedCategory === category && selectedItemIndex === idx ? "rotate-90 text-white" : "text-slate-300 group-hover:translate-x-1"}`} />
                                                    </div>

                                                    {selectedCategory === category && selectedItemIndex === idx && (
                                                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                                                                <div className="flex items-start gap-2 mb-2">
                                                                    <Info className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                                                                    <p className="text-sm font-medium leading-relaxed italic">
                                                                        {item.meaning}
                                                                    </p>
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                                    <div className="flex items-start gap-2">
                                                                        <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-blue-200" />
                                                                        <div className="space-y-1">
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/80">分かりやすい例え</p>
                                                                            <p className="text-sm font-black leading-relaxed">
                                                                                {item.metaphor}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.keys(SUPPORT_QA).map((category) => (
                                    <div key={category} className="space-y-2">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3 mt-4">
                                            {category}
                                        </h3>
                                        <div className="space-y-3">
                                            {SUPPORT_QA[category].map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-100 transition-colors"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            if (selectedCategory === category && selectedItemIndex === idx) {
                                                                setSelectedCategory(null);
                                                                setSelectedItemIndex(null);
                                                            } else {
                                                                setSelectedCategory(category);
                                                                setSelectedItemIndex(idx);
                                                            }
                                                        }}
                                                        className="w-full text-left p-5 flex items-start gap-4"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                                                            <span className="text-blue-600 font-black text-xs">Q</span>
                                                        </div>
                                                        <span className="font-bold text-slate-800 pt-1 flex-1 leading-snug">
                                                            {formatContent(item.question)}
                                                        </span>
                                                        <ChevronRight className={`w-5 h-5 text-slate-300 mt-1 transition-transform duration-300 ${selectedCategory === category && selectedItemIndex === idx ? "rotate-90 pointer-events-none" : ""}`} />
                                                    </button>
                                                    {selectedCategory === category && selectedItemIndex === idx && (
                                                        <div className="px-5 pb-6 animate-in fade-in slide-in-from-top-1 duration-300">
                                                            <div className="flex gap-4">
                                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                                                                    <span className="text-white font-black text-xs">A</span>
                                                                </div>
                                                                <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                                                    <p className="text-slate-600 font-bold leading-relaxed">
                                                                        {formatContent(item.answer)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 開閉ボタン（縦の帯） */}
                {!isStandalone && (
                    <button
                        onClick={onToggle}
                        className="w-10 bg-blue-600 text-white flex flex-col items-center justify-center gap-4 py-8 rounded-r-2xl hover:bg-blue-700 transition-colors cursor-pointer group shadow-xl"
                    >
                        <HelpCircle className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
                        <span className="[writing-mode:vertical-rl] font-black text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100">Support Panel</span>
                    </button>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
