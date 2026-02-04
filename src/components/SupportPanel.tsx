"use client";

import { useState } from "react";
import { Book, HelpCircle, ChevronRight, MessageSquare, Info, Sparkles, X } from "lucide-react";
import { GLOSSARY, SUPPORT_QA } from "@/constants/supportData";
import { UserInput } from "@/types";

interface SupportPanelProps {
    userData: UserInput;
    isOpen: boolean;
    onToggle: () => void;
}

export default function SupportPanel({ userData, isOpen, onToggle }: SupportPanelProps) {
    const [activeTab, setActiveTab] = useState<"glossary" | "qa">("glossary");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const formatContent = (text: string) => {
        if (!text) return "";
        return text.replace(/@@/g, userData?.name || "お客様");
    };

    return (
        <div
            className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 transition-all duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-[calc(-100%+40px)]"}`}
        >
            <div className="flex items-stretch shadow-2xl h-[80vh]">
                {/* メモ内容 */}
                <div className="w-[450px] bg-white/95 backdrop-blur-xl border-r border-slate-200 h-full overflow-hidden flex flex-col rounded-r-3xl">
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
                            <button
                                onClick={onToggle}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100/50 rounded-2xl relative">
                            <button
                                onClick={() => { setActiveTab("glossary"); setSelectedCategory(null); setSelectedItemIndex(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${activeTab === "glossary" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <Book className="w-4 h-4" />
                                専門用語集
                            </button>
                            <button
                                onClick={() => { setActiveTab("qa"); setSelectedCategory(null); setSelectedItemIndex(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all relative z-10 ${activeTab === "qa" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                よくある疑問
                            </button>
                            <div
                                className={`absolute inset-y-1 transition-all duration-300 bg-white shadow-md rounded-xl ${activeTab === "glossary" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+2px)] w-[calc(50%-4px)]"}`}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === "glossary" ? (
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
                <button
                    onClick={onToggle}
                    className="w-10 bg-blue-600 text-white flex flex-col items-center justify-center gap-4 py-8 rounded-r-2xl hover:bg-blue-700 transition-colors cursor-pointer group shadow-xl"
                >
                    <HelpCircle className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
                    <span className="[writing-mode:vertical-rl] font-black text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100">Support Panel</span>
                </button>
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
