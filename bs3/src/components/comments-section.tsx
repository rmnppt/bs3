import React, { useState, useEffect, useRef } from 'react';
import { db } from '../api/firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { Card, CardContent, Typography, TextField, InputAdornment, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Comment } from '../types/types';
import { useAppSelector } from '../app/hooks';
import { timeAgo } from './utils';

interface CommentsSectionProps {
  postId: string;
}

function CommentsSection({ postId }: CommentsSectionProps) {
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const userId = useAppSelector(state => state.app.user);
  const location = useAppSelector(state => state.geolocation.location);

  useEffect(() => {
    if (textAreaRef.current) {
      // Scroll to the bottom of the TextField's container
      const { top, height } = textAreaRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY + top + height;
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }, [text]); // Trigger on value changes
  

  useEffect(() => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map((doc) => ({
        ...(doc.data() as Comment),
      }));
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit called");
    e.preventDefault();
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const newComment = await addDoc(commentsRef, {
      // author: string;
      text,
      upVoted: [],
      downVoted: [],
      timestamp: new Date().toISOString(),
      userId: userId,
    });
    await updateDoc(newComment, {
      id: newComment.id, // Update the document with its own ID
    });
    setText('');
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
        Comments ({comments.length})
      </Typography>
      <ul>
        {comments.map(({ id, text, timestamp }) => (
          <Card key={id} sx={{ my: 0.5 }} elevation={0}>
            <CardContent sx={{ py: 0.5 }}>
              <Typography variant="body1">{text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {timeAgo(timestamp)}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {location.local && (
          <Card sx={{ my: 0.5 }} elevation={0}>
            <CardContent sx={{ py: 0.5, mb: 4 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="comment"
                  label="Add a comment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  inputRef={textAreaRef}
                  multiline
                  minRows={1}
                  required
                  fullWidth
                  sx={{ mb: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Fab 
                          color="secondary" 
                          aria-label="send" 
                          size="small" 
                          type="submit"
                          disabled={!text.trim()}>
                          <SendIcon />
                        </Fab>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </CardContent>
          </Card>
        )}
      </ul>
    </div>
  );
}

export default CommentsSection;