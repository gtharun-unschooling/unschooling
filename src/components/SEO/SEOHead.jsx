import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = "Unschooling React - Personalized Learning Platform",
  description = "AI-powered personalized learning plans for children. Discover our Nurture, Grow, and Thrive plans designed for different age groups.",
  keywords = "unschooling, personalized learning, children education, AI learning, educational platform, learning plans",
  image = "/images/unschooling-og-image.jpg",
  url = "https://unschooling.in",
  type = "website",
  author = "Unschooling React"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Unschooling React" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@unschooling" />
      <meta name="twitter:creator" content="@unschooling" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Unschooling" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Unschooling React",
          "description": description,
          "url": url,
          "logo": image,
          "sameAs": [
            "https://twitter.com/unschooling",
            "https://facebook.com/unschooling",
            "https://linkedin.com/company/unschooling"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXX-XXXX",
            "contactType": "customer service",
            "email": "support@unschooling.in"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          },
          "offers": [
            {
              "@type": "Offer",
              "name": "Nurture Plan",
              "description": "Ages 0–3 (Parent-Guided)",
              "price": "499",
              "priceCurrency": "INR",
              "priceSpecification": {
                "@type": "RecurringPaymentsPriceSpecification",
                "billingDuration": "P1M"
              }
            },
            {
              "@type": "Offer",
              "name": "Grow Plan",
              "description": "Ages 3–6 (Light Autonomy)",
              "price": "799",
              "priceCurrency": "INR",
              "priceSpecification": {
                "@type": "RecurringPaymentsPriceSpecification",
                "billingDuration": "P1M"
              }
            },
            {
              "@type": "Offer",
              "name": "Thrive Plan",
              "description": "Ages 6–10+ (Independent)",
              "price": "999",
              "priceCurrency": "INR",
              "priceSpecification": {
                "@type": "RecurringPaymentsPriceSpecification",
                "billingDuration": "P1M"
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
