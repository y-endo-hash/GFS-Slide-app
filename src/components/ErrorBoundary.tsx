"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-red-50 rounded-[2rem] border-2 border-red-100 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">何かがうまくいきませんでした</h2>
                    <p className="text-sm text-slate-500 mb-6 max-w-md">
                        申し訳ありません。画面の読み込み中にエラーが発生しました。
                        開発者モードでのプレビュー中に同期の問題が発生した可能性があります。
                    </p>
                    <Button
                        variant="default"
                        onClick={this.handleReset}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        画面を再読み込み
                    </Button>
                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-8 p-4 bg-white/50 rounded-xl text-left overflow-auto max-w-full">
                            <p className="text-[10px] font-mono text-red-800 break-all caps-all">
                                {this.state.error?.toString()}
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
