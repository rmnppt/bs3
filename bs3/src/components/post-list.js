import React from "react";
import BasicCard from "./post-card";
import { posts } from "../api/post";

export default class CardList extends React.Component {
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
