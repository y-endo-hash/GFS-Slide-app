"use client";

import { useState, useEffect } from "react";
import { UserInput } from "@/types";
import { toHalfWidth, formatJapaneseAmount, parseNumericInput } from "@/lib/simulation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { User, Calendar, Target, Clock, Wallet, Sparkles, ArrowRight, CheckCircle, ChevronLeft, FileText } from "lucide-react";
import Image from "next/image";

interface Phase1HearingProps {
    onSubmit: (data: UserInput) => void;
    onBack: () => void;
    onGoToAgenda: () => void;
}

export default function Phase1Hearing({ onSubmit, onBack, onGoToAgenda }: Phase1HearingProps) {
    const [step, setStep] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [formData, setFormData] = useState<UserInput>({
        name: "",
        age: 35,
        investmentGoal: "",
        targetAmount: 30000000,
        targetPeriod: 10,
        initialBudget: 1000000,
        monthlySavings: 30000,
        occupation: "",
        familyStructure: "",
        investmentExperience: [],
        experience: "未入力",
        knowledgeLevel: "初級",
        currentAssets: 1000000,
        monthlyInvestment: 30000,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});

    useEffect(() => {
        setShowContent(true);
    }, []);

    // ステップが切り替わったときにトップにスクロール
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const questions = [
        {
            title: "お名前を教えてください",
            subtitle: "本日はよろしくお願いいたします",
            icon: User,
        },
        {
            title: "基本的なプロフィールを教えてください",
            subtitle: "より具体的なアドバイスのためにご協力ください",
            icon: Target,
        },
        {
            title: "目標金額と期間を教えてください",
            subtitle: "具体的な数字があると計画が立てやすくなります",
            icon: Calendar,
        },
        {
            title: "現在の投資可能額を教えてください",
            subtitle: "無理のない金額からスタートすることが大切です",
            icon: Wallet,
        },
    ];

    const validateStep = (stepIndex: number): boolean => {
        const newErrors: Partial<Record<keyof UserInput, string>> = {};

        switch (stepIndex) {
            case 0:
                if (!formData.name.trim()) newErrors.name = "お名前を入力してください";
                break;
            case 1:
                if (formData.age < 18 || formData.age > 100) newErrors.age = "有効な年齢を入力してください";
                if (!formData.investmentGoal.trim()) newErrors.investmentGoal = "投資で達成したいことを入力してください";
                if (!formData.occupation?.trim()) newErrors.occupation = "職業を入力してください";
                break;
            case 2:
                if (formData.targetAmount < 100000) newErrors.targetAmount = "目標金額を入力してください";
                if (formData.targetPeriod < 1 || formData.targetPeriod > 100) newErrors.targetPeriod = "1〜100年の間で入力してください";
                break;
            case 3:
                if (formData.initialBudget < 0) newErrors.initialBudget = "有効な数値を入力してください";
                if (formData.monthlySavings < 0) newErrors.monthlySavings = "有効な数値を入力してください";
                if (formData.initialBudget === 0 && formData.monthlySavings === 0) {
                    newErrors.initialBudget = "初期予算または毎月の積立額のどちらかを入力してください";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            if (step < 3) {
                setStep(step + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const goalSuggestions = [
        "早めにFIREして自由に暮らしたい",
        "老後の資金問題を解決したい",
        "子供のために資金を準備したい",
        "マイホームを建てたい",
        "海外旅行に行きたい",
        "配当金で生活費を賄いたい",
    ];

    const renderStepContent = () => {
        const currentQuestion = questions[step];

        return (
            <div className="space-y-6">
                {/* ステップヘッダー */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white mb-4 animate-bounce-gentle shadow-xl">
                        <currentQuestion.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.title}</h2>
                    <p className="text-gray-500">{currentQuestion.subtitle}</p>
                </div>

                {/* フォームコンテンツ */}
                <div className="space-y-4">
                    {step === 0 && (
                        <div className="max-w-md mx-auto">
                            <Input
                                label="お名前"
                                placeholder="例：田中 太郎"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                className="text-lg py-4"
                            />
                        </div>
                    )}

                    {step === 1 && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="ご年齢"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="35"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: parseInt(toHalfWidth(e.target.value)) || 0 })}
                                    error={errors.age}
                                />
                                <Input
                                    label="職業"
                                    placeholder="例：会社員、公務員、経営者"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    error={errors.occupation}
                                />
                            </div>
                            <Input
                                label="家族構成"
                                placeholder="例：独身、既婚（子供1名）"
                                value={formData.familyStructure}
                                onChange={(e) => setFormData({ ...formData, familyStructure: e.target.value })}
                            />

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700">投資経験・興味（複数選択可）</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {["個別株", "投資信託", "NISA", "iDeCo", "仮想通貨", "FX", "不動産投資"].map((exp) => (
                                        <label key={exp} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${formData.investmentExperience?.includes(exp) ? "border-primary bg-blue-50 text-primary" : "border-slate-100 hover:border-slate-200"}`}>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.investmentExperience?.includes(exp)}
                                                onChange={(e) => {
                                                    const current = formData.investmentExperience || [];
                                                    let next: string[];
                                                    if (e.target.checked) {
                                                        next = [...current, exp];
                                                    } else {
                                                        next = current.filter(item => item !== exp);
                                                    }
                                                    setFormData({
                                                        ...formData,
                                                        investmentExperience: next,
                                                        experience: next.length > 0 ? next.join('・') : "未入力"
                                                    });
                                                }}
                                            />
                                            <span className="font-bold text-sm">{exp}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Input
                                    label="投資で利益が出たらやりたいこと"
                                    placeholder="例：50歳でFIREして世界一周旅行"
                                    value={formData.investmentGoal}
                                    onChange={(e) => setFormData({ ...formData, investmentGoal: e.target.value })}
                                    error={errors.investmentGoal}
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {goalSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, investmentGoal: suggestion })}
                                            className="text-xs px-3 py-1.5 bg-blue-50 text-primary rounded-full hover:bg-blue-100 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        label="目標金額（円）"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="30000000"
                                        value={formData.targetAmount ? formData.targetAmount.toLocaleString() : ""}
                                        onChange={(e) => setFormData({ ...formData, targetAmount: parseNumericInput(e.target.value) })}
                                        error={errors.targetAmount}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        ={" "}
                                        <span className="font-bold text-primary">
                                            {formatJapaneseAmount(formData.targetAmount)}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        label="達成期間（年）"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="10"
                                        value={formData.targetPeriod}
                                        onChange={(e) => setFormData({ ...formData, targetPeriod: parseInt(toHalfWidth(e.target.value)) || 0 })}
                                        error={errors.targetPeriod}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.age + formData.targetPeriod}歳のときに達成
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <Input
                                        label="現在出せる投資資金（円）"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="1000000"
                                        value={formData.initialBudget ? formData.initialBudget.toLocaleString() : ""}
                                        onChange={(e) => {
                                            const val = parseNumericInput(e.target.value);
                                            setFormData({ ...formData, initialBudget: val, currentAssets: val });
                                        }}
                                        error={errors.initialBudget}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        ={" "}
                                        <span className="font-bold text-primary">
                                            {formatJapaneseAmount(formData.initialBudget)}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <Input
                                        label="毎月の積立金額（円）"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="30000"
                                        value={formData.monthlySavings ? formData.monthlySavings.toLocaleString() : ""}
                                        onChange={(e) => {
                                            const val = parseNumericInput(e.target.value);
                                            setFormData({ ...formData, monthlySavings: val, monthlyInvestment: val });
                                        }}
                                        error={errors.monthlySavings}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        年間で{" "}
                                        <span className="font-bold text-primary">
                                            {formatJapaneseAmount(formData.monthlySavings * 12)}
                                        </span>
                                        の積立
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <p className="text-sm text-amber-800">
                                    💡 最初は月5,000円〜でも大丈夫です。スキルに応じて増やしていくのが成功のコツです
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
            {/* 背景のマスコット画像 */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/mascot/mascot_cheer_blue.png"
                    alt=""
                    width={200}
                    height={200}
                    className="absolute -top-10 -left-10 opacity-10 animate-float-slow"
                />
                <Image
                    src="/mascot/mascot_happy.png"
                    alt=""
                    width={180}
                    height={180}
                    className="absolute top-1/3 -right-10 opacity-10 animate-float-delayed"
                />
                <Image
                    src="/mascot/mascot_phone.png"
                    alt=""
                    width={150}
                    height={150}
                    className="absolute -bottom-10 left-1/4 opacity-10 animate-bounce-gentle"
                />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-3xl">
                    {/* セクションヘッダー */}
                    <div className={`text-center mb-6 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="flex justify-between items-center mb-4 max-w-3xl mx-auto">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
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
                            <span className="text-slate-900 font-medium">あなたのことを教えてください</span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <Card className={`border-0 shadow-2xl transition-all duration-700 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <CardHeader className="text-center pb-2">
                            {/* ステップインジケーター */}
                            <div className="flex justify-center gap-3 mb-6">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${i < step
                                                ? "bg-primary text-white"
                                                : i === step
                                                    ? "bg-primary text-white ring-4 ring-primary/30 animate-pulse"
                                                    : "bg-gray-200 text-gray-400"
                                                }`}
                                        >
                                            {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                                        </div>
                                        {i < 3 && (
                                            <div className={`w-12 h-1 rounded ${i < step ? "bg-primary" : "bg-gray-200"}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-8">
                            {renderStepContent()}

                            {/* ナビゲーションボタン */}
                            <div className="flex justify-between mt-8 max-w-md mx-auto">
                                {step > 0 && (
                                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                                        戻る
                                    </Button>
                                )}
                                <Button
                                    onClick={handleNext}
                                    className={`${step === 0 ? "w-full" : "flex-1 ml-4"} animate-pulse-border`}
                                >
                                    {step < 3 ? (
                                        <>
                                            次へ
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            分析を開始する
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 入力サマリー */}
                    {step > 0 && (
                        <div className={`mt-6 p-4 bg-white/60 backdrop-blur rounded-xl border border-white/40 shadow-sm transition-all duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}>
                            <p className="text-slate-900 text-sm leading-relaxed">
                                {formData.name && <span className="text-amber-600 font-bold">{formData.name}</span>}
                                {formData.name && "様 "}
                                {formData.age > 0 && <span className="font-medium">({formData.age}歳)</span>}
                                {formData.investmentGoal && (
                                    <span className="block mt-1 font-medium">
                                        目標: 「{formData.investmentGoal}」
                                        {formData.occupation && ` / 職業: ${formData.occupation}`}
                                        {formData.investmentExperience && formData.investmentExperience.length > 0 && ` / 経験: ${formData.investmentExperience.join('・')}`}
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
