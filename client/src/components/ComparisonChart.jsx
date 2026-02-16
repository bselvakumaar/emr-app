export default function ComparisonChart({ title, data, dataKey, color, todayValue, formatValue = (v) => v }) {
    if (!data || data.length === 0) {
        return (
            <div className="panel" style={{ padding: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', color: '#475569' }}>{title}</h4>
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No data available</p>
            </div>
        );
    }

    // Calculate statistics
    const values = data.map(d => d[dataKey]);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const currentMonth = data[data.length - 1];
    const previousMonth = data.length > 1 ? data[data.length - 2] : null;

    const monthChange = previousMonth
        ? ((currentMonth[dataKey] - previousMonth[dataKey]) / previousMonth[dataKey] * 100).toFixed(1)
        : 0;

    // Chart dimensions
    const chartHeight = 200;
    const chartWidth = 100; // percentage
    const barWidth = 100 / data.length - 2; // percentage with gap

    return (
        <div className="panel" style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '600', color: '#475569' }}>
                    {title}
                </h4>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Today</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: color }}>
                            {formatValue(todayValue)}
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>This Month</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                            {formatValue(currentMonth[dataKey])}
                        </span>
                        {monthChange !== 0 && (
                            <span style={{
                                fontSize: '0.75rem',
                                color: monthChange > 0 ? '#16a34a' : '#dc2626',
                                marginLeft: '0.5rem'
                            }}>
                                {monthChange > 0 ? '↑' : '↓'} {Math.abs(monthChange)}%
                            </span>
                        )}
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#64748b' }}>
                            {formatValue(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ position: 'relative', height: `${chartHeight}px`, marginBottom: '1rem' }}>
                <svg width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((percent) => (
                        <g key={percent}>
                            <line
                                x1="0"
                                y1={chartHeight - (chartHeight * percent / 100)}
                                x2="100%"
                                y2={chartHeight - (chartHeight * percent / 100)}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                            <text
                                x="0"
                                y={chartHeight - (chartHeight * percent / 100) - 5}
                                fontSize="10"
                                fill="#94a3b8"
                            >
                                {formatValue(max * percent / 100)}
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {data.map((item, index) => {
                        const barHeight = (item[dataKey] / max) * chartHeight;
                        const x = (index * (100 / data.length)) + '%';
                        const isCurrentMonth = index === data.length - 1;

                        return (
                            <g key={index}>
                                <rect
                                    x={x}
                                    y={chartHeight - barHeight}
                                    width={`${barWidth}%`}
                                    height={barHeight}
                                    fill={isCurrentMonth ? color : `${color}80`}
                                    rx="4"
                                />
                                <text
                                    x={`calc(${x} + ${barWidth / 2}%)`}
                                    y={chartHeight + 15}
                                    fontSize="10"
                                    fill="#64748b"
                                    textAnchor="middle"
                                >
                                    {item.month.split('-')[1]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: color }}></div>
                    <span>Current Month</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: `${color}80` }}></div>
                    <span>Previous Months</span>
                </div>
            </div>
        </div>
    );
}
