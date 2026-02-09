/**
 * 完全同期システムユーティリティ
 * 
 * BroadcastChannelとlocalStorageを使って、
 * メイン画面と開発者モードのLIVE画面を完全同期させる
 */

import { AppState, SyncMessage } from '@/types';

const CHANNEL_NAME = 'gfs-sync';
const STORAGE_KEY = 'gfs-app-state';
const DEBUG = process.env.NODE_ENV === 'development';

/**
 * デバッグログ出力
 */
function log(...args: unknown[]) {
    if (DEBUG) {
        console.log('[GFS Sync]', ...args);
    }
}

/**
 * 状態をBroadcastChannelで送信
 */
export function broadcastState(
    channel: BroadcastChannel,
    state: AppState,
    type: SyncMessage['type'] = 'SYNC_STATE'
) {
    const message: SyncMessage = {
        type,
        state,
        timestamp: Date.now(),
    };

    try {
        channel.postMessage(message);
        log(`Broadcast ${type}:`, state);
    } catch (error) {
        console.error('[GFS Sync] Failed to broadcast:', error);
    }
}

/**
 * 状態をlocalStorageに保存
 */
export function saveStateToLocalStorage(state: AppState) {
    try {
        const serialized = JSON.stringify({
            ...state,
            timestamp: Date.now(),
        });
        localStorage.setItem(STORAGE_KEY, serialized);
        log('Saved to localStorage:', state);
    } catch (error) {
        console.error('[GFS Sync] Failed to save to localStorage:', error);
    }
}

/**
 * 状態をlocalStorageから読み込み
 */
export function loadStateFromLocalStorage(): AppState | null {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) return null;

        const data = JSON.parse(serialized);
        log('Loaded from localStorage:', data);

        return {
            phase: data.phase,
            subStep: data.subStep,
            userData: data.userData,
            simulationResult: data.simulationResult,
        };
    } catch (error) {
        console.error('[GFS Sync] Failed to load from localStorage:', error);
        return null;
    }
}

/**
 * BroadcastChannelを作成
 */
export function createSyncChannel(): BroadcastChannel {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    log('Channel created:', CHANNEL_NAME);
    return channel;
}

/**
 * 状態を完全に同期（BroadcastChannel + localStorage）
 */
export function syncState(channel: BroadcastChannel, state: AppState) {
    // BroadcastChannelで送信
    broadcastState(channel, state);

    // localStorageにも保存（フォールバック用）
    saveStateToLocalStorage(state);
}

/**
 * 同期リクエストを送信
 */
export function requestSync(channel: BroadcastChannel) {
    const message: SyncMessage = {
        type: 'REQUEST_SYNC',
        timestamp: Date.now(),
    };

    try {
        channel.postMessage(message);
        log('Sync requested');
    } catch (error) {
        console.error('[GFS Sync] Failed to request sync:', error);
    }
}
