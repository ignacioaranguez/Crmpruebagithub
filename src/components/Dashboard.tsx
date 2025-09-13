import { Users, UserPlus, CheckSquare, TrendingUp, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    name: "Total Clientes",
    value: "156",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Leads Activos",
    value: "24",
    change: "+8%",
    changeType: "positive", 
    icon: UserPlus,
  },
  {
    name: "Tareas Pendientes",
    value: "18",
    change: "-5%",
    changeType: "negative",
    icon: CheckSquare,
  },
  {
    name: "Conversión",
    value: "24.5%",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

const recentActivities = [
  {
    id: 1,
    type: "call",
    client: "María González",
    action: "Llamada realizada",
    time: "Hace 2 horas",
    status: "completada"
  },
  {
    id: 2,
    type: "meeting",
    client: "Carlos Ruiz",
    action: "Visita comercial",
    time: "Hace 4 horas", 
    status: "completada"
  },
  {
    id: 3,
    type: "task",
    client: "Ana Martín",
    action: "Enviar propuesta",
    time: "Hace 1 día",
    status: "pendiente"
  },
  {
    id: 4,
    type: "call",
    client: "Pedro López",
    action: "Seguimiento lead",
    time: "Hace 1 día",
    status: "completada"
  }
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
              }`}>
                {stat.change} desde el mes pasado
              </p>
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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                <div className="flex-shrink-0">
                  {activity.type === 'call' && <Phone className="h-4 w-4 text-primary" />}
                  {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-accent" />}
                  {activity.type === 'task' && <CheckSquare className="h-4 w-4 text-warning" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.client} • {activity.time}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completada' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
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