import { UserInput, SimulationResult, ChartDataPoint } from "@/types";

// 預金金利（日本の普通預金の一般的な金利）
const SAVINGS_ANNUAL_RATE = 0.002; // 0.2%

// 預金＆積立（投資信託等）
const TRUST_ANNUAL_RATE = 0.04; // 4%

// 預金＆個別株投資（現実的な範囲）
const STOCKS_RATE_MIN = 0.07; // 7%
const STOCKS_RATE_MAX = 0.10; // 10%

// 最適な資産形成（学びと組み合わせた現実的な目標）
const OPTIMAL_RATE_MIN = 0.12; // 12%
const OPTIMAL_RATE_MAX = 0.15; // 15%

/**
 * 全角数字を半角数字に変換し、数字以外の文字（カンマ等）を除去
 */
export function toHalfWidth(str: string): string {
    return str.replace(/[０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(/[^0-9]/g, ""); // 数字以外を除去
}

/**
 * カンマ区切りなどの入力を数値に変換
 */
export function parseNumericInput(value: string): number {
    const cleanValue = toHalfWidth(value);
    return parseInt(cleanValue) || 0;
}

/**
 * 複利計算（月次積立対応）: 
 * FV = PV * (1+r)^n + PMT * [((1+r/12)^(12n) - 1) / (r/12)]
 */
export function calculateFutureValue(
    principal: number,
    annualRate: number,
    years: number,
    monthlySavings: number = 0
): number {
    const r = annualRate;
    const n = years;
    const p = principal;
    const s = monthlySavings;

    // 元本の複利
    const fvPrincipal = p * Math.pow(1 + r, n);

    if (r === 0) return p + s * 12 * n;

    // 積立の複利（月利計算）
    const monthlyRate = r / 12;
    const totalMonths = n * 12;
    const fvSavings = s * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;

    return fvPrincipal + fvSavings;
}

/**
 * 目標金額に達するために必要な年利を算出（二分探索）
 */
export function calculateRequiredRate(
    principal: number,
    targetAmount: number,
    years: number,
    monthlySavings: number
): number {
    let low = 0;
    let high = 2.0; // 最大200%まで探索
    let iterations = 0;

    while (iterations < 100) {
        const mid = (low + high) / 2;
        const fv = calculateFutureValue(principal, mid, years, monthlySavings);

        if (Math.abs(fv - targetAmount) < 1) return mid;

        if (fv < targetAmount) {
            low = mid;
        } else {
            high = mid;
        }
        iterations++;
    }
    return low;
}

/**
 * シミュレーション結果を生成
 */
export function generateSimulation(input: UserInput): SimulationResult {
    const { initialBudget = 0, targetAmount, targetPeriod, monthlySavings = 0 } = input;

    // 非負の値を保証
    const principal = Math.max(0, initialBudget);
    const savings = Math.max(0, monthlySavings);

    // インプットがどちらも空（または0）の場合は NaN 防止のためデフォルト値を設定するか計算をスキップ
    if (principal === 0 && savings === 0) {
        // 全て0の空データ（デフォルト値）を返す
        return {
            savingsEndValue: 0,
            savingsAnnualRate: SAVINGS_ANNUAL_RATE,
            trustEndValue: 0,
            trustAnnualRate: TRUST_ANNUAL_RATE,
            stocksEndValue: 0,
            stocksAnnualRate: STOCKS_RATE_MIN,
            gfsEndValue: 0,
            gfsAnnualRate: OPTIMAL_RATE_MIN,
            yield30EndValue: 0,
            yield30AnnualRate: 0.3,
            achievedYear: null,
            isAchieved: false,
            requiredAnnualRate: 0,
            requiredTrustAnnualRate: 0,
            requiredStocksAnnualRate: 0,
            gap: targetAmount,
            isGapNegative: true,
            chartData: Array.from({ length: targetPeriod + 1 }, (_, i) => ({
                year: i,
                savings: 0,
                trust: 0,
                stocks: 0,
                gfs: 0,
                yield30: 0,
                required: 0,
                requiredTrust: 0,
                requiredStocks: 0,
                target: targetAmount
            })),
            fullChartData: Array.from({ length: targetPeriod + 1 }, (_, i) => ({
                year: i,
                savings: 0,
                trust: 0,
                stocks: 0,
                gfs: 0,
                yield30: 0,
                required: 0,
                requiredTrust: 0,
                requiredStocks: 0,
                target: targetAmount
            })),
        };
    }

    // 目標達成に必要な利回りを算出
    const rawRequiredRate = calculateRequiredRate(principal, targetAmount, targetPeriod, savings);

    /**
     * ユーザー要望：目標到達金額は少し過ぎて数万〜数十万くらいなら端数が出てもいい
     * 0.1%単位で切り上げた後、さらにわずかなランダムバッファ（0.02%〜0.05%）を加えることで、
     * 常に「少しだけ目標を上回る」自然な数値を生成する
     */
    /**
     * 【重要】ユーザー要望：メインの計算基準を20%運用に変更
     * 目標達成に必要な利率は参考値として保持し、メインの表示は20%運用時の数値とする
     */
    const TARGET_RATE_20 = 0.2;
    const roundedRate = Math.ceil(rawRequiredRate * 1000) / 1000;
    const randomBuffer = (Math.floor(Math.random() * 4) + 2) / 10000; // 0.0002 ~ 0.0005
    const requiredAnnualRate = Math.round((roundedRate + randomBuffer) * 10000) / 10000;
    /**
     * 比率は積立と個別株でランダムに揺らぎを持たせる（35%〜45%の範囲）
     * 基数となる利率は20%とする
     */
    const trustRatio = (Math.floor(Math.random() * 11) + 35) / 100; // 0.35 ~ 0.45
    const trustAnnualRate = Math.round(TARGET_RATE_20 * trustRatio * 10000) / 10000;

    const requiredTrustAnnualRate = Math.round(requiredAnnualRate * trustRatio * 10000) / 10000;
    const requiredStocksAnnualRate = Math.round((requiredAnnualRate - requiredTrustAnnualRate) * 10000) / 10000;
    const stocksAnnualRate = Math.round((TARGET_RATE_20 - trustAnnualRate) * 10000) / 10000;

    // ユーザー要望：20%運用をメインの表示基準にする
    const YIELD_20 = 0.2;
    const gfsAnnualRate = YIELD_20;

    // 運用ルート（互換性のために保持しつつ、20%も追加）
    const YIELD_30 = 0.3;
    const yield30EndValue = calculateFutureValue(principal, YIELD_30, targetPeriod, savings);
    const yield20EndValue = calculateFutureValue(principal, YIELD_20, targetPeriod, savings); // 追加

    // 達成年の特定
    let achievedYear: number | null = null;
    let isAchieved = false;

    // グラフ用データ生成
    const fullChartData: ChartDataPoint[] = [];
    for (let year = 0; year <= targetPeriod; year++) {
        const valSavings = Math.round(calculateFutureValue(principal, SAVINGS_ANNUAL_RATE, year, savings));

        // ユーザー要望：積立と個別株を「足すと」目標に届くように、目標達成曲線をランダムな比率で分割
        const valGfs = Math.round(calculateFutureValue(principal, gfsAnnualRate, year, savings));
        const valTrust = Math.round(valGfs * trustRatio);
        const valStocks = valGfs - valTrust; // 合計が一致するように引き算で算出

        const valYield30 = Math.round(calculateFutureValue(principal, YIELD_30, year, savings));
        const valRequired = Math.round(calculateFutureValue(principal, requiredAnnualRate, year, savings));
        const valRequiredTrust = Math.round(valRequired * trustRatio);
        const valRequiredStocks = valRequired - valRequiredTrust;

        fullChartData.push({
            year,
            savings: valSavings,
            trust: valTrust,
            stocks: valStocks,
            gfs: valGfs,
            yield30: valYield30,
            required: valRequired,
            requiredTrust: valRequiredTrust,
            requiredStocks: valRequiredStocks,
            target: targetAmount,
        });

        if (achievedYear === null && valGfs >= targetAmount) {
            achievedYear = year;
            isAchieved = true;
        }
    }

    // 期間内に達成する場合、グラフ期間を短縮。達成時の値を成果とする。
    const displayYear = (isAchieved && achievedYear !== null) ? achievedYear : targetPeriod;

    const chartData = (isAchieved && achievedYear !== null)
        ? fullChartData.slice(0, achievedYear + 1)
        : fullChartData;

    // 各成果の最終値（短縮された場合は達成時、そうでなければ目標期間時）
    const lastPoint = fullChartData[displayYear];

    // Gap分析（預金 vs 目標）
    const finalSavingsEndValue = lastPoint.savings;
    const gap = Math.max(0, targetAmount - finalSavingsEndValue);
    const isGapNegative = gap > 0;

    return {
        savingsEndValue: finalSavingsEndValue,
        savingsAnnualRate: SAVINGS_ANNUAL_RATE,
        trustEndValue: lastPoint.trust,
        trustAnnualRate: trustAnnualRate,
        stocksEndValue: lastPoint.stocks,
        stocksAnnualRate: stocksAnnualRate,
        gfsEndValue: lastPoint.gfs,
        gfsAnnualRate: gfsAnnualRate,
        yield30EndValue: lastPoint.yield30,
        yield30AnnualRate: YIELD_30,
        achievedYear,
        isAchieved,
        requiredAnnualRate,
        requiredTrustAnnualRate,
        requiredStocksAnnualRate,
        gap: Math.round(gap),
        isGapNegative,
        chartData,
        fullChartData,
    };
}

/**
 * 金額を日本円フォーマットで表示
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * 金額を万円単位で表示
 */
export function formatManYen(amount: number): string {
    const manYen = amount / 10000;
    if (manYen >= 10000) {
        return `${(manYen / 10000).toFixed(1)}億円`;
    }
    return `${Math.round(manYen).toLocaleString()}万円`;
}

/**
 * パーセンテージ表示
 */
export function formatPercent(rate: number): string {
    return `${(rate * 100).toFixed(1)}%`;
}
/**
 * 金額を日本語の単位（円、千、万、億、兆、京）でフォーマット
 */
export function formatJapaneseAmount(amount: number): string {
    if (amount === 0) return "0円";

    const units = [
        { label: "京", value: 1e16 },
        { label: "兆", value: 1e12 },
        { label: "億", value: 1e8 },
        { label: "万", value: 1e4 },
        { label: "千", value: 1e3 }
    ];

    let result = "";
    let remaining = amount;

    for (const unit of units) {
        if (remaining >= unit.value) {
            const count = Math.floor(remaining / unit.value);
            result += `${count.toLocaleString()}${unit.label}`;
            remaining %= unit.value;
        }
    }

    if (remaining > 0 || result === "") {
        result += remaining.toLocaleString();
    }

    return result + "円";
}
