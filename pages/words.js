// pages/words.js
import { useState } from 'react';
import { 
  Container,
  Typography,
  Box,
  Card,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import wordsData from '../data/words.json';

export default function WordsPage() {  // Only one export default
  const [difficulty, setDifficulty] = useState('all');

  const filteredWords = difficulty === 'all' 
    ? wordsData.words 
    : wordsData.words.filter(word => word.difficulty === difficulty);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Word List
        </Typography>

        <ToggleButtonGroup
          value={difficulty}
          exclusive
          onChange={(e, newDifficulty) => setDifficulty(newDifficulty)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="easy">Easy</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="hard">Hard</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {filteredWords.map((word) => (
            <Card key={word.id} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {word.word}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {word.partOfSpeech} • {word.difficulty}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                {word.definition}
              </Typography>
              {word.examples && word.examples.length > 0 && (
                <Typography variant="body2" fontStyle="italic">
                  "{word.examples[0]}"
                </Typography>
              )}
            </Card>
          ))}
        </Box>
      </Container>
      <Footer />
    </>
  );
}