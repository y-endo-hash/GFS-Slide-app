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
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Home() {
  // フェーズ順序: agenda -> company -> hearing -> simulation -> solution -> closing
  const [phase, setPhase] = useState<Phase>("agenda");
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isHearingMemoOpen, setIsHearingMemoOpen] = useState(false);
  const [sideMemoText, setSideMemoText] = useState("");

  // フェーズが切り替わったときにトップにスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

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
    <>
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

      {/* Persistent Panels */}
      {userData && (
        <SupportPanel
          userData={userData}
          isOpen={isSupportOpen}
          onToggle={() => setIsSupportOpen(!isSupportOpen)}
        />
      )}

      <HearingMemo
        userData={userData}
        simulationResult={simulationResult}
        isOpen={isHearingMemoOpen}
        onToggle={() => setIsHearingMemoOpen(!isHearingMemoOpen)}
        memoText={sideMemoText}
        onMemoChange={setSideMemoText}
        isHearingComplete={["simulation", "solution", "closing"].includes(phase)}
      />

      {phase === "simulation" && userData && simulationResult && (
        <Phase3Simulation
          userData={userData}
          simulationResult={simulationResult}
          onNext={() => goToPhase("solution")}
          onBack={() => goToPhase("hearing")}
          onGoToAgenda={() => goToPhase("agenda")}
        />
      )}

      {phase === "solution" && userData && simulationResult && (
        <Phase4Solution
          userData={userData}
          simulationResult={simulationResult}
          onNext={() => goToPhase("closing")}
          onBack={() => goToPhase("simulation")}
          onGoToAgenda={() => goToPhase("agenda")}
        />
      )}

      {phase === "closing" && userData && simulationResult && (
        <Phase5Closing
          userData={userData}
          simulationResult={simulationResult}
          onBack={() => goToPhase("solution")}
          onGoToAgenda={() => goToPhase("agenda")}
        />
      )}
    </>
  );
}
