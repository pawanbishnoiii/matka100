
import { motion } from 'framer-motion';
import { Shield, Award, Users, CheckCircle, Star, Globe } from 'lucide-react';

interface PaymentMethod {
  name: string;
  logo: string;
  color: string;
}

interface TrustIndicatorsProps {
  paymentMethods: PaymentMethod[];
}

export const TrustIndicators = ({ paymentMethods }: TrustIndicatorsProps) => {
  const trustBadges = [
    { icon: Shield, text: 'SSL Secured', color: 'text-green-400' },
    { icon: Award, text: 'RNG Certified', color: 'text-blue-400' },
    { icon: Users, text: '15K+ Players', color: 'text-purple-400' },
    { icon: CheckCircle, text: 'Verified Payouts', color: 'text-yellow-400' },
    { icon: Star, text: '4.9★ Rating', color: 'text-orange-400' },
    { icon: Globe, text: 'Global Standard', color: 'text-cyan-400' }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      text: "Won ₹25,000 yesterday! Instant UPI withdrawal worked perfectly.",
      amount: "₹25,000"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Best Matka platform! Clean interface and quick payouts.",
      amount: "₹18,500"
    },
    {
      name: "Amit Singh",
      location: "Pune",
      rating: 5,
      text: "Playing for 2 years. Never faced any issues with withdrawals.",
      amount: "₹42,000"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-black/50 to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">
            Trusted by 15,000+ Players
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 rounded-lg text-center hover-lift"
              >
                <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.color}`} />
                <p className="text-sm font-medium text-white">{badge.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-white">
            Secure Payment Methods
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${method.color} px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 hover:scale-105 transition-transform`}
              >
                <span className="text-xl">{method.logo}</span>
                {method.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Player Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-white">
            What Our Winners Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-card-premium p-6 rounded-lg hover-lift"
              >
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-gray-700 pt-4">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                  <p className="text-lg font-bold text-green-400 mt-2">
                    Won {testimonial.amount}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
