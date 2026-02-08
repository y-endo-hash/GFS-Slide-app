"use client";

import { useEffect, useState, useRef } from "react";
import { Book, HelpCircle, ChevronRight, MessageSquare, Info, Sparkles, X, Activity, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { GLOSSARY, SUPPORT_QA } from "@/constants/supportData";
import { UserInput, Phase, SimulationResult } from "@/types";
import { cn } from "@/lib/utils";

// Phase Components for Roadmap Previews
import Agenda from "@/components/Agenda";
import Phase1Hearing from "@/components/Phase1Hearing";
import Phase1ThreeSteps from "@/components/Phase1ThreeSteps";
import Phase2CompanyIntro from "@/components/Phase2CompanyIntro";
import Phase3Simulation from "@/components/Phase3Simulation";
import Phase4Solution from "@/components/Phase4Solution";
import Phase5Closing from "@/components/Phase5Closing";

interface SupportPanelProps {
    userData: UserInput;
    isOpen: boolean;
    onToggle: () => void;
    isStandalone?: boolean;
}

export default function SupportPanel({ userData: initialUserData, isOpen, onToggle, isStandalone = false }: SupportPanelProps) {
    const [activeTab, setActiveTab] = useState<"glossary" | "qa" | "roadmap">("roadmap");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [currentPhase, setCurrentPhase] = useState<Phase>("agenda");
    const [subStep, setSubStep] = useState<number | string>(0);
    const [userData, setUserData] = useState<UserInput>(initialUserData);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // データの同期（ページ間、もしくは同一ページ内の他コンポーネントと）
    useEffect(() => {
        const channel = new BroadcastChannel("gfs-sync");
        channel.onmessage = (event) => {
            if (event.data?.type === "SYNC_STATE") {
                if (event.data.phase) setCurrentPhase(event.data.phase);
                if (event.data.subStep !== undefined) setSubStep(event.data.subStep);
                if (event.data.simulationResult) setSimulationResult(event.data.simulationResult);
                if (event.data.userData) setUserData(event.data.userData);
            } else if (event.data?.type === "PHASE_CHANGE") {
                setCurrentPhase(event.data.phase);
                setSubStep(0);
            }
        };

        // マウント時に最新データの送信を要求
        channel.postMessage({ type: "REQUEST_SYNC" });

        return () => channel.close();
    }, []);

    // 初期化時に親からのpropsでも更新
    useEffect(() => {
        setUserData(initialUserData);
    }, [initialUserData]);

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
    const nextPhaseBase = phases[currentIdx + 1];

    // Determine what to show in the "Next Step" highlight
    const getNextStepInfo = () => {
        if (currentPhase === "hearing") {
            if (typeof subStep === 'number' && subStep < 3) {
                return { id: "hearing", title: "ヒアリング (次へ)", desc: "目標の具体化...", subStep: subStep + 1 };
            }
            return phases[currentIdx + 1];
        }
        if (currentPhase === "simulation") {
            if (typeof subStep === 'number' && subStep < 4) {
                return { id: "simulation", title: "分析結果 (詳細)", desc: "深掘り分析", subStep: subStep + 1 };
            }
            if (subStep === 4) {
                return { id: "simulation", title: "分析結果 (考察)", desc: "成功事例の活用", subStep: "insight-0" };
            }
            if (typeof subStep === 'string' && subStep.startsWith('insight-')) {
                const idx = parseInt(subStep.split('-')[1]);
                if (idx < 4) return { id: "simulation", title: "成功事例 (次へ)", desc: "具体的なケーススタディ", subStep: `insight-${idx + 1}` };
                return nextPhaseBase;
            }
        }
        if (currentPhase === "solution" && typeof subStep === 'number' && subStep < 2) {
            return { id: "solution", title: "解決策提示 (次へ)", desc: "具体的なプランニング", subStep: subStep + 1 };
        }

        return nextPhaseBase;
    };

    const nextStepHighlight = getNextStepInfo();

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

                    {/* Presenter View Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30" ref={scrollContainerRef}>
                        {activeTab === "roadmap" ? (
                            <div className="space-y-8 py-4">
                                {/* LIVE & NEXT Section */}
                                <div className="grid grid-cols-1 gap-6">
                                    {/* LIVE Slide */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 px-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-slate-900 tracking-[0.2em] uppercase">LIVE</span>
                                        </div>
                                        <div className="bg-white rounded-[2rem] border-2 border-red-500 shadow-2xl shadow-red-100 overflow-hidden">
                                            <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                <div className="origin-top scale-[0.4] absolute top-4 w-[1000px]">
                                                    {currentPhase === "agenda" && <Agenda onGoToPhase={() => { }} userData={userData} isPreview />}
                                                    {currentPhase === "company" && <Phase2CompanyIntro userData={userData} isPreview />}
                                                    {currentPhase === "threeSteps" && <Phase1ThreeSteps isPreview />}
                                                    {currentPhase === "hearing" && <Phase1Hearing onSubmit={() => { }} onBack={() => { }} onGoToAgenda={() => { }} isPreview subStep={subStep} />}
                                                    {currentPhase === "simulation" && simulationResult && <Phase3Simulation userData={userData} simulationResult={simulationResult} isPreview subStep={subStep} />}
                                                    {currentPhase === "solution" && simulationResult && <Phase4Solution userData={userData} simulationResult={simulationResult} isPreview subStep={subStep} />}
                                                    {currentPhase === "closing" && simulationResult && <Phase5Closing userData={userData} simulationResult={simulationResult} isPreview subStep={subStep} />}
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                            </div>
                                            <div className="p-4 bg-white">
                                                <h4 className="text-sm font-black text-slate-900">
                                                    {phases.find(p => p.id === currentPhase)?.title}
                                                    <span className="ml-2 text-[10px] text-slate-400 font-bold">
                                                        {typeof subStep === 'number' ? `Step ${subStep + 1}` : subStep}
                                                    </span>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NEXT Slide */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 px-2 opacity-50">
                                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">NEXT PREVIEW</span>
                                        </div>
                                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden grayscale-[0.2] opacity-80 transition-all hover:opacity-100 hover:grayscale-0">
                                            <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                                <div className="origin-top scale-[0.4] absolute top-4 w-[1000px]">
                                                    {nextStepHighlight?.id === "company" && <Phase2CompanyIntro userData={userData} isPreview />}
                                                    {nextStepHighlight?.id === "threeSteps" && <Phase1ThreeSteps isPreview />}
                                                    {nextStepHighlight?.id === "hearing" && <Phase1Hearing onSubmit={() => { }} onBack={() => { }} onGoToAgenda={() => { }} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {nextStepHighlight?.id === "simulation" && simulationResult && <Phase3Simulation userData={userData} simulationResult={simulationResult} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {nextStepHighlight?.id === "solution" && simulationResult && <Phase4Solution userData={userData} simulationResult={simulationResult} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {nextStepHighlight?.id === "closing" && simulationResult && <Phase5Closing userData={userData} simulationResult={simulationResult} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {(!nextStepHighlight || ((nextStepHighlight.id === "simulation" || nextStepHighlight.id === "solution" || nextStepHighlight.id === "closing") && !simulationResult)) && (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50">
                                                            <Clock className="w-16 h-16 mb-4 opacity-10" />
                                                            <p className="text-xl font-bold italic">End of session</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                                            </div>
                                            <div className="p-4 bg-slate-50/50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-600 tracking-tight">{nextStepHighlight?.title || "完了"}</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{nextStepHighlight?.desc}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-slate-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Simplified Timeline */}
                                <div className="pt-8 px-2">
                                    <div className="flex items-center gap-4 mb-6">
                                        <h4 className="text-[10px] font-black text-slate-900 tracking-[0.3em]">TIMELINE</h4>
                                        <div className="h-[1px] flex-1 bg-slate-100" />
                                    </div>
                                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                        {phases.map((p, idx) => {
                                            const isPast = idx < currentIdx;
                                            const isCurrent = p.id === currentPhase;
                                            return (
                                                <div key={p.id} className="relative flex items-center gap-4">
                                                    <div className={cn(
                                                        "absolute -left-[1.35rem] w-3 h-3 rounded-full border-2 border-white z-10 transition-colors duration-500",
                                                        isCurrent ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] animate-pulse" : isPast ? "bg-blue-300" : "bg-slate-200"
                                                    )} />
                                                    <div className={cn(
                                                        "flex-1 p-3 rounded-2xl border transition-all duration-300",
                                                        isCurrent ? "bg-blue-50/50 border-blue-100" : "bg-transparent border-transparent"
                                                    )}>
                                                        <span className={cn(
                                                            "text-[11px] font-black",
                                                            isCurrent ? "text-blue-900" : isPast ? "text-slate-500" : "text-slate-300"
                                                        )}>{p.title}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
