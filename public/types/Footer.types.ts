export type FooterLink = {
  text: string;
  url: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterData = {
  id?: string;
  columns?: FooterColumn[];
  copyright?: string;
  bottomText?: string;
  bottomLinks?: FooterLink[];
};
