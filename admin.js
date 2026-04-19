// التعامل مع التنقل في الشريط الجانبي
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        
        // إزالة الكلاس النشط من جميع العناصر
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // إخفاء جميع الصفحات
        pages.forEach(page => page.classList.add('hidden'));
        
        // إظهار الصفحة المطلوبة
        document.getElementById(`${targetPage}-page`).classList.remove('hidden');
        
        // رسم الرسوم البيانية إذا كانت الصفحة هي التحليلات
        if (targetPage === 'analytics') {
            setTimeout(() => {
                drawSalesChart();
                drawProductsChart();
            }, 100);
        }
    });
});

// رسم الرسم البياني للإيرادات
const canvas = document.getElementById('revenueChart');
const ctx = canvas.getContext('2d');

function drawChart() {
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const data = [
        { month: 'يناير', revenue: 4200 },
        { month: 'فبراير', revenue: 5100 },
        { month: 'مارس', revenue: 4800 },
        { month: 'أبريل', revenue: 6200 },
        { month: 'مايو', revenue: 7500 },
        { month: 'يونيو', revenue: 8100 },
        { month: 'يوليو', revenue: 7800 },
        { month: 'أغسطس', revenue: 9200 }
    ];
    
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // رسم الخطوط الشبكية
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // رسم منطقة التعبئة تحت الخط
    ctx.beginPath();
    data.forEach((item, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (item.revenue / maxRevenue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, canvas.height - padding);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // رسم خط الإيرادات
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    data.forEach((item, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (item.revenue / maxRevenue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // رسم النقاط
    data.forEach((item, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = canvas.height - padding - (item.revenue / maxRevenue) * chartHeight;
        
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // رسم أسماء الأشهر
    ctx.fillStyle = '#6b7280';
    ctx.font = '13px Tajawal';
    ctx.textAlign = 'center';
    data.forEach((item, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(item.month, x, canvas.height - 15);
    });
    
    // رسم قيم المحور Y
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxRevenue / 5) * (5 - i));
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(value.toString(), padding - 15, y + 5);
    }
}

drawChart();

// رسم الرسم البياني للمبيعات في صفحة التحليلات
function drawSalesChart() {
    const salesCanvas = document.getElementById('salesChart');
    if (!salesCanvas) return;
    
    const salesCtx = salesCanvas.getContext('2d');
    salesCanvas.width = salesCanvas.offsetWidth;
    salesCanvas.height = 300;
    
    const data = [
        { month: 'يناير', sales: 320 },
        { month: 'فبراير', sales: 450 },
        { month: 'مارس', sales: 380 },
        { month: 'أبريل', sales: 520 },
        { month: 'مايو', sales: 610 },
        { month: 'يونيو', sales: 580 }
    ];
    
    const padding = 50;
    const chartWidth = salesCanvas.width - padding * 2;
    const chartHeight = salesCanvas.height - padding * 2;
    const barWidth = chartWidth / data.length - 20;
    const maxSales = Math.max(...data.map(d => d.sales));
    
    salesCtx.clearRect(0, 0, salesCanvas.width, salesCanvas.height);
    
    // رسم الأعمدة
    data.forEach((item, index) => {
        const x = padding + (chartWidth / data.length) * index + 10;
        const barHeight = (item.sales / maxSales) * chartHeight;
        const y = salesCanvas.height - padding - barHeight;
        
        // تدرج لوني للعمود
        const gradient = salesCtx.createLinearGradient(0, y, 0, salesCanvas.height - padding);
        gradient.addColorStop(0, '#9333ea');
        gradient.addColorStop(1, '#a855f7');
        
        salesCtx.fillStyle = gradient;
        salesCtx.fillRect(x, y, barWidth, barHeight);
        
        // رسم القيمة فوق العمود
        salesCtx.fillStyle = '#1f2937';
        salesCtx.font = 'bold 13px Tajawal';
        salesCtx.textAlign = 'center';
        salesCtx.fillText(item.sales.toString(), x + barWidth / 2, y - 10);
        
        // رسم اسم الشهر
        salesCtx.fillStyle = '#6b7280';
        salesCtx.font = '13px Tajawal';
        salesCtx.fillText(item.month, x + barWidth / 2, salesCanvas.height - 15);
    });
}

// رسم الرسم البياني الدائري للمنتجات
function drawProductsChart() {
    const productsCanvas = document.getElementById('productsChart');
    if (!productsCanvas) return;
    
    const productsCtx = productsCanvas.getContext('2d');
    productsCanvas.width = productsCanvas.offsetWidth;
    productsCanvas.height = 300;
    
    const data = [
        { name: 'الباقة الأساسية', value: 35, color: '#7c3aed' },
        { name: 'الباقة المميزة', value: 45, color: '#a855f7' },
        { name: 'باقة الأعمال', value: 20, color: '#c084fc' }
    ];
    
    const centerX = productsCanvas.width / 2;
    const centerY = productsCanvas.height / 2;
    const radius = 90;
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach(item => {
        const sliceAngle = (item.value / 100) * Math.PI * 2;
        
        productsCtx.beginPath();
        productsCtx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        productsCtx.lineTo(centerX, centerY);
        productsCtx.fillStyle = item.color;
        productsCtx.fill();
        
        // رسم النسبة المئوية
        const textAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
        
        productsCtx.fillStyle = 'white';
        productsCtx.font = 'bold 16px Tajawal';
        productsCtx.textAlign = 'center';
        productsCtx.fillText(`${item.value}%`, textX, textY);
        
        currentAngle += sliceAngle;
    });
    
    // رسم المفتاح
    let legendY = 30;
    data.forEach(item => {
        productsCtx.fillStyle = item.color;
        productsCtx.fillRect(20, legendY, 20, 20);
        
        productsCtx.fillStyle = '#1f2937';
        productsCtx.font = '14px Tajawal';
        productsCtx.textAlign = 'right';
        productsCtx.fillText(item.name, productsCanvas.width - 20, legendY + 15);
        
        legendY += 35;
    });
}

// إعادة رسم الرسوم البيانية عند تغيير حجم النافذة
window.addEventListener('resize', () => {
    drawChart();
    
    if (!document.getElementById('analytics-page').classList.contains('hidden')) {
        drawSalesChart();
        drawProductsChart();
    }
});

// زر تسجيل الخروج
document.querySelector('.logout-btn').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        alert('تم تسجيل الخروج بنجاح');
    }
});

/* ==========================================
   MODALS FUNCTIONS
   ========================================== */

// فتح modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // منع التمرير خلف الـ modal
    }
}

