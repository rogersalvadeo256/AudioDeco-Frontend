import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';

interface DashboardStats {
    totalBooks: number;
    totalMinutesListened: number;
    minutesRemaining: number;
    notStarted: number;
}

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

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="text-center p-10">Loading Dashboard...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Total Books" value={stats.totalBooks} icon={() => null} />
            <StatCard title="Listened (Mins)" value={stats.totalMinutesListened} icon={() => null} />
            <StatCard title="Remaining (Mins)" value={stats.minutesRemaining} icon={() => null} />
            <StatCard title="Not Started" value={stats.notStarted} icon={() => null} />
        </div>
    );
};

export default Dashboard;