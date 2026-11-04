import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.other';
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'استودیو خلاق هورام | تبلیغات و فیلم‌های تبلیغاتی هوش مصنوعی';
const DEFAULT_DESCRIPTION = 'استودیو تبلیغاتی هورام؛ خلق فیلم‌ها و تیزرهای تبلیغاتی سینمایی با هوش مصنوعی، طراحی و توسعه وب‌سایت‌های مدرن و کمپین‌های ۳۶۰ درجه برای برندهای پیشرو در ایران.';
const DEFAULT_IMAGE = '/images/og-cover.jpg';
const SITE_NAME = 'استودیو تبلیغاتی هورام (Hooram Studio)';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    'استودیو تبلیغاتی',
    'تیزر تبلیغاتی هوش مصنوعی',
    'تولید تیزر تجاری',
    'تبلیغات سینمایی',
    'طراحی وب سایت شرکتی',
    'کمپین تبلیغاتی',
    'استودیو هورام',
    'هوش مصنوعی در تبلیغات',
    'AI Advertising Studio'
  ],
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema,
}) => {
  useEffect(() => {
    // 1. Title
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords.join(', '));
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('name', 'author', 'استودیو تبلیغاتی هورام');

    // 3. Canonical URL
    const currentUrl = canonicalUrl || window.location.href;
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = currentUrl;

    // 4. Open Graph Meta Tags (for Facebook, Telegram, WhatsApp, LinkedIn, Eitaa, Bale)
    const absoluteImage = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'fa_IR');
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:image', absoluteImage);
    setMeta('property', 'og:image:alt', fullTitle);

    // 5. Twitter Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', absoluteImage);

    // 6. JSON-LD Structured Data Schema
    const scriptId = 'hooram-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    // Default Organization & LocalBusiness schema
    const baseOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${window.location.origin}/#organization`,
      name: 'استودیو خلاق هورام',
      alternateName: 'Hooram Studio - AI Creative & Advertising Studio',
      url: window.location.origin,
      logo: `${window.location.origin}/images/logo.png`,
      description: DEFAULT_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'تهران',
        addressCountry: 'IR'
      },
      priceRange: '$$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
          opens: '09:00',
          closes: '18:00'
        }
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'خدمات استودیو هورام',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'تولید تیزر و فیلم‌های تبلیغاتی هوش مصنوعی',
              description: 'خلق تیزرهای تجاری و تبلیغات سینمایی با بالاترین استانداردهای بصری و هوش مصنوعی'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'طراحی و توسعه وب‌سایت‌های مدرن',
              description: 'طراحی وب‌سایت‌های شرکتی، لندینگ پیج و پلتفرم‌های کسب‌وکار مدرن با React و Next'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'کمپین‌ها و تبلیغات خلاق ۳۶۰ درجه',
              description: 'ایده‌پردازی استراتژیک کمپین، تصویرسازی‌های تبلیغاتی اختصاصی و سناریونویسی'
            }
          }
        ]
      }
    };

    let finalSchemaPayload: any = baseOrganizationSchema;

    if (schema) {
      if (Array.isArray(schema)) {
        finalSchemaPayload = [baseOrganizationSchema, ...schema];
      } else {
        finalSchemaPayload = [baseOrganizationSchema, schema];
      }
    }

    scriptTag.textContent = JSON.stringify(finalSchemaPayload);

    return () => {
      // Optional cleanup if needed
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schema]);

  return null;
};

