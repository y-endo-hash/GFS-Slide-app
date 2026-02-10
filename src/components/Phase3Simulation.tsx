"use client";

import { useEffect, useState, useRef } from "react";
import { UserInput, SimulationResult } from "@/types";
import { formatManYen, formatPercent } from "@/lib/simulation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight,
    PiggyBank, Rocket, Target, Lightbulb, BarChart3, ChevronLeft, ChevronRight, FileText, Sparkles,
    User, Wallet, Lock as LockIcon, ChevronsRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import Image from "next/image";

interface Phase3SimulationProps {
    userData: UserInput;
    simulationResult?: SimulationResult;
    onNext?: () => void;
    onBack?: () => void;
    onGoToAgenda?: () => void;
    onSubStepChange?: (subStep: number | string) => void;
    subStep?: number | string;
    isPreview?: boolean;
}

export default function Phase3Simulation({ userData, simulationResult, onNext, onBack, onGoToAgenda, onSubStepChange, subStep, isPreview = false }: Phase3SimulationProps) {
    const [showStep, setShowStep] = useState(isPreview ? (typeof subStep === 'number' ? subStep : 4) : 0);
    const [showContent, setShowContent] = useState(isPreview);
    const [showSecondHalf, setShowSecondHalf] = useState(isPreview);
    const [showSavingsResult, setShowSavingsResult] = useState(isPreview);
    const [showGapCard, setShowGapCard] = useState(isPreview);
    const [showArrowButton, setShowArrowButton] = useState(false);
    const [showRequiredRate, setShowRequiredRate] = useState(false);
    const [showRequiredGraph, setShowRequiredGraph] = useState(false);
    const insightIndex = isPreview && typeof subStep === 'string' && subStep.startsWith('insight-') ? parseInt(subStep.split('-')[1]) : 0;
    const [activeInsightSlide, setActiveInsightSlide] = useState<number>(isNaN(insightIndex) ? 0 : insightIndex);
    const gapCardRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (isPreview) return;
        setShowContent(true);
        // 段階的にコンテンツを表示
        const timers = [1, 2, 3, 4].map((step, index) =>
            setTimeout(() => {
                setShowStep(step);
                onSubStepChange?.(step);
            }, (index + 1) * 800)
        );
        return () => timers.forEach(clearTimeout);
    }, [isPreview, onSubStepChange]);

    // 預金結果が表示されたら、段階的にストーリーを展開する演出
    useEffect(() => {
        if (showSavingsResult) {
            // 2.5秒後に「不足金額（Reality Check）」を表示
            const gapTimer = setTimeout(() => {
                setShowGapCard(true);
            }, 2500);

            return () => {
                clearTimeout(gapTimer);
            };
        }
    }, [showSavingsResult]);

    // Sync from prop (for preview mode)
    useEffect(() => {
        if (isPreview && typeof subStep === 'number' && subStep !== showStep) {
            setShowStep(subStep);
        }
    }, [subStep, isPreview, showStep]);



    // 不足金額が表示されたときに強制スクロール
    useEffect(() => {
        if (showGapCard && gapCardRef.current && !isPreview) {
            gapCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [showGapCard, isPreview]);

    // 全ての演出を一括スキップする
    const handleSkipAnimation = () => {
        setShowStep(4);
        setShowSavingsResult(true);
        setShowGapCard(true);
        setShowSecondHalf(true);
        onSubStepChange?.(4);
    };

    const {
        savingsEndValue = 0,
        trustEndValue = 0,
        stocksEndValue = 0,
        gfsEndValue = 0,
        gfsAnnualRate = 0,
        requiredAnnualRate = 0,
        gap = 0,
        isGapNegative = false,
        chartData = [],
        fullChartData = [],
        achievedYear = null
    } = simulationResult || {};

    const timeToGoal = achievedYear !== null ? achievedYear : userData.targetPeriod;
    const timeSaved = userData.targetPeriod - timeToGoal;

    const investmentSteps = [
        {
            title: "ゴールを決める",
            description: "まずは何のために投資するか明確にする",
            icon: Target,
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "体系的に学ぶ",
            description: "断片的ではなく、基礎から順序立てて学ぶ",
            icon: Lightbulb,
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "少額から始める",
            description: "数百円から購入可能。リスクを抑えてスタート",
            icon: PiggyBank,
            color: "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
            {/* GFSロゴ */}
            <div className={`absolute top-8 left-8 z-30 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
                <div className="flex items-center gap-3">
                    <Image src="/images/gfs_logo_navy.png" alt="GFS" width={80} height={80} className="object-contain" />
                </div>
            </div>

            {/* 背景のマスコット画像 */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/mascot/mascot_search.png"
                    alt=""
                    width={220}
                    height={220}
                    className="absolute -top-10 -right-10 opacity-20 animate-float-slow"
                />
                <Image
                    src="/mascot/mascot_cheer_pink.png"
                    alt=""
                    width={180}
                    height={180}
                    className="absolute bottom-20 -left-10 opacity-20 animate-float-delayed"
                />
            </div>

            <div className="relative z-10 min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* セクションヘッダー */}
                    <div className={`text-center mb-8 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="text-blue-200 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                戻る
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onGoToAgenda}
                                className="text-blue-200 hover:text-white transition-colors"
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                目次
                            </Button>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/10 backdrop-blur rounded-full mb-4 ring-1 ring-slate-900/5">
                            <span className="text-amber-600 font-bold">Section 02</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-slate-900">{userData.name || "あなた"}様の未来予想図</span>
                            {!showSecondHalf && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); handleSkipAnimation(); }}
                                    title="演出をスキップ"
                                    className="ml-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white hover:bg-black transition-all duration-300 shadow-lg ring-2 ring-white"
                                >
                                    <span className="text-[10px] font-black tracking-tighter">SKIP</span>
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-950 mb-6 tracking-tight leading-tight whitespace-nowrap">
                            {userData.name}様の予測資産シミュレーション
                        </h1>
                        <p className="text-lg text-slate-600 font-bold max-w-2xl mx-auto leading-relaxed">
                            「{userData.investmentGoal}」という目標に向けた<br />
                            資産形成のシミュレーション結果
                        </p>
                    </div>


                    {/* 預金ルート：現実の直視 */}
                    <div className={`mb-20 transition-all duration-700 ${showStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Reality Check: Step 01</span>
                            <div className="h-px flex-1 bg-slate-200"></div>
                        </div>

                        {/* 必要年利の表示カード */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <Card className="border-0 shadow-lg bg-white p-6 border-t-4 border-blue-500">
                                <p className="text-sm font-bold text-slate-400 mb-2">目標金額</p>
                                <p className="text-3xl font-black text-blue-900">{formatManYen(userData.targetAmount)}</p>
                            </Card>
                            <Card className="border-0 shadow-lg bg-white p-6 border-t-4 border-slate-500">
                                <p className="text-sm font-bold text-slate-400 mb-2">目標期間</p>
                                <p className="text-3xl font-black text-slate-700">{userData.targetPeriod}年間</p>
                            </Card>
                        </div>

                        {/* 預金のみの結果を表示するボタン（非表示時） */}
                        {!showSavingsResult && (
                            <div className="flex flex-col items-center gap-6 py-12 animate-bounce-gentle">
                                <p className="text-slate-500 font-black text-lg tracking-widest uppercase italic">もしも...</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setShowSavingsResult(true); }}
                                    className="group relative px-12 py-6 flex items-center justify-center bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-400 hover:shadow-[0_30px_70px_rgba(71,85,105,0.3)] hover:border-slate-300 transition-all duration-500 transform hover:scale-105 active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                                    <span className="text-white font-black text-xl tracking-wide relative z-10">預金を{userData.targetPeriod}年間続けた場合</span>
                                    <ArrowRight className="ml-3 w-6 h-6 text-white group-hover:translate-x-2 transition-all duration-500 relative z-10" />
                                    <div className="absolute -inset-2 bg-slate-400/20 rounded-2xl animate-ping-slow"></div>
                                </button>
                            </div>
                        )}

                        {/* 預金のみの運用結果カード（表示時） */}
                        {showSavingsResult && (
                            <div className="animate-fade-in-up">
                                <Card className="border-0 shadow-xl overflow-hidden bg-slate-50 mb-8 border-l-8 border-slate-400">
                                    <div className="p-8 md:flex items-center justify-between gap-10">
                                        <div className="mb-6 md:mb-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <PiggyBank className="w-8 h-8 text-slate-400" />
                                                <h3 className="text-2xl font-black text-slate-700">預金のみで運用を続けた場合</h3>
                                            </div>
                                            <p className="text-slate-500 leading-relaxed font-medium">
                                                超低金利の環境では、預金だけでは資産は増えていきません。<br className="hidden md:block" />
                                                むしろ物価上昇(インフレ)によって、お金の価値が目減りするリスクがあります。
                                            </p>
                                        </div>
                                        <div className="text-center md:text-right bg-white p-6 rounded-2xl shadow-inner border border-slate-100 min-w-[280px]">
                                            <p className="text-xs font-bold text-slate-400 mb-1">{userData.targetPeriod}年後の予測資産額</p>
                                            <p className="text-5xl font-black text-slate-600 tracking-tighter">
                                                {formatManYen(savingsEndValue)}
                                            </p>
                                            <div className="mt-4 flex items-center justify-center md:justify-end gap-2 text-red-500 font-bold text-sm">
                                                <TrendingDown className="w-4 h-4" />
                                                <span>目標を達成するには不十分です</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* 不足額の強調：危機感のピーク */}
                    {isGapNegative && showGapCard && (
                        <div className="mb-12 animate-scale-in-bounce" ref={gapCardRef}>
                            <div className="animate-shake">
                                <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
                                    {/* 背景装飾 */}
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <AlertTriangle className="w-48 h-48 -mr-10 -mt-10" />
                                    </div>
                                    <CardContent className="py-12 px-6 md:px-12 relative z-10">
                                        <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
                                            <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left flex-1">
                                                <div className="p-8 bg-white rounded-[2rem] shadow-2xl animate-pulse shrink-0">
                                                    <AlertTriangle className="w-16 h-16 text-red-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xl md:text-2xl font-black mb-3 tracking-tight">預金を続けた場合の目標に対する不足金額</p>
                                                    <p className="text-red-100/80 text-base leading-relaxed font-medium">
                                                        「{userData.investmentGoal}」の実現において、<br />
                                                        預金ルートでは以下の資金ギャップが生じます。
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-center md:text-right bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border border-white/20 min-w-fit">
                                                <p className="text-5xl md:text-7xl font-black text-white mb-1 tracking-tighter drop-shadow-xl whitespace-nowrap leading-none py-2">
                                                    {formatManYen(gap)}
                                                </p>
                                                <p className="text-red-100 font-bold text-xl opacity-80 italic tracking-widest">FUNDING GAP</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    {/* マスコット：深刻 */}
                                    <div className="absolute -bottom-4 left-4 pointer-events-none opacity-40">
                                        <Image src="/mascot/mascot_search.png" alt="" width={150} height={150} />
                                    </div>
                                </Card>
                            </div>

                            {/* スタイリッシュな展開ボタン */}
                            {!showSecondHalf && (
                                <div className="mt-16 flex flex-col items-center gap-8 animate-fade-in-scale-luxury">
                                    <p className="text-slate-500 font-black text-xl tracking-widest uppercase italic">Solution is here</p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setShowSecondHalf(true); }}
                                        className="group relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 hover:shadow-[0_30px_70px_rgba(59,130,246,0.2)] hover:border-blue-200 transition-all duration-500 transform hover:scale-110 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
                                        <ArrowRight className="w-12 h-12 text-blue-600 group-hover:translate-y-2 group-hover:rotate-90 transition-all duration-500 rotate-90" />
                                        <div className="absolute -inset-4 bg-blue-400/10 rounded-full animate-ping-slow"></div>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 解決策セクション（条件付き表示） */}
                    <div className={`transition-all duration-1000 transform ${showSecondHalf ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none h-0 overflow-hidden"}`}>
                        <div className={`mb-20 transition-all duration-700 ${showSecondHalf ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-px flex-1 bg-amber-200"></div>
                                <span className="text-xs font-black text-amber-500 uppercase tracking-widest italic">The Solution: Step 02</span>
                                <div className="h-px flex-1 bg-amber-200"></div>
                            </div>

                            <Card className="border-0 shadow-2xl overflow-hidden ring-4 ring-amber-400 bg-white relative">
                                <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl bg-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(251,189,35,0.4)] transform rotate-3">
                                            <TrendingUp className="w-10 h-10 text-blue-950" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md whitespace-nowrap">{(userData.name || "あなた")}様が投資(20％)で運用した場合の資産予測</h3>
                                            <p className="text-blue-100 font-bold text-lg mt-2 opacity-90">複利の力を最大限に活かした、理想的な資産推移のシミュレーション</p>
                                        </div>
                                        <div className="ml-auto hidden md:block">
                                            <Image src="/mascot/mascot_cheer_pink.png" alt="" width={100} height={100} className="animate-float-slow" />
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-12">
                                    <div className="text-center relative">
                                        {/* 背景の装飾演出 */}
                                        <div className="absolute -left-12 -top-12 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-left-8 duration-1000 z-20">
                                            <div className="bg-white/90 backdrop-blur shadow-2xl border border-blue-100 rounded-2xl p-4 min-w-[160px] transform transition-transform cursor-default ring-4 ring-blue-500/20 relative">
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Time to Goal</p>
                                                <p className="text-4xl font-black text-slate-900 leading-none">
                                                    {timeToGoal}<span className="text-sm ml-1">年</span>
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">目標達成までの期間</p>

                                                {/* 短縮期間のバッジ */}
                                                {timeSaved > 0 && (
                                                    <div className="absolute left-[85%] -top-6 bg-amber-400 text-blue-950 font-black px-3 py-1 rounded-xl text-sm shadow-2xl animate-float whitespace-nowrap z-30 ring-4 ring-white">
                                                        -{timeSaved}年 短縮！
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full"></div>

                                        <p className="text-xl font-black text-slate-400 mb-8 uppercase tracking-[0.3em] italic">Projected Assets at 20% Yield</p>
                                        <div className="relative inline-block mb-10">
                                            <p className="text-7xl sm:text-9xl md:text-[11rem] font-black bg-gradient-to-br from-blue-900 via-blue-800 to-amber-600 bg-clip-text text-transparent tracking-tighter py-4 leading-none">
                                                {formatManYen(gfsEndValue)}
                                            </p>
                                            <div className="absolute -top-6 -right-20 bg-amber-400 text-blue-950 font-black px-6 py-2 rounded-2xl text-xl shadow-2xl animate-float whitespace-nowrap">
                                                預金に比べて+{formatManYen(gfsEndValue - savingsEndValue)}増える！
                                            </div>
                                        </div>


                                        <div className="mt-8 text-center">
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-2xl mx-auto opacity-70">
                                                ※本シミュレーションは独自の分析手法に基づき、資産運用の最適化を行った場合の論理的数値を算出しています。<br />
                                                過去の実績データをベースにしていますが、将来の成果を保証するものではありません。
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mt-12 group">
                                <Card className="border-0 shadow-2xl bg-slate-950 p-10 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full"></div>

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h4 className="text-white font-black text-xl flex items-center gap-3">
                                            <TrendingUp className="text-amber-400 w-6 h-6" />
                                            目標達成までの資産推移グラフ
                                        </h4>
                                        <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Compound Interest Effect</span>
                                    </div>

                                    <div className="h-[400px] md:h-[550px] relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorGfsGolden" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FBBD23" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#FBBD23" stopOpacity={0.1} />
                                                    </linearGradient>
                                                    <linearGradient id="colorTrust" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                                                    </linearGradient>
                                                    <filter id="shadow" height="200%">
                                                        <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
                                                        <feOffset in="blur" dx="0" dy="12" result="offsetBlur" />
                                                        <feMerge>
                                                            <feMergeNode />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" opacity={0.3} />
                                                <XAxis dataKey="year" tickFormatter={(v) => `${v}年`} stroke="#475569" fontSize={12} tick={{ fill: '#64748B' }} />
                                                <YAxis
                                                    domain={[0, userData.targetAmount / 0.8]}
                                                    allowDataOverflow={true}
                                                    tickFormatter={(v) => `${(v / 10000).toLocaleString()}万`}
                                                    stroke="#475569"
                                                    fontSize={12}
                                                    tick={{ fill: '#64748B' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ fontWeight: 'black', fontSize: '1rem' }}
                                                    labelStyle={{ color: '#94A3B8', marginBottom: '0.75rem', fontWeight: 'bold' }}
                                                    formatter={(v: any, name?: string) => {
                                                        const labelMap: Record<string, string> = {
                                                            gfs: `投資を行った場合 (${formatPercent(gfsAnnualRate)})`,
                                                            savings: '預金のみ (0.2%)'
                                                        };
                                                        return [`${(v / 10000).toLocaleString()}万円`, labelMap[name as string] || name];
                                                    }}
                                                    labelFormatter={(l) => `${l}年目`}
                                                />
                                                <Area
                                                    name="投資を行った場合"
                                                    type="monotone"
                                                    dataKey="gfs"
                                                    stroke="#FBBD23"
                                                    strokeWidth={5}
                                                    fill="transparent"
                                                    animationDuration={3000}
                                                    filter="url(#shadow)"
                                                />
                                                <Area
                                                    name="savings"
                                                    type="monotone"
                                                    dataKey="savings"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    fill="transparent"
                                                    strokeDasharray="8 4"
                                                />
                                                <ReferenceLine y={userData.targetAmount} stroke="#94A3B8" strokeWidth={1} strokeDasharray="12 6" label={{ value: "TARGET GOAL", position: "top", fill: "#94A3B8", fontWeight: "900", letterSpacing: "3px", fontSize: "14px" }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-12 flex flex-wrap justify-center gap-8 relative z-10 border-t border-slate-700/50 pt-10">
                                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-amber-400/20">
                                            <div className="w-4 h-4 bg-amber-400 rounded shadow-[0_0_15px_rgba(251,189,35,0.6)]"></div>
                                            <span className="text-amber-100 font-bold text-sm">投資を行った場合 ({formatPercent(gfsAnnualRate)})</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                                            <div className="w-4 h-1 border-t-2 border-red-500 border-dashed"></div>
                                            <span className="text-red-500 font-bold text-sm">預金 (0.2%)</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* 将来の資産形成についてのメッセージ */}
                            <div className="mt-24 mb-16 text-center max-w-4xl mx-auto px-4">
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                                    将来の資産形成において、一番の武器は<br className="hidden md:block" />
                                    『正しい知識』と『時間』の活用です。
                                </h2>
                                <p className="text-xl text-slate-600 font-medium leading-relaxed">
                                    お金を預けるだけの時代は終わり、自分自身で賢く運用する力が求められています。<br className="hidden md:block" />
                                    投資は難しいものではなく、正しく学べば誰にでも武器になります。
                                </p>
                            </div>

                            {/* カスタムインサイトスライドセクション */}
                            <div className="mb-20 max-w-5xl mx-auto px-4">
                                <Card className="border-0 shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white h-[750px] flex flex-col">
                                    <div className="flex-1 p-8 md:p-12 flex flex-col h-full overflow-hidden">
                                        {/* スライド共通ヘッダー - スライド1のみ表示 */}
                                        {activeInsightSlide === 0 && (
                                            <div className="flex justify-between items-start mb-8 border-b-2 border-blue-900 pb-4 shrink-0">
                                                <h3 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight flex-1">
                                                    投資で年利20%は難しい？
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center p-1.5">
                                                        <Sparkles className="text-white w-full h-full" />
                                                    </div>
                                                    <span className="font-black text-blue-900 text-xl tracking-tighter">GFS</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* スライドメイン（スクロール可能エリア） */}
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-6 relative group/insight-container">
                                            {/* スライド内部のナビゲーション矢印 (ホバー時のみ表示) */}
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 w-20 z-40 flex items-center justify-start pl-4 cursor-pointer group/nav-left transition-opacity duration-300 ${activeInsightSlide === 0 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/insight-container:opacity-100"}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const newSlide = Math.max(0, activeInsightSlide - 1);
                                                    setActiveInsightSlide(newSlide);
                                                    onSubStepChange?.(`insight-${newSlide}`);
                                                }}
                                            >
                                                <div className="p-3 bg-white/40 rounded-full backdrop-blur-md border border-white/30 shadow-xl group-hover/nav-left:translate-x-1 transition-all">
                                                    <ChevronLeft className="w-6 h-6 text-blue-900" />
                                                </div>
                                            </div>

                                            <div
                                                className={`absolute right-0 top-0 bottom-0 w-20 z-40 flex items-center justify-end pr-4 cursor-pointer group/nav-right transition-opacity duration-300 ${activeInsightSlide === 4 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/insight-container:opacity-100"}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const newSlide = Math.min(4, activeInsightSlide + 1);
                                                    setActiveInsightSlide(newSlide);
                                                    onSubStepChange?.(`insight-${newSlide}`);
                                                }}
                                            >
                                                <div className="p-3 bg-white/40 rounded-full backdrop-blur-md border border-white/30 shadow-xl group-hover/nav-right:-translate-x-1 transition-all">
                                                    <ChevronRight className="w-6 h-6 text-blue-900" />
                                                </div>
                                            </div>

                                            {activeInsightSlide === 0 ? (
                                                <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-12">
                                                    <div className="text-center">
                                                        <h4 className="text-2xl md:text-4xl font-black text-blue-950 mb-3">
                                                            1年間で年利20%以上となった銘柄数
                                                        </h4>
                                                    </div>

                                                    <div className="max-w-4xl mx-auto w-full py-12 space-y-10">
                                                        {/* 2025年データ */}
                                                        <div className="relative flex flex-col md:flex-row items-center justify-start gap-4 md:gap-8 px-4 py-8">
                                                            <div className="bg-[#0a2357] text-white px-6 py-2 rounded-sm font-black text-xl md:text-3xl shrink-0 tracking-tighter">
                                                                2025年
                                                            </div>
                                                            <div className="flex items-baseline flex-nowrap gap-1 md:gap-2">
                                                                <span className="text-5xl md:text-7xl font-black text-[#0a2357] tracking-tighter">1,600</span>
                                                                <span className="text-lg md:text-xl font-black text-[#0a2357] mr-1">銘柄</span>
                                                                <div className="h-12 md:h-16 w-[2px] bg-slate-400 rotate-[25deg] mx-2 md:mx-6"></div>
                                                                <span className="text-xs md:text-base font-bold text-[#0a2357] self-center mr-1">約</span>
                                                                <span className="text-4xl md:text-6xl font-black text-[#0a2357] tracking-tighter">4,000</span>
                                                                <span className="text-lg md:text-xl font-black text-[#0a2357]">銘柄</span>
                                                            </div>
                                                            <div className="md:absolute md:-top-6 md:right-0 bg-[#5d8233] text-white px-6 py-2 rounded-xl text-xl md:text-3xl font-black shadow-lg animate-bounce-gentle">
                                                                約2.5社に1社！
                                                            </div>
                                                        </div>

                                                        {/* 注釈 */}
                                                        <div className="text-right text-[#0a2357] text-sm md:text-lg font-bold pr-4 mt-12 opacity-80">
                                                            ※上記は2025年1月1日と12月31日を比較した結果
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : activeInsightSlide === 1 ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 min-h-[400px]">
                                                    <img src="/case-studies/slide2.png" alt="LINEヤフー 事例" className="max-w-full max-h-full object-contain rounded-2xl shadow-xl flex-1" />
                                                </div>
                                            ) : activeInsightSlide === 2 ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 min-h-[400px]">
                                                    <img src="/case-studies/slide3.png" alt="サンリオ 事例" className="max-w-full max-h-full object-contain rounded-2xl shadow-xl flex-1" />
                                                </div>
                                            ) : activeInsightSlide === 3 ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 min-h-[400px]">
                                                    <img src="/case-studies/slide4.png" alt="スシロー 事例" className="max-w-full max-h-full object-contain rounded-2xl shadow-xl flex-1" />
                                                </div>
                                            ) : activeInsightSlide === 4 ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center p-4 min-h-[400px]">
                                                    <img src="/case-studies/slide5.png" alt="良品計画 事例" className="max-w-full max-h-full object-contain rounded-2xl shadow-xl flex-1" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                                    <Sparkles className="w-12 h-12 text-blue-900/20 mb-4" />
                                                    <h3 className="text-2xl font-black text-slate-300">スライド準備中</h3>
                                                </div>
                                            )}
                                        </div>

                                        {/* スライド共通フッター */}
                                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                                            {activeInsightSlide === 0 ? (
                                                <p className="text-blue-900 font-bold text-sm md:text-base italic opacity-70">
                                                    ※上記は各年の1月1日と12月31日を比較した結果
                                                </p>
                                            ) : (
                                                <div className="flex-1"></div>
                                            )}
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-2 mr-4">
                                                    {[0, 1, 2, 3, 4].map(i => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setActiveInsightSlide(i);
                                                                onSubStepChange?.(`insight-${i}`);
                                                            }}
                                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeInsightSlide === i ? "bg-blue-900 w-8" : "bg-slate-200 hover:bg-slate-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={activeInsightSlide === 0}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newSlide = Math.max(0, activeInsightSlide - 1);
                                                            setActiveInsightSlide(newSlide);
                                                            onSubStepChange?.(`insight-${newSlide}`);
                                                        }}
                                                        className="rounded-full border-2 border-slate-200 text-slate-400 hover:text-blue-900 hover:border-blue-900 transition-all p-0 w-12 h-12 shadow-sm"
                                                    >
                                                        <ChevronLeft className="w-6 h-6" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={activeInsightSlide === 4}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newSlide = Math.min(4, activeInsightSlide + 1);
                                                            setActiveInsightSlide(newSlide);
                                                            onSubStepChange?.(`insight-${newSlide}`);
                                                        }}
                                                        className="rounded-full border-2 border-blue-900 text-blue-900 bg-white hover:bg-blue-50 shadow-lg shadow-blue-900/10 transition-all font-black p-0 w-12 h-12"
                                                    >
                                                        <ArrowRight className="w-6 h-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* 独立した必要利回りセクション */}
                        <div className="mb-12 text-center">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 rounded-full border border-blue-100 mb-8 shadow-sm">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="text-blue-900 font-black tracking-widest uppercase text-sm">Vital Condition</span>
                            </div>

                            <div className="max-w-4xl mx-auto px-4">
                                {!showRequiredRate ? (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); setShowRequiredRate(true); }}
                                        className="w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 md:p-16 rounded-[4rem] border-8 border-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.4)] relative overflow-hidden group transition-all hover:scale-[1.01] hover:shadow-[0_50px_100px_-20px_rgba(30,58,138,0.5)] active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10">
                                            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-blue-500/30 animate-pulse">
                                                <LockIcon className="w-10 h-10 text-blue-400" />
                                            </div>
                                            <p className="text-blue-100 font-black text-2xl tracking-[0.05em] mb-2 drop-shadow-lg">
                                                {userData.name}様の目標達成のための実際の利回りとは？
                                            </p>
                                            <div className="flex items-center justify-center gap-2 text-blue-400/80 font-bold uppercase tracking-widest text-xs">
                                                <Sparkles className="w-4 h-4" />
                                                <span>Reveal Required Annual Rate</span>
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 p-12 md:p-16 rounded-[4rem] border-8 border-white shadow-[0_40px_80px_-20px_rgba(30,58,138,0.4)] relative overflow-hidden animate-in zoom-in-95 fade-in duration-700">
                                        {/* 装飾用背景 */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/mascot/mascot_search.png')] bg-no-repeat bg-[length:300px] opacity-[0.03] -rotate-12 translate-x-[-10%] translate-y-[20%]"></div>
                                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                                        <div className="relative z-10">
                                            <p className="text-blue-100 font-bold mb-6 text-xl tracking-wider">Required Rate</p>
                                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                                                <p className="text-8xl md:text-[11rem] font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                                                    {formatPercent(requiredAnnualRate)}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                                <span className="text-white text-xl md:text-2xl font-black">{userData.name}様の目標達成に必要な利回り</span>
                                            </div>
                                        </div>

                                        {/* インパクトのある光の演出 */}
                                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/20 blur-[100px] rounded-full"></div>
                                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-400/20 blur-[100px] rounded-full"></div>
                                    </div>
                                )}

                                <p className="mt-8 text-slate-500 font-bold text-lg leading-relaxed">
                                    この利回りを確保することが、ゴールへの最短ルートとなります。<br className="hidden md:block" />
                                    学びと実践によって、この数字を「確かな現実」へと変えていきましょう。
                                </p>
                            </div>
                        </div>


                        {!showRequiredGraph ? (
                            <div className="mt-12 flex justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setShowRequiredGraph(true); }}
                                    className="w-full bg-slate-950 p-12 md:p-16 rounded-[4rem] border-4 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group transition-all hover:scale-[1.01] active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                                    <div className="relative z-10 flex flex-col items-center gap-6">
                                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center ring-4 ring-blue-500/40 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                                            <BarChart3 className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <p className="text-blue-100 font-black text-2xl tracking-[0.2em] drop-shadow-lg">
                                            グラフで表示
                                        </p>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-12 group animate-in zoom-in-95 fade-in duration-700">
                                <Card className="border-0 shadow-2xl bg-slate-950 p-10 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <h4 className="text-white font-black text-xl flex items-center gap-3">
                                            <Target className="text-blue-400 w-6 h-6" />
                                            {userData.name}様に必要な利回りでの資産推移グラフ
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setShowRequiredGraph(false); }}
                                            className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors uppercase tracking-widest border border-slate-700"
                                        >
                                            CLOSE
                                        </button>
                                    </div>

                                    <div className="h-[400px] md:h-[550px] relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={fullChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                                    </linearGradient>
                                                    <linearGradient id="colorGfsGolden" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FBBD23" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#FBBD23" stopOpacity={0.0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" opacity={0.3} />
                                                <XAxis dataKey="year" tickFormatter={(v) => `${v}年`} stroke="#475569" fontSize={12} tick={{ fill: '#64748B' }} />
                                                <YAxis
                                                    domain={[0, userData.targetAmount / 0.8]}
                                                    allowDataOverflow={true}
                                                    tickFormatter={(v) => `${(v / 10000).toLocaleString()}万`}
                                                    stroke="#475569"
                                                    fontSize={12}
                                                    tick={{ fill: '#64748B' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                                    itemStyle={{ fontWeight: 'black', fontSize: '1rem' }}
                                                    labelStyle={{ color: '#94A3B8', marginBottom: '0.75rem', fontWeight: 'bold' }}
                                                    formatter={(v: any, name?: string) => {
                                                        const labelMap: Record<string, string> = {
                                                            required: `目標達成に必要な年利 (${formatPercent(requiredAnnualRate)})`,
                                                            gfs: '20%で投資を運用した場合',
                                                            savings: '預金 (0.2%)'
                                                        };
                                                        return [`${(v / 10000).toLocaleString()}万円`, labelMap[name as string] || name];
                                                    }}
                                                    labelFormatter={(l) => `${l}年目`}
                                                />
                                                <Area
                                                    name="required"
                                                    type="monotone"
                                                    dataKey="required"
                                                    stroke="#3B82F6"
                                                    strokeWidth={5}
                                                    fill="transparent"
                                                    animationDuration={3000}
                                                />
                                                <Area
                                                    name="gfs"
                                                    type="monotone"
                                                    dataKey="gfs"
                                                    stroke="#FBBD23"
                                                    strokeWidth={2}
                                                    fill="url(#colorGfsGolden)"
                                                    fillOpacity={0.6}
                                                    animationDuration={2500}
                                                />
                                                <Area
                                                    name="savings"
                                                    type="monotone"
                                                    dataKey="savings"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    fill="transparent"
                                                    strokeDasharray="8 4"
                                                />
                                                <ReferenceLine y={userData.targetAmount} stroke="#94A3B8" strokeWidth={1} strokeDasharray="12 6" label={{ value: "TARGET GOAL", position: "top", fill: "#94A3B8", fontWeight: "900", letterSpacing: "3px", fontSize: "14px" }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="mt-12 flex flex-wrap justify-center gap-8 relative z-10 border-t border-slate-700/50 pt-10">
                                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-blue-400/20">
                                            <div className="w-4 h-4 bg-blue-500 rounded shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                                            <span className="text-blue-100 font-bold text-sm">目標達成に必要な年利 ({formatPercent(requiredAnnualRate)})</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-amber-400/20">
                                            <div className="w-4 h-4 bg-amber-400 rounded shadow-[0_0_15px_rgba(251,189,35,0.6)]"></div>
                                            <span className="text-amber-100 font-bold text-sm">20%で投資を運用した場合</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                                            <div className="w-4 h-1 border-t-2 border-red-500 border-dashed"></div>
                                            <span className="text-red-500 font-bold text-sm">預金 (0.2%)</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        <div className={`mt-24 transition-all duration-1000 ${showSecondHalf ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>


                            <Card className="border-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-white text-slate-800 mb-16 overflow-hidden rounded-[3rem]">
                                <CardContent className="py-20 px-10 relative">
                                    {/* マスコット：不安・考え中 */}
                                    <div className="absolute top-0 left-0 hidden lg:block p-8 transform -translate-x-4 -translate-y-1 opacity-30">
                                        <Image src="/mascot/mascot_thinking.png" alt="" width={200} height={200} className="animate-float-slow" />
                                    </div>

                                    {/* マスコット：応援 */}
                                    <div className="absolute bottom-0 right-0 hidden lg:block p-8 transform translate-x-4 translate-y-8 opacity-30">
                                        <Image src="/mascot/mascot_happy.png" alt="" width={220} height={220} className="animate-float-slow" />
                                    </div>

                                    <div className="text-center relative z-10">
                                        <div className="inline-flex items-center justify-center p-5 bg-green-50 rounded-3xl mb-8">
                                            <CheckCircle className="w-14 h-14 text-green-600 animate-bounce-gentle" />
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black mb-12 text-slate-950 leading-tight">
                                            「でも、具体的に何から始めればいいの？」<br />
                                            「どうやって失敗せずに済むの？」
                                        </h3>

                                        <Button
                                            onClick={onNext}
                                            size="lg"
                                            className="relative bg-blue-950 text-white hover:bg-black min-w-[420px] text-2xl h-20 rounded-full shadow-[0_20px_40px_-10px_rgba(0,40,100,0.3)] transform transition-all hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(0,40,100,0.4)] group overflow-hidden"
                                        >
                                            <span className="relative z-10">投資ができるようになる為には？</span>
                                            {/* 高級感を出すためのスイープ（シマー）エフェクト */}
                                            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
