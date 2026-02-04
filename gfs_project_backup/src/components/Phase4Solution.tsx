"use client";

import { useEffect, useState } from "react";
import { UserInput, SimulationResult } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
    GraduationCap, CheckCircle, ArrowRight, TrendingUp, Target,
    Lightbulb, ChevronLeft, FileText, AlertTriangle, HelpCircle,
    UserX, UserCheck, Zap, Layers, Map, Sparkles, Users, X, ArrowLeftRight, Car
} from "lucide-react";
import Image from "next/image";

interface Phase4SolutionProps {
    userData: UserInput;
    simulationResult: SimulationResult;
    onNext: () => void;
    onBack: () => void;
    onGoToAgenda: () => void;
}

export default function Phase4Solution({ userData, simulationResult, onNext, onBack, onGoToAgenda }: Phase4SolutionProps) {
    const [showContent, setShowContent] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [showGoalDetail, setShowGoalDetail] = useState(false);
    const [showPracticeDetail, setShowPracticeDetail] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showLicenseMetaphor, setShowLicenseMetaphor] = useState(false);
    const [showLearningComparison, setShowLearningComparison] = useState(false);
    const [revealedBad, setRevealedBad] = useState(false);
    const [revealedGood, setRevealedGood] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const nextSection = () => {
        onNext();
    };

    const prevSection = () => {
        onBack();
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-white">
            {/* ナビゲーション */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={prevSection} className="text-slate-600">
                    <ChevronLeft className="w-4 h-4 mr-1" /> {activeSection === 0 ? "戻る" : "前へ"}
                </Button>
                <div className="flex gap-2">
                    <div className="w-8 h-2 rounded-full bg-blue-600 transition-all duration-300" />
                </div>
                <Button variant="ghost" size="sm" onClick={onGoToAgenda} className="text-slate-600">
                    <FileText className="w-4 h-4 mr-1" /> 目次
                </Button>
            </div>

            <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center">

                {/* SECTION 0: 3 Points (Slide 1) */}
                {activeSection === 0 && (
                    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 backdrop-blur rounded-full mb-6 ring-1 ring-slate-900/10">
                                <span className="text-blue-600 font-bold">Section 03</span>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-900">{userData.name}様に合う投資</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8 whitespace-nowrap">
                                目標を達成するための本質的な3つのポイント
                            </h2>
                            <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-10 text-lg">
                                資産運用の差を埋め、確実にゴールへ辿り着くために、<br className="hidden md:inline" />プロが重要視する「成功の鉄則」をお伝えします。
                            </p>
                        </div>

                        <div className="relative py-12 flex flex-col items-center">
                            {/* 三角形の図解 */}
                            <div className="relative w-full max-w-md aspect-square">
                                <svg className="absolute inset-0 w-full h-full text-blue-900" viewBox="0 0 100 100">
                                    <polygon points="50,15 85,85 15,85" fill="currentColor" />
                                    <polygon points="50,28 78,80 22,80" fill="white" />
                                </svg>

                                {/* ①ゴールを決める */}
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-64 cursor-pointer group/goal transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => setShowGoalDetail(true)}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white shadow-2xl border-4 border-slate-100 flex items-center justify-center mb-4 transition-all group/icon-container">
                                        <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover/goal:opacity-10 transition-opacity group-hover/goal:animate-ping" />
                                        <Target className="w-10 h-10 text-blue-900 group-hover/goal:text-blue-600 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-black text-blue-900 mb-1 group-hover/goal:text-blue-600 transition-colors">①ゴールを決める</h4>
                                    <p className="text-slate-500 text-sm font-medium whitespace-nowrap">曖昧な将来への不安を具体的な「数字」へと置換</p>
                                    <div className="mt-2 text-blue-500 text-xs font-bold opacity-0 group-hover/goal:opacity-100 transition-opacity flex items-center gap-1">
                                        詳しく見る <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                                {/* ②体系的に学ぶ */}
                                <div
                                    className="absolute bottom-4 left-0 -translate-x-1/3 translate-y-1/2 flex flex-col items-center text-center w-64 cursor-pointer group/learn transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => setShowLearningComparison(true)}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white shadow-2xl border-4 border-slate-100 flex items-center justify-center mb-4 transition-all group/icon-container">
                                        <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover/learn:opacity-10 transition-opacity group-hover/learn:animate-ping" />
                                        <Layers className="w-10 h-10 text-blue-900 group-hover/learn:text-blue-600 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-black text-blue-900 mb-1 group-hover/learn:text-blue-600 transition-colors">②体系的に学ぶ</h4>
                                    <p className="text-slate-500 text-sm font-medium whitespace-nowrap">「断片的な知識」を「活かせる線」へ繋げる</p>
                                    <div className="mt-2 text-blue-500 text-xs font-bold opacity-0 group-hover/learn:opacity-100 transition-opacity flex items-center gap-1">
                                        比較を見る <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                                {/* ③少額から実践する */}
                                <div
                                    className="absolute bottom-4 right-0 translate-x-1/3 translate-y-1/2 flex flex-col items-center text-center w-64 cursor-pointer group/practice transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => setShowPracticeDetail(true)}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white shadow-2xl border-4 border-slate-100 flex items-center justify-center mb-4 transition-all group/icon-container">
                                        <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover/practice:opacity-10 transition-opacity group-hover/practice:animate-ping" />
                                        <Zap className="w-10 h-10 text-blue-900 group-hover/practice:text-blue-600 transition-colors" />
                                    </div>
                                    <h4 className="text-xl font-black text-blue-900 mb-1 group-hover/practice:text-blue-600 transition-colors">③少額から実践する</h4>
                                    <p className="text-slate-500 text-sm font-medium whitespace-nowrap">リスクを抑え、まずは正しい一歩を踏み出す</p>
                                    <div className="mt-2 text-blue-500 text-xs font-bold opacity-0 group-hover/practice:opacity-100 transition-opacity flex items-center gap-1">
                                        詳しく見る <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-6xl font-black text-blue-900 opacity-5">CORE</span>
                                </div>
                            </div>

                            {/* 特殊パネルトグル (成功 vs 失敗のみが残る - 下部ボタンとラインを合わせる) */}
                            <div className="absolute -bottom-48 left-4 flex flex-col gap-4">
                                {/* 成功 vs 失敗 (黒) */}
                                <div className="group/btn relative">
                                    <button
                                        onClick={() => setShowComparison(!showComparison)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 z-20 ${showComparison ? "bg-blue-600 text-white rotate-45" : "bg-slate-900 text-white"}`}
                                    >
                                        {showComparison ? <X className="w-8 h-8" /> : <ArrowLeftRight className="w-8 h-8" />}
                                    </button>
                                    {!showComparison && (
                                        <div className="absolute left-18 top-1/2 -translate-y-1/2 ml-4 whitespace-nowrap bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-lg pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-x-1 group-hover/btn:translate-x-0">
                                            失敗・成功の違いをチェック
                                            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-8 border-transparent border-r-slate-900" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 比較オーバーレイパネル (成功 vs 失敗) */}
                            {showComparison && (
                                <div className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-sm rounded-[3rem] p-4 md:p-8 animate-in zoom-in-95 duration-500 overflow-y-auto border-4 border-slate-900/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]">
                                    <div className="text-center mb-8 relative">
                                        <button
                                            onClick={() => setShowComparison(false)}
                                            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <h3 className="text-2xl font-black text-slate-900">投資で失敗する人・成功する人</h3>
                                        <div className="w-16 h-1 bg-blue-600 mx-auto mt-2"></div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* 失敗する人 - BAD */}
                                        <div
                                            className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative group/card cursor-pointer"
                                            onClick={() => setRevealedBad(true)}
                                        >
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <UserX className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <h4 className="text-lg font-black text-slate-900 flex items-baseline gap-1">
                                                    失敗する人
                                                    <span className="text-blue-400 font-black text-xl italic ml-1">BAD</span>
                                                </h4>
                                            </div>

                                            <div className={`space-y-2 transition-all duration-700 ${revealedBad ? 'opacity-100 blur-0' : 'opacity-20 blur-sm pointer-events-none'}`}>
                                                {[
                                                    "投資のゴールがない",
                                                    "他人のおすすめ銘柄を買っている",
                                                    "SNSやYouTubeなど、無料の情報に頼っている",
                                                    "銀行や証券会社で勧められたものを買っている",
                                                    "とりあえず始めている",
                                                    "時間がないを言い訳にしている"
                                                ].map((text, i) => (
                                                    <li key={i} className="bg-white px-4 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 flex items-center gap-2 list-none">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                                        {text}
                                                    </li>
                                                ))}
                                            </div>

                                            {!revealedBad && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2px] rounded-3xl animate-in fade-in duration-500">
                                                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 transform group-hover/card:scale-105 transition-transform">
                                                        <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                                                        <span className="text-xs font-black text-slate-900">クリックして開示</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 成功する人 - GOOD */}
                                        <div
                                            className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-100 shadow-xl relative group/card cursor-pointer"
                                            onClick={() => setRevealedGood(true)}
                                        >
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <UserCheck className="w-4 h-4 text-white" />
                                                </div>
                                                <h4 className="text-lg font-black text-slate-900 flex items-baseline gap-1">
                                                    成功する人
                                                    <span className="text-amber-500 font-black text-xl italic ml-1">GOOD</span>
                                                </h4>
                                            </div>

                                            <div className={`space-y-2 transition-all duration-700 ${revealedGood ? 'opacity-100 blur-0 translate-y-0' : 'opacity-20 blur-sm pointer-events-none'}`}>
                                                {[
                                                    "自分なりの考えのもと選べている",
                                                    "膨大な量の無料の情報に左右されない",
                                                    "投資の目的が明確である",
                                                    "人頼みの考えがない",
                                                    "年利の理解ができている",
                                                    "知識をつける意欲がある"
                                                ].map((text, i) => (
                                                    <li key={i} className="bg-white px-4 py-3 rounded-xl border border-blue-100 text-sm font-black text-slate-900 flex items-center gap-2 list-none">
                                                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                                                        {text}
                                                    </li>
                                                ))}
                                            </div>

                                            {!revealedGood && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/5 backdrop-blur-[2px] rounded-3xl animate-in fade-in duration-500">
                                                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-blue-100 flex items-center gap-2 transform group-hover/card:scale-105 transition-transform">
                                                        <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                                                        <span className="text-xs font-black text-slate-900">クリックして開示</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 学習方法比較オーバーレイ (Slide 2を統合) */}
                            {showLearningComparison && (
                                <div className="absolute inset-x-[-2rem] top-[-2rem] bottom-[-4rem] z-[70] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto p-8 rounded-[3rem] shadow-2xl border-t-8 border-blue-600">
                                    <div className="max-w-4xl mx-auto py-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="text-left">
                                                <h3 className="text-3xl font-black text-slate-900 mb-2">学習の方法による違い</h3>
                                                <p className="text-slate-500 font-bold italic">投資の結果は「学び方」で決まります</p>
                                            </div>
                                            <button
                                                onClick={() => setShowLearningComparison(false)}
                                                className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all shadow-sm"
                                            >
                                                <X className="w-8 h-8" />
                                            </button>
                                        </div>

                                        <div className="inline-block w-full px-8 py-4 bg-blue-900 text-white rounded-2xl font-black text-xl shadow-xl mb-12 text-center">
                                            断片的な知識を得ても、投資は失敗します！
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-12 mt-16 pb-24">
                                            {/* 体系的に学んだ場合 */}
                                            <div className="flex flex-col items-center">
                                                <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                                    <span className="text-blue-600 text-4xl">基礎</span>から<br />体系的に学んだ場合
                                                </h4>
                                                <div className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-100 p-8 flex flex-col items-center group overflow-hidden rounded-[2.5rem] shadow-inner">
                                                    <span className="text-xs font-black text-blue-900/40 tracking-[0.3em] uppercase mb-4">Start</span>
                                                    <div className="text-2xl font-black text-blue-900 mb-6">スタート</div>
                                                    <div className="flex justify-between w-full max-w-sm relative flex-1 h-full mb-2">
                                                        {[
                                                            { colors: ['bg-blue-50', 'bg-blue-100', 'bg-blue-300'], delay: 0 },
                                                            { colors: ['bg-green-50', 'bg-green-100', 'bg-green-300'], delay: 600 },
                                                            { colors: ['bg-amber-50', 'bg-amber-100', 'bg-amber-300'], delay: 1200 }
                                                        ].map((col, cIdx) => (
                                                            <div key={cIdx} className="w-[30%] relative flex flex-col justify-between h-full">
                                                                <div className="absolute left-1/2 top-0 -bottom-6 w-1 -translate-x-1/2 z-20 pointer-events-none">
                                                                    <div className="absolute inset-0 bg-blue-900/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-600 animate-[grow_1s_ease-out_forwards] relative overflow-hidden" style={{ animationDelay: `${col.delay}ms` }}>
                                                                            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white/80 to-transparent opacity-0 animate-[flow_3s_infinite]" style={{ animationDelay: `${col.delay + 1000}ms` }} />
                                                                        </div>
                                                                    </div>
                                                                    {/* 軸と同じテイストの下方向矢印 */}
                                                                    <div
                                                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-blue-600 animate-in fade-in zoom-in duration-500 fill-mode-both"
                                                                        style={{ animationDelay: `${col.delay + 1000}ms` }}
                                                                    ></div>
                                                                </div>
                                                                {col.colors.map((color, bIdx) => (
                                                                    <div key={bIdx} className={`w-full h-[28%] ${color} border border-slate-200 shadow-sm relative z-10`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)' }}></div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-8 relative group">
                                                        <div className="text-5xl font-black bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-clip-text text-transparent transition-all duration-500 hover:scale-105 cursor-default relative z-30">
                                                            ゴール
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 断片的に学んだ場合 */}
                                            <div className="flex flex-col items-center">
                                                <h4 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                                    <span className="text-slate-400 text-4xl italic">YouTube</span>などで<br />断片的に学んだ場合
                                                </h4>
                                                <div className="relative w-full aspect-[4/3] bg-slate-50 border border-slate-100 p-8 flex flex-col items-center group overflow-hidden rounded-[2.5rem] shadow-inner">
                                                    <div className="flex w-full h-full">
                                                        <div className="flex flex-col items-center justify-start pt-12 pr-8 pl-4">
                                                            <span className="text-3xl font-black text-blue-900 leading-none [writing-mode:vertical-rl] tracking-tighter opacity-80 animate-pulse">スタート？</span>
                                                        </div>
                                                        <div className="flex-1 flex flex-col">
                                                            <div className="flex justify-between w-full h-full relative mb-6">
                                                                <div className="absolute inset-0 z-20 pointer-events-none">
                                                                    <svg className="w-full h-full" viewBox="0 0 300 180" preserveAspectRatio="none" overflow="visible">
                                                                        <path d="M -50 90 L 50 90 L 150 30 L 250 30 L 50 150 L 50 200" fill="none" stroke="#1e3a8a" strokeWidth="5" className="animate-[dash_10s_linear_infinite]" strokeDasharray="12 12" />
                                                                        <path d="M 40 190 L 50 205 L 60 190" fill="none" stroke="#1e3a8a" strokeWidth="5" />
                                                                    </svg>
                                                                </div>
                                                                {[
                                                                    { colors: [null, 'bg-blue-100', 'bg-blue-300'] },
                                                                    { colors: ['bg-green-100', null, null] },
                                                                    { colors: ['bg-amber-100', null, null] }
                                                                ].map((col, cIdx) => (
                                                                    <div key={cIdx} className="w-[30%] relative flex flex-col justify-between h-full">
                                                                        {col.colors.map((color, bIdx) => (
                                                                            <div key={bIdx} className={`w-full h-[28%] ${color ? color + ' border-slate-300 shadow-sm opacity-60' : 'border-dashed border-2 border-slate-300 bg-transparent opacity-30'} border relative z-10`}></div>
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="text-3xl font-black text-blue-900 opacity-80 tracking-tighter mt-4 ml-2 animate-pulse">ゴール？</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* キャプション/注釈エリア */}
                                        <div className="mt-12 flex items-center justify-center relative min-h-[80px]">
                                            {/* 車の免許の例え (黄色) - 左下に固定配置 */}
                                            <div className="absolute left-4 bottom-4 group/btn">
                                                <button
                                                    onClick={() => setShowLicenseMetaphor(true)}
                                                    className="w-20 h-20 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-amber-200/50 active:scale-95 border-4 border-white"
                                                >
                                                    <Car className="w-10 h-10" />
                                                </button>
                                                <div className="absolute left-0 bottom-full mb-4 whitespace-nowrap bg-amber-500 text-white text-[10px] font-black px-4 py-2 rounded-lg pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/btn:translate-y-0 shadow-xl">
                                                    投資と車の例え話を確認
                                                    <div className="absolute left-4 top-full border-8 border-transparent border-t-amber-500" />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => setShowLearningComparison(false)}
                                                className="bg-slate-900 hover:bg-black text-white font-black px-12 h-16 rounded-full shadow-lg group flex items-center gap-2"
                                            >
                                                <X className="w-5 h-5" />
                                                詳細を閉じて戻る
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-32 text-center">
                            <Button onClick={nextSection} size="lg" className="bg-blue-600 hover:bg-black text-white font-black px-12 h-16 rounded-full shadow-lg group">
                                効率的な学習方法とは？
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Deep Dive Slide: Goal Setting */}
            {showGoalDetail && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500"
                    onClick={() => setShowGoalDetail(false)}
                >
                    <div
                        className="bg-white rounded-[3rem] overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left: Illustration */}
                        <div className="md:w-1/2 relative bg-blue-900 min-h-[300px]">
                            <Image
                                src="/images/goal_detail.png"
                                alt="Investment Goal Metaphor"
                                fill
                                className="object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex items-end p-8 md:p-12">
                                <div className="text-white">
                                    <div className="bg-blue-400 w-16 h-1 mb-6"></div>
                                    <h5 className="text-3xl font-black mb-4 leading-tight">人生は、長い航海。</h5>
                                    <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                                        目的地のない船は、<br />
                                        どんなに速いエンジンを持っていても、<br />
                                        決して理想の岸には辿り着けません。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
                            <button
                                onClick={() => setShowGoalDetail(false)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                    <Target className="w-3 h-3" /> Essentials
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 leading-tight">なぜ「ゴール」が<br /><span className="text-blue-600">最優先</span>なのか？</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Lightbulb className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2">灯台（数字）が道標になる</h4>
                                        <p className="text-slate-500 leading-relaxed">
                                            「将来がなんとなく不安」という深い霧を、<br />
                                            「月5万円の不足」という具体的な<span className="text-slate-900 font-bold">数字の灯台</span>に変える。
                                            そこから初めて、正しい航路が見えてきます。
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Map className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2">自分に最適な「船」を選べる</h4>
                                        <p className="text-slate-500 leading-relaxed">
                                            目的地が決まれば、リスクを取って加速すべきか、着実に守りながら進むべきか、
                                            <span className="text-slate-900 font-bold">あなただけの最適な投資手法（船）</span>が明白になります。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowGoalDetail(false)}
                                size="lg"
                                className="mt-16 w-full bg-blue-600 hover:bg-black text-white font-black h-20 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 text-xl"
                            >
                                <X className="w-6 h-6" />
                                閉じて戻る
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deep Dive Slide: Driver's License Metaphor (Yellow Icon) */}
            {showLicenseMetaphor && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500"
                    onClick={() => setShowLicenseMetaphor(false)}
                >
                    <div
                        className="bg-white rounded-[3rem] overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left: Illustration */}
                        <div className="md:w-1/2 relative bg-slate-900 min-h-[300px]">
                            <Image
                                src="/images/learning_detail.png"
                                alt="Driver's License Metaphor"
                                fill
                                className="object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent flex items-end p-8 md:p-12">
                                <div className="text-white">
                                    <div className="bg-amber-400 w-16 h-1 mb-6"></div>
                                    <h5 className="text-3xl font-black mb-4 leading-tight text-white">投資も「運転」と同じ。</h5>
                                    <p className="text-slate-100 text-lg leading-relaxed opacity-90">
                                        目的地が決まっても、<br />
                                        免許がなければハンドルは握れません。<br />
                                        正しい知識こそが、あなたを守る免許証です。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
                            <button
                                onClick={() => setShowLicenseMetaphor(false)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                    <Layers className="w-3 h-3" /> Skill Mastery
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 leading-tight">なぜ「体系的に」<br /><span className="text-amber-500">学ぶ</span>必要があるのか？</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-black text-amber-600 opacity-40">01</div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2">「鉄の塊」を制御するために</h4>
                                        <p className="text-slate-500 leading-relaxed font-medium">
                                            目的地が決まり、どれだけ遠出をしたいと思っても、免許がない状態で運転はできません。
                                            あの<span className="text-slate-900 font-bold underline decoration-amber-200 underline-offset-4 decoration-4">「鉄の塊」</span>を安全に動かすには、正しい知識が必要です。
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-black text-amber-600 opacity-40">02</div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2">教習所での「練習」の重要性</h4>
                                        <p className="text-slate-500 leading-relaxed font-medium">
                                            誰もが<span className="text-slate-900 font-bold">教習所などで勉強し、練習を繰り返して</span>初めて安全運転ができるようになります。
                                            投資においても、全く同じステップが必要不可欠なのです。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowLicenseMetaphor(false)}
                                size="lg"
                                className="mt-16 w-full bg-slate-900 hover:bg-black text-white font-black h-20 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 text-xl"
                            >
                                <X className="w-6 h-6" />
                                閉じて戻る
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {showPracticeDetail && (
                <div
                    className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500"
                    onClick={() => setShowPracticeDetail(false)}
                >
                    <div
                        className="bg-white rounded-[3rem] overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in zoom-in-95 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image/Illustration side */}
                        <div className="md:w-[45%] relative bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                            <div className="relative w-full h-full flex flex-col">
                                <div className="flex-1 relative min-h-[250px] shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
                                    <Image
                                        src="/images/mini_stock_services.png"
                                        alt="Mini Stock Services Comparison"
                                        fill
                                        className="object-contain bg-white p-4"
                                    />
                                </div>
                                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-blue-900 font-black text-lg mb-1">株は1株から買える時代です</p>
                                        <p className="text-blue-700/80 text-sm font-medium leading-relaxed">
                                            かつては数十万円必要だった株式投資も、今はスマホ一つで「数百円」から始められます。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="md:w-[55%] p-8 md:p-14 flex flex-col justify-center bg-white relative text-left">
                            <button
                                onClick={() => setShowPracticeDetail(false)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-10 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                    <Zap className="w-3 h-3 text-blue-500 fill-blue-500" /> Start Small
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 leading-tight">なぜ「少額」から<br /><span className="text-blue-600">実践</span>するのか？</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default">
                                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        致命傷を避け、一歩を踏み出す
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed">
                                        最初から大きなリスクを取る必要はありません。数百円から始めて<span className="text-slate-900 font-bold">「まずは正しい一歩」</span>を踏み出す。
                                        多くの証券会社が提供するミニ株なら、それが可能です。
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default">
                                    <h4 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        「自分事」として学ぶための最適解
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed">
                                        教科書を100回読むより、100円の株を1株買う方が遥かに学びになります。
                                        自分のお金が動く感覚こそが、<span className="text-slate-900 font-bold">市場と向き合う「真の経験値」</span>へと変わります。
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowPracticeDetail(false)}
                                size="lg"
                                className="mt-12 w-full bg-slate-900 text-white font-black h-20 rounded-2xl shadow-xl hover:bg-black transition-all text-xl"
                            >
                                閉じて戻る
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes grow {
                    from { height: 0; }
                    to { height: 100%; }
                }
                @keyframes shimmer {
                    from { background-position: 0% center; }
                    to { background-position: 200% center; }
                }
                @keyframes flow {
                    0% { transform: translateY(-100%); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(400%); opacity: 0; }
                }
                @keyframes dash {
                    to { stroke-dashoffset: -100; }
                }
            `}</style>
        </div>
    );
}
