import { useLocation } from 'wouter';
import { SEOHead } from './SEOHead';
import { pageSEO } from '@/data/seo.generated';

/**
 * Utility routes that are not in the SEO sheet and must stay out of the index:
 * transactional funnels, the admin area and the 404.
 */
const NOINDEX_ROUTES: Record<string, { title: string; description: string }> = {
  '/cart': {
    title: 'Your Enquiry Cart | VIVIDPOLY',
    description: 'Review the PP bag products you have shortlisted before sending your export enquiry to VIVIDPOLY.',
  },
  '/checkout': {
    title: 'Checkout | VIVIDPOLY',
    description: 'Complete your PP bag enquiry with VIVIDPOLY.',
  },
  '/account': {
    title: 'Your Account | VIVIDPOLY',
    description: 'Manage your VIVIDPOLY account details and enquiry history.',
  },
  '/order-history': {
    title: 'Order History | VIVIDPOLY',
    description: 'View your previous VIVIDPOLY orders and enquiries.',
  },
  '/thank-you': {
    title: 'Thank You | VIVIDPOLY',
    description: 'Thank you for contacting VIVIDPOLY. Our export team will get back to you within 24 hours.',
  },
  '/admin': { title: 'Admin | VIVIDPOLY', description: 'VIVIDPOLY admin area.' },
  '/admin/inquiries': { title: 'Admin Inquiries | VIVIDPOLY', description: 'VIVIDPOLY admin area.' },
};

const NOT_FOUND = {
  title: 'Page Not Found | VIVIDPOLY',
  description: 'The page you are looking for could not be found on vividpoly.com.',
};

/**
 * Routes whose SEO is data-dependent and therefore set by the page itself once
 * its content loads. RouteSEO stays out of the way for these.
 */
const SELF_MANAGED_PREFIXES = ['/blog/'];

/**
 * Applies the SEO sheet's title, description, canonical and JSON-LD for
 * whichever route is mounted.
 *
 * Mounted once in App so all 47 sheet pages are covered without touching each
 * page component. Routes the sheet does not cover — blog posts, above all —
 * fall through to the SEOHead that page renders itself.
 */
export default function RouteSEO() {
  const [location] = useLocation();
  const path = location.length > 1 ? location.replace(/\/$/, '') : '/';

  const page = pageSEO[path];
  if (page) {
    return (
      <SEOHead
        title={page.title}
        description={page.description}
        canonicalPath={path}
        schema={page.schema}
      />
    );
  }

  if (SELF_MANAGED_PREFIXES.some((prefix) => path.startsWith(prefix))) return null;

  // Anything left is either a utility route or an unmatched URL rendering
  // NotFound — both must be noindex, and neither may inherit the previous
  // route's title.
  // Self-referencing canonical rather than inheriting the previous route's.
  const utility = NOINDEX_ROUTES[path] ?? NOT_FOUND;
  return (
    <SEOHead
      title={utility.title}
      description={utility.description}
      canonicalPath={path}
      noindex
    />
  );
}
