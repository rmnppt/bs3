import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CardActionArea, Stack } from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { Link } from 'react-router-dom';

export default function BasicCard({post}) {
  return (
    <Card sx={{ minWidth: 275, maxHeight: 275, my: 2, mx: 2 }}>
      <CardContent>
        <Stack direction="row">
            <CardActions sx={{ pl: 0, ml: 0}}>
              <Stack direction="column">
                <Button>
                  <Stack direction="column">
                    <Typography fontSize={11} textAlign={"center"}>{post.upVotes}</Typography>
                    <ArrowCircleUpIcon></ArrowCircleUpIcon>
                  </Stack>
                </Button>
                <Button>
                  <Stack direction="column">
                    <ArrowCircleDownIcon color="secondary"></ArrowCircleDownIcon>
                    <Typography color="secondary" fontSize={11} textAlign={"center"}>{post.downVotes}</Typography>
                  </Stack>
                </Button>
              </Stack>
            </CardActions>
          <CardActionArea component={Link} to={`p/{post.id}`}>
              <Stack direction="row" spacing={1}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {post.author}
              </Typography>
              <Chip label={post.tag} size="small" color="primary" variant="outlined"></Chip>
              </Stack>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography> 
              <Typography variant="body2">
                {post.body}
              </Typography>
          </CardActionArea>
        </Stack>
      </CardContent>
    </Card>
  );
}