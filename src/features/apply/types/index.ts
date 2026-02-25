export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  resume: File | null;
  experience: string;
  whyInterested: string;
  earliestJoiningDate: string;
  whyRoleFits: string;
  whyUs: string;
  linkedinUrl: string;
  githubUrl: string;
  otherSocialLinks: string;
  heardFrom: string;
  openToPaid: string;
}

export const HEARD_FROM_OPTIONS = [
  "LinkedIn",
  "GitHub",
  "Twitter / X",
  "Job Board",
  "College / University",
  "Friend / Referral",
  "Company Website",
  "Other",
] as const;

export const INITIAL_FORM_DATA: ApplicationFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  resume: null,
  experience: "",
  whyInterested: "",
  earliestJoiningDate: "",
  whyRoleFits: "",
  whyUs: "",
  linkedinUrl: "",
  githubUrl: "",
  otherSocialLinks: "",
  heardFrom: "",
  openToPaid: "",
};
