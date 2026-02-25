export interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "internship";
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I apply for a position?",
    answer:
      "Browse our open positions, find a role that matches your skills, and click 'Apply Now'. You'll need to create an account and fill out the application form with your details and resume.",
    category: "general",
  },
  {
    question: "What is the interview process like?",
    answer:
      "Our interview process typically includes an initial screening call, a technical assessment or portfolio review, team interviews, and a final conversation with leadership. The entire process usually takes 2-3 weeks.",
    category: "general",
  },
  {
    question: "Can I apply for multiple positions?",
    answer:
      "Yes! You can apply for as many positions as you'd like. We encourage you to apply for roles that genuinely match your skills and interests.",
    category: "general",
  },
  {
    question: "Do you offer remote positions?",
    answer:
      "Yes, many of our positions are remote-friendly. Check the location field on each job listing for details. We support hybrid and fully remote work arrangements.",
    category: "general",
  },
  {
    question: "What is the internship duration?",
    answer:
      "Our internships typically last 3-6 months. We offer both summer and year-round internship programs. Duration may be flexible based on mutual agreement.",
    category: "internship",
  },
  {
    question: "Are internships paid?",
    answer:
      "Yes, all our internships are paid. We believe in fairly compensating our interns for their contributions. Stipend details are shared during the offer stage.",
    category: "internship",
  },
  {
    question: "What skills do I need for an internship?",
    answer:
      "We look for passion, willingness to learn, and foundational knowledge in your area of interest. Specific technical requirements vary by role and are listed in each job description.",
    category: "internship",
  },
  {
    question: "Will I get a certificate after completing the internship?",
    answer:
      "Yes, all interns receive an official certificate of completion. Outstanding performers may also receive a letter of recommendation and a full-time offer.",
    category: "internship",
  },
  {
    question: "Can I convert my internship into a full-time role?",
    answer:
      "Absolutely! Many of our full-time employees started as interns. We actively evaluate interns for full-time conversion based on performance and team fit.",
    category: "internship",
  },
  {
    question: "What kind of projects will I work on as an intern?",
    answer:
      "Interns work on real, impactful projects — not busy work. You'll be embedded in a team, assigned a mentor, and contribute to production-level features and products.",
    category: "internship",
  },
];
