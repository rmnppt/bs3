import React from "react";
import BasicCard from "../components/post-card";
import { posts } from "../api/post";
import MainActionFab from "../components/main-action-buttons";


class PostList extends React.Component {
    render() {
        return posts.map(p => {
            return (
                <div key={p.id}>
                    <BasicCard 
                        className="BasicCard"
                        post={p}
                        ></BasicCard>
                </div>
            )
        })
    }
}

export default function PostListPage() {
    return (
        <div>
            <MainActionFab type="new" />
            <PostList />
        </div>
    )
}