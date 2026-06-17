export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author: string;
  read_minutes: number;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

export type PageSeo = {
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
  sort_order: number;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: string;
  created_at: string;
};

export type LeadStatus = {
  id: string;
  label: string;
  sort_order: number;
};

export type Subscriber = {
  id: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  brand_name: string;
  header_cta_label: string;
  header_cta_href: string;
  footer_tagline: string;
  footer_copyright: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  sort_order: number;
};

export type Homepage = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_position: string;
  hero_subtitle: string;
  about_kicker: string;
  about_heading: string;
  about_subheading: string;
  about_body: string;
  about_photo_url: string;
  stat1_value: string; stat1_unit: string; stat1_label: string;
  stat2_value: string; stat2_unit: string; stat2_label: string;
  stat3_value: string; stat3_unit: string; stat3_label: string;
  stat4_value: string; stat4_unit: string; stat4_label: string;
  services_heading: string;
  services_lead: string;
  work_heading: string;
  work_lead: string;
  writing_heading: string;
  writing_lead: string;
  subscribe_heading: string;
  subscribe_body: string;
  hero_image_url: string;
  enquiry_eyebrow: string;
  enquiry_heading: string;
  enquiry_body: string;
  show_hero: boolean;
  show_about: boolean;
  show_services: boolean;
  show_clients: boolean;
  show_work: boolean;
  show_testimonials: boolean;
  show_writing: boolean;
  show_enquiry: boolean;
  show_subscribe: boolean;
};
