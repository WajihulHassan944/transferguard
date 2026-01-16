import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Plus, UserPlus, Crown, Shield, User } from "lucide-react";
import { toast } from "sonner";

interface TeamsPanelProps {
  userId: string;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
}

interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  invited_email: string | null;
  joined_at: string | null;
}

export function TeamsPanel({ userId }: TeamsPanelProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [loading, setLoading] = useState(true);
  
  const [newTeamOpen, setNewTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return Crown;
      case "admin": return Shield;
      default: return User;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner": return { label: "Owner", variant: "default" as const };
      case "admin": return { label: "Admin", variant: "secondary" as const };
      default: return { label: "Member", variant: "outline" as const };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button onClick={() => setNewTeamOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : teams.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No teams yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a team to collaborate on files
          </p>
          <Button onClick={() => setNewTeamOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => {
            const members = teamMembers[team.id] || [];
            return (
              <Card key={team.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{team.name}</h3>
                    {team.description && (
                      <p className="text-muted-foreground">{team.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setInviteOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Members ({members.length})
                  </p>
                  {members.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    const roleBadge = getRoleBadge(member.role);
                    return (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between py-2 px-3 bg-accent/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <RoleIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{member.invited_email || "You"}</span>
                        </div>
                        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Team Dialog */}
      <Dialog open={newTeamOpen} onOpenChange={setNewTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input
                placeholder="e.g. Marketing Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                placeholder="Short description of the team"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTeamOpen(false)}>
              Cancel
            </Button>
            <Button >Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button >Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
