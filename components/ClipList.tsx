'use client';

import { Clip, ClipStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp, Copy, Trash2 } from "lucide-react";
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
  idle: "border-white/10 bg-white/5 text-white/60",
  generating: "border-amber-400/40 bg-amber-400/10 text-amber-100",
  ready: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
  error: "border-rose-400/40 bg-rose-400/10 text-rose-100",
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            Clips
          </p>
          <p className="text-xs text-white/40">
            Add, reorder and manage your timeline.
          </p>
        </div>
        <Button
          onClick={onAddClip}
          size="sm"
          className="rounded-full bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] px-4 text-xs font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] hover:brightness-110"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add clip
        </Button>
      </div>

      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
        {clips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center text-sm text-white/40">
            No clips yet. Click “Add clip” to start building your flow.
          </div>
        ) : (
          clips.map((clip, index) => (
            <div
              key={clip.id}
              className={cn(
                "group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/40",
                selectedClipId === clip.id &&
                  "border-[#c4b5fd]/70 bg-white/[0.08] shadow-[0_20px_45px_rgba(196,181,253,0.2)]",
              )}
              onClick={() => onSelectClip(clip.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[11px] text-white/80">
                      {index + 1}
                    </span>
                    <h3 className="truncate text-sm font-semibold text-white">
                      {clip.title || `Clip ${index + 1}`}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        statusChipStyles[clip.status],
                      )}
                    >
                      {statusLabels[clip.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                    <span>{clip.duration || 0}s</span>
                    <span>·</span>
                    <span>{clip.resolution}</span>
                    <span>·</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[#c4b5fd]">
                      Seedance Lite
                    </span>
                  </div>

                  {clip.prompt && (
                    <p className="line-clamp-2 text-xs text-white/40">
                      {clip.prompt}
                    </p>
                  )}

                  {clip.errorMessage && (
                    <p className="text-xs text-rose-300">{clip.errorMessage}</p>
                  )}
                </div>

                <div className="ml-2 flex flex-col gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveClipUp(clip.id);
                    }}
                    disabled={index === 0}
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full text-white/60 hover:text-white disabled:opacity-30"
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
                    className="h-7 w-7 rounded-full text-white/60 hover:text-white disabled:opacity-30"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateClip(clip.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-full px-3 text-xs text-white/70 hover:text-white"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Duplicate
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClip(clip.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-full px-3 text-xs text-rose-300 hover:text-rose-200"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
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
