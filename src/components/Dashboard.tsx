import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';

const HOUR = 60;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;


interface DashboardStats {
    totalBooks: number;
    totalMinutesListened: number;
    minutesRemaining: number;
    notStarted: number;
}

interface TimeResult {
    amount: number;
    type: "min" | "hrs" | "day" | "wks" | "mts" | "yrs";
};

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <div className="border-2 border-deco-gold dark:border-deco-red p-6
        bg-deco-light-surface dark:bg-deco-dark-surface
        shadow-[8px_8px_0px_0px_rgba(212,175,55,0.5)] dark:shadow-[8px_8px_0px_0px_rgba(139,0,0,0.5)]">
        <div className="text-deco-purple dark:text-deco-silver text-lg font-bold uppercase tracking-wide mb-2">
            {title}
        </div>
        <div className="text-4xl font-deco text-deco-gold dark:text-deco-red">
            {value}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const getTotalTTime = (minutes: number): TimeResult => {
        switch (true) {
            case minutes >= YEAR:
                return { amount: +(minutes / YEAR).toFixed(1), type: "yrs" };
            case minutes >= 2 * MONTH:
                return { amount: +(minutes / MONTH).toFixed(1), type: "mts" };
            case minutes >= 14 * DAY:
                return { amount: +(minutes / WEEK).toFixed(1), type: "wks" };
            case minutes >= 2 * DAY:
                return { amount: +(minutes / DAY).toFixed(1), type: "day" };
            case minutes >= 24 * HOUR:
                return { amount: +(minutes / HOUR).toFixed(1), type: "hrs" };
            default:
                return { amount: minutes, type: "min" };
        }
    };

    const formatString = (type: string): string => {
        switch (type) {
            case "min": return "Minute(s)";
            case "hrs": return "Hour(s)";
            case "day": return "Day(s)";
            case "wks": return "Week(s)";
            case "mts": return "Month(s)";
            case "yrs": return "Year(s)";
            default: return "";
        }
    };

    let timeListened = `Listened (${formatString(getTotalTTime(stats ? stats.totalMinutesListened : 0).type)})`;
    let timeRemaining = `Remaining (${formatString(getTotalTTime(stats ? stats.minutesRemaining : 0).type)})`;

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="text-center p-10">Loading Dashboard...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Total Books" value={stats.totalBooks} icon={() => null} />
            <StatCard title={timeListened} value={getTotalTTime(stats.totalMinutesListened).amount} icon={() => null} />
            <StatCard title={timeRemaining} value={getTotalTTime(stats.minutesRemaining).amount} icon={() => null} />
            <StatCard title="Not Started" value={stats.notStarted} icon={() => null} />
        </div>
    );
};

export default Dashboard;