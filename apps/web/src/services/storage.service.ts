import { QuotaStatus } from '@kompass/shared/src/types/storage.types';

const MAX_STORAGE_BYTES = 50 * 1024 * 1024;
const WARNING_THRESHOLD = 0.8;
const CRITICAL_THRESHOLD = 0.95;

export class StorageService {
    private static instance: StorageService;
    private pinnedDocIds: Set<string> = new Set();

    private constructor() {
        this.loadPinnedDocs();
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    /**
     * Check current storage usage and return detailed status
     */
    public async checkQuota(): Promise<QuotaStatus> {
        let used = 0;

        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                used = estimate.usage || 0;
            } catch (error) {
                console.error('Failed to estimate storage:', error);
            }
        }

        const available = Math.max(0, MAX_STORAGE_BYTES - used);
        const percentage = (used / MAX_STORAGE_BYTES) * 100;

        let status: QuotaStatus['status'] = 'OK';
        if (percentage > CRITICAL_THRESHOLD * 100) status = 'Critical';
        else if (percentage > WARNING_THRESHOLD * 100) status = 'Warning';

        // Placeholder for breakdown - in a real scenario we'd query DB stats or maintain a counter
        const breakdown = {
            tier1Essential: 0,
            tier2Recent: 0,
            tier3Pinned: 0,
        };

        return {
            total: MAX_STORAGE_BYTES,
            used,
            available,
            percentage,
            breakdown,
            status,
            message: this.getStatusMessage(status, percentage),
        };
    }

    public isEssential(entity: any, currentUserId: string): boolean {
        if (!entity) return false;

        // User Profile
        if (entity.type === 'user' && entity._id === `user-${currentUserId}`) return true;

        // Assigned Customers (ADM)
        if (entity.type === 'customer' && entity.owner === currentUserId) return true;

        // Active Opportunities
        if (entity.type === 'opportunity' &&
            entity.owner === currentUserId &&
            ['New', 'Qualification', 'Proposal'].includes(entity.status)) return true;

        // Today's Appointments (Activity)
        if (entity.type === 'activity' && this.isTodayOrTomorrow(entity.date)) return true;

        return false;
    }

    public isPinned(docId: string): boolean {
        return this.pinnedDocIds.has(docId);
    }

    public pinDocument(docId: string): void {
        this.pinnedDocIds.add(docId);
        this.savePinnedDocs();
    }

    public unpinDocument(docId: string): void {
        this.pinnedDocIds.delete(docId);
        this.savePinnedDocs();
    }

    public getPinnedDocIds(): string[] {
        return Array.from(this.pinnedDocIds);
    }

    private loadPinnedDocs() {
        try {
            const stored = localStorage.getItem('kompass_pinned_ids');
            if (stored) {
                const ids = JSON.parse(stored);
                this.pinnedDocIds = new Set(ids);
            }
        } catch (e) {
            console.warn('Failed to load pinned IDs', e);
        }
    }

    private savePinnedDocs() {
        localStorage.setItem('kompass_pinned_ids', JSON.stringify(Array.from(this.pinnedDocIds)));
    }

    /**
     * Compress image before storage
     */
    public async compressImage(file: File): Promise<Blob> {
        if (!file.type.startsWith('image/')) return file;

        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;

            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                const maxWidth = 1920;
                const maxHeight = 1080;
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Compression failed'));
                    },
                    'image/jpeg',
                    0.7
                );
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
        });
    }

    private getStatusMessage(status: QuotaStatus['status'], percentage: number): string {
        if (status === 'Critical') return `Offline-Speicher fast voll (${percentage.toFixed(1)}%). Bitte Daten bereinigen.`;
        if (status === 'Warning') return `Offline-Speicher zu ${percentage.toFixed(1)}% belegt.`;
        return 'Speicherplatz OK';
    }

    private isTodayOrTomorrow(dateStr: string | Date): boolean {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        now.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        return date.getTime() === now.getTime() || date.getTime() === tomorrow.getTime();
    }
}

export const storageService = StorageService.getInstance();
