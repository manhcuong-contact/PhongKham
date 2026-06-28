'use strict';

/**
 * Công thức Haversine: Tính khoảng cách (km) giữa 2 tọa độ địa lý
 * @param {number} lat1 - Vĩ độ điểm 1
 * @param {number} lon1 - Kinh độ điểm 1
 * @param {number} lat2 - Vĩ độ điểm 2
 * @param {number} lon2 - Kinh độ điểm 2
 * @returns {number} Khoảng cách tính bằng km (làm tròn 2 chữ số)
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Làm tròn 2 chữ số thập phân
};

/**
 * Sắp xếp danh sách phòng khám theo khoảng cách gần nhất
 * @param {Array} clinics - Mảng phòng khám, mỗi phần tử cần có latitude & longitude
 * @param {number} userLat - Vĩ độ người dùng
 * @param {number} userLon - Kinh độ người dùng
 * @param {number} maxDistance - Bán kính tìm kiếm tối đa (km), mặc định 50km
 * @returns {Array} Mảng phòng khám đã được sắp xếp & gắn khoảng cách
 */
const getNearestClinics = (clinics, userLat, userLon, maxDistance = 50) => {
  return clinics
    .map((clinic) => {
      const distance = haversineDistance(
        userLat,
        userLon,
        parseFloat(clinic.latitude),
        parseFloat(clinic.longitude)
      );
      return { ...clinic.toJSON ? clinic.toJSON() : clinic, distance };
    })
    .filter((clinic) => clinic.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

module.exports = { haversineDistance, getNearestClinics };
