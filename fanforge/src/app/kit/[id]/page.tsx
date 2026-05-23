"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { KitGallery } from "@/components/kit/KitGallery";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/shared/Button";
import { TEAM_FLAGS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Kit } from "@/hooks/usePipeline";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function KitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKit() {
      try {
        const res = await fetch(`/api/results/${id}`);
        if (!res.ok) throw new Error("Kit not found");
        const data = await res.json();
        setKit(data.kit);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchKit();
  }, [id]);

  if (loading) {
    return (
      <div>
        <TopBar title="Loading..." />
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-6">
          <Skeleton variant="card" />
          <div className="grid grid-cols-3 gap-6">
            <Skeleton variant="image" />
            <Skeleton variant="image" />
            <Skeleton variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div>
        <TopBar title="Kit not found" />
        <div className="max-w-5xl mx-auto px-8 py-10 text-center">
          <p className="text-text-secondary font-body mb-4">
            {error || "This kit doesn't exist or has expired."}
          </p>
          <Link href="/generate">
            <Button>Generate a new kit</Button>
          </Link>
        </div>
      </div>
    );
  }

  const flag = TEAM_FLAGS[kit.team] || "";

  return (
    <div>
      <div className="flex items-center justify-between px-8 py-4 border-b border-b-[var(--color-border-light)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-h2 text-deep-orange">
              {flag} {kit.team} Fan Kit
            </h1>
            <p className="text-sm text-text-secondary font-body">
              Generated {timeAgo(kit.created_at)}
            </p>
          </div>
        </div>
        <Link href={`/kit/${id}/share`}>
          <Button variant="secondary" size="sm">
            <ExternalLink size={14} />
            Share
          </Button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <KitGallery kit={kit} />
      </div>
    </div>
  );
}
