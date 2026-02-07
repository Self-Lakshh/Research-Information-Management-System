import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/ui/card'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/shadcn/ui/button'
import { Badge } from '@/components/shadcn/ui/badge'
import {
    Mail,
    Phone,
    MapPin,
    Building2,
    GraduationCap,
    Calendar,
    Edit3,
    ExternalLink,
    Award,
    FileText,
    TrendingUp
} from 'lucide-react'

const Profile = () => {
    // Mock user data
    const user = {
        name: 'Dr. Lakshh Agarwal',
        email: 'lakshh.agarwal@university.edu',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        department: 'Computer Science & Engineering',
        designation: 'Associate Professor',
        joined: 'Jan 2020',
        stats: [
            { label: 'Publications', value: '42', icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { label: 'Citations', value: '1,250', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'H-Index', value: '18', icon: Award, color: 'text-purple-600 bg-purple-50' },
        ]
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Profile Card */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="border-none shadow-premium overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary shadow-inner" />
                        <CardContent className="relative pt-0">
                            <div className="flex flex-col items-center -mt-16 space-y-4">
                                <Avatar size={120} shape="circle" className="border-4 border-background shadow-xl">
                                    <span className="text-2xl">LA</span>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground">{user.designation}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                                        <Edit3 className="h-4 w-4" /> Edit Profile
                                    </Button>
                                    <Button size="sm" className="rounded-full gap-2">
                                        <ExternalLink className="h-4 w-4" /> CV
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 pt-8 border-t">
                                <div className="flex items-center gap-3 text-sm">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.department}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {user.joined}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Stats & Info */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {user.stats.map((stat) => (
                            <Card key={stat.label} className="border-none shadow-premium">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-2xl ${stat.color}`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-none shadow-premium">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                Research Interests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['Artificial Intelligence', 'Machine Learning', 'Data Ethics', 'Healthcare AI', 'Federated Learning', 'Deep Learning'].map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors border-none">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium">
                        <CardHeader>
                            <CardTitle>Biography</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                Dr. Lakshh Agarwal is an Associate Professor in the Department of Computer Science & Engineering.
                                His research focuses on the intersection of Artificial Intelligence and Healthcare, specifically
                                aiming to improve efficiency and ethics in AI models. He has published over 40 research papers
                                in top-tier journals and conferences.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Milestones</CardTitle>
                            <Button variant="ghost" size="sm">Add New</Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { title: 'Best Paper Award', sub: 'International Conference on AI 2023', date: 'Oct 2023' },
                                { title: 'Patent Granted', sub: 'AI-based Healthcare Diagnostic System', date: 'Aug 2023' },
                                { title: 'Keynote Speaker', sub: 'Tech Summit 2023', date: 'May 2023' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== 2 && <div className="absolute left-2.5 top-6 bottom-0 w-px bg-border" />}
                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div className="flex-1 pb-6 text-sm">
                                        <p className="font-bold">{item.title}</p>
                                        <p className="text-muted-foreground">{item.sub}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Profile
