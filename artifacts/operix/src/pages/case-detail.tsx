import { useState } from "react";
import { Link, useRoute } from "wouter";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useGetCase, useUpdateCase, useAddCaseEvidence, useSummarizeCase, getGetCaseQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Plus, FileText, User, Calendar } from "lucide-react";

const SEVERITY: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400", medium: "bg-amber-500/10 text-amber-400",
  high: "bg-orange-500/10 text-orange-400", critical: "bg-red-500/10 text-red-400",
};

const STATUS: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400", under_review: "bg-blue-500/10 text-blue-400",
  closed: "bg-zinc-500/10 text-zinc-400", appealed: "bg-purple-500/10 text-purple-400",
};

function CaseDetailContent() {
  const { activeGroup } = useGroupContext();
  const [, params] = useRoute("/cases/:caseId");
  const caseId = parseInt(params?.caseId ?? "0");
  const groupId = activeGroup?.id ?? 0;
  const qc = useQueryClient();
  const [evidenceText, setEvidenceText] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);

  const { data: caseData, isLoading } = useGetCase(groupId, caseId, {
    query: { enabled: !!groupId && !!caseId, queryKey: getGetCaseQueryKey(groupId, caseId) }
  });

  const updateCase = useUpdateCase();
  const addEvidence = useAddCaseEvidence();
  const summarize = useSummarizeCase();

  const handleStatusChange = (status: string) => {
    updateCase.mutate({ groupId, caseId, data: { status: status as any } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetCaseQueryKey(groupId, caseId) }),
    });
  };

  const handleAddEvidence = () => {
    if (!evidenceText.trim()) return;
    addEvidence.mutate({ groupId, caseId, data: { content: evidenceText, type: "text" } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getGetCaseQueryKey(groupId, caseId) }); setEvidenceText(""); },
    });
  };

  const handleSummarize = () => {
    summarize.mutate({ groupId, caseId }, {
      onSuccess: (data) => setAiResult(data),
    });
  };

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );

  if (!caseData) return <p className="text-muted-foreground">Case not found.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/cases"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Cases</Button></Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY[caseData.severity] ?? SEVERITY.low}`}>{caseData.severity}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS[caseData.status] ?? STATUS.open}`}>{caseData.status.replace("_", " ")}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{caseData.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            {caseData.staffUsername && <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{caseData.staffUsername}</span>}
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(caseData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={caseData.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="appealed">Appealed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleSummarize} disabled={summarize.isPending} className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />{summarize.isPending ? "..." : "AI Summary"}
          </Button>
        </div>
      </div>

      {caseData.description && (
        <Card><CardContent className="p-4"><p className="text-sm leading-relaxed text-muted-foreground">{caseData.description}</p></CardContent></Card>
      )}

      {(caseData.aiSummary || aiResult) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /> AI Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm leading-relaxed">{aiResult?.summary ?? caseData.aiSummary}</p>
              {(aiResult?.suggestedAction ?? caseData.suggestedAction) && (
                <div className="mt-3 p-3 rounded-md bg-background/50 border border-border/50">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Suggested Action</p>
                  <p className="text-sm">{aiResult?.suggestedAction ?? caseData.suggestedAction}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4" /> Evidence ({(caseData as any).evidence?.length ?? caseData.evidenceCount})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {((caseData as any).evidence ?? []).map((e: any) => (
            <div key={e.id} className="p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-sm leading-relaxed">{e.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(e.addedAt).toLocaleString()}</p>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <Textarea placeholder="Add evidence note..." value={evidenceText} onChange={e => setEvidenceText(e.target.value)} className="resize-none" rows={2} />
            <Button variant="outline" onClick={handleAddEvidence} disabled={addEvidence.isPending || !evidenceText.trim()} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CaseDetailPage() {
  return <GroupProvider><MainLayout><CaseDetailContent /></MainLayout></GroupProvider>;
}
