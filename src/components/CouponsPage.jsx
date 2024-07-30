// src/components/CouponsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/CouponsPage.module.css';
import CouponForm from './CouponForm';

const CouponsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const access_token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInVzZXJUeXBlIjoicHJpX2FkbWluIiwidXNlcklkIjoiNjU3OGIwNTYwYzgwOWRmZDliMDJlOWFlIiwiaWF0IjoxNzIyMzYwOTY2LCJleHAiOjE3MjI5NjU3NjZ9.bYC7ZBgqQynPIbPF-eT9MrCemOcbmOoy9hc1tn4Iwl1BCoy2boLY-zxUoyeWN0ZuCiueC-guizUZL5KyNKV16g'

  const handleCreateCouponClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(()=>{
    fetchCoupon();
  },[])

  const fetchCoupon = async () => {
    try {
      const response = await axios.get(
        `https://12cb-2401-4900-33d5-b6fa-880d-5bd3-d18a-37b0.ngrok-free.app/api/v1/coupon`,{
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": 1,
          },
        }
      )

      setCoupons(response.data.content);
      console.log(response.data.content);
    } catch (error) {
      console.error('Error:',error);
    }
  }

  const handleFormSubmit = async (couponData) => {
    try {
      const response = await axios.post(
        `https://12cb-2401-4900-33d5-b6fa-880d-5bd3-d18a-37b0.ngrok-free.app/api/v1/coupon`,
        {
          couponCode: couponData.code,
          discount: Number(couponData.discount),
          useType: Number(couponData.type),
          couponSpecific: couponData.quantity || 'N/A',
          couponLimit: couponData.limit,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": 1,
          }
        }
      );

      
        const newCoupon = response.data.content;
        console.log(newCoupon);
        setCoupons([...coupons, newCoupon]);
        handleCloseModal();

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