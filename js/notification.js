// Notification System
const notification = {
    show(message, type = 'success', duration = 3000) {
        // Tạo container nếu chưa tồn tại
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        // Tạo notification element
        const notifEl = document.createElement('div');
        notifEl.className = `notification notification-${type}`;
        
        // Icon map
        const icons = {
            'success': 'fa-circle-check',
            'error': 'fa-circle-xmark',
            'warning': 'fa-triangle-exclamation',
            'info': 'fa-circle-info'
        };
        
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };

        notifEl.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icons[type]}"></i>
                <span>${message}</span>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;

        notifEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            min-width: 300px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            border-left: 4px solid ${colors[type]};
        `;

        const contentEl = notifEl.querySelector('.notification-content');
        contentEl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            color: #333;
        `;

        const iconEl = contentEl.querySelector('i');
        iconEl.style.color = colors[type];
        iconEl.style.fontSize = '20px';

        const closeBtn = notifEl.querySelector('.notification-close');
        closeBtn.style.cssText = `
            cursor: pointer;
            color: #999;
            font-size: 18px;
            transition: color 0.2s;
        `;

        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.color = '#333';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.color = '#999';
        });

        closeBtn.addEventListener('click', () => {
            notifEl.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notifEl.remove(), 300);
        });

        container.appendChild(notifEl);
        setTimeout(() => {
            if (notifEl.parentNode) {
                notifEl.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notifEl.remove(), 300);
            }
        }, duration);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    warning(message) {
        this.show(message, 'warning');
    },

    info(message) {
        this.show(message, 'info');
    }
};

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    #notification-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        pointer-events: none;
        z-index: 9999;
    }

    #notification-container .notification {
        pointer-events: auto;
    }

    @media (max-width: 768px) {
        .notification {
            min-width: auto !important;
            max-width: 90vw !important;
            right: 10px !important;
            left: 10px !important;
        }
    }
`;
document.head.appendChild(style);
