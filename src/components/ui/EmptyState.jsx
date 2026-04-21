// Beautiful empty state illustrations with call to action
import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-3xl text-primary-500 mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">
        {title}
      </h3>
      <p className="text-surface-500 text-sm max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <button onClick={onAction} className="btn-primary text-sm px-5 py-2.5">
          {action}
        </button>
      )}
    </motion.div>
  );
}
