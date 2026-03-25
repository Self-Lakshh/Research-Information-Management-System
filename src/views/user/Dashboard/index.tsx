import { useAuth } from '@/auth';
import { useUserStats, useAllUserRecords, useCreateRecord } from '@/hooks/useRecords';
import { StatCard, RecordDetailModal } from '@/components/custom';
import { FileText, Award, BookOpen, Briefcase, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config';
import { RecordCard } from '@/components/custom';
import { RecordType } from '@/@types/rims.types';
import { Spinner } from '@/components/shadcn/ui/spinner';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { stats, isLoading: statsLoading } = useUserStats();
    const { data: records = [], isLoading: recordsLoading } = useAllUserRecords();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    const handleView = (record: any) => {
        setSelected(record);
        setIsDetailOpen(true);
    };

    const handleEdit = (record: any) => {
        // Navigate to submissions page with the record to edit
        navigate('/submissions', { state: { editRecord: record } });
    };

    const roseVariant = Award; // Just a helper for Award icon mapping

    return (
        <div className="flex flex-col h-full p-1 overflow-hidden">
            {/* Metrics Grid */}
            <div className="flex flex-col bg-card shadow-sm rounded-md border border-emerald-200 overflow-hidden shrink-0 mb-4">
                <div className="bg-emerald-600 flex items-center border-b py-1.5 px-4 shrink-0">
                    <h2 className="text-lg text-white font-bold tracking-tight">
                        My Research Insights
                    </h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-3 transition-all">
                    <StatCard label="IPR Publication" value={stats?.iprCount || 0} icon={Lightbulb} variant="amber" isLoading={statsLoading} className="h-28 sm:h-32" />
                    <StatCard label="Journal Publication" value={stats?.journalCount || 0} icon={FileText} variant="primary" isLoading={statsLoading} className="h-28 sm:h-32" />
                    <StatCard label="Conference Publication" value={stats?.conferenceCount || 0} icon={Users} variant="indigo" isLoading={statsLoading} className="h-28 sm:h-32" />
                    <StatCard label="Book/Chapter Publication" value={stats?.bookCount || 0} icon={BookOpen} variant="emerald" isLoading={statsLoading} className="h-28 sm:h-32" />
                    <StatCard label="Award & Recognition" value={stats?.awardCount || 0} icon={roseVariant} variant="rose" isLoading={statsLoading} className="h-28 sm:h-32" />
                </div>
            </div>

            <div className="flex flex-col bg-card shadow-sm rounded-md border-emerald-200 border overflow-hidden flex-1 min-h-0 min-w-0">
                <div className="flex items-center bg-emerald-600 border-b py-1.5 px-4 shrink-0">
                    <h2 className="text-lg text-white font-bold tracking-tight">
                        My Recent Requests
                    </h2>
                </div>
                <div className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory flex gap-5 p-5 show-scrollbar flex-1 items-stretch">
                    {recordsLoading ? (
                        <div className="flex h-56 w-full items-center justify-center">
                            <Spinner />
                        </div>
                    ) : records.filter((r) => r.approval_status === "pending").length > 0 ? (
                        records
                            .filter((r) => r.approval_status === "pending")
                            .map((record) => (
                                <RecordCard
                                    key={record.id}
                                    onView={handleView}
                                    record={record}
                                    className="snap-start snap-always w-[280px] shrink-0"
                                />
                            ))
                    ) : (
                        <div className="flex h-56 w-full items-center justify-center">
                            <p className="text-center text-muted-foreground font-semibold">
                                No pending requests found.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <RecordDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelected(null);
                }}
                record={selected}
                onEdit={handleEdit}
            />
        </div>
    );
};

export default Dashboard;
