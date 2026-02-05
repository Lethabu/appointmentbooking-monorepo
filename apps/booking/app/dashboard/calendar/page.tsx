"use client"

import { Calendar, CalendarDays, RefreshCw, Settings, AlertTriangle, CheckCircle, XCircle, ExternalLink, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarConnection {
    id: string;
    provider: 'google' | 'microsoft';
    isActive: boolean;
    lastSync: string | null;
    tokenExpiry: number | null;
    errorCount: number;
    successCount: number;
    lastError: string | null;
}

interface SyncEvent {
    id: string;
    bookingId: string;
    syncStatus: 'created' | 'updated' | 'failed' | 'deleted';
    errorMessage: string | null;
    createdAt: string;
}

interface SyncStatus {
    connections: CalendarConnection[];
    recentEvents: SyncEvent[];
    statistics: {
        totalSyncs: number;
        successfulSyncs: number;
        failedSyncs: number;
        successRate: number;
        averageSyncTime: number;
    };
    health: {
        overall: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
    };
}

export default function CalendarManagementPage() {
    const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retrying, setRetrying] = useState(false);

    const tenantId = 'default'; // In real app, get from context/URL

    useEffect(() => {
        fetchSyncStatus();
    }, []);

    const fetchSyncStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/calendar/sync-status', {
                headers: {
                    tenantId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sync status');
            }

            const data = await response.json();
            setSyncStatus((data as { data: SyncStatus }).data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch sync status');
        } finally {
            setLoading(false);
        }
    };

    const retryFailedSyncs = async () => {
        try {
            setRetrying(true);
            const response = await fetch('/api/calendar/sync-status/retry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    tenantId
                },
                body: JSON.stringify({ maxRetries: 10 })
            });

            if (!response.ok) {
                throw new Error('Failed to retry failed syncs');
            }

            const data = await response.json();

            // Refresh sync status
            await fetchSyncStatus();

            alert(`Retry completed: ${(data as { data: { successful: number; failed: number } }).data.successful} successful, ${(data as { data: { successful: number; failed: number } }).data.failed} failed`);
        } catch (err) {
            alert(`Failed to retry syncs: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setRetrying(false);
        }
    };

    const connectGoogleCalendar = () => {
        window.location.href = `/api/google-calendar/oauth?tenantId=${tenantId}`;
    };

    const connectOutlookCalendar = () => {
        window.location.href = `/api/outlook-calendar/oauth?tenantId=${tenantId}`;
    };

    const disconnectCalendar = async (connectionId: string) => {
        if (!confirm('Are you sure you want to disconnect this calendar integration?')) {
            return;
        }

        try {
            const response = await fetch('/api/google-calendar/disconnect', {
                method: 'POST',
                headers: {
                    tenantId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect calendar');
            }

            // Refresh sync status
            await fetchSyncStatus();
        } catch (err) {
            alert(`Failed to disconnect calendar: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'critical':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
            'created': 'default',
            'updated': 'default',
            'failed': 'destructive',
            'deleted': 'secondary'
        };

        return (
            <Badge variant={variants[status] || 'outline'}>
                {status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Calendar Integration</h1>
                    <p className="text-muted-foreground">
                        Manage calendar integrations and monitor synchronization
                    </p>
                </div>
                <Button onClick={fetchSyncStatus} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Health Overview */}
            {syncStatus && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getHealthIcon(syncStatus.health.overall)}
                            System Health
                        </CardTitle>
                        <CardDescription>
                            Overall status of calendar integrations and sync operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{syncStatus.statistics.successRate}%</div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{syncStatus.statistics.totalSyncs}</div>
                                <div className="text-sm text-muted-foreground">Total Syncs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{syncStatus.statistics.failedSyncs}</div>
                                <div className="text-sm text-muted-foreground">Failed Syncs</div>
                            </div>
                        </div>

                        {syncStatus.health.issues.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="font-semibold">Issues:</h4>
                                {syncStatus.health.issues.map((issue, index) => (
                                    <Alert key={index}>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{issue}</AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        )}

                        {syncStatus.health.recommendations.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h4 className="font-semibold">Recommendations:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {syncStatus.health.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="connections" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                    <TabsTrigger value="sync-events">Recent Sync Events</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="connections" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Google Calendar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Google Calendar
                                </CardTitle>
                                <CardDescription>
                                    Sync appointments with Google Calendar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {syncStatus?.connections.find(c => c.provider === 'google') ? (
                                    <div className="space-y-4">
                                        {(() => {
                                            const conn = syncStatus.connections.find(c => c.provider === 'google')!;
                                            return (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant={conn.isActive ? 'default' : 'secondary'}>
                                                            {conn.isActive ? 'Connected' : 'Disconnected'}
                                                        </Badge>
                                                        {conn.isActive && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => disconnectCalendar(conn.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Success:</span>
                                                            <span className="text-green-600">{conn.successCount}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Errors:</span>
                                                            <span className="text-red-600">{conn.errorCount}</span>
                                                        </div>
                                                        {conn.lastSync && (
                                                            <div className="flex justify-between">
                                                                <span>Last Sync:</span>
                                                                <span>{new Date(conn.lastSync).toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {conn.lastError && (
                                                            <div className="text-red-600 text-xs">
                                                                Last Error: {conn.lastError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <Button onClick={connectGoogleCalendar} className="w-full">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Connect Google Calendar
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Outlook Calendar */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5" />
                                    Outlook Calendar
                                </CardTitle>
                                <CardDescription>
                                    Sync appointments with Microsoft Outlook
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {syncStatus?.connections.find(c => c.provider === 'microsoft') ? (
                                    <div className="space-y-4">
                                        {(() => {
                                            const conn = syncStatus.connections.find(c => c.provider === 'microsoft')!;
                                            return (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant={conn.isActive ? 'default' : 'secondary'}>
                                                            {conn.isActive ? 'Connected' : 'Disconnected'}
                                                        </Badge>
                                                        {conn.isActive && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => disconnectCalendar(conn.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Success:</span>
                                                            <span className="text-green-600">{conn.successCount}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Errors:</span>
                                                            <span className="text-red-600">{conn.errorCount}</span>
                                                        </div>
                                                        {conn.lastSync && (
                                                            <div className="flex justify-between">
                                                                <span>Last Sync:</span>
                                                                <span>{new Date(conn.lastSync).toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {conn.lastError && (
                                                            <div className="text-red-600 text-xs">
                                                                Last Error: {conn.lastError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <Button onClick={connectOutlookCalendar} className="w-full">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Connect Outlook Calendar
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Retry Failed Syncs */}
                    {syncStatus && syncStatus.statistics.failedSyncs > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Sync Recovery</CardTitle>
                                <CardDescription>
                                    Retry failed synchronization operations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={retryFailedSyncs}
                                    disabled={retrying}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {retrying ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Retrying...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Retry {syncStatus.statistics.failedSyncs} Failed Syncs
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="sync-events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Sync Events</CardTitle>
                            <CardDescription>
                                Latest calendar synchronization events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {syncStatus?.recentEvents.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No sync events found
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {syncStatus?.recentEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">Booking {event.bookingId}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(event.createdAt).toLocaleString()}
                                                </div>
                                                {event.errorMessage && (
                                                    <div className="text-sm text-red-600">
                                                        Error: {event.errorMessage}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(event.syncStatus)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Sync Settings
                            </CardTitle>
                            <CardDescription>
                                Configure calendar synchronization preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Auto-sync new appointments</div>
                                        <div className="text-sm text-muted-foreground">
                                            Automatically create calendar events when appointments are booked
                                        </div>
                                    </div>
                                    <Badge variant="outline">Enabled</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Sync external calendar conflicts</div>
                                        <div className="text-sm text-muted-foreground">
                                            Check external calendars for conflicts when booking
                                        </div>
                                    </div>
                                    <Badge variant="outline">Enabled</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Real-time webhook notifications</div>
                                        <div className="text-sm text-muted-foreground">
                                            Receive instant updates when external calendar events change
                                        </div>
                                    </div>
                                    <Badge variant="outline">Enabled</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
export const runtime = 'edge';
