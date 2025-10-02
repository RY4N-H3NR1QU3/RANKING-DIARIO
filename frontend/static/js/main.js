function showView(viewId) {
    // Esconder todas as views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    // Mostrar a view selecionada
    document.getElementById(viewId).classList.add('active');

    // Atualizar o botão ativo
    const buttons = document.querySelectorAll('.nav-link');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Adicionar classe ativa ao botão clicado
    event.target.classList.add('active');
}

function showTeamDetail(teamColor) {
    // Esconder todos os detalhes das equipes
    const details = document.querySelectorAll('.team-detail');
    details.forEach(detail => {
        detail.classList.remove('active');
    });

    // Mostrar o detalhe da equipe selecionada
    document.getElementById(teamColor + '-detail').classList.add('active');

    // Atualizar o item ativo do menu
    const menuItems = document.querySelectorAll('.team-menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Adicionar classe ativa ao item clicado
    event.target.classList.add('active');
}





// JAVASCRIPT PARA DIMENSIONAMENTO

// Dados das equipes
const teamsData = {
    yellow: {
        name: 'EQUIPE YELLOW',
        supervisor: 'NATHÁLIA VASCONCELOS',
        color: '#f1c40f',
        consultants: [
            'PAULO HENRIQUE RODRIGUES MENDES',
            'IVONILCE TEIXEIRA CARVALHO',
            'LUCIANA APARECIDA DA SILVA SOUZA COSTA'
        ]
    },
    pink: {
        name: 'EQUIPE PINK',
        supervisor: 'ANA LILIAN',
        color: '#e91e63',
        consultants: [
            'FLÁVIO AUGUSTO DA C. SOUZA',
            'LUCAS LOBO SARMANHO',
            'JOÃO VICTOR DE SOUZA OLIVEIRA'
        ]
    },
    red: {
        name: 'EQUIPE RED',
        supervisor: 'DÉBORA LARISSA',
        color: '#e74c3c',
        consultants: [
            'CARLOS MACIEL RODRIGUES SOARES',
            'FABIENNE PRICILA LOPES DOS SANTOS ARAUJO'
        ]
    },
    green: {
        name: 'EQUIPE GREEN',
        supervisor: 'AYRTON MENEZES',
        color: '#27ae60',
        consultants: [
            'SHERISTON GOMES DE LIMA'
        ]
    },
    blue: {
        name: 'EQUIPE BLUE',
        supervisor: 'DEBORA DE PAULA',
        color: '#3498db',
        consultants: [
            'RAYANE GARCIA VALENTIM',
            'DANIELLE DE QUEIROZ FONSECA'
        ]
    }
};

let currentTeam = 'yellow';

document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    selectTeam('yellow');
});

function selectTeam(teamId) {
    currentTeam = teamId;
    
    // Atualizar botões do menu
    document.querySelectorAll('.team-menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-team="${teamId}"]`).classList.add('active');
    
    // Atualizar cabeçalho da equipe
    const team = teamsData[teamId];
    document.getElementById('team-name').textContent = team.name;
    document.getElementById('team-supervisor').textContent = `ASSIST. SUPERVISÃO - ${team.supervisor}`;
    document.getElementById('team-color').style.backgroundColor = team.color;
    document.getElementById('consultant-count').textContent = `${team.consultants.length} consultores`;
    
    // Atualizar lista de consultores
    updateTeamConsultantsList(teamId);
    
    // Atualizar data-team da drop zone
    document.getElementById('team-consultants').dataset.team = teamId;
}

function updateTeamConsultantsList(teamId) {
    const team = teamsData[teamId];
    const container = document.getElementById('team-consultants');
    
    container.innerHTML = '';
    
    team.consultants.forEach(consultant => {
        const item = document.createElement('div');
        item.className = 'consultant-team-item';
        
        const initials = consultant.split(' ').map(word => word.charAt(0)).join('').substring(0, 2);
        
        item.innerHTML = `
            <div class="consultant-avatar">${initials}</div>
            <span class="consultant-name">${consultant}</span>
            <button class="btn-remove-team" onclick="removeFromTeam(this, '${consultant}')">Remover</button>
        `;
        
        container.appendChild(item);
    });
}





function toggleModernAddForm() {
    const form = document.getElementById('floating-form');
    const input = document.getElementById('modern-consultant-input');
    
    form.classList.toggle('active');
    
    if (form.classList.contains('active')) {
        input.focus();
    } else {
        input.value = '';
    }
}


function addModernConsultant() {
    const input = document.getElementById('modern-consultant-input');
    const name = input.value.trim();
    
    if (name) {
        addToAvailableList(name);  // agora passa o nome correto
        input.value = '';
        toggleModernAddForm();
    }
}







function addToAvailableList(name) {
    const container = document.querySelector('.available-list');
    const item = document.createElement('div');
    item.className = 'consultant-available-item';
    item.draggable = true;
    item.dataset.consultant = name;
    
    item.innerHTML = `
        <span class="consultant-name">${name}</span>
        <button class="btn-remove-available" onclick="removeAvailableConsultant(this)">×</button>
    `;
    
    container.appendChild(item);
    setupDragForElement(item);
}

function removeAvailableConsultant(button) {
    button.closest('.consultant-available-item').remove();
}

function removeFromTeam(button, consultantName) {
    // Remover da equipe atual
    const teamConsultants = teamsData[currentTeam].consultants;
    const index = teamConsultants.indexOf(consultantName);
    if (index > -1) {
        teamConsultants.splice(index, 1);
    }
    
    // Atualizar interface
    updateTeamConsultantsList(currentTeam);
    updateTeamCount(currentTeam);
    
    // Adicionar de volta à lista de disponíveis
    addToAvailableList(consultantName);
}

function updateTeamCount(teamId) {
    const count = teamsData[teamId].consultants.length;
    document.getElementById(`count-${teamId}`).textContent = count;
    
    if (teamId === currentTeam) {
        document.getElementById('consultant-count').textContent = `${count} consultores`;
    }
}

// Drag and Drop
function setupDragAndDrop() {
    // Setup para elementos existentes
    document.querySelectorAll('.consultant-available-item').forEach(setupDragForElement);
    
    // Setup para drop zones
    const teamConsultants = document.getElementById('team-consultants');
    const dropArea = document.getElementById('drop-area');
    
    [teamConsultants, dropArea].forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function setupDragForElement(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.consultant);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const consultantName = e.dataTransfer.getData('text/plain');
    const draggedElement = document.querySelector(`[data-consultant="${consultantName}"]`);
    
    if (draggedElement && currentTeam) {
        // Adicionar à equipe atual
        teamsData[currentTeam].consultants.push(consultantName);
        
        // Remover da lista de disponíveis
        draggedElement.remove();
        
        // Atualizar interface
        updateTeamConsultantsList(currentTeam);
        updateTeamCount(currentTeam);
    }
}



