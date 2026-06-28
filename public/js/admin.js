// d:\PhongKham\public\js\admin.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Kiểm tra đăng nhập và Role
    const userStr = localStorage.getItem('user');
    if (!userStr || !getAccessToken()) {
        window.location.href = '/login.html';
        return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin' && user.role !== 'doctor') {
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = '/login.html';
        return;
    }

    try {
        // 2. Fetch dữ liệu Dashboard
        const [statsRes, recentRes] = await Promise.all([
            api.getDashboardStats(),
            api.getRecentAppointments()
        ]);

        const stats = statsRes.data;
        const recentAppts = recentRes.data;

        // 3. Cập nhật các con số tổng quan
        document.getElementById('stat-total').textContent = stats.today.appointments;
        document.getElementById('stat-completed').textContent = stats.status.completed;
        document.getElementById('stat-cancelled').textContent = stats.status.cancelled;

        // 4. Render danh sách lịch sắp tới
        const listContainer = document.getElementById('recent-appointments-list');
        listContainer.innerHTML = ''; // Xóa mock data
        
        if (recentAppts.length === 0) {
            listContainer.innerHTML = '<p class="text-sm text-gray-500 text-center mt-4">Chưa có lịch hẹn nào</p>';
        } else {
            recentAppts.forEach(appt => {
                let statusClass = '';
                let statusText = '';
                
                switch (appt.status) {
                    case 'completed':
                        statusClass = 'bg-secondary-container/20 text-on-secondary-container';
                        statusText = 'Đã khám';
                        break;
                    case 'pending':
                    case 'confirmed':
                        statusClass = 'bg-tertiary-container/20 text-tertiary';
                        statusText = 'Sắp tới';
                        break;
                    case 'cancelled':
                    case 'no_show':
                        statusClass = 'bg-error-container/20 text-error';
                        statusText = 'Đã hủy';
                        break;
                }

                let actionButtons = '';
                if (appt.status === 'pending') {
                    actionButtons = `
                        <div class="flex gap-2 mt-3 pt-3 border-t border-surface-container-highest">
                            <button onclick="updateApptStatus(${appt.id}, 'confirmed')" class="flex-1 bg-primary text-white text-[11px] font-bold py-1.5 rounded hover:bg-primary/90 transition">Xác nhận</button>
                            <button onclick="updateApptStatus(${appt.id}, 'cancelled')" class="flex-1 bg-error-container text-error text-[11px] font-bold py-1.5 rounded hover:bg-error-container/80 transition">Huỷ</button>
                        </div>
                    `;
                } else if (appt.status === 'confirmed') {
                    actionButtons = `
                        <div class="flex gap-2 mt-3 pt-3 border-t border-surface-container-highest">
                            <button onclick="updateApptStatus(${appt.id}, 'completed')" class="w-full bg-green-500 text-white text-[11px] font-bold py-1.5 rounded hover:bg-green-600 transition">Hoàn thành khám</button>
                        </div>
                    `;
                }

                // Render item
                const html = `
                <div class="p-4 hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant mb-2 group">
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2 py-1 ${statusClass} text-[11px] rounded font-bold uppercase tracking-tighter">${statusText}</span>
                        <span class="text-on-surface-variant text-[12px] font-medium">${appt.startTime}</span>
                    </div>
                    <div class="flex gap-3">
                        <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold shrink-0">
                            ${appt.patient.fullName.charAt(0)}
                        </div>
                        <div>
                            <h5 class="font-title-lg text-[14px] leading-tight text-on-surface">${appt.patient.fullName}</h5>
                            <p class="text-on-surface-variant text-[12px] mt-0.5">${appt.reason || 'Khám tổng quát'}</p>
                            <div class="flex items-center gap-1 text-[11px] text-outline mt-2">
                                <span class="material-symbols-outlined text-[14px]">stethoscope</span>
                                <span>${appt.doctor.title}. ${appt.doctor.fullName}</span>
                            </div>
                        </div>
                    </div>
                    ${actionButtons}
                </div>`;
                listContainer.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu dashboard:', error);
        alert('Lỗi tải dữ liệu. Vui lòng đăng nhập lại.');
    }
});

// Hàm Global để xử lý cập nhật trạng thái lịch hẹn
window.updateApptStatus = async function(id, status) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái lịch khám này?')) return;
    try {
        await fetchAPI(`/appointments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        // Reload lại trang để cập nhật Dashboard
        window.location.reload();
    } catch (error) {
        alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
};