// إغلاق modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // السماح بالتمرير مرة أخرى
    }
}

// إغلاق الـ modal عند الضغط خارجه
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// معالجة استمارات الـ modals
document.addEventListener('DOMContentLoaded', () => {
    // معالج النموذج: إضافة مستخدم
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addUserForm);
            console.log('بيانات المستخدم الجديد:', Object.fromEntries(formData));
            alert('تم إضافة المستخدم بنجاح! ✓');
            addUserForm.reset();
            closeModal('addUserModal');
        });
    }
    
    // معالج النموذج: إضافة منتج
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            console.log('بيانات المنتج الجديد:', Object.fromEntries(formData));
            alert('تم إضافة المنتج بنجاح! ✓');
            addProductForm.reset();
            closeModal('addProductModal');
        });
    }
    
    // معالج النموذج: إضافة طلب
    const addOrderForm = document.getElementById('addOrderForm');
    if (addOrderForm) {
        addOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(addOrderForm);
            console.log('بيانات الطلب الجديد:', Object.fromEntries(formData));
            alert('تم إنشاء الطلب بنجاح! ✓');
            addOrderForm.reset();
            closeModal('addOrderModal');
        });
    }
});

// دالة لفتح modal تفاصيل الطلب
function openOrderDetails(orderNumber, customerName, productName, amount, status, date) {
    // ملء بيانات الطلب في الـ modal
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('orderCustomer').textContent = customerName;
    document.getElementById('orderProduct').textContent = productName;
    document.getElementById('orderAmount').textContent = amount;
    document.getElementById('orderStatus').textContent = status;
    document.getElementById('orderDate').textContent = date;
    
    // فتح الـ modal
    openModal('orderDetailsModal');
}