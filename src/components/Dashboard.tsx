import { useState, useEffect } from "react";
import { Users, UserPlus, CheckSquare, TrendingUp, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalClients: number;
  activeLeads: number;
  pendingTasks: number;
  completedActivities: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  client_name?: string;
  completed_date?: string;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeLeads: 0,
    pendingTasks: 0,
    completedActivities: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get stats
      const [clientsResult, leadsResult, tasksResult, activitiesResult] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'nuevo'),
        supabase.from('tasks').select('id', { count: 'exact' }).eq('status', 'pendiente'),
        supabase.from('activities').select('id', { count: 'exact' }).eq('status', 'completada')
      ]);

      setStats({
        totalClients: clientsResult.count || 0,
        activeLeads: leadsResult.count || 0,
        pendingTasks: tasksResult.count || 0,
        completedActivities: activitiesResult.count || 0
      });

      // Get recent activities with client names
      const { data: activities } = await supabase
        .from('activities')
        .select(`
          id,
          type,
          title,
          status,
          completed_date,
          clients(name)
        `)
        .eq('status', 'completada')
        .order('completed_date', { ascending: false })
        .limit(4);

      if (activities) {
        const formattedActivities = activities.map(activity => ({
          ...activity,
          client_name: activity.clients?.name || 'Cliente no especificado'
        }));
        setRecentActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  const statsConfig = [
    {
      name: "Total Clientes",
      value: stats.totalClients.toString(),
      icon: Users,
    },
    {
      name: "Leads Activos", 
      value: stats.activeLeads.toString(),
      icon: UserPlus,
    },
    {
      name: "Tareas Pendientes",
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
    },
    {
      name: "Actividades Completadas",
      value: stats.completedActivities.toString(),
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <Card key={stat.name} className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>
              Últimas acciones comerciales realizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="flex-shrink-0">
                    {activity.type === 'call' && <Phone className="h-4 w-4 text-primary" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-accent" />}
                    {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-warning" />}
                    {activity.type === 'email' && <Phone className="h-4 w-4 text-secondary" />}
                    {activity.type === 'visit' && <Calendar className="h-4 w-4 text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.client_name} • {activity.completed_date ? formatTimeAgo(activity.completed_date) : 'Sin fecha'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      completada
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay actividades recientes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas más comunes del día
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Crear nuevo lead
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Añadir cliente
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Registrar llamada
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar visita
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckSquare className="mr-2 h-4 w-4" />
              Crear tarea
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}