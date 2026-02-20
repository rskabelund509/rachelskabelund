// Simple password protection
// Password: gocougs

(function() {
    const CORRECT_PASSWORD = 'gocougs';
    const STORAGE_KEY = 'site_authenticated';
    
    // Check if already authenticated
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        window.dispatchEvent(new CustomEvent('auth-complete'));
        return; // Already authenticated, don't show gate
    }
    
    // Wait for DOM to be ready
    function init() {
        // Create password gate
        const gate = document.createElement('div');
        gate.id = 'password-gate';
        gate.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #002E5D;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                ">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Brigham_Young_University_medallion.svg/1200px-Brigham_Young_University_medallion.svg.png" 
                         alt="BYU Logo" 
                         style="height: 60px; margin-bottom: 1.5rem;">
                    <h2 style="color: #002E5D; margin-bottom: 0.5rem; font-size: 1.5rem;">Welcome</h2>
                    <p style="color: #666; margin-bottom: 1.5rem; font-size: 0.95rem;">Please enter the password to continue</p>
                    <input type="password" 
                           id="gate-password" 
                           placeholder="Enter password"
                           style="
                               width: 100%;
                               padding: 0.875rem 1rem;
                               border: 2px solid #e0e0e0;
                               border-radius: 8px;
                               font-size: 1rem;
                               margin-bottom: 1rem;
                               outline: none;
                           "
                    >
                    <button id="gate-submit"
                            style="
                                width: 100%;
                                padding: 0.875rem;
                                background: #002E5D;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                font-size: 1rem;
                                font-weight: 500;
                                cursor: pointer;
                            "
                    >
                        Enter
                    </button>
                    <p id="gate-error" style="color: #c00; margin-top: 1rem; font-size: 0.9rem; display: none;">
                        Incorrect password. Please try again.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(gate);
        
        // Hide everything else
        Array.from(document.body.children).forEach(child => {
            if (child.id !== 'password-gate') {
                child.style.display = 'none';
            }
        });
        
        const passwordInput = document.getElementById('gate-password');
        const submitBtn = document.getElementById('gate-submit');
        const errorMsg = document.getElementById('gate-error');
        
        function checkPassword() {
            const entered = passwordInput.value.toLowerCase().trim();
            if (entered === CORRECT_PASSWORD) {
                sessionStorage.setItem(STORAGE_KEY, 'true');
                gate.remove();
                // Show everything again
                Array.from(document.body.children).forEach(child => {
                    child.style.display = '';
                });
                // Signal that auth is complete
                window.dispatchEvent(new CustomEvent('auth-complete'));
            } else {
                errorMsg.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
        
        submitBtn.addEventListener('click', checkPassword);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Focus input
        setTimeout(() => passwordInput.focus(), 100);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
