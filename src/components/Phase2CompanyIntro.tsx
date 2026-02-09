"use client";

import { useEffect, useState, useRef } from "react";
import { UserInput } from "@/types";
import { Button } from "@/components/ui/Button";
import {
    Building2, Users, GraduationCap, Trophy, CheckCircle, ArrowRight,
    TrendingUp, Target, Heart, Sparkles, ChevronLeft, ChevronRight, ArrowLeft,
    Star, Award, BookOpen, MessageCircle, FileText, Maximize2, X
} from "lucide-react";
import Image from "next/image";

interface Phase2CompanyIntroProps {
    userData?: UserInput | null;
    onNext?: () => void;
    onBack?: () => void;
    onGoToAgenda?: () => void;
    onSubStepChange?: (subStep: number) => void;
    subStep?: number;
    isPreview?: boolean;
}

export default function Phase2CompanyIntro({ userData, onNext, onBack, onGoToAgenda, onSubStepChange, subStep, isPreview = false }: Phase2CompanyIntroProps) {
    const [currentSlide, setCurrentSlide] = useState(isPreview && typeof subStep === 'number' ? subStep : 0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
    const [showExteriorOverlay, setShowExteriorOverlay] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // スライドが切り替わったときにコンテナ内をトップにスクロール
    useEffect(() => {
        if (!isPreview && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
        setHoveredProgram(null);
    }, [currentSlide, isPreview]);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    // Sync from prop (for preview mode)
    useEffect(() => {
        if (isPreview && typeof subStep === 'number' && subStep !== currentSlide) {
            setCurrentSlide(subStep);
        }
    }, [subStep, isPreview, currentSlide]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        onSubStepChange?.(index);
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            const next = currentSlide + 1;
            setCurrentSlide(next);
            onSubStepChange?.(next);
        } else {
            onNext?.();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            const prev = currentSlide - 1;
            setCurrentSlide(prev);
            onSubStepChange?.(prev);
        } else {
            onBack?.();
        }
    };

    // スライドデータ（画像とカスタムを交互に配置）
    const slides = [
        {
            type: "company_info",
            title: "講座の運営元",
            description: "株式会社GFS Education"
        },
        {
            type: "cm_videos",
            title: "藤本美貴さん 出演CM放送中",
            description: "お金の学校 GFS",
            videos: [
                { src: "/videos/ミキティCM.mp4", title: "TV CM 1" },
                { src: "/videos/ミキティCM2.mp4", title: "TV CM 2" },
                { src: "/videos/ミキティCM3.mp4", title: "TV CM 3" }
            ]
        },
        {
            type: "custom",
            title: "GFSのコンセプト",
            icon: Heart,
            color: "from-rose-500 to-pink-600",
            characterImage: "/slides/character_happy_new.png",
            content: {
                heading: "お金でやりたいことを諦めない世の中を創る",
                subheading: "金融知識がすべての人にとって当たり前の時代を創る",
                points: [
                    "投資は一部の富裕層だけのものではありません",
                    "正しい知識があれば、誰でも資産形成ができます",
                    "GFSは金融教育の民主化を目指しています"
                ]
            }
        },
        {
            type: "no1_achievements",
            title: "オンライン投資スクール No.1",
            description: "2025年 東京商工リサーチ調べ",
            achievements: [
                { label: "講師数", rank: "No.1" },
                { label: "講義数", rank: "No.1" },
                { label: "生徒数", rank: "No.1" }
            ],
            students: "60,000人",
            note: "※2025年11月時点"
        },
        {
            type: "student_achievements",
            title: "GFS生徒の実績",
            description: "入学前は約66%の方は投資初心者ですが、半年~1年ほどで30万円以上の利益を出しています！",
            barChart: {
                title: "生徒（投資初心者）の入学後実績",
                subtitle: "入学から1年後には220万円以上の利益を出すことができています！",
                data: [
                    { period: "半年～", amount: 36, color: "bg-gradient-to-t from-blue-500 to-blue-400" },
                    { period: "1年～2年以内", amount: 220, color: "bg-gradient-to-t from-yellow-500 to-yellow-400", highlight: true },
                    { period: "2年～3年以内", amount: 300, color: "bg-gradient-to-t from-purple-600 to-purple-500" }
                ],
                note: "※2025年8月 GFS全生徒へのアンケートをもとに集計（回答者数：1,108名）"
            },
            pieChart: {
                title: "GFS生徒の過半数が投資初心者",
                data: [
                    { label: "投資初心者", percentage: 66, color: "#1e3a8a" },
                    { label: "投資経験者", percentage: 34, color: "#60a5fa" }
                ]
            }
        },
        {
            type: "custom",
            title: "充実のカリキュラム",
            icon: BookOpen,
            color: "from-blue-500 to-indigo-600",
            characterImage: "/slides/character_reading.png",
            content: {
                heading: "2,000以上の講義が視聴し放題",
                subheading: "基礎から応用まで、正しい順序で学べる環境",
                points: [
                    "投資の基礎知識から実践的なテクニックまで",
                    "株式・FX・仮想通貨など幅広い分野をカバー",
                    "いつでもどこでも、自分のペースで学習可能",
                    "1日15分からでOK、隙間時間を有効活用"
                ]
            }
        },
        {
            type: "custom",
            title: "手厚いサポート体制",
            icon: MessageCircle,
            color: "from-emerald-500 to-teal-500",
            characterImage: "/slides/character_cheerleader.png",
            characterImage2: "/slides/character_cheerleader2.png",
            content: {
                heading: "専任コンサルタントが全力サポート",
                subheading: "一人で悩まない、仲間がいる環境",
                points: [
                    "専任コンサルタントへの相談が可能",
                    "講師や投資仲間と交流できる掲示板",
                    "わからないことはいつでも質問OK",
                    "同じ目標を持つ仲間と切磋琢磨"
                ]
            }
        },
        {
            type: "learning_method_comparison",
            title: "学習の方法",
            subtitle: "体系的なカリキュラムを用意しています！",
            selfStudy: {
                title: "独学の場合",
                problems: [
                    "Aさんは○○と言っている",
                    "Bさんは△△と言っている",
                    "Cさんは□□と言っている"
                ],
                pathType: "curved"
            },
            gfsMethod: {
                title: "GFSの場合",
                subtitle: "未経験者でも3ヶ月で投資ができる体系的学習プログラムを提供",
                programs: [
                    "スタート\nダッシュ面談",
                    "ゴール設定",
                    "価値分析\n＆\n心理分析",
                    "口座開設"
                ],
                pathType: "straight"
            }
        }
    ];

    useEffect(() => {
        if (isAutoPlaying) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isAutoPlaying, slides.length]);

    const renderSlide = (slide: any) => {
        // 会社情報スライド（カスタムデザイン）
        if (slide.type === "company_info") {
            if (isFullScreen) {
                return (
                    <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-900 to-black flex items-center justify-center relative overflow-hidden p-0">
                        {/* 背景の巨大なぼかし */}
                        <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-blue-500/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-cyan-500/20 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 w-full px-12 text-center animate-fade-in">
                            <h3 className="font-black text-white leading-tight mb-20 text-[10vw] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                株式会社GFS Education
                            </h3>
                            <div className="flex flex-col items-center gap-10">
                                <div className="bg-white/10 backdrop-blur-xl rounded-[4rem] p-24 border-4 border-white/20 shadow-2xl w-full max-w-none inline-block">
                                    <div className="space-y-16 text-white text-[5vw] font-black tracking-widest">
                                        <p className="opacity-70">〒108-0023</p>
                                        <p>東京都港区芝浦3-9-1</p>
                                        <p>芝浦ルネサイトタワー 2F, 15F</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            return (
                <div className={`h-full bg-gradient-to-br from-sky-100 via-blue-200 to-cyan-100 flex items-center relative overflow-hidden transition-all duration-700 p-8 md:p-12`}>
                    {/* 背景装飾 */}
                    <div className="absolute inset-0 opacity-10">
                        <Image
                            src="/slides/office_building.jpg"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className={`relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mx-auto transition-all duration-700 max-w-6xl gap-12`}>
                        {/* 左側: 会社情報 */}
                        <div className="text-gray-800">
                            {/* アイコンとタイトル */}
                            <div className={`flex items-center gap-3 transition-all mb-6`}>
                                <Building2 className={`text-blue-600 transition-all w-10 h-10 md:w-12 md:h-12`} />
                                <h2 className={`font-bold text-blue-900 transition-all text-2xl md:text-3xl`}>講座の運営元</h2>
                            </div>

                            {/* 会社名 */}
                            <div className={`transition-all mb-6`}>
                                <h3 className={`font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent transition-all text-3xl md:text-4xl mb-4`}>
                                    株式会社GFS Education
                                </h3>
                            </div>

                            {/* 住所情報 */}
                            <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-blue-300 shadow-lg transition-all p-6 mb-6`}>
                                <div className={`space-y-8 transition-all text-base md:text-lg`}>
                                    <p className="text-blue-700 font-extrabold whitespace-nowrap">〒108-0023</p>
                                    <p className="font-extrabold text-gray-800">東京都港区芝浦3-9-1</p>
                                    <p className="font-extrabold text-gray-800">芝浦ルネサイトタワー 2F, 15F</p>
                                </div>
                            </div>

                            {/* 会社の外観コンテナ */}
                            <button
                                onClick={() => setShowExteriorOverlay(true)}
                                className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-blue-300 shadow-lg hover:bg-blue-50/80 transition-all duration-300 group cursor-pointer text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative w-32 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                        <Image
                                            src="/images/company_exterior.jpg"
                                            alt="会社の外観"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xl md:text-2xl font-black text-blue-900 mb-1 flex items-center gap-2">
                                            会社の外観
                                            <Sparkles className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </p>
                                        <p className="text-sm md:text-base text-blue-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            タップして大きな写真を見る
                                            <ArrowRight className="w-4 h-4" />
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* 右側: CMキャラクター画像 */}
                        <div className="flex items-center justify-center">
                            <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-700 max-w-md`}>
                                <Image
                                    src="/slides/cm_character.png"
                                    alt="GFSイメージキャラクター 藤本美貴さん"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // CM動画再生スライド
        if (slide.type === "cm_videos") {
            return (
                <div className={`h-full bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-50 flex flex-col relative overflow-y-auto transition-all duration-700 ${isFullScreen ? "p-4 md:p-12" : "p-6 md:p-8"}`}>
                    {/* 背景装飾 */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className={`relative z-10 w-full mx-auto transition-all duration-700 ${isFullScreen ? "max-w-[98%]" : "max-w-6xl"}`}>
                        {/* ヘッダー */}
                        <div className={`text-center transition-all ${isFullScreen ? "mb-12" : "mb-8"}`}>
                            <h2 className={`font-black text-blue-900 transition-all ${isFullScreen ? "text-5xl md:text-6xl mb-6" : "text-3xl md:text-4xl mb-3"}`}>
                                {slide.title}
                            </h2>
                            <p className={`font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent transition-all ${isFullScreen ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                                {slide.description}
                            </p>
                        </div>

                        <div className={`grid grid-cols-1 gap-12 transition-all ${isFullScreen ? "md:grid-cols-6" : "md:grid-cols-4"}`}>
                            {/* 左側: 動画サムネイル */}
                            <div className={`space-y-6 transition-all ${isFullScreen ? "md:col-span-1" : "md:col-span-1"}`}>
                                {slide.videos?.map((video: { src: string; title: string }, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedVideoIndex(index);
                                            setIsVideoPlaying(false);
                                        }}
                                        className={`w-full rounded-2xl overflow-hidden transition-all duration-300 ${selectedVideoIndex === index
                                            ? "ring-8 ring-blue-500 shadow-2xl scale-105"
                                            : "ring-2 ring-gray-300 hover:ring-blue-400 hover:scale-102"
                                            }`}
                                    >
                                        <div className="relative aspect-video bg-gradient-to-br from-blue-200 to-cyan-200">
                                            <video
                                                src={video.src}
                                                className="w-full h-full object-cover"
                                                preload="metadata"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <div className={`bg-white/90 rounded-full transition-all ${isFullScreen ? "p-6" : "p-3"}`}>
                                                    <svg className={`${isFullScreen ? "w-12 h-12" : "w-6 h-6"} text-blue-600`} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`bg-white text-center border-t-2 border-blue-200 transition-all ${isFullScreen ? "p-6" : "p-3"}`}>
                                            <p className={`font-serif font-black text-blue-900 tracking-wide transition-all ${isFullScreen ? "text-2xl" : "text-sm"}`} style={{ letterSpacing: '0.1em' }}>{video.title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* 右側: メイン動画プレーヤー */}
                            <div className={`transition-all ${isFullScreen ? "md:col-span-5" : "md:col-span-3"}`}>
                                <div className={`bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-blue-200 transition-all ${isFullScreen ? "scale-125 shadow-[0_0_150px_rgba(59,130,246,0.6)] border-[16px] my-10" : ""}`}>
                                    <div className="relative aspect-video bg-black">
                                        <video
                                            key={selectedVideoIndex}
                                            src={slide.videos?.[selectedVideoIndex].src}
                                            controls
                                            autoPlay={isVideoPlaying}
                                            className="w-full h-full"
                                            onPlay={() => setIsVideoPlaying(true)}
                                            onPause={() => setIsVideoPlaying(false)}
                                        >
                                            お使いのブラウザは動画タグをサポートしていません。
                                        </video>
                                    </div>
                                    <div className={`bg-white text-center border-t-4 border-blue-300 transition-all ${isFullScreen ? "p-12" : "p-6"}`}>
                                        <p className={`font-serif font-black text-blue-900 transition-all ${isFullScreen ? "text-6xl md:text-8xl py-6" : "text-2xl"}`} style={{ letterSpacing: '0.15em' }}>
                                            {slide.videos?.[selectedVideoIndex].title}
                                        </p>
                                    </div>
                                </div>

                                {/* 累計受講者数 */}
                                <div className="mt-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer"></div>

                                    {/* 月桂樹の装飾 - 左上 */}
                                    <div className="absolute left-4 top-4">
                                        <svg className="w-16 h-16 text-amber-400 opacity-70" viewBox="0 0 40 40" fill="currentColor">
                                            <path d="M20 5 Q15 10, 17 15 Q12 20, 14 25 Q10 28, 12 32" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="17" cy="10" rx="4" ry="2.5" transform="rotate(-35 17 10)" opacity="0.9" />
                                            <ellipse cx="14" cy="18" rx="4" ry="2.5" transform="rotate(-25 14 18)" opacity="0.9" />
                                            <ellipse cx="12" cy="26" rx="4" ry="2.5" transform="rotate(-35 12 26)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    {/* 月桂樹の装飾 - 右上 */}
                                    <div className="absolute right-4 top-4">
                                        <svg className="w-16 h-16 text-amber-400 opacity-70" viewBox="0 0 40 40" fill="currentColor">
                                            <path d="M20 5 Q25 10, 23 15 Q28 20, 26 25 Q30 28, 28 32" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="23" cy="10" rx="4" ry="2.5" transform="rotate(35 23 10)" opacity="0.9" />
                                            <ellipse cx="26" cy="18" rx="4" ry="2.5" transform="rotate(25 26 18)" opacity="0.9" />
                                            <ellipse cx="28" cy="26" rx="4" ry="2.5" transform="rotate(35 28 26)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    {/* 月桂樹の装飾 - 左側 */}
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-12 h-24 text-amber-400 opacity-70" viewBox="0 0 30 60" fill="currentColor">
                                            <path d="M15 5 Q10 10, 12 15 Q7 20, 9 25 Q5 30, 7 35 Q3 40, 5 45 Q1 50, 3 55" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="12" cy="10" rx="4" ry="2.5" transform="rotate(-35 12 10)" opacity="0.9" />
                                            <ellipse cx="9" cy="18" rx="4" ry="2.5" transform="rotate(-25 9 18)" opacity="0.9" />
                                            <ellipse cx="7" cy="26" rx="4" ry="2.5" transform="rotate(-35 7 26)" opacity="0.9" />
                                            <ellipse cx="5" cy="34" rx="4" ry="2.5" transform="rotate(-25 5 34)" opacity="0.9" />
                                            <ellipse cx="3" cy="42" rx="4" ry="2.5" transform="rotate(-35 3 42)" opacity="0.9" />
                                            <ellipse cx="1" cy="50" rx="4" ry="2.5" transform="rotate(-25 1 50)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    {/* 月桂樹の装飾 - 右側 */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="w-12 h-24 text-amber-400 opacity-70" viewBox="0 0 30 60" fill="currentColor">
                                            <path d="M15 5 Q20 10, 18 15 Q23 20, 21 25 Q25 30, 23 35 Q27 40, 25 45 Q29 50, 27 55" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="18" cy="10" rx="4" ry="2.5" transform="rotate(35 18 10)" opacity="0.9" />
                                            <ellipse cx="21" cy="18" rx="4" ry="2.5" transform="rotate(25 21 18)" opacity="0.9" />
                                            <ellipse cx="23" cy="26" rx="4" ry="2.5" transform="rotate(35 23 26)" opacity="0.9" />
                                            <ellipse cx="25" cy="34" rx="4" ry="2.5" transform="rotate(25 25 34)" opacity="0.9" />
                                            <ellipse cx="27" cy="42" rx="4" ry="2.5" transform="rotate(35 27 42)" opacity="0.9" />
                                            <ellipse cx="29" cy="50" rx="4" ry="2.5" transform="rotate(25 29 50)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    {/* 月桂樹の装飾 - 左下 */}
                                    <div className="absolute left-4 bottom-4">
                                        <svg className="w-16 h-16 text-amber-400 opacity-70" viewBox="0 0 40 40" fill="currentColor">
                                            <path d="M12 8 Q10 13, 12 18 Q7 23, 9 28 Q5 33, 8 38" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="12" cy="14" rx="4" ry="2.5" transform="rotate(-35 12 14)" opacity="0.9" />
                                            <ellipse cx="9" cy="22" rx="4" ry="2.5" transform="rotate(-25 9 22)" opacity="0.9" />
                                            <ellipse cx="8" cy="30" rx="4" ry="2.5" transform="rotate(-35 8 30)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    {/* 月桂樹の装飾 - 右下 */}
                                    <div className="absolute right-4 bottom-4">
                                        <svg className="w-16 h-16 text-amber-400 opacity-70" viewBox="0 0 40 40" fill="currentColor">
                                            <path d="M28 8 Q30 13, 28 18 Q33 23, 31 28 Q35 33, 32 38" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                            <ellipse cx="28" cy="14" rx="4" ry="2.5" transform="rotate(35 28 14)" opacity="0.9" />
                                            <ellipse cx="31" cy="22" rx="4" ry="2.5" transform="rotate(25 31 22)" opacity="0.9" />
                                            <ellipse cx="32" cy="30" rx="4" ry="2.5" transform="rotate(35 32 30)" opacity="0.9" />
                                        </svg>
                                    </div>

                                    <p className="text-3xl md:text-4xl font-black relative z-10">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">累計登録者数</span>
                                        {' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 text-4xl md:text-5xl">50万人</span>
                                        {' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">突破！</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // No.1実績スライド
        if (slide.type === "no1_achievements") {
            return (
                <div className={`h-full bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-50 flex flex-col relative overflow-y-auto transition-all duration-700 ${isFullScreen ? "p-4 md:p-10" : "p-6 md:p-8"}`}>
                    {/* 背景装飾 */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className={`relative z-10 w-full mx-auto transition-all duration-700 ${isFullScreen ? "max-w-none px-12" : "max-w-6xl"}`}>
                        {/* ヘッダー */}
                        <div className={`text-center transition-all ${isFullScreen ? "mb-32" : "mb-8"}`}>
                            <h2 className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 transition-all ${isFullScreen ? "text-8xl md:text-[12rem] mb-16" : "text-3xl md:text-5xl mb-3"}`}>
                                {slide.title}
                            </h2>
                            <p className={`text-gray-700 font-black transition-all ${isFullScreen ? "text-5xl md:text-8xl" : "text-lg md:text-xl"}`}>
                                {slide.description}
                            </p>
                        </div>

                        {/* 3つのNo.1バッジ */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 mx-auto transition-all ${isFullScreen ? "gap-24 mb-24 max-w-[95%]" : "gap-8 mb-8 max-w-4xl"}`}>
                            {slide.achievements?.map((achievement: { label: string; rank: string }, index: number) => (
                                <div
                                    key={index}
                                    className="group relative"
                                >
                                    {/* 外側のグロー効果 */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                                    {/* メインバッジ */}
                                    <div
                                        className={`relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 rounded-full aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl border-double border-amber-400 ${isFullScreen ? "p-48 border-[32px] scale-[2.0]" : "p-6 border-8"}`}
                                        style={{
                                            boxShadow: isFullScreen
                                                ? "0 0 150px rgba(251, 191, 36, 0.8), inset 0 0 80px rgba(251, 191, 36, 0.5)"
                                                : "0 0 40px rgba(251, 191, 36, 0.4), inset 0 0 20px rgba(251, 191, 36, 0.1)"
                                        }}
                                    >
                                        {/* 王冠アイコン */}
                                        <div className={`absolute bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-xl border-amber-200 transition-all ${isFullScreen ? "-top-12 p-6 border-8" : "-top-8 p-4 border-4"}`}>
                                            <svg className={`${isFullScreen ? "w-10 h-10" : "w-6 h-6"} text-amber-900`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
                                            </svg>
                                        </div>

                                        {/* 月桂樹の装飾 - 左側 */}
                                        <div className={`absolute top-1/2 -translate-y-1/2 transition-all ${isFullScreen ? "-left-12 scale-150" : "left-1"}`}>
                                            <svg className="w-10 h-20 text-amber-400 opacity-70" viewBox="0 0 30 60" fill="currentColor">
                                                <path d="M15 5 Q10 10, 12 15 Q7 20, 9 25 Q5 30, 7 35 Q3 40, 5 45 Q1 50, 3 55" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                                <ellipse cx="12" cy="10" rx="4" ry="2.5" transform="rotate(-35 12 10)" opacity="0.9" />
                                                <ellipse cx="9" cy="18" rx="4" ry="2.5" transform="rotate(-25 9 18)" opacity="0.9" />
                                                <ellipse cx="7" cy="26" rx="4" ry="2.5" transform="rotate(-35 7 26)" opacity="0.9" />
                                                <ellipse cx="5" cy="34" rx="4" ry="2.5" transform="rotate(-25 5 34)" opacity="0.9" />
                                                <ellipse cx="3" cy="42" rx="4" ry="2.5" transform="rotate(-35 3 42)" opacity="0.9" />
                                                <ellipse cx="1" cy="50" rx="4" ry="2.5" transform="rotate(-25 1 50)" opacity="0.9" />
                                            </svg>
                                        </div>

                                        {/* 月桂樹の装飾 - 右側 */}
                                        <div className={`absolute top-1/2 -translate-y-1/2 transition-all ${isFullScreen ? "-right-12 scale-150" : "right-1"}`}>
                                            <svg className="w-10 h-20 text-amber-400 opacity-70" viewBox="0 0 30 60" fill="currentColor">
                                                <path d="M15 5 Q20 10, 18 15 Q23 20, 21 25 Q25 30, 23 35 Q27 40, 25 45 Q29 50, 27 55" stroke="currentColor" strokeWidth="2.5" fill="none" />
                                                <ellipse cx="18" cy="10" rx="4" ry="2.5" transform="rotate(35 18 10)" opacity="0.9" />
                                                <ellipse cx="21" cy="18" rx="4" ry="2.5" transform="rotate(25 21 18)" opacity="0.9" />
                                                <ellipse cx="23" cy="26" rx="4" ry="2.5" transform="rotate(35 23 26)" opacity="0.9" />
                                                <ellipse cx="25" cy="34" rx="4" ry="2.5" transform="rotate(25 25 34)" opacity="0.9" />
                                                <ellipse cx="27" cy="42" rx="4" ry="2.5" transform="rotate(35 27 42)" opacity="0.9" />
                                                <ellipse cx="29" cy="50" rx="4" ry="2.5" transform="rotate(25 29 50)" opacity="0.9" />
                                            </svg>
                                        </div>

                                        {/* コンテンツ */}
                                        <div className="text-center relative z-10">
                                            <p className={`text-amber-100 font-bold drop-shadow-lg tracking-wide transition-all ${isFullScreen ? "text-6xl md:text-8xl mb-16" : "text-xl md:text-2xl mb-2"}`}>
                                                {achievement.label}
                                            </p>
                                            <p className={`text-amber-300 font-black tracking-wider drop-shadow-2xl transition-all ${isFullScreen ? "text-9xl md:text-[12rem]" : "text-4xl md:text-5xl"}`} style={{ letterSpacing: '0.05em' }}>
                                                {achievement.rank}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 東京商工リサーチのテキスト */}
                        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-indigo-300 shadow-lg text-center transition-all ${isFullScreen ? "p-10 mb-10" : "p-6 mb-6"}`}>
                            <p className={`text-gray-800 font-bold transition-all ${isFullScreen ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                                東京商工リサーチ調べで、オンライン投資スクールとして<br />
                                <span className={`text-indigo-700 font-black transition-all ${isFullScreen ? "text-3xl md:text-4xl" : ""}`}>3つの分野で1位</span>を獲得しています
                            </p>
                        </div>

                        {/* 受講者数 */}
                        <div className={`bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 rounded-3xl shadow-2xl border-4 border-amber-400 text-center transition-all ${isFullScreen ? "p-12 mb-10" : "p-8"}`}>
                            <p className={`text-white font-bold transition-all ${isFullScreen ? "text-3xl md:text-4xl mb-4" : "text-2xl md:text-3xl mb-2"}`}>
                                現役生徒数
                            </p>
                            <p className={`text-amber-300 font-black transition-all ${isFullScreen ? "text-7xl md:text-8xl mb-4" : "text-5xl md:text-6xl mb-2"}`}>
                                {slide.students}
                            </p>
                            <p className={`text-white font-black transition-all ${isFullScreen ? "text-5xl md:text-6xl mb-6" : "text-4xl md:text-5xl mb-3"}`}>
                                を突破！
                            </p>
                            <p className={`text-amber-200 font-bold transition-all ${isFullScreen ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}>
                                {slide.note}
                            </p>
                        </div>

                        {/* マスコット画像追加 */}
                        <div className="absolute bottom-10 right-10 pointer-events-none opacity-20">
                            <Image src="/mascot/mascot_happy.png" alt="" width={isPreview ? 120 : 200} height={isPreview ? 120 : 200} className="animate-float" />
                        </div>
                        <div className="absolute top-40 left-10 pointer-events-none opacity-10">
                            <Image src="/mascot/mascot_cheer_blue.png" alt="" width={isPreview ? 80 : 150} height={isPreview ? 80 : 150} className="animate-float-slow" />
                        </div>
                    </div>
                </div>
            );
        }

        // 生徒実績スライド
        if (slide.type === "student_achievements") {
            const maxAmount = Math.max(...(slide.barChart?.data.map((d: { amount: number }) => d.amount) || [300]));

            return (
                <div className={`h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 flex flex-col relative overflow-y-auto transition-all duration-700 ${isFullScreen ? "p-4 md:p-8" : "p-6 md:p-8"}`}>
                    {/* 背景装飾 */}
                    <div className="absolute top-10 right-10 pointer-events-none opacity-10">
                        <Image src="/mascot/mascot_thinking.png" alt="" width={180} height={180} className="animate-float-slow" />
                    </div>
                    <div className="absolute bottom-20 left-10 pointer-events-none opacity-10">
                        <Image src="/mascot/mascot_happy.png" alt="" width={150} height={150} className="animate-bounce-gentle" />
                    </div>
                    {/* 背景装飾 */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-20 right-20 w-40 h-40 bg-pink-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className={`relative z-10 w-full mx-auto transition-all duration-700 ${isFullScreen ? "max-w-[98%]" : "max-w-6xl"}`}>
                        {/* ヘッダー */}
                        <div className={`text-center transition-all ${isFullScreen ? "mb-10" : "mb-6"}`}>
                            <h2 className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 transition-all ${isFullScreen ? "text-5xl md:text-6xl mb-6" : "text-3xl md:text-4xl mb-3"}`}>
                                {slide.title}
                            </h2>
                            <p className={`text-gray-700 font-bold bg-blue-900 text-white rounded-xl inline-block transition-all ${isFullScreen ? "text-xl md:text-2xl px-10 py-5" : "text-base md:text-lg px-6 py-3"}`}>
                                {slide.description}
                            </p>
                        </div>

                        {/* 2カラムレイアウト */}
                        <div className={`grid grid-cols-1 gap-6 transition-all ${isFullScreen ? "lg:grid-cols-2 gap-12" : "lg:grid-cols-2"}`}>
                            {/* 左: 円グラフ */}
                            <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-indigo-200 transition-all ${isFullScreen ? "p-10" : "p-6"}`}>
                                <div className="text-center mb-6">
                                    <h3 className={`font-bold text-gray-800 transition-all ${isFullScreen ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                                        {slide.pieChart?.title}
                                    </h3>
                                </div>

                                {/* 円グラフ */}
                                <div className={`flex items-center justify-center relative transition-all ${isFullScreen ? "pt-24 pb-16" : "pt-8"}`}>
                                    {/* ラベル */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 animate-fade-in-left z-10 transition-all ${isFullScreen ? "-left-16" : "-left-8"}`} style={{ animationDelay: '2s' }}>
                                        <div className={`text-right bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all ${isFullScreen ? "p-8 border-2 border-blue-100" : "p-6"}`}>
                                            <p className={`font-bold text-blue-400 transition-all ${isFullScreen ? "text-4xl mb-4" : "text-2xl mb-2"}`}>投資経験者</p>
                                            <p className={`font-black text-blue-400 transition-all ${isFullScreen ? "text-7xl md:text-9xl" : "text-5xl md:text-7xl"}`}>34%</p>
                                        </div>
                                    </div>
                                    <div className={`absolute top-1/2 -translate-y-1/2 animate-fade-in-right z-10 transition-all ${isFullScreen ? "-right-16" : "-right-8"}`} style={{ animationDelay: '1.2s' }}>
                                        <div className={`text-left bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl transition-all ${isFullScreen ? "p-8 border-2 border-blue-100" : "p-6"}`}>
                                            <p className={`font-bold text-blue-900 transition-all ${isFullScreen ? "text-4xl mb-4" : "text-2xl mb-2"}`}>投資初心者</p>
                                            <p className={`font-black text-blue-900 transition-all ${isFullScreen ? "text-7xl md:text-9xl" : "text-5xl md:text-7xl"}`}>66%</p>
                                        </div>
                                    </div>

                                    {/* SVG円グラフ */}
                                    <svg className={`transition-all ${isFullScreen ? "w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]" : "w-64 h-64"}`} viewBox="0 0 200 200">
                                        <circle cx="100" cy="100" r="70" fill="none" stroke="#60a5fa" strokeWidth="50" className="animate-fade-in-circle" key={`bg-circle-${currentSlide}-${isFullScreen}`} />
                                        <circle cx="100" cy="100" r="70" fill="none" stroke="#1e3a8a" strokeWidth="55" strokeDasharray="440" strokeDashoffset="440" transform="rotate(-90 100 100)" className="animate-fill-pie" key={`main-circle-${currentSlide}-${isFullScreen}`} />
                                        <circle cx="100" cy="100" r="40" fill="white" className="animate-scale-center" key={`center-circle-${currentSlide}-${isFullScreen}`} />
                                    </svg>
                                </div>
                            </div>

                            {/* 右: 棒グラフ */}
                            <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-indigo-200 transition-all ${isFullScreen ? "p-16 flex flex-col justify-center border-4" : "p-6"}`}>
                                <div className={`text-center transition-all ${isFullScreen ? "mb-12" : "mb-4"}`}>
                                    <h3 className={`font-bold text-gray-800 transition-all ${isFullScreen ? "text-4xl md:text-6xl mb-6" : "text-xl md:text-2xl mb-2"}`}>
                                        {slide.barChart?.title}
                                    </h3>
                                    <p className={`font-bold text-white bg-blue-900 rounded-lg inline-block transition-all ${isFullScreen ? "text-3xl md:text-4xl px-10 py-5" : "text-sm md:text-base px-4 py-2"}`}>
                                        {slide.barChart?.subtitle}
                                    </p>
                                </div>

                                {/* 棒グラフ */}
                                <div className={`relative transition-all ${isFullScreen ? "h-[650px] mb-12" : "h-80 mb-4"}`}>
                                    <div className="absolute inset-0 flex items-end justify-around px-4">
                                        {slide.barChart?.data.map((item: { amount: number; highlight?: boolean; color: string; period: string }, index: number) => (
                                            <div key={index} className="flex flex-col items-center flex-1 mx-1 h-full">
                                                {/* 金額ラベル */}
                                                <div className={`font-black mb-4 transition-all ${item.highlight ? 'text-red-600' : 'text-pink-600'} ${isFullScreen ? "text-4xl md:text-6xl" : "text-base md:text-xl"}`}>
                                                    約{item.amount}万円
                                                </div>

                                                {/* 棒のコンテナ */}
                                                <div className="flex-1 w-full flex items-end">
                                                    {/* 棒 */}
                                                    <div
                                                        key={`bar-${index}-${currentSlide}`}
                                                        className={`w-full ${item.color} rounded-t-xl transition-all duration-1000 ease-out relative group hover:opacity-90 ${item.highlight ? 'scale-105 border-4 border-yellow-600' : ''}`}
                                                        style={{
                                                            height: `${(item.amount / maxAmount) * 100}%`,
                                                            animation: `growUpSequence 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.4}s both`,
                                                            boxShadow: item.highlight ? '0 0 30px rgba(234, 179, 8, 0.8), 0 0 60px rgba(234, 179, 8, 0.4)' : '0 0 10px rgba(59, 130, 246, 0.3)',
                                                            minHeight: '20px'
                                                        }}
                                                    >
                                                        {/* ホバー時のグロー効果 */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>
                                                    </div>
                                                </div>

                                                {/* 期間ラベル */}
                                                <div className={`mt-6 text-center transition-all ${isFullScreen ? "scale-150" : ""}`}>
                                                    <div className="bg-blue-900 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap">
                                                        {item.period}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 注釈 */}
                                <p className={`text-gray-600 text-center transition-all ${isFullScreen ? "text-xl md:text-2xl mt-8" : "text-xs mt-2"}`}>
                                    {slide.barChart?.note}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* アニメーション用のスタイル */}
                    <style jsx>{`
                        @keyframes growUp {
                            0% {
                                height: 0 !important;
                                opacity: 0;
                                transform: scaleY(0);
                            }
                            70% {
                                transform: scaleY(1.05);
                            }
                            100% {
                                opacity: 1;
                                transform: scaleY(1);
                            }
                        }
                        
                        .animate-grow-bar {
                            animation: growUp 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                            transform-origin: bottom;
                        }
                        
                        @keyframes scaleIn {
                            0% {
                                transform: scale(0) rotate(0deg);
                                opacity: 0;
                            }
                            50% {
                                transform: scale(1.1) rotate(180deg);
                            }
                            100% {
                                transform: scale(1) rotate(360deg);
                                opacity: 1;
                            }
                        }
                        
                        .animate-scale-in {
                            animation: scaleIn 1s ease-out both;
                        }
                        
                        @keyframes fadeInLeft {
                            0% {
                                opacity: 0;
                                transform: translateX(-30px) translateY(-50%);
                            }
                            100% {
                                opacity: 1;
                                transform: translateX(0) translateY(-50%);
                            }
                        }
                        
                        .animate-fade-in-left {
                            animation: fadeInLeft 0.8s ease-out both;
                        }
                        
                        @keyframes fadeInRight {
                            0% {
                                opacity: 0;
                                transform: translateX(30px) translateY(-50%);
                            }
                            100% {
                                opacity: 1;
                                transform: translateX(0) translateY(-50%);
                            }
                        }
                        
                        .animate-fade-in-right {
                            animation: fadeInRight 0.8s ease-out both;
                        }
                        
                        @keyframes fadeInCircle {
                            0% {
                                opacity: 0;
                                transform: scale(0.8);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                        
                        .animate-fade-in-circle {
                            animation: fadeInCircle 0.6s ease-out both;
                        }
                        
                        @keyframes fillPie {
                            0% {
                                stroke-dashoffset: 440;
                                opacity: 0;
                            }
                            10% {
                                opacity: 1;
                            }
                            100% {
                                stroke-dashoffset: ${440 - 66 * 4.4};
                                opacity: 1;
                            }
                        }
                        
                        .animate-fill-pie {
                            animation: fillPie 2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
                        }
                        
                        @keyframes scaleCenter {
                            0% {
                                transform: scale(0);
                                opacity: 0;
                            }
                            50% {
                                transform: scale(0);
                                opacity: 0;
                            }
                            100% {
                                transform: scale(1);
                                opacity: 1;
                            }
                        }
                        
                        .animate-scale-center {
                            animation: scaleCenter 2s ease-out both;
                        }
                        
                        @keyframes growUpSequence {
                            0% {
                                height: 0 !important;
                                opacity: 0;
                                transform: scaleY(0);
                            }
                            70% {
                                transform: scaleY(1.08);
                            }
                            100% {
                                opacity: 1;
                                transform: scaleY(1);
                            }
                        }
                    `}</style>
                </div>
            );
        }

        if (slide.type === "learning_method_comparison") {
            return (
                <div className={`relative h-full flex flex-col bg-white overflow-y-auto scroll-smooth transition-all duration-700 ${isFullScreen ? "p-4 md:p-8" : "p-8"}`} style={{ willChange: 'scroll-position' }}>
                    {/* タイトルとサブタイトル */}
                    <div className={`text-center animate-fade-in-down transition-all ${isFullScreen ? "mb-12" : "mb-8"}`}>
                        <h2 className={`font-black text-gray-900 transition-all ${isFullScreen ? "text-5xl md:text-8xl mb-8" : "text-3xl md:text-5xl mb-3"}`}>
                            {slide.title}
                        </h2>
                        <p className={`font-bold text-blue-600 transition-all ${isFullScreen ? "text-3xl md:text-5xl" : "text-lg md:text-2xl"}`}>
                            {slide.subtitle}
                        </p>
                    </div>

                    {/* 2カラム比較レイアウト */}
                    <div className={`grid grid-cols-1 mx-auto w-full flex-1 transition-all ${isFullScreen ? "lg:grid-cols-2 gap-20 max-w-[98%]" : "lg:grid-cols-2 gap-8 max-w-7xl"}`}>
                        {/* 左側: 独学の場合 */}
                        <div className={`bg-white rounded-[4rem] shadow-2xl border-4 border-gray-200 animate-slide-in-left flex flex-col transition-all ${isFullScreen ? "p-16 md:p-24" : "p-6 md:p-8"}`}>
                            {/* タイトル */}
                            <div className={`bg-gray-600 text-white text-center rounded-3xl shadow-xl transition-all ${isFullScreen ? "py-12 mb-20" : "py-4 mb-6"}`}>
                                <h3 className={`font-black transition-all ${isFullScreen ? "text-6xl md:text-8xl" : "text-2xl md:text-3xl"}`}>{slide.selfStudy?.title}</h3>
                            </div>

                            {/* 困っている人のイラスト */}
                            <div className={`text-center animate-bounce-slow transition-all ${isFullScreen ? "mb-32" : "mb-6"}`}>
                                <div className={`relative mx-auto transition-all ${isFullScreen ? "w-[1200px] h-[1000px] md:w-[1600px] md:h-[1400px]" : "w-48 h-48 md:w-56 md:h-56"}`}>
                                    <Image
                                        src="/slides/confused_person_v2.png"
                                        alt="困っている人"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <p className={`text-gray-600 font-black mt-20 transition-all ${isFullScreen ? "text-[10rem]" : "text-lg"}`}>情報が混乱...</p>
                            </div>

                            {/* フラフラ曲線と問題点の統合ビジュアル */}
                            <div className={`relative flex-1 flex items-center justify-center transition-all ${isFullScreen ? "min-h-[800px]" : "min-h-[500px]"}`}>
                                <svg viewBox="0 0 400 600" className={`w-full h-full mx-auto transition-all ${isFullScreen ? "max-w-2xl" : "max-w-md"}`}>
                                    <defs>
                                        <marker id="arrowhead-gray-vertical" markerWidth="10" markerHeight="10"
                                            refX="5" refY="5" orient="auto">
                                            <polygon points="0 0, 10 5, 0 10" fill="#6b7280" />
                                        </marker>
                                    </defs>

                                    {/* フラフラ曲線 - 縦軸で大きく左右に揺れる */}
                                    <path
                                        d="M 200 50 
                                           C 120 120, 120 150, 200 200
                                           C 280 250, 280 280, 200 330
                                           C 120 380, 120 410, 200 460
                                           L 200 550"
                                        stroke="#6b7280"
                                        strokeWidth="5"
                                        fill="none"
                                        strokeDasharray="10,5"
                                        markerEnd="url(#arrowhead-gray-vertical)"
                                        className="animate-draw-path-vertical"
                                    />

                                    {/* 現在ラベル */}
                                    <text x="200" y="35" className="text-xl font-bold fill-gray-700" textAnchor="middle">現在</text>

                                    {/* 理想ラベル */}
                                    <text x="200" y="585" className="text-xl font-bold fill-gray-700" textAnchor="middle">理想</text>

                                    {/* 問題点1 - 左側の屈曲部 */}
                                    <g className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                        <foreignObject x={isFullScreen ? "-20" : "10"} y="110" width={isFullScreen ? "250" : "150"} height={isFullScreen ? "150" : "80"}>
                                            <div className={`flex items-start bg-white rounded-2xl shadow-xl border-2 border-red-200 transition-all ${isFullScreen ? "p-6 gap-4" : "p-3 gap-2"}`}>
                                                <span className={`text-red-500 flex-shrink-0 transition-all ${isFullScreen ? "text-4xl" : "text-xl"}`}>❌</span>
                                                <p className={`text-gray-700 font-bold transition-all ${isFullScreen ? "text-2xl" : "text-sm"}`}>{slide.selfStudy?.problems[0]}</p>
                                            </div>
                                        </foreignObject>
                                    </g>

                                    {/* 問題点2 - 右側の屈曲部 */}
                                    <g className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                        <foreignObject x="240" y="240" width="150" height="80">
                                            <div className="flex items-start gap-2 bg-white p-3 rounded-lg shadow-lg border-2 border-red-200">
                                                <span className="text-red-500 text-xl flex-shrink-0">❌</span>
                                                <p className="text-gray-700 font-medium text-sm">{slide.selfStudy?.problems[1]}</p>
                                            </div>
                                        </foreignObject>
                                    </g>

                                    {/* 問題点3 - 左側の屈曲部 */}
                                    <g className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                        <foreignObject x="10" y="370" width="150" height="80">
                                            <div className="flex items-start gap-2 bg-white p-3 rounded-lg shadow-lg border-2 border-red-200">
                                                <span className="text-red-500 text-xl flex-shrink-0">❌</span>
                                                <p className="text-gray-700 font-medium text-sm">{slide.selfStudy?.problems[2]}</p>
                                            </div>
                                        </foreignObject>
                                    </g>
                                </svg>
                            </div>

                        </div>

                        {/* 右側: GFSの場合 */}
                        <div className={`bg-white rounded-[4rem] shadow-2xl border-4 border-blue-400 animate-slide-in-right flex flex-col transition-all ${isFullScreen ? "p-16 md:p-24" : "p-6 md:p-8"}`}>
                            {/* タイトル */}
                            <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-3xl shadow-xl transition-all ${isFullScreen ? "py-12 mb-12" : "py-4 mb-4"}`}>
                                <h3 className={`font-black transition-all ${isFullScreen ? "text-6xl md:text-8xl" : "text-2xl md:text-3xl"}`}>{slide.gfsMethod?.title}</h3>
                            </div>

                            {/* サブタイトル */}
                            <div className={`text-center text-blue-900 font-black mb-12 leading-relaxed transition-all ${isFullScreen ? "text-4xl md:text-5xl mb-16" : "text-base md:text-lg mb-6"}`}>
                                <p>未経験者でも3ヶ月で投資ができる</p>
                                <p>学習プログラムを提供</p>
                            </div>

                            {/* 笑顔の人のイラスト */}
                            <div className={`text-center animate-scale-in transition-all ${isFullScreen ? "mb-32" : "mb-6"}`}>
                                <div className={`relative mx-auto transition-all ${isFullScreen ? "w-[1200px] h-[1000px] md:w-[1600px] md:h-[1400px]" : "w-48 h-48 md:w-56 md:h-56"}`}>
                                    <Image
                                        src="/slides/happy_person_v2.png"
                                        alt="笑顔の人"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* まっすぐなパスとプログラムの統合ビジュアル */}
                            <div className="relative flex-1 min-h-[500px] flex items-center justify-center">
                                <svg viewBox="0 0 400 600" className="w-full h-full max-w-md mx-auto">
                                    <defs>
                                        <marker id="arrowhead-blue-vertical" markerWidth="10" markerHeight="10"
                                            refX="5" refY="5" orient="auto">
                                            <polygon points="0 0, 10 5, 0 10" fill="#3b82f6" />
                                        </marker>
                                        <marker id="arrowhead-orange-vertical" markerWidth="10" markerHeight="10"
                                            refX="5" refY="5" orient="auto">
                                            <polygon points="0 0, 10 5, 0 10" fill="#fb923c" />
                                        </marker>
                                    </defs>

                                    {/* 専任コンサル用の2本目の軸（伴走型） */}
                                    <line
                                        x1="270" y1="50"
                                        x2="270" y2="550"
                                        stroke="#fb923c"
                                        strokeWidth="4"
                                        strokeDasharray="8,4"
                                        markerEnd="url(#arrowhead-orange-vertical)"
                                        className="animate-draw-line-vertical"
                                        style={{ animationDelay: '0.2s' }}
                                    />

                                    {/* ホバー時の接続線 (オレンジ軸 -> 青軸) */}
                                    {hoveredProgram !== null && (
                                        <line
                                            x1="270" y1={[110, 240, 370, 500][hoveredProgram]}
                                            x2="110" y2={[110, 240, 370, 500][hoveredProgram]}
                                            stroke="#fb923c"
                                            strokeWidth="3"
                                            strokeDasharray="4,2"
                                            className="animate-draw-line-horizontal"
                                        />
                                    )}

                                    {/* 専任コンサル軸の結節点（同期） */}
                                    <g className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
                                        <circle cx="270" cy="110" r="5" fill="#fb923c" />
                                        <circle cx="270" cy="240" r="5" fill="#fb923c" />
                                        <circle cx="270" cy="370" r="5" fill="#fb923c" />
                                        <circle cx="270" cy="500" r="5" fill="#fb923c" />
                                    </g>

                                    {/* まっすぐな矢印 - 縦軸 */}
                                    <line
                                        x1="110" y1="50"
                                        x2="110" y2="550"
                                        stroke="#3b82f6"
                                        strokeWidth="6"
                                        markerEnd="url(#arrowhead-blue-vertical)"
                                        className="animate-draw-line-vertical"
                                    />

                                    {/* 現在ラベル */}
                                    <text x="110" y="35" className="text-xl font-black fill-blue-700" textAnchor="middle">現在</text>
                                    <text x="270" y="22" className="text-xs md:text-sm font-black fill-orange-600" textAnchor="middle">
                                        <tspan x="270" dy="0">専任コンサルタントによる</tspan>
                                        <tspan x="270" dy="1.4em">充実したサポート</tspan>
                                    </text>

                                    {/* 理想ラベル */}
                                    <text x="190" y="585" className="text-4xl md:text-5xl font-black fill-blue-800 drop-shadow-sm" textAnchor="middle">理想</text>

                                    {/* 各プログラムステップ */}
                                    {[
                                        { y: 110, delay: '0.3s', desc: "あなたに最適な学習プランを提案" },
                                        { y: 240, delay: '0.4s', desc: "あなたの目標設計をサポート" },
                                        { y: 370, delay: '0.5s', desc: "あなたにピッタリな\n分析・戦略を\n一緒に考えます" },
                                        { y: 500, delay: '0.6s', desc: "疑問・不安を\n丸ごと解決" }
                                    ].map((step, idx) => (
                                        <g
                                            key={idx}
                                            className="animate-fade-in-up cursor-pointer transition-all duration-300"
                                            style={{ animationDelay: step.delay }}
                                            onMouseEnter={() => setHoveredProgram(idx)}
                                            onMouseLeave={() => setHoveredProgram(null)}
                                        >
                                            {/* 青い結節点 */}
                                            <circle
                                                cx="110" cy={step.y} r={hoveredProgram === idx ? 10 : 8}
                                                fill="#3b82f6"
                                                className="transition-all duration-300"
                                            />

                                            {/* ラベルボックス */}
                                            <foreignObject x="0" y={step.y - 30} width="110" height="60">
                                                <div className={`flex items-center justify-center bg-white p-1 rounded-lg border-2 transition-all duration-300 origin-center ${hoveredProgram === idx ? 'shadow-xl scale-110 border-blue-400' : 'shadow-md border-blue-200'}`}>
                                                    <p className="text-blue-900 font-bold text-[10px] items-center leading-tight whitespace-pre-line text-center">
                                                        {slide.gfsMethod?.programs[idx]}
                                                    </p>
                                                </div>
                                            </foreignObject>

                                            {/* 専任コンサル詳細ボックス（ホバー時） */}
                                            {hoveredProgram === idx && (
                                                <g className="animate-fade-in">
                                                    <foreignObject x="285" y={step.y - 30} width="110" height="70">
                                                        <div className="bg-orange-50 border-2 border-orange-400 p-2 rounded-xl shadow-lg flex items-center justify-center relative">
                                                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-orange-400"></div>
                                                            <p className="text-orange-800 font-bold text-[10px] leading-snug whitespace-pre-line text-center">
                                                                {step.desc}
                                                            </p>
                                                        </div>
                                                    </foreignObject>
                                                </g>
                                            )}
                                        </g>
                                    ))}
                                </svg>
                            </div>

                        </div>
                    </div>

                    {/* アニメーション用のスタイル */}
                    <style jsx>{`
                        @keyframes drawPath {
                            from {
                                stroke-dashoffset: 1000;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }

                        .animate-draw-path {
                            stroke-dasharray: 1000;
                            animation: drawPath 2.5s ease-out 0.5s forwards;
                        }

                        @keyframes drawLine {
                            from {
                                stroke-dashoffset: 300;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }

                        .animate-draw-line {
                            stroke-dasharray: 300;
                            animation: drawLine 1.5s ease-out 0.5s forwards;
                        }

                        @keyframes drawPathVertical {
                            from {
                                stroke-dashoffset: 1500;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }

                        .animate-draw-path-vertical {
                            stroke-dasharray: 1500;
                            animation: drawPathVertical 3s ease-out 0.5s forwards;
                        }

                        @keyframes drawLineHorizontal {
                            from {
                                stroke-dashoffset: 200;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }

                        .animate-draw-line-horizontal {
                            stroke-dasharray: 200;
                            animation: drawLineHorizontal 0.4s ease-out forwards;
                        }

                        @keyframes drawLineVertical {
                            from {
                                stroke-dashoffset: 500;
                            }
                            to {
                                stroke-dashoffset: 0;
                            }
                        }

                        .animate-draw-line-vertical {
                            stroke-dasharray: 500;
                            animation: drawLineVertical 2s ease-out 0.5s forwards;
                        }

                        @keyframes slideInLeft {
                            from {
                                opacity: 0;
                                transform: translateX(-50px);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0);
                            }
                        }

                        .animate-slide-in-left {
                            animation: slideInLeft 0.8s ease-out forwards;
                        }

                        @keyframes slideInRight {
                            from {
                                opacity: 0;
                                transform: translateX(50px);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0);
                            }
                        }

                        .animate-slide-in-right {
                            animation: slideInRight 0.8s ease-out forwards;
                        }

                        @keyframes bounceSlow {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                        }

                        .animate-bounce-slow {
                            animation: bounceSlow 2s ease-in-out infinite;
                        }
                    `}</style>
                </div>
            );
        }

        if (slide.type === "image") {
            return (
                <div className="relative h-full flex flex-col items-center justify-center bg-white p-8">
                    {/* 画像をトリミングして表示 */}
                    <div className="relative w-full h-full max-w-5xl">
                        <Image
                            src={slide.image!}
                            alt={slide.title}
                            fill
                            className="object-contain"
                            style={{ objectPosition: slide.objectPosition || "center center" }}
                            priority={currentSlide === 0}
                        />
                    </div>
                </div>
            );
        }

        // カスタムスライド
        return (
            <div className={`relative h-full bg-gradient-to-br ${slide.color} p-8 md:p-12 flex flex-col justify-center text-white overflow-hidden`}>
                {/* キャラクター画像1 - 右下に配置 */}
                {slide.characterImage && (
                    <div className={`absolute right-4 bottom-4 opacity-40 animate-float pointer-events-none z-10 transition-all duration-700 ${isFullScreen ? "w-[400px] h-[400px] md:w-[700px] md:h-[700px] right-20 bottom-20" : "w-48 h-48 md:w-64 md:h-64"}`}>
                        <Image
                            src={slide.characterImage}
                            alt="キャラクター"
                            fill
                            className="object-contain"
                        />
                    </div>
                )}

                {/* キャラクター画像2 - 斜め左上にずらして配置（重ならないように） */}
                {slide.characterImage2 && (
                    <div className={`absolute right-48 bottom-40 opacity-40 animate-float pointer-events-none z-20 transition-all duration-700 ${isFullScreen ? "w-[400px] h-[400px] md:w-[700px] md:h-[700px] right-[400px] bottom-[300px]" : "w-48 h-48 md:w-64 md:h-64"}`} style={{ animationDelay: '0.5s' }}>
                        <Image
                            src={slide.characterImage2}
                            alt="キャラクター2"
                            fill
                            className="object-contain"
                        />
                    </div>
                )}

                <div className={`mx-auto w-full relative z-10 transition-all duration-700 ${isFullScreen ? "max-w-[95%] space-y-16" : "max-w-4xl space-y-4"}`}>
                    <div className="flex items-center gap-6 mb-6">
                        {slide.icon && (
                            <div className={`bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${isFullScreen ? "p-8 w-24 h-24" : "p-4 w-16 h-16"}`}>
                                <slide.icon className={`transition-all ${isFullScreen ? "w-16 h-16" : "w-10 h-10"} animate-bounce-gentle`} />
                            </div>
                        )}
                        <div>
                            {isFullScreen && <p className="text-3xl font-bold opacity-60 mb-4 uppercase tracking-[0.5em] font-serif">Section 01 / Concept</p>}
                            <h2 className={`font-black transition-all ${isFullScreen ? "text-6xl md:text-9xl mb-10" : "text-3xl md:text-4xl"}`}>
                                {slide.title}
                            </h2>
                        </div>
                    </div>

                    <div className={`transition-all ${isFullScreen ? "space-y-16 pl-12 border-l-[12px] border-white/20" : "space-y-4"}`}>
                        <h3 className={`font-black mb-4 transition-all ${isFullScreen ? "text-5xl md:text-8xl leading-tight" : "text-2xl md:text-3xl"}`}>
                            {slide.content?.heading}
                        </h3>
                        {slide.content?.subheading && (
                            <p className={`opacity-90 font-bold transition-all ${isFullScreen ? "text-3xl md:text-5xl mb-16" : "text-xl md:text-2xl mb-6"}`}>
                                {slide.content.subheading}
                            </p>
                        )}
                        <ul className={`${isFullScreen ? "grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12" : "space-y-3 md:space-y-4"}`}>
                            {slide.content?.points.map((point: string, index: number) => (
                                <li key={index} className="flex items-start gap-8 transition-all">
                                    <div className="mt-4 text-white/60">
                                        <div className={`bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] transition-all ${isFullScreen ? "w-8 h-8" : "w-3 h-3"}`} />
                                    </div>
                                    <span className={`font-bold transition-all ${isFullScreen ? "text-3xl md:text-5xl leading-tight" : "text-lg md:text-xl"}`}>
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

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
                    src="/mascot/mascot_happy.png"
                    alt=""
                    width={250}
                    height={250}
                    className="absolute -top-10 -right-10 opacity-10 animate-float-slow"
                />
                <Image
                    src="/mascot/mascot_search.png"
                    alt=""
                    width={200}
                    height={200}
                    className="absolute bottom-20 -left-10 opacity-10 animate-float-delayed"
                />
            </div>

            <div className="relative z-10 min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* セクションヘッダー */}
                    <div className={`text-center mb-8 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto px-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onBack}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                戻る
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onGoToAgenda}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                目次
                            </Button>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur rounded-full mb-4">
                            <span className="text-primary font-bold">Section 01</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">簡単に弊社のご紹介</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            GFSへようこそ
                        </h1>
                        <p className="text-gray-600">
                            まずはGFSについてご紹介させてください
                        </p>
                    </div>

                    {/* メインスライド */}
                    <div className={`relative mb-8 transition-all duration-700 delay-200 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* スライドコンテンツ */}
                            <div
                                ref={scrollContainerRef}
                                className="relative h-96 md:h-[600px] overflow-y-auto"
                            >
                                {slides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                            }`}
                                    >
                                        <div className="relative h-full group/slide-container">
                                            {/* 各スライド共通の全画面化ボタン */}
                                            {index === currentSlide && (
                                                <button
                                                    onClick={() => setIsFullScreen(true)}
                                                    className="absolute top-4 right-4 z-40 p-3 bg-white/20 hover:bg-white/40 rounded-full opacity-0 group-hover/slide-container:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/30 shadow-xl"
                                                    title="全画面で表示"
                                                >
                                                    <Maximize2 className={`w-6 h-6 ${slide.type === 'custom' ? 'text-white' : 'text-gray-700'}`} />
                                                </button>
                                            )}

                                            {renderSlide(slide)}

                                            {/* スライド内部のナビゲーション矢印 */}
                                            {index === currentSlide && (
                                                <>
                                                    {/* 左矢印 */}
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-24 z-40 flex items-center justify-start pl-6 cursor-pointer group/nav-left"
                                                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                                    >
                                                        <div className="p-4 bg-white/10 opacity-0 group-hover/nav-left:opacity-100 transition-all duration-300 rounded-full backdrop-blur-md border border-white/20 shadow-2xl group-hover/nav-left:translate-x-2">
                                                            <ChevronLeft className={`w-8 h-8 ${slide.type === 'custom' ? 'text-white' : 'text-gray-800'}`} />
                                                        </div>
                                                    </div>

                                                    {/* 右矢印 */}
                                                    <div
                                                        className="absolute right-0 top-0 bottom-0 w-24 z-40 flex items-center justify-end pr-6 cursor-pointer group/nav-right"
                                                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                                    >
                                                        <div className="p-4 bg-white/10 opacity-0 group-hover/nav-right:opacity-100 transition-all duration-300 rounded-full backdrop-blur-md border border-white/20 shadow-2xl group-hover/nav-right:-translate-x-2">
                                                            <ChevronRight className={`w-8 h-8 ${slide.type === 'custom' ? 'text-white' : 'text-gray-800'}`} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ナビゲーション（ページネーションのみ） */}
                            <div className="flex items-center justify-center p-6 bg-white border-t border-gray-100 relative">
                                <div className="flex items-center gap-3">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`transition-all duration-500 ${index === currentSlide
                                                ? "w-10 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/20"
                                                : "w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-300"
                                                }`}
                                            aria-label={`スライド${index + 1}へ`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* スライドタイトルと説明 */}
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {slides[currentSlide].title}
                            </h3>
                            {slides[currentSlide].description && (
                                <p className="text-gray-600">
                                    {slides[currentSlide].description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 次へボタン */}
                    <div className={`text-center transition-all duration-700 delay-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <Button
                            onClick={onNext}
                            size="lg"
                            className="min-w-64 text-lg h-14 shadow-xl animate-pulse-border"
                        >
                            <Sparkles className="w-5 h-5" />
                            あなたのことを聞かせてください
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 会社の外観オーバーレイ */}
            {showExteriorOverlay && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4 md:p-8 cursor-pointer"
                    onClick={() => setShowExteriorOverlay(false)}
                >
                    <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                            <Image
                                src="/images/company_exterior.jpg"
                                alt="会社の外観 大画像"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <button
                            className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/30 font-bold transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExteriorOverlay(false);
                            }}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {/* 全画面オーバーレイ（前の仕様を復元・拡張） */}
            {isFullScreen && (
                <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>

                    {/* 閉じるボタン */}
                    <button
                        onClick={() => setIsFullScreen(false)}
                        className="absolute top-8 right-8 z-[130] p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/20 transition-all group"
                    >
                        <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* 左右ナビゲーションエリア */}
                    <div
                        className="absolute left-0 top-0 w-1/4 h-full z-[120] cursor-pointer group/nav"
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    >
                        <div className="absolute left-12 top-1/2 -translate-y-1/2 p-4 bg-white/5 opacity-0 group-hover/nav:opacity-100 transition-all rounded-full backdrop-blur-sm border border-white/10">
                            <ChevronLeft className="w-12 h-12 text-white/50" />
                        </div>
                    </div>
                    <div
                        className="absolute right-0 top-0 w-1/4 h-full z-[120] cursor-pointer group/nav"
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    >
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 p-4 bg-white/5 opacity-0 group-hover/nav:opacity-100 transition-all rounded-full backdrop-blur-sm border border-white/10">
                            <ChevronRight className="w-12 h-12 text-white/50" />
                        </div>
                    </div>

                    {/* スライド本体 */}
                    <div className="relative w-full h-full overflow-hidden animate-in zoom-in-95 duration-500">
                        {renderSlide(slides[currentSlide])}
                    </div>

                    {/* 下部ページネーション */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-[125]">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 transition-all duration-500 rounded-full ${i === currentSlide ? "w-12 bg-white" : "w-4 bg-white/30"}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
