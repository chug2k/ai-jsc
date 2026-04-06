import Link from "next/link";
import styles from "./learn.module.css";

/* ─── JSON-LD: Article ───────────────────────────────────────── */

export function ArticleJsonLd({
  headline,
  description,
}: {
  headline: string;
  description: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: {
      "@type": "Organization",
      name: "jobsearch.quest",
    },
    publisher: {
      "@type": "Organization",
      name: "jobsearch.quest",
      url: "https://jobsearch.quest",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── JSON-LD: Breadcrumb ────────────────────────────────────── */

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const allItems = [
    { name: "Home", href: "https://jobsearch.quest" },
    { name: "Guides", href: "https://jobsearch.quest/learn" },
    ...items,
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── JSON-LD: FAQ ───────────────────────────────────────────── */

export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Table of Contents ──────────────────────────────────────── */

export function TableOfContents({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <nav
      style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 6,
        padding: 20,
        marginBottom: 40,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-pt-mono), monospace",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#9CA3AF",
          margin: "0 0 12px",
        }}
      >
        In this guide
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              fontSize: 14,
              color: "#6B7280",
              textDecoration: "none",
              fontFamily: "var(--font-roboto), sans-serif",
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── FAQ Section ────────────────────────────────────────────── */

export function FaqSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section>
      <h2>Frequently Asked Questions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {faqs.map((faq, i) => (
          <div key={i}>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
              {faq.question}
            </p>
            <p
              style={{
                fontSize: 15,
                color: "var(--text-secondary, #6B7280)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Related Guides ─────────────────────────────────────────── */

export function RelatedGuides({
  guides,
}: {
  guides: { href: string; title: string; description: string }[];
}) {
  return (
    <section>
      <h2>Related Guides</h2>
      <div className={styles.grid}>
        {guides.map((guide) => (
          <Link key={guide.href} href={guide.href} className={styles.card}>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
