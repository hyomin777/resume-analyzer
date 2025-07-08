export type Education = {
  id: number;
  school: string;
  major?: string;
  period?: string;
  status?: string;
};

export type Career = {
  id: number;
  company: string;
  role?: string;
  period?: string;
  description?: string;
};

export type Certificate = {
  id: number;
  title: string;
  issuer?: string;
  date?: string;
};

export type Activity = {
  id: number;
  title: string;
  org?: string;
  period?: string;
  description?: string;
};

export type Skill = {
  id: number;
  name: string;
};

export type Resume = {
  id: number;
  user_id: number;
  content?: string;
  portfolio?: string;
  is_pdf?: boolean;
  created_at?: string;
  updated_at?: string;
  education: Education[];
  career: Career[];
  certificate: Certificate[];
  activity: Activity[];
  skills: Skill[];
};
