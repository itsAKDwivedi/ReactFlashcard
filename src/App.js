import './App.css';
import { useState, useEffect } from 'react';
import FlashcardCarousel from './components/FlashcardCarousel';
import FlashcardForm from './components/FlashcardForm';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

function App() {
  const [flipStates, setFlipStates] = useState({});
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formState, setFormState] = useState({ question: '', answer: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editCardId, setEditCardId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFlashcards(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (index) => {
    setFlipStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEditClick = (e, card) => {
    e.stopPropagation();
    setFormState({ question: card.question, answer: card.answer });
    setEditCardId(card.id);
    setIsEditing(true);
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/data/${id}`, { method: 'DELETE' });
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((card) => card.id !== id)
      );
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const response = await fetch(`http://localhost:5000/api/data/${editCardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });
        const updatedCard = await response.json();
        setFlashcards((prevFlashcards) =>
          prevFlashcards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          )
        );
        setIsEditing(false);
        setEditCardId(null);
      } catch (error) {
        console.error('Error editing card:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });
        const newCard = await response.json();
        setFlashcards((prevFlashcards) => [...prevFlashcards, newCard]);
      } catch (error) {
        console.error('Error adding card:', error);
      }
    }
    setFormState({ question: '', answer: '' });

    // Force a page reload to reflect changes
    window.location.reload();
  };

  const handleCancel = () => {
    setFormState({ question: '', answer: '' });
    setIsEditing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container">
      <div className="carousel-container">
        <FlashcardCarousel
          flashcards={flashcards}
          flipStates={flipStates}
          handleCardClick={handleCardClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          responsive={responsive}
        />
      </div>
      <div className="buttons">
        <FlashcardForm
          formState={formState}
          setFormState={setFormState}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

export default App;
