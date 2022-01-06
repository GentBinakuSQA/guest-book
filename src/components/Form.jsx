import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({ onSubmit, user, balance }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>Sign the guest book, { user }!</p>
        <p className="highlight">
          <label htmlFor="message">Message:</label>
          <input
            autoComplete="off"
            autoFocus
            id="message"
            required
          />
        </p>
        <p>
          <label htmlFor="donation">Donation (optional):</label>
          <input
            autoComplete="off"
            id="donation"
            max="10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">
          Sign
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.any.isRequired,
    balance: PropTypes.any.isRequired
  })
};
