import React from "react";
import BasicCard from "../components/post-card";
import MainActionFab from "../components/main-action-buttons";
import { useOutletContext } from "react-router-dom";

class PostList extends React.Component {
    constructor(posts) {
        super()
    }

    render() {
        
        return this.props.posts.map(p => {
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
    const [posts] = useOutletContext();

    return (
        <div>
            <MainActionFab type="new" />
            <PostList posts={posts}/>
        </div>
    )
}