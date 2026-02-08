import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Mail,
  Search,
  Paperclip,
  ChevronLeft,
  Send,
  User,
  UserCheck,
  MoreVertical,
  Trash2,
  MailOpen,
  Plus,
  File,
  X,
  Upload,
  FileText,
  Image,
  FolderOpen,
} from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";

interface WorkspaceMessage {
  id: string;
  workspace_id: string;
  sender_type: "sender" | "recipient";
  sender_email: string;
  sender_name: string | null;
  subject: string | null;
  content: string;
  is_read: boolean;
  read_at: string | null;
  has_attachments: boolean;
  created_at: string;
}

interface WorkspaceDossier {
  id: string;
  name: string;
}

interface UploadedFile {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
}

interface AttachmentFile {
  file: File;
  id: string;
  uploading: boolean;
  uploaded: boolean;
  uploadedFileId?: string;
}

interface WorkspaceMessagesPanelProps {
  workspaceId: string;
  workspaceName: string;
  recipientEmail: string;
  currentUserEmail: string;
}

export function WorkspaceMessagesPanel({
  workspaceId,
  workspaceName,
  recipientEmail,
  currentUserEmail,
}: WorkspaceMessagesPanelProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === 'nl' ? nl : enUS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<WorkspaceMessage | null>(null);
  const [composing, setComposing] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Compose state
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [sending, setSending] = useState(false);
  
  // Attachment state
  const [dossiers, setDossiers] = useState<WorkspaceDossier[]>([]);
  const [selectedDossierId, setSelectedDossierId] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [messageAttachments, setMessageAttachments] = useState<Record<string, UploadedFile[]>>({});

  const fetchMessages = useCallback(async () => {
  }, [workspaceId]);

  const fetchDossiers = useCallback(async () => {
  }, [workspaceId, selectedDossierId]);

  // Initial fetch
  useEffect(() => {
    fetchMessages();
    fetchDossiers();
  }, [fetchMessages, fetchDossiers]);


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    if (attachments.length + files.length > 10) {
      toast.error(t('messages.maxFiles'));
      return;
    }
    
    const newAttachments: AttachmentFile[] = Array.from(files).map(file => ({
      file,
      id: crypto.randomUUID(),
      uploading: false,
      uploaded: false,
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const uploadAttachments = async (): Promise<string[]> => {
    if (!selectedDossierId || attachments.length === 0) return [];
    
    const uploadedIds: string[] = [];
    
    for (const attachment of attachments) {
      if (attachment.uploaded && attachment.uploadedFileId) {
        uploadedIds.push(attachment.uploadedFileId);
        continue;
      }
      
      setAttachments(prev => 
        prev.map(a => a.id === attachment.id ? { ...a, uploading: true } : a)
      );
      
    }
    
    return uploadedIds;
  };

  const handleSendMessage = async (isReply: boolean = false) => {
    if (!newContent.trim()) {
      toast.error(t('messages.emptyError'));
      return;
    }

    setSending(true);
   
  };

  const handleMarkAsRead = async (messageId: string) => {
   
  };

  const handleDeleteMessage = async (messageId: string) => {
   
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, "HH:mm", { locale: dateLocale });
    }
    if (isYesterday(date)) {
      return t('messages.yesterday');
    }
    return format(date, "d MMM", { locale: dateLocale });
  };

  const getFileIcon = (mimeType: string | null) => {
    if (mimeType?.startsWith("image/")) return Image;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.sender_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.is_read && m.sender_type === "recipient").length;

  // Message detail view
  if (selectedMessage) {
    const msgAttachments = messageAttachments[selectedMessage.id] || [];
    
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(null)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              {selectedMessage.subject || t('messages.noSubject')}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {selectedMessage.sender_type === "sender" ? t('messages.you') : selectedMessage.sender_email}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('messages.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message content */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  selectedMessage.sender_type === "sender"
                    ? "bg-primary/10"
                    : "bg-amber-500/10"
                )}
              >
                {selectedMessage.sender_type === "sender" ? (
                  <User className="h-5 w-5 text-primary" />
                ) : (
                  <UserCheck className="h-5 w-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {selectedMessage.sender_type === "sender"
                      ? t('messages.you')
                      : selectedMessage.sender_name || selectedMessage.sender_email}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      selectedMessage.sender_type === "sender"
                        ? "bg-primary/5 text-primary border-primary/20"
                        : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                    )}
                  >
                    {selectedMessage.sender_type === "sender" ? t('messages.sender') : t('messages.client')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedMessage.created_at), "d MMMM yyyy 'om' HH:mm", {
                    locale: dateLocale,
                  })}
                </p>
                {/* Read confirmation for messages sent by sender */}
                {selectedMessage.sender_type === "sender" && (
                  <p className="text-xs mt-1">
                    {selectedMessage.is_read && selectedMessage.read_at ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        ✓ {language === 'nl' ? 'Gelezen op' : 'Read on'}{' '}
                        {format(new Date(selectedMessage.read_at), "d MMM yyyy 'om' HH:mm", {
                          locale: dateLocale,
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {language === 'nl' ? 'Nog niet gelezen' : 'Not read yet'}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
            
            {/* Attachments */}
            {msgAttachments.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Paperclip className="h-4 w-4" />
                  {t('messages.attachments')} ({msgAttachments.length})
                </div>
                <div className="space-y-2">
                  {msgAttachments.map((file) => {
                    const FileIcon = getFileIcon(file.mime_type);
                    return (
                      <div key={file.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.file_name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Reply */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2">
            <Textarea
              placeholder={t('messages.writeReply')}
              className="resize-none"
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <Button onClick={() => handleSendMessage(true)} disabled={sending || !newContent.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Compose new message view
  if (composing) {
    const isUploading = attachments.some(a => a.uploading);
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setComposing(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-medium">{t('messages.newMessage')}</h3>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-auto">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t('messages.to')}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <span className="font-medium">{workspaceName}</span>
              <span className="text-muted-foreground">({recipientEmail})</span>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              placeholder={t('messages.subjectOptional')}
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder={t('messages.writeMessage')}
              className="min-h-[150px] resize-none"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          
          {/* Attachments Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                {t('messages.attachments')}
              </Label>
              <span className="text-xs text-muted-foreground">
                {attachments.length}/10 {t('messages.filesAttached')}
              </span>
            </div>
            
            {/* Dossier Selection */}
            {dossiers.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t('messages.selectDossier')}</Label>
                <Select value={selectedDossierId} onValueChange={setSelectedDossierId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('messages.selectDossier')} />
                  </SelectTrigger>
                  <SelectContent>
                    {dossiers.map((dossier) => (
                      <SelectItem key={dossier.id} value={dossier.id}>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4" />
                          {dossier.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('messages.noDossiers')}</p>
            )}
            
            {/* File Upload */}
            {dossiers.length > 0 && attachments.length < 10 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('messages.addAttachment')}
                </Button>
              </div>
            )}
            
            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment.file.type);
                  return (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.file.size)}
                          {attachment.uploading && ` - ${t('messages.uploading')}`}
                          {attachment.uploaded && " ✓"}
                        </p>
                      </div>
                      {!attachment.uploading && !attachment.uploaded && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => setComposing(false)}>
            {t('workspaces.cancel')}
          </Button>
          <Button onClick={() => handleSendMessage(false)} disabled={sending || isUploading || !newContent.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {sending || isUploading ? t('messages.uploading') : t('messages.send')}
          </Button>
        </div>
      </div>
    );
  }

  // Message list view (email style)
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Button onClick={() => setComposing(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('messages.newMessage')}
        </Button>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('messages.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-muted/30 text-sm">
        <span className="text-muted-foreground">
          {messages.length} {t('messages.count')}
        </span>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {unreadCount} {t('messages.unread')}
          </Badge>
        )}
      </div>

      {/* Message list */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            {t('messages.loading')}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">{t('messages.noMessages')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('messages.noMessagesDesc')}
            </p>
            <Button onClick={() => setComposing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('messages.newMessage')}
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors group",
                  !message.is_read && message.sender_type === "recipient" && "bg-primary/5"
                )}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read && message.sender_type === "recipient") {
                    handleMarkAsRead(message.id);
                  }
                }}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={selectedMessages.has(message.id)}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={(checked) => {
                    const newSet = new Set(selectedMessages);
                    if (checked) {
                      newSet.add(message.id);
                    } else {
                      newSet.delete(message.id);
                    }
                    setSelectedMessages(newSet);
                  }}
                />

                {/* Sender icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.sender_type === "sender"
                      ? "bg-primary/10"
                      : "bg-amber-500/10"
                  )}
                >
                  {message.sender_type === "sender" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-amber-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-medium truncate",
                        !message.is_read && message.sender_type === "recipient" && "text-foreground"
                      )}
                    >
                      {message.sender_type === "sender"
                        ? t('messages.you')
                        : message.sender_name || message.sender_email}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs shrink-0",
                        message.sender_type === "sender"
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                      )}
                    >
                      {message.sender_type === "sender" ? t('messages.sender') : t('messages.client')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm truncate",
                        !message.is_read && message.sender_type === "recipient"
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.subject && (
                        <span className="font-medium">{message.subject} - </span>
                      )}
                      {message.content}
                    </span>
                  </div>
                </div>

                {/* Read status for sent messages */}
                {message.sender_type === "sender" && (
                  <span className={cn(
                    "text-xs shrink-0",
                    message.is_read ? "text-emerald-600" : "text-muted-foreground"
                  )}>
                    {message.is_read ? "✓✓" : "✓"}
                  </span>
                )}

                {/* Attachments indicator */}
                {message.has_attachments && (
                  <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                )}

                {/* Date */}
                <span className="text-sm text-muted-foreground shrink-0">
                  {formatMessageDate(message.created_at)}
                </span>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id);
                      }}
                    >
                      <MailOpen className="h-4 w-4 mr-2" />
                      {t('messages.markAsRead')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(message.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('messages.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}