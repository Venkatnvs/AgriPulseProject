import React from 'react';

const formatErrorMessages = error => {
  if (!error) return <p>Unknown error occurred</p>;

  if (typeof error === 'string') return <p>{error}</p>;

  if (typeof error === "object" && error.length) {
    return (
      <>
        {error.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </>
    );
  }

  if (error?.non_field_errors) {
    return (
      <>
        {error.non_field_errors.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </>
    );
  }
  if (error?.errors?.non_field_errors) {
    return (
      <>
        {error.errors?.non_field_errors?.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </>
    );
  }

  if (error?.detail) {
    return <p>{error.detail}</p>;
  }

  if (error?.message) {
    return <p>{error.message}</p>;
  }

  if (error?.errors) {
    return (
      <>
        {Object.entries(error.errors).map(([field, messages], index) => (
          <p key={index}>
            <strong className='capitalize'>{field}:</strong>{' '}
            {messages.join(', ')}
          </p>
        ))}
      </>
    );
  }

  console.error('Unexpected error format:', error);

  return <p>Something went wrong!</p>;
};

export default formatErrorMessages;
