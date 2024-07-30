// src/components/CouponsPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/CouponsPage.module.css';
import CouponForm from './CouponForm';

const CouponsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const handleCreateCouponClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (couponData) => {
    try {
      const response = await axios.post(
        'https://62a5-2401-4900-4bb0-cbd8-421-fcc5-260f-f78c.ngrok-free.app/api/v1/coupon',
        {
          couponCode: couponData.code,
          discount: couponData.discount,
          useType: couponData.type,
          couponSpecific: couponData.quantity || 'N/A',
          couponLimit: couponData.limit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer  eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInVzZXJUeXBlIjoicHJpX2FkbWluIiwidXNlcklkIjoiNjY5MTQyYjhkMmExNTc3ZDliMzNmODhlIiwiaWF0IjoxNzIyMjc5NDA5LCJleHAiOjE3MjI4ODQyMDl9.RvCnjfN79NgdzFlEB_ticDHi5BRsp716xfFYGHTcFWQM0ylskKpgrMiwvPHWT2RjBvv1etn6Ra5JFY_tZJfohA",
          }
        }
      );

      if (response.status === 201) {
        const newCoupon = response.data;
        setCoupons([...coupons, newCoupon]);
        handleCloseModal();
      }
    } catch (error) {
      console.error('Failed to create coupon', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Coupons</h1>
      <button onClick={handleCreateCouponClick}>Create Coupon</button>

      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CouponForm onSubmit={handleFormSubmit} />
            <button onClick={handleCloseModal} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Total Limit</th>
            <th>Limit/User</th>
            <th>Applicable</th>
            <th>Specificity</th>
            <th>Used</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, index) => (
            <tr key={index}>
              <td>{coupon.couponCode}</td>
              <td>{coupon.discount}%</td>
              <td>{coupon.couponLimit}</td>
              <td>{coupon.userLimit || 'N/A'}</td>
              <td>{coupon.useType === 'whole' ? 'Whole' : 'Quantity Based'}</td>
              <td>{coupon.useType === 'quantity' ? coupon.couponSpecific : '-'}</td>
              <td>0</td> {/* Initial used count */}
              <td>{coupon.status}</td>
              <td>
                {/* Action buttons for future use */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsPage