import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { VolumeUp, RestartAlt, Home } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import wordsData from '../data/words.json';
import ProgressBar from '../components/ProgressBar';

// Client-side sentence analysis
const analyzeSentence = (sentence) => {
  const words = sentence.split(/\s+/);
  const nouns = words.filter(word => word.length > 3 && /^[A-Z]/.test(word));
  const verbs = words.filter(word => word.endsWith('ing') || word.endsWith('ed'));
  const adjectives = words.filter(word => word.endsWith('ful') || word.endsWith('ous'));

  return {
    nouns,
    verbs,
    adjectives
  };
};

export default function Game() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [userLevel, setUserLevel] = useState(1);
  const [gameMode, setGameMode] = useState('definition');
  const [sentenceAnalysis, setSentenceAnalysis] = useState(null);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const startNewRound = useCallback(() => {
    const eligibleWords = wordsData.words.filter(word => {
      const difficulty = word.difficulty === 'easy' ? 1 : word.difficulty === 'medium' ? 2 : 3;
      return difficulty <= userLevel + 1;
    });

    const randomIndex = Math.floor(Math.random() * eligibleWords.length);
    const word = eligibleWords[randomIndex];
    setCurrentWord(word);
    speakWord(word.word);
    
    const incorrectOptions = wordsData.words
      .filter(w => w.id !== word.id && w.partOfSpeech === word.partOfSpeech)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => gameMode === 'definition' ? w.definition : w.word);

    const correctOption = gameMode === 'definition' ? word.definition : word.word;
    const allOptions = [...incorrectOptions, correctOption]
      .sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
    setFeedback('');
    
    if (word.examples && word.examples.length > 0) {
      setSentenceAnalysis(analyzeSentence(word.examples[0]));
    }
  }, [userLevel, gameMode]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleAnswer = (selectedOption) => {
    const isCorrect = gameMode === 'definition' 
      ? selectedOption === currentWord.definition
      : selectedOption === currentWord.word;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct!');
      if (score > 0 && score % 3 === 0) {
        setUserLevel(prev => Math.min(5, prev + 1));
      }
    } else {
      setFeedback(`Incorrect! The correct answer was: ${gameMode === 'definition' ? currentWord.definition : currentWord.word}`);
    }

    const newProgress = progress + 10;
    if (newProgress >= 100) {
      setGameOver(true);
    } else {
      setProgress(newProgress);
      setTimeout(startNewRound, 1500);
    }
  };

  const restartGame = () => {
    setScore(0);
    setProgress(0);
    setGameOver(false);
    setUserLevel(1);
    startNewRound();
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === 'definition' ? 'word' : 'definition');
  };

  if (gameOver) {
    return (
      <>
        <Header />
        <Container maxWidth="sm">
          <Box sx={{ 
            my: 4, 
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            background: 'linear-gradient(145deg, #f5f7fa, #ffffff)'
          }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Game Complete!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Your final score: {score}/10
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Reached level: {userLevel}
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={restartGame}
                size="large"
                startIcon={<RestartAlt />}
              >
                Play Again
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/')}
                size="large"
                startIcon={<Home />}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ 
          my: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          background: 'linear-gradient(145deg, #f5f7fa, #ffffff)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Level: {userLevel}
            </Typography>
            <Box>
              <Tooltip title="Toggle Game Mode">
                <Button 
                  variant="outlined" 
                  onClick={toggleGameMode}
                  size="small"
                >
                  {gameMode === 'definition' ? 'Word Match' : 'Definition Match'}
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <ProgressBar value={progress} />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2
          }}>
            <Typography variant="h6">
              Score: {score}
            </Typography>
            <Chip 
              label={`${gameMode === 'definition' ? 'Definition Match' : 'Word Match'}`}
              color="primary"
              size="small"
            />
          </Box>

          {currentWord && (
            <Card sx={{ 
              mb: 4,
              boxShadow: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main'
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {gameMode === 'definition' ? currentWord.word : currentWord.definition}
                  </Typography>
                  <Tooltip title="Pronounce">
                    <IconButton onClick={() => speakWord(currentWord.word)}>
                      <VolumeUp color="primary" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {gameMode === 'definition' && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Part of speech:</strong> {currentWord.partOfSpeech}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      "{currentWord.examples[0]}"
                    </Typography>
                    
                    {sentenceAnalysis && (
                      <Box sx={{ 
                        mt: 2,
                        p: 1,
                        backgroundColor: 'action.hover',
                        borderRadius: 1
                      }}>
                        <Typography variant="caption" component="div">
                          <strong>Sentence Analysis:</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {sentenceAnalysis.nouns.length > 0 && (
                            <Chip label={`Nouns: ${sentenceAnalysis.nouns.join(', ')}`} size="small" />
                          )}
                          {sentenceAnalysis.verbs.length > 0 && (
                            <Chip label={`Verbs: ${sentenceAnalysis.verbs.join(', ')}`} size="small" />
                          )}
                          {sentenceAnalysis.adjectives.length > 0 && (
                            <Chip label={`Adjectives: ${sentenceAnalysis.adjectives.join(', ')}`} size="small" />
                          )}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {options.map((option, index) => (
              <Button 
                key={index}
                variant="outlined"
                fullWidth
                onClick={() => handleAnswer(option)}
                disabled={feedback !== ''}
                sx={{
                  py: 2,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </Box>

          {feedback && (
            <Box sx={{ 
              mt: 3,
              p: 2,
              borderRadius: 1,
              backgroundColor: feedback.startsWith('Correct') ? 'success.light' : 'error.light'
            }}>
              <Typography 
                variant="body1"
                sx={{ 
                  fontWeight: 'bold',
                  color: feedback.startsWith('Correct') ? 'success.dark' : 'error.dark'
                }}
              >
                {feedback}
              </Typography>
              {!feedback.startsWith('Correct') && currentWord && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Example:</strong> {currentWord.examples[0]}
                  </Typography>
                  {currentWord.synonyms && (
                    <Typography variant="body2">
                      <strong>Synonyms:</strong> {currentWord.synonyms.join(', ')}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}