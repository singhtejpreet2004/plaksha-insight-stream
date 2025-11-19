import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { STREAMS, StreamConfig } from '@/lib/streams';
import { TimeRange, generateCSV, downloadCSV } from '@/lib/csv';
import StreamCard from './StreamCard';
import { useToast } from '@/hooks/use-toast';
import { PlakshaLogo } from './PlakshaLogo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const StreamsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1day');
  const [isDownloading, setIsDownloading] = useState(false);
  const [streams, setStreams] = useState<StreamConfig[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStreamName, setNewStreamName] = useState('');
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [deleteStreamId, setDeleteStreamId] = useState<string | null>(null);

  const STREAMS_PER_PAGE = 4;
  const totalPages = Math.ceil(streams.length / STREAMS_PER_PAGE);
  const currentStreams = streams.slice(
    currentPage * STREAMS_PER_PAGE,
    (currentPage + 1) * STREAMS_PER_PAGE
  );

  const loadStreams = useCallback(() => {
    const savedStreams = localStorage.getItem('customStreams');
    const customStreams = savedStreams ? JSON.parse(savedStreams) : [];
    setStreams([...STREAMS, ...customStreams]);
  }, []);

  useEffect(() => {
    loadStreams();
  }, [loadStreams]);

  const handleAddStream = () => {
    if (!newStreamName.trim() || !newStreamUrl.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both stream name and URL',
        variant: 'destructive'
      });
      return;
    }

    const newStream: StreamConfig = {
      id: `custom_${Date.now()}`,
      name: newStreamName,
      location: 'Custom Stream',
      model: 'Custom Stream',
      streamUrl: newStreamUrl,
      statsUrl: newStreamUrl.replace('/stream', '/stats')
    };

    const savedStreams = localStorage.getItem('customStreams');
    const customStreams = savedStreams ? JSON.parse(savedStreams) : [];
    customStreams.push(newStream);
    localStorage.setItem('customStreams', JSON.stringify(customStreams));

    setStreams([...streams, newStream]);
    setNewStreamName('');
    setNewStreamUrl('');
    setIsAddDialogOpen(false);

    toast({
      title: 'Stream Added',
      description: `${newStreamName} has been added successfully`,
    });
  };

  const handleDeleteStream = (streamId: string) => {
    const stream = streams.find(s => s.id === streamId);
    
    // Only allow deletion of custom streams
    if (!stream || !streamId.startsWith('custom_')) {
      toast({
        title: 'Cannot Delete',
        description: 'Only custom streams can be deleted',
        variant: 'destructive'
      });
      return;
    }

    setDeleteStreamId(streamId);
  };

  const confirmDelete = () => {
    if (!deleteStreamId) return;

    const stream = streams.find(s => s.id === deleteStreamId);
    
    // Remove from localStorage
    const savedStreams = localStorage.getItem('customStreams');
    const customStreams = savedStreams ? JSON.parse(savedStreams) : [];
    const updatedCustomStreams = customStreams.filter((s: StreamConfig) => s.id !== deleteStreamId);
    localStorage.setItem('customStreams', JSON.stringify(updatedCustomStreams));

    // Update state
    setStreams(streams.filter(s => s.id !== deleteStreamId));
    
    // Adjust current page if necessary
    const newTotalPages = Math.ceil((streams.length - 1) / STREAMS_PER_PAGE);
    if (currentPage >= newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages - 1);
    }

    toast({
      title: 'Stream Deleted',
      description: `${stream?.name} has been removed`,
    });

    setDeleteStreamId(null);
  };

  const handleDownload = async (streamId: string, streamName: string) => {
    setIsDownloading(true);
    
    toast({
      title: 'Generating CSV',
      description: `Preparing ${selectedRange} of data for ${streamName}...`,
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch current stats for the stream
    const stream = streams.find(s => s.id === streamId);
    let currentStats = null;
    
    if (stream) {
      try {
        const response = await fetch(stream.statsUrl);
        if (response.ok) {
          currentStats = await response.json();
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    const csv = generateCSV(streamName, selectedRange, currentStats);
    const filename = `${streamId}_${selectedRange}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csv, filename);

    toast({
      title: 'Download Complete',
      description: `Successfully downloaded ${filename}`,
    });

    setIsDownloading(false);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-accent transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-8 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Head Count Streams
                </h1>
                <p className="text-sm text-muted-foreground">Real-time monitoring • {streams.length} Cameras</p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Stream Data</DialogTitle>
                  <DialogDescription>
                    Download CSV logs for any camera stream with your selected time range
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Range</label>
                    <Select value={selectedRange} onValueChange={(value) => setSelectedRange(value as TimeRange)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1hour">Last 1 Hour</SelectItem>
                        <SelectItem value="6hours">Last 6 Hours</SelectItem>
                        <SelectItem value="12hours">Last 12 Hours</SelectItem>
                        <SelectItem value="1day">Last 24 Hours</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Camera</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {streams.map(stream => (
                        <Button
                          key={stream.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleDownload(stream.id, stream.name)}
                          disabled={isDownloading}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {stream.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Carousel Controls */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="hover:bg-accent transition-all disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </p>
            <p className="text-xs text-muted-foreground">
              Showing {currentStreams.length} of {streams.length} streams
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="hover:bg-accent transition-all disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {currentStreams.map((stream) => (
            <div key={stream.id} className="relative group">
              <StreamCard stream={stream} />
              {stream.id.startsWith('custom_') && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => handleDeleteStream(stream.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add Stream Button */}
        <div className="flex justify-center">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Stream
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stream</DialogTitle>
                <DialogDescription>
                  Add a custom camera stream to the monitoring system
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="streamName">Stream Name *</Label>
                  <Input
                    id="streamName"
                    placeholder="e.g., Main Entrance Camera"
                    value={newStreamName}
                    onChange={(e) => setNewStreamName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streamUrl">Stream URL *</Label>
                  <Input
                    id="streamUrl"
                    placeholder="e.g., http://10.1.40.46:6001/stream"
                    value={newStreamUrl}
                    onChange={(e) => setNewStreamUrl(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddStream}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  Add Stream
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm py-3 z-40">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground">
            Made by <span className="font-semibold text-foreground">Dixon IoT Lab</span>
          </p>
        </div>
      </footer>
      
      <PlakshaLogo />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStreamId} onOpenChange={() => setDeleteStreamId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stream</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stream? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StreamsPage;
