(function(app) {
    // 1. Make the array public so you can access it via oWidgets.finalActivityArr
    app.finalActivityArr = [];

    function createActivity() {
        // 2. Select only relevant elements (Massive performance gain)
        const elements = document.querySelectorAll('[class^="w-"], [class*=" w-"]');

        elements.forEach(el => {
            // 3. Extract the class that starts with 'w-'
            const widgetClass = Array.from(el.classList).find(cls => cls.startsWith('w-'));
            
            if (widgetClass) {
                const className = widgetClass.split('w-')[1];
                
                // 4. Look for the constructor (e.g., window.StepSlider)
                const WidgetConstructor = window[className];
                
                if (typeof WidgetConstructor === 'function') {
                    // 5. Initialize and store in the public array
                    const oActivity = new WidgetConstructor(jqnc(el));
                    app.finalActivityArr.push(oActivity);
                } else {
                    //console.warn(`Widget class "${className}" not found in window.`);
                }
            }
        });
    }

    // 6. Use the fastest ready event
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createActivity);
    } else {
        createActivity(); // DOM already loaded
    }

})(window.oWidgets = window.oWidgets || {});
