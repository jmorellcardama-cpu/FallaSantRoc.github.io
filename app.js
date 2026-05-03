// Fictitious Data

const data = {
    truc: {
        parejas: [
            { id: 1, name: "Javi-Javi", members: ["Javi Morell", "Javi Morell"] }
        ],
        calendario: [
            { date: "2026-05-01", team1: "Javi-Javi", team2: "Pareja de Prueba 1", result: "2 - 0" },
            { date: "2026-05-02", team1: "Pareja de Prueba 2", team2: "Javi-Javi", result: "2 - 1" },
            { date: "2026-09-15", team1: "Pareja 1", team2: "Pareja 2", result: "2 - 1" },
            { date: "2026-10-22", team1: "Pareja 3", team2: "Pareja 4", result: "0 - 2" },
            { date: "2026-10-29", team1: "Pareja 1", team2: "Pareja 3", result: "Pendiente" },
            { date: "2026-11-05", team1: "Pareja 2", team2: "Pareja 4", result: "Pendiente" }
        ],
        clasificacion: [
            { pos: 1, name: "Javi-Javi", pj: 0, g: 0, p: 0, pts: 0 }
        ],
        eliminatorias: [
            { title: "Cuartos de Final", team1: "1º Clasificado", score1: "-", team2: "8º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "4º Clasificado", score1: "-", team2: "5º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "2º Clasificado", score1: "-", team2: "7º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "3º Clasificado", score1: "-", team2: "6º Clasificado", score2: "-", winner: null }
        ]
    },
    parchis: {
        parejas: [
            { id: 1, name: "Ana-Ana", members: ["Ana Tormo", "Ana Tormo"] }
        ],
        calendario: [
            { date: "2026-05-07", time: "19:00", team1: "Ana-Ana", team2: "Javi-Javi", result: "Pendiente" },
            { date: "2026-09-16", team1: "Las Reinas", team2: "Dados Locos", result: "1 - 0" },
            { date: "2026-10-23", team1: "Cometodo", team2: "Fuego", result: "1 - 0" },
            { date: "2026-10-30", team1: "Las Reinas", team2: "Cometodo", result: "Pendiente" },
            { date: "2026-12-05", team1: "Fuego", team2: "Dados Locos", result: "Pendiente" }
        ],
        clasificacion: [],
        eliminatorias: [
            { title: "Cuartos de Final", team1: "1º Clasificado", score1: "-", team2: "8º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "4º Clasificado", score1: "-", team2: "5º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "2º Clasificado", score1: "-", team2: "7º Clasificado", score2: "-", winner: null },
            { title: "Cuartos de Final", team1: "3º Clasificado", score1: "-", team2: "6º Clasificado", score2: "-", winner: null }
        ]
    }
};

let currentGame = 'truc';

// Calendar State
const today = new Date();
let currentMonth = today.getMonth(); // Mes actual (0-indexed)
let currentYear = today.getFullYear(); // Año actual
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// DOM Elements
const gameTabs = document.querySelectorAll('.game-tab');
const navLinks = document.querySelectorAll('.nav-link');
const mobileBtn = document.querySelector('.mobile-menu-btn');

const parejasGrid = document.getElementById('parejas-grid');
const clasificacionBody = document.getElementById('clasificacion-body');
const playoffBracket = document.getElementById('playoff-bracket');

// Calendar DOM Elements
const calendarGrid = document.getElementById('calendar-grid');
const calendarMonthYear = document.getElementById('calendar-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const selectedDateTitle = document.getElementById('selected-date-title');
const selectedDayMatches = document.getElementById('selected-day-matches');

// Initialize App
function init() {
    setupEventListeners();
    renderData();
}

function setupEventListeners() {
    // Calendar Navigation
    if(prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if(currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendario();
        });
    }
    if(nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if(currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendario();
        });
    }

    // Game Tab Switching
    gameTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            gameTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentGame = e.currentTarget.dataset.game;
            renderData();
        });
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Eliminamos e.preventDefault() para que ancle y haga scroll
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Mobile Menu
    if(mobileBtn) {
        const navList = document.querySelector('.nav-links');
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('mobile-active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('mobile-active');
            });
        });
    }
}

function renderData() {
    renderParejas();
    renderCalendario();
    renderClasificacion();
    renderEliminatorias();
}

function renderParejas() {
    const parejas = data[currentGame].parejas;
    parejasGrid.innerHTML = parejas.map(p => `
        <div class="card" data-team="${p.name}">
            <h3 class="card-title">${p.name}</h3>
            <div class="card-members">
                <span>👤 ${p.members[0]}</span>
                <span>👤 ${p.members[1]}</span>
            </div>
        </div>
    `).join('');
    
    // Hide detail panel when switching games
    const teamDetail = document.getElementById('team-detail');
    teamDetail.style.display = 'none';
    
    // Add click handlers
    document.querySelectorAll('.card[data-team]').forEach(card => {
        card.addEventListener('click', () => {
            const teamName = card.dataset.team;
            
            // Toggle active card
            document.querySelectorAll('.card').forEach(c => c.classList.remove('card-active'));
            
            if (teamDetail.style.display === 'block' && teamDetail.dataset.currentTeam === teamName) {
                teamDetail.style.display = 'none';
                return;
            }
            
            card.classList.add('card-active');
            teamDetail.dataset.currentTeam = teamName;
            renderTeamDetail(teamName);
        });
    });
}

