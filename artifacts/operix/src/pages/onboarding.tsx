import { useState } from "react";
import { useCreateGroup, getListGroupsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Users, Shield, Sparkles } from "lucide-react";

const FADE_UP = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div variants={FADE_UP}>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const createGroup = useCreateGroup();

  const [groupName, setGroupName] = useState("");
  const [robloxGroupId, setRobloxGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    createGroup.mutate(
      { data: { name: groupName, robloxGroupId: robloxGroupId || undefined, description: description || undefined } },
      {
        onSuccess: async () => {
          await qc.invalidateQueries({ queryKey: getListGroupsQueryKey() });
          // Give time for context to update
          setTimeout(() => setLocation("/dashboard"), 300);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center px-4 py-12">
      <motion.div variants={STAGGER} initial="hidden" animate="show" className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div variants={FADE_UP} className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Operix</h1>
          <p className="text-lg text-muted-foreground">The Operating System for Roblox Groups</p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={FADE_UP}>
          <Card className="border-border shadow-xl">
            <CardHeader className="text-center">
              <CardTitle>Create Your First Group</CardTitle>
              <CardDescription>Get started by setting up your first Roblox group workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Group Name *</label>
                  <Input
                    placeholder="e.g., My Awesome Group"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Roblox Group ID</label>
                  <Input
                    placeholder="e.g., 12345678 (optional)"
                    value={robloxGroupId}
                    onChange={(e) => setRobloxGroupId(e.target.value)}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Find this in your Roblox group URL: roblox.com/groups/{"{id}"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="What is this group about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-background/50 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || createGroup.isPending}
                size="lg"
                className="w-full"
              >
                {createGroup.isPending ? "Creating..." : "Create Group"}
              </Button>

              {createGroup.isError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  Failed to create group. Please try again.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div variants={FADE_UP}>
          <p className="text-xs text-muted-foreground/60 text-center mb-4 uppercase tracking-wider">What you can do</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Users}
              title="Manage Staff"
              description="Track team members, attendance, and activity"
            />
            <FeatureCard
              icon={Shield}
              title="Handle Cases"
              description="Document issues and manage moderation"
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Insights"
              description="Get AI-powered summaries and recommendations"
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={FADE_UP} className="text-center">
          <p className="text-xs text-muted-foreground">You can add more groups later in Settings.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
