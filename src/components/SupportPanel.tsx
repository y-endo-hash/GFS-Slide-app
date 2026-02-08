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
        if (currentPhase === "simulation") {
            if (typeof subStep === 'number' && subStep < 4) {
                return { id: "simulation", title: "分析結果 (次へ)", desc: "預金・投資結果の深堀り", subStep: subStep + 1 };
            }
            if (subStep === 4) {
                return { id: "simulation", title: "分析結果 (考察)", desc: "GFSでの将来シミュレーション", subStep: "insight-0" };
            }
            if (typeof subStep === 'string' && subStep.startsWith('insight-')) {
                const idx = parseInt(subStep.split('-')[1]);
                if (idx < 4) return { id: "simulation", title: "分析結果 (考察次へ)", desc: "具体的な成功事例", subStep: `insight-${idx + 1}` };
                return nextPhaseBase;
            }
        }
        if (currentPhase === "solution" && typeof subStep === 'number' && subStep < 0) { // Future proof
            return { id: "solution", title: "解決策提示 (次へ)", desc: "詳細な解説", subStep: subStep + 1 };
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

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={scrollContainerRef}>
                        {activeTab === "roadmap" ? (
                            <div className="space-y-6 py-4 px-2">
                                {/* Current Phase Highlight - Next Step Preview */}
                                <div className="mb-10">
                                    <p className="text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] px-2">Next Step</p>
                                    <div className="relative group p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                        <div className="bg-white rounded-[2.2rem] overflow-hidden">
                                            {/* Preview Container */}
                                            <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                                <div className="origin-top scale-[0.4] absolute top-4 w-[1000px]">
                                                    {nextStepHighlight?.id === "company" && <Phase2CompanyIntro userData={userData} isPreview />}
                                                    {nextStepHighlight?.id === "threeSteps" && <Phase1ThreeSteps isPreview />}
                                                    {nextStepHighlight?.id === "hearing" && <Phase1Hearing onSubmit={() => { }} onBack={() => { }} onGoToAgenda={() => { }} isPreview />}
                                                    {nextStepHighlight?.id === "simulation" && <Phase3Simulation userData={userData} simulationResult={simulationResult as any} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {nextStepHighlight?.id === "solution" && <Phase4Solution userData={userData} simulationResult={simulationResult as any} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {nextStepHighlight?.id === "closing" && <Phase5Closing userData={userData} simulationResult={simulationResult as any} isPreview subStep={(nextStepHighlight as any).subStep ?? 0} />}
                                                    {!nextStepHighlight && (
                                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                            <CheckCircle2 className="w-16 h-16 mb-4" />
                                                            <p className="text-4xl font-black">All Phases Completed</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                            </div>
                                            {/* Info */}
                                            <div className="p-6 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-1">{nextStepHighlight?.title || "完了"}</h3>
                                                    <p className="text-xs font-bold text-slate-500">{nextStepHighlight?.desc || "全てのセッションが終了しました"}</p>
                                                </div>
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                                    <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Roadmap Storyboard */}
                                <div className="space-y-12 pb-12">
                                    {[
                                        { title: "INTRO", phases: ["agenda", "company", "threeSteps"] },
                                        { title: "ANALYSIS", phases: ["hearing", "simulation"] },
                                        { title: "PROPOSAL", phases: ["solution", "closing"] }
                                    ].map((section) => (
                                        <div key={section.title} className="space-y-4">
                                            <div className="flex items-center gap-4 px-2">
                                                <h4 className="text-[12px] font-black text-slate-900 tracking-[0.3em]">{section.title}</h4>
                                                <div className="h-[1px] flex-1 bg-slate-100" />
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                {phases.filter(p => section.phases.includes(p.id)).map((p, i) => {
                                                    const isPast = phases.findIndex(ph => ph.id === p.id) < currentIdx;
                                                    const isCurrent = p.id === currentPhase;

                                                    return (
                                                        <div
                                                            key={p.id}
                                                            data-phase={p.id}
                                                            className={cn(
                                                                "relative bg-white rounded-3xl border transition-all duration-500 overflow-hidden",
                                                                isCurrent ? "border-blue-500 shadow-xl shadow-blue-50 ring-2 ring-blue-50 ring-offset-2 scale-[1.02]" : "border-slate-100 opacity-60 grayscale-[0.3] hover:opacity-80 hover:grayscale-0"
                                                            )}
                                                        >
                                                            <div className="flex">
                                                                {/* Thumbnail Preview */}
                                                                <div className="w-32 aspect-video bg-slate-50 relative overflow-hidden border-r border-slate-100 shrink-0">
                                                                    <div className="origin-top-left scale-[0.14] absolute top-2 left-2 w-[1000px]">
                                                                        {p.id === "agenda" && <Agenda onGoToPhase={() => { }} userData={userData} isPreview />}
                                                                        {p.id === "company" && <Phase2CompanyIntro userData={userData} isPreview />}
                                                                        {p.id === "threeSteps" && <Phase1ThreeSteps isPreview />}
                                                                        {p.id === "hearing" && <Phase1Hearing onSubmit={() => { }} onBack={() => { }} onGoToAgenda={() => { }} isPreview />}
                                                                        {p.id === "simulation" && <Phase3Simulation userData={userData} simulationResult={simulationResult as any} isPreview subStep={p.id === currentPhase ? subStep : 0} />}
                                                                        {p.id === "solution" && <Phase4Solution userData={userData} simulationResult={simulationResult as any} isPreview subStep={p.id === currentPhase ? subStep : 0} />}
                                                                        {p.id === "closing" && <Phase5Closing userData={userData} simulationResult={simulationResult as any} isPreview subStep={p.id === currentPhase ? subStep : 0} />}
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black/5" />
                                                                    {isPast && (
                                                                        <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center backdrop-blur-[1px]">
                                                                            <CheckCircle2 className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Text Info */}
                                                                <div className="p-4 flex-1 flex flex-col justify-center">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase {phases.findIndex(ph => ph.id === p.id) + 1}</span>
                                                                        {isCurrent && (
                                                                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                                                        )}
                                                                    </div>
                                                                    <h5 className="font-black text-slate-900 leading-tight">{p.title}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
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
