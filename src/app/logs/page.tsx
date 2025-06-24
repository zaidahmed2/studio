import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

type Log = {
  id: string;
  startTime: string;
  duration: string;
  messageCount: number;
  status: "Completed" | "In-progress" | "Error";
};

const mockLogs: Log[] = [
  {
    id: "CONV-001",
    startTime: "2024-05-20 10:30 AM",
    duration: "5m 12s",
    messageCount: 8,
    status: "Completed",
  },
  {
    id: "CONV-002",
    startTime: "2024-05-20 11:15 AM",
    duration: "12m 45s",
    messageCount: 15,
    status: "Completed",
  },
  {
    id: "CONV-003",
    startTime: "2024-05-20 01:02 PM",
    duration: "2m 3s",
    messageCount: 4,
    status: "Error",
  },
  {
    id: "CONV-004",
    startTime: "2024-05-21 09:00 AM",
    duration: "8m 30s",
    messageCount: 10,
    status: "Completed",
  },
  {
    id: "CONV-005",
    startTime: "2024-05-21 10:00 AM",
    duration: "1m 5s",
    messageCount: 2,
    status: "Completed",
  },
];

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Conversation Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Interaction History</CardTitle>
          <CardDescription>
            Review past conversations to monitor interactions and assess the effectiveness of the AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conversation ID</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.startTime}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>{log.messageCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "Completed"
                          ? "default"
                          : log.status === "Error"
                          ? "destructive"
                          : "secondary"
                      }
                      className={log.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' : ''}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Log</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
