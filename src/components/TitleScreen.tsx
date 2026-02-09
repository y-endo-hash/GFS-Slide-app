import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Gamepad2, Star } from 'lucide-react';
import Image from 'next/image';

interface TitleScreenProps {
    onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
    const [isPressed, setIsPressed] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    const handleStart = () => {
        setIsPressed(true);
        // Play a sound effect here if we had one!
        setTimeout(() => {
            onStart();
        }, 800);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col items-center justify-center font-sans selection:bg-blue-500/10">
            {/* 動的な背景要素（任天堂風の明るさと深み - ライトモード） */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* 浮遊するパーティクル */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-float-slow"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* キャラクターたちの躍動感ある配置 */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {/* メインキャラクター：応援（青） */}
                <div className="absolute top-[15%] left-[10%] animate-float-slow">
                    <Image src="/mascot/mascot_cheer_blue.png" alt="" width={220} height={220} className="drop-shadow-[0_20px_50px_rgba(59,130,246,0.2)] hover:scale-110 transition-transform duration-500" />
                </div>

                {/* サブ：ハッピー */}
                <div className="absolute bottom-[20%] left-[15%] animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
                    <Image src="/mascot/mascot_happy.png" alt="" width={180} height={180} className="drop-shadow-[0_15px_35px_rgba(16,185,129,0.15)]" />
                </div>

                {/* サブ：検索 */}
                <div className="absolute top-[20%] right-[12%] animate-float-delayed">
                    <Image src="/mascot/mascot_search.png" alt="" width={200} height={200} className="drop-shadow-[0_20px_45px_rgba(245,158,11,0.15)]" />
                </div>

                {/* サブ：電話（下部） */}
                <div className="absolute bottom-[10%] right-[18%] animate-float-slow" style={{ animationDelay: '1.2s' }}>
                    <Image src="/mascot/mascot_phone.png" alt="" width={190} height={190} className="drop-shadow-[0_15px_40px_rgba(99,102,241,0.2)]" />
                </div>
            </div>

            {/* メインタイトルエリア */}
            <div className={`relative z-10 flex flex-col items-center text-center px-4 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* サブタイトル */}
                <div className="bg-blue-600/5 backdrop-blur-md border border-blue-600/10 px-6 py-2 rounded-full mb-8 shadow-sm">
                    <span className="text-blue-600/70 text-sm font-black tracking-[0.3em] uppercase">Private Consulting Experience</span>
                </div>

                {/* メインロゴ風タイトル */}
                <div className="relative mb-16 py-4">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[1.15] py-2">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 drop-shadow-sm">
                            GFS投資
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
                            お悩み相談
                        </span>
                    </h1>

                    {/* キラキラ演出 */}
                    <div className="absolute -top-2 -right-8 animate-pulse">
                        <Sparkles className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="absolute -bottom-4 -left-10 animate-pulse" style={{ animationDelay: '0.7s' }}>
                        <Star className="w-10 h-10 text-indigo-500 fill-indigo-500/10" />
                    </div>
                </div>

                {/* スタートボタン */}
                <div className="mt-4 group relative">
                    {/* ボタンの背景光 */}
                    <div className="absolute inset-x-0 -inset-y-4 bg-blue-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                    <button
                        onClick={handleStart}
                        disabled={isPressed}
                        className={`relative px-16 py-6 rounded-full bg-slate-900 text-white font-black text-2xl tracking-[0.2em] shadow-2xl shadow-slate-200 hover:shadow-blue-200 hover:bg-blue-600 transition-all duration-300 transform active:scale-95 flex items-center gap-4 ${isPressed ? 'scale-150 opacity-0' : 'scale-100'}`}
                    >
                        <Play className="w-6 h-6 fill-current" />
                        START
                    </button>

                    {/* 下部の案内 */}
                    <div className={`mt-10 flex flex-col items-center transition-opacity duration-500 ${isPressed ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="text-slate-400 text-xs font-bold tracking-[0.5em] animate-pulse mb-4 uppercase">Click to Begin Journey</p>
                        <div className="flex gap-4">
                            <Gamepad2 className="w-5 h-5 text-slate-300" />
                            <div className="w-[1px] h-5 bg-slate-200" />
                            <Sparkles className="w-5 h-5 text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 画面端の装飾 */}
            <div className="absolute top-0 right-0 p-8">
                <Image src="/images/gfs_logo_navy.png" alt="GFS" width={80} height={80} className="opacity-10" />
            </div>

            <style jsx global>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-30px) rotate(2deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-25px) rotate(-3deg); }
                }
                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                .animate-bounce-gentle {
                    animation: bounce-gentle 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
