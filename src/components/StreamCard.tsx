import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StreamConfig, StreamStats, fetchStreamStats } from '@/lib/streams';
import { Activity, AlertCircle } from 'lucide-react';

interface StreamCardProps {
  stream: StreamConfig;
}

const StreamCard = ({ stream }: StreamCardProps) => {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchStreamStats(stream.statsUrl);
      if (data) {
        setStats(data);
        retryCountRef.current = 0;
      }
    } catch (err) {
      // Swallow errors to avoid noisy logs when preview cannot reach LAN
      retryCountRef.current++;
      if (retryCountRef.current >= maxRetries) {
        // Stop fetching after max retries
        if (statsIntervalRef.current) {
          clearInterval(statsIntervalRef.current);
        }
      }
    }
  }, [stream.statsUrl]);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Fetch stats every 2 seconds (reduced from 1s for better performance)
    statsIntervalRef.current = setInterval(fetchStats, 2000);

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [fetchStats]);

  return (
    <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-muted/50 to-muted/30 p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-bold text-foreground mb-1">
              {stream.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{stream.location}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className={`text-xs py-0 ${isOnline ? "bg-green-500" : ""}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isOnline ? 'bg-white' : 'bg-white/70'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Stream Display */}
        <div className="relative aspect-video bg-black">
          {!imageError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="text-center space-y-1">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground">Loading stream...</p>
                  </div>
                </div>
              )}
              <img
                ref={imgRef}
                src={stream.streamUrl}
                alt={`${stream.name} live feed`}
                className="w-full h-full object-contain"
                loading="lazy"
                onLoad={() => {
                  setIsOnline(true);
                  setIsLoading(false);
                }}
                onError={() => {
                  setImageError(true);
                  setIsOnline(false);
                  setIsLoading(false);
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center space-y-1">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">Stream offline</p>
                <p className="text-xs text-muted-foreground/70">Check connection</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Display */}
        <div className="p-2 bg-gradient-to-b from-card to-muted/20 border-t">
          {stats ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-1.5 rounded bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-0.5">FPS</p>
                <p className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3" />
                  {stats.avg_fps.toFixed(1)}
                </p>
              </div>
              <div className="text-center p-1.5 rounded bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-0.5">Count</p>
                <p className="text-sm font-bold text-secondary">
                  {stats.last_head_count}
                </p>
              </div>
              <div className="text-center p-1.5 rounded bg-background/50 border">
                <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                <p className="text-sm font-bold text-accent-foreground">
                  {stats.total_heads}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-2">
              <p className="text-xs text-muted-foreground">Waiting for data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamCard;
