'use strict';

/**
 * Chuẩn hoá response JSON cho toàn bộ API
 * Format: { success, message, data, meta, error }
 */

const apiResponse = {
  /**
   * 200 OK - Thành công
   */
  success: (res, data = null, message = 'Thành công', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  /**
   * 200 OK - Danh sách có phân trang
   */
  paginated: (res, data, pagination, message = 'Lấy danh sách thành công') => {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  },

  /**
   * 201 Created
   */
  created: (res, data = null, message = 'Tạo mới thành công') => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  /**
   * 400 Bad Request
   */
  badRequest: (res, message = 'Yêu cầu không hợp lệ', errors = null) => {
    return res.status(400).json({
      success: false,
      message,
      errors
    });
  },

  /**
   * 401 Unauthorized
   */
  unauthorized: (res, message = 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn') => {
    return res.status(401).json({
      success: false,
      message
    });
  },

  /**
   * 403 Forbidden
   */
  forbidden: (res, message = 'Bạn không có quyền thực hiện hành động này') => {
    return res.status(403).json({
      success: false,
      message
    });
  },

  /**
   * 404 Not Found
   */
  notFound: (res, message = 'Không tìm thấy dữ liệu') => {
    return res.status(404).json({
      success: false,
      message
    });
  },

  /**
   * 409 Conflict
   */
  conflict: (res, message = 'Dữ liệu đã tồn tại', data = null) => {
    return res.status(409).json({
      success: false,
      message,
      data
    });
  },

  /**
   * 422 Unprocessable Entity (Validation errors)
   */
  validationError: (res, errors) => {
    return res.status(422).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  },

  /**
   * 500 Internal Server Error
   */
  serverError: (res, message = 'Đã có lỗi xảy ra, vui lòng thử lại sau') => {
    return res.status(500).json({
      success: false,
      message
    });
  }
};

module.exports = apiResponse;
