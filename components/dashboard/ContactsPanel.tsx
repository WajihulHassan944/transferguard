import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Plus, MoreVertical, Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface ContactsPanelProps {
  userId: string;
}

interface ContactGroup {
  id: string;
  name: string;
  description: string | null;
  contacts?: Contact[];
}

interface Contact {
  id: string;
  email: string;
  name: string | null;
  group_id: string | null;
}

export function ContactsPanel({ userId }: ContactsPanelProps) {
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [ungroupedContacts, setUngroupedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");

  useEffect(() => {
    loadContacts();
  }, [userId]);

  const loadContacts = async () => {
    setLoading(true);
    
    setLoading(false);
  };

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
  };

  const addContact = async () => {
    if (!contactEmail.trim()) return;

  };

  const deleteGroup = async (groupId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this group?");
    if (!confirmed) return;

    
  };

  const deleteContact = async (contactId: string) => {
  
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNewGroupOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
          <Button onClick={() => {
            setSelectedGroupId(null);
            setAddContactOpen(true);
          }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : groups.length === 0 && ungroupedContacts.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
          <p className="text-muted-foreground">
            Add contacts to quickly share files
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Contact Groups */}
          {groups.map((group) => (
            <Card key={group.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setAddContactOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteGroup(group.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {group.contacts && group.contacts.length > 0 ? (
                <div className="space-y-2">
                  {group.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between py-2 px-3 bg-accent/30 rounded">
                      <div>
                        <p className="font-medium">{contact.name || contact.email}</p>
                        {contact.name && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteContact(contact.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No contacts in this group</p>
              )}
            </Card>
          ))}

          {/* Ungrouped contacts */}
          {ungroupedContacts.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Other Contacts</h3>
              <div className="space-y-2">
                {ungroupedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between py-2 px-3 bg-accent/30 rounded">
                    <div>
                      <p className="font-medium">{contact.name || contact.email}</p>
                      {contact.name && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteContact(contact.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* New Group Dialog */}
      <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input
                placeholder="e.g. Colleagues"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                placeholder="Short description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewGroupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createGroup}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={addContactOpen} onOpenChange={setAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Name (optional)</Label>
              <Input
                placeholder="John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addContact}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
