// Color-coded progress bar with animation
import { motion } from 'framer-motion';
import { getBudgetColor } from '../../utils/helpers';

export default function ProgressBar({ value = 0, max = 100, showLabel = true, size = 'md' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = getBudgetColor(percentage);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="space-y-1">
      <div className={`progress-track ${heights[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`progress-fill ${colors.bg}`}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className={`font-medium ${colors.text}`}>
            {percentage.toFixed(0)}%
          </span>
          <span className="text-surface-400">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
