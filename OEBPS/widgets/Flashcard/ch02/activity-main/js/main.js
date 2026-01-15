var activeDialog = null;
var lastFocusedElement = null;
var ignoreFocusChanges = false;

function trapFocusHandler(event) {
    if (ignoreFocusChanges || !activeDialog) return;

    if (activeDialog.contains(event.target)) {
        lastFocusedElement = event.target;
    } else {
        ignoreFocusChanges = true;

        if (!focusFirstDescendant(activeDialog)) {
            activeDialog.focus();
        }

        if (document.activeElement === lastFocusedElement) {
            focusLastDescendant(activeDialog);
        }

        lastFocusedElement = document.activeElement;
        ignoreFocusChanges = false;
    }
}

function focusFirstDescendant(element) {
    for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];

        if (child.nodeType !== 1) continue; // ELEMENT_NODE only

        if (attemptFocus(child) || focusFirstDescendant(child)) {
            return true;
        }
    }
    return false;
}

function focusLastDescendant(element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
        var child = element.childNodes[i];

        if (child.nodeType !== 1) continue;

        if (attemptFocus(child) || focusLastDescendant(child)) {
            return true;
        }
    }
    return false;
}

function attemptFocus(element) {
    if (!isFocusable(element)) return false;

    try {
        element.focus();
    } catch (e) {}

    return document.activeElement === element;
}

function isFocusable(element) {
    if (!element || element.disabled) return false;

    var tag = element.tagName;
    var focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    if (focusableTags.indexOf(tag) !== -1) return true;

    var tabindex = element.getAttribute('tabindex');
    return tabindex !== null && tabindex !== '-1';
}

function getTabbableElements(container) {
    return jqnc(container).find(
        'a[href], button:not([disabled]), textarea, input, select,' +
        '[tabindex]:not([tabindex="-1"])'
    ).filter(':visible');
}


function trapTabKey(event) {
    if (!activeDialog || event.key !== 'Tab') return;

    var tabbables = getTabbableElements(activeDialog);
    if (!tabbables.length) {
        event.preventDefault();
        return;
    }

    var first = tabbables[0];
    var last  = tabbables[tabbables.length - 1];

    if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
    } else {
        // Tab
        if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
}

function onCommentClicked() {
    activeDialog = document.querySelector('.dialog');
    lastFocusedElement = document.activeElement;

    jqnc('.modalbg')
        .addClass('modalbgAnimate')
        .attr('aria-hidden', 'false');

    jqnc('.openModal').css('pointer-events', 'auto');
    jqnc('.interactive-wrapper').attr('aria-hidden', 'true');

    document.addEventListener('focus', trapFocusHandler, true);
    document.addEventListener('keydown', trapTabKey, true);

    //Explicit focus target
    setTimeout(function () {
        jqnc('#dialogClose').focus();
    }, 300);
}



function onCommentCloseClicked() {
    document.removeEventListener('focus', trapFocusHandler, true);
    document.removeEventListener('keydown', trapTabKey, true);

    jqnc('.modalbg')
        .removeClass('modalbgAnimate')
        .attr('aria-hidden', 'true');

    jqnc('.openModal').css('pointer-events', 'none');
    jqnc('.interactive-wrapper').removeAttr('aria-hidden');

    activeDialog = null;

    setTimeout(function () {
        jqnc('.commentButton').focus();
    }, 300);
}


jqnc(document).on('keydown', function (e) {
    if (e.key === 'Escape' && activeDialog) {
        onCommentCloseClicked();
        e.stopPropagation();
    }
});

jqnc(document).ready(function () {
    jqnc('.commentButton').on('click', onCommentClicked);
    jqnc('.close').on('click', onCommentCloseClicked);
});
