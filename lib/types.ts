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
  deleted_at: string | null;
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
  og_image: string;
  deleted_at: string | null;
};

export type PageSeo = {
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  link: string;
  cta_label: string;
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

export type PostCategory = {
  id: string;
  name: string;
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
  site_url: string;
  default_og_image: string;
  twitter_handle: string;
  ga_measurement_id: string;
  cookie_enabled: boolean;
  cookie_title: string;
  cookie_message: string;
  lead_notify_email: string;
  booking_url: string;
  contact_email: string;
  ack_email_subject: string;
  ack_email_heading: string;
  ack_email_body: string;
  ack_email_signoff: string;
  ack_service_fallback: string;
  linkedin_url: string;
};

export type LegalPage = {
  slug: string;
  title: string;
  content: string;
  published: boolean;
  sort_order: number;
  updated_at: string;
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
  image_url: string;
  sort_order: number;
};

// ---------- SERVICE PAGES (scroll-story offer pages) ----------
export type PanelLine = { text: string; strong?: boolean };
export type PanelRow = { name: string; desc: string; hot?: boolean };
export type PanelCols = { built: string[]; notFor: string[] };
export type StoryPanel = {
  pose: number;
  cap?: string;
  variant?: "head" | "open" | "mid";
  tag?: string;
  head?: string;
  sub?: string;
  lines?: PanelLine[];
  rows?: PanelRow[];
  cols?: PanelCols;
};
export type ServiceStep = { phase: string; lead?: string; desc: string };
export type ServiceCard = { tag: string; heading: string; href: string };
export type ServiceStat = { value: string; unit?: string; label: string };
export type ServiceFaq = { q: string; a: string };
export type ServiceFlowNode = { stat: string; title: string; desc: string; lit?: boolean };
export type ServiceFlow = {
  tag: string;
  head: string;
  sub: string;
  capLeft: string;
  capRight: string;
  foot: string;
  nodes: ServiceFlowNode[];
};

export type ServicePage = {
  slug: string;
  title: string;
  published: boolean;
  sort_order: number;
  nav_back_label: string;
  nav_back_href: string;
  panels: StoryPanel[];
  form_tag: string;
  form_head: string;
  form_context_label: string;
  form_context_hint: string;
  form_context_placeholder: string;
  form_note: string;
  form_ack_heading: string;
  form_ack_body: string;
  how_tag: string;
  how_head: string;
  steps: ServiceStep[];
  hub_tag: string;
  hub_head: string;
  cards: ServiceCard[];
  proof_line: string;
  stats: ServiceStat[];
  cred_label: string;
  flow: ServiceFlow | null;
  umbrella_html: string;
  menu_label: string;
  menu_blurb: string;
  is_umbrella: boolean;
  credibility_preline: string;
  plain_tag: string;
  plain_head: string;
  plain_body: string;
  show_testimonials: boolean;
  testimonials_tag: string;
  testimonials_head: string;
  faq_tag: string;
  faq_head: string;
  faqs: ServiceFaq[];
  cta_tag: string;
  cta_head: string;
  cta_sub: string;
  cta_button: string;
};

export type Homepage = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_position: string;
  hero_subtitle: string;
  hero_cta1_label: string;
  hero_cta1_href: string;
  hero_cta2_label: string;
  hero_cta2_href: string;
  about_kicker: string;
  about_heading: string;
  about_subheading: string;
  about_body: string;
  about_employers: string;
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
  ack_eyebrow: string;
  ack_heading: string;
  ack_body: string;
  ack_echo_label: string;
  ack_cta_label: string;
  ack_cta_href: string;
  ack_contact_email: string;
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
