import { Box, Typography, Link, Divider } from '@mui/material';
import { GitHub, Email } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => theme.palette.grey[200],
        textAlign: 'center'
      }}
    >
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 1
      }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} LexiQuest - AI Language Learning Game
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link 
            href="https://github.com/ayush6820" 
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <GitHub fontSize="small" sx={{ mr: 0.5 }} />
            GitHub
          </Link>
          
          <Link 
            href="mailto:ayushrai195@gmail.com" 
            color="inherit"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <Email fontSize="small" sx={{ mr: 0.5 }} />
            Contact
          </Link>
        </Box>
      </Box>
      
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
        Created with ❤️ by Ayush
      </Typography>
    </Box>
  );
}