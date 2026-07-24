import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Package,
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Paperclip,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

type InquiryStatus = "new" | "contacted" | "quoted" | "converted" | "closed";

const statusColors: Record<InquiryStatus, string> = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  quoted: "bg-purple-500",
  converted: "bg-green-500",
  closed: "bg-gray-500",
};

const statusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  converted: "Converted",
  closed: "Closed",
};

export default function AdminInquiries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<InquiryStatus>("new");
  const [notes, setNotes] = useState("");

  const { data: inquiries, isLoading, refetch } = trpc.contact.list.useQuery();

  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Inquiry status updated successfully");
      refetch();
      setIsDetailOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const filteredInquiries = inquiries?.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.country?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openDetail = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status);
    setNotes(inquiry.notes || "");
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedInquiry) return;
    updateStatus.mutate({
      id: selectedInquiry.id,
      status: newStatus,
      notes: notes || undefined,
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseAttachments = (attachments: string | null): string[] => {
    if (!attachments) return [];
    try {
      return JSON.parse(attachments);
    } catch {
      return [];
    }
  };

  // Stats
  const stats = {
    total: inquiries?.length || 0,
    new: inquiries?.filter((i) => i.status === "new").length || 0,
    contacted: inquiries?.filter((i) => i.status === "contacted").length || 0,
    quoted: inquiries?.filter((i) => i.status === "quoted").length || 0,
    converted: inquiries?.filter((i) => i.status === "converted").length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inquiry Management
            </h1>
            <p className="text-gray-500">
              View and manage customer inquiries and quote requests
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-500">Total Inquiries</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-sm text-gray-500">New</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.contacted}
              </div>
              <div className="text-sm text-gray-500">Contacted</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {stats.quoted}
              </div>
              <div className="text-sm text-gray-500">Quoted</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.converted}
              </div>
              <div className="text-sm text-gray-500">Converted</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, company, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="quoted">Quoted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries ({filteredInquiries?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading inquiries...
              </div>
            ) : filteredInquiries?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No inquiries found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries?.map((inquiry) => (
                      <TableRow
                        key={inquiry.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openDetail(inquiry)}
                      >
                        <TableCell className="whitespace-nowrap">
                          {formatDate(inquiry.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">
                            {inquiry.email}
                          </div>
                        </TableCell>
                        <TableCell>{inquiry.company || "-"}</TableCell>
                        <TableCell>{inquiry.country || "-"}</TableCell>
                        <TableCell>{inquiry.productInterest || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusColors[inquiry.status as InquiryStatus]
                            } text-white`}
                          >
                            {statusLabels[inquiry.status as InquiryStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(inquiry);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Name
                    </div>
                    <div className="font-medium">{selectedInquiry.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </div>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-medium text-[#DC2626] hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </div>
                    <div className="font-medium">
                      {selectedInquiry.phone || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Company
                    </div>
                    <div className="font-medium">
                      {selectedInquiry.company || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Country
                    </div>
                    <div className="font-medium">
                      {selectedInquiry.country || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Package className="h-3 w-3" /> Product Interest
                    </div>
                    <div className="font-medium">
                      {selectedInquiry.productInterest || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Quantity</div>
                    <div className="font-medium">
                      {selectedInquiry.quantity || "-"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Submitted
                    </div>
                    <div className="font-medium">
                      {formatDate(selectedInquiry.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Message
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Attachments */}
                {parseAttachments(selectedInquiry.attachments).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Paperclip className="h-3 w-3" /> Attachments
                    </div>
                    <div className="space-y-1">
                      {parseAttachments(selectedInquiry.attachments).map(
                        (url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#DC2626] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Attachment {index + 1}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-semibold">Update Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Status</label>
                      <Select
                        value={newStatus}
                        onValueChange={(v) => setNewStatus(v as InquiryStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">
                      Internal Notes
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this inquiry..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={updateStatus.isPending}
                className="bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                {updateStatus.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
