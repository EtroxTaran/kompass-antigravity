import React, { useState } from 'react';
import { Comment } from '@kompass/shared';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CommentThread } from './CommentThread';
import { commentsApi } from '@/services/apiClient'; // Use commentsApi
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePresenceContext } from "@/contexts/PresenceContext";
import { useEffect, useMemo } from "react";

interface CommentSectionProps {
    entityType: 'project' | 'offer' | 'invoice' | 'task' | 'opportunity';
    entityId: string;
    comments: Comment[];
    onCommentAdded?: (comment: Comment) => void;
    onCommentResolved?: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    entityType,
    entityId,
    comments = [],
    onCommentAdded,
    onCommentResolved
}) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // We can use socket from presence context to listen for updates if needed here or up in the parent.
    // For now relying on props for updates or manual query refresh.

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const addedComment = await commentsApi.add(entityType, entityId, newComment);
            setNewComment('');
            if (onCommentAdded) onCommentAdded(addedComment);
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (commentId: string, content: string) => {
        // Backend doesn't support threaded replies explicitly in the `addComment` DTO yet (contextId could be used but logic needs to be there).
        // Actually `Comment` interface has `replies`.
        // Backend `addComment` logic in `CommentService` just pushes to `comments` array.
        // It does NOT handle nesting.
        // For MVP, flat comments or basic contextId usage.
        // The `CommentThread` assumes recursion, but backend stores flat list unless we implementing structure.
        // Given the User Story "Threaded comments (reply to specific comment)", I should have implemented proper nesting in backend.
        // Current backend adds to root `comments`.
        // We can simply quote or just add as new comment for MVP if nesting is complex.
        // Or, let's treat it as flat list for now or use `contextId` to reference parent comment.
        // Let's implement flat list with "Reply logic" being just adding a comment.
        // Wait, `CommentThread` UI expects `replies` array on Comment object.
        // If backend stores flat, we need to transform flat -> tree on frontend or backend.
        // Let's stick to flat list for this MVP iteration and maybe mention threading limitation or implement simplistic threading.

        // Change of plan: Just add as root comment for now to unblock.
        try {
            const addedComment = await commentsApi.add(entityType, entityId, content, commentId);
            if (onCommentAdded) onCommentAdded(addedComment);
        } catch (error) {
            console.error("Failed to reply", error);
        }
    };

    const handleResolve = async (commentId: string) => {
        try {
            await commentsApi.resolve(entityType, entityId, commentId);
            if (onCommentResolved) onCommentResolved(commentId);
        } catch (error) {
            console.error("Failed to resolve", error);
        }
    };

    const { socket } = usePresenceContext();

    useEffect(() => {
        if (!socket) return;

        const onAdded = (comment: Comment) => {
            if (onCommentAdded) onCommentAdded(comment);
        };

        const onResolved = (commentId: string) => {
            if (onCommentResolved) onCommentResolved(commentId);
        };

        socket.on('comment:added', onAdded);
        socket.on('comment:resolved', onResolved);

        return () => {
            socket.off('comment:added', onAdded);
            socket.off('comment:resolved', onResolved);
        };
    }, [socket, onCommentAdded, onCommentResolved]);

    // Build comment tree
    const { rootComments, activeCount } = useMemo(() => {
        const commentMap = new Map<string, Comment>();
        const roots: Comment[] = [];

        // First pass: map all comments and deep copy to avoid mutation issues if strict
        // Actually, we can just use object references if we are careful.
        // We filter out resolved for display usually, but if parent is resolved and child is not?
        // Requirement says "Resolve button (hides thread)". So if parent resolved, hide children too?
        // Yes, usually.
        // So we filter activeComments first.
        const active = comments.filter(c => !c.resolved);

        // Initialize map with replies array
        active.forEach(c => {
            commentMap.set(c.id, { ...c, replies: [] });
        });

        // Second pass: link them
        active.forEach(originalC => {
            const c = commentMap.get(originalC.id)!;
            if (c.contextId && commentMap.has(c.contextId)) {
                const parent = commentMap.get(c.contextId)!;
                parent.replies = parent.replies || [];
                parent.replies.push(c);
            } else {
                roots.push(c);
            }
        });

        // Sort by date desc (newest first) or asc? Usually threads are oldest first, but recent first for feeds.
        // Comments on bottom usually Ascending (oldest top).
        return {
            rootComments: roots.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            activeCount: active.length
        };
    }, [comments]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Kommentare <span className="text-sm text-muted-foreground font-normal">({activeCount})</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                    {rootComments.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            Keine Kommentare vorhanden. Starte eine Diskussion!
                        </div>
                    ) : (
                        rootComments.map(comment => (
                            <CommentThread
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                                onResolve={handleResolve}
                            />
                        ))
                    )}
                </div>

                <div className="flex gap-2 items-end mt-auto pt-2 border-t">
                    <Avatar className="h-8 w-8 mb-1">
                        <AvatarFallback>ME</AvatarFallback> {/* Should use auth user */}
                    </Avatar>
                    <div className="flex-1 relative">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Schreibe einen Kommentar..."
                            className="min-h-[80px] pr-12 resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8"
                            disabled={isSubmitting || !newComment.trim()}
                            onClick={handleSubmit}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
