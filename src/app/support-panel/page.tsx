"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SupportPanel from "@/components/SupportPanel";
import { UserInput } from "@/types";

function SupportPanelContent() {
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<UserInput | null>(null);

    useEffect(() => {
        // Build userData from query params
        const data: Partial<UserInput> = {
            name: searchParams.get("name") || "あなた",
            age: Number(searchParams.get("age")) || 30,
            occupation: searchParams.get("occupation") || "",
            familyStructure: searchParams.get("familyStructure") || "",
            investmentGoal: searchParams.get("investmentGoal") || "",
            experience: searchParams.get("experience") || "未経験",
            knowledgeLevel: searchParams.get("knowledgeLevel") || "初心者",
            currentAssets: Number(searchParams.get("currentAssets")) || 0,
            monthlyInvestment: Number(searchParams.get("monthlyInvestment")) || 0,
        };
        setUserData(data as UserInput);

        // Update document title for the popup
        document.title = "GFS Investment Support";
    }, [searchParams]);

    if (!userData) return null;

    return (
        <div className="h-screen bg-slate-50">
            <SupportPanel
                userData={userData}
                isOpen={true}
                onToggle={() => window.close()}
                isStandalone={true}
            />
        </div>
    );
}

export default function SupportPanelPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Support...</div>}>
            <SupportPanelContent />
        </Suspense>
    );
}
