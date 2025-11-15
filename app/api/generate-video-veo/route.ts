import { POST as ReplicatePost } from "../generate-video/route";

export const dynamic = "force-dynamic";

// For backward-compatibility, proxy to the main Replicate Veo handler.
export const POST = ReplicatePost;
