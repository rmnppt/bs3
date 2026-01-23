export type Comment = {
    id: string;
    author: string;
    text: string;
    upVoted: string[];
    downVoted: string[];
    timestamp: string;
    userId: string;
}

export type PostData = {
    id: string;
    title: string;
    body: string;
    author: string;
    tag: string;
    upVoted: string[];
    downVoted: string[];
    timestamp: string;
    userId: string;
    expiryPeriod?: '24h' | '3d' | '7d'; // Optional for migration/backward compatibility
};

export type FirestoreState = {
    user: string;
    posts: PostData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

export interface BasicCardProps {
    post: PostData;
    extended?: boolean;
};

