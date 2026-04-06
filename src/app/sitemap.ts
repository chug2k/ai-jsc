import { MetadataRoute } from "next";

const BASE_URL = "https://jobsearch.quest";

const learnArticles = [
  "what-is-a-job-search-council",
  "never-search-alone-methodology",
  "job-search-accountability",
  "ai-job-search-tools",
  "job-search-burnout",
  "career-pivot-guide",
  "interview-preparation-guide",
  "networking-for-job-seekers",
  "job-offer-negotiation",
  "candidate-market-fit",
  "remote-job-search",
  "job-search-after-layoff",
  "how-to-write-a-two-pager",
  "job-search-for-senior-professionals",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articles: MetadataRoute.Sitemap = learnArticles.map((slug) => ({
    url: `${BASE_URL}/learn/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/learn`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles,
  ];
}
