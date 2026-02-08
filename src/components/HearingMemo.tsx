"use client";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { User, Target, Wallet, FileText, PenLine, Save, Check, Sparkles, ExternalLink, HelpCircle, ChevronRight, Maximize2 } from "lucide-react";
import { UserInput, SimulationResult } from "@/types";
import { formatPercent } from "@/lib/simulation";
import { cn } from "@/lib/utils";

interface HearingMemoProps {
    userData: UserInput | null;
    simulationResult: SimulationResult | null;
    isOpen: boolean;
    onToggle: () => void;
    memoText: string;
    onMemoChange: (text: string) => void;
    isHearingComplete: boolean;
}

export default function HearingMemo({
    userData,
    simulationResult,
    isOpen,
    onToggle,
    memoText,
    onMemoChange,
    isHearingComplete
}: HearingMemoProps) {
    const [activeTab, setActiveTab] = useState<"summary" | "memo">("memo");
    const [isRateVisible, setIsRateVisible] = useState(false);

    const openSupportWindow = () => {
        const params = new URLSearchParams({
            name: userData?.name || "",
            age: String(userData?.age || ""),
            occupation: userData?.occupation || "",
            familyStructure: userData?.familyStructure || "",
            investmentGoal: userData?.investmentGoal || "",
            experience: userData?.experience || "",
            knowledgeLevel: userData?.knowledgeLevel || "",
            currentAssets: String(userData?.currentAssets || 0),
            monthlyInvestment: String(userData?.monthlyInvestment || 0),
        });

        const width = 500;
        const height = 900;
        const left = 0;
        const top = 0;

        window.open(
            `/support-panel?${params.toString()}`,
            "GFSSupportPanel",
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,location=no,toolbar=no,menubar=no`
        );
    };

    const openPiPSupport = async () => {
        if (!('documentPictureInPicture' in window)) {
            alert("このブラウザはAlways-on-Topモードに対応していません。通常の別ウィンドウ表示をご利用ください。");
            openSupportWindow();
            return;
        }

        try {
            const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
                width: 500,
                height: 800,
            });

            // スタイルのコピー（より堅牢な方法）
            const allStyleSheets = Array.from(document.styleSheets);
            allStyleSheets.forEach((styleSheet) => {
                try {
                    if (styleSheet.href) {
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = styleSheet.href;
                        pipWindow.document.head.appendChild(link);
                    } else {
                        const cssRules = Array.from(styleSheet.cssRules)
                            .map((rule) => rule.cssText)
                            .join("");
                        const style = document.createElement("style");
                        style.textContent = cssRules;
                        pipWindow.document.head.appendChild(style);
                    }
                } catch (e) {
                    console.warn("Could not copy stylesheet", e);
                }
            });

            // HTML/Bodyのスタイルを設定してコンテンツを表示可能にする
            const styleElement = document.createElement("style");
            styleElement.textContent = `
                html, body, #pip-root {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    background-color: #f8fafc;
                }
            `;
            pipWindow.document.head.appendChild(styleElement);

            const container = pipWindow.document.createElement("div");
            container.id = "pip-root";
            pipWindow.document.body.appendChild(container);

            // ウィンドウを左側に寄せる試み（ブラウザにより制限がある場合があります）
            try {
                // PiPウィンドウの初期位置指定はできないため、オープン後に移動を試みる
                // 注意: 一部のブラウザではmoveToが制限されているか、ユーザー操作に依存します
                setTimeout(() => {
                    pipWindow.moveTo(0, 0);
                }, 100);
            } catch (e) {
                console.warn("Could not move PiP window", e);
            }

            // 動的インポートを使用してSupportPanelをインクルード
            const { default: SupportPanel } = await import("@/components/SupportPanel");
            const root = createRoot(container);
            root.render(
                <div className="h-screen bg-slate-50 overflow-hidden">
                    <SupportPanel
                        userData={userData as UserInput}
                        isOpen={true}
                        onToggle={() => pipWindow.close()}
                        isStandalone={true}
                    />
                </div>
            );

            // ウィンドウが閉じられた時のクリーンアップ
            pipWindow.addEventListener("pagehide", () => {
                root.unmount();
            });

        } catch (err) {
            console.error(err);
            openSupportWindow();
        }
    };

    // Force memo tab if hearing is not complete
    useEffect(() => {
        if (!isHearingComplete) {
            setActiveTab("memo");
            setIsRateVisible(false); // Reset visibility when hearing is fresh
        }
    }, [isHearingComplete]);

    return (
        <div
            className={`fixed top-1/2 -translate-y-1/2 right-0 z-50 transition-all duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-[calc(100%-40px)]"}`}
        >
            <div className="flex items-stretch shadow-2xl h-[70vh]">
                {/* 開閉ボタン（縦の帯） */}
                <button
                    onClick={onToggle}
                    className={`w-10 bg-slate-900 text-white flex flex-col items-center justify-center gap-4 py-8 rounded-l-2xl hover:bg-slate-800 transition-colors cursor-pointer group`}
                >
                    <FileText className={`w-5 h-5 transition-transform duration-500 ${isOpen ? "rotate-0 scale-110" : "rotate-0"}`} />
                    <span className="[writing-mode:vertical-rl] font-black text-[10px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100">
                        {isOpen ? "Close Panel" : "Side Memo"}
                    </span>
                </button>

                {/* メモ内容 */}
                <div className="w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200 flex flex-col overflow-hidden">
                    {/* GFS Content & Support Window Link - Compact & Stylish */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/30 flex gap-2">
                        <a
                            href="https://gfs.tokyo/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all group/link shadow-sm"
                        >
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span className="text-[9px] font-black text-slate-600 tracking-tight">GFS CONTENTS</span>
                        </a>

                        <button
                            onClick={openPiPSupport}
                            className="flex-1 flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all group/support shadow-xl shadow-slate-200 border-b-4 border-slate-700 active:border-b-0 active:translate-y-1"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center group-hover/support:bg-blue-600/30 transition-colors">
                                <Maximize2 className="w-4 h-4 text-blue-400 group-hover/support:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-black tracking-[0.1em] text-white">PRESENTER MODE</span>
                                <span className="text-[8px] font-bold tracking-tight text-slate-400">Always on Top Assistant</span>
                            </div>
                        </button>
                    </div>

                    {/* Tabs Header */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-2">
                        {isHearingComplete && (
                            <button
                                onClick={() => setActiveTab("summary")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all ${activeTab === "summary" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-200"}`}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                SUMMARY
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab("memo")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all ${activeTab === "memo" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-200"}`}
                        >
                            <PenLine className="w-3.5 h-3.5" />
                            PRIVATE MEMO
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {activeTab === "summary" && isHearingComplete && userData ? (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-[9px] font-bold text-slate-400 mb-1">お名前 / 年齢</p>
                                            <p className="text-lg font-black text-slate-900">{userData.name} 様 <span className="text-xs font-medium text-slate-500">({userData.age}歳)</span></p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-[9px] font-bold text-slate-400 mb-1">職業 / 家族構成</p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {userData.occupation || "未入力"}
                                                {userData.familyStructure && ` / ${userData.familyStructure}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Target className="w-3.5 h-3.5" /> Goal & Experience
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <p className="text-[9px] font-bold text-blue-400 mb-1">将来の目標</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">「{userData.investmentGoal}」</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-[9px] font-bold text-slate-400 mb-1">投資経験 / 知識</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600">{userData.experience}</span>
                                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600">知識レベル: {userData.knowledgeLevel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Wallet className="w-3.5 h-3.5" /> Assets
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                            <p className="text-[9px] font-bold text-emerald-600 mb-1">現在の投資可能額</p>
                                            <p className="text-xl font-black text-slate-900">{(userData.currentAssets / 10000).toLocaleString()}<span className="text-[10px] ml-1">万円</span></p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <p className="text-[9px] font-bold text-slate-400 mb-1">月々の投資可能額</p>
                                            <p className="text-lg font-black text-slate-900">{(userData.monthlyInvestment / 10000).toLocaleString()}<span className="text-[10px] ml-1">万円</span></p>
                                        </div>
                                    </div>
                                </div>

                                {simulationResult && (
                                    <div className="pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => setIsRateVisible(true)}
                                            className={`w-full p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-between gap-3 group ${!isRateVisible ? "cursor-pointer hover:scale-[1.02] active:scale-95 shadow-blue-100/50" : "cursor-default shadow-blue-200/50"}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-white/80" />
                                                <p className="text-[11px] font-black text-white tracking-widest leading-none">
                                                    {userData?.name}様に必要な年利
                                                </p>
                                            </div>
                                            <p className="text-xl font-black text-white tracking-tighter shrink-0">
                                                {isRateVisible ? formatPercent(simulationResult.requiredAnnualRate) : "??.?"}
                                                <span className="text-xs ml-0.5 opacity-70">%</span>
                                            </p>
                                        </button>
                                        <p className="mt-2 text-center text-[9px] font-black text-slate-400 italic">
                                            {isRateVisible ? `GOAL: ${formatPercent(simulationResult.requiredAnnualRate)}` : "CLICK TO REVEAL TARGET"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <PenLine className="w-3.5 h-3.5" /> Side Note
                                    </h3>
                                </div>
                                <textarea
                                    value={memoText}
                                    onChange={(e) => onMemoChange(e.target.value)}
                                    placeholder="自由にメモを残してください..."
                                    className="flex-1 w-full bg-blue-50/30 rounded-2xl p-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none leading-relaxed custom-scrollbar"
                                />
                                <p className="mt-4 text-[9px] font-medium text-slate-400 italic">
                                    ※入力した内容は一時的なものです（再起動でリセットされます）
                                </p>
                            </div>
                        )}
                    </div>
                </div>
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
