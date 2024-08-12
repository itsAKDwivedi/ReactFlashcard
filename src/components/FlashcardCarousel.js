import React, { useEffect, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Flashcard from './Flashcard';

const FlashcardCarousel = ({
  flashcards,
  flipStates,
  handleCardClick,
  handleEditClick,
  handleDeleteClick,
  responsive,
  isEditing // Add isEditing to the props
}) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!carouselRef.current || isEditing) return; // Check isEditing

      if (event.key === 'ArrowRight') {
        carouselRef.current.next(); // Move to the next slide
      } else if (event.key === 'ArrowLeft') {
        carouselRef.current.previous(); // Move to the previous slide
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing]); // Re-run effect when isEditing changes

  return (
    <Carousel
      ref={carouselRef}
      responsive={responsive}
      showDots={true}
      infinite={true}
      arrows={true}
    >
      {flashcards.map((card, index) => (
        <Flashcard
          key={card.id} // Ensure unique key for each Flashcard
          card={card}
          index={index}
          isFlipped={flipStates[index]}
          handleCardClick={handleCardClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </Carousel>
  );
};

export default FlashcardCarousel;
