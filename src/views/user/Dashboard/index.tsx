import { useAuth } from '@/auth';
import { useUserStats, useApprovedRecords, useCreateRecord } from '@/hooks/useRecords';
import { StatCard } from '@/components/custom';
import { FileText, Award, BookOpen, Briefcase, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';
import { RECORD_TYPE_CONFIG } from '@/configs/rims.config';
import { RecordCard } from '@/components/custom';
import { RecordType } from '@/@types/rims.types';
import { Spinner } from '@/components/shadcn/ui/spinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const { stats, isLoading: statsLoading } = useUserStats();
    const { data: records = [], isLoading: recordsLoading } = useApprovedRecords();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [addType, setAddType] = useState<string>('journal');

    const createMutation = useCreateRecord();

    const handleFormSubmit = async (data: any) => {
        try {
            await createMutation.mutateAsync({ ...data, type: addType as RecordType });
            setIsFormOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save record.');
        }
    };

    const roseVariant = Award; // Just a helper for Award icon mapping


    const recentRecords = records.slice(0, 4);

    return (
        <div className="space-y-4 h-full p-1 overflow-y-auto custom-scrollbar">
            {/* Metrics Grid */}
            <div className="flex flex-col bg-card shadow-sm rounded-md border border-emerald-200 overflow-hidden">
                <div className="bg-emerald-600 flex items-center border-b py-2 px-4">
                    <h2 className="text-xl text-white font-bold tracking-tight">
                        My Research Insights
                    </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-4">
                    <StatCard label="IPR Publication" value={stats?.iprCount || 0} icon={Lightbulb} variant="amber" isLoading={statsLoading} />
                    <StatCard label="Journal Publication" value={stats?.journalCount || 0} icon={FileText} variant="primary" isLoading={statsLoading} />
                    <StatCard label="Conference Publication" value={stats?.conferenceCount || 0} icon={Users} variant="indigo" isLoading={statsLoading} />
                    <StatCard label="Book/Chapter Publication" value={stats?.bookCount || 0} icon={BookOpen} variant="emerald" isLoading={statsLoading} />
                    <StatCard label="Award & Recognition" value={stats?.awardCount || 0} icon={roseVariant} variant="rose" isLoading={statsLoading} />
                </div>
            </div>

            <div className="flex flex-col bg-card shadow-sm rounded-md border-emerald-200 border overflow-hidden">
                <div className="flex items-center bg-emerald-600 border-b py-2 px-4">
                    <h2 className="text-xl text-white font-bold tracking-tight">
                        My Recent Requests
                    </h2>
                </div>
                <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
                    {recordsLoading ? (
                        <div className="flex h-full w-full items-center justify-center w-full">
                            <Spinner />
                        </div>
                    ) : records.filter((r) => r.approval_status === 'pending').length > 0 ? (
                        records
                            .filter((r) => r.approval_status === 'pending')
                            .map((record) => (
                                <div key={record.id}
                                    className="flex flex-col items-center justify-center w-full h-full"
                                >
                                    <RecordCard onView={() => { }} record={record} />
                                </div>
                            ))
                    ) : (
                        <div className="flex h-full min-h-40 w-full items-center justify-center w-full">
                            <p className="text-center text-muted-foreground">
                                No pending requests.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
