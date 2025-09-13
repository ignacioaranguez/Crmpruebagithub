import { useState } from "react";
import { Plus, Search, Phone, Mail, Calendar, TrendingUp, MoreHorizontal } from "lucide-react";
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

const leads = [
  {
    id: 1,
    name: "Elena Jiménez",
    company: "FutureTech",
    email: "elena@futuretech.com",
    phone: "+34 611 234 567",
    source: "Web",
    status: "nuevo",
    score: 85,
    value: "€25,000",
    created: "2024-01-15",
    nextAction: "Llamar mañana"
  },
  {
    id: 2,
    name: "Roberto Silva",
    company: "Growth Co.",
    email: "roberto@growthco.es",
    phone: "+34 622 345 678",
    source: "Referido",
    status: "contactado",
    score: 92,
    value: "€18,000",
    created: "2024-01-12",
    nextAction: "Enviar propuesta"
  },
  {
    id: 3,
    name: "Sofia Herrera",
    company: "NextGen Solutions",
    email: "sofia@nextgen.com",
    phone: "+34 633 456 789",
    source: "LinkedIn",
    status: "calificado",
    score: 78,
    value: "€35,000",
    created: "2024-01-10",
    nextAction: "Agendar demo"
  },
  {
    id: 4,
    name: "Miguel Torres",
    company: "Innovate Plus",
    email: "miguel@innovateplus.es",
    phone: "+34 644 567 890",
    source: "Evento",
    status: "perdido",
    score: 45,
    value: "€12,000",
    created: "2024-01-05",
    nextAction: "Seguimiento en 3 meses"
  }
];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuevo":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "contactado":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "calificado":
        return "bg-success/10 text-success hover:bg-success/20";
      case "perdido":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestión de Leads</h2>
          <p className="text-muted-foreground">Administra tus oportunidades de negocio</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar leads por nombre o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar lead</DropdownMenuItem>
                      <DropdownMenuItem>Convertir a cliente</DropdownMenuItem>
                      <DropdownMenuItem>Marcar como perdido</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {lead.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {lead.phone}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Score: <span className={`ml-1 font-medium ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
                </div>
                <span className="text-sm text-muted-foreground">{lead.source}</span>
              </div>
              
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valor estimado</span>
                  <span className="text-lg font-bold text-success">{lead.value}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {lead.nextAction}
                </div>
                <div className="text-xs text-muted-foreground">
                  Creado: {lead.created}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron leads</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza añadiendo tu primer lead"}
            </p>
            <Button className="bg-gradient-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}