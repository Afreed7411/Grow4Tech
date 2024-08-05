// src/components/CouponForm.jsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/CouponForm.module.css';

const CouponForm = ({ onSubmit, initialData }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [limit, setLimit] = useState('');
  const [type, setType] = useState('whole');
  const [quantity, setQuantity] = useState('');
  const [userLimit, setUserLimit] = useState('');

  useEffect(() => {
    if (initialData) {
      setCode(initialData.couponCode);
      setDiscount(initialData.discount);
      setExpiryDate(initialData.expiryDate);
      setLimit(initialData.couponLimit);
      setType(initialData.useType === 'whole' ? 'whole' : 'quantity');
      setQuantity(initialData.couponSpecific || '');
      setUserLimit(initialData.userLimit || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ code, discount, expiryDate, limit, type, quantity, userLimit });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{initialData ? 'Edit Coupon' : 'Create a Coupon'}</h2>
      <div>
        <label>Enter Coupon Code:</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} required />
      </div>
      <div>
        <label>Enter Discount Percentage:</label>
        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
      </div>
      <div>
        <label>Coupon Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="whole">Whole</option>
          <option value="quantity">Quantity Based</option>
        </select>
      </div>
      {type === 'quantity' && (
        <div>
          <label>Enter Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
      )}
      <div>
        <label>Coupon Limit:</label>
        <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} required />
      </div>
      <div>
        <label>Enter User Limit per User:</label>
        <input type="number" value={userLimit} onChange={(e) => setUserLimit(e.target.value)} required />
      </div>
      <div>
        <label>Select Expiry Date:</label>
        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
      </div>
      <button type="submit">{initialData ? 'Update' : 'Submit'}</button>
    </form>
  );
};

export default CouponForm;
