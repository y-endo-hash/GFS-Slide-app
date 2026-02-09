"use client";

import { useEffect, useState } from "react";
import { UserInput, SimulationResult } from "@/types";
import { formatManYen } from "@/lib/simulation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    CheckCircle, Star, Crown, Sparkles, MessageCircle,
    ExternalLink, ThumbsUp, ThumbsDown, CreditCard,
    Shield, Zap, BookOpen, ChevronLeft, FileText, Map, ArrowRight
} from "lucide-react";
import Image from "next/image";

interface Phase5ClosingProps {
    userData: UserInput;
    simulationResult?: SimulationResult;
    onBack?: () => void;
    onGoToAgenda?: () => void;
    onSubStepChange?: (subStep: number | string) => void;
    subStep?: number | string;
    isPreview?: boolean;
}

export default function Phase5Closing({ userData, simulationResult, onBack, onGoToAgenda, onSubStepChange, subStep, isPreview = false }: Phase5ClosingProps) {
    const [interest, setInterest] = useState<"yes" | "no" | null>(null);
    const [showPlan, setShowPlan] = useState(false);
    const [showContent, setShowContent] = useState(isPreview);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(isPreview && typeof subStep === 'number' ? subStep : 0);

    useEffect(() => {
        if (!isPreview) setShowContent(true);
    }, [isPreview]);

    // Sync from prop (for preview mode)
    useEffect(() => {
        if (isPreview && typeof subStep === 'number' && subStep !== activeStep) {
            setActiveStep(subStep);
        }
    }, [subStep, isPreview, activeStep]);

    const handleInterest = (value: "yes" | "no") => {
        setInterest(value);
        if (value === "yes") {
            setShowPlan(true);
        }
    };

    const plans = [
        {
            name: "スタンダードプラン",
            icon: BookOpen,
            color: "from-blue-500 to-blue-600",
            normalPrice: "698,000円",
            specialPrice: "398,000円",
            features: [
                "全講義の視聴",
                "専任コンサルタントへの相談",
                "講師や投資仲間と交流できる掲示板",
            ],
        },
        {
            name: "ゴールドプラン",
            icon: Star,
            color: "from-amber-400 to-yellow-500",
            normalPrice: "1,058,000円",
            specialPrice: "578,000円",
            features: [
                "全講義の視聴",
                "専任コンサルタントへの相談",
                "相場分析力アップゼミ（ブンゼミ）",
                "銘柄分析ツール（GFSの眼）",
            ],
            highlight: false,
        },
        {
            name: "プラチナプラン",
            icon: Crown,
            color: "from-slate-600 to-slate-800",
            normalPrice: "1,498,000円",
            specialPrice: "908,000円",
            features: [
                "ゴールドプランの全機能",
                "個別株実践勉強ゼミ",
                "年利50%以上を目指す環境",
                "VIP限定のライブセミナー",
            ],
            highlight: true,
        },
    ];

    const paymentMethods = [
        {
            title: "一括払い",
            description: "最安値で入学できる。最初の投資資金に回せる",
            icon: Zap,
        },
        {
            title: "分割払い",
            description: "クレジットカードで後から分割可能",
            icon: CreditCard,
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
            {/* 背景のマスコット画像 */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/mascot/mascot_cheer_pink.png"
                    alt=""
                    width={220}
                    height={220}
                    className="absolute -top-10 -left-10 opacity-20 animate-float-slow"
                />
                <Image
                    src="/mascot/mascot_happy.png"
                    alt=""
                    width={200}
                    height={200}
                    className="absolute top-1/4 -right-10 opacity-20 animate-float-delayed"
                />
                <Image
                    src="/mascot/mascot_phone.png"
                    alt=""
                    width={180}
                    height={180}
                    className="absolute -bottom-10 left-1/3 opacity-20 animate-bounce-gentle"
                />
            </div>

            <div className="relative z-10 min-h-screen pt-20 pb-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {activeStep === 0 && (
                        <div className="w-full animate-in zoom-in fade-in duration-1000">
                            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2 pointer-events-none"></div>

                                <div className="flex justify-between items-center mb-8 w-full max-w-6xl mx-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onBack}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        戻る
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onGoToAgenda}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <FileText className="w-4 h-4 mr-1" />
                                        目次
                                    </Button>
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500/10 backdrop-blur rounded-full mb-8 ring-1 ring-blue-500/20">
                                        <span className="text-blue-400 font-bold">Section 04</span>
                                        <span className="text-white/20">/</span>
                                        <span className="text-blue-100 font-medium">投資の学びとは？</span>
                                    </div>


                                    <h3 className="text-2xl md:text-3xl font-black mb-12 leading-tight">
                                        <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent whitespace-nowrap">GFSを使って一緒に見ていこう！</span>
                                    </h3>

                                    <div className="max-w-2xl mx-auto mb-16 px-4">
                                        <a
                                            href="https://gfs.tokyo/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative block w-full overflow-hidden rounded-[2.5rem] bg-white p-[1px] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] shadow-xl"
                                        >
                                            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center justify-center border border-slate-100">
                                                <div className="flex items-center gap-6 mb-4">
                                                    <div className="w-24 h-24 flex items-center justify-center translate-y-1">
                                                        <Image src="/images/gfs_logo_navy.png" alt="GFS" width={100} height={100} className="object-contain" />
                                                    </div>
                                                    <div className="text-left border-l-2 border-blue-900/10 pl-6">
                                                        <p className="text-sm font-black text-blue-900/40 tracking-[0.4em] uppercase mb-2">Official Website</p>
                                                        <div className="text-2xl md:text-3xl font-black tracking-tight text-blue-900 flex flex-col leading-[1.1] gap-1">
                                                            <span>Global</span>
                                                            <span>Financial</span>
                                                            <span>School</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-900/10 to-transparent my-6"></div>
                                                <div className="flex items-center gap-3 text-blue-900/60 group-hover:text-blue-900 transition-colors font-bold">
                                                    <span className="text-lg tracking-wide">実際の学習環境を見にいく</span>
                                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                                </div>
                                            </div>
                                        </a>
                                    </div>

                                    <Button
                                        onClick={onGoToAgenda}
                                        className="bg-slate-950 text-blue-400 hover:bg-black font-black h-20 px-12 md:px-16 text-2xl rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-blue-900/30 group transition-all"
                                    >
                                        目次へ戻る
                                    </Button>

                                    <p className="mt-12 text-blue-400 font-black text-xl tracking-[0.3em] opacity-40 italic">Global Financial School</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                            {/* セクションヘッダー */}
                            <div className={`text-center mb-8 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveStep(0)}
                                        className="text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        戻る
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onGoToAgenda}
                                        className="text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 mr-1" />
                                        目次
                                    </Button>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 backdrop-blur rounded-full mb-4 ring-1 ring-slate-900/10">
                                    <span className="text-amber-600 font-bold">Section 04</span>
                                    <span className="text-slate-400">/</span>
                                    <span className="text-slate-900">あなた専用の投資戦略と今後のお話</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">
                                    {userData.name || "あなた"}様へのご提案
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    {userData?.investmentGoal ? `「${userData.investmentGoal}」を実現するための最後のステップ` : "理想の未来を実現するための最後のステップ"}
                                </p>
                            </div>

                            {/* サマリーカード */}
                            <Card className={`border-0 shadow-xl mb-8 bg-gradient-to-r from-primary to-blue-600 text-white transition-all duration-700 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <CardContent className="py-6">
                                    <div className="grid md:grid-cols-3 gap-6 text-center">
                                        <div>
                                            <p className="text-sm opacity-80 mb-1">目標</p>
                                            <p className="text-xl font-bold">{userData.investmentGoal || "理想の資産形成"}</p>
                                        </div>
                                        {simulationResult ? (
                                            <>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">{userData?.targetPeriod}年後の予測資産</p>
                                                    <p className="text-2xl font-bold">{formatManYen(simulationResult.gfsEndValue)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">預金との差額</p>
                                                    <p className="text-2xl font-bold text-amber-300">
                                                        +{formatManYen(simulationResult.gfsEndValue - simulationResult.savingsEndValue)}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">目標までの期間</p>
                                                    <p className="text-2xl font-bold">{userData.targetPeriod > 0 ? `${userData.targetPeriod}年` : "最短期間"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">最適な投資戦略</p>
                                                    <p className="text-2xl font-bold text-amber-300">GFSで構築</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 興味確認 */}
                            {!interest && (
                                <Card className={`border-0 shadow-xl mb-8 transition-all duration-700 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl">私たちのサービスに興味はありますか？</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pb-8">
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                                            <Button
                                                onClick={() => handleInterest("yes")}
                                                size="lg"
                                                className="flex-1 h-14 text-lg animate-pulse-border"
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                はい、興味があります
                                            </Button>
                                            <Button
                                                onClick={() => handleInterest("no")}
                                                size="lg"
                                                variant="outline"
                                                className="flex-1 h-14 text-lg bg-white"
                                            >
                                                <ThumbsDown className="w-5 h-5" />
                                                もう少し検討したい
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* プラン詳細（YESの場合） */}
                            {showPlan && (
                                <div className="animate-fade-in space-y-8">
                                    <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
                                        <Sparkles className="w-6 h-6 text-amber-400" />
                                        受講料について
                                    </h2>

                                    {/* プランカード */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {plans.map((plan, index) => (
                                            <Card
                                                key={index}
                                                className={`border-0 shadow-xl relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${plan.highlight ? "ring-2 ring-amber-400" : ""
                                                    } ${selectedPlan === plan.name ? "ring-4 ring-primary" : ""}`}
                                                onClick={() => setSelectedPlan(plan.name)}
                                            >
                                                {plan.highlight && (
                                                    <div className="absolute top-0 right-0 bg-amber-400 text-xs font-bold text-slate-900 px-3 py-1 rounded-bl-xl">
                                                        おすすめ
                                                    </div>
                                                )}
                                                <CardHeader className={`bg-gradient-to-r ${plan.color} text-white`}>
                                                    <div className="flex items-center gap-3">
                                                        <plan.icon className="w-8 h-8" />
                                                        <CardTitle className="text-lg text-white">{plan.name}</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-6">
                                                    <div className="text-center mb-4">
                                                        <p className="text-sm text-gray-400 line-through">{plan.normalPrice}</p>
                                                        <p className="text-3xl font-black text-primary">{plan.specialPrice}</p>
                                                        <p className="text-xs text-gray-500">税込・受講期間1年</p>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {plan.features.map((feature, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                                <span className="text-xs text-gray-700">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* 決済方法 */}
                                    <Card className="border-0 shadow-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5" />
                                                お支払い方法
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {paymentMethods.map((method, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                                                            <method.icon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{method.title}</h4>
                                                            <p className="text-sm text-gray-600">{method.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* 安心保証 */}
                                    <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-teal-50">
                                        <CardContent className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
                                                    <Shield className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg">安心の保証制度</h4>
                                                    <p className="text-gray-600">
                                                        入学後8日間であれば無条件にて全額返金保証を行っております
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* CTA */}
                                    <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-yellow-50">
                                        <CardContent className="py-8 text-center">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                                今すぐGFSで投資の学習を始めましょう
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                LINEでお気軽にご相談ください
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button size="lg" className="min-w-48 h-14 text-lg">
                                                    <MessageCircle className="w-5 h-5" />
                                                    LINEで相談する
                                                </Button>
                                                <Button size="lg" variant="outline" className="min-w-48 h-14 text-lg bg-white">
                                                    <ExternalLink className="w-5 h-5" />
                                                    公式サイトを見る
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* NOの場合 */}
                            {interest === "no" && (
                                <Card className="border-0 shadow-xl mb-8 animate-fade-in">
                                    <CardContent className="py-10 text-center">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                            <MessageCircle className="w-10 h-10 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                            ご検討いただきありがとうございます
                                        </h3>
                                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                            何かご不明点やご質問がございましたら、お気軽にご相談ください。
                                            <br />
                                            {userData.name}様の「{userData.investmentGoal}」の実現を心より応援しております。
                                        </p>
                                        <Button size="lg" className="min-w-48 h-14 text-lg">
                                            <MessageCircle className="w-5 h-5" />
                                            質問・相談する
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* フッター */}
                            <div className={`text-center mt-8 transition-all duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}>
                                <Button onClick={onBack} variant="ghost" className="text-blue-300">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    前の画面に戻る
                                </Button>
                                <p className="text-blue-200/50 text-sm mt-4">
                                    今日はありがとうございました
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
