"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Building2, BarChart3, Lightbulb, MessageCircle, FileText, ChevronRight } from "lucide-react";
import Image from "next/image";

import { UserInput, Phase } from "@/types";

interface AgendaProps {
    onStart?: () => void;
    onGoToPhase?: (phase: Phase) => void;
    userData: UserInput | null;
    isPreview?: boolean;
}

export default function Agenda({ onStart, onGoToPhase, userData, isPreview = false }: AgendaProps) {
    const [isVisible, setIsVisible] = useState(isPreview);

    useEffect(() => {
        if (!isPreview) setIsVisible(true);
    }, [isPreview]);

    const sections = [
        {
            id: "01",
            title: "簡単に弊社のご紹介",
            subtitle: "GFSについて",
            time: "約7分",
            icon: Building2,
            color: "from-blue-500 to-cyan-500",
            phase: "company" as Phase,
        },
        {
            id: "02",
            title: userData ? `${userData.name}様の未来予想図` : "あなたの目標を教えてください",
            subtitle: "理想のゴールを一緒に描きましょう",
            time: "約11分",
            icon: FileText,
            color: "from-emerald-500 to-teal-500",
            phase: "threeSteps" as Phase,
        },
        {
            id: "03",
            title: userData ? `${userData.name}様に合う投資` : "あなたに\"合う投資\"とは？",
            subtitle: "自分にピッタリな投資手段を考えよう",
            time: "約14分",
            icon: BarChart3,
            color: "from-purple-500 to-pink-500",
            phase: "solution" as Phase,
        },
        {
            id: "04",
            title: "投資の学びとは？GFSを使って一緒に見ていこう！",
            subtitle: "投資をできるようになろう！",
            time: "約18分",
            icon: Lightbulb,
            color: "from-amber-500 to-orange-500",
            phase: "closing" as Phase,
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
            {/* 背景のマスコット画像（薄く配置） */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/mascot/mascot_cheer_blue.png"
                    alt=""
                    width={180}
                    height={180}
                    className="absolute top-10 -left-10 opacity-15 animate-float-slow"
                />
                <Image
                    src="/mascot/mascot_happy.png"
                    alt=""
                    width={160}
                    height={160}
                    className="absolute top-1/3 -right-10 opacity-15 animate-float-delayed"
                />
                <Image
                    src="/mascot/mascot_search.png"
                    alt=""
                    width={140}
                    height={140}
                    className="absolute bottom-20 left-10 opacity-15 animate-bounce-gentle"
                />
                <Image
                    src="/mascot/mascot_phone.png"
                    alt=""
                    width={150}
                    height={150}
                    className="absolute -bottom-10 right-1/4 opacity-15 animate-float-slow"
                />
            </div>

            {/* 装飾的な背景要素 */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-20" />

            {/* メインコンテンツ */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
                {/* タイトル */}
                <div
                    className={`text-center mb-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-800 tracking-tight">
                            本日の流れ
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-2xl space-y-4 mb-12">
                    {sections.map((section, index) => {
                        const isSection02Branch = section.id === "02" && userData;

                        if (isSection02Branch) {
                            return (
                                <div
                                    key={section.id}
                                    className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
                                        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
                                    `}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    {/* ヘッダー部分 */}
                                    <div className="flex items-center p-5 pb-4 border-b border-gray-50">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shrink-0 shadow-md`}>
                                            <section.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1 ml-5">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-bold text-gray-400">Section {section.id}</span>
                                                <span className="text-sm text-gray-300">|</span>
                                                <span className="text-sm text-gray-400">{section.time}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {section.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* 分岐選択エリア */}
                                    <div className="flex divide-x divide-gray-100 bg-slate-50/30">
                                        <button
                                            onClick={() => onGoToPhase?.("hearing")}
                                            className="flex-1 p-6 hover:bg-white transition-all text-center group/btn relative"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            <p className="text-[11px] font-black text-slate-400 mb-1 tracking-widest uppercase">Redefine Goal</p>
                                            <p className="text-lg font-black text-slate-800 group-hover/btn:text-primary transition-colors">
                                                もう一度目標を教えてください
                                            </p>
                                        </button>
                                        <button
                                            onClick={() => onGoToPhase?.("simulation")}
                                            className="flex-1 p-6 hover:bg-white transition-all text-center group/btn relative"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                            <p className="text-[11px] font-black text-blue-500 mb-1 tracking-widest uppercase">Quick View</p>
                                            <p className="text-lg font-black text-slate-800 group-hover/btn:text-blue-600 transition-colors">
                                                シミュレーション結果を見る
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={section.id}
                                className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 overflow-hidden
                                    ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
                                `}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onClick={() => onGoToPhase?.(section.phase)}
                            >
                                <div className="flex items-center p-5">
                                    {/* 番号とアイコン */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                                        <section.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* テキスト */}
                                    <div className="flex-1 ml-5">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-gray-400">Section {section.id}</span>
                                            <span className="text-sm text-gray-300">|</span>
                                            <span className="text-sm text-gray-400">{section.time}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h3>
                                        <p className="text-base text-gray-500">{section.subtitle}</p>
                                    </div>

                                    {/* 矢印 */}
                                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 開始ボタン */}
                <div
                    className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <Button
                        onClick={onStart}
                        size="lg"
                        className="min-w-64 text-xl h-20 shadow-2xl hover:scale-105 transition-transform bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 font-black px-12"
                    >
                        GFSへようこそ！
                        <ArrowRight className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
