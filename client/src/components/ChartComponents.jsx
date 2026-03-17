import React from 'react';

// Simple CSS-based charts that don't rely on external charting libraries

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Professional Healthcare Color Palette
const HEALTHCARE_COLORS = {
  primary: '#0f766e',      // Medical teal
  secondary: '#06b6d4',     // Medical cyan
  accent: '#10b981',       // Medical green
  warning: '#f59e0b',       // Medical amber
  danger: '#ef4444',         // Medical red
  success: '#22c55e',       // Medical success green
  info: '#3b82f6',          // Medical blue
  muted: '#64748b',         // Medical gray
  background: '#f8fafc',     // Light background
  surface: '#ffffff',       // White surface
  text: '#1e293b',          // Dark text
  textMuted: '#64748b',      // Muted text
  border: '#e2e8f0',        // Border color
  grid: '#f1f5f9'           // Grid lines
};

// Simple Bar Chart Component
export const SimpleBarChart = ({ data = [], title, color = HEALTHCARE_COLORS.primary }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex-1 space-y-2 min-h-0">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-16 text-xs text-gray-600 text-right flex-shrink-0">{item.label}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden min-w-0">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color || HEALTHCARE_COLORS.primary
                }}
              >
                {/* Gradient overlay for depth */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`
                  }}
                />
              </div>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white drop-shadow-sm">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple Line Chart Component
export const SimpleLineChart = ({ data = [], title }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value1, d.value2)), 1);
  
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex-1 relative min-h-0">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((val) => (
            <div key={val} className="border-t border-gray-100 w-full" />
          ))}
        </div>
        
        {/* Chart lines */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Grid lines vertical */}
          {data.map((_, index) => {
            const x = (index / (data.length - 1)) * 100;
            return (
              <line
                key={`grid-${index}`}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="100%"
                stroke={HEALTHCARE_COLORS.grid}
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            );
          })}
          
          {/* Line 1 */}
          <polyline
            fill="none"
            stroke={HEALTHCARE_COLORS.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (item.value1 / maxValue) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Line 2 */}
          <polyline
            fill="none"
            stroke={HEALTHCARE_COLORS.accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (item.value2 / maxValue) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points for Line 1 */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value1 / maxValue) * 100;
            return (
              <circle
                key={`dot1-${index}`}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="white"
                stroke={HEALTHCARE_COLORS.primary}
                strokeWidth="2"
              />
            );
          })}
          
          {/* Data points for Line 2 */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value2 / maxValue) * 100;
            return (
              <circle
                key={`dot2-${index}`}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="white"
                stroke={HEALTHCARE_COLORS.accent}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Pie Chart Component
export const SimplePieChart = ({ data = [], title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Shadow circle */}
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="black"
              opacity="0.1"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              currentAngle += angle;
              
              const x1 = 50 + 30 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 30 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 30 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 30 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              return (
                <g key={index}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  {/* Highlight effect */}
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill="white"
                    opacity="0.1"
                  />
                </g>
              );
            })}
            
            {/* Center circle for donut effect */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="white"
            />
          </svg>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-2 space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 text-xs">{item.label}</span>
            </div>
            <span className="font-medium text-gray-900 text-xs">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Patient Overview Chart
export const PatientOverviewChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'Mon', value1: 45, value2: 32 },
    { label: 'Tue', value1: 52, value2: 38 },
    { label: 'Wed', value1: 48, value2: 41 },
    { label: 'Thu', value1: 58, value2: 45 },
    { label: 'Fri', value1: 62, value2: 48 },
    { label: 'Sat', value1: 41, value2: 28 },
    { label: 'Sun', value1: 38, value2: 25 }
  ];

  return (
    <div className="space-y-4">
      <SimpleLineChart data={chartData} title="Patient Trends" />
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full" />
          <span className="text-gray-600">Total Patients</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-gray-600">Appointments</span>
        </div>
      </div>
    </div>
  );
};

// Revenue Trend Chart
export const RevenueTrendChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'Jan', value: 45000 },
    { label: 'Feb', value: 52000 },
    { label: 'Mar', value: 48000 },
    { label: 'Apr', value: 61000 },
    { label: 'May', value: 55000 },
    { label: 'Jun', value: 67000 }
  ];

  return <SimpleBarChart data={chartData} title="Revenue Trend" color={HEALTHCARE_COLORS.success} />;
};

// Department Distribution Chart
export const DepartmentDistributionChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'Emergency', value: 35, color: HEALTHCARE_COLORS.danger },
    { label: 'OPD', value: 28, color: HEALTHCARE_COLORS.primary },
    { label: 'Inpatient', value: 22, color: HEALTHCARE_COLORS.accent },
    { label: 'Pharmacy', value: 10, color: HEALTHCARE_COLORS.warning },
    { label: 'Lab', value: 5, color: HEALTHCARE_COLORS.info }
  ];

  return <SimplePieChart data={chartData} title="Department Distribution" />;
};

// Appointment Status Chart
export const AppointmentStatusChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'Scheduled', value: 45, color: HEALTHCARE_COLORS.info },
    { label: 'Completed', value: 32, color: HEALTHCARE_COLORS.success },
    { label: 'Cancelled', value: 8, color: HEALTHCARE_COLORS.danger },
    { label: 'No-Show', value: 5, color: HEALTHCARE_COLORS.warning }
  ];

  return <SimpleBarChart data={chartData} title="Appointment Status" color={HEALTHCARE_COLORS.info} />;
};

// Bed Occupancy Chart
export const BedOccupancyChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { label: 'ICU', value: 80, color: HEALTHCARE_COLORS.danger },
    { label: 'General', value: 75, color: HEALTHCARE_COLORS.primary },
    { label: 'Maternity', value: 80, color: HEALTHCARE_COLORS.accent },
    { label: 'Pediatric', value: 72, color: HEALTHCARE_COLORS.info },
    { label: 'Emergency', value: 75, color: HEALTHCARE_COLORS.warning }
  ];

  return <SimpleBarChart data={chartData} title="Bed Occupancy %" color={HEALTHCARE_COLORS.danger} />;
};
