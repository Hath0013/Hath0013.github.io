<script>
document.addEventListener('DOMContentLoaded', function () {
  // breakpoint where layout switches (match your CSS)
  const BREAKPOINT = 1500;

  // Helper: all tab triggers (both vertical and horizontal)
  const tabTriggers = Array.from(document.querySelectorAll('[data-bs-toggle="tab"], [data-toggle="tab"]'));

  // Return 'target' string (e.g. "#tab1") for a trigger element
  function getTargetSelector(trigger) {
    return trigger.getAttribute('data-bs-target') ||
           trigger.getAttribute('href') ||
           trigger.getAttribute('data-target') || null;
  }

  // Activate a trigger using Bootstrap API when available, otherwise set classes manually
  function activateTrigger(trigger) {
    if (!trigger) return;
    // If it's already active, nothing to do
    if (trigger.classList.contains('active')) return;

    try {
      // Bootstrap 5/4 JS API
      if (window.bootstrap && typeof window.bootstrap.Tab === 'function') {
        const bsTab = new window.bootstrap.Tab(trigger);
        bsTab.show();
      } else if (typeof jQuery !== 'undefined' && typeof jQuery(trigger).tab === 'function') {
        // jQuery + Bootstrap 4
        jQuery(trigger).tab('show');
      } else {
        // Manual fallback: set active classes
        // Remove active/show from siblings
        const group = trigger.closest('[role="tablist"]') || trigger.parentElement;
        if (group) {
          Array.from(group.querySelectorAll('.nav-link.active')).forEach(a => {
            a.classList.remove('active', 'show');
          });
        }
        trigger.classList.add('active', 'show');

        // Show corresponding pane if referenced by id
        const sel = getTargetSelector(trigger);
        if (sel && sel.startsWith('#')) {
          document.querySelectorAll('.tab-pane.show.active').forEach(p => p.classList.remove('show', 'active'));
          const pane = document.querySelector(sel);
          if (pane) pane.classList.add('show', 'active');
        }
      }
    } catch (e) {
      console.warn('activateTrigger error', e);
    }
  }

  // When any tab is shown, sync all triggers with same target
  function onTabShown(e) {
    // e.target is the triggered element in Bootstrap events; fallback for manual
    const trigger = e.target || e.currentTarget;
    const sel = getTargetSelector(trigger);
    if (!sel) return;

    // Find all triggers that reference the same pane
    const matches = tabTriggers.filter(t => getTargetSelector(t) === sel);

    matches.forEach(t => {
      // avoid re-activating the same trigger which would re-fire events
      if (!t.classList.contains('active')) {
        activateTrigger(t);
      }
    });
  }

  // Attach event listeners
  tabTriggers.forEach(t => {
    // Bootstrap emits 'shown.bs.tab' on the element that was shown.
    t.addEventListener('shown.bs.tab', onTabShown);

    // jQuery fallback
    if (typeof jQuery !== 'undefined') {
      jQuery(t).on('shown.bs.tab', function (evt) {
        onTabShown(evt);
      });
    }
  });

  // ALSO: Listen for click (or keyboard activation) and immediately sync
  // This helps in case the other tab set is visible before the 'shown' event fires
  tabTriggers.forEach(t => {
    t.addEventListener('click', function (evt) {
      // small delay so Bootstrap's activation can start; still we proactively sync
      setTimeout(() => {
        const sel = getTargetSelector(t);
        if (!sel) return;
        tabTriggers.forEach(other => {
          if (getTargetSelector(other) === sel && !other.classList.contains('active')) {
            activateTrigger(other);
          }
        });
      }, 10);
    });
  });

  // On resize: when crossing the breakpoint, copy the active tab from whichever set currently has it
  let lastIsSmall = window.innerWidth <= BREAKPOINT;

  function syncActiveOnResize() {
    const isSmall = window.innerWidth <= BREAKPOINT;
    if (isSmall === lastIsSmall) return; // only act when crossing
    lastIsSmall = isSmall;

    // find any active trigger (prefer visible one)
    // visible = offsetParent not null (simplest)
    const visibleActive = tabTriggers.find(t => t.classList.contains('active') && t.offsetParent !== null);
    let source = visibleActive || tabTriggers.find(t => t.classList.contains('active'));

    if (!source) return;

    const sel = getTargetSelector(source);
    if (!sel) return;

    // Activate all triggers with same selector (so the visible controls match)
    tabTriggers.forEach(t => {
      if (getTargetSelector(t) === sel && !t.classList.contains('active')) {
        activateTrigger(t);
      }
    });

    // Optionally, scroll to content top after switching layout
    // const content = document.getElementById('project-content') || document.querySelector('.right-column') || document.getElementById('myTabContent');
    // if (content) { window.scrollTo({ top: content.offsetTop - 90, behavior:'smooth' }); }
  }

  // Throttle resize handler lightly
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncActiveOnResize, 120);
  });

  // Initial sync (in case server-rendered state has mismatch)
  (function initialSync() {
    // If any active triggers exist, ensure their matches are activated too
    const active = tabTriggers.filter(t => t.classList.contains('active'));
    active.forEach(t => {
      const sel = getTargetSelector(t);
      tabTriggers.forEach(other => {
        if (getTargetSelector(other) === sel && !other.classList.contains('active')) {
          activateTrigger(other);
        }
      });
    });
  })();

});
</script>
