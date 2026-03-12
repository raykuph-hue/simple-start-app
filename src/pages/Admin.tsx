import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Logo } from "@/components/brand/Logo";
import {
  Users,
  Globe,
  DollarSign,
  Search,
  Ban,
  CheckCircle,
  Trash2,
  Eye,
  LogOut,
  Loader2,
  Shield,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock analytics data for visualization
const generateMockAnalytics = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    name: day,
    users: Math.floor(Math.random() * 50) + 20,
    sites: Math.floor(Math.random() * 30) + 10,
    revenue: Math.floor(Math.random() * 500) + 100,
  }));
};

const subscriptionData = [
  { name: 'Free', value: 65, color: '#64748b' },
  { name: 'Starter', value: 25, color: '#00d4ff' },
  { name: 'Pro', value: 10, color: '#7c3aed' },
];

const Admin = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading, getStats, listUsers, listSites, suspendUser, toggleUserAds, deleteSite, getAuditLogs } = useAdminApi();

  const [stats, setStats] = useState({ totalUsers: 0, totalSites: 0, proSubscriptions: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsData] = useState(generateMockAnalytics);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && isAdmin === false) {
      toast.error("Access denied: Admin privileges required");
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [statsData, usersData, sitesData, logsData] = await Promise.all([
        getStats(),
        listUsers(1, 20, userSearch),
        listSites(1, 20),
        getAuditLogs(1, 50),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setSites(sitesData.sites);
      setLogs(logsData.logs);
    } catch (error: any) {
      console.error("Error loading admin data:", error);
      toast.error(error.message || "Failed to load data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSuspendUser = async (userId: string, currentStatus: boolean) => {
    try {
      await suspendUser(userId, !currentStatus);
      toast.success(currentStatus ? "User unsuspended" : "User suspended");
      await loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleAds = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserAds(userId, !currentStatus);
      toast.success(currentStatus ? "Ads enabled" : "Ads disabled");
      await loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    try {
      await deleteSite(siteId);
      toast.success("Site deleted");
      await loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUserSearch = async () => {
    try {
      const data = await listUsers(1, 20, userSearch);
      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo size="sm" linkTo="/dashboard" />
              <Badge className="gap-1 gradient-primary text-primary-foreground border-0">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={loadData} disabled={isLoadingData}>
                <RefreshCw className={`w-5 h-5 ${isLoadingData ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="gradient-text-premium">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage users, sites, and platform analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Globe className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSites}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pro Subscriptions</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.proSubscriptions}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+24%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Activity className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(stats.totalUsers * 0.7)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-muted-foreground">70% active rate</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mb-6 bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-glass border-0">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest signups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name || "Unnamed"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.plan === "pro" ? "default" : user.plan === "starter" ? "secondary" : "outline"}>
                          {user.plan}
                        </Badge>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <p className="text-muted-foreground text-sm">No users yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass border-0">
                <CardHeader>
                  <CardTitle>Recent Sites</CardTitle>
                  <CardDescription>Latest websites created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sites.slice(0, 5).map((site) => (
                      <div key={site.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-muted-foreground">{site.subdomain}.phosify.app</p>
                        </div>
                        <Badge variant={site.is_published ? "default" : "secondary"}>
                          {site.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    ))}
                    {sites.length === 0 && (
                      <p className="text-muted-foreground text-sm">No sites yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users & Sites Chart */}
              <Card className="card-glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>New users and sites this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSites" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                      <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                      <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222 47% 8%)', 
                          border: '1px solid hsl(222 30% 18%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="users" stroke="#00d4ff" fillOpacity={1} fill="url(#colorUsers)" />
                      <Area type="monotone" dataKey="sites" stroke="#7c3aed" fillOpacity={1} fill="url(#colorSites)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subscription Distribution */}
              <Card className="card-glass border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Subscription Distribution
                  </CardTitle>
                  <CardDescription>Users by plan type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={subscriptionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {subscriptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(222 47% 8%)', 
                            border: '1px solid hsl(222 30% 18%)',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {subscriptionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Chart */}
              <Card className="card-glass border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Weekly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                      <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                      <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222 47% 8%)', 
                          border: '1px solid hsl(222 30% 18%)',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="card-glass border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUserSearch()}
                      className="input-field w-full sm:w-64"
                    />
                    <Button variant="outline" onClick={handleUserSearch} className="btn-secondary">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Sites</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ads</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name || "Unnamed"}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.plan === "pro" ? "default" : user.plan === "starter" ? "secondary" : "outline"}>
                              {user.plan}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.sites_created}/{user.sites_limit}</TableCell>
                          <TableCell>
                            {user.is_suspended ? (
                              <Badge variant="destructive">Suspended</Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-400 border-green-400/30">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.ads_disabled ? (
                              <Badge variant="secondary">Disabled</Badge>
                            ) : (
                              <Badge variant="outline">Enabled</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuspendUser(user.user_id, user.is_suspended)}
                                title={user.is_suspended ? "Unsuspend user" : "Suspend user"}
                              >
                                {user.is_suspended ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Ban className="w-4 h-4 text-destructive" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleAds(user.user_id, user.ads_disabled)}
                                title={user.ads_disabled ? "Enable ads" : "Disable ads"}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites">
            <Card className="card-glass border-0">
              <CardHeader>
                <CardTitle>Site Management</CardTitle>
                <CardDescription>View and moderate all websites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Site</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ads</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sites.map((site) => (
                        <TableRow key={site.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{site.name}</p>
                              <p className="text-sm text-muted-foreground">{site.subdomain}.phosify.app</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={site.is_published ? "default" : "secondary"}>
                              {site.is_published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {site.has_ads ? (
                              <Badge variant="outline">Has Ads</Badge>
                            ) : (
                              <Badge variant="secondary">No Ads</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(site.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSite(site.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {sites.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No sites found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="logs">
            <Card className="card-glass border-0">
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>Admin action history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>
                            {log.target_user_id && (
                              <p className="text-sm text-muted-foreground">
                                User: {log.target_user_id.slice(0, 8)}...
                              </p>
                            )}
                            {log.target_website_id && (
                              <p className="text-sm text-muted-foreground">
                                Site: {log.target_website_id.slice(0, 8)}...
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <pre className="text-xs max-w-xs overflow-hidden text-ellipsis">
                              {log.details ? JSON.stringify(log.details, null, 2) : "-"}
                            </pre>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {logs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No audit logs found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
