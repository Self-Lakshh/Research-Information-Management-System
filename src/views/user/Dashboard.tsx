import { useAuth } from '@/auth';
import { useUserStats, useApprovedUserRecords } from '@/hooks/useRIMSRecords';
import { Card } from '@/components/shadcn/ui/card';
import { Button } from '@/components/shadcn/ui/button';
import { Plus, FileText, Award, BookOpen, Briefcase, GraduationCap, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';

const UserDashboard = () => {
    const { user } = useAuth();
    const { stats, isLoading: statsLoading } = useUserStats();
    const { data: records, isLoading: recordsLoading } = useApprovedUserRecords();
    const [showAddDialog, setShowAddDialog] = useState(false);

    const statCards = [
        { label: 'IPR / Patents', count: stats.iprCount, icon: Lightbulb, color: 'text-amber-600' },
        { label: 'Journal Publications', count: stats.journalCount, icon: FileText, color: 'text-blue-600' },
        { label: 'Conference Papers', count: stats.conferenceCount, icon: Users, color: 'text-purple-600' },
        { label: 'Book Publications', count: stats.bookCount, icon: BookOpen, color: 'text-emerald-600' },
        { label: 'Consultancy Projects', count: stats.consultancyCount, icon: Briefcase, color: 'text-teal-600' },
        { label: 'Awards', count: stats.awardCount, icon: Award, color: 'text-rose-600' },
        { label: 'PhD Students', count: stats.phdStudentCount, icon: GraduationCap, color: 'text-indigo-600' },
        { label: 'Workshops / Seminars', count: stats.otherEventCount, icon: Users, color: 'text-cyan-600' },
    ];

    // Group records by type
    const groupedRecords = {
        ipr: records?.filter(r => r.type === 'ipr') || [],
        journal: records?.filter(r => r.type === 'journal') || [],
        conference: records?.filter(r => r.type === 'conference') || [],
        book: records?.filter(r => r.type === 'book') || [],
        consultancy: records?.filter(r => r.type === 'consultancy') || [],
        award: records?.filter(r => r.type === 'award') || [],
        phd_student: records?.filter(r => r.type === 'phd_student') || [],
        other: records?.filter(r => r.type === 'other') || [],
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Welcome back, {user?.name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Here's an overview of your research contributions
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                                            {statsLoading ? '...' : stat.count}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Records Showcase */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Your Research Portfolio
                    </h2>

                    {recordsLoading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-slate-400">Loading your records...</p>
                        </div>
                    ) : records && records.length > 0 ? (
                        <div className="space-y-8">
                            {/* IPR Section */}
                            {groupedRecords.ipr.length > 0 && (
                                <RecordSection title="Intellectual Property Rights" records={groupedRecords.ipr} type="ipr" />
                            )}

                            {/* Journal Section */}
                            {groupedRecords.journal.length > 0 && (
                                <RecordSection title="Journal Publications" records={groupedRecords.journal} type="journal" />
                            )}

                            {/* Conference Section */}
                            {groupedRecords.conference.length > 0 && (
                                <RecordSection title="Conference Papers" records={groupedRecords.conference} type="conference" />
                            )}

                            {/* Book Section */}
                            {groupedRecords.book.length > 0 && (
                                <RecordSection title="Book Publications" records={groupedRecords.book} type="book" />
                            )}

                            {/* Consultancy Section */}
                            {groupedRecords.consultancy.length > 0 && (
                                <RecordSection title="Consultancy Projects" records={groupedRecords.consultancy} type="consultancy" />
                            )}

                            {/* Awards Section */}
                            {groupedRecords.award.length > 0 && (
                                <RecordSection title="Awards & Recognitions" records={groupedRecords.award} type="award" />
                            )}

                            {/* PhD Students Section */}
                            {groupedRecords.phd_student.length > 0 && (
                                <RecordSection title="PhD Students" records={groupedRecords.phd_student} type="phd_student" />
                            )}

                            {/* Other Events Section */}
                            {groupedRecords.other.length > 0 && (
                                <RecordSection title="Workshops & Seminars" records={groupedRecords.other} type="other" />
                            )}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                No approved records yet. Start by adding your research contributions!
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => setShowAddDialog(true)}
                className="fixed bottom-8 left-8 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                aria-label="Add new record"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Add Record Dialog - TODO: Implement */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Record</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Record type selector will be implemented here
                        </p>
                        <Button onClick={() => setShowAddDialog(false)} className="mt-4">
                            Close
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Record Section Component
const RecordSection = ({ title, records, type }: { title: string; records: any[]; type: string }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title} ({records.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {records.map((record) => (
                    <RecordCard key={record.id} record={record} type={type} />
                ))}
            </div>
        </div>
    );
};

// Record Card Component
const RecordCard = ({ record, type }: { record: any; type: string }) => {
    const getTitle = () => {
        switch (type) {
            case 'ipr':
                return record.title;
            case 'journal':
                return record.title_of_paper;
            case 'conference':
                return record.title_of_paper;
            case 'book':
                return record.title_of_book;
            case 'consultancy':
                return record.project_title;
            case 'award':
                return record.award_name;
            case 'phd_student':
                return record.name_of_student;
            case 'other':
                return record.topic_title;
            default:
                return 'Untitled';
        }
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
                {getTitle()}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {record.description || 'No description available'}
            </p>
            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-500">
                    {record.created_at?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </span>
                <Button variant="default" size="sm">
                    View Details
                </Button>
            </div>
        </Card>
    );
};

export default UserDashboard;
