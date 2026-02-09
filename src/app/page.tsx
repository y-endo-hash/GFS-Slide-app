"use client";

import { useState, useEffect } from "react";
import { UserInput, SimulationResult, Phase } from "@/types";
import { generateSimulation } from "@/lib/simulation";
import Agenda from "@/components/Agenda";
import Phase1Hearing from "@/components/Phase1Hearing";
import Phase2CompanyIntro from "@/components/Phase2CompanyIntro";
import Phase3Simulation from "@/components/Phase3Simulation";
import Phase4Solution from "@/components/Phase4Solution";
import Phase5Closing from "@/components/Phase5Closing";
import Phase1ThreeSteps from "@/components/Phase1ThreeSteps";
import SupportPanel from "@/components/SupportPanel";
import HearingMemo from "@/components/HearingMemo";
import TitleScreen from "@/components/TitleScreen";
import { Sparkles, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  // フェーズ順序: title -> agenda -> company -> hearing -> simulation -> solution -> closing
  const [phase, setPhase] = useState<Phase>("title");
  const [subStep, setSubStep] = useState<number | string>(0);
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // 他のタブ（サポートパネル等）にフェーズ情報を同期
  useEffect(() => {
    const channel = new BroadcastChannel("gfs-sync");

    const broadcastState = () => {
      channel.postMessage({ type: "SYNC_STATE", phase, subStep, simulationResult, userData });
    };

    channel.onmessage = (event) => {
      if (event.data?.type === "REQUEST_SYNC") {
        broadcastState();
      } else if (event.data?.type === "SYNC_STATE") {
        if (event.data.userData) setUserData(event.data.userData);
        if (event.data.simulationResult) setSimulationResult(event.data.simulationResult);
      }
    };

    broadcastState();

    return () => channel.close();
  }, [phase, subStep, simulationResult, userData]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isHearingMemoOpen, setIsHearingMemoOpen] = useState(false);
  const [sideMemoText, setSideMemoText] = useState("");
  const [zoomScale, setZoomScale] = useState(1);

  // ズーム制御
  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.1, 2.0));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoomScale(1);

  // ショートカットキー
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // フェーズまたはサブステップが切り替わったときにトップにスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, subStep]);

  const handleAgendaStart = () => {
    setPhase("company"); // 会社紹介から開始
  };

  const handleCompanyNext = () => {
    setPhase("threeSteps"); // 資産形成の3ステップへ
  };

  const handleThreeStepsNext = () => {
    setPhase("hearing"); // 次にヒアリング
  };

  const handleHearingComplete = async (data: UserInput) => {
    setUserData(data);

    // ヒアリング未入力（名前が空）の場合はシミュレーションを飛ばして解決策へ
    if (!data.name.trim()) {
      setPhase("solution");
      return;
    }

    setIsLoading(true);

    // シミュレーション計算（擬似遅延付き）
    await new Promise(resolve => setTimeout(resolve, 2500));
    const result = generateSimulation(data);
    setSimulationResult(result);

    setIsLoading(false);
    setPhase("simulation");
  };

  const goToPhase = (targetPhase: Phase) => {
    setPhase(targetPhase);
    setSubStep(0); // フェーズ切り替え時にサブステップをリセット
  };

  // ローディング画面
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-white relative overflow-hidden">
        {/* 背景マスコット */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/mascot/mascot_search.png"
            alt=""
            width={200}
            height={200}
            className="absolute top-10 left-10 opacity-20 animate-float-slow"
          />
          <Image
            src="/mascot/mascot_phone.png"
            alt=""
            width={180}
            height={180}
            className="absolute bottom-10 right-10 opacity-20 animate-float-delayed"
          />
        </div>

        <div className="text-center space-y-8 animate-fade-in relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-blue-200 border-t-primary animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-800">分析中...</h2>
          </div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 以降のフェーズは共通のサイドパネルを持つ
  const showPersistentPanels = ["simulation", "solution", "closing"].includes(phase);

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ズームコントローラー (左側固定) */}
      <div className="fixed left-6 bottom-10 z-[100] flex flex-col gap-2 animate-in slide-in-from-left duration-700">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all active:scale-90 group"
            title="ズームイン"
          >
            <ZoomIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="h-[1px] w-8 bg-slate-100" />

          <button
            onClick={handleResetZoom}
            className="w-10 h-10 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors"
            title="リセット"
          >
            {Math.round(zoomScale * 100)}%
          </button>

          <div className="h-[1px] w-8 bg-slate-100" />

          <button
            onClick={handleZoomOut}
            className="p-3 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-xl transition-all active:scale-90 group"
            title="ズームアウト"
          >
            <ZoomOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <button
          onClick={handleResetZoom}
          className="p-3 bg-slate-900/10 hover:bg-slate-900/20 text-slate-600 rounded-xl transition-all backdrop-blur-sm group"
          title="フィット"
        >
          <Maximize2 className="w-5 h-5 opacity-50 group-hover:opacity-100" />
        </button>
      </div>

      <HearingMemo
        userData={userData}
        simulationResult={simulationResult}
        isOpen={isHearingMemoOpen}
        onToggle={() => setIsHearingMemoOpen(!isHearingMemoOpen)}
        memoText={sideMemoText}
        onMemoChange={setSideMemoText}
        isHearingComplete={["title", "agenda", "company", "threeSteps", "hearing", "simulation", "solution", "closing"].includes(phase)}
      />

      {/* メインコンテンツラップ (ズーム適用) */}
      <div
        className="transition-transform duration-300 ease-out origin-top-left"
        style={{
          transform: `scale(${zoomScale})`,
          width: `${100 / zoomScale}%`,
          height: `${100 / zoomScale}%`,
          minHeight: '100vh'
        }}
      >
        {phase === "title" && (
          <TitleScreen onStart={() => goToPhase("agenda")} />
        )}

        {phase === "agenda" && (
          <Agenda onStart={handleAgendaStart} onGoToPhase={goToPhase} userData={userData} />
        )}

        {phase === "company" && (
          <Phase2CompanyIntro
            userData={userData}
            onNext={handleCompanyNext}
            onBack={() => goToPhase("agenda")}
            onGoToAgenda={() => goToPhase("agenda")}
          />
        )}

        {phase === "threeSteps" && (
          <Phase1ThreeSteps
            onNext={handleThreeStepsNext}
            onBack={() => goToPhase("company")}
            onGoToAgenda={() => goToPhase("agenda")}
          />
        )}

        {phase === "hearing" && (
          <Phase1Hearing
            onSubmit={handleHearingComplete}
            onBack={() => goToPhase("threeSteps")}
            onGoToAgenda={() => goToPhase("agenda")}
          />
        )}

        {/* Persistent Panels (Support Panel is now handled via separate window in HearingMemo) */}



        {phase === "simulation" && (
          <Phase3Simulation
            userData={userData || { name: "", age: 0, investmentGoal: "", targetAmount: 0, targetPeriod: 0, initialBudget: 0, monthlySavings: 0, currentAssets: 0, monthlyInvestment: 0 }}
            simulationResult={simulationResult || undefined}
            onNext={() => goToPhase("solution")}
            onBack={() => goToPhase("hearing")}
            onGoToAgenda={() => goToPhase("agenda")}
            onSubStepChange={setSubStep}
          />
        )}

        {phase === "solution" && (
          <Phase4Solution
            userData={userData || { name: "", age: 0, investmentGoal: "", targetAmount: 0, targetPeriod: 0, initialBudget: 0, monthlySavings: 0, currentAssets: 0, monthlyInvestment: 0 }}
            simulationResult={simulationResult || undefined}
            onNext={() => goToPhase("closing")}
            onBack={() => {
              // ヒアリング未入力の場合はシミュレーションを飛ばしてヒアリングへ戻る
              if (!userData || !userData.name.trim()) {
                goToPhase("hearing");
              } else {
                goToPhase("simulation");
              }
            }}
            onGoToAgenda={() => goToPhase("agenda")}
            onSubStepChange={setSubStep}
          />
        )}

        {phase === "closing" && (
          <Phase5Closing
            userData={userData || { name: "", age: 0, investmentGoal: "", targetAmount: 0, targetPeriod: 0, initialBudget: 0, monthlySavings: 0, currentAssets: 0, monthlyInvestment: 0 }}
            simulationResult={simulationResult || undefined}
            onBack={() => goToPhase("solution")}
            onGoToAgenda={() => goToPhase("agenda")}
            onSubStepChange={setSubStep}
          />
        )}
      </div>
    </div>
  );
}
