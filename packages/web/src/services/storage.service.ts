import { QuotaStatus, StorageTier, TierConfig } from '@kompass/shared/src/types/storage.types';
import { Customer } from '@kompass/shared/src/types/customer';
import { Project } from '@kompass/shared/src/types/project';

// iOS 50MB Hard Limit
const MAX_STORAGE_BYTES = 50 * 1024 * 1024;
const WARNING_THRESHOLD = 0.8;
const CRITICAL_THRESHOLD = 0.95;

const TIER_CONFIGS: Record<StorageTier, TierConfig> = {
    tier1_essential: {
        name: 'tier1_essential',
        maxSize: 5 * 1024 * 1024, // 5MB
        priority: 1,
        evictionPolicy: 'none',
    },
    tier2_recent: {
        name: 'tier2_recent',
        maxSize: 10 * 1024 * 1024, // 10MB
        priority: 2,
        evictionPolicy: 'lru',
    },
    tier3_pinned: {
        name: 'tier3_pinned',
        maxSize: 35 * 1024 * 1024, // 35MB
        priority: 3,
        evictionPolicy: 'manual',
    },
};

export class StorageService {
    private static instance: StorageService;

    private constructor() { }

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
        let available = MAX_STORAGE_BYTES;

        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                used = estimate.usage || 0;
                // We override quota with our hard limit if browser reports more
                available = Math.max(0, MAX_STORAGE_BYTES - used);
            } catch (error) {
                console.error('Failed to estimate storage:', error);
            }
        }

        const percentage = (used / MAX_STORAGE_BYTES) * 100;

        let status: QuotaStatus['status'] = 'OK';
        if (percentage > CRITICAL_THRESHOLD * 100) status = 'Critical';
        else if (percentage > WARNING_THRESHOLD * 100) status = 'Warning';

        // TODO: Implement actual breakdown by querying DB stats
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

    /**
     * Determine if an entity belongs to Tier 1 (Essential)
     */
    public isEssential(entity: unknown, currentUserId: string): boolean {
        const record = entity as any;

        // User Profile
        if (record.type === 'user' && record._id === `user-${currentUserId}`) return true;

        // Assigned Customers (ADM)
        if (record.type === 'customer' && record.owner === currentUserId) return true;

        // Active Opportunities
        if (record.type === 'opportunity' &&
            record.owner === currentUserId &&
            ['New', 'Qualification', 'Proposal'].includes(record.status)) return true;

        // Today's Appointments (Activity)
        if (record.type === 'activity' && this.isTodayOrTomorrow(record.date)) return true;

        return false;
    }

    /**
     * Compress image before storage
     * Max 1920x1080, 70% Quality JPEG
     */
    public async compressImage(file: File): Promise<Blob> {
        // If not an image, return original
        if (!file.type.startsWith('image/')) return file;

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
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
                        URL.revokeObjectURL(img.src);
                    },
                    'image/jpeg',
                    0.7
                );
            };
            img.onerror = (err) => reject(err);
        });
    }

    private getStatusMessage(status: QuotaStatus['status'], percentage: number): string {
        if (status === 'Critical') return `Offline-Speicher fast voll (${percentage.toFixed(1)}%). Bitte Daten bereinigen.`;
        if (status === 'Warning') return `Offline-Speicher zu ${percentage.toFixed(1)}% belegt.`;
        return 'Speicherplatz OK';
    }

    private isTodayOrTomorrow(dateStr: string | Date): boolean {
        const date = new Date(dateStr);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Reset times for date comparison
        now.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        return date.getTime() === now.getTime() || date.getTime() === tomorrow.getTime();
    }
}
