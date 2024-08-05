// src/components/CouponsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/CouponsPage.module.css';
import CouponForm from '../components/CouponForm';

const CouponsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const access_token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInVzZXJUeXBlIjoicHJpX2FkbWluIiwidXNlcklkIjoiNjY5MGJiNzEyNTE5NGZhODgxYWNiOTgxIiwiaWF0IjoxNzIyODM4MjAzLCJleHAiOjE3MjM0NDMwMDN9.KT7_kGK79gDlhzcyrBi3hDToZ8umGv3Q7iaJqnS0Kxv8kR9bfE26dUiLEdx3uYD8UyjH39iIJI14rRCVOhopfw';

  const handleCreateCouponClick = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        `https://www.frosty-easley.148-113-9-31.plesk.page/api/v1/coupon`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": 1,
          },
        }
      );

      setCoupons(response.data.content);
      console.log(response.data.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSubmit = async (couponData) => {
    try {
      let response;
      if (editingCoupon) {
        response = await axios.put(
          `https://www.frosty-easley.148-113-9-31.plesk.page/api/v1/coupon/${editingCoupon._id}`,
          {
            couponCode: couponData.code,
            discount: Number(couponData.discount),
            useType: couponData.type,
            couponSpecific: couponData.quantity || 'N/A',
            couponLimit: couponData.limit,
            expiryDate: couponData.expiryDate,
            userLimit: couponData.userLimit,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
              "ngrok-skip-browser-warning": 1,
            }
          }
        );

        setCoupons(coupons.map(coupon =>
          coupon._id === editingCoupon._id ? response.data.content : coupon
        ));
      } else {
        response = await axios.post(
          `https://www.frosty-easley.148-113-9-31.plesk.page/api/v1/coupon`,
          {
            couponCode: couponData.code,
            discount: Number(couponData.discount),
            useType: couponData.type,
            couponSpecific: couponData.quantity || 'N/A',
            couponLimit: couponData.limit,
            expiryDate: couponData.expiryDate,
            userLimit: couponData.userLimit,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
              "ngrok-skip-browser-warning": 1,
            }
          }
        );

        setCoupons([...coupons, response.data.content]);
      }

      setEditingCoupon(null);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to create/update coupon', error.response ? error.response.data : error.message);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await axios.delete(
        `https://www.frosty-easley.148-113-9-31.plesk.page/api/v1/coupon/${couponId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": 1,
          }
        }
      );

      setCoupons(coupons.filter(coupon => coupon._id !== couponId));
    } catch (error) {
      console.error('Failed to delete coupon', error.response ? error.response.data : error.message);
    }
  };

  const handleToggleCouponStatus = async (couponId) => {
    try {
      const coupon = coupons.find(coupon => coupon._id === couponId);
      const newStatus = coupon.status === 'Active' ? 'Disabled' : 'Active';

      const response = await axios.put(
        `https://www.frosty-easley.148-113-9-31.plesk.page/api/v1/disable/${couponId}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            "ngrok-skip-browser-warning": 1,
          }
        }
      );

      setCoupons(coupons.map(coupon =>
        coupon._id === couponId ? { ...coupon, status: response.data.status } : coupon
      ));
    } catch (error) {
      console.error('Failed to toggle coupon status', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Coupons</h1>
      <button onClick={handleCreateCouponClick}>Create Coupon</button>

      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CouponForm onSubmit={handleFormSubmit} initialData={editingCoupon} />
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
                <button onClick={() => handleEditCoupon(coupon)}>Edit</button>
                <button onClick={() => handleToggleCouponStatus(coupon._id)}>
                  {coupon.status === 'Active' ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleDeleteCoupon(coupon._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsPage;
