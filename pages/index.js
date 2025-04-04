import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Psychology, 
  SportsEsports, 
  Language, 
  School 
} from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import wordsData from '../data/words.json';

export default function Home() {
  const [difficulty, setDifficulty] = useState('all');
  const [gameReady, setGameReady] = useState(false);
  const [stats, setStats] = useState({ totalWords: 0, easy: 0, medium: 0, hard: 0 });
  const theme = useTheme();

  useEffect(() => {
    // Calculate word statistics
    const totalWords = wordsData.words.length;
    const easy = wordsData.words.filter(word => word.difficulty === 'easy').length;
    const medium = wordsData.words.filter(word => word.difficulty === 'medium').length;
    const hard = wordsData.words.filter(word => word.difficulty === 'hard').length;
    
    setStats({ totalWords, easy, medium, hard });
    setGameReady(true);
  }, []);

  const filteredWords = difficulty === 'all' 
    ? wordsData.words 
    : wordsData.words.filter(word => word.difficulty === difficulty);

  const features = [
    {
      icon: <Psychology fontSize="large" />,
      title: "AI-Powered",
      description: "Adaptive learning algorithm adjusts to your skill level"
    },
    {
      icon: <SportsEsports fontSize="large" />,
      title: "Gamified Learning",
      description: "Earn points, level up, and track your progress"
    },
    {
      icon: <Language fontSize="large" />,
      title: "NLP Enhanced",
      description: "Real-time sentence analysis and word breakdown"
    },
    {
      icon: <School fontSize="large" />,
      title: "Comprehensive",
      description: `${stats.totalWords} words with definitions, examples, and pronunciations`
    }
  ];

  return (
    <>
      <Head>
        <title>LexiQuest | AI Language Learning Game</title>
        <meta name="description" content="Enhance your vocabulary with our AI-powered language learning game" />
      </Head>
      
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          py: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          color: 'white',
          boxShadow: 3
        }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            LexiQuest
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            AI-Powered Vocabulary Enhancement Game
          </Typography>
          {gameReady && (
            <Link href="/game" passHref legacyBehavior>
              <Button 
                component="a"
                variant="contained" 
                size="large" 
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                Start Learning Now
              </Button>
            </Link>
          )}
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                boxShadow: 3,
                borderTop: `4px solid ${theme.palette.primary.main}`
              }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  width: 56,
                  height: 56,
                  mb: 2
                }}>
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Word Explorer Section */}
        <Box sx={{ 
          mb: 6,
          p: 4,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            Word Explorer
            <Chip 
              label={`${stats.totalWords} words`} 
              color="primary" 
              size="medium" 
            />
          </Typography>
          
          <ToggleButtonGroup
            value={difficulty}
            exclusive
            onChange={(e, newDifficulty) => setDifficulty(newDifficulty)}
            sx={{ mb: 3 }}
            fullWidth
          >
            <ToggleButton value="all" sx={{ textTransform: 'none' }}>
              All Words
            </ToggleButton>
            <ToggleButton value="easy" sx={{ textTransform: 'none' }}>
              Easy ({stats.easy})
            </ToggleButton>
            <ToggleButton value="medium" sx={{ textTransform: 'none' }}>
              Medium ({stats.medium})
            </ToggleButton>
            <ToggleButton value="hard" sx={{ textTransform: 'none' }}>
              Hard ({stats.hard})
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={2}>
            {filteredWords.slice(0, 8).map(word => (
              <Grid item xs={12} sm={6} md={3} key={word.id}>
                <Card sx={{ 
                  height: '100%',
                  p: 2,
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 3,
                    borderLeft: `3px solid ${theme.palette.primary.main}`
                  }
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {word.word}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {word.partOfSpeech} • {word.difficulty}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    {word.definition}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredWords.length > 8 && (
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
              Showing 8 of {filteredWords.length} words
            </Typography>
          )}
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: 3
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Boost Your Vocabulary?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Join thousands of learners who have improved their language skills with our AI-powered game.
          </Typography>
          {gameReady && (
            <Link href="/game" passHref legacyBehavior>
              <Button 
                component="a"
                variant="contained" 
                size="large" 
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Start Playing Now
              </Button>
            </Link>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
}