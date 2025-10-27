import './RequestQuoteSection.css';
// Using a relative path to fix the import error
import { Button } from '@/components/common/button/Button';

export const RequestQuoteSection = () => {
  return (
    <section className="request-quote-section">
      {/* The background image and dark overlay are handled by the CSS */}
      <div className="request-quote-content">
        <h2 className="request-quote-title">
          Providing Personalized and High Quality Services
        </h2>
        <p className="request-quote-description">
          We can manage your dream building A small river named Duden flows by
          their place
        </p>
        <Button variant="primary" to="/contact">
          REQUEST A QUOTE
        </Button>
      </div>
    </section>
  );
};

