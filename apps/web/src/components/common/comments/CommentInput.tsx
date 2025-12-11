import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Assuming Avatar is used here too
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isSubmitting?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = "Schreibe einen Kommentar...",
  isSubmitting = false,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    await onSubmit(content);
    setContent("");
  };

  return (
    <div className="flex gap-2 items-end pt-2 border-t mt-auto">
      <Avatar className="h-8 w-8 mb-1">
        {/* Ideally we get user avatar here, but for now placeholder */}
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] pr-12 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8"
          disabled={isSubmitting || !content.trim()}
          onClick={handleSubmit}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