function renderTeamDetail(teamName) {
    const teamDetail = document.getElementById('team-detail');
    const teamDetailTitle = document.getElementById('team-detail-title');
    const teamDetailMatches = document.getElementById('team-detail-matches');
    
    const gameData = data[currentGame];
    const matches = gameData.calendario.filter(m => m.team1 === teamName || m.team2 === teamName);
    
    // Calculate stats
    let played = 0, won = 0, lost = 0, pending = 0;
    matches.forEach(m => {
        if (m.result.toLowerCase() === 'pendiente') {
            pending++;
        } else {
            played++;
            const parts = m.result.split('-').map(s => parseInt(s.trim()));
            if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                const isTeam1 = m.team1 === teamName;
                if ((isTeam1 && parts[0] > parts[1]) || (!isTeam1 && parts[1] > parts[0])) {
                    won++;
                } else {
                    lost++;
                }
            }
        }
    });
    
    teamDetailTitle.textContent = `Partidas de ${teamName}`;
    
    let html = `
        <div class="team-detail-stats">
            <div class="stat-box">
                <span class="stat-number">${played}</span>
                <span class="stat-label">Jugadas</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${won}</span>
                <span class="stat-label">Ganadas</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${lost}</span>
                <span class="stat-label">Perdidas</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${pending}</span>
                <span class="stat-label">Pendientes</span>
            </div>
        </div>
    `;
    
    if (matches.length === 0) {
        html += '<p class="empty-state">No hay partidas registradas para esta pareja.</p>';
    } else {
        html += `
        <div class="table-container">
            <table class="standings-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Rival</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    ${matches.map(m => {
                        const isPending = m.result.toLowerCase() === 'pendiente';
                        const [y, mo, d] = m.date.split('-');
                        const rival = m.team1 === teamName ? m.team2 : m.team1;
                        
                        let matchClass = '';
                        if (!isPending) {
                            const parts = m.result.split('-').map(s => parseInt(s.trim()));
                            if (!isNaN(parts[0]) && !isNaN(parts[1])) {
                                const isTeam1 = m.team1 === teamName;
                                if ((isTeam1 && parts[0] > parts[1]) || (!isTeam1 && parts[1] > parts[0])) {
                                    matchClass = 'match-win-opaque';
                                } else {
                                    matchClass = 'match-loss-opaque';
                                }
                            }
                        }
                        
                        return `
                        <tr class="${matchClass}">
                            <td>${parseInt(d)} ${monthNames[parseInt(mo)-1].substring(0,3)} ${m.time ? `<br><small>${m.time}</small>` : ''}</td>
                            <td class="team-name">${rival}</td>
                            <td class="points ${isPending ? 'pending' : ''}">${m.result}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        `;
    }
    
    teamDetailMatches.innerHTML = html;
    teamDetail.style.display = 'block';
    teamDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderCalendario() {
    calendarMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const dayNames = `
        <div class="cal-day-name">L</div>
        <div class="cal-day-name">M</div>
        <div class="cal-day-name">X</div>
        <div class="cal-day-name">J</div>
        <div class="cal-day-name">V</div>
        <div class="cal-day-name">S</div>
        <div class="cal-day-name">D</div>
    `;
    
    let html = dayNames;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for(let i = 0; i < startOffset; i++) {
        html += `<div class="cal-day empty"></div>`;
    }
    
    for(let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        const hasTruc = data.truc.calendario.some(p => p.date === dateStr);
        const hasParchis = data.parchis.calendario.some(p => p.date === dateStr);
        
        let dotsHtml = '';
        if(hasTruc || hasParchis) {
            dotsHtml = `<div class="cal-dots">
                ${hasTruc ? '<div class="cal-dot dot-truc"></div>' : ''}
                ${hasParchis ? '<div class="cal-dot dot-parchis"></div>' : ''}
            </div>`;
        }
        
        const isToday = (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear());
        
        html += `
            <div class="cal-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                ${d}
                ${dotsHtml}
            </div>
        `;
    }
    
    calendarGrid.innerHTML = html;
    
    document.querySelectorAll('.cal-day:not(.empty)').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('active'));
            dayEl.classList.add('active');
            renderMatchesForDate(dayEl.dataset.date);
        });
    });
    
    selectedDateTitle.textContent = 'Selecciona un día';
    selectedDayMatches.innerHTML = '<p class="empty-state">No hay partidas programadas para hoy.</p>';
}

function renderMatchesForDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    selectedDateTitle.textContent = `Partidas del ${d} de ${monthNames[parseInt(m)-1]}`;
    
    const trucMatches = data.truc.calendario.filter(p => p.date === dateStr);
    const parchisMatches = data.parchis.calendario.filter(p => p.date === dateStr);
    
    let html = '';
    
    if(trucMatches.length === 0 && parchisMatches.length === 0) {
        html = '<p class="empty-state">No hay partidas programadas para hoy.</p>';
    } else {
        const buildMatchHtml = (matches, gameIcon) => matches.map(p => {
            const isPending = p.result.toLowerCase() === 'pendiente';
            return `
            <div class="match-item">
                <div class="match-date">
                    <span class="day" style="font-size: 2rem;">${gameIcon}</span>
                    ${p.time ? `<span class="month">${p.time}</span>` : ''}
                </div>
                <div class="match-teams">
                    <span class="team">${p.team1}</span>
                    <span class="vs">VS</span>
                    <span class="team">${p.team2}</span>
                </div>
                <div class="match-result ${isPending ? 'pending' : ''}">
                    ${p.result}
                </div>
            </div>
            `;
        }).join('');
        
        html += buildMatchHtml(trucMatches, '⚔️');
        html += buildMatchHtml(parchisMatches, '🎲');
    }
    
    selectedDayMatches.innerHTML = html;
}

function renderClasificacion() {
    // Calcular clasificación automáticamente desde los resultados del calendario
    // REGLAS DE PUNTUACIÓN:
    // Truc:   2-0 → ganador 3 pts | 2-1 → ganador 2 pts, perdedor 1 pt
    // Parchís: ganador 3 pts, perdedor 0 pts
    
    const gameData = data[currentGame];
    const teams = {};
    
    // Inicializar todas las parejas inscritas con 0 puntos
    gameData.parejas.forEach(p => {
        teams[p.name] = { pj: 0, g: 0, p: 0, pts: 0 };
    });
    
    // Recorrer el calendario y calcular puntos
    gameData.calendario.forEach(match => {
        if (match.result.toLowerCase() === 'pendiente') return;
        
        const parts = match.result.split('-').map(s => parseInt(s.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
        
        const score1 = parts[0];
        const score2 = parts[1];
        
        // Asegurar que ambos equipos existen en el mapa
        if (!teams[match.team1]) teams[match.team1] = { pj: 0, g: 0, p: 0, pts: 0 };
        if (!teams[match.team2]) teams[match.team2] = { pj: 0, g: 0, p: 0, pts: 0 };
        
        teams[match.team1].pj++;
        teams[match.team2].pj++;
        
        if (currentGame === 'truc') {
            // Truc: resultado es X-Y (ej. 2-0 o 2-1)
            if (score1 > score2) {
                teams[match.team1].g++;
                teams[match.team2].p++;
                if (score2 === 0) {
                    teams[match.team1].pts += 3; // 2-0: 3 pts ganador
                } else {
                    teams[match.team1].pts += 2; // 2-1: 2 pts ganador
                    teams[match.team2].pts += 1; // 2-1: 1 pt perdedor
                }
            } else {
                teams[match.team2].g++;
                teams[match.team1].p++;
                if (score1 === 0) {
                    teams[match.team2].pts += 3; // 0-2: 3 pts ganador
                } else {
                    teams[match.team2].pts += 2; // 1-2: 2 pts ganador
                    teams[match.team1].pts += 1; // 1-2: 1 pt perdedor
                }
            }
        } else {
            // Parchís: 3 pts al ganador
            if (score1 > score2) {
                teams[match.team1].g++;
                teams[match.team2].p++;
                teams[match.team1].pts += 3;
            } else {
                teams[match.team2].g++;
                teams[match.team1].p++;
                teams[match.team2].pts += 3;
            }
        }
    });
    
    // Ordenar por puntos (descendente)
    const sorted = Object.entries(teams)
        .map(([name, stats], i) => ({ name, ...stats }))
        .sort((a, b) => b.pts - a.pts || b.g - a.g || a.p - b.p);
    
    clasificacionBody.innerHTML = sorted.map((c, i) => {
        const pos = i + 1;
        let posClass = '';
        if (pos === 1) posClass = 'pos-1';
        else if (pos === 2) posClass = 'pos-2';
        else if (pos === 3) posClass = 'pos-3';

        return `
        <tr class="${pos <= 8 ? 'qualified' : ''}">
            <td class="pos ${posClass}">${pos}</td>
            <td class="team-name">${c.name}</td>
            <td>${c.pj}</td>
            <td>${c.g}</td>
            <td>${c.p}</td>
            <td class="points">${c.pts}</td>
        </tr>
        `;
    }).join('');
}

function renderEliminatorias() {
    const eliminatorias = data[currentGame].eliminatorias;
    playoffBracket.innerHTML = eliminatorias.map(e => `
        <div class="bracket-match">
            <div class="bracket-match-title">${e.title}</div>
            <div class="bracket-team ${e.winner === 1 ? 'winner' : ''}">
                <span class="bracket-team-name">${e.team1}</span>
                <span class="bracket-team-score">${e.score1}</span>
            </div>
            <div class="bracket-team ${e.winner === 2 ? 'winner' : ''}">
                <span class="bracket-team-name">${e.team2}</span>
                <span class="bracket-team-score">${e.score2}</span>
            </div>
        </div>
    `).join('');
}

// Start app
document.addEventListener('DOMContentLoaded', init);
