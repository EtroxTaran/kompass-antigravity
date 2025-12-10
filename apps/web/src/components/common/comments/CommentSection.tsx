import React, { useState } from "react";
import { Comment as CommentType } from "@kompass/shared";

import { CommentThread } from "./CommentThread";
import { CommentInput } from "./CommentInput";
import { commentsApi } from "@/services/apiClient"; // Use commentsApi
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { usePresenceContext } from "@/contexts/PresenceContext";
import { useEffect, useMemo } from "react";

interface CommentSectionProps {
  entityType: "project" | "offer" | "invoice" | "task" | "opportunity";
  entityId: string;
  comments: CommentType[];
  onCommentAdded?: (comment: CommentType) => void;
  onCommentResolved?: (commentId: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  entityType,
  entityId,
  comments = [],
  onCommentAdded,
  onCommentResolved,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { socket } = usePresenceContext();

  const handleAddComment = async (content: string) => {
    setIsSubmitting(true);
    try {
      const addedComment = (await commentsApi.add(
        entityType,
        entityId,
        content,
      )) as unknown as CommentType;
      if (onCommentAdded) onCommentAdded(addedComment);
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    try {
      const addedComment = (await commentsApi.add(
        entityType,
        entityId,
        content,
        commentId,
      )) as unknown as CommentType;
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

  useEffect(() => {
    if (!socket) return;

    const onAdded = (comment: CommentType) => {
      if (onCommentAdded) onCommentAdded(comment);
    };

    const onResolved = (commentId: string) => {
      if (onCommentResolved) onCommentResolved(commentId);
    };

    socket.on("comment:added", onAdded);
    socket.on("comment:resolved", onResolved);

    return () => {
      socket.off("comment:added", onAdded);
      socket.off("comment:resolved", onResolved);
    };
  }, [socket, onCommentAdded, onCommentResolved]);

  // Build comment tree
  const { rootComments, activeCount } = useMemo(() => {
    const commentMap = new Map<string, CommentType>();
    const roots: CommentType[] = [];
    const active = comments.filter((c) => !c.resolved);

    // Initialize map with replies array
    active.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    // Second pass: link them
    active.forEach((originalC) => {
      const c = commentMap.get(originalC.id)!;
      if (c.contextId && commentMap.has(c.contextId)) {
        const parent = commentMap.get(c.contextId)!;
        parent.replies = parent.replies || [];
        parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    return {
      rootComments: roots.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
      activeCount: active.length,
    };
  }, [comments]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Kommentare{" "}
          <span className="text-sm text-muted-foreground font-normal">
            ({activeCount})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto mb-4 pr-2">
          {rootComments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              Keine Kommentare vorhanden. Starte eine Diskussion!
            </div>
          ) : (
            rootComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onResolve={handleResolve}
              />
            ))
          )}
        </div>

        <CommentInput onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      </CardContent>
    </Card>
  );
};
