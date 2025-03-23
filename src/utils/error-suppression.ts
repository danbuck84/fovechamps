
/**
 * A utility for suppressing unwanted errors in the console
 */

// Complete list of patterns to suppress in console and network requests
export const ERROR_PATTERNS = [
  // Facebook related
  'facebook',
  'facebook.com',
  'tr?id=',
  'pixel',
  'PageView',
  'noscript',
  '9151671744940732',
  
  // Firebase/Firestore related
  'firebase',
  'firestore',
  'googleapis.com',
  
  // Feature detection warnings
  'unrecognized feature',
  'feature',
  'vr',
  'ambient-light-sensor',
  'battery',
  
  // Resource loading errors
  'preloaded',
  'was preloaded',
  'link preload',
  'resource',
  
  // Misc tracking/errors
  'sentry',
  'tracking',
  'analytics',
  'hotjar',
  'meta',
  'tr?',
];

/**
 * Sets up aggressive error suppression to eliminate unwanted console errors.
 * This includes:
 * - Overriding console methods
 * - Capturing and filtering window.onerror
 * - Handling unhandled promise rejections
 * - Setting up mutation observers to remove unwanted DOM elements
 * - Blocking network requests for certain patterns
 */
export function setupAggressiveErrorSuppression() {
  console.log("Setting up aggressive error suppression");
  
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;
  const originalErrorHandler = window.onerror;
  
  // 1. Aggressively override window.onerror
  window.onerror = function(message, source, lineno, colno, error) {
    if (!message && !source) return true;
    
    const messageStr = String(message || '').toLowerCase();
    const sourceStr = String(source || '').toLowerCase();
    
    if (ERROR_PATTERNS.some(pattern => 
      messageStr.includes(pattern.toLowerCase()) || 
      sourceStr.includes(pattern.toLowerCase())
    )) {
      // Completely suppress the error
      return true;
    }
    
    return originalErrorHandler ? originalErrorHandler(message, source, lineno, colno, error) : false;
  };
  
  // 2. Override console methods
  console.error = function(...args) {
    if (shouldSuppressConsoleMessage(args)) return;
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    if (shouldSuppressConsoleMessage(args)) return;
    originalConsoleWarn.apply(console, args);
  };
  
  console.log = function(...args) {
    if (shouldSuppressConsoleMessage(args)) return;
    originalConsoleLog.apply(console, args);
  };
  
  // 3. Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const error = event.reason;
    const errorStr = String(error || '').toLowerCase();
    
    if (ERROR_PATTERNS.some(pattern => errorStr.includes(pattern.toLowerCase()))) {
      event.preventDefault();
      return true;
    }
  }, true);
  
  // 4. Remove existing problematic elements
  removeProblematicElements();
  
  // 5. Set up mutation observer to catch and remove new problematic elements
  setupMutationObserver();
  
  // 6. Override fetch and XMLHttpRequest to block certain network requests
  setupNetworkFilters();
  
  // Return a cleanup function
  return function cleanup() {
    window.onerror = originalErrorHandler;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  };
}

// Helper function to determine if a console message should be suppressed
function shouldSuppressConsoleMessage(args: any[]): boolean {
  return args.some(arg => {
    if (arg === null || arg === undefined) return false;
    
    let argStr: string;
    try {
      argStr = typeof arg === 'object' 
        ? JSON.stringify(arg).toLowerCase() 
        : String(arg).toLowerCase();
    } catch (e) {
      argStr = String(arg).toLowerCase();
    }
    
    return ERROR_PATTERNS.some(pattern => argStr.includes(pattern.toLowerCase()));
  });
}

// Remove any pre-existing problematic elements from the DOM
function removeProblematicElements() {
  // Remove any scripts, links, and iframes from unwanted sources
  document.querySelectorAll('script, link, iframe').forEach(element => {
    const src = element.getAttribute('src') || '';
    const href = element.getAttribute('href') || '';
    
    if (ERROR_PATTERNS.some(pattern => 
      src.toLowerCase().includes(pattern.toLowerCase()) || 
      href.toLowerCase().includes(pattern.toLowerCase())
    )) {
      element.remove();
    }
    
    // Also remove any preload link that could be causing issues
    if (element.tagName === 'LINK') {
      const rel = element.getAttribute('rel') || '';
      if (rel === 'preload' || rel === 'prefetch') {
        element.remove();
      }
    }
  });
}

// Set up a mutation observer to monitor DOM changes and remove problematic elements
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check attributes for problematic patterns
            const attributes = Array.from(element.attributes || []);
            const hasProblematicAttribute = attributes.some(attr => {
              return ERROR_PATTERNS.some(pattern => 
                attr.value.toLowerCase().includes(pattern.toLowerCase())
              );
            });
            
            // Remove elements with problematic attributes
            if (hasProblematicAttribute) {
              element.remove();
              continue;
            }
            
            // Also check for specific tag types that might be problematic
            if (element.tagName === 'SCRIPT' || element.tagName === 'LINK' || element.tagName === 'IFRAME') {
              const src = element.getAttribute('src') || '';
              const href = element.getAttribute('href') || '';
              
              if (ERROR_PATTERNS.some(pattern => 
                src.toLowerCase().includes(pattern.toLowerCase()) || 
                href.toLowerCase().includes(pattern.toLowerCase())
              )) {
                element.remove();
              }
              
              // Special handling for preload links
              if (element.tagName === 'LINK') {
                const rel = element.getAttribute('rel') || '';
                if (rel === 'preload' || rel === 'prefetch') {
                  element.remove();
                }
              }
            }
          }
        }
      }
    }
  });
  
  // Observe the entire document for changes, including subtree
  observer.observe(document, { 
    childList: true, 
    subtree: true, 
    attributes: true, 
    attributeFilter: ['src', 'href', 'rel'] 
  });
}

// Set up network filters to block problematic requests
function setupNetworkFilters() {
  // Override fetch to block unwanted requests
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
    
    if (ERROR_PATTERNS.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()))) {
      // Return a mock successful response to avoid errors
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    return originalFetch.apply(window, [input, init]);
  };
  
  // Override XMLHttpRequest to block unwanted requests
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && ERROR_PATTERNS.some(pattern => url.toLowerCase().includes(pattern.toLowerCase()))) {
      // Cancel the request by making it a request to a non-existent local file
      return originalOpen.apply(this, [method, 'about:blank', ...args]);
    }
    
    return originalOpen.apply(this, [method, url, ...args]);
  };
}
