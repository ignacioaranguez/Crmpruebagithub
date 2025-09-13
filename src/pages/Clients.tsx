import { useState } from "react";
import { Plus, Search, Phone, Mail, MapPin, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clients = [
  {
    id: 1,
    name: "María González",
    company: "TechCorp S.L.",
    email: "maria@techcorp.com",
    phone: "+34 666 123 456",
    location: "Madrid",
    status: "activo",
    value: "€15,000",
    lastContact: "2024-01-10"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    company: "Innovate Solutions",
    email: "carlos@innovate.es",
    phone: "+34 677 234 567",
    location: "Barcelona",
    status: "activo",
    value: "€22,500",
    lastContact: "2024-01-08"
  },
  {
    id: 3,
    name: "Ana Martín",
    company: "Digital Hub",
    email: "ana@digitalhub.com",
    phone: "+34 688 345 678",
    location: "Valencia",
    status: "inactivo",
    value: "€8,000",
    lastContact: "2023-12-15"
  },
  {
    id: 4,
    name: "Pedro López",
    company: "StartUp Pro",
    email: "pedro@startuppro.es",
    phone: "+34 699 456 789",
    location: "Sevilla",
    status: "prospecto",
    value: "€30,000",
    lastContact: "2024-01-12"
  }
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-success/10 text-success hover:bg-success/20";
      case "inactivo":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      case "prospecto":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Clientes</h2>
          <p className="text-muted-foreground">Administra tu cartera de clientes</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar clientes por nombre o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                      <DropdownMenuItem>Crear tarea</DropdownMenuItem>
                      <DropdownMenuItem>Registrar actividad</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {client.phone}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {client.location}
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valor</span>
                  <span className="text-lg font-bold text-success">{client.value}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Último contacto</span>
                  <span className="text-xs text-muted-foreground">{client.lastContact}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron clientes</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza añadiendo tu primer cliente"}
            </p>
            <Button className="bg-gradient-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Cliente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}