// ============================================
// STATE MANAGEMENT
// ============================================

const APP_STATE = {
  tactics: [],
  currentTacticId: null,
  editorState: 'saved', // created, saving, saved, publishing, published
  originalContent: '',
  hasUnsavedChanges: false,
  snackbarQueue: [],
  pendingActivation: null,
  editingTacticId: null, // For table edit modal
  removingTacticId: null, // For table remove modal
  dataVersion: 10, // Increment to reset localStorage - added more tactics for scrolling
  // Filter state
  filters: {
    status: 'all', // all, active, inactive
    publishing: 'all', // all, up-to-date, modified, draft
    industry: '', // empty or industry name
    bestPractices: 'all', // all, none
    linkedObjectives: 'all' // all, none
  },
  isFilterPanelOpen: false,
  // Sorting state
  sorting: {
    column: null, // active, bestPractices, linkedObjectives
    direction: null // 'asc' or 'desc'
  }
};

// Initialize state from localStorage or use mock data
function initializeState() {
  const urlParams = new URLSearchParams(window.location.search);
  const forceClear = urlParams.get('clear') === 'true';
  
  const savedVersion = localStorage.getItem('butler_data_version');
  const savedTactics = localStorage.getItem('butler_tactics');
  
  // Reset if version mismatch, no data, or force clear
  if (forceClear || savedVersion !== String(APP_STATE.dataVersion) || !savedTactics) {
    localStorage.removeItem('butler_tactics');
    localStorage.removeItem('butler_data_version');
    APP_STATE.tactics = [...TACTICS_DATA];
    saveTacticsToStorage();
    localStorage.setItem('butler_data_version', String(APP_STATE.dataVersion));
  } else {
    APP_STATE.tactics = JSON.parse(savedTactics);
  }
  
  // Get current tactic ID from URL (reusing urlParams from above)
  APP_STATE.currentTacticId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
}

function saveTacticsToStorage() {
  localStorage.setItem('butler_tactics', JSON.stringify(APP_STATE.tactics));
}

function getCurrentTactic() {
  return APP_STATE.tactics.find(t => t.id === APP_STATE.currentTacticId);
}

function updateTactic(id, updates) {
  const index = APP_STATE.tactics.findIndex(t => t.id === id);
  if (index !== -1) {
    APP_STATE.tactics[index] = { ...APP_STATE.tactics[index], ...updates };
    saveTacticsToStorage();
  }
}

// ============================================
// NAVIGATION
// ============================================

function toggleNavGroup(groupId) {
  const group = document.getElementById(groupId);
  if (group) {
    group.classList.toggle('expanded');
  }
}

function toggleNavSection(sectionEl) {
  sectionEl.classList.toggle('collapsed');
}

// ============================================
// SNACKBAR
// ============================================

function showSnackbar(message, type = 'success') {
  const container = document.getElementById('snackbarContainer');
  const snackbar = document.createElement('div');
  snackbar.className = `snackbar ${type}`;
  snackbar.innerHTML = `<span class="snackbar-message">${message}</span>`;
  container.appendChild(snackbar);
  
  setTimeout(() => {
    snackbar.classList.add('out');
    setTimeout(() => snackbar.remove(), 300);
  }, 4000);
}

// ============================================
// MODAL HANDLING
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.style.overflow = '';
}

// ============================================
// DROPDOWN HANDLING
// ============================================

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
}

// ============================================
// TABLE PAGE FUNCTIONS
// ============================================

