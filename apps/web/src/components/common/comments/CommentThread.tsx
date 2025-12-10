import React, { useState } from 'react';
import { Comment } from '@kompass/shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Check, Reply } from 'lucide-react';

interface CommentThreadProps {
    comment: Comment;
    onReply: (commentId: string, content: string) => void;
    onResolve: (commentId: string) => void;
    depth?: number;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, onReply, onResolve, depth = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };

    if (comment.resolved) return null; // Or show resolved state differently

    return (
        <div className={`flex gap-3 mb-4 ${depth > 0 ? 'ml-8 border-l-2 pl-4' : ''}`}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatarUrl} />
                <AvatarFallback>{comment.author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: de })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onResolve(comment.id)} title="Resolve">
                            <Check className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <p className="text-sm mt-1 mb-2 whitespace-pre-wrap">{comment.content}</p>

                <div className="flex gap-2">
                    {!isReplying && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setIsReplying(true)}>
                            <Reply className="h-3 w-3 mr-1" /> Antworten
                        </Button>
                    )}
                </div>

                {isReplying && (
                    <div className="mt-2 space-y-2">
                        <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Antwort schreiben..."
                            className="min-h-[60px]"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Abbrechen</Button>
                            <Button size="sm" onClick={handleReplySubmit}>Senden</Button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4">
                        {comment.replies.map(reply => (
                            <CommentThread
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onResolve={onResolve}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
