// Tracks whether the custom cursor has been unlocked
let milkCursorUnlocked = false;

function changeBackground(div) {
  // Keep all current animation logic
  div.classList.add('hovered');

  setTimeout(() => {
    div.classList.add('scaled');
  }, 500);

  setTimeout(() => {
    div.classList.remove('scaled');
    div.classList.add('show-full');
  }, 1000);

  // Unlock the custom cursor globally, only on homepage
  if (!milkCursorUnlocked && document.body.id === "home") {
    milkCursorUnlocked = true;
    document.body.classList.add('milk-cursor');
  }
}

function remainFull(div) {
  // Keep the full milk image visible
  div.classList.add('show-full');

  // Unlock cursor if not already unlocked
  if (!milkCursorUnlocked && document.body.id === "home") {
    milkCursorUnlocked = true;
    document.body.classList.add('milk-cursor');
  }
}

// Ensure that once unlocked, hovering anywhere in #home keeps the custom cursor
document.body.addEventListener('mouseover', (e) => {
  if (milkCursorUnlocked && document.body.id === "home") {
    document.body.classList.add('milk-cursor');
  }
});