function renderTacticsTable() {
  const tbody = document.getElementById('tacticsTableBody');
  if (!tbody) return;
  
  // Get filtered tactics
  const filteredTactics = getFilteredTactics();
  
  tbody.innerHTML = filteredTactics.map(tactic => {
    const statusBadge = getStatusBadge(tactic.status);
    // Status dot: green for active (and published), red for inactive
    const dotClass = tactic.active ? 'active' : 'inactive';
    const linkedObjectives = tactic.linkedObjectivesCount !== null ? tactic.linkedObjectivesCount : '—';
    
    return `
      <tr data-id="${tactic.id}" onclick="openTactic(${tactic.id})">
        <td>
          <div class="table-cell-name">
            <span class="status-dot ${dotClass}"></span>
            <a href="editor.html?id=${tactic.id}" onclick="event.stopPropagation()" title="${tactic.name}">${tactic.name}</a>
            ${statusBadge}
            <span class="row-actions">
              <button type="button" class="row-action-btn" onclick="event.stopPropagation(); openTableEditModal(${tactic.id})" title="Edit">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3861 2.43934C13.8003 1.85355 12.8505 1.85355 12.2647 2.43934L10.7071 3.99698L13 6.28987L14.5576 4.73223C15.1434 4.14645 15.1434 3.1967 14.5576 2.61091L14.3861 2.43934ZM12.2929 6.99698L10 4.70409L3 11.7041L3 13.997L5.29289 13.997L12.2929 6.99698ZM11.5576 1.73223C12.5339 0.755923 14.1169 0.755922 15.0932 1.73223L15.2647 1.90381C16.2411 2.88012 16.2411 4.46303 15.2647 5.43934L5.70711 14.997L2 14.997L2 11.2899L11.5576 1.73223ZM17 16.997H1V15.997H17V16.997Z" fill="currentColor"/>
                </svg>
              </button>
              <button type="button" class="row-action-btn danger" onclick="event.stopPropagation(); openTableRemoveModal(${tactic.id})" title="Delete">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.999 2H5.99902V1H11.999V2ZM3.99902 4H1.99902V3H15.999V4H13.9995V14.5C13.9995 15.8807 12.8802 17 11.4995 17H6.49902C5.11831 17 3.99902 15.8807 3.99902 14.5V4ZM4.99902 4V14.5C4.99902 15.3284 5.6706 16 6.49902 16H11.4995C12.3279 16 12.9995 15.3284 12.9995 14.5V4H4.99902ZM6.99902 14V6H7.99902V14H6.99902ZM9.99902 14V6H10.999V14H9.99902Z" fill="currentColor"/>
                </svg>
              </button>
            </span>
          </div>
        </td>
        <td>
          <label class="toggle" onclick="event.stopPropagation()">
            <input type="checkbox" class="toggle-input" ${tactic.active ? 'checked' : ''} onchange="toggleTacticActive(${tactic.id}, this.checked)">
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
          </label>
        </td>
        <td class="table-cell-number">${tactic.bestPracticesCount}</td>
        <td class="table-cell-number">${linkedObjectives}</td>
        <td>
          <div class="table-cell-labels">
            ${tactic.suggestedIndustry.map(label => `<span class="label-chip">${label}</span>`).join('')}
          </div>
        </td>
        <td>
          <div class="table-cell-modified">
            <span class="modified-name">${tactic.lastEditBy}</span>
            <span class="modified-date">${tactic.lastEditDate}</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadge(status) {
  switch (status) {
    case 'draft':
      return '<span class="badge badge-draft">DRAFT</span>';
    case 'modified':
      return '<span class="badge badge-modified">MODIFIED</span>';
    default:
      return '';
  }
}

function openTactic(id) {
  window.location.href = `editor.html?id=${id}`;
}

function toggleTacticActive(id, active) {
  const tactic = APP_STATE.tactics.find(t => t.id === id);
  if (!tactic) return;
  
  // If trying to activate a DRAFT tactic only, show modal
  // Modified tactics can be activated without publishing first
  if (active && tactic.status === 'draft') {
    APP_STATE.pendingActivation = id;
    openModal('publishModal');
    // Uncheck the toggle since we can't activate yet
    const checkbox = document.querySelector(`tr[data-id="${id}"] .toggle-input`);
    if (checkbox) checkbox.checked = false;
    return;
  }
  
  updateTactic(id, { active });
  // Update status dot - green for active, red for inactive
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    const dot = row.querySelector('.status-dot');
    if (dot) {
      dot.classList.remove('active', 'inactive');
      dot.classList.add(active ? 'active' : 'inactive');
    }
  }
  showSnackbar(active ? 'Tactic activated' : 'Tactic deactivated');
}

// ============================================
// TABLE ROW ACTIONS (Edit/Remove from hover)
// ============================================

function openTableEditModal(id) {
  const tactic = APP_STATE.tactics.find(t => t.id === id);
  if (!tactic) return;
  
  // Store the tactic ID for saving
  APP_STATE.editingTacticId = id;
  
  // Populate the form fields
  const nameInput = document.getElementById('tableEditTacticName');
  const industriesSelect = document.getElementById('tableEditTacticIndustries');
  const summaryTextarea = document.getElementById('tableEditTacticSummary');
  
  if (nameInput) nameInput.value = tactic.name;
  if (industriesSelect) industriesSelect.value = tactic.suggestedIndustry[0] || '';
  if (summaryTextarea) summaryTextarea.value = tactic.summary || '';
  
  openModal('tableEditTacticModal');
}

function saveTableEditModal() {
  const tacticId = APP_STATE.editingTacticId;
  const tactic = APP_STATE.tactics.find(t => t.id === tacticId);
  if (!tactic) return;
  
  const nameInput = document.getElementById('tableEditTacticName');
  const industriesSelect = document.getElementById('tableEditTacticIndustries');
  const summaryTextarea = document.getElementById('tableEditTacticSummary');
  
  const newName = nameInput ? nameInput.value.trim() : tactic.name;
  const newIndustry = industriesSelect ? industriesSelect.value : tactic.suggestedIndustry[0];
  const newSummary = summaryTextarea ? summaryTextarea.value.trim() : tactic.summary;
  
  if (!newName) {
    showSnackbar('Tactic name is required', 'error');
    return;
  }
  
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // If published, change to modified
  const newStatus = tactic.status === 'published' ? 'modified' : tactic.status;
  
  updateTactic(tacticId, {
    name: newName,
    suggestedIndustry: [newIndustry, ...tactic.suggestedIndustry.slice(1)],
    summary: newSummary,
    status: newStatus,
    lastEditDate: formattedDate
  });
  
  closeModal('tableEditTacticModal');
  showSnackbar('Tactic updated successfully');
  renderTacticsTable();
  
  APP_STATE.editingTacticId = null;
}

function openTableRemoveModal(id) {
  APP_STATE.removingTacticId = id;
  openModal('tableRemoveModal');
}

function confirmTableRemove() {
  const tacticId = APP_STATE.removingTacticId;
  APP_STATE.tactics = APP_STATE.tactics.filter(t => t.id !== tacticId);
  saveTacticsToStorage();
  
  closeModal('tableRemoveModal');
  showSnackbar('Tactic removed');
  renderTacticsTable();
  
  APP_STATE.removingTacticId = null;
}

// ============================================
// FILTER SIDEPANEL
// ============================================

function openFilterSidepanel() {
  const sidepanel = document.getElementById('filterSidepanel');
  const overlay = document.getElementById('filterOverlay');
  
  if (sidepanel && overlay) {
    sidepanel.classList.add('open');
    overlay.classList.add('open');
    APP_STATE.isFilterPanelOpen = true;
    
    // Sync form with current filter state
    syncFilterFormWithState();
  }
}

function closeFilterSidepanel() {
  const sidepanel = document.getElementById('filterSidepanel');
  const overlay = document.getElementById('filterOverlay');
  
  if (sidepanel && overlay) {
    sidepanel.classList.remove('open');
    overlay.classList.remove('open');
    APP_STATE.isFilterPanelOpen = false;
  }
}

function syncFilterFormWithState() {
  // Status
  const statusRadio = document.querySelector(`input[name="filterStatus"][value="${APP_STATE.filters.status}"]`);
  if (statusRadio) statusRadio.checked = true;
  
  // Publishing
  const publishingRadio = document.querySelector(`input[name="filterPublishing"][value="${APP_STATE.filters.publishing}"]`);
  if (publishingRadio) publishingRadio.checked = true;
  
  // Industry
  const industrySelect = document.getElementById('filterIndustry');
  if (industrySelect) industrySelect.value = APP_STATE.filters.industry;
  
  // Best practices
  const bpRadio = document.querySelector(`input[name="filterBestPractices"][value="${APP_STATE.filters.bestPractices}"]`);
  if (bpRadio) bpRadio.checked = true;
  
  // Linked objectives
  const loRadio = document.querySelector(`input[name="filterLinkedObjectives"][value="${APP_STATE.filters.linkedObjectives}"]`);
  if (loRadio) loRadio.checked = true;
  
  // Update reset button visibility
  updateResetButtonVisibility();
}

function updateResetButtonVisibility() {
  const resetBtn = document.getElementById('filterReset');
  if (!resetBtn) return;
  
  // Check form values (not state) to see if any filter is changed from default
  const statusRadio = document.querySelector('input[name="filterStatus"]:checked');
  const publishingRadio = document.querySelector('input[name="filterPublishing"]:checked');
  const industrySelect = document.getElementById('filterIndustry');
  const bpRadio = document.querySelector('input[name="filterBestPractices"]:checked');
  const loRadio = document.querySelector('input[name="filterLinkedObjectives"]:checked');
  
  const hasChanges = 
    (statusRadio && statusRadio.value !== 'all') ||
    (publishingRadio && publishingRadio.value !== 'all') ||
    (industrySelect && industrySelect.value !== '') ||
    (bpRadio && bpRadio.value !== 'all') ||
    (loRadio && loRadio.value !== 'all');
  
  if (hasChanges) {
    resetBtn.classList.add('visible');
  } else {
    resetBtn.classList.remove('visible');
  }
}

function applyFilters() {
  // Read values from form
  const statusRadio = document.querySelector('input[name="filterStatus"]:checked');
  const publishingRadio = document.querySelector('input[name="filterPublishing"]:checked');
  const industrySelect = document.getElementById('filterIndustry');
  const bpRadio = document.querySelector('input[name="filterBestPractices"]:checked');
  const loRadio = document.querySelector('input[name="filterLinkedObjectives"]:checked');
  
  APP_STATE.filters.status = statusRadio ? statusRadio.value : 'all';
  APP_STATE.filters.publishing = publishingRadio ? publishingRadio.value : 'all';
  APP_STATE.filters.industry = industrySelect ? industrySelect.value : '';
  APP_STATE.filters.bestPractices = bpRadio ? bpRadio.value : 'all';
  APP_STATE.filters.linkedObjectives = loRadio ? loRadio.value : 'all';
  
  // Update filter button state
  updateFilterButtonState();
  
  // Re-render table with filters
  renderTacticsTable();
  
  // Close sidepanel
  closeFilterSidepanel();
  
  // Show snackbar
  const activeFilterCount = getActiveFilterCount();
  if (activeFilterCount > 0) {
    showSnackbar(`${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`);
  }
}

function resetFilters() {
  // Reset all form controls to default (but don't apply yet - user must click "Filter tactics")
  document.querySelectorAll('input[name="filterStatus"][value="all"]').forEach(r => r.checked = true);
  document.querySelectorAll('input[name="filterPublishing"][value="all"]').forEach(r => r.checked = true);
  document.querySelectorAll('input[name="filterBestPractices"][value="all"]').forEach(r => r.checked = true);
  document.querySelectorAll('input[name="filterLinkedObjectives"][value="all"]').forEach(r => r.checked = true);
  
  // Reset industry select
  const industrySelect = document.getElementById('filterIndustry');
  if (industrySelect) industrySelect.value = '';
  
  // Update reset button visibility (should hide since form is now at defaults)
  updateResetButtonVisibility();
}

function getActiveFilterCount() {
  let count = 0;
  if (APP_STATE.filters.status !== 'all') count++;
  if (APP_STATE.filters.publishing !== 'all') count++;
  if (APP_STATE.filters.industry !== '') count++;
  if (APP_STATE.filters.bestPractices !== 'all') count++;
  if (APP_STATE.filters.linkedObjectives !== 'all') count++;
  return count;
}

function updateFilterButtonState() {
  const filterBtn = document.getElementById('filterBtn');
  const filterBadge = document.getElementById('filterBadge');
  
  if (!filterBtn || !filterBadge) return;
  
  const activeFilterCount = getActiveFilterCount();
  
  if (activeFilterCount > 0) {
    filterBtn.classList.add('active');
    filterBadge.textContent = activeFilterCount;
  } else {
    filterBtn.classList.remove('active');
    filterBadge.textContent = '';
  }
}

// ============================================
// TABLE SORTING
// ============================================

function sortTable(column) {
  const { sorting } = APP_STATE;
  
  // Determine new direction
  // For 'name': First click asc (A-Z), second desc (Z-A), third reset
  // For 'lastEdit': First click desc (newest first), second asc (oldest first), third reset
  // For other columns: First click desc (highest first), second asc, third reset
  let newDirection;
  const isTextColumn = (column === 'name');
  const startDirection = isTextColumn ? 'asc' : 'desc';
  const secondDirection = isTextColumn ? 'desc' : 'asc';
  
  if (sorting.column !== column) {
    // New column, start with appropriate direction
    newDirection = startDirection;
  } else if (sorting.direction === startDirection) {
    // Was start direction, go to second direction
    newDirection = secondDirection;
  } else if (sorting.direction === secondDirection) {
    // Was second direction, reset
    newDirection = null;
  } else {
    // Was null, go to start direction
    newDirection = startDirection;
  }
  
  // Update state
  if (newDirection === null) {
    APP_STATE.sorting.column = null;
    APP_STATE.sorting.direction = null;
  } else {
    APP_STATE.sorting.column = column;
    APP_STATE.sorting.direction = newDirection;
  }
  
  // Update UI
  updateSortingUI();
  
  // Re-render table
  renderTacticsTable();
}

function updateSortingUI() {
  const { sorting } = APP_STATE;
  
  // Remove active class from all sortable headers
  document.querySelectorAll('.table-header-sortable').forEach(header => {
    header.classList.remove('sort-active', 'sort-asc', 'sort-desc');
  });
  
  // Add active class to current sorted column
  if (sorting.column) {
    const activeHeader = document.querySelector(`.table-header-sortable[data-sort="${sorting.column}"]`);
    if (activeHeader) {
      activeHeader.classList.add('sort-active');
      activeHeader.classList.add(sorting.direction === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  }
}

function getSortedTactics(tactics) {
  const { sorting } = APP_STATE;
  
  if (!sorting.column || !sorting.direction) {
    return tactics;
  }
  
  const sorted = [...tactics].sort((a, b) => {
    let aValue, bValue;
    let isNumeric = true;
    
    switch (sorting.column) {
      case 'name':
        // Alphabetical sorting
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        isNumeric = false;
        break;
      case 'active':
        // Active: true should come first when desc
        aValue = a.active ? 1 : 0;
        bValue = b.active ? 1 : 0;
        break;
      case 'bestPractices':
        aValue = a.bestPracticesCount || 0;
        bValue = b.bestPracticesCount || 0;
        break;
      case 'linkedObjectives':
        aValue = a.linkedObjectivesCount || 0;
        bValue = b.linkedObjectivesCount || 0;
        break;
      case 'lastEdit':
        // Parse date strings like "Mar 28, 2026 23:14"
        aValue = new Date(a.lastEditDate).getTime();
        bValue = new Date(b.lastEditDate).getTime();
        break;
      default:
        return 0;
    }
    
    if (isNumeric) {
      if (sorting.direction === 'desc') {
        return bValue - aValue; // Highest first
      } else {
        return aValue - bValue; // Lowest first
      }
    } else {
      // String comparison
      if (sorting.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
  });
  
  return sorted;
}

function getFilteredTactics() {
  let tactics = APP_STATE.tactics.filter(tactic => {
    // Status filter
    if (APP_STATE.filters.status !== 'all') {
      if (APP_STATE.filters.status === 'active' && !tactic.active) return false;
      if (APP_STATE.filters.status === 'inactive' && tactic.active) return false;
    }
    
    // Publishing filter
    if (APP_STATE.filters.publishing !== 'all') {
      if (APP_STATE.filters.publishing === 'up-to-date' && tactic.status !== 'published') return false;
      if (APP_STATE.filters.publishing === 'modified' && tactic.status !== 'modified') return false;
      if (APP_STATE.filters.publishing === 'draft' && tactic.status !== 'draft') return false;
    }
    
    // Industry filter
    if (APP_STATE.filters.industry !== '') {
      if (!tactic.suggestedIndustry.includes(APP_STATE.filters.industry)) return false;
    }
    
    // Best practices filter
    if (APP_STATE.filters.bestPractices === 'none') {
      if (tactic.bestPracticesCount > 0) return false;
    }
    
    // Linked objectives filter
    if (APP_STATE.filters.linkedObjectives === 'none') {
      if (tactic.linkedObjectivesCount > 0) return false;
    }
    
    return true;
  });
  
  // Apply sorting after filtering
  return getSortedTactics(tactics);
}

function setupFilterListeners() {
  // Filter button
  const filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', openFilterSidepanel);
  }
  
  // Close button
  const closeBtn = document.getElementById('filterSidepanelClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeFilterSidepanel);
  }
  
  // Overlay click
  const overlay = document.getElementById('filterOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeFilterSidepanel);
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('filterCancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeFilterSidepanel);
  }
  
  // Reset button
  const resetBtn = document.getElementById('filterReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }
  
  // Apply button
  const applyBtn = document.getElementById('filterApply');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }
  
  // Listen for changes to update reset button visibility
  document.querySelectorAll('#filterSidepanel input[type="radio"], #filterSidepanel select').forEach(el => {
    el.addEventListener('change', updateResetButtonVisibility);
  });
}

// ============================================
// EDITOR PAGE FUNCTIONS
// ============================================

function initializeEditor() {
  const tactic = getCurrentTactic();
  if (!tactic) {
    window.location.href = 'index.html';
    return;
  }
  
  // Set title - CSS handles truncation based on available space
  const titleEl = document.getElementById('editorTitle');
  if (titleEl) {
    titleEl.textContent = tactic.name;
    titleEl.title = tactic.name; // Tooltip shows full name
  }
  
  // Set badge visibility and style based on status
  updateEditorBadge(tactic.status);
  
  // Set status text (gray text showing current state)
  updateEditorHeaderStatus(tactic.status);
  
  // Update dropdown menu visibility based on status
  updateDropdownMenuState(tactic.status);
  
  // Set active toggle
  const activeToggle = document.getElementById('activeToggleInput');
  if (activeToggle) activeToggle.checked = tactic.active;
  
  // Set textarea content
  const textarea = document.getElementById('editorTextarea');
  if (textarea) {
    textarea.value = tactic.content.replace(/<[^>]*>/g, '').trim();
    APP_STATE.originalContent = textarea.value;
  }
  
  // Set initial state for saving/publishing flow
  updateEditorStatus(tactic.status === 'draft' ? 'created' : 'saved');
  
  // Render best practices
  renderBestPractices();
  
  // Setup event listeners
  setupEditorEventListeners();
}

function updateEditorBadge(status) {
  const badge = document.getElementById('editorBadge');
  if (!badge) return;
  
  // Show badge only for draft or modified
  if (status === 'draft') {
    badge.className = 'badge badge-draft';
    badge.textContent = 'DRAFT';
    badge.style.display = 'inline-flex';
  } else if (status === 'modified') {
    badge.className = 'badge badge-modified';
    badge.textContent = 'MODIFIED';
    badge.style.display = 'inline-flex';
  } else {
    // Published - hide badge
    badge.style.display = 'none';
  }
}

function updateEditorHeaderStatus(status) {
  const statusEl = document.getElementById('editorStatus');
  if (!statusEl) return;
  
  const textEl = statusEl.querySelector('.editor-status-text');
  if (!textEl) return;
  
  // Set status text based on state - from Figma flow
  statusEl.className = 'editor-status';
  
  switch (status) {
    case 'draft':
      textEl.textContent = 'Created';
      statusEl.classList.add('created');
      break;
    case 'modified':
      textEl.textContent = 'Saved (not published)';
      statusEl.classList.add('saved');
      break;
    case 'published':
      textEl.textContent = 'Published';
      statusEl.classList.add('published');
      break;
    default:
      textEl.textContent = 'Saved';
      statusEl.classList.add('saved');
  }
}

function updateDropdownMenuState(status) {
  const draftModifiedMenu = document.getElementById('dropdownMenuDraftModified');
  const publishedMenu = document.getElementById('dropdownMenuPublished');
  
  if (!draftModifiedMenu || !publishedMenu) return;
  
  // Show appropriate dropdown based on status
  if (status === 'published') {
    draftModifiedMenu.classList.add('hidden');
    publishedMenu.classList.remove('hidden');
  } else {
    // draft or modified - show menu with Discard changes
    draftModifiedMenu.classList.remove('hidden');
    publishedMenu.classList.add('hidden');
  }
}

function updateEditorStatus(status) {
  APP_STATE.editorState = status;
  const statusEl = document.getElementById('editorStatus');
  if (!statusEl) return;
  
  const textEl = statusEl.querySelector('.editor-status-text');
  if (!textEl) return;
  
  // Update status text based on save/publish flow per Figma
  statusEl.className = 'editor-status';
  
  switch (status) {
    case 'created':
      textEl.textContent = 'Created';
      statusEl.classList.add('created');
      break;
    case 'saving':
      textEl.textContent = 'Saving...';
      statusEl.classList.add('saving');
      break;
    case 'saved':
      const tactic = getCurrentTactic();
      if (tactic && tactic.status === 'published') {
        textEl.textContent = 'Published';
        statusEl.classList.add('published');
      } else {
        textEl.textContent = 'Saved (not published)';
        statusEl.classList.add('saved');
      }
      break;
    case 'publishing':
      textEl.textContent = 'Publishing...';
      statusEl.classList.add('publishing');
      break;
    case 'published':
      textEl.textContent = 'Published';
      statusEl.classList.add('published');
      break;
  }
}

function renderBestPractices() {
  const container = document.getElementById('bestPracticesContent');
  if (!container) return;
  
  container.innerHTML = BEST_PRACTICES.map((practice, index) => `
    <div class="accordion ${index === 0 ? 'open' : ''}" data-id="${practice.id}">
      <button class="accordion-header" onclick="toggleAccordion(${practice.id})">
        <div class="accordion-header-left">
          <span class="accordion-number">${index + 1}</span>
          <span class="accordion-title">${practice.title}</span>
        </div>
        <svg class="accordion-icon" viewBox="0 0 18 18" fill="none">
          <path d="M4 7l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="accordion-content">
        ${practice.content}
      </div>
    </div>
  `).join('');
}

function toggleAccordion(id) {
  const accordion = document.querySelector(`.accordion[data-id="${id}"]`);
  if (accordion) {
    accordion.classList.toggle('open');
  }
}

let autosaveTimeout = null;

function handleEditorInput() {
  const textarea = document.getElementById('editorTextarea');
  if (!textarea) return;
  
  const currentContent = textarea.value;
  
  if (currentContent !== APP_STATE.originalContent) {
    APP_STATE.hasUnsavedChanges = true;
    updateEditorStatus('saving');
    
    // Clear existing timeout
    if (autosaveTimeout) clearTimeout(autosaveTimeout);
    
    // Simulate autosave after 1 second
    autosaveTimeout = setTimeout(() => {
      const tactic = getCurrentTactic();
      if (tactic) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) + ' ' + now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        // If published, change to modified
        const newStatus = tactic.status === 'published' ? 'modified' : tactic.status;
        
        updateTactic(tactic.id, { 
          content: currentContent,
          status: newStatus,
          lastEditDate: formattedDate
        });
        
        // Update badge if changed to modified
        if (tactic.status === 'published') {
          updateEditorBadge('modified');
          updateDropdownMenuState('modified');
        }
      }
      
      updateEditorStatus('saved');
      APP_STATE.originalContent = currentContent;
      APP_STATE.hasUnsavedChanges = false;
    }, 1000);
  }
}

function handlePublish() {
  const tactic = getCurrentTactic();
  if (!tactic) return;
  
  // If trying to publish a draft that needs activation
  if ((tactic.status === 'draft' || tactic.status === 'modified') && !tactic.active) {
    openModal('publishModal');
    return;
  }
  
  performPublish();
}

function performPublish(activate = false) {
  updateEditorStatus('publishing');
  
  setTimeout(() => {
    const tactic = getCurrentTactic();
    if (tactic) {
      updateTactic(tactic.id, { 
        status: 'published',
        active: activate ? true : tactic.active
      });
      
      // Hide badge (published state has no badge)
      updateEditorBadge('published');
      
      // Update dropdown to published state (no Discard changes option)
      updateDropdownMenuState('published');
      
      if (activate) {
        const activeToggle = document.getElementById('activeToggleInput');
        if (activeToggle) activeToggle.checked = true;
      }
    }
    
    updateEditorStatus('published');
    closeAllModals();
    showSnackbar(activate ? 'Tactic published and activated' : 'Tactic published');
  }, 1500);
}

function handleDiscardChanges() {
  openModal('discardModal');
}

function confirmDiscardChanges() {
  const tactic = getCurrentTactic();
  if (tactic) {
    // Reset content - in real app would fetch from server
    const textarea = document.getElementById('editorTextarea');
    if (textarea) {
      textarea.value = APP_STATE.originalContent;
    }
    
    updateTactic(tactic.id, { 
      status: 'published'
    });
    
    // Update badge (hide it for published)
    updateEditorBadge('published');
    
    // Update dropdown to published state
    updateDropdownMenuState('published');
    
    APP_STATE.hasUnsavedChanges = false;
  }
  
  closeAllModals();
  updateEditorStatus('published');
  showSnackbar('Changes discarded', 'warning');
}

function handleRemoveTactic() {
  openModal('removeModal');
}

// ============================================
// EDIT TACTIC MODAL
// ============================================

function openEditTacticModal() {
  const tactic = getCurrentTactic();
  if (!tactic) return;
  
  // Populate the form fields with current tactic data
  const nameInput = document.getElementById('editTacticName');
  const industriesSelect = document.getElementById('editTacticIndustries');
  const summaryTextarea = document.getElementById('editTacticSummary');
  
  if (nameInput) {
    nameInput.value = tactic.name;
  }
  
  if (industriesSelect) {
    // Set the first industry as selected (for simplicity)
    // In a real app, this would be a multi-select
    industriesSelect.value = tactic.suggestedIndustry[0] || '';
  }
  
  if (summaryTextarea) {
    summaryTextarea.value = tactic.summary || '';
  }
  
  openModal('editTacticModal');
}

function saveEditTacticModal() {
  const tactic = getCurrentTactic();
  if (!tactic) return;
  
  const nameInput = document.getElementById('editTacticName');
  const industriesSelect = document.getElementById('editTacticIndustries');
  const summaryTextarea = document.getElementById('editTacticSummary');
  
  const newName = nameInput ? nameInput.value.trim() : tactic.name;
  const newIndustry = industriesSelect ? industriesSelect.value : tactic.suggestedIndustry[0];
  const newSummary = summaryTextarea ? summaryTextarea.value.trim() : tactic.summary;
  
  // Validation
  if (!newName) {
    showSnackbar('Tactic name is required', 'error');
    return;
  }
  
  // Update the tactic
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  // If published, change to modified since we made changes
  const newStatus = tactic.status === 'published' ? 'modified' : tactic.status;
  
  updateTactic(tactic.id, {
    name: newName,
    suggestedIndustry: [newIndustry, ...tactic.suggestedIndustry.slice(1)],
    summary: newSummary,
    status: newStatus,
    lastEditDate: formattedDate
  });
  
  // Update the UI
  // Update title - CSS handles truncation based on available space
  const titleEl = document.getElementById('editorTitle');
  if (titleEl) {
    titleEl.textContent = newName;
    titleEl.title = newName; // Tooltip shows full name
  }
  
  // Update badge if status changed
  if (tactic.status === 'published') {
    updateEditorBadge('modified');
    updateDropdownMenuState('modified');
    updateEditorStatus('saved');
  }
  
  closeModal('editTacticModal');
  showSnackbar('Tactic updated successfully');
}

// ============================================
// CREATE TACTIC MODAL
// ============================================

function openCreateTacticModal() {
  // Clear all form fields
  const nameInput = document.getElementById('createTacticName');
  const industriesSelect = document.getElementById('createTacticIndustries');
  const summaryTextarea = document.getElementById('createTacticSummary');
  
  if (nameInput) nameInput.value = '';
  if (industriesSelect) industriesSelect.value = '';
  if (summaryTextarea) summaryTextarea.value = '';
  
  openModal('createTacticModal');
}

function saveCreateTacticModal() {
  const nameInput = document.getElementById('createTacticName');
  const industriesSelect = document.getElementById('createTacticIndustries');
  const summaryTextarea = document.getElementById('createTacticSummary');
  
  const name = nameInput ? nameInput.value.trim() : '';
  const industry = industriesSelect ? industriesSelect.value : 'CPG';
  const summary = summaryTextarea ? summaryTextarea.value.trim() : '';
  
  // Validation
  if (!name) {
    showSnackbar('Tactic name is required', 'error');
    return;
  }
  
  // Create new tactic
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  const newTactic = {
    id: Date.now(),
    name: name,
    status: 'draft',
    active: false,
    bestPracticesCount: 0,
    linkedObjectivesCount: 0,
    suggestedIndustry: industry ? [industry] : ['CPG'],
    lastEditBy: 'Karl von Banhoff',
    lastEditDate: formattedDate,
    summary: summary,
    content: ''
  };
  
  APP_STATE.tactics.unshift(newTactic);
  saveTacticsToStorage();
  
  closeModal('createTacticModal');
  showSnackbar('Tactic created successfully');
  
  // Redirect to editor
  setTimeout(() => {
    window.location.href = `editor.html?id=${newTactic.id}`;
  }, 500);
}

function confirmRemoveTactic() {
  const tacticId = APP_STATE.currentTacticId;
  APP_STATE.tactics = APP_STATE.tactics.filter(t => t.id !== tacticId);
  saveTacticsToStorage();
  
  closeAllModals();
  showSnackbar('Tactic removed');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

function handleActiveToggle(checked) {
  const tactic = getCurrentTactic();
  if (!tactic) return;
  
  // If trying to activate a DRAFT only, show modal
  // Modified tactics can be activated without publishing
  if (checked && tactic.status === 'draft') {
    openModal('publishModal');
    // Reset toggle
    const toggle = document.getElementById('activeToggleInput');
    if (toggle) toggle.checked = false;
    return;
  }
  
  updateTactic(tactic.id, { active: checked });
  showSnackbar(checked ? 'Tactic activated' : 'Tactic deactivated');
}

function setupEditorEventListeners() {
  // Editor textarea
  const textarea = document.getElementById('editorTextarea');
  if (textarea) {
    textarea.addEventListener('input', handleEditorInput);
  }
  
  // Publish button
  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) {
    publishBtn.addEventListener('click', handlePublish);
  }
  
  // More dropdown
  const moreBtn = document.getElementById('moreBtn');
  if (moreBtn) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown('moreDropdown');
    });
  }
  
  // Dropdown items
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      closeAllDropdowns();
      
      switch (action) {
        case 'edit':
          // Open the Edit Tactic modal
          openEditTacticModal();
          break;
        case 'duplicate':
          const tactic = getCurrentTactic();
          if (tactic) {
            const newTactic = {
              ...tactic,
              id: Date.now(),
              name: `${tactic.name} (Copy)`,
              status: 'draft',
              active: false,
              lastEditDate: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            };
            APP_STATE.tactics.push(newTactic);
            saveTacticsToStorage();
            showSnackbar('Tactic duplicated');
          }
          break;
        case 'discard':
          handleDiscardChanges();
          break;
        case 'remove':
          handleRemoveTactic();
          break;
      }
    });
  });
  
  // Active toggle
  const activeToggle = document.getElementById('activeToggleInput');
  if (activeToggle) {
    activeToggle.addEventListener('change', (e) => handleActiveToggle(e.target.checked));
  }
  
  // Side panel tabs
  document.querySelectorAll('.side-panel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.side-panel-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // In real app would switch content based on tab.dataset.tab
      if (tab.dataset.tab === 'activity-log') {
        showSnackbar('Activity log coming soon', 'warning');
      }
    });
  });
  
  // Edit settings button (pencil icon)
  const editSettingsBtn = document.getElementById('editSettingsBtn');
  if (editSettingsBtn) {
    editSettingsBtn.addEventListener('click', openEditTacticModal);
  }
  
  // Modal listeners
  setupModalListeners();
}

function setupModalListeners() {
  // Publish modal
  const publishModalCancel = document.getElementById('publishModalCancel');
  const publishModalClose = document.getElementById('publishModalClose');
  const publishModalConfirm = document.getElementById('publishModalConfirm');
  
  if (publishModalCancel) publishModalCancel.addEventListener('click', () => closeModal('publishModal'));
  if (publishModalClose) publishModalClose.addEventListener('click', () => closeModal('publishModal'));
  if (publishModalConfirm) {
    publishModalConfirm.addEventListener('click', () => {
      // Check if we're on table page with pending activation
      if (APP_STATE.pendingActivation) {
        updateTactic(APP_STATE.pendingActivation, { 
          status: 'published',
          active: true 
        });
        renderTacticsTable();
        closeModal('publishModal');
        showSnackbar('Tactic published and activated');
        APP_STATE.pendingActivation = null;
      } else {
        performPublish(true);
      }
    });
  }
  
  // Discard modal
  const discardModalCancel = document.getElementById('discardModalCancel');
  const discardModalClose = document.getElementById('discardModalClose');
  const discardModalConfirm = document.getElementById('discardModalConfirm');
  
  if (discardModalCancel) discardModalCancel.addEventListener('click', () => closeModal('discardModal'));
  if (discardModalClose) discardModalClose.addEventListener('click', () => closeModal('discardModal'));
  if (discardModalConfirm) discardModalConfirm.addEventListener('click', confirmDiscardChanges);
  
  // Remove modal
  const removeModalCancel = document.getElementById('removeModalCancel');
  const removeModalClose = document.getElementById('removeModalClose');
  const removeModalConfirm = document.getElementById('removeModalConfirm');
  
  if (removeModalCancel) removeModalCancel.addEventListener('click', () => closeModal('removeModal'));
  if (removeModalClose) removeModalClose.addEventListener('click', () => closeModal('removeModal'));
  if (removeModalConfirm) removeModalConfirm.addEventListener('click', confirmRemoveTactic);
  
  // Edit Tactic modal
  const editTacticModalCancel = document.getElementById('editTacticModalCancel');
  const editTacticModalClose = document.getElementById('editTacticModalClose');
  const editTacticModalConfirm = document.getElementById('editTacticModalConfirm');
  
  if (editTacticModalCancel) editTacticModalCancel.addEventListener('click', () => closeModal('editTacticModal'));
  if (editTacticModalClose) editTacticModalClose.addEventListener('click', () => closeModal('editTacticModal'));
  if (editTacticModalConfirm) editTacticModalConfirm.addEventListener('click', saveEditTacticModal);
  
  // Create Tactic modal (table page)
  const createTacticModalCancel = document.getElementById('createTacticModalCancel');
  const createTacticModalClose = document.getElementById('createTacticModalClose');
  const createTacticModalConfirm = document.getElementById('createTacticModalConfirm');
  
  if (createTacticModalCancel) createTacticModalCancel.addEventListener('click', () => closeModal('createTacticModal'));
  if (createTacticModalClose) createTacticModalClose.addEventListener('click', () => closeModal('createTacticModal'));
  if (createTacticModalConfirm) createTacticModalConfirm.addEventListener('click', saveCreateTacticModal);
  
  // Create Tactic button (table page)
  const createTacticBtn = document.getElementById('createTacticBtn');
  if (createTacticBtn) {
    createTacticBtn.addEventListener('click', openCreateTacticModal);
  }
  
  // Table Edit Tactic modal
  const tableEditTacticModalCancel = document.getElementById('tableEditTacticModalCancel');
  const tableEditTacticModalClose = document.getElementById('tableEditTacticModalClose');
  const tableEditTacticModalConfirm = document.getElementById('tableEditTacticModalConfirm');
  
  if (tableEditTacticModalCancel) tableEditTacticModalCancel.addEventListener('click', () => closeModal('tableEditTacticModal'));
  if (tableEditTacticModalClose) tableEditTacticModalClose.addEventListener('click', () => closeModal('tableEditTacticModal'));
  if (tableEditTacticModalConfirm) tableEditTacticModalConfirm.addEventListener('click', saveTableEditModal);
  
  // Table Remove modal
  const tableRemoveModalCancel = document.getElementById('tableRemoveModalCancel');
  const tableRemoveModalClose = document.getElementById('tableRemoveModalClose');
  const tableRemoveModalConfirm = document.getElementById('tableRemoveModalConfirm');
  
  if (tableRemoveModalCancel) tableRemoveModalCancel.addEventListener('click', () => closeModal('tableRemoveModal'));
  if (tableRemoveModalClose) tableRemoveModalClose.addEventListener('click', () => closeModal('tableRemoveModal'));
  if (tableRemoveModalConfirm) tableRemoveModalConfirm.addEventListener('click', confirmTableRemove);
  
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

// ============================================
// STICKY HEADER DETECTION
// ============================================

function setupStickyHeader() {
  const contentArea = document.querySelector('.content-area');
  const thead = document.querySelector('.table thead');
  const tableContainer = document.querySelector('.table-container');
  
  if (!thead) return;
  
  // Check which element is scrolling and attach listener accordingly
  const scrollHandler = () => {
    // Check both contentArea and window scroll
    const scrollTop = contentArea ? contentArea.scrollTop : 0;
    const windowScroll = window.scrollY || document.documentElement.scrollTop;
    
    // Also check if table header is at or above its original position
    const tableRect = tableContainer ? tableContainer.getBoundingClientRect() : null;
    const isSticky = tableRect && tableRect.top <= 60; // 60px is page header height
    
    if (scrollTop > 0 || windowScroll > 0 || isSticky) {
      thead.classList.add('is-sticky');
    } else {
      thead.classList.remove('is-sticky');
    }
  };
  
  // Listen on multiple elements
  if (contentArea) {
    contentArea.addEventListener('scroll', scrollHandler);
  }
  window.addEventListener('scroll', scrollHandler, true);
  
  // Initial check
  scrollHandler();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeState();
  
  // Determine which page we're on
  const isEditorPage = window.location.pathname.includes('editor.html');
  
  if (isEditorPage) {
    initializeEditor();
  } else {
    renderTacticsTable();
    setupModalListeners();
    setupFilterListeners();
    setupStickyHeader();
  }
  
  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
  
  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeAllDropdowns();
      // Close filter sidepanel if open
      if (APP_STATE.isFilterPanelOpen) {
        closeFilterSidepanel();
      }
    }
  });
  
  // Nav section toggles
  document.querySelectorAll('.nav-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.nav-section');
      if (section) {
        section.classList.toggle('collapsed');
      }
    });
  });
});
