import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Badge } from '@/components/shadcn/ui/badge';
import React from 'react';

export type Category = 'UI' | 'Form' | 'Layout' | 'Feedback' | 'Others';

export interface ComponentItem {
    id: string;
    name: string;
    description: string;
    category: Category;
    component: React.ComponentType<any> | React.LazyExoticComponent<any>;
    usage: string;
    props?: Record<string, any>;
}

export const componentLibrary: ComponentItem[] = [
    {
        id: 'button',
        name: 'Button',
        description: 'Displays a button or a component that looks like a button.',
        category: 'UI',
        component: Button,
        props: { children: 'Click me' },
        usage: `import { Button } from '@/components/shadcn/ui/button'

<Button>Click me</Button>`,
    },
    {
        id: 'input',
        name: 'Input',
        description: 'Displays a form input field or a component that looks like an input field.',
        category: 'Form',
        component: Input,
        props: { placeholder: 'Type here...' },
        usage: `import { Input } from '@/components/shadcn/ui/input'

<Input placeholder="Type here..." />`,
    },
    {
        id: 'badge',
        name: 'Badge',
        description: 'Displays a badge or a component that looks like a badge.',
        category: 'UI',
        component: Badge,
        props: { children: 'Badge' },
        usage: `import { Badge } from '@/components/shadcn/ui/badge'

<Badge>Badge</Badge>`,
    },
    {
        id: 'alert',
        name: 'Alert',
        description: 'Displays a callout for user attention.',
        category: 'Feedback',
        component: React.lazy(() => import('@/components/ui/Alert')),
        props: { showIcon: true, title: 'Attention', children: 'This is an alert message.' },
        usage: `import Alert from '@/components/ui/Alert'

<Alert showIcon title="Attention">
    This is an alert message.
</Alert>`,
    },
];

export const categories: Category[] = ['UI', 'Form', 'Layout', 'Feedback', 'Others'];
