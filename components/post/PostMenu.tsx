"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PostMenuProps {
  authorName: string;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Post action menu.
 *
 * PRODUCT RULE (assignment, hard requirement): every authenticated user may
 * edit and delete ANY post. Ownership is deliberately never compared here —
 * do not add an `authorId === currentUser.id` check to this component.
 */
export function PostMenu({ authorName, onEdit, onDelete }: PostMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for the post by ${authorName}`}
          aria-haspopup="menu"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-card border border-transparent text-faint transition-colors hover:border-rule-2 hover:bg-card hover:text-ink focus-visible:outline-2 focus-visible:outline-press"
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-oxide data-[highlighted]:bg-oxide-soft data-[highlighted]:text-oxide"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
