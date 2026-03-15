import { 
  Users, 
  Building2, 
  Terminal, 
  Calendar, 
  Activity, 
  Users2, 
  Pill, 
  FlaskConical, 
  Package, 
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const iconMap = {
  patients: Users,
  tenants: Building2,
  employees: Users2,
  appointments: Calendar,
  pharmacy: Pill,
  lab: FlaskConical,
  inventory: Package,
  billing: Activity,
  insurance: ShieldCheck,
  default: Terminal
};

const bgColors = {
  blue: 'bg-medical-blue/10 text-medical-blue border-medical-blue/20',
  green: 'bg-success/10 text-success border-success/20',
  amber: 'bg-warning/10 text-warning border-warning/20',
  red: 'bg-error/10 text-error border-error/20',
  info: 'bg-medical-blue/10 text-medical-blue border-medical-blue/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  teal: 'bg-[var(--primary-soft)] text-[var(--primary)] border-[var(--primary)]/20',
  emerald: 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20',
};

export default function MetricCard({ label, value, accent = 'blue', icon, change, trend }) {
  const Icon = typeof icon === 'string' ? (iconMap[icon] || iconMap.default) : icon;
  const isDirectionalTrend = trend === 'up' || trend === 'down' || trend === 'neutral';
  
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-clinical-muted';
  };

  return (
    <div className="metric-card-pro bg-white rounded-panel shadow-clinical border border-clinical-border p-6 hover:shadow-pro transition-all duration-300">
      {/* Header with icon and change indicator */}
      <div className="flex justify-center items-center mb-6 relative min-h-[52px]">
        <div className={`p-3 rounded-xl ${bgColors[accent] || bgColors.blue} border`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {change && (
          <div className={`absolute right-0 top-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${bgColors[accent] || bgColors.blue}`}>
            {getTrendIcon()}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      {/* Value and label */}
      <div className="space-y-2 text-center">
        <div className="metric-value-pro text-3xl font-bold text-clinical-text tracking-tight">
          {value}
        </div>
        <div className="metric-label-pro text-xs font-semibold text-clinical-muted uppercase tracking-wider">
          {label}
        </div>
      </div>

      {/* Optional trend indicator */}
      {trend && (
        isDirectionalTrend ? (
          <div className={`mt-4 flex items-center justify-center gap-1.5 text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>vs last period</span>
          </div>
        ) : (
          <div className="mt-4 text-center text-xs font-medium text-clinical-muted">
            {trend}
          </div>
        )
      )}
    </div>
  );
}
