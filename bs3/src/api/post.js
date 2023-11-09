var posts = [
    {
        id: "1",
        author: "dave",
        title: "The Goal Ferry Bridge is Open",
        tag: "EVENT",
        body: "Lets go have a party at the bridge, my mate is bringing some beers.",
        upVotes: 23,
        downVotes: 12
    }, 
    {
        id: "2",
        author: "charlie111",
        title: "I have a parrot for sale",
        tag: "SALE",
        body: "Its 13 years old and needs a new home. Hates crackers.",
        upVotes: 17,
        downVotes: 8
    }, 
    {
        id: "3",
        author: "elite-penguin",
        title: "Respond to the planning consultation",
        tag: "DISCUSSION",
        body: "I think we should discuss the narrowing of gathorne road entrance. I have mixed feelings",
        upVotes: 15,
        downVotes: 2
    },
    {
        id: "4",
        author: "soggyshirt",
        title: "I can't dry my washing",
        tag: "DISCUSSION",
        body: "Is anyone still able to dry their clothes in the sun or does anyone know of a decent laundrette around here?",
        upVotes: 0,
        downVotes: 38
    },
    {
        id: "5",
        author: "stickersnitch",
        title: "Too many stickers!",
        tag: "DISCUSSION",
        body: "Who is responsible for all of these stickers everywhere, can we please have a moratorium on stickers around the place, please.",
        upVotes: 12,
        downVotes: 12
    },
    {
        id: "6",
        author: "rugbyfan",
        title: "What about that match last night.",
        tag: "DISCUSSION",
        body: "I didn't watch it lol, can anyone fill me in?",
        upVotes: 1,
        downVotes: 5
    }
]

function getPost(postId) {
    var post = posts.find(p => p.id === postId);
    return post;
}

export { posts, getPost }

