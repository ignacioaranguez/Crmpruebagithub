import { useState } from "react";
import { Plus, Search, Phone, Calendar, MessageSquare, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "llamada",
    title: "Llamada comercial",
    description: "Discusión sobre necesidades y presentación de servicios",
    client: "María González - TechCorp",
    duration: "45 min",
    outcome: "Interesada, solicita propuesta",
    date: "2024-01-15 10:30",
    status: "completada",
    assignee: "Juan Pérez"
  },
  {
    id: 2,
    type: "visita",
    title: "Reunión en oficinas del cliente",
    description: "Presentación de demo y negociación de términos",
    client: "Carlos Ruiz - Innovate Solutions",
    duration: "2 horas",
    outcome: "Muy positiva, próxima reunión programada",
    date: "2024-01-14 14:00",
    status: "completada",
    assignee: "Ana García"
  },
  {
    id: 3,
    type: "email",
    title: "Envío de propuesta comercial",
    description: "Propuesta detallada con precios y condiciones",
    client: "Sofia Herrera - NextGen Solutions",
    duration: "N/A",
    outcome: "Enviada, esperando respuesta",
    date: "2024-01-13 16:45",
    status: "completada",
    assignee: "Miguel Torres"
  },
  {
    id: 4,
    type: "llamada",
    title: "Llamada de seguimiento programada",
    description: "Seguimiento de propuesta enviada la semana pasada",
    client: "Pedro López - StartUp Pro",
    duration: "30 min",
    outcome: "Pendiente",
    date: "2024-01-18 11:00",
    status: "programada",
    assignee: "Juan Pérez"
  }
];

export default function Activities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todas");

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todas" || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "llamada":
        return Phone;
      case "visita":
        return Calendar;
      case "email":
        return Mail;
      case "reunion":
        return MessageSquare;
      default:
        return Clock;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "llamada":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "visita":
        return "bg-accent/10 text-accent hover:bg-accent/20";
      case "email":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "reunion":
        return "bg-success/10 text-success hover:bg-success/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completada":
        return "bg-success/10 text-success";
      case "programada":
        return "bg-primary/10 text-primary";
      case "cancelada":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Registro de Actividades</h2>
          <p className="text-muted-foreground">Historial de todas las interacciones comerciales</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Actividad
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar actividades o clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "todas" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("todas")}
              >
                Todas
              </Button>
              <Button
                variant={filterType === "llamada" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("llamada")}
              >
                <Phone className="mr-1 h-4 w-4" />
                Llamadas
              </Button>
              <Button
                variant={filterType === "visita" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("visita")}
              >
                <Calendar className="mr-1 h-4 w-4" />
                Visitas
              </Button>
              <Button
                variant={filterType === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("email")}
              >
                <Mail className="mr-1 h-4 w-4" />
                Emails
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const TypeIcon = getTypeIcon(activity.type);
          return (
            <Card key={activity.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-foreground">
                        {activity.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(activity.type)}>
                          {activity.type}
                        </Badge>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                      {activity.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <div className="flex items-center mb-1">
                          <MapPin className="mr-1 h-4 w-4" />
                          {activity.client}
                        </div>
                        <div className="flex items-center mb-1">
                          <Clock className="mr-1 h-4 w-4" />
                          {activity.date} • {activity.duration}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1">
                          <strong>Asignado a:</strong> {activity.assignee}
                        </div>
                        <div className="mb-1">
                          <strong>Resultado:</strong> {activity.outcome}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron actividades</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza registrando tu primera actividad"}
            </p>
            <Button className="bg-gradient-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Actividad
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}