// Плавное появление элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        // Переключение меню по клику на гамбургер
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне навигации
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Анимация появления карточек остановок
    const stopCards = document.querySelectorAll('.stop-card');
    stopCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Интерактивность карты
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('click', () => {
            const stopNumber = point.getAttribute('data-stop');
            const targetStop = document.getElementById(`stop-${stopNumber}`);
            if (targetStop) {
                targetStop.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Подсветка карточки
                targetStop.style.background = '#fff9e6';
                setTimeout(() => {
                    targetStop.style.background = 'white';
                    targetStop.style.transition = 'background 1s ease';
                }, 2000);
            }
        });

        // Тултип при наведении на точку карты
        point.addEventListener('mouseenter', (e) => {
            const stopNumber = point.getAttribute('data-stop');
            const titles = [
                '', // 0
                'Красная Поляна',
                'Олимпийский парк', 
                'Сочи',
                'Гуамское ущелье',
                'Геленджик',
                'Новороссийск',
                'Абрау-Дюрсо',
                'Анапа',
                'Тамань',
                'Ейск',
                'Атамань',
                'Краснодар'
            ];
            
            // Создаём тултип
            const tooltip = document.createElement('div');
            tooltip.className = 'map-tooltip';
            tooltip.innerHTML = `
                <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.2rem;">Точка ${stopNumber}</div>
                <div style="font-size: 1.1rem; font-weight: 700;">${titles[parseInt(stopNumber)]}</div>
                <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.3rem;">Кликните для перехода</div>
            `;
            tooltip.style.cssText = `
                position: fixed;
                background: linear-gradient(135deg, #1a1a2e 0%, #2c3e50 100%);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-size: 0.9rem;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                max-width: 250px;
                border: 2px solid #DAA520;
            `;
            document.body.appendChild(tooltip);

            const updateTooltipPosition = (event) => {
                tooltip.style.left = (event.clientX + 15) + 'px';
                tooltip.style.top = (event.clientY + 15) + 'px';
            };

            updateTooltipPosition(e);
            point.addEventListener('mousemove', updateTooltipPosition);

            point.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Анимация счётчика в заголовке
    const animateNumber = (element, target, duration) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Прогресс чтения
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, #C41E3A, #DAA520);
            width: 0%;
            z-index: 999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    createProgressBar();

    // Кнопка "Наверх"
    const createScrollTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #C41E3A;
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.style.opacity = '1';
            } else {
                button.style.opacity = '0';
            }
        });
    };

    createScrollTopButton();

    // Плавающая кнопка "Назад к путеводителю"
    const createBackButton = () => {
        const button = document.createElement('a');
        button.href = 'krasnodar-guide.html';
        button.innerHTML = '📖';
        button.title = 'Вернуться к путеводителю';
        button.style.cssText = `
            position: fixed;
            bottom: 6rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1F4788;
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.background = '#2c5282';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.background = '#1F4788';
        });

        document.body.appendChild(button);
    };

    createBackButton();

    // Индикатор текущей остановки при прокрутке
    const updateCurrentStop = () => {
        const stops = document.querySelectorAll('.stop-card');
        const mapPoints = document.querySelectorAll('.map-point');

        window.addEventListener('scroll', () => {
            let currentStop = null;

            stops.forEach((stop, index) => {
                const rect = stop.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentStop = index;
                }
            });

            // Обновляем стили точек на карте
            mapPoints.forEach((point, index) => {
                const circle = point.querySelector('circle');
                if (index === currentStop) {
                    circle.style.filter = 'brightness(1.4) drop-shadow(0 0 10px #C41E3A)';
                } else {
                    circle.style.filter = '';
                }
            });
        });
    };

    updateCurrentStop();

    // Анимация линии маршрута при загрузке
    const routeLine = document.querySelector('.route-line');
    if (routeLine) {
        const length = routeLine.getTotalLength();
        routeLine.style.strokeDasharray = length;
        routeLine.style.strokeDashoffset = length;

        setTimeout(() => {
            routeLine.style.transition = 'stroke-dashoffset 3s ease-in-out';
            routeLine.style.strokeDashoffset = '0';
        }, 500);
    }

    // Эффект печатной машинки для заголовка (опционально)
    const typewriterEffect = (element, text, speed = 50) => {
        let i = 0;
        element.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    };

    // Копирование ссылки на остановку
    stopCards.forEach((card, index) => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '🔗 Поделиться';
        copyButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #e8f4f8;
            border: 1px solid #1F4788;
            border-radius: 20px;
            color: #1F4788;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s;
        `;

        copyButton.addEventListener('click', () => {
            const url = `${window.location.origin}${window.location.pathname}#stop-${index + 1}`;
            navigator.clipboard.writeText(url).then(() => {
                copyButton.textContent = '✓ Скопировано!';
                copyButton.style.background = '#d4f4dd';
                copyButton.style.borderColor = '#2d6a4f';
                copyButton.style.color = '#2d6a4f';
                setTimeout(() => {
                    copyButton.innerHTML = '🔗 Поделиться';
                    copyButton.style.background = '#e8f4f8';
                    copyButton.style.borderColor = '#1F4788';
                    copyButton.style.color = '#1F4788';
                }, 2000);
            });
        });

        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.transform = 'scale(1.05)';
        });

        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.transform = 'scale(1)';
        });

        card.querySelector('.stop-description').appendChild(copyButton);
    });
});

// Загрузка страницы
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});
