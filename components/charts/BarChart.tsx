import React from 'react';

interface BarChartProps {
    data: {
        labels: string[];
        values: number[];
    };
    colors?: string[];
}

const defaultColors = ['#14b8a6', '#60a5fa', '#f472b6', '#facc15', '#fb923c', '#ef4444', '#8b5cf6'];

export const BarChart: React.FC<BarChartProps> = ({ data, colors = defaultColors }) => {
    const maxValue = Math.max(...data.values, 1); // Avoid division by zero

    return (
        <div className="w-full h-64 flex flex-col space-y-2">
            <div className="flex-grow w-full grid gap-4" style={{ gridTemplateColumns: `repeat(${data.labels.length}, minmax(0, 1fr))`}}>
                {data.values.map((value, index) => (
                    <div key={index} className="flex flex-col-reverse items-center">
                        <div 
                            className="w-full rounded-t-md transition-all duration-500 ease-out"
                            style={{ 
                                height: `${(value / maxValue) * 100}%`,
                                backgroundColor: colors[index % colors.length],
                            }}
                            title={`${data.labels[index]}: ${value}`}
                        >
                            <span className="text-white text-xs font-bold absolute bottom-0 left-0 right-0 p-1 text-center opacity-0 hover:opacity-100">
                                {value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full grid gap-4 text-xs text-center text-gray-600" style={{ gridTemplateColumns: `repeat(${data.labels.length}, minmax(0, 1fr))`}}>
                {data.labels.map((label, index) => (
                    <div key={index} className="truncate" title={label}>{label}</div>
                ))}
            </div>
        </div>
    );
};