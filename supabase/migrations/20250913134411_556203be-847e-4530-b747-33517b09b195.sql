-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table  
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'calificado', 'perdido', 'convertido')),
  value DECIMAL(10,2),
  notes TEXT,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  due_date DATE,
  client_id UUID REFERENCES public.clients(id),
  lead_id UUID REFERENCES public.leads(id),
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table (commercial actions)
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('call', 'meeting', 'email', 'visit', 'task', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completada' CHECK (status IN ('completada', 'pendiente', 'cancelada')),
  client_id UUID REFERENCES public.clients(id),
  lead_id UUID REFERENCES public.leads(id),
  task_id UUID REFERENCES public.tasks(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table for multiple contacts per client
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - in production you'd want user-specific policies)
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.clients (name, email, phone, company, address, status) VALUES
('María González', 'maria@empresa.com', '+34 600 123 456', 'Empresa ABC', 'Calle Mayor 123, Madrid', 'active'),
('Carlos Ruiz', 'carlos@tech.com', '+34 600 789 012', 'Tech Solutions', 'Av. Diagonal 456, Barcelona', 'active'),
('Ana Martín', 'ana@consultoria.com', '+34 600 345 678', 'Consultoría XYZ', 'Gran Vía 789, Valencia', 'active'),
('Pedro López', 'pedro@startup.com', '+34 600 901 234', 'Startup Innovadora', 'Paseo de Gracia 012, Barcelona', 'active');

INSERT INTO public.leads (name, email, phone, company, source, status, value) VALUES
('Laura Fernández', 'laura@newcompany.com', '+34 600 567 890', 'Nueva Empresa', 'Web', 'nuevo', 5000.00),
('Miguel Sánchez', 'miguel@potential.com', '+34 600 234 567', 'Cliente Potencial', 'Referido', 'contactado', 8000.00),
('Isabel García', 'isabel@prospect.com', '+34 600 678 901', 'Prospecto SA', 'LinkedIn', 'calificado', 12000.00);

INSERT INTO public.tasks (title, description, status, priority, due_date, client_id) VALUES
('Enviar propuesta', 'Preparar y enviar propuesta comercial detallada', 'pendiente', 'alta', '2025-01-20', (SELECT id FROM public.clients WHERE name = 'Ana Martín')),
('Seguimiento llamada', 'Realizar seguimiento de la llamada comercial', 'pendiente', 'media', '2025-01-18', (SELECT id FROM public.clients WHERE name = 'Pedro López')),
('Reunión presentación', 'Presentar servicios en oficina del cliente', 'en_progreso', 'alta', '2025-01-22', (SELECT id FROM public.clients WHERE name = 'María González'));

INSERT INTO public.activities (type, title, description, status, client_id, completed_date) VALUES
('call', 'Llamada comercial', 'Llamada inicial para presentar servicios', 'completada', (SELECT id FROM public.clients WHERE name = 'María González'), now() - interval '2 hours'),
('meeting', 'Visita comercial', 'Reunión presencial en oficinas del cliente', 'completada', (SELECT id FROM public.clients WHERE name = 'Carlos Ruiz'), now() - interval '4 hours'),
('call', 'Seguimiento lead', 'Llamada de seguimiento para calificar lead', 'completada', (SELECT id FROM public.clients WHERE name = 'Pedro López'), now() - interval '1 day');

INSERT INTO public.contacts (client_id, name, email, phone, position, is_primary) VALUES
((SELECT id FROM public.clients WHERE name = 'María González'), 'María González', 'maria@empresa.com', '+34 600 123 456', 'CEO', true),
((SELECT id FROM public.clients WHERE name = 'Carlos Ruiz'), 'Carlos Ruiz', 'carlos@tech.com', '+34 600 789 012', 'CTO', true),
((SELECT id FROM public.clients WHERE name = 'Carlos Ruiz'), 'Sofía Ruiz', 'sofia@tech.com', '+34 600 789 013', 'Marketing Manager', false);