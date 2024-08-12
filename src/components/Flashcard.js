import React from 'react';
import ReactCardFlip from 'react-card-flip';

const Flashcard = ({ card, index, isFlipped, handleCardClick, handleEditClick, handleDeleteClick }) => {
  return (
    <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
      <div className="card" onClick={() => handleCardClick(index)}>
        <h1>{card.question || 'No question available'}</h1>
        <div className="action-buttons">
          <button onClick={(e) => handleEditClick(e, card)}>Edit</button>
          <button onClick={(e) => handleDeleteClick(e, card.id)}>Delete</button>
        </div>
      </div>
      <div className="card card-back" onClick={() => handleCardClick(index)}>
        <h1>{card.answer || 'No answer available'}</h1>
      </div>
    </ReactCardFlip>
  );
};

export default Flashcard;
