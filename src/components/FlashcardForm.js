import React from 'react';

const FlashcardForm = ({
  formState,
  setFormState,
  handleSubmit,
  handleCancel,
  isEditing,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Card' : 'Add New Card'}</h2>
      <input
        type="text"
        value={formState.question}
        onChange={(e) => setFormState({ ...formState, question: e.target.value })}
        placeholder="Question"
        required
      />
      <input
        type="text"
        value={formState.answer}
        onChange={(e) => setFormState({ ...formState, answer: e.target.value })}
        placeholder="Answer"
        required
      />
      <button type="submit">{isEditing ? 'Save Changes' : 'Add Card'}</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
};

export default FlashcardForm;
