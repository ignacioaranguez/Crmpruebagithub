import { useState } from "react";
import { Plus, Search, Clock, CheckSquare, AlertCircle, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  {
    id: 1,
    title: "Enviar propuesta comercial",
    description: "Elaborar y enviar propuesta detallada a María González",
    client: "María González - TechCorp",
    priority: "alta",
    status: "pendiente",
    dueDate: "2024-01-18",
    completed: false,
    assignee: "Juan Pérez"
  },
  {
    id: 2,
    title: "Llamada de seguimiento",
    description: "Contactar para conocer decisión sobre la propuesta",
    client: "Carlos Ruiz - Innovate Solutions", 
    priority: "media",
    status: "en_proceso",
    dueDate: "2024-01-16",
    completed: false,
    assignee: "Ana García"
  },
  {
    id: 3,
    title: "Preparar demo del producto",
    description: "Configurar demo personalizada para presentación",
    client: "Sofia Herrera - NextGen Solutions",
    priority: "alta",
    status: "pendiente",
    dueDate: "2024-01-20",
    completed: false,
    assignee: "Miguel Torres"
  },
  {
    id: 4,
    title: "Reunión de cierre",
    description: "Reunión final para firma de contrato",
    client: "Pedro López - StartUp Pro",
    priority: "baja",
    status: "completada",
    dueDate: "2024-01-12",
    completed: true,
    assignee: "Juan Pérez"
  }
];

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todas" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case "media":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "baja":
        return "bg-success/10 text-success hover:bg-success/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-muted text-muted-foreground";
      case "en_proceso":
        return "bg-primary/10 text-primary";
      case "completada":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const toggleTaskComplete = (taskId: number) => {
    // Aquí iría la lógica para marcar/desmarcar como completada
    console.log(`Toggle task ${taskId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Tareas</h2>
          <p className="text-muted-foreground">Organiza y controla tus actividades pendientes</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar tareas o clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "todas" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("todas")}
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === "pendiente" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pendiente")}
              >
                Pendientes
              </Button>
              <Button
                variant={filterStatus === "en_proceso" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("en_proceso")}
              >
                En proceso
              </Button>
              <Button
                variant={filterStatus === "completada" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completada")}
              >
                Completadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskComplete(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {task.client}
                      </div>
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        Asignado a: {task.assignee}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Vencimiento: {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron tareas</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primera tarea"}
            </p>
            <Button className="bg-gradient-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Crear Tarea
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}