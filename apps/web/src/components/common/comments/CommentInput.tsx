import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { authApi } from "@/services/apiClient";
import { MentionUserList } from "./MentionUserList";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isSubmitting?: boolean;
}

interface User {
  _id: string;
  displayName: string;
  username?: string;
  email: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = "Schreibe einen Kommentar...",
  isSubmitting = false,
}) => {
  const [content, setContent] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authApi.getUsers();
        setUsers(
          response.data.map((u) => ({
            ...u,
            username: u.username || u.displayName.toLowerCase().replace(/\s/g, "."),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch users for mentions", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users when query changes
  useEffect(() => {
    if (mentionQuery === null) {
      setFilteredUsers([]);
      return;
    }
    const lowerQuery = mentionQuery.toLowerCase();
    const filtered = users
      .filter(
        (u) =>
          u.displayName.toLowerCase().includes(lowerQuery) ||
          (u.username && u.username.toLowerCase().includes(lowerQuery)) ||
          u.email.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 5); // Limit to 5 suggestions
    setFilteredUsers(filtered);
    setMentionIndex(0);
  }, [mentionQuery, users]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    await onSubmit(content);
    setContent("");
    setMentionQuery(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % filteredUsers.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex(
          (prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectUser(filteredUsers[mentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);

    // Detect mention trigger
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPosition);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbolIndex !== -1) {
      const query = textBeforeCursor.slice(lastAtSymbolIndex + 1);
      // Check if query contains spaces (ends mention attempt generally)
      if (!/\s/.test(query)) {
        setMentionQuery(query);
        return;
      }
    }
    setMentionQuery(null);
  };

  const selectUser = (user: User) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf("@");

    const newContent =
      content.slice(0, lastAtSymbolIndex) +
      `@${user.username || user.displayName.replace(/\s/g, "")} ` +
      content.slice(cursorPosition);

    setContent(newContent);
    setMentionQuery(null);

    // Restore focus and cursor (approximate)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Set cursor after the inserted mention
        const newCursorPos = lastAtSymbolIndex + (user.username || user.displayName.replace(/\s/g, "")).length + 2;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="flex gap-2 items-end pt-2 border-t mt-auto relative">
      <Avatar className="h-8 w-8 mb-1">
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>
      <div className="flex-1 relative">
        {filteredUsers.length > 0 && (
          <MentionUserList
            users={filteredUsers}
            onSelect={selectUser}
            selectedIndex={mentionIndex}
          />
        )}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="min-h-[80px] pr-12 resize-none"
          onKeyDown={handleKeyDown}
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
