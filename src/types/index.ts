export interface UserInput {
  name: string;
  age: number;
  investmentGoal: string; // 投資で利益が出たらやりたいこと
  targetAmount: number; // 目標金額（円）
  targetPeriod: number; // ゴール達成までの期間（年数）
  initialBudget: number; // 現在出せる投資資金（円）
  monthlySavings: number; // 毎月の積立金額（円）
  occupation?: string; // 職業 (New)
  familyStructure?: string; // 家族構成 (New)
  investmentExperience?: string[]; // 投資経験 (New)
  experience?: string; // 単一選択の経験表示用 (Memo用)
  knowledgeLevel?: string; // 知識レベル (Memo用)
  currentAssets: number; // メモ表示用 (initialBudgetと同一視)
  monthlyInvestment: number; // メモ表示用 (monthlySavingsと同一視)
}

export interface SimulationResult {
  // 預金ルート
  savingsEndValue: number;
  savingsAnnualRate: number;

  // 預金＆積立（投資信託等）
  trustEndValue: number;
  trustAnnualRate: number;

  // 預金＆個別株投資
  stocksEndValue: number;
  stocksAnnualRate: number;

  // GFSルート  
  gfsEndValue: number;
  gfsAnnualRate: number;

  // 30%運用ルート
  yield30EndValue: number;
  yield30AnnualRate: number;

  // 達成状況
  achievedYear: number | null;
  isAchieved: boolean;

  // 必要年利
  requiredAnnualRate: number;
  requiredTrustAnnualRate: number;
  requiredStocksAnnualRate: number;

  // Gap分析
  gap: number;
  isGapNegative: boolean; // 預金だと目標に届かない

  // グラフ用データ
  chartData: ChartDataPoint[];
  fullChartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  year: number;
  savings: number;
  trust: number;
  stocks: number;
  gfs: number;
  yield30: number;
  required: number;
  requiredTrust: number;
  requiredStocks: number;
  target: number;
}

export interface PhaseProps {
  userData: UserInput;
  onNext: () => void;
  onBack?: () => void;
  simulationResult?: SimulationResult;
}

export type Phase =
  | 'agenda'       // 目次
  | 'company'      // Phase 2: 会社紹介
  | 'threeSteps'   // 資産形成の3ステップ (New)
  | 'hearing'      // Phase 1: ヒアリング
  | 'simulation'   // Phase 3: 投資設計コンサル
  | 'solution'     // Phase 4: GFSソリューション
  | 'closing';     // Phase 5: クロージング

export interface LearningStep {
  phase: string;
  title: string;
  description: string;
  duration: string;
}

export interface Roadmap {
  steps: LearningStep[];
  monthlyRecommendedInvestment: number;
  expectedReturnRate: number;
  yearsToGoal: number;
}
