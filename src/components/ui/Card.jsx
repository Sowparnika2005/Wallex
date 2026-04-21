// Premium Card component with glass/solid variants
import { motion } from 'framer-motion';

export default function Card({
  children, className = '', glass = false, hover = true, delay = 0, ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`${glass ? 'glass-card' : 'premium-card'} ${hover ? '' : '!shadow-card hover:!shadow-card hover:!translate-y-0'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
