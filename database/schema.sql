CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.admins (username, password) 
VALUES ('admin', 'admin123');

CREATE TABLE public.agenda_pimpinan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,     
    end_time TIME,          
    location TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.agenda_kunjungan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    institution_name TEXT,   
    date DATE NOT NULL,
    time TIME NOT NULL,      
    end_time TIME,           
    location TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.agenda_pimpinan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_kunjungan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable All Access Pimpinan" ON public.agenda_pimpinan
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable All Access Kunjungan" ON public.agenda_kunjungan
FOR ALL USING (true) WITH CHECK (true);