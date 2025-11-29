import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { BookIcon, BookOpenIcon, BookXIcon, Library, LibraryBig } from 'lucide-react';

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
    

    <div className="h-full flex flex-col justify-between py-4 px-6 relative group cursor-pointer bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full h-1 border-t border-b border-gray-800 group-hover:border-red-900 transition-colors"></div>
      
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="p-2 border border-gray-800 rotate-45 group-hover:border-red-800 transition-colors">
            <Icon className="w-6 h-6 text-gray-300 -rotate-45" />
        </div>
        <div className="text-center">
            <span className="block font-serif text-4xl text-white leading-none">{value}</span>
        </div>
      </div>
      <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-700 font-sans">{title}</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 border-t border-b border-gray-800 group-hover:border-red-900 transition-colors"></div>
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
            <StatCard title="Total Books" value={stats.totalBooks} icon={LibraryBig} />
            <StatCard title={timeListened} value={getTotalTTime(stats.totalMinutesListened).amount} icon={BookOpenIcon} />
            <StatCard title={timeRemaining} value={getTotalTTime(stats.minutesRemaining).amount} icon={BookXIcon} />
            <StatCard title="Not Started" value={stats.notStarted} icon={BookIcon} />
        </div>
    );
};

export default Dashboard;