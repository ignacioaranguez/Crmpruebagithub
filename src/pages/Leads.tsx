import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: string;
  value?: number;
  notes?: string;
  created_at: string;
}

const leads = [];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
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
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    {lead.company && (
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    )}
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
                {lead.email && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {lead.email}
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {lead.phone}
                  </div>
                )}
                {lead.source && (
                  <div className="text-sm text-muted-foreground">
                    Fuente: {lead.source}
                  </div>
                )}
                
                <div className="pt-2 border-t border-border space-y-2">
                  {lead.value && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Valor estimado</span>
                      <span className="text-lg font-bold text-success">
                        {lead.value.toLocaleString('es-ES')}€
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Creado: {new Date(lead.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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