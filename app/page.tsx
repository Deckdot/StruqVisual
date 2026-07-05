import HomeClient from '@/components/site/home/home-client';
import { SITE_FAQ_ITEMS } from '@/components/site/home/faq-items';
import {
  JsonLd,
  generateFAQSchema,
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schemas';

export default function HomePage() {
  return (
    <>
      <JsonLd
        id="homepage-schema"
        schema={[
          generateOrganizationSchema(),
          generateWebsiteSchema(),
          generateSoftwareApplicationSchema(),
          generateFAQSchema(
            SITE_FAQ_ITEMS.map((faq) => ({
              question: faq.q,
              answer: faq.a,
            }))
          ),
        ]}
      />
      <HomeClient />
    </>
  );
}
