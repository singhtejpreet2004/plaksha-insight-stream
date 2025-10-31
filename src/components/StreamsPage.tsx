import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Download, FileDown } from 'lucide-react';
import { STREAMS } from '@/lib/streams';
import { TimeRange, generateCSV, downloadCSV } from '@/lib/csv';
import StreamCard from './StreamCard';
import { useToast } from '@/hooks/use-toast';

const StreamsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1day');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (streamId: string, streamName: string) => {
    setIsDownloading(true);
    
    toast({
      title: 'Generating CSV',
      description: `Preparing ${selectedRange} of data for ${streamName}...`,
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fetch current stats for the stream
    const stream = STREAMS.find(s => s.id === streamId);
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
                <p className="text-sm text-muted-foreground">Real-time monitoring • 4 Active Cameras</p>
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
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1day">Last 24 Hours</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="1month">Last Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Camera</label>
                    <div className="grid gap-2">
                      {STREAMS.map((stream) => (
                        <Button
                          key={stream.id}
                          variant="outline"
                          className="justify-start hover:bg-primary hover:text-primary-foreground transition-all"
                          onClick={() => handleDownload(stream.id, stream.name)}
                          disabled={isDownloading}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {STREAMS.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <h3 className="font-semibold text-lg mb-2 text-foreground">About the Monitoring System</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This system uses YOLOv8 with BoT-SORT tracking algorithm for accurate real-time head counting.
            All streams are processed locally with FP16 precision on CUDA-enabled GPUs for optimal performance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">4</p>
              <p className="text-xs text-muted-foreground">Active Cameras</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-secondary">30+</p>
              <p className="text-xs text-muted-foreground">FPS Average</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground">Monitoring</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-secondary">Real-time</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Made by <span className="text-primary font-bold">Dixon IoT Lab</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StreamsPage;
