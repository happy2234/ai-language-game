import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href="/" passHref legacyBehavior>
            <Typography 
              variant="h6" 
              component="a" 
              sx={{ 
                color: 'inherit', 
                textDecoration: 'none',
                '&:hover': { cursor: 'pointer' }
              }}
            >
              LexiQuest
            </Typography>
          </Link>
        </Box>
        <Box>
          <Link href="/game" passHref legacyBehavior>
            <Button component="a" color="inherit">Play</Button>
          </Link>
          <Link href="/words" passHref legacyBehavior>
            <Button component="a" color="inherit">Word List</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}