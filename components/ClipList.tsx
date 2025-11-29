'use client';

import { Clip, ClipStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp, Copy, Trash2, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClipListProps {
  clips: Clip[];
  selectedClipId: string | null;
  onSelectClip: (clipId: string) => void;
  onAddClip: () => void;
  onDuplicateClip: (clipId: string) => void;
  onDeleteClip: (clipId: string) => void;
  onMoveClipUp: (clipId: string) => void;
  onMoveClipDown: (clipId: string) => void;
  className?: string;
}

const statusChipStyles: Record<ClipStatus, string> = {
  idle: "bg-white/5 text-white/60",
  generating: "bg-amber-500/10 text-amber-400",
  ready: "bg-[#007AFF]/10 text-[#007AFF]",
  error: "bg-rose-500/10 text-rose-400",
};

const statusLabels: Record<ClipStatus, string> = {
  idle: "Idle",
  generating: "Generating",
  ready: "Ready",
  error: "Error",
};

export function ClipList({
  clips,
  selectedClipId,
  onSelectClip,
  onAddClip,
  onDuplicateClip,
  onDeleteClip,
  onMoveClipUp,
  onMoveClipDown,
  className,
}: ClipListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Clips
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Manage your timeline
          </p>
        </div>
        <Button
          onClick={onAddClip}
          size="sm"
          className="h-8 rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 border-none"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add clip
        </Button>
      </div>

      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        {clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
            <div className="mb-3 rounded-full bg-white/5 p-3">
              <Film className="h-5 w-5 text-white/20" />
            </div>
            <p className="text-sm text-white/40">No clips yet</p>
            <p className="text-xs text-white/30 mt-1">Click "Add clip" to start</p>
          </div>
        ) : (
          clips.map((clip, index) => (
            <div
              key={clip.id}
              className={cn(
                "group cursor-pointer rounded-xl border p-4 transition-all duration-200",
                selectedClipId === clip.id
                  ? "border-[#007AFF]/50 bg-[#007AFF]/5 shadow-sm"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
              )}
              onClick={() => onSelectClip(clip.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                      selectedClipId === clip.id ? "bg-[#007AFF] text-white" : "bg-white/10 text-white/60"
                    )}>
                      {index + 1}
                    </span>
                    <h3 className={cn(
                      "truncate text-sm font-medium transition-colors",
                      selectedClipId === clip.id ? "text-white" : "text-white/80"
                    )}>
                      {clip.title || `Clip ${index + 1}`}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        statusChipStyles[clip.status],
                      )}
                    >
                      {statusLabels[clip.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/40">
                    <span>{clip.duration || 0}s</span>
                    <span>·</span>
                    <span>{clip.resolution}</span>
                  </div>

                  {clip.prompt && (
                    <p className="line-clamp-2 text-xs text-white/50 font-light">
                      {clip.prompt}
                    </p>
                  )}

                  {clip.errorMessage && (
                    <p className="text-xs text-rose-400">{clip.errorMessage}</p>
                  )}
                </div>

                <div className="ml-2 flex flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveClipUp(clip.id);
                    }}
                    disabled={index === 0}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full text-white/40 hover:text-white hover:bg-white/10"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveClipDown(clip.id);
                    }}
                    disabled={index === clips.length - 1}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full text-white/40 hover:text-white hover:bg-white/10"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateClip(clip.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-lg px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Copy className="mr-1.5 h-3 w-3" />
                  Duplicate
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClip(clip.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-lg px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
