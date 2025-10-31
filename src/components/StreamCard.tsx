import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StreamConfig, StreamStats, fetchStreamStats, checkStreamOnline } from '@/lib/streams';
import { Activity, AlertCircle } from 'lucide-react';

interface StreamCardProps {
  stream: StreamConfig;
}

const StreamCard = ({ stream }: StreamCardProps) => {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Initial check
    checkStreamOnline(stream.streamUrl).then(setIsOnline);

    // Fetch stats every second
    const statsInterval = setInterval(async () => {
      const data = await fetchStreamStats(stream.statsUrl);
      if (data) {
        setStats(data);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }, 1000);

    // Check online status every 5 seconds
    const onlineInterval = setInterval(async () => {
      const online = await checkStreamOnline(stream.streamUrl);
      setIsOnline(online);
    }, 5000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(onlineInterval);
    };
  }, [stream]);

  return (
    <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-3 bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground mb-1">
              {stream.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mb-2">{stream.location}</p>
            <Badge variant="outline" className="text-xs">
              {stream.model}
            </Badge>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className={isOnline ? "bg-green-500 animate-pulse-glow" : ""}
            >
              <span className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-white' : 'bg-white/70'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Stream Display */}
        <div className="relative aspect-video bg-black">
          {isOnline && !imageError ? (
            <img
              src={stream.streamUrl}
              alt={`${stream.name} live feed`}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-2">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {isOnline ? 'Loading stream...' : 'Stream offline'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Display */}
        <div className="p-4 bg-gradient-to-b from-card to-muted/20 border-t">
          {stats ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-1">FPS</p>
                <p className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                  <Activity className="w-4 h-4" />
                  {stats.avg_fps.toFixed(1)}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-1">Current Count</p>
                <p className="text-lg font-bold text-secondary">
                  {stats.last_head_count}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-1">Total Detected</p>
                <p className="text-lg font-bold text-foreground">
                  {stats.total_heads.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-2">
              Waiting for data...
            </div>
          )}
          
          {stats && (
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Frames Processed:</span>
                <span className="font-semibold">{stats.frames.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Time:</span>
                <span className="font-semibold">{stats.last_infer_ms.toFixed(2)}ms</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamCard;
