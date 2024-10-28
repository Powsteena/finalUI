// Create a function to handle the confirmation dialog
const createRideConfirmationDialog = () => {
  // Create backdrop with blur effect
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  
  // Create dialog container
  const dialogOverlay = document.createElement('div');
  dialogOverlay.className = 'modal-overlay';
  
  // Create dialog content
  const dialogContent = document.createElement('div');
  dialogContent.className = 'modal-content';
  
  // Add styles with proper z-indexing and blur effects
  const styles = `
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9999;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      max-width: 28rem;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: modalFadeIn 0.3s ease-out;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .grid-layout {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .section-card {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .section-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #111827;
      margin-bottom: 0.75rem;
    }

    .label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .value {
      color: #111827;
      font-size: 0.875rem;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .capitalize {
      text-transform: capitalize;
    }
  `;

  // Add styles to document
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create handleEscapeKey function in the outer scope
  let handleEscapeKey = null;

  const showConfirmationDialog = ({ 
    pickup, 
    dropoff, 
    vehicleType, 
    numPassengers, 
    onConfirm,
    onCancel 
  }) => {
    // Retrieve user details from localStorage
    const storedUserDetails = localStorage.getItem('userDetails');
    const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;

    // Disable page scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    dialogContent.innerHTML = `
      <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Confirm Your Ride Details</h2>
      
      <div class="section-card">
        <h3 class="section-title">Ride Information</h3>
        <div class="grid-layout">
          <span class="label">Pick-up:</span>
          <span class="value">${formatAddress(pickup)}</span>
          
          <span class="label">Drop-off:</span>
          <span class="value">${formatAddress(dropoff)}</span>
          
          <span class="label">Vehicle Type:</span>
          <span class="value capitalize">${vehicleType}</span>
          
          <span class="label">Passengers:</span>
          <span class="value">${numPassengers}</span>
        </div>
      </div>

      ${userDetails ? `
        <div class="section-card">
          <h3 class="section-title">Passenger Details</h3>
          <div class="grid-layout">
            <span class="label">Name:</span>
            <span class="value">${userDetails.name}</span>
            
            <span class="label">Phone:</span>
            <span class="value">${userDetails.phone}</span>
          </div>
        </div>
      ` : ''}

      <div class="button-group">
        <button class="btn btn-secondary" id="cancelRideBtn">Cancel</button>
        <button class="btn btn-primary" id="confirmRideBtn">Confirm Ride</button>
      </div>
    `;

    // Add event listeners
    const confirmBtn = dialogContent.querySelector('#confirmRideBtn');
    const cancelBtn = dialogContent.querySelector('#cancelRideBtn');
    
    confirmBtn.addEventListener('click', () => {
      onConfirm();
      closeDialog();
    });
    
    cancelBtn.addEventListener('click', () => {
      onCancel?.();
      closeDialog();
    });

    // Add backdrop click handler to close dialog
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        onCancel?.();
        closeDialog();
      }
    });

    // Define handleEscapeKey function
    handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
        closeDialog();
      }
    };
    
    // Add escape key handler
    document.addEventListener('keydown', handleEscapeKey);

    // Add elements to page
    dialogOverlay.appendChild(dialogContent);
    document.body.appendChild(backdrop);
    document.body.appendChild(dialogOverlay);

    // Focus trap
    confirmBtn.focus();
  };

  const closeDialog = () => {
    // Re-enable page scrolling
    document.body.style.overflow = '';
    
    // Remove dialog elements
    if (document.body.contains(backdrop)) {
      document.body.removeChild(backdrop);
    }
    if (document.body.contains(dialogOverlay)) {
      document.body.removeChild(dialogOverlay);
    }

    // Remove escape key handler if it exists
    if (handleEscapeKey) {
      document.removeEventListener('keydown', handleEscapeKey);
      handleEscapeKey = null;
    }
  };

  const formatAddress = (address) => {
    return address.length > 50 ? `${address.substring(0, 47)}...` : address;
  };

  return { showConfirmationDialog, closeDialog };
};

// Export the function
export { createRideConfirmationDialog };
